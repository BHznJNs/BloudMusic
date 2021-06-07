const { exist_file_sync, read_file_sync } = require("./general/operate_file")

var exist_created_pl
var exist_special_pl
var exist_collected_pl
var exist_artists
// 函数：获取并加载页面顶栏
async function render_nav() {
    exist_file_sync(
        "data/created_playlists.json",
        () => {exist_created_pl = true},
        () => {exist_created_pl = false}
    )
    exist_file_sync(
        "data/created_playlists.json",
        () => {exist_special_pl = true},
        () => {exist_special_pl = false}
    )
    exist_file_sync(
        "data/collected_playlists.json",
        () => {exist_collected_pl = true},
        () => {exist_collected_pl = false}
    )
    exist_file_sync(
        "data/collected_artists.json",
        () => {exist_artists = true},
        () => {exist_artists = false}
    )    

    let temp = $("#nav-temp").text()
    let template = compile(temp)
    let html_output = template({
        exist_created_pl, exist_special_pl,
        exist_collected_pl, exist_artists
    })
    $("#main-nav-items").html(html_output)
}


var created_pls
var special_pls
var collected_pls
var collected_arts = []
var followed_arts = []
// 函数：读取歌单及歌手数据
function get_data() {
    if (exist_created_pl) { // 用户创建歌单
        read_file_sync(
            "data/created_playlists.json",
            (res) => {created_pls = JSON.parse(res)},
            () => {
                console.log("读取用户创建歌单错误！")
                console.log("Read created_playlists.json error!")
            }
        )
    }
    if (exist_special_pl) { // 用户收藏音乐、日推、音乐雷达
        read_file_sync(
            "data/special_playlists.json",
            (res) => {special_pls = JSON.parse(res)},
            () => {
                console.log("读取用户收藏音乐、日推、音乐雷达错误！");
                console.log("Read special_plsaylists.json error!")
            }
        )
    }
    if (exist_collected_pl) { // 用户收藏歌单
        read_file_sync(
            "data/collected_playlists.json",
            (res) => {collected_pls = JSON.parse(res)},
            () => {
                console.log("读取用户收藏歌单错误！")
                console.log("Read collected_playlists.json error!")
            }
        )
    }
    if (exist_artists) {
        read_file_sync( // 用户收藏歌手
            "data/collected_artists.json",
            (res) => {collected_arts = JSON.parse(res)},
            () => {
                console.log("读取用户收藏歌手错误！")
                console.log("Read collected_artists.json error!")
            }
        )
        read_file_sync( // 用户关注歌手
            "data/followed_artists.json",
            (res) => {followed_arts = JSON.parse(res)},
            () => {
                console.log("读取用户关注歌手错误！")
                console.log("Read followed_artists.json error!")
            }
        )
    }
}
// 函数：界面主要内容编译及加载
async function render_content() {
    let temp = $("#scroll-temp").text()
    let template = compile(temp)

    get_data()

    let html_output = template({
        exist_created_pl, exist_special_pl,
        exist_collected_pl, exist_artists,
        created_pls, special_pls,
        collected_pls,
        collected_arts, followed_arts
    })
    $("#main-scroll").html(html_output)
}

// 函数：播放列表界面加载
async function render_playlist(list, playlist_name) {
    let temp = $("#playlist-songs-temp").text()
    let template = compile(temp)

    let html_output = template({ list })
    $("#playlist-songs").html(html_output)
    $("#playlist-name").text("播放列表：" + playlist_name)
}
exports.render_nav = render_nav
exports.render_content = render_content
exports.render_playlist = render_playlist
