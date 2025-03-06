// 存数据
// name：命名 data：数据
function saveData(name, data) {
    localStorage.setItem(name, JSON.stringify({ 'time': Date.now(), 'data': data }))
}

// 取数据
// name：命名 time：过期时长,单位分钟,如传入30,即加载数据时如果超出30分钟返回0,否则返回数据
function loadData(name, time) {
    let d = JSON.parse(localStorage.getItem(name));
    // 过期或有错误返回 0 否则返回数据
    if (d) {
        let t = Date.now() - d.time
        if (t < (time * 60 * 1000) && t > -1) return d.data;
    }
    return 0;
}

// 上面两个函数如果你有其他需要存取数据的功能，也可以直接使用

// 读取背景
try {
    let data = loadData('blogbg', 1440)
    if (data) changeBg(data, 1)
    else localStorage.removeItem('blogbg');
} catch (error) { localStorage.removeItem('blogbg'); }

// 切换背景函数
// 此处的flag是为了每次读取时都重新存储一次,导致过期时间不稳定
// 如果flag为0则存储,即设置背景. 为1则不存储,即每次加载自动读取背景.
function changeBg(s, flag) {
    let bg = document.getElementById('web_bg')
    if (s.charAt(0) == '#') {
        bg.style.backgroundColor = s
        bg.style.backgroundImage = 'none'
    } else bg.style.backgroundImage = s
    if (!flag) { saveData('blogbg', s) }
}

// 以下为2.0新增内容

// 创建窗口
let winbox = ''

