// 函数：切换播放状态
function toggle_play() {
    let player = $("#player")[0]
    // 如果 audio 控件中无 URL
    if (player.src == "") {
        // 播放上次最后播放的音乐
        PLAY_INDEX -= 1
        next()
        return
    }
    // 切换 播放 / 暂停
    if (player.paused) {
        player.play()
    } else {
        player.pause()
    }
}

// 按键事件触发
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
        case 98: // 数字小键盘2 降低音量
            if ($("#player")[0].volume >= .1) {
                $("#player")[0].volume -= .1
            } else {
                $("#player")[0].volume = 0
            }
            break
        case 104: // 数字小键盘8 提高音量
            if ($("#player")[0].volume <= .9) {
                $("#player")[0].volume += .1
            } else {
                $("#player")[0].volume = 1
            }
            break
        case 100: // 数字小键盘4 上一首
            previous()
            break
        case 102: // 数字小键盘6 下一首
            next()
            break
        case 122: // F11 切换全屏
            event.preventDefault()
            toggle_fullscreen()
            break
    }
})
exports.toggle_play = toggle_play