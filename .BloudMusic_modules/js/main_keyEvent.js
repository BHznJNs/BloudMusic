const { show_notify } = require("./units/notify")

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
var volume
$(document).keydown((event) => {
    switch (event.keyCode) {
        case 27: // Excape 打开播放控件
            show_play_widget()
            break
        case 32: // Blankspace 切换播放状态
            event.preventDefault()
            // 如果焦点在 Audio 控件上
            if (document.activeElement.id == "player") {break}
            // 如果焦点不在 Audio 控件上
            toggle_play()
            break
        case 77: // Alt + M 切换播放模式
            if (event.altKey) {
                switch_playMode()
            }
            break
        case 80: // Alt + P 切换播放列表 打开 / 关闭
            if (event.altKey) {
                toggle_playlist()
            }
            break
        case 98: // 数字小键盘2 降低音量
            if (!$("#player").attr("src")) {return} // 如果播放器中无 URL
            if ($("#player")[0].volume >= .1) {
                $("#player")[0].volume -= .1
            } else {
                $("#player")[0].volume = 0
            }
            // 提示当前音量
            volume = `${$("#player")[0].volume * 100}`.split('.')[0]
            show_notify(`当前音量：${volume}%`, 2000)
            break
        case 104: // 数字小键盘8 提高音量
            if (!$("#player").attr("src")) {return} // 如果播放器中无 URL
            if ($("#player")[0].volume <= .9) {
                $("#player")[0].volume += .1
            } else {
                $("#player")[0].volume = 1
            }
            // 提示当前音量
            volume = `${$("#player")[0].volume * 100}`.split('.')[0]
            show_notify(`当前音量：${volume}%`, 2000)
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