function createWinbox() {
    let div = document.createElement('div')
    document.body.appendChild(div)
    winbox = WinBox({
        id: 'changeBgBox',
        index: 999,
        title: "切换背景",
        x: "center",
        y: "center",
        minwidth: '300px',
        height: "60%",
        background: '#e37fd9',
        onmaximize: () => { div.innerHTML = `<style>body::-webkit-scrollbar {display: none;}div#changeBgBox {width: 100% !important;}</style>` },
        onrestore: () => { div.innerHTML = '' }
    });
    winResize();
    window.addEventListener('resize', winResize)

    // 每一类我放了一个演示，直接往下复制粘贴 a标签 就可以，需要注意的是 函数里面的链接 冒号前面需要添加反斜杠\进行转义
    winbox.body.innerHTML = `
    <div id="article-container" style="padding:10px;">
    
    <p><button onclick="localStorage.removeItem('blogbg');location.reload();" style="background:#e37fd9;display:block;width:100%;padding: 15px 0;border-radius:6px;color:white;"><i class="fa-solid fa-arrows-rotate"></i> 点我恢复默认背景</button></p>
    <h2 id="图片（手机）"><a href="#图片（手机）" class="headerlink" title="图片（手机）"></a>图片（手机）</h2>
    <details style="overflow: hidden; border: 1px solid #ccc; border-radius: 12px; margin-bottom: 20px;">
        <summary style="padding: 10px 20px; background-color: transparent; color: var(--font-color); cursor: pointer;">点击展开</summary>
            <div class="bgbox">
            <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://image.acg.lol/file/2025/03/04/1735866247765.jpg)" class="pimgbox" onclick="changeBg('url(https\://image.acg.lol/file/2025/03/04/1735866247765.jpg)')"></a>
            <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://image.acg.lol/file/2025/03/04/1735547100722.webp)" class="pimgbox" onclick="changeBg('url(https\://image.acg.lol/file/2025/03/04/1735547100722.webp)')"></a>
            <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://image.acg.lol/file/2025/03/04/1741077496046.jpg)" class="pimgbox" onclick="changeBg('url(https\://image.acg.lol/file/2025/03/04/1741077496046.jpg)')"></a>
            <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://image.acg.lol/file/2025/03/04/1724674632577.webp)" class="pimgbox" onclick="changeBg('url(https\://image.acg.lol/file/2025/03/04/1724674632577.webp)')"></a>
            <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://image.acg.lol/file/2025/03/04/1737866683753.jpg)" class="pimgbox" onclick="changeBg('url(https\://image.acg.lol/file/2025/03/04/1737866683753.jpg)')"></a>
            <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://image.acg.lol/file/2025/03/04/1741077526387.webp)" class="pimgbox" onclick="changeBg('url(https\://image.acg.lol/file/2025/03/04/1741077526387.webp)')"></a>
            <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://image.acg.lol/file/2025/03/04/1735546999928.webp)" class="pimgbox" onclick="changeBg('url(https\://image.acg.lol/file/2025/03/04/1735546999928.webp)')"></a>
            <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://image.acg.lol/file/2025/03/04/1741077585693.webp)" class="pimgbox" onclick="changeBg('url(https\://image.acg.lol/file/2025/03/04/1741077585693.webp)')"></a>
            </div>
    </details>


    <h2 id="图片（电脑）"><a href="#图片（电脑）" class="headerlink" title="图片（电脑）"></a>图片（电脑）</h2>

    <details style="overflow: hidden; border: 1px solid #ccc; border-radius: 12px; margin-bottom: 20px;">
        <summary style="padding: 10px 20px; background-color: transparent; color: var(--font-color); cursor: pointer;">点击展开</summary>
            <div class="bgbox">
            <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://image.acg.lol/file/2025/02/21/wallhaven-6d8gxq.jpg)" class="imgbox" onclick="changeBg('url(https\://image.acg.lol/file/2025/02/21/wallhaven-6d8gxq.jpg)')"></a>
            <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://image.acg.lol/file/2025/02/21/wallhaven-6drvmq.jpg)" class="imgbox" onclick="changeBg('url(https\://image.acg.lol/file/2025/02/21/wallhaven-6drvmq.jpg)')"></a>
            <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://image.acg.lol/file/2025/02/21/wallhaven-we725r.jpg)" class="imgbox" onclick="changeBg('url(https\://image.acg.lol/file/2025/02/21/wallhaven-we725r.jpg)')"></a>
            <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://image.acg.lol/file/2025/02/21/wallhaven-k768vd.jpg)" class="imgbox" onclick="changeBg('url(https\://image.acg.lol/file/2025/02/21/wallhaven-k768vd.jpg)')"></a>
            <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://image.acg.lol/file/2025/02/21/wallhaven-k7rjo1.jpg)" class="imgbox" onclick="changeBg('url(https\://image.acg.lol/file/2025/02/21/wallhaven-k7rjo1.jpg)')"></a>
            <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://image.acg.lol/file/2025/02/21/wallhaven-1p5l3v.jpg)" class="imgbox" onclick="changeBg('url(https\://image.acg.lol/file/2025/02/21/wallhaven-1p5l3v.jpg)')"></a>
            <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://image.acg.lol/file/2025/02/21/wallhaven-jxzj2p.jpg)" class="imgbox" onclick="changeBg('url(https\://image.acg.lol/file/2025/02/21/wallhaven-jxzj2p.jpg)')"></a>
            <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://image.acg.lol/file/2025/02/03/wallhaven-g7vm9q.jpg)" class="imgbox" onclick="changeBg('url(https\://image.acg.lol/file/2025/02/03/wallhaven-g7vm9q.jpg)')"></a>
            </div>
    </details>

    
    <h2 id="渐变色"><a href="#渐变色" class="headerlink" title="渐变色"></a>渐变色</h2>

    <details style="overflow: hidden; border: 1px solid #ccc; border-radius: 12px; margin-bottom: 20px;">
        <summary style="padding: 10px 20px; background-color: transparent; color: var(--font-color); cursor: pointer;">点击展开</summary>
            <div class="bgbox">
            <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: linear-gradient(to right, #eecda3, #ef629f)" onclick="changeBg('linear-gradient(to right, #eecda3, #ef629f)')"></a>
            </div>
    </details>

    
    <h2 id="纯色"><a href="#纯色" class="headerlink" title="纯色"></a>纯色</h2>

    <details style="overflow: hidden; border: 1px solid #ccc; border-radius: 12px; margin-bottom: 20px;">
        <summary style="padding: 10px 20px; background-color: transparent; color: var(--font-color); cursor: pointer;">点击展开</summary>
            <div class="bgbox">
            <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: #7D9D9C" onclick="changeBg('#7D9D9C')"></a> 
            </div>
    </details>
`;
}

// 适应窗口大小
function winResize() {
    let box = document.querySelector('#changeBgBox')
    if (!box || box.classList.contains('min') || box.classList.contains('max')) return // 2023-02-10更新
    let offsetWid = document.documentElement.clientWidth;
    if (offsetWid <= 768) {
        winbox.resize(offsetWid * 0.95 + "px", "90%").move("center", "center");
    } else {
        winbox.resize(offsetWid * 0.6 + "px", "70%").move("center", "center");
    }
}

// 切换状态，窗口已创建则控制窗口显示和隐藏，没窗口则创建窗口
function toggleWinbox() {
    if (document.querySelector('#changeBgBox')) winbox.toggleClass('hide');
    else createWinbox();
}