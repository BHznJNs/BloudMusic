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
                artists.push({
                    name: item.name,
                    img_url: item.img1v1Url,
                    artist_id: item.id
                })
            })
            resolve(artists)
        }).catch((err) => {
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
            resolve({
                name: data.nickname,
                img_url: data.avatarUrl,
                artist_id: data.artistId
            })
        }).catch((err) => {
            alert("歌手数据请求错误！")
            try {hide_load()} catch {}
        })
    })
}
// 函数：获取已关注歌手的用户ID，返回ID数组
function get_artist_userId(userId, follows) { // followed artists
    let url = "http://localhost:3000/user/follows?uid=" + userId + "&limit=" + follows
    return new Promise((resolve) => {
        get(url).then((res) => {
            let artists_id = []
            let all_follows = res.data.follow
            all_follows.forEach((item) => {
                let user_type = item.userType
                if (user_type == 4) {
                    let userId = item.userId
                    artists_id.push(userId)
                }  
            })
            resolve(artists_id)
        }).catch((err) => {
            alert("关注歌手请求错误！")
            try {hide_load()} catch {}
        })
    })
}
function followed_art(userId, follows) {
    return new Promise(async (resolve) => {
        let artists_id = await get_artist_userId(userId, follows)
        let followed_art = []
        for (var artist_id of artists_id) {
            let artist_data = await get_artist_data(artist_id)
            followed_art.push(artist_data)
            await sleep(1000)
        }
        resolve(followed_art)
    })
}
exports.collected_art = collected_art
exports.followed_art = followed_art
