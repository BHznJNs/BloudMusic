const { get } = require("axios")
const { hide_load } = require("../control_load")

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
// 函数：筛选歌单
function filter_playlist(userId, playlists) { //operate playlist array
    var mine_pl = [] // my playlists
    var special_pl = [] // 
    var collected_pl = [] // my collected playlists

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
