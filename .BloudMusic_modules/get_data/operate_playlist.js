const { get } = require("axios")
const { hide_load } = require("../control_load")

// 获取用户歌单
function get_pl(userId) {
    let url = "http://localhost:3000/user/playlist?uid=" + userId
    return new Promise((resolve) => {
        get(url).then((res) => {
            var data = []
            let playlists = res.data.playlist
            for (var p in playlists) {
                let playlist = playlists[p]
                data.push({
                    name: playlist.name,
                    id: playlist.id,
                    creator_id: playlist.userId,
                    cover_url: playlist.coverImgUrl
                })
            }
            resolve(data)
        }).catch((err) => {
            alert("请求错误！")
            try {hide_load()} catch {}
        })
    })
}
// 筛选歌单
function filter_pl(userId, playlists) { //operate playlist array
    var mine_pl = [] // my playlists
    var collected_pl = [] // my collected playlists

    playlists.forEach((list) => {
    if (list.creator_id == userId) {
        mine_pl.push(list)
    } else {
        collected_pl.push(list)
    }
    })
    return {
        mine_pl: mine_pl,
        collected_pl: collected_pl
    }
}
exports.get_pl = get_pl
exports.filter_pl = filter_pl
