const { toggle_play } = require("./main_keyEvent")

// 获取播放控件的 窗口id
var play_widget_winId
ipcRenderer.on("reply_widgetWin_id", (event, arg) => {
    play_widget_winId = arg
})
// 函数：打开播放控件（并隐藏主窗口）
function show_play_widget() {
    ipcRenderer.send("show_play_widget")
}
// 函数：向播放控件发送数据
function send_data(message, data) {
    ipcRenderer.sendTo(play_widget_winId, message, data)
}

// 交互事件 & 处理
ipcRenderer.on("toggle_play", () => {
    toggle_play()
    send_data("player_is_paused", $("#player")[0].paused)
})
ipcRenderer.on("next", () => {
    next()
})
ipcRenderer.on("previous", () => {
    previous()
})
ipcRenderer.on("player_volumn", (event, value) => {
    $("#player")[0].volume = value / 100
})
// 接受到 get_play_data 时，返回歌曲信息和播放器播放状态
ipcRenderer.on("get_play_data", () => {
    send_data("player_song_name", $("#song-name").html())
    send_data("player_volumn", $("#player")[0].volume)
    send_data("player_is_paused", $("#player")[0].paused)
})

exports.show_play_widget = show_play_widget
exports.send_data = send_data
