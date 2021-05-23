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
function get_playlist(list_id) {
    return new Promise((resolve) => {
        get("http://localhost:3000/playlist/detail?id=" + list_id).then((res) => {        
            let song_ids = []
            res.data.playlist.trackIds.forEach((item) => {
                song_ids.push(item.id)
            })
            let songs = []
            res.data.playlist.tracks.forEach((item) => {
                let artists = get_artists(item.ar)
                songs.push({
                    id: item.id,
                    name: item.name,
                    artists: artists
                })
            })
            resolve({
                id: list_id,
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
            let data = res.data.hotSongs
            let song_ids = []
            let songs = []
            data.forEach((item) => {
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

            let song_name = data.name
            // 判断有无版权
            if (data.noCopyrightRcmd != null && data.copyright != 0) {
                song_name += "(无版权)"
            }
            // 判断是否付费专享
            if (res.data.privileges[0].fee == 1) {
                song_name += "[付费专享]"
            }

            let artists = get_artists(data.ar)
            resolve({
                name: song_name,
                id: data.id,
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

exports.get_playlist = get_playlist
exports.get_art_hs = get_art_hs
exports.get_song = get_song
exports.get_recommends = get_recommends
