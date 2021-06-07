window.$ = window.jQuery = require("jquery")
const { ipcRenderer } = require("electron")

// 向主窗口发送消息，获取当前播放状态及正在播放的歌名
send_message("get_play_data")

// 清除所有键盘按键事件
$(document).keydown((event) => {
    event.preventDefault()
})
//————————————————————————————————————————
// 函数：关闭窗口
function close_widget() {
    ipcRenderer.send("close_play_widget")
}
// 函数：向主窗口发送消息
function send_message(message, data) {
    if (data) {
        ipcRenderer.sendTo(1, message, data)
    } else {
        ipcRenderer.sendTo(1, message)
    }
}
// 函数：切换播放按键
function toggle_play_icon(is_paused) {
    if (is_paused) {
        $("img.play").attr("src", "../imgs/icons/play.svg")
    } else {
        $("img.play").attr("src", "../imgs/icons/pause.svg")
    }
}
var VOLUME
// 函数：根据 input:range 的值切换静音图标
function toggle_sound_icon() {
    let value = $("#volume").val()
    if (value == 0) {
        $("#volume-icon").attr("src", "../imgs/icons/sound_off.svg")
    } else {
        $("#volume-icon").attr("src", "../imgs/icons/sound_on.svg")
    }
}
// 函数：切换静音
function toggle_mute() {
    // 如果当前音量大于0
    if ($("#volume").val() > 0) {
        VOLUME = $("#volume").val()
        // 将音量设为0
        $("#volume").val(0)
    } else { // 如果当前音量等于0
        // 恢复静音前音量
        $("#volume").val(VOLUME)
    }
    toggle_sound_icon()
    send_volumn()
}
// 函数：当鼠标松开 volume 时，向主窗口发送音量
function send_volumn() {
    let value = $("#volume").val()
    send_message("player_volumn", value)
}

//————————————————————————————————————————

// 事件监听：设置 volume 的数值
ipcRenderer.once("player_volumn", (event, value) => {
    $("#volume").val(value * 100)
})
// 事件监听：设置歌名及文档 title
ipcRenderer.on("player_song_name", (event, song_name) => {
    // 设置歌名滚动条显示的歌名
    $("#song-name").html(song_name)
    // 设置文档 title
    $("title").html(song_name)
    // 设置控件动画状态
    $("#song-name").css("animation-play-state", "running")
})
// 事件监听：主窗口返回的播放状态
ipcRenderer.on("player_is_paused", (event, is_paused) => {
    // 根据主窗口返回的信息调整播放按键图像
    toggle_play_icon(is_paused)
})
