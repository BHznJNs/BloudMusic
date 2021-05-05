const { get, post } = require("axios")
const { hide_load } = require("./control_load")

function sleep(time) {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    })
}

function collected_art(cookie) { // colloected artists
    let url = "http://localhost:3000/artist/sublist"
    return new Promise((resolve) => {
        post(url, cookie).then((res) => {
            let data = res.data.data
            let artists = []
            data.forEach((d) => {
                artists.push({
                    name: d.name,
                    img_url: d.img1v1Url,
                    artist_id: d.id
                })
            })
            resolve(artists)
        }).catch((err) => {
            alert("请求错误！")
            try {hide_load()} catch {}
        })
    })
}

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
            alert("请求错误！")
            try {hide_load()} catch {}
        })
    })
}
function get_artist_userId(userId, follows) { // followed artists
    let url = "http://localhost:3000/user/follows?uid=" + userId + "&limit=" + follows
    return new Promise((resolve) => {
        get(url).then((res) => {
            let artists_id = []
            let all_follows = res.data.follow
            all_follows.forEach((af) => {
                let user_type = af.userType
                if (user_type == 4) {
                    let userId = af.userId
                    artists_id.push(userId)
                }  
            })
            resolve(artists_id)
        }).catch((err) => {
            alert("请求错误！")
            try {hide_load()} catch {}
        })
    })
}
function followed_art(userId, follows) {
    return new Promise(async (resolve) => {
        let artists_id = await get_artist_userId(userId, follows)
        let followed_art = []
        for (var a in artists_id) {
            let artist_data = await get_artist_data(artists_id[a])
            followed_art.push(artist_data)
            await sleep(1000)
        }
        resolve(followed_art)
    })
}
exports.collected_art = collected_art
exports.followed_art = followed_art
