const { post } = require("axios")
const { hide_load } = require("../control_load")

// 函数：获取用户收藏歌手 colloected artists
function collected_art(cookie) {
    let url = "http://localhost:3000/artist/sublist"
    return new Promise((resolve) => {
        post(url, cookie).then((res) => {
            let data = res.data.data
            let artists = []
            data.forEach((item) => {
                artists.push({
                    name: item.name, // 歌手昵称
                    artist_id: item.id, // 歌手ID
                    img_url: item.img1v1Url.replace("http", "https") // 歌手头像
                }) //                       替换 http 为 https
            })
            resolve(artists)
        }).catch((err) => {
            console.log("收藏歌手请求错误！", err)
            alert("收藏歌手请求错误！")
            try {hide_load()} catch {}
        })
    })
}
// 函数：使用用户ID，获取已关注歌手的用户ID，返回ID数组
function followed_art(userId, follows) { // followed artists
    let url = `http://localhost:3000/user/follows?uid=${userId}&limit=${follows}`
    return new Promise((resolve) => {
        geter(
            url,
            10000,
            (res) => {
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
            },
            (err) => {
                console.log(err)
                alert("关注歌手请求错误！")
                try {hide_load()} catch {}
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
                            name: item.al.name,
                            cover_url: item.al.picUrl
                        },
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
exports.collected_art = collected_art
exports.followed_art = followed_art
exports.get_hotSongs = get_hotSongs
