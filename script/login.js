window.$ = window.jQuery = require("jquery")

const { show_load, hide_load } = require("../.BloudMusic_modules/control_load")
const { check_account } = require("../.BloudMusic_modules/check_account")
const { get_user } = require("../.BloudMusic_modules/get_data/get_user")
const { save_data } = require("../.BloudMusic_modules/general/operate_file")
const { make_dir } = require("../.BloudMusic_modules/general/operate_dir")
const { get_playlist, filter_playlist } = require("../.BloudMusic_modules/get_data/operate_playlist")
const { collected_art, followed_art } = require("../.BloudMusic_modules/get_data/get_artists")

// 如果 “data” 与 “cache” 文件夹不存在，则创建
make_dir("data")
make_dir("cache")

function edit_bar(bar_length, text) { // edit progress bar
    $("#progress-bar").width(bar_length)
    $("#progress-text").text(text)
}

// 主函数
async function to_login() {
    let data = check_account()
    if (data) {
        show_load()
    } else {return 0}
    edit_bar("5%", "用户资料获取中......")

    // 获取用户信息
    let user_data = await get_user(data)

    try {
        var userId = user_data.id
        var cookie = user_data.cookie
        var follows = user_data.follows
    } catch {
        alert("用户资料请求错误！")
        hide_load()
    }

    let user = JSON.stringify(user_data)
    save_data("data/user.json", user)

    edit_bar("25%", "用户资料已保存。")
    //——————————————————————————————————

    // 获取歌单
    edit_bar("30%", "歌单数据获取中......")
    let playlists = await get_playlist(userId)
    // 歌单分类
    let filtered_pl = filter_playlist(userId, playlists)
    // 保存用户创建的歌单
    if (filtered_pl.mine_pl[0].name) {
        save_data(
            "data/created_playlists.json",
            JSON.stringify(filtered_pl.mine_pl)            
        )
    }
    edit_bar("45%", "用户创建歌单数据已保存。")
    // 如果 checkbox get-specials-pl 被选中
    if ($("#get-specials-pl").prop("checked")) {
        if (filtered_pl.special_pl[0].name) {
            save_data(
                "data/special_playlists.json",
                JSON.stringify(filtered_pl.special_pl)
            )
        }
    }
    // 如果 checkbox get-collected-pl 被选中
    if ($("#get-collected-pl").prop("checked")) {
        if (filtered_pl.collected_pl[0].name) {
            save_data(
                "data/collected_playlists.json",
                JSON.stringify(filtered_pl.collected_pl)
            )
        }
    }
    edit_bar("60%", "用户收藏歌单数据已保存。")
    //———————————————————————————————————————————————

    // 获取用户关注歌手
    // 如果 checkbox get-follows 被选中
    edit_bar("65%", "关注数据请求中，请稍等......")
    if ($("#get-follows").prop("checked")) {
        // user collected artists 用户收藏歌手
        let user_collected_art = await collected_art(cookie)
        save_data(
            "data/collected_artists.json",
            JSON.stringify(user_collected_art)
        )
        edit_bar("75%", "收藏歌手数据已保存。")
        // user followed artists 用户关注歌手
        let user_followed_art = await followed_art(userId, follows)
        save_data(
            "data/followed_artists.json",
            JSON.stringify(user_followed_art)
        )
        edit_bar("95%", "关注歌手数据已保存。")
    }  
    //———————————————————————————————————————————————————————

    edit_bar("100%", "请求完成！")
    
    setTimeout(() => {
        location.replace("main.html")
    }, 500)
}
