// 将文本中的URL或其他可识别的链接转换为可点击的超链接
export function linkify(text) {
    if (text) {
        // 匹配URL的正则表达式
        var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%=~_|$?!:,.]*[A-Z0-9+&@#/%=~_|$])/gi;

        // 将匹配到的URL替换为带有链接的HTML
        var linkedText = text.replace(urlRegex, function (url) {
            return '<a href="' + url + '" class="v-url" target="_blank">' + url + '</a>';
        });

        return linkedText;
    } else {
        return text; // 如果 text 未定义，则返回原始值
    }
}


// 处理播放时长的时间
export function handleTime(time) {
    time = parseInt(time);
    time = Math.floor(time);
    let m = Math.floor(time / 60);
    let s = Math.floor(time % 60);
    m = m < 10 ? '0' + m : m;
    s = s < 10 ? '0' + s : s;
    return m + ':' + s;
}


// 将播放时长还原为秒数
export function returnSecond(time) {
    time = time.split(':');
    let m = parseInt(time[0]);
    let s = parseInt(time[1]);
    return m * 60 + s;
}


// 处理大于1w的数字
export function handleNum(num) {
    if (num > 10000) {
        num = (num / 10000).toFixed(1);
        return num + 'w';
    } else {
        return num;
    }
}