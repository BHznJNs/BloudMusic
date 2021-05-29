const { get } = require("axios")

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
    return new Promise((resolve) => {
        get("http://localhost:3000/playlist/detail?id=" + list_id).then((res) => {
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
            alert("歌单请求错误！")
        })
    })
}

// 函数：获取歌手热门歌曲
function get_art_hs(artist_id) { // get artist hot song
    return new Promise((resolve) => {
        get("http://localhost:3000/artists?id=" + artist_id).then((res) => {   
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
                id: artist_id,
                name: res.data.artist.name + " 的热门单曲",
                songs: songs,
                song_ids: song_ids,
                type_: "artist"
            })
        }).catch((err) => {
            console.log(err)
            alert("歌手数据请求错误！")
        })
    })
}
// function get_art_al(artist_id) { // get artist albums

// }
// 函数：获取并返回单曲信息
function get_song(song_id) {
    return new Promise((resolve) => {
        get("http://localhost:3000/song/detail?ids=" + song_id).then((res) => {
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
            alert("歌曲请求错误！")
        })
    })
}

// 函数：获取日推
function get_recommends() {
    return new Promise((resolve) => {
        get("http://localhost:3000/recommend/songs").then((res) => {
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
            alert("每日推荐获取失败！")
        })
    })
}

exports.get_playlist_songs = get_playlist_songs
exports.get_art_hs = get_art_hs
exports.get_song = get_song
exports.get_recommends = get_recommends
