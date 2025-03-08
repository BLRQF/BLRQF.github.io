//流星特效
function dark() { window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame; var n, e, i, h, t = .05, s = document.getElementById("universe"), o = !0, a = "180,184,240", r = "226,225,142", d = "226,225,224", c = []; function f() { n = window.innerWidth, e = window.innerHeight, i = .216 * n, s.setAttribute("width", n), s.setAttribute("height", e) } function u() { h.clearRect(0, 0, n, e); for (var t = c.length, i = 0; i < t; i++) { var s = c[i]; s.move(), s.fadeIn(), s.fadeOut(), s.draw() } } function y() { this.reset = function () { this.giant = m(3), this.comet = !this.giant && !o && m(10), this.x = l(0, n - 10), this.y = l(0, e), this.r = l(1.1, 2.6), this.dx = l(t, 6 * t) + (this.comet + 1 - 1) * t * l(50, 120) + 2 * t, this.dy = -l(t, 6 * t) - (this.comet + 1 - 1) * t * l(50, 120), this.fadingOut = null, this.fadingIn = !0, this.opacity = 0, this.opacityTresh = l(.2, 1 - .4 * (this.comet + 1 - 1)), this.do = l(5e-4, .002) + .001 * (this.comet + 1 - 1) }, this.fadeIn = function () { this.fadingIn && (this.fadingIn = !(this.opacity > this.opacityTresh), this.opacity += this.do) }, this.fadeOut = function () { this.fadingOut && (this.fadingOut = !(this.opacity < 0), this.opacity -= this.do / 2, (this.x > n || this.y < 0) && (this.fadingOut = !1, this.reset())) }, this.draw = function () { if (h.beginPath(), this.giant) h.fillStyle = "rgba(" + a + "," + this.opacity + ")", h.arc(this.x, this.y, 2, 0, 2 * Math.PI, !1); else if (this.comet) { h.fillStyle = "rgba(" + d + "," + this.opacity + ")", h.arc(this.x, this.y, 1.5, 0, 2 * Math.PI, !1); for (var t = 0; t < 30; t++)h.fillStyle = "rgba(" + d + "," + (this.opacity - this.opacity / 20 * t) + ")", h.rect(this.x - this.dx / 4 * t, this.y - this.dy / 4 * t - 2, 2, 2), h.fill() } else h.fillStyle = "rgba(" + r + "," + this.opacity + ")", h.rect(this.x, this.y, this.r, this.r); h.closePath(), h.fill() }, this.move = function () { this.x += this.dx, this.y += this.dy, !1 === this.fadingOut && this.reset(), (this.x > n - n / 4 || this.y < 0) && (this.fadingOut = !0) }, setTimeout(function () { o = !1 }, 50) } function m(t) { return Math.floor(1e3 * Math.random()) + 1 < 10 * t } function l(t, i) { return Math.random() * (i - t) + t } f(), window.addEventListener("resize", f, !1), function () { h = s.getContext("2d"); for (var t = 0; t < i; t++)c[t] = new y, c[t].reset(); u() }(), function t() { document.getElementsByTagName('html')[0].getAttribute('data-theme') == 'dark' && u(), window.requestAnimationFrame(t) }() };
dark()

//动态标题
var OriginTitile = document.title;
var titleTime;
document.addEventListener('visibilitychange', function () {
  if (document.hidden) {
    //离开当前页面时标签显示内容
    document.title = '👀跑哪里去了~';
    clearTimeout(titleTime);
  } else {
    //返回当前页面时标签显示内容
    document.title = '🐖抓到你啦～';
    //两秒后变回正常标题
    titleTime = setTimeout(function () {
      document.title = OriginTitile;
    }, 2000);
  }
});

// 运行时间
// 获取当前时间
let now = new Date();
// 设置起始时间
let startTime = new Date("2024-11-15T00:00:00");

// 格式化时间，确保时间为两位数
function formatTime(time) {
    return String(time).length === 1 ? "0" + time : time;
}

// 计算从起始时间到当前时间的持续时长
function calculateDuration() {
    // 获取当前真实时间
    now = new Date();
    // 计算时间差（毫秒）
    const diff = now - startTime;
    // 计算天数
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    // 计算小时数
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    // 计算分钟数
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    // 计算秒数
    const seconds = Math.round((diff / 1000) % 60);

    // 格式化小时、分钟和秒
    const formattedHours = formatTime(hours);
    const formattedMinutes = formatTime(minutes);
    const formattedSeconds = formatTime(seconds);

    return {
        days,
        hours: formattedHours,
        minutes: formattedMinutes,
        seconds: formattedSeconds
    };
}

// 创建要显示的 HTML 内容
function createDisplayContent(duration) {
    // 根据当前小时数选择图片和提示信息
    const imageSrc = duration.hours < 21 && duration.hours >= 9
      ? '/img/BLRQF-摸鱼中-7cfcoo.svg'
      : '/img/BLRQF-晚安啦-7cfcoo.svg';
    const imageTitle = duration.hours < 21 && duration.hours >= 9
      ? '今天，也要元气满满哦！'
      : '晚上就不要熬夜了，早点睡~';

    return `<img class='boardsign' src='${imageSrc}' title='${imageTitle}'>
            <span class='textTip'> <br> 本站居然运行了 ${duration.days} 天</span>
            <span id='runtime'> ${duration.hours} 小时 ${duration.minutes} 分 ${duration.seconds} 秒 </span> 
            <i id="heartbeat" class='fas fa-heartbeat'></i>`;
}

// 更新显示内容的函数
function createtime() {
    // 计算持续时长
    const duration = calculateDuration();
    // 创建显示内容
    const displayContent = createDisplayContent(duration);
    // 获取显示内容的 DOM 元素
    const workboard = document.getElementById("workboard");
    if (workboard) {
        // 更新 DOM 元素的内容
        workboard.innerHTML = displayContent;
    }
}

// 每秒更新一次显示内容
setInterval(createtime, 1000);