window.$ = window.jQuery = require("jquery")
const { encode } = require("ini")
// 共用模块
const { geter } = require("../.BloudMusic_modules/js/general/geter")
const { renderer } = require("../.BloudMusic_modules/js/general/renderer")
const { show_notify, close_notify } = require("../.BloudMusic_modules/js/units/notify")
// 获取数据模块
const { get_login_data } = require("../.BloudMusic_modules/js/get_data/get_login_data")

const { show_load, hide_load } = require("../.BloudMusic_modules/js/control_load")
const { check_account } = require("../.BloudMusic_modules/js/check_account")
const { make_dir } = require("../.BloudMusic_modules/js/general/operate_dir")
const { save_data, exist_file } = require("../.BloudMusic_modules/js/general/operate_file")

// 如果 “data” 与 “cache” 文件夹不存在，则创建
make_dir("data")
make_dir("cache")
// 默认配置文件
exist_file(
    "config.ini",
    () => {},
    () => {
        let default_conf = encode({
            UI: {
                theme: "default",
                autoFullscreen: false, // 自动全屏
                // iconStyle: "scale" // scale(缩放) || blur(模糊)
            },
            playWidget: { // 屏幕播放控件
                // 相对屏幕左上角位置(单位：像素)
                offsetX: 20,
                offsetY: 20
            }
        })
        save_data("config.ini", default_conf)
    }
)
// 函数：编辑进度条 长度 & 文本 | edit progress bar
function edit_bar(bar_length, text) { // edit progress bar
    $("#progress-bar").width(bar_length)
    $("#progress-text").text(text)
}

// 函数：处理用户输入并调用登录 API
function user() {
    // 校验用户输入
    let data = check_account()
    if (data) {
        show_load()
    } else {return}
    edit_bar("5%", "用户资料获取中......")

    // 获取用户信息
    return new Promise(async (resolve) => {
        let user_data = await get_login_data("user", data)
        resolve(user_data)
    })
}
// 函数：获取并处理歌单数据
function playlist(userId) {
    // 获取歌单
    edit_bar("15%", "歌单数据获取中......")
    return new Promise(async (resolve) => {
        let playlist = await get_login_data("playlists", {userId: userId})
        if (!playlist) {resolve(false)}
        // 保存用户创建歌单
        save_data(
            "data/created_playlists.json",
            JSON.stringify(playlist.mine_pl)            
        )
        // 保存用户收藏歌单
        save_data(
            "data/collected_playlists.json",
            JSON.stringify(playlist.collected_pl)
        )
        // 保存特殊歌单
        let special_pl = playlist.special_pl
        save_data(
            "data/special_playlists.json",
            JSON.stringify(special_pl)
        )
        edit_bar("25%", "歌单数据已保存。")
        // 获取并保存用户收藏单曲
        edit_bar("35%", "用户收藏单曲获取中......")
        let loves = await get_login_data("loves", {id: special_pl[0].id})
        if (!loves) {resolve(false)}
        save_data(
            "cache/loves.json",
            JSON.stringify(loves)
        )
        edit_bar("45%", "用户收藏单曲已保存。")
        resolve(true)
    })
}

// 函数：获取并处理歌手数据
function artist(userId, follows) {
    // 获取用户收藏、关注歌手
    edit_bar("50%", "收藏歌手数据请求中......")
    return new Promise(async (resolve) => {
        // collected artists | 用户收藏歌手
        let collected_art = await get_login_data("collected_arts")
        if (!collected_art) {resolve(false)}
        save_data(
            "data/collected_artists.json",
            JSON.stringify(collected_art)
        )
        edit_bar("60%", "收藏歌手数据已保存。")

        // followed artists | 用户关注歌手
        edit_bar("70%", "关注歌手数据数据请求中......")
        let followed_art = await get_login_data("followed_arts",
            {userId: userId, follows: follows})
        if (!followed_art) {resolve(false)}
        save_data(
            "data/followed_artists.json",
            JSON.stringify(followed_art)
        )
        edit_bar("80%", "关注歌手数据已保存。")
        resolve(true)
    })
}

function album() {
    edit_bar("85%", "专辑数据请求中......")
    return new Promise(async (resolve) => {
        let albums = await get_login_data("albums", {page: 1})
        if (!albums) {resolve(false)}
        save_data(
            "data/albums.json",
            JSON.stringify(albums)
        )
        edit_bar("95%", "专辑数据已保存。")
        resolve(true)
    })
}

// 函数：登录主函数
async function login() {
    let user_data = await user()
    if (!user_data) {
        show_notify("用户资料获取错误！")
        return
    }
    var userId = user_data.id
    var follows = user_data.follows

    //————————————————————————————————————————

    // 获取歌单
    let playlist_res = await playlist(userId)
    if (!playlist_res) {
        show_notify("歌单数据获取错误！")
        return
    }
    //————————————————————————————————————————

    // 获取用户收藏、关注歌手
    let artist_res = await artist(userId, follows)
    if (!artist_res) {
        show_notify("歌手数据获取错误！")
        return
    }
    //————————————————————————————————————————

    // 获取专辑
    let album_res = await album()
    if (!album_res) {
        show_notify("收藏专辑数据获取错误！")
        return
    }
    //————————————————————————————————————————

    // 保存用户资料
    user_data = JSON.stringify(user_data)
    save_data("data/user.json", user_data)

    edit_bar("100%", "用户资料已保存。")

    // 切换页面到播放页面 main.html
    setTimeout(() => {
        location.replace("main.html")
    }, 500)
}
