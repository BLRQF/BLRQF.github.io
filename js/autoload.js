// 定义全局配置（允许外部覆盖）
const LIVE2D_CONFIG = window.LIVE2D_CONFIG || {
  cdnPath: "https://cdn.jsdelivr.net/gh/dogyyds/live2d-widget-v3@main", // CDN路径（可根据实际情况修改）
  minWidth: 768, // 最小加载宽度（桌面端阈值）
  enableTools: [
    "hitokoto", "asteroids", "express", "photo", "quit"
  ]
};

let live2dResources = []; // 记录动态添加的资源标签，用于清理
let resizeHandler = null; // 记录resize事件句柄，用于清理

function initLive2D() {
  try {
    // 1. 原生方法获取窗口宽度（移除jQuery依赖）
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    if (windowWidth <= LIVE2D_CONFIG.minWidth) return;

    // 2. 动态加载资源（支持错误捕获+清理）
    const { cdnPath } = LIVE2D_CONFIG;
    const resourceList = [
      { url: '/live2D/waifu.css', type: "css", async: true },
      { url: `${cdnPath}/live2dcubismcore.js`, type: "js", async: false, defer: true }, // 核心库，按顺序加载
      { url: `${cdnPath}/live2d-sdk.js`, type: "js", async: false, defer: true }, // SDK依赖core，用defer保证顺序
      { url: `${cdnPath}/waifu-tips.js`, type: "js", async: false, defer: true } // 提示脚本依赖SDK，按顺序加载
    ];

    // 加载单个资源（增强错误处理+记录标签+超时控制）
    function loadResource({ url, type, async, defer }) {
      return new Promise((resolve, reject) => {
        const element = type === "css"
          ? document.createElement("link")
          : document.createElement("script");

        // 通用属性设置
        if (type === "css") {
          element.rel = "stylesheet";
          element.href = url;
        } else {
          element.src = url;
          element.async = async; // 关闭异步（保证defer顺序）
          element.defer = defer; // 延迟执行（按顺序）
        }
        element.crossOrigin = "anonymous"; // 解决CDN跨域问题

        // 记录标签用于清理
        live2dResources.push(element);

        // 加载回调（含超时控制）
        const timeoutId = setTimeout(() => {
          element.remove(); // 超时后移除标签
          reject({ url, status: "timeout" });
        }, 10000); // 10秒超时

        element.onload = () => {
          clearTimeout(timeoutId);
          resolve({ url, status: "success" });
        };
        element.onerror = () => {
          clearTimeout(timeoutId);
          reject({ url, status: "error" });
        };

        document.head.appendChild(element);
      });
    }

    // 串行加载资源（保证严格顺序）
    (async () => {
      for (const resource of resourceList) {
        try {
          await loadResource(resource);
        } catch (err) {
          console.warn(`[Live2D] 资源 ${err.url} 加载失败: ${err.status}`);
          showUserTipSafe("Live2D组件部分功能异常，请刷新页面或联系管理员");
          // 关键资源失败时终止加载
          if (resource.type === "js" && !resource.url.includes("waifu-tips")) {
            throw new Error(`关键资源 ${resource.url} 加载失败`);
          }
        }
      }

      // 所有资源加载完成后初始化
      if (window.initWidget) {
        window.initWidget({
          homePath: "/",
          waifuPath: `${cdnPath}/waifu-tips.json`,
          cdnPath: '/live2D/',
          tools: LIVE2D_CONFIG.enableTools,
          dragEnable: true,
          dragDirection: ["x", "y"],
          switchType: "order"
        });
      } else {
        throw new Error("initWidget未定义（可能SDK加载失败）");
      }
    })()
      .catch(err => {
        console.error("[Live2D] 初始化失败:", err);
        showUserTipSafe("Live2D组件加载失败，请刷新页面或联系管理员");
        cleanupLive2D(); // 加载失败时清理资源
      });

    // 3. 监听窗口大小变化，动态卸载组件（增加事件清理）
    resizeHandler = () => {
      const currentWidth = window.innerWidth;
      if (currentWidth <= LIVE2D_CONFIG.minWidth && window.waifu?.destroy) {
        window.waifu.destroy(); // 安全调用（检查destroy方法是否存在）
        cleanupLive2D(); // 清理资源标签
      }
    };
    window.addEventListener("resize", resizeHandler);

  } catch (err) {
    console.error("[Live2D] 运行时错误:", err);
    showUserTipSafe("Live2D组件发生异常，请刷新页面");
    cleanupLive2D();
  }
}

// 安全显示用户提示（避免函数未定义）
function showUserTipSafe(msg) {
  if (typeof showUserTip === "function") {
    showUserTip(msg);
    return;
  }
  // 备用提示方案：控制台输出+简单DOM提示
  console.warn(msg);
  const tipDiv = document.createElement("div");
  tipDiv.style.cssText = `
    position: fixed; 
    bottom: 20px; 
    left: 50%; 
    transform: translateX(-50%);
    padding: 12px 24px;
    background: #ff4444;
    color: white;
    border-radius: 8px;
    z-index: 1000;
  `;
  tipDiv.textContent = msg;
  document.body.appendChild(tipDiv);
  setTimeout(() => tipDiv.remove(), 5000);
}

// 辅助函数：清理动态添加的资源及事件
function cleanupLive2D() {
  // 清理资源标签
  live2dResources.forEach(element => {
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
  });
  live2dResources = [];

  // 清理resize事件监听
  if (resizeHandler) {
    window.removeEventListener("resize", resizeHandler);
    resizeHandler = null;
  }
}

// 执行初始化（页面加载完成后）
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initLive2D);
} else {
  initLive2D();
}
