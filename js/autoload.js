try {
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;
  if (windowWidth > 768) {
    const cdnPath = "/live2D";
    const config = {
      // 资源路径
      path: {
        homePath: "/",
        modelPath: cdnPath + "/",
        cssPath: cdnPath + "/waifu.css",
        // cssPath: "/css/live2d/waifu.css",
        tipsJsonPath: cdnPath + "/waifu-tips.json",
        // tipsJsonPath: "/js/live2d/waifu-tips.json",
        tipsJsPath: cdnPath + "/waifu-tips.js",
        live2dCorePath: cdnPath + "/live2dcubismcore.js",
        live2dSdkPath: cdnPath + "/live2d-sdk.js",
      },
      // 工具栏
      tools: [
        "hitokoto",
        "asteroids",
        "express",
        // "switch-model",
        // "switch-texture",
        "photo",
        // "info",
        "quit",
      ],
      // 模型拖拽
      drag: {
        enable: true,
        direction: ["x", "y"],
      },
      // 模型切换 (order: 顺序切换，random: 随机切换)
      switchType: "order",
    };

    // 异步加载资源函数
    function loadExternalResource(url, type) {
      return new Promise((resolve, reject) => {
        let tag;
        if (type === "css") {
          tag = document.createElement("link");
          tag.rel = "stylesheet";
          tag.href = url;
        } else if (type === "js") {
          tag = document.createElement("script");
          tag.src = url;
        }
        if (tag) {
          tag.onload = () => resolve(url);
          tag.onerror = () => reject(url);
          document.head.appendChild(tag);
        }
      });
    }

    // 加载资源并初始化
    Promise.all([
      loadExternalResource(config.path.cssPath, "css"),
      loadExternalResource(config.path.live2dCorePath, "js"),
      loadExternalResource(config.path.live2dSdkPath, "js"),
      loadExternalResource(config.path.tipsJsPath, "js"),
    ]).then(() => {
      initWidget({
        homePath: config.path.homePath,
        waifuPath: config.path.tipsJsonPath,
        cdnPath: config.path.modelPath,
        tools: config.tools,
        dragEnable: config.drag.enable,
        dragDirection: config.drag.direction,
        switchType: config.switchType,
      });
    });
  }
} catch (err) {
  console.log("[Error] Failed to load Live2D widget: " + err);
}
