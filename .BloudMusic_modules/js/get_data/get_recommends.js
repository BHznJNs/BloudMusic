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
                            name: item.al.name,
                            cover_url: item.al.picUrl
                        }
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
exports.get_recommends = get_recommends
