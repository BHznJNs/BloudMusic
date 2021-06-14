const { get_artists, check_play } = require("./get_general")

var TYPEs = [
    "song", "load_more", "songs",
    "album", "albums",
    "collected_art", "followed_art", "artist",
    "playlist", "recommend"
]
// 函数：根据传入类型返回对应 URL 和 timeout
function selector(id ,type_, options={}) {
    let url, timeout
    switch (type_) {
        case "load_more":
            id = [...id].join(",")
        case "song":
            url = "http://localhost:3000/song/detail?ids=" + id
            timeout = 4000
            break
        case "album":
            url = "http://localhost:3000/album?id=" + id
            break
        case "albums":
            let page = options.page
            url = `http://localhost:3000/artist/album?id=${id}&limit=20&offset=${page*20 - 20}`
            break
        case "songs":
        case "artist":
        case "collected_art":
        case "followed_art":
            url = "http://localhost:3000/artists?id=" + id
            break
        case "playlist":
            url = "http://localhost:3000/playlist/detail?id=" + id
            break
        case "recommend":
            url = "http://localhost:3000/recommend/songs"
            break
    }
    if (["songs", "album", "albums", "collected_art", "followed_art", "playlist", "recommend"]) {
        timeout = 6000
    }
    return {
        url: url,
        timeout: timeout
    }
}
// 函数：处理多单曲详情数据
function get_songs(res, song_list, type_) {
    let songs = []
    song_list.forEach((item) => {
        let artists = get_artists(item.ar)
        songs.push({
            id: item.id,
            name: item.name,
            artists: artists,
            album: {
                id: item.al.id,
                name: item.al.name,
                cover_url: item.al.picUrl
            }
        })
    })
    if (type_ == "song") {
        let can_be_played = check_play(res)
        songs[0].can_be_played = can_be_played
    }
    return songs
}

// 函数：单曲列表数据处理
function res_func(id, res, type_, options) {
    let song_list /* 单曲列表 */, id_list /* 单曲 ID 列表（仅 playlist） */
    let song_ids = []
    let songs, name
    let result = {}
    switch (type_) {
        case "song":
        case "load_more":
            song_list = res.data.songs
            songs = get_songs(res, song_list, type_)
            return songs
        case "album": // 专辑中单曲
            song_list = res.data.songs
            name = res.data.album.name
            result.img_url = res.data.album.picUrl
            break
        case "albums":
            let albums = []
            let album_list = res.data.hotAlbums
            album_list.forEach((item) => {
                albums.push({
                    id: item.id,
                    name: item.name,
                    cover_url: item.picUrl
                })
            })
            return {
                id: id, // 歌手 ID
                name: res.data.artist.name, // 歌手名称
                img_url: res.data.artist.picUrl, // 歌手图像
                page: options.page, // 页数，每页 20
                albums: albums, // 专辑数据
                album_size: res.data.artist.albumSize // 歌手专辑数
            }
        case "songs": // 歌手热门单曲
        case "artist": // 歌手
        case "collected_art": // 用户收藏歌手
        case "followed_art": // 用户关注歌手
            song_list = res.data.hotSongs
            name = res.data.artist.name
            result.img_url = res.data.artist.picUrl
            type_ = "artist"
            break
        case "playlist":
            song_list = res.data.playlist.tracks
            id_list = res.data.playlist.trackIds
            result.img_url = res.data.playlist.coverImgUrl
            name = res.data.playlist.name
            break
        case "recommend":
            song_list = res.data.data.dailySongs
            name = "每日推荐"
            break
    }
    songs = get_songs(res, song_list)
    if (id_list) {
        song_ids = id_list.map(item => item.id)
    } else {
        song_ids = songs.map(item => item.id)
    }

    result.id = id
    result.name = name
    result.songs = songs
    result.song_ids = song_ids
    result.type_ = type_
    result.options = options
    return result
}
// 函数：请求错误时执行
function err_func(err, type_) {
    let err_messages = [
        "歌曲信息请求错误！", "更多单曲加载错误！", "歌曲信息请求错误！",
        "专辑内容请求错误！", "歌手专辑请求错误！",
        "歌手数据请求错误！", "歌手数据请求错误！", "歌手数据请求错误！",
        "歌单请求错误！", "每日推荐获取失败！"
    ]
    let err_message = err_messages[TYPEs.indexOf(type_)]
    console.log(err_message)
    console.error(err)
    show_notify(err_message)
}
// 主函数：获取播放数据
function get_play_data(id, type_, options={}) {
    let req = selector(id, type_, options)
    return new Promise((resolve) => {
        geter(
            req.url,
            req.timeout,
            (res) => {
                let result = res_func(id, res, type_, options)
                resolve(result)
            },
            (err) => {
                err_func(err, type_)
                if (type_ == "song") {
                    resolve(false)
                }
            }
        )
    })
}
exports.get_play_data = get_play_data
