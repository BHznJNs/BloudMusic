const { get } = require("axios")
const { hide_load } = require("../control_load")
const { get_playlist_songs } = require("./get_play_data")

// 函数：获取用户歌单
function get_playlist(userId) {
    let url = "http://localhost:3000/user/playlist?uid=" + userId
    return new Promise((resolve) => {
        get(url).then((res) => {
            var data = []
            let playlists = res.data.playlist
            playlists.forEach((list) => {
                data.push({
                    name: list.name,
                    id: list.id,
                    creator: list.creator.nickname,
                    creator_id: list.userId,
                    cover_url: list.coverImgUrl
                })
            })
            resolve(data)
        }).catch((err) => {
            alert("请求错误！")
            try {hide_load()} catch {}
        })
    })
}
// 函数：操作歌单
function filter_playlist(userId, playlists) {
    var mine_pl = [] // 用户创建歌单
    var special_pl = [] // 特殊歌单：用户收藏单曲、音乐雷达
    var collected_pl = [] // 用户收藏歌单

    playlists.forEach((list) => {
        if (playlists.indexOf(list) == 0 || ["云音乐官方歌单", "云音乐私人雷达"].includes(list.creator)) {
            special_pl.push(list)
        } else if (list.creator_id == userId) {
            mine_pl.push(list)
        } else {
            collected_pl.push(list)
        }
    })
    return {
        mine_pl: mine_pl,
        special_pl: special_pl,
        collected_pl: collected_pl
    }
}
exports.get_playlist = get_playlist
exports.filter_playlist = filter_playlist
