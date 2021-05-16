window.$ = window.jQuery = require("jquery")
const { ipcRenderer } = require("electron")

// 向主窗口发送消息，获取当前播放状态及正在播放的歌名
send_message("get_play_data")
// 清除所有键盘按键事件
$(document).keydown((event) => {
    event.preventDefault()
})

// 函数：关闭窗口
function close_widget() {
    ipcRenderer.send("close_play_widget")
}
// 函数：向主窗口发送消息
function send_message(message) {
    ipcRenderer.sendTo(1, message)
}
// 函数：切换播放按键
function toggle_play_icon(is_paused) {
    if (is_paused) {
        $("img.play").attr("src", "../imgs/icons/play.svg")
    } else {
        $("img.play").attr("src", "../imgs/icons/pause.svg")
    }
}

ipcRenderer.on("player_song_name", (event, song_name) => {
    // 设置歌名滚动条显示的歌名
    $("#song-name").html(song_name)
    // 设置文档 title
    $("title").html(song_name)
})
ipcRenderer.on("player_is_paused", (event, is_paused) => {
    // 根据主窗口返回的信息调整播放按键图像
    toggle_play_icon(is_paused)
})
