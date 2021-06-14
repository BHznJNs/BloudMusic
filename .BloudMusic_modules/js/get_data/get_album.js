// 函数：获取歌手专辑
function get_albums(artist_id, page) {
    url = `http://localhost:3000/artist/album?id=${artist_id}&limit=20&offset=${page*20 - 20}`
    return new Promise((resolve) => {
        geter(
            url,
            6000,
            (res) => {
                let albums = []
                res.data.hotAlbums.forEach((item) => {
                    albums.push({
                        id: item.id,
                        name: item.name,
                        cover_url: item.picUrl
                    })
                })
                resolve({
                    id: artist_id,
                    name: res.data.artist.name,
                    img_url: res.data.artist.picUrl, // 歌手图像
                    page: page,
                    albums: albums, // 专辑数据
                    album_size: res.data.artist.albumSize // 歌手专辑数
                })
            },
            (err) => {
                console.log("歌手专辑请求错误！" + err)
                show_notify("歌手专辑请求错误！")
                resolve(false)
            }
        )
    })
}
// 函数：获取专辑中单曲
function get_album_songs(id) {
    let url = "http://localhost:3000/album?id=" + id
    return new Promise((resolve) => {
        geter(
            url,
            6000,
            (res) => {
                let songs = []
                let song_ids = []
                res.data.songs.forEach((item) => {
                    let artists = get_artists(item.ar)
                    songs.push({
                        id: item.id, // 单曲 ID
                        name: item.name, // 单曲名称
                        album: {
                            id: item.al.id, // 单曲所在专辑名称
                            name: item.al.name, // 单曲所在专辑 ID
                            cover_url: item.al.picUrl, // 单曲所在专辑封面
                        },
                        artists: artists // 歌手信息
                    })
                    song_ids.push(item.id)
                })
                resolve({
                    id: id, // 专辑 ID
                    name: res.data.album.name, // 专辑名称
                    songs: songs, // 专辑中单曲
                    song_ids: song_ids, // 专辑中单曲 ID
                    type_: "album" // 返回数据类型
                })
            },
            (err) => {
                console.log("专辑内容请求错误！" + err)
                show_notify("专辑内容请求错误！")
            }
        )
    })
}
exports.get_albums = get_albums
exports.get_album_songs = get_album_songs
