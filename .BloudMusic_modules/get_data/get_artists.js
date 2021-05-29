const { get, post } = require("axios")
const { hide_load } = require("../control_load")

// 函数：暂停一段时间
function sleep(time) {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    })
}

// 函数：获取用户收藏歌手 colloected artists
function collected_art(cookie) {
    let url = "http://localhost:3000/artist/sublist"
    return new Promise((resolve) => {
        post(url, cookie).then((res) => {
            let data = res.data.data
            let artists = []
            data.forEach((item) => {
                artists.push({ // 歌手昵称、歌手头像、歌手ID
                    name: item.name,     // 替换 http 为 https
                    img_url: item.img1v1Url.replace("http", "https"),
                    artist_id: item.id
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

// 函数：根据关注的歌手的用户ID获取歌手数据
function get_artist_data(userId) {
    let url = "http://localhost:3000/user/detail?uid=" + userId
    return new Promise((resolve) => {
        get(url).then((res) => {
            let data = res.data.profile
            resolve({ // 歌手昵称、歌手头像、歌手ID
                name: data.nickname,
                img_url: data.avatarUrl,
                artist_id: data.artistId
            })
        }).catch((err) => {
            console.log("歌手数据请求错误！", err)
            alert("歌手数据请求错误！")
            try {hide_load()} catch {}
        })
    })
}
// 函数：使用用户ID，获取已关注歌手的用户ID，返回ID数组
function get_artist_userId(userId, follows) { // followed artists
    let url = `http://localhost:3000/user/follows?uid=${userId}&limit=${follows}`
    return new Promise((resolve) => {
        get(url).then((res) => {
            let artists_id = []
            let all_follows = res.data.follow
            all_follows.forEach((item) => {
                let user_type = item.userType
                if (user_type == 4) {
                    let user_id = item.userId
                    let user_type = item.userType
                    artists_id.push({
                        user_id: user_id,
                        user_type: user_type
                    })
                }
            })
            // 返回已关注歌手ID数组
            resolve(artists_id)
        }).catch((err) => {
            console.log(err)
            alert("关注歌手请求错误！")
            try {hide_load()} catch {}
        })
    })
}
// 函数：使用 get_artist_userId 返回的歌手ID数组，获取歌手数据
function followed_art(userId, follows) {
    return new Promise(async (resolve) => {
        let artists = await get_artist_userId(userId, follows)
        let followed_art = []
        for (var item of artists) {
            if ([2, 4].includes(item.user_type)) {
                let artist_data = await get_artist_data(item.user_id)
                followed_art.push(artist_data)
                await sleep(1000)
            }
        }
        resolve(followed_art)
    })
}
exports.collected_art = collected_art
exports.followed_art = followed_art
