const { geter } = require("../general/geter")
const { show_notify } = require("../units/notify")

// 函数：从输入中获取所有歌手名字
function get_artists(data) {
    let detail = []
    let names = []
    data.forEach((item) => {
        detail.push({
            id: item.id,
            name: item.name
        })
        names.push(item.name)
    })
    return {
        detail: detail,
        name: names.join(" & ")
    }
}
// 函数：判断单曲是否可播放
function can_be_played(res) {
    let data = res.data.songs[0]
    let privileges = res.data.privileges[0]
    let [no_copyright, need_VIP] = [false, false]

    // 判断有无版权
    if (data.noCopyrightRcmd != null && data.copyright != 0) {
        no_copyright = true
    }
    // 判断是否付费专享
    if (privileges.fee == 1 || privileges.st < 0 && privileges.payed == 0) {
        need_VIP = true
    }
    return {
        no_copyright: no_copyright,
        VIP: need_VIP
    }
}
// 函数：根据关注的歌手的用户ID获取歌手数据
function get_artist_data(userId) {
    let url = "http://localhost:3000/user/detail?uid=" + userId
    return new Promise((resolve) => {
        geter(
            url,
            4000,
            (res) => {
                let data = res.data.profile
                // 返回歌手的歌手ID（artist ID）
                resolve(data.artistId)
            },
            (err) => {
                console.log("歌手数据请求错误！", err)
                show_notify("歌手数据请求错误！")
            }
        )
    })
}
//————————————————————————————————————————
// 函数：获取歌单信息
function get_playlist_songs(list_id) {
    let url = "http://localhost:3000/playlist/detail?id=" + list_id
    return new Promise((resolve) => {
        geter(
            url,
            6000,
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
                        id: item.id,
                        name: item.name,
                        album: {
                            id: item.al.id,
                            name: item.al.name
                        },
                        cover_url: item.al.picUrl,
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
            },
            (err) => {
                console.log("歌单请求错误！" + err)
                if (location.href.includes("login.html")) {
                    alert("歌单请求错误！")
                } else {
                    show_notify("歌单请求错误！")
                }
            }
        )
    })
}
// 函数：获取歌手热门歌曲
async function get_hotSongs(id) {
    let url = "http://localhost:3000/artists?id=" + id
    return new Promise((resolve) => {
        geter(
            url,
            6000,
            (res) => {
                let hot_songs = res.data.hotSongs

                let song_ids = []
                let songs = []
                hot_songs.forEach((item) => {
                    song_ids.push(item.id)
                    let artists = get_artists(item.ar)
                    songs.push({
                        id: item.id,
                        name: item.name,
                        album: {
                            id: item.al.id,
                            name: item.al.name
                        },
                        cover_url: item.al.picUrl,
                        artists: artists
                    })
                })
                resolve({
                    id: id,
                    name: res.data.artist.name,
                    songs: songs,
                    song_ids: song_ids,
                    img_url: res.data.artist.picUrl,
                    type_: "artist"
                })
            },
            (err) => {
                console.log("歌手数据请求错误！" + err)
                show_notify("歌手数据请求错误！")
            }
        )
    })
}
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
                    img_url: res.data.artist.picUrl,
                    page: page,
                    albums: albums,
                    album_size: res.data.artist.albumSize
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
                        id: item.id,
                        name: item.name,
                        album: {
                            id: item.al.id,
                            name: item.al.name
                        },
                        cover_url: item.al.picUrl,
                        artists: artists
                    })
                    song_ids.push(item.id)
                })
                resolve({
                    id: id,
                    name: res.data.album.name,
                    songs: songs,
                    song_ids: song_ids,
                    type_: "album"
                })
            },
            (err) => {
                console.log("专辑内容请求错误！" + err)
                show_notify("专辑内容请求错误！")
            }
        )
    })
}
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
                        id: item.id,
                        name: item.name,
                        artists: artists,
                        album: {
                            id: item.al.id,
                            name: item.al.name
                        },
                        cover_url: item.al.picUrl
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

                let can_be_played_ = can_be_played(res)
                let [no_copyright, VIP] = [can_be_played_.no_copyright, can_be_played_.VIP]

                let artists = get_artists(data.ar)
                resolve({
                    id: data.id,
                    name: data.name,
                    no_copyright: no_copyright,
                    VIP: VIP,
                    artists: artists.detail,
                    artist_name: artists.name
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

// 函数：获取日推
function get_recommends() {
    let url = "http://localhost:3000/recommend/songs"
    return new Promise((resolve) => {
        geter(
            url,
            6000,
            (res) => {
                let data = res.data.data.dailySongs
                let songs = []
                let song_ids = []
                data.forEach((item) => {
                    let artists = get_artists(item.ar)
                    songs.push({
                        id: item.id,
                        name: item.name,
                        artists: artists,
                        album: {
                            id: item.al.id,
                            name: item.al.name
                        },
                        cover_url: item.al.picUrl
                    })
                    song_ids.push(item.id)
                })
                resolve({
                    id: 0,
                    name: "每日推荐",
                    songs: songs,
                    song_ids: song_ids,
                    type_: "recommend"
                })
            },
            (err) => {
                console.log("每日推荐获取失败！" + err)
                show_notify("每日推荐获取失败！")
            }
        )
    })
}

exports.get_artist_data = get_artist_data

exports.get_playlist_songs = get_playlist_songs
exports.get_hotSongs = get_hotSongs
exports.get_albums = get_albums
exports.get_album_songs = get_album_songs
exports.get_song = get_song
exports.get_songs = get_songs
exports.get_recommends = get_recommends
