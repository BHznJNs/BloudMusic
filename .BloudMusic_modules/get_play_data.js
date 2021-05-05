function get_playlist(list_id) {
    return new Promise((resolve) => {
        get("http://localhost:3000/playlist/detail?id=" + list_id).then((res) => {
            resolve({
                id: list_id,
                ids: res.data.playlist.trackIds,
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
            let hot_songs = []
            data.forEach((d) => {
                hot_songs.push({
                    id: d.id,
                    name: d.name,
                })
            })
            resolve({
                id: artist_id,
                ids: hot_songs,
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
            let artists = []
            data.ar.forEach((d_a) => {
                artists.push(d_a.name)
            })
            resolve({
                name: data.name,
                id: data.id,
                artist_name: artists.join("__")
            })
        })
    })
}
exports.get_playlist = get_playlist
exports.get_art_hs = get_art_hs
exports.get_song = get_song