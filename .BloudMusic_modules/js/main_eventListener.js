const { split } = require("./units/split")
const { save_img } = require("./general/operate_file")

// 事件监听：退出或刷新页面时，保存 播放数据 & 喜欢列表
addEventListener("beforeunload", () => {
    if (PLAYLIST.songs.length) {
        save_data(
            "cache/last_played.json",
            JSON.stringify({
                playlist: PLAYLIST,
                play_index: PLAY_INDEX,
                play_mode: PLAY_MODE,
                volume: $("#player")[0].volume
            }),
            (err) => {save_data("cache/err.log", err)}
        )
        save_data(
            "cache/loves.json",
            JSON.stringify(LOVEs),
            (err) => {save_data("cache/err.log", err)}
        )
    }
})
// 全局变量：窗口大小变动前宽度
var WIDTH = $(window).width()
// 事件监听：当窗口宽度改变时
addEventListener("resize", () => {
    if ($(window).width() > 999 && WIDTH < 1000) {
        // 当窗口宽度变化超过阈值时
        split()
    } else if ($(window).width() < 1000 && WIDTH > 999) {
        // 当窗口宽度变化超过阈值时
        split()
    } else if (Math.abs($(window).width() - WIDTH) > 200) {
        // 当窗口宽度变化过大时
        split()
    }
    WIDTH = $(window).width()
})
// 事件监听：进程通信保存图片
ipcRenderer.on("save-data", (event, data) => {
    if (!data.path) {return}
    save_img(data.url, data.path)
})
