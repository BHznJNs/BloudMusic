const { get } = require("axios")
const { show_notify } = require("../main_render")

// 函数：从输入中获取所有歌手名字
function get_artists(data) {
    let artists = []
    data.forEach((item) => {
        artists.push(item.name)
    })
    return artists.join(" & ")
}

// 函数：获取歌单信息
function get_playlist_songs(list_id) {
    let url = "http://localhost:3000/playlist/detail?id=" + list_id
    return new Promise((resolve) => {
        get(url).then((res) => {
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
                    id: item.id,
                    name: item.name,
                    artists: artists
                })
            })
            resolve({
                id: list_id,
                name: playlist.name,
                songs: songs,
                song_ids: song_ids,
                type_: "playlist"
            })
        }).catch((err) => {
            console.log(err)
            if (location.href.includes("login.html")) {
                alert("歌单请求错误！")
            } else {
                show_notify("歌单请求错误！")
            }
        })
    })
}

// 函数：根据关注的歌手的用户ID获取歌手数据
function get_artist_data(userId) {
    let url = "http://localhost:3000/user/detail?uid=" + userId
    return new Promise((resolve) => {
        get(url).then((res) => {
            let data = res.data.profile
            // 返回歌手的歌手ID（artist ID）
            resolve(data.artistId)
        }).catch((err) => {
            console.log("歌手数据请求错误！", err)
            show_notify("歌手数据请求错误！")
            try {hide_load()} catch {}
        })
    })
}
// 函数：获取歌手热门歌曲
async function get_art_hs(id, type_) { // get artist hot song
    // 如果输入是用户关注歌手
    if (type_ == "followed_art") {
        var id = await get_artist_data(id)
    }
    let url = "http://localhost:3000/artists?id=" + id
    return new Promise((resolve) => {
        get(url).then((res) => {
            let hot_songs = res.data.hotSongs

            let song_ids = []
            let songs = []
            hot_songs.forEach((item) => {
                song_ids.push(item.id)
                let artists = get_artists(item.ar)
                songs.push({
                    id: item.id,
                    name: item.name,
                    artists: artists
                })
            })
            resolve({
                id: id,
                name: res.data.artist.name + " 的热门单曲",
                songs: songs,
                song_ids: song_ids,
                type_: "artist"
            })
        }).catch((err) => {
            console.log(err)
            show_notify("歌手数据请求错误！")
        })
    })
}
// function get_art_al(artist_id) { // get artist albums

// }
// 函数：获取并返回单曲信息
function get_song(song_id) {
    let url = "http://localhost:3000/song/detail?ids=" + song_id
    return new Promise((resolve) => {
        get(url).then((res) => {
            let data = res.data.songs[0]
            let privileges = res.data.privileges[0]

            var copyright = true
            var VIP = false
            // 判断有无版权
            if (data.noCopyrightRcmd != null && data.copyright != 0) {
                var copyright = false
            }
            // 判断是否付费专享
            if (privileges.fee == 1 || privileges.st < 0 && privileges.payed == 0) {
                var VIP = true
            }

            let artists = get_artists(data.ar)
            resolve({
                name: data.name,
                id: data.id,
                copyright: copyright,
                VIP: VIP,
                artist_name: artists
            })
        }).catch((err) => {
            console.log(err)
            show_notify("歌曲请求错误！")
        })
    })
}

// 函数：获取日推
function get_recommends() {
    let url = "http://localhost:3000/recommend/songs"
    return new Promise((resolve) => {
        get(url).then((res) => {
            let data = res.data.data.dailySongs
            let songs = []
            let song_ids = []
            data.forEach((item) => {
                let artists = get_artists(item.ar)
                songs.push({
                    id: item.id,
                    name: item.name,
                    artists: artists
                })
                song_ids.push(item.id)
            })
            // console.log(data);
            resolve({
                id: 0,
                name: "每日推荐",
                songs: songs,
                song_ids: song_ids,
                type_: "recommend"
            })
        }).catch((err) => {
            console.log(err)
            show_notify("每日推荐获取失败！")
        })
    })
}

exports.get_playlist_songs = get_playlist_songs
exports.get_art_hs = get_art_hs
exports.get_song = get_song
exports.get_recommends = get_recommends
