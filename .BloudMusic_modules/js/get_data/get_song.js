// 函数：获取并返回多个单曲信息
function get_songs(ids=[]) {
    let song_ids = ids.join(",")
    let url = "http://localhost:3000/song/detail?ids=" + song_ids
    return new Promise((resolve) => {
        geter(
            url,
            6000,
            (res) => {
                let songs = []
                res.data.songs.forEach((item) => {
                    let artists = get_artists(item.ar)
                    songs.push({ // 单曲ID，单曲名，歌手数据
                        id: item.id, // 单曲ID
                        name: item.name, // 单曲名
                        album: {
                            id: item.al.id, // 专辑 ID
                            name: item.al.name, // 专辑名称
                            cover_url: item.al.picUrl // 专辑封图 URL
                        },
                        artists: artists // 歌手数据
                    })
                })
                resolve(songs)
            },
            (err) => {
                console.log("歌曲信息请求错误！" + err)
                show_notify("歌曲信息请求错误！")
                resolve(false)
            }
        )
    })
}
// 函数：获取并返回单曲信息
function get_song(song_id) {
    let url = "http://localhost:3000/song/detail?ids=" + song_id
    return new Promise((resolve) => {
        geter(
            url,
            4000,
            (res) => {
                let data = res.data.songs[0]
                let album = data.al
                // 判断是否可播放
                let can_be_played_ = can_be_played(res)
                let [no_copyright, VIP] = [can_be_played_.no_copyright, can_be_played_.VIP]
                // 整理歌手数据
                let artists = get_artists(data.ar)
                resolve({
                    id: data.id, // 单曲 ID
                    name: data.name, // 单曲名称
                    no_copyright: no_copyright, // 有无版权
                    VIP: VIP, // 是否需要 VIP
                    album: {
                        id: album.id, // 专辑 ID
                        name: album.name, // 专辑名称
                        cover_url: album.picUrl // 专辑封图 URL
                    },
                    artists: artists // 歌手数据
                })
            },
            (err) => {
                console.log("歌曲信息请求错误！" + err)
                show_notify("歌曲信息请求错误！")
                resolve(false)
            }
        )
    })
}
exports.get_song = get_song
exports.get_songs = get_songs
