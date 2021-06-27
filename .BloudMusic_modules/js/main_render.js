const { exist_file_sync, read_file_sync } = require("./general/operate_file")

var exist_created_pl, exist_special_pl
var exist_collected_pl, exist_artists
var exist_albums
// 函数：获取并加载页面顶栏
async function render_nav() {
    exist_file_sync(
        "data/created_playlists.json",
        () => {exist_created_pl = true},
        () => {exist_created_pl = false}
    )
    exist_file_sync(
        "data/created_playlists.json",
        () => {exist_special_pl = true},
        () => {exist_special_pl = false}
    )
    exist_file_sync(
        "data/collected_playlists.json",
        () => {exist_collected_pl = true},
        () => {exist_collected_pl = false}
    )
    exist_file_sync(
        "data/collected_artists.json",
        () => {exist_artists = true},
        () => {exist_artists = false}
    )
    exist_file_sync(
        "data/albums.json",
        () => {exist_albums = true},
        () => {exist_albums = false},
    )

    renderer(
        "#nav-temp",
        {
            exist_created_pl, exist_special_pl,
            exist_collected_pl, exist_artists,
            exist_albums
        },
        "#main-nav-items"
    )
}

var created_pls, special_pls,collected_pls
var [collected_arts, followed_arts, albums] = [[], [], []]
// 函数：读取歌单及歌手数据
function get_data() {
    if (exist_created_pl) { // 用户创建歌单
        read_file_sync(
            "data/created_playlists.json",
            (res) => {created_pls = JSON.parse(res)},
            () => {console.log("读取用户创建歌单错误！")}
        )
    }
    if (exist_special_pl) { // 用户收藏音乐、日推、音乐雷达
        read_file_sync(
            "data/special_playlists.json",
            (res) => {special_pls = JSON.parse(res)},
            () => {console.log("读取用户收藏音乐、日推、音乐雷达错误！");}
        )
    }
    if (exist_collected_pl) { // 用户收藏歌单
        read_file_sync(
            "data/collected_playlists.json",
            (res) => {collected_pls = JSON.parse(res)},
            () => {console.log("读取用户收藏歌单错误！")}
        )
    }
    if (exist_artists) {
        read_file_sync( // 用户收藏歌手
            "data/collected_artists.json",
            (res) => {collected_arts = JSON.parse(res)},
            () => {console.log("读取用户收藏歌手错误！")}
        )
        read_file_sync( // 用户关注歌手
            "data/followed_artists.json",
            (res) => {followed_arts = JSON.parse(res)},
            () => {console.log("读取用户关注歌手错误！")}
        )
    }
    if (exist_albums) {
        read_file_sync(
            "data/albums.json",
            (res) => {albums = JSON.parse(res)},
            () => {console.log("读取用户收藏专辑错误！")}
        )
    }
}
// 函数：界面主要内容编译及加载
async function render_content() {
    get_data()
    renderer(
        "#scroll-temp",
        {
            exist_created_pl, exist_special_pl,
            exist_collected_pl, exist_artists,
            exist_albums,
            created_pls, special_pls,
            collected_pls,
            collected_arts, followed_arts,
            albums
        },
        "#main-scroll"
    )
}

// 函数：播放列表界面加载
async function render_playlist(list, list_name) {
    // 判断是否需要加载更多
    let is_more = false
    if (list.song_ids.length > list.songs.length) {
        is_more = true
    }

    // list = list.songs
    renderer(
        "#playlist-songs-temp",
        { list, is_more },
        "#playlist-songs"
    )
    $("#playlist-name").text("播放列表：" + list_name)
    $("#playlist-name").attr("title", list_name)
}
exports.render_nav = render_nav
exports.render_content = render_content
exports.render_playlist = render_playlist
