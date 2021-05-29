const { compile } = require("ejs")
const { exist_file_sync, read_file_sync } = require("./general/operate_file")

// 函数：展示消息
async function show_notify(content) {
    let temp = $("#notification-temp").text()
    let template = compile(temp)
    let html_output = template({ content })

    let place_holder = document.createElement("div")
    $(place_holder).html(html_output)
    // 添加节点
    let child = $(place_holder.children[0])
    $("#notification").append(child)
    $(child).addClass("toast-active")
    // 定时 8 秒后关闭
    setTimeout(() => {
        close_notify(child.find("div.close"))
    }, 8000)
}
// 函数：关闭消息
async function close_notify(obj) {
    let parent = $(obj).parents(".toast")
    $(parent).removeClass("toast-active")
    setTimeout(() => {
        $(parent).remove()
    }, 400)
}


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
            (res) => {artists = JSON.parse(res)},
            () => {
                console.log("读取用户收藏歌手错误！")
                console.log("Read collected_artists.json error!")
            }
        )
        read_file_sync( // 用户关注歌手
            "data/followed_artists.json",
            (res) => {
                res = JSON.parse(res)
                artists = artists.concat(res) // 数组合并
            },
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
        collected_pls, artists
    })
    $("#scroll").html(html_output)
}

// 函数：播放列表界面加载
var playlist_temp = $("#playlist-temp").text()
async function render_playlist(playlist, playlist_name) {
    let temp = playlist_temp
    let template = compile(temp)

    let html_output = template({playlist})
    $("#songs").html(html_output)
    $("#playlist-name").text("播放列表：" + playlist_name)
}
exports.show_notify = show_notify
exports.close_notify = close_notify

exports.render_nav = render_nav
exports.render_content = render_content
exports.render_playlist = render_playlist
