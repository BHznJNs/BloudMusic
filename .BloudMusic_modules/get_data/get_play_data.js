const { get } = require("axios")

function get_artists(data) {
    let artists = []
    data.forEach((d) => {
        artists.push(d.name)
    })
    return artists.join(" & ")
}

function get_playlist(list_id) {
    return new Promise((resolve) => {
        get("http://localhost:3000/playlist/detail?id=" + list_id).then((res) => {
            let song_ids = []
            res.data.playlist.trackIds.forEach((t) => {
                song_ids.push(t.id)
            })
            let songs = []
            res.data.playlist.tracks.forEach((t) => {
                let artists = get_artists(t.ar)
                songs.push({
                    id: t.id,
                    name: t.name,
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

function get_art_hs(artist_id) { // get artist hot song
    return new Promise((resolve) => {
        get("http://localhost:3000/artists?id=" + artist_id).then((res) => {
            let data = res.data.hotSongs
            let song_ids = []
            let songs = []
            data.forEach((d) => {
                song_ids.push(d.id)
                let artists = get_artists(d.ar)
                songs.push({
                    id: d.id,
                    name: d.name,
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
function get_song(song_id) {
    return new Promise((resolve) => {
        get("http://localhost:3000/song/detail?ids=" + song_id).then((res) => {
            let data = res.data.songs[0]

            // 判断有无版权
            let song_name = data.name
            if (data.noCopyrightRcmd != null && data.copyright != 0) {
                song_name += "(无版权)"
            }

            let artists = get_artists(data.ar)
            resolve({
                name: song_name,
                id: data.id,
                artist_name: artists
            })
        })
    })
}
exports.get_playlist = get_playlist
exports.get_art_hs = get_art_hs
exports.get_song = get_song
