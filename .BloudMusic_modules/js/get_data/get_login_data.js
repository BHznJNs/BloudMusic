const { geter } = require("../general/geter")
const { get_artists, get_album_data } = require("./get_general")

// const TYPEs = [
//     "user", "playlists",
//     "loves",
//     "collected_arts", "followed_arts",
//     "albums"
// ]

// 函数：操作分类歌单
function classify_playlist(playlists, userId) {
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
        mine_pl,
        special_pl,
        collected_pl
    }
}

// 函数：根据传入类型返回对应 URL 和 timeout
function selector(type_, options={}) {
    let url /* 返回的 URL */, timeout /* 返回的延时 */
    switch (type_) {
        case "user":
            if (options.email) {
                url = `http://localhost:3000/login?email=${options.email}&password=${options.password}`
            } else {
                url = `http://localhost:3000/login/cellphone?phone=${options.phone}&password=${options.password}`
            }
            timeout = 6000
            break
        case "playlists":
            url = "http://localhost:3000/user/playlist?uid=" + options.userId
            break
        case "loves":
            url = "http://localhost:3000/playlist/detail?id=" + options.id
            break
        case "collected_arts":
            url = "http://localhost:3000/artist/sublist"
            break
        case "followed_arts":
            url = `http://localhost:3000/user/follows?uid=${options.userId}&limit=${options.follows}`
            break
        case "albums":
            url = "http://localhost:3000/album/sublist"
            timeout = 6000
            break
    }
    if (["playlists", "loves", "collected_art", "followed_art"].includes(type_)) {
        timeout = 20000
    }
    return {url, timeout}
}

function res_func(res, type_, options={}) {
    return new Promise(async (resolve) => {
        switch (type_) {
            case "user":
                resolve({
                    id: res.data.account.id, // 用户ID
                    name: res.data.profile.nickname, // 用户昵称
                    follows: res.data.profile.follows, // 用户关注数
                    playlist: res.data.profile.playlistCount, // 用户歌单数
                    cookie: res.data.cookie, // Cookie
                    avatar_url: res.data.profile.avatarUrl, // 用户头像
                    background_url: res.data.profile.backgroundUrl // 用户背景图
                })
                break
            case "playlists":
                let playlists = []
                res.data.playlist.forEach((list) => {
                    playlists.push({
                        name: list.name,
                        id: list.id,
                        creator: list.creator.nickname,
                        creator_id: list.userId,
                        cover_url: list.coverImgUrl
                    })
                })
                resolve(classify_playlist(playlists, options.userId))
                break
            case "loves":
                let playlist = res.data.playlist
                // 获取歌单中所有单曲 ID
                let song_ids = playlist.trackIds.map(item => item.id)
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
                    id: options.id, // 歌单 ID
                    name: playlist.name, // 歌单名称
                    songs: songs, // 歌单中单曲列表
                    song_ids: song_ids, // 歌单中单曲 ID 列表
                    type_: "loves" // 返回数据类型
                })
                break
            case "collected_arts":
                let artists = []
                res.data.data.forEach((item) => {
                    artists.push({
                        name: item.name, // 歌手昵称
                        artist_id: item.id, // 歌手ID
                        img_url: item.img1v1Url.replace("http", "https") // 歌手头像
                    }) //                       替换 http 为 https
                })
                resolve(artists)
                break
            case "followed_arts":
                let artists_ids = []
                let all_follows = res.data.follow
                all_follows.forEach((item) => {
                    if ([2, 4].includes(item.userType)) {
                        artists_ids.push({ // 歌手昵称、歌手头像、歌手ID
                            name: item.nickname,
                            user_id: item.userId,
                            img_url: item.avatarUrl.replace("http", "https")
                        })
                    }
                })
                // 返回已关注歌手ID数组
                resolve(artists_ids)
                break
            case "albums":
                let albums = res.data.data.map(item => get_album_data(item))
                resolve(albums)
                break
        }
    })
}

function get_login_data(type_, options={}) {
    let req = selector(type_, options)
    return new Promise((resolve) => {
        geter(
            req.url,
            req.timeout,
            async (res) => {
                let result = await res_func(res, type_, options)
                resolve(result)
            },
            (err) => {
                console.error(err)
                hide_load()
                resolve(false)
            }
        )
    })
}
exports.get_login_data = get_login_data
