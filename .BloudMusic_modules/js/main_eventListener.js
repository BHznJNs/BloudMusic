const { split } = require("./units/split")
const { save_img } = require("./general/operate_file")

// 事件监听：退出或刷新页面时，保存 播放数据 & 喜欢列表
addEventListener("beforeunload", () => {
    if (PLAYLIST.songs.length) {
        // 保存播放数据
        save_data(
            "cache/last_played.json",
            JSON.stringify({
                playlist: PLAYLIST,
                play_index: PLAY_INDEX,
                play_mode: PLAY_MODE,
                volume: $("#player")[0].volume
            }),
            () => {}
        )
        // 保存喜欢列表
        save_data(
            "cache/loves.json",
            JSON.stringify(LOVEs),
            () => {}
        )
        // 保存用户收藏专辑列表
        save_data(
            "data/albums.json",
            JSON.stringify(albums),
            () => {}
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
    } else if (Math.abs($(window).width() - WIDTH) > 160) {
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
