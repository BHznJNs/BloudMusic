window.$ = window.jQuery = require("jquery")
const { ipcRenderer } = require("electron")
const { readFile } = require("fs")
const { compile } = require("ejs")
const { get, CancelToken } = require("axios")

const { renderer } = require("../.BloudMusic_modules/js/general/renderer")
const { save_data } = require("../.BloudMusic_modules/js/general/operate_file")
const { del_dir } = require("../.BloudMusic_modules/js/general/operate_dir")

const { render_playlist } = require("../.BloudMusic_modules/js/main_render")
const { show_notify, close_notify } = require("../.BloudMusic_modules/js/units/notify")
const { toggle_fullscreen } = require("../.BloudMusic_modules/js/fullscreen")
const { show_play_widget, send_data } = require("../.BloudMusic_modules/js/interact_play_widget")
const { SPLIT_DETAIL, split, show_split, close_split, artist_detail, get_detail, play_all } = require("../.BloudMusic_modules/js/units/split")
const { show_modal, hide_modal } = require("../.BloudMusic_modules/js/units/modal")
const { load_more } = require("../.BloudMusic_modules/js/load_more")

const { geter } = require("../.BloudMusic_modules/js/general/geter")
const { toggle_love, toggle_love_icon } = require("../.BloudMusic_modules/js/units/love") // 切换单曲喜欢状态
const { get_song, get_playlist_songs, get_artist_data, get_hotSongs, get_recommends, get_album_songs } = require("../.BloudMusic_modules/js/get_data/get_play_data")

require("../.BloudMusic_modules/js/main_keyEvent") // 按键事件触发
require("../.BloudMusic_modules/js/main_loader") // 页面载入时
require("../.BloudMusic_modules/js/main_eventListener") // 事件监听

// 全局变量：播放信息
var PLAYLIST = { // 定义全局播放列表
    id: 0,
    songs: [],
    song_ids: [],
    type_: ""
}
var PLAY_INDEX = 0 // 播放序列 index
var PLAY_MODE = "loop" // 播放模式
// 全局变量：播放单曲信息
var PLAY_INFO = {
    id: 0,
    name: "",
    artists: ""
}
// 全局变量：喜欢的单曲
var LOVEs = []
//————————————————————————————————————————
// 载入界面时，加载上次播放数据
$(async () => {
    readFile("cache/loves.json", "utf8", (err, res) => {
        if (err) {console.log(err); return}
        let data = JSON.parse(res)
        LOVEs = data
    })
    readFile("cache/last_played.json", "utf8", (err, res) => {
        if (err) { // 如果上次播放数据保存错误 || 文件不存在
            console.log("文件 \"cache/last_played.json\" 不存在！")
            PLAYLIST = LOVEs
            console.log("PLAYLIST = LOVEs", PLAYLIST)
            $("#player")[0].volume = 0.7
        }
        let data = JSON.parse(res)

        PLAYLIST = data.playlist
        PLAY_INDEX = data.play_index
        // 调节音量
        $("#player")[0].volume = data.volume
        // 设定播放模式为上次播放模式
        switch_playMode(data.play_mode)

        render_playlist(PLAYLIST, PLAYLIST.name)
    })
})
//————————————————————————————————————————
// 函数：退出登录
function logout() {
    del_dir("data") // 清空 data 目录
    del_dir("cache") // 清空 cache 目录
    location.replace("login.html")
}

// 函数：切换播放列表 打开 / 关闭
async function toggle_playlist() {
    $("#playlist-icon").toggleClass("icon-active")
    $("#playlist").toggleClass("playlist-active")
}

// 函数：切换播放模式
function switch_playMode(mode) {
    let modes = ["loop", "random", "loop_one"]
    let modes_cn = {
        "loop": "列表循环",
        "random": "随机",
        "loop_one": "单曲循环"
    }
    if (mode) {
        var index = modes.indexOf(mode) - 1
    } else {
        var index = modes.indexOf(PLAY_MODE)
    }

    if (index >= 2) {
        PLAY_MODE = modes[0]
    } else {
        PLAY_MODE = modes[index + 1]
    }
    // 修改播放模式 图标 & 提示（title）
    $("#play-mode").attr("src", `../imgs/icons/${PLAY_MODE}.svg`)
    $("#play-mode").attr("title", `循环方式：${modes_cn[PLAY_MODE]}`)
}

