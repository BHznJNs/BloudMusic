const { sleep } = require("../general/sleep")
const { get_play_data } = require("../get_data/get_play_data")

// 全局变量：是否已分屏
var SPLITED = false
// 全局变量：分屏数据
var SPLIT_DETAIL = {
    id: 0,
    name: "",
    content: []
}
//————————————————————————————————————————
// 函数：分屏切换时触发，隐藏主页面和分屏中内容，动画结束后展示出来
function split() {
    $("#main-scroll").hide()
    $("#split-scroll").hide()
    setTimeout(() => {
        $("#main-scroll").show()
        $("#split-scroll").show()
    }, 800)
}
// 函数：创建新的额外分屏
function new_split() {
    let split_temp = $("div.split-outer").html()
    // 创造元素
    let place_holder = document.createElement("div")
    $(place_holder).html(split_temp)
    let child = $(place_holder.children[0])
    // 插入元素
    $("div.split-outer").append(child)
    // 隐藏原分屏内容
    $("#split:nth-last-child(2) #split-scroll").hide()
}
// 函数：分屏加载       origin_list
function render_split(ori_list, type_) {
    let is_more = false
    let temp, list
    // 根据传入类型选择模板和返回数据
    if (type_ == "albums") {
        temp = "#split-albums-temp"
        list = {
            albums: ori_list.albums,
            album_size: ori_list.album_size,
            page: ori_list.page,
            img_url: ori_list.img_url
        }
    } else {
        temp = "#split-songs-temp"
        list = {
            songs: ori_list.songs,
            img_url: ori_list.img_url
        }
        // 判断是否需要加载更多
        if (ori_list.song_ids.length > ori_list.songs.length) {
            is_more = true
        }
    }
    // 设置分屏菜单栏选项
    let nav_item = $("#split:last-child ul.nav").children()
    if (["album", "playlist"].includes(type_)) {
        nav_item.slice(2, 5).hide()
    } else {
        nav_item.slice(2, 5).show()
    }
    // 编译 & 加载分屏
    renderer(
        temp,
        { list, type_, is_more },
        "#split:last-child #split-scroll"
    )
    // 最后一个分屏回到顶部
    $("#split:last-child #split-scroll")[0].scrollTop = 0
}
// 函数：打开分屏
async function show_split(type_, options={}) {
    //  如果分屏中无元素                                             如果不为 get_data 调用
    if (!$("#split:last-child #split-scroll").children().length && !type_) {return}
    if (options.new_split) {new_split(type_)}
    // 如果已打开分屏
    if (SPLITED) {return}

    split()
    $("#main").addClass("main-fold")
    $("#split").addClass("split-unfold")

    SPLITED = true
}
// 函数：关闭分屏
async function close_split() {
    if (!SPLITED) {return}
    // 如果无额外分屏
    if ($("div.split-outer").children().length == 1) {
        split()
        $("#main").removeClass("main-fold")
        $("#split").removeClass("split-unfold")
        SPLITED = false
    } else { // 如果有额外分屏
        $("#main-scroll").addClass("no-hidden-block") // 防止主界面被隐藏
        split()
        // 隐藏当前最后一个分屏内容
        $("#split:last-child #split-scroll").hide()
        $("#split:last-child").removeClass("split-unfold")

        await sleep(800)
        $("#main-scroll").removeClass("no-hidden-block")
        // 隐藏并移除额外分屏及其内容
        $("#split:nth-last-child(2) #split-scroll").hide()
        $("#split:last-child").remove()
        SPLIT_DETAIL.content.pop()
        await sleep(800)
        // 显示当前最后一个分屏内容
        $("#split:last-child #split-scroll").show()
    }
}
//————————————————————————————————————————
// 函数：点击歌手名在分屏中查看详情
function artist_detail(obj, options={}) {
    let data = $(obj).attr("data-artists")
    data = JSON.parse(data)
    // 如果歌手数大于1，即有多个歌手
    if (data.length > 1) {
        // 展示选择框 & 中止函数
        show_modal(data, options)
        return
    }
    get_detail(data[0].id, "artist", options)
}
// 函数：根据传入类型获取数据    For Albums
function get_data(id, type_, options) {
    return new Promise(async (resolve) => {
        let result
        switch (type_) {
            case "playlist":
                result = await get_play_data(id, "playlist")
                SPLIT_DETAIL.id = result.id
                break
            case "recommend": // 每日推荐
                result = await get_play_data(null, "recommend")
                break
            case "loves": // 用户收藏单曲
                result = LOVEs
                break
            case "followed_art": // 用户关注歌手
                id = await get_artist_data(id)
            case "collected_art": // 用户收藏歌手
            case "artist":
                SPLIT_DETAIL.id = id
                result = await get_play_data(id, type_)
                break
            case "songs": // 歌手热门单曲
                result = await get_play_data(SPLIT_DETAIL.id, type_)
                break
            case "albums": // 歌手专辑
                result = await get_play_data(SPLIT_DETAIL.id, "albums", options)
                break
            case "album": // 专辑中单曲
                result = await get_play_data(id, "album")
                break
        }
        // 设置全局变量 name 值
        SPLIT_DETAIL.name = result.name
        resolve(result)
    })
}
// 函数：打开分屏 & 展示歌单或歌手数据    For Albums
async function get_detail(id, type_, options={}) {
    let list = await get_data(id, type_, options)
    if (!list) {return}
    // 如果不创建新分屏
    if (!options.new_split) {
        // 清空最后一个分屏
        $("#split:last-child #split-scroll").empty()
        // 移除全局变量中数据
        SPLIT_DETAIL.content.pop()
    }
    // 全局变量加入当前播放数据
    SPLIT_DETAIL.content.push(list)
    // 展示分屏
    show_split(type_, options)
    // 分屏加载
    render_split(list, type_)
    // 设置分屏标题及其属性
    $("#split:last-child #split-nav-title").text(SPLIT_DETAIL.name)
    $("#split:last-child #split-nav-title").attr("title", SPLIT_DETAIL.name)
}
// 函数：播放当前分屏中所有单曲
function play_all() {
    //                             取数组最后一个值
    list = SPLIT_DETAIL.content.slice(-1)[0]
    play(0, "songs", {songs: list})
}

exports.SPLIT_DETAIL = SPLIT_DETAIL

exports.split = split
exports.show_split = show_split
exports.close_split = close_split
exports.artist_detail = artist_detail
exports.get_detail = get_detail
exports.play_all = play_all
