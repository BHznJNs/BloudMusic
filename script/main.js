window.$ = window.jQuery = require("jquery")
const { ipcRenderer } = require("electron")

const { read_file } = require("../.BloudMusic_modules/general/operate_file")
const { del_dir } = require("../.BloudMusic_modules/general/operate_dir")
const { render_nav, render_content } = require("../.BloudMusic_modules/render_main")
const { toggle_fullscreen } = require("../.BloudMusic_modules/toggle_fullscreen")
const { get_song, get_playlist, get_art_hs } = require("../.BloudMusic_modules/get_data/get_play_data")
const { show_play_widget, send_data } =  require("../.BloudMusic_modules/interact_play_widget")

$("#song-name").hide()
// 设置 audio 音量
$("#player")[0].volume = 0.7

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
// 替换用户昵称、头像、背景
read_file("data/user.json", (err)=>{console.log(err)}, (res) => {
    let data = JSON.parse(res)

    let user_name = data.name
    $("#nav-title").text(user_name)

    let avatar_url = data.avatar_url
    let background_url = data.background_url
    $("#user-avatar").attr("src", avatar_url)
    $("#user-background").attr("src", background_url)
})
// 渲染页面
render_nav()
render_content()

function logout() {
    del_dir(
        "data",
        () => {},
        (err) => {console.log(err)}
    )
    location.replace("login.html")
}

// 函数：切换播放状态
function toggle_play() {
    let player = $("#player")[0]
    try {
        if (player.paused) {
            player.play()
        } else {
            player.pause()
        }
    } catch {}
}
// 函数：切换播放模式
function switch_playMode() {
    let modes = ["loop", "random", "loop_one"]
    let index = modes.indexOf(PLAY_MODE)
    if (index >= 2) {
        PLAY_MODE = modes[0]
    } else {
        PLAY_MODE = modes[index + 1]
    }
    $("#play-mode").attr("src", "../imgs/icons/" + PLAY_MODE + ".svg")
}

// 全局变量
var PLAYLIST = { // 定义全局播放列表
    id: 0,
    song_ids: [],
    type_: ""
}
var PLAY_INDEX = 0 // 播放序列 index
var PLAY_MODE = "loop" // todo： 播放模式

// 函数：判断是否切换播放列表
function switch_playlist(list_id, type_) {
    return new Promise(async (resolve) => {
        if (list_id != PLAYLIST.id || type_ != PLAYLIST.type_) {
            switch (type_) { // 获取播放列表
                case "playlist":
                    PLAYLIST = await get_playlist(list_id)
                    break;
                case "artist":
                    PLAYLIST = await get_art_hs(list_id)
                    break
            }
            PLAY_INDEX = 0
        }
        resolve()
    })
}
// 函数：根据传入信息获取并播放单曲
async function play(list_id, type_) {
    await switch_playlist(list_id, type_)

    let song_id = PLAYLIST.song_ids[PLAY_INDEX].id
    let song_data = await get_song(song_id)
    $("#player").attr("src", "https://music.163.com/song/media/outer/url?id=" + song_data.id + ".mp3")

    $("#song-name").show()
    let song_name = song_data.name + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + song_data.artist_name
    $("#song-name").html(song_name)
    $("title").html(song_name)

    try {send_data("player_song_name", $("#song-name").html())} catch {}
}
// 函数：上一首
function previous() {
    if (PLAY_INDEX <= 0) {
        PLAY_INDEX = PLAYLIST.song_ids.length
    }
    PLAY_INDEX -= 1
    play(PLAYLIST.id, PLAYLIST.type_)
}
// 函数：下一首
function next() {
    if (PLAY_INDEX >= PLAYLIST.song_ids.length) {
        PLAY_INDEX = -1
    }
    switch (PLAY_MODE) {
        case "loop": // 列表循环播放
            PLAY_INDEX += 1
            break
        case "random": // 随机播放
            PLAY_INDEX = Math.floor(Math.random()*PLAYLIST.song_ids.length)
            break
    }
    play(PLAYLIST.id, PLAYLIST.type_)
}
