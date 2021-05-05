const { compile } = require("ejs")
const { exist_file_sync, read_file_sync } = require("./operate_file")

var exist_created_pl
var exist_collected_pl
var exist_artists
exist_file_sync(
    "data/created_playlists.json",
    () => {exist_created_pl = true},
    () => {exist_created_pl = false}
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


async function render_nav() {
    let temp = $("#nav-temp").text()
    let template = compile(temp)
    let html_output = template({exist_created_pl, exist_collected_pl, exist_artists})
    $("#nav-items").html(html_output)
}


var created_pls
var collected_pls
var artists = []
function get_data() {
    if (exist_created_pl) {
        read_file_sync(
            "data/created_playlists.json",
            (res) => {created_pls = JSON.parse(res)},
            () => {console.log("Read created_playlists.json error!")}
        )
    }
    if (exist_collected_pl) {
        read_file_sync(
            "data/collected_playlists.json",
            (res) => {collected_pls = res},
            () => {console.log("Read collected_plsaylists.json error!")}
        )
    }
    collected_pls = JSON.parse(collected_pls)
    if (exist_artists) {
        read_file_sync(
            "data/collected_artists.json",
            (res) => {artists = JSON.parse(res)},
            () => {console.log("Read collected_artists.json error!")}
        )
        read_file_sync(
            "data/followed_artists.json",
            (res) => {
                res = JSON.parse(res)
                artists = artists.concat(res) // 数组合并
            },
            () => {console.log("Read followed_artists.json error!")}
        )
    }
}
async function render_content() {
    let temp = $("#scroll-temp").text()
    let template = compile(temp)

    get_data()

    let html_output = template({
        exist_created_pl, exist_collected_pl,
        exist_artists,
        created_pls,collected_pls,
        artists
    })
    $("#scroll").html(html_output)
}
exports.render_nav = render_nav
exports.render_content = render_content
