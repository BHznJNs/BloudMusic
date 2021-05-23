const { compile } = require("ejs")
const { exist_file_sync, read_file_sync } = require("./general/operate_file")

var exist_created_pl
var exist_special_pl
var exist_collected_pl
var exist_artists
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
    $("#nav-items").html(html_output)
}


var created_pls
var special_pls
var collected_pls
var artists = []
// 函数：读取歌单及歌手数据
function get_data() {
    if (exist_created_pl) { // 用户创建歌单
        read_file_sync(
            "data/created_playlists.json",
            (res) => {created_pls = JSON.parse(res)},
            (err) => {
                console.log("Read created_playlists.json error!")
                console.log(err)
            }
        )
    }
    if (exist_special_pl) { // 用户收藏音乐、日推、音乐雷达
        read_file_sync(
            "data/special_playlists.json",
            (res) => {special_pls = JSON.parse(res)},
            (err) => {
                console.log("Read special_plsaylists.json error!")
                console.log(err)
            }
        )
    }
    if (exist_collected_pl) { // 用户收藏歌单
        read_file_sync(
            "data/collected_playlists.json",
            (res) => {collected_pls = JSON.parse(res)},
            (err) => {
                console.log("Read collected_playlists.json error!")
                console.log(err)
            }
        )
    }
    if (exist_artists) {
        read_file_sync( // 用户收藏音乐人
            "data/collected_artists.json",
            (res) => {artists = JSON.parse(res)},
            (err) => {
                console.log("Read collected_artists.json error!")
                console.log(err)
            }
        )
        read_file_sync( // 用户关注音乐人
            "data/followed_artists.json",
            (res) => {
                res = JSON.parse(res)
                artists = artists.concat(res) // 数组合并
            },
            (err) => {
                console.log("Read followed_artists.json error!")
                console.log(err)
            }
        )
    }
}
// 函数：界面主要内容编译及渲染
async function render_content() {
    let temp = $("#scroll-temp").text()
    let template = compile(temp)

    get_data()

    let html_output = template({
        exist_created_pl, exist_special_pl,
        exist_collected_pl, exist_artists,
        created_pls, special_pls,
        collected_pls, artists
    })
    $("#scroll").html(html_output)
}

var playlist_temp = $("#playlist-temp").text()
async function render_playlist(playlist) {
    let temp = playlist_temp
    let template = compile(temp)

    let html_output = template({playlist})
    $("#songs").html(html_output)
}
exports.render_nav = render_nav
exports.render_content = render_content
exports.render_playlist = render_playlist
