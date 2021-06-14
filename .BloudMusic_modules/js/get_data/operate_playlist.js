const { hide_load } = require("../control_load")

// 函数：获取用户歌单
function get_playlist(userId) {
    let url = "http://localhost:3000/user/playlist?uid=" + userId
    return new Promise((resolve) => {
        geter(
            url,
            10000,
            (res) => {
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
            },
            (err) => {
                console.log(err)
                alert("请求错误！")
                try {hide_load()} catch {}
            }
        )
    })
}
// 函数：获取歌单中单曲
function get_playlist_songs(list_id) {
    let url = "http://localhost:3000/playlist/detail?id=" + list_id
    return new Promise((resolve) => {
        geter(
            url,
            10000,
            (res) => {
                let playlist = res.data.playlist
                // 获取歌单中所有单曲 ID
                let song_ids = []
                playlist.trackIds.forEach((item) => {
                    song_ids.push(item.id)
                })
                // 获取歌单中所有单曲信息
                let songs = []
                playlist.tracks.forEach((item) => {
                    let artists = get_artists(item.ar)
                    songs.push({
                        id: item.id, // 单曲 ID
                        name: item.name, // 单曲名称
                        album: {
                            id: item.al.id, // 单曲所在专辑名称
                            name: item.al.name, // 单曲所在专辑 ID
                            cover_url: item.al.picUrl // 单曲所在专辑封面
                        },
                        artists: artists // 歌手信息
                    })
                })
                resolve({
                    id: list_id,// 歌单 ID
                    name: playlist.name, // 歌单名称
                    songs: songs, // 歌单中单曲列表
                    song_ids: song_ids, // 歌单中单曲 ID 列表
                    type_: "playlist" // 返回数据类型
                })
            },
            (err) => {
                console.log("歌单请求错误！" + err)
                // 如果处于登录界面
                if (location.href.includes("login.html")) {
                    alert("歌单请求错误！")
                } else { // 如果处于主界面
                    show_notify("歌单请求错误！")
                }
            }
        )
    })
}

// 函数：操作过滤歌单
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
exports.get_playlist_songs = get_playlist_songs
exports.filter_playlist = filter_playlist
