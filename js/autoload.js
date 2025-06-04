// 定义全局配置（允许外部覆盖）
const LIVE2D_CONFIG = window.LIVE2D_CONFIG || {
  cdnPath: "https://cdn.jsdelivr.net/gh/dogyyds/live2d-widget-v3@main",
  minWidth: 768, // 最小加载宽度（桌面端阈值）
  enableTools: [
    "hitokoto", "asteroids", "express", "photo", "quit"
  ]
};

let live2dResources = []; // 记录动态添加的资源标签，用于清理

function initLive2D() {
  try {
    // 1. 原生方法获取窗口宽度（移除jQuery依赖）
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    if (windowWidth <= LIVE2D_CONFIG.minWidth) return;

    // 2. 动态加载资源（支持错误捕获+清理）
    const { cdnPath } = LIVE2D_CONFIG;
    const resourceList = [
      { url: `${cdnPath}/waifu.css`, type: "css", async: true },
      { url: `${cdnPath}/Core/live2dcubismcore.js`, type: "js", async: true },
      { url: `${cdnPath}/live2d-sdk.js`, type: "js", async: true, defer: true }, // sdk依赖core，用defer按顺序执行
      { url: `${cdnPath}/waifu-tips.js`, type: "js", async: true }
    ];

    // 加载单个资源（增强错误处理+记录标签）
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
          element.async = async; // 异步加载JS
          element.defer = defer; // 延迟执行（按顺序）
        }
        element.crossOrigin = "anonymous"; // 解决CDN跨域问题

        // 记录标签用于清理
        live2dResources.push(element);

        // 加载回调
        element.onload = () => resolve({ url, status: "success" });
        element.onerror = () => reject({ url, status: "error" });

        document.head.appendChild(element);
      });
    }

    // 并行加载资源（允许部分失败）
    Promise.allSettled(resourceList.map(loadResource))
      .then(results => {
        // 打印失败资源
        const failed = results.filter(r => r.status === "rejected");
        if (failed.length > 0) {
          console.warn("[Live2D] 部分资源加载失败:", failed.map(r => r.reason.url));
          showUserTip("Live2D组件部分功能异常，请刷新页面或联系管理员");
        }

        // 所有资源加载完成后初始化
        if (window.initWidget) {
          initWidget({
            homePath: "/",
            waifuPath: `${cdnPath}/waifu-tips.json`,
            cdnPath: `${cdnPath}/Resources/`,
            tools: LIVE2D_CONFIG.enableTools,
            dragEnable: true,
            dragDirection: ["x", "y"],
            switchType: "order"
          });
        } else {
          throw new Error("initWidget未定义（可能SDK加载失败）");
        }
      })
      .catch(err => {
        console.error("[Live2D] 初始化失败:", err);
        showUserTip("Live2D组件加载失败，请刷新页面或联系管理员");
        cleanupLive2D(); // 加载失败时清理资源
      });

    // 3. 监听窗口大小变化，动态卸载组件
    window.addEventListener("resize", () => {
      const currentWidth = window.innerWidth;
      if (currentWidth <= LIVE2D_CONFIG.minWidth && window.waifu) {
        window.waifu.destroy(); // 假设组件提供destroy方法
        cleanupLive2D(); // 清理资源标签
      }
    });

  } catch (err) {
    console.error("[Live2D] 运行时错误:", err);
    showUserTip("Live2D组件发生异常，请刷新页面");
    cleanupLive2D();
  }
}

// 辅助函数：显示用户友好提示
function showUserTip(msg) {
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
  setTimeout(() => tipDiv.remove(), 5000); // 5秒后自动消失
}

// 辅助函数：清理动态添加的资源
function cleanupLive2D() {
  live2dResources.forEach(element => {
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
  });
  live2dResources = [];
}

// 执行初始化（页面加载完成后）
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initLive2D);
} else {
  initLive2D();
}