const { get, post } = require("axios")
const { hide_load } = require("../control_load")

// 函数：获取用户收藏歌手 colloected artists
function collected_art(cookie) {
    let url = "http://localhost:3000/artist/sublist"
    return new Promise((resolve) => {
        post(url, cookie).then((res) => {
            let data = res.data.data
            let artists = []
            data.forEach((item) => {
                artists.push({ // 歌手昵称、歌手头像、歌手ID
                    name: item.name,
                    artist_id: item.id,
                    img_url: item.img1v1Url.replace("http", "https") // 替换 http 为 https
                })
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
        get(url).then((res) => {
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
        }).catch((err) => {
            console.log(err)
            alert("关注歌手请求错误！")
            try {hide_load()} catch {}
        })
    })
}
exports.collected_art = collected_art
exports.followed_art = followed_art
