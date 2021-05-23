const { ipcRenderer } = require("electron")

// 切换全屏
var is_fullscreen = false
function toggle_fullscreen() {
    ipcRenderer.send("toggle_fullscreen")
    toggle_fs_icon()
}
// 切换全屏图标
function toggle_fs_icon() {
    if (!is_fullscreen) {
        $("#fullscreen").attr("src", "../imgs/icons/quit_fullscreen.svg")
        is_fullscreen = true
    } else {
        $("#fullscreen").attr("src", "../imgs/icons/fullscreen.svg")
        is_fullscreen = false
    }
}
exports.toggle_fullscreen = toggle_fullscreen
