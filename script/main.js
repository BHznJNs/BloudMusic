window.$ = window.jQuery = require("jquery")
const { get } = require("axios")

const { read_file } = require("../.BloudMusic_modules/operate_file")
const { render_nav, render_content } = require("../.BloudMusic_modules/render_main")
const { toggle_fullscreen, toggle_fs_icon } = require("../.BloudMusic_modules/toggle_fullscreen")
const { get_song, get_playlist, get_art_hs } = require("../.BloudMusic_modules/get_play_data")

$(() => {
    $("#song-name").hide()
    // 设置 audio 音量
    $("#player")[0].volume = 0.7
})

// 按下F11时，切换全屏图标
var is_fullscreen = false
$(document).keydown((event) => {
    switch (event.keyCode) {
        case 122: // F11
            toggle_fs_icon()
            break
        case 32: // Blankspace
            event.preventDefault()
            let player = $("#player")[0]
            try {
                if (player.paused) {
                    player.play()
                } else {
                    player.pause()
                }
            } catch {}
            break
    }
})

// 替换用户昵称
read_file("data/user.json", (err)=>{console.log(err)}, (res) => {
    let user_name = JSON.parse(res).name
    $("#nav-title").text(user_name)
})

render_nav()
render_content()

var PLAYLIST = { // 定义全局播放列表
    id: 0,
    ids: [],
    type_: ""
}
var PLAY_INDEX = 0
var PLAY_MODE = "list_loop"

function switch_playlist(list_id, type_) {
    return new Promise(async (resolve) => {
        // 判断是否切换播放列表
        if (list_id != PLAYLIST.id || type_ != PLAYLIST.type_) {
            switch (type_) { // 获取播放列表
                case "playlist":
                    PLAYLIST = await get_playlist(list_id)
                    break;
                case "artist":
                    PLAYLIST = await get_art_hs(list_id)
                    break
            }
            resolve()
        }
    })
}
async function play(list_id, type_) {
    await switch_playlist(list_id, type_)

    let song_id = PLAYLIST.ids[PLAY_INDEX].id
    let song_data = await get_song(song_id)
    $("#player").attr("src", "https://music.163.com/song/media/outer/url?id=" + song_data.id + ".mp3")

    $("#song-name").show()
    let song_info = song_data.name + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + song_data.artist_name
    $("#song-name").html(song_info)
    $("title").html(song_info)
}
function previous() {
    if (PLAY_INDEX <= 0) {
        PLAY_INDEX = PLAYLIST.ids.length
    }
    PLAY_INDEX -= 1
    play(PLAYLIST.id)
}
function next() {
    if (PLAY_INDEX >= PLAYLIST.ids.length) {
        PLAY_INDEX = -1
    }
    PLAY_INDEX += 1
    play(PLAYLIST.id)
}
