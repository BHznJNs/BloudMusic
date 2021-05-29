// 函数：切换播放状态
function toggle_play() {
    let player = $("#player")[0]
    // 如果 audio 控件中无 URL
    if (player.src == "") {
        // 播放上次最后播放的音乐
        PLAY_INDEX -= 1
        next()
    }

    if (player.paused) {
        player.play()
    } else {
        player.pause()
    }
}

// 按键事件触发
var is_fullscreen = false
$(document).keydown((event) => {
    switch (event.keyCode) {
        case 27: // Excape 打开播放控件
            show_play_widget()
            break
        case 32: // Blankspace 切换播放状态
            event.preventDefault()
            toggle_play()
            break
        case 84: // Ctrl + T 切换播放模式
            if (event.ctrlKey) {
                switch_playMode()
            }
            break
        case 122: // F11 切换全屏
            event.preventDefault()
            toggle_fullscreen()
            break
    }
})
exports.toggle_play = toggle_play