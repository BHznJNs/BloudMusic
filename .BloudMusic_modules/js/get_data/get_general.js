// 数据获取通用函数

// 函数：从输入中获取所有歌手名字
function get_artists(data) {
    let detail = []
    let names = []
    data.forEach((item) => {
        detail.push({ // 歌手 ID，歌手名称
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
function check_play(res) {
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
    return !(no_copyright || need_VIP)
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
// 函数：根据输入获取专辑信息
function get_album_data(album) {
    return {
        id: album.id, // 专辑 ID
        name: album.name, // 专辑名称
        cover_url: album.picUrl // 专辑封图 URL
    }
}
exports.get_artists = get_artists
exports.check_play = check_play
exports.get_artist_data = get_artist_data
exports.get_album_data = get_album_data
