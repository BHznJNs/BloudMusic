// 按键事件触发
var is_fullscreen = false
$(document).keydown((event) => {
    event.preventDefault()
    switch (event.keyCode) {
        case 122: // F11 切换全屏图标
            toggle_fullscreen()
            break
        case 32: // Blankspace
            toggle_play()
            break
    }
})