// 函数：判断是否切换播放
function switch_play(id, type_, options) {
    return new Promise(async (resolve) => {
        if (id != PLAYLIST.id || type_ != PLAYLIST.type_) {
            PLAY_INDEX = 0
            switch (type_) { // 获取播放列表
                case "playlist": // 歌单
                    PLAYLIST = await get_playlist_songs(id)
                    break
                case "album":
                    PLAYLIST = await get_album_songs(id, PLAYLIST.type_)
                    break
                case "followed_art": // 用户关注歌手
                    id = await get_artist_data(id)
                case "collected_art": // 用户收藏歌手
                    PLAYLIST = await get_hotSongs(id)
                    break
                case "loves": // 喜欢列表
                    PLAYLIST = LOVEs
                    break
                case "recommend": // 每日推荐
                    PLAYLIST = await get_recommends()
                    break
                case "song_in_playlist": // 播放列表中单曲
                    PLAY_INDEX = PLAYLIST.song_ids.indexOf(Number(id))
                    break
                case "songs": //     来自 split 参数
                    PLAYLIST = options.songs
                    break
            }
            if (["playlist", "album", "songs", "collected_art", "followed_art", "loves", "recommend"].includes(type_)) {
                render_playlist(PLAYLIST, PLAYLIST.name)
            }
        }
        resolve()
    })
}
// 函数：给播放过单曲增加提示
function add_style_played(song_data, type_) {
    if (type_ == "song") {return}
    if (PLAY_INDEX < PLAYLIST.songs.length) {
        let item = $("#playlist-songs").children()[PLAY_INDEX]
        $(item).addClass("item-played")
        // 如果单曲 无版权 或 未付费，则播放下一首并添加样式
        if (song_data.no_copyright || song_data.VIP) {
            $(item).addClass("item-disabled")
            next()
        }
    }
}
// 函数：根据传入信息获取并播放单曲
async function play(id, type_, options={}) {
    if (type_ != "song") {
        await switch_play(id, type_, options)
        var song_id = PLAYLIST.song_ids[PLAY_INDEX]
    } else { // 如果类型为单曲，则
        var song_id = id
    }
    // 获取播放数据
    let song_data = await get_song(song_id)
    // 如果单曲信息获取失败
    if (!song_data) {
        if (PLAY_MODE == "loop" && type_ != "song") {
            PLAY_INDEX -= 1
        }
        return
    }
    // 播放列表添加样式
    add_style_played(song_data, type_)
    // 修改播放器 URL，播放单曲
    $("#player").attr("src", `https://music.163.com/song/media/outer/url?id=${song_data.id}.mp3`)

    $("#song-name").show()
    // 修改 song-name 控件属性
    $("#song-name span.song-name").html(song_data.name)
    $("#song-name span.artists").html(song_data.artist_name)
    $("#song-name span.artists").attr("data-artists", JSON.stringify(song_data.artists))


    PLAY_INFO = {
        id: song_id,
        name: song_data.name,
        artists: song_data.artist_name
    }
    // 切换喜欢图标
    toggle_love_icon()
    // 修改文档 title，并向播放控件发送数据
    let song_name = `${song_data.name}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${song_data.artist_name}`
    $("title").html(song_name)
    try {send_data("player_song_name", song_name)} catch {}
}
//————————————————————————————————————————
// 函数：上一首
function previous() {
    PLAY_INDEX -= 1
        if (PLAY_INDEX < 0) {
        PLAY_INDEX = PLAYLIST.song_ids.length
    }
    play(PLAYLIST.id, PLAYLIST.type_)
}
// 函数：下一首
function next() {
    if (PLAY_INFO)
    switch (PLAY_MODE) {
        case "loop": // 列表循环播放
            PLAY_INDEX += 1
            if (PLAY_INDEX >= PLAYLIST.song_ids.length) {
                PLAY_INDEX = 0
            }
            break
        case "random": // 随机播放
            //———————————从 0 ～ 播放列表.length 中随机取整数
            PLAY_INDEX = Math.floor(Math.random()*PLAYLIST.song_ids.length)
            break
        case "loop_one":
            $("#player")[0].currentTime = 0
            $("#player")[0].play()
            return
    }
    play(PLAYLIST.id, PLAYLIST.type_)
}
