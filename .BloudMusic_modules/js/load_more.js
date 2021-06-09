const { get_songs } = require("./get_data/get_play_data")

// 函数：判断是否需要加载并获取数据
function get_data(list) {
    // 赋值
    let [songs, song_ids] = [list.songs, list.song_ids]
    // 判断加载的单曲 ID
    return new Promise(async (resolve) => {
        let target
        if (song_ids.length == songs.length) {
            resolve(false)
        } else if (song_ids.length - songs.length < 10) {
            target = await get_songs(song_ids.slice(songs.length))
        } else {
            target = await get_songs(song_ids.slice(songs.length, songs.length + 10))
        }
        resolve(target)
    })
}

// 函数：加载更多                     origin_list
async function load_more(obj, temp, ori_list) {
    // 设置加载框属性
    $(obj).text("加载中...")
    $(obj).css("pointer-events", "none")

    let parent = $(obj).parent() // 获取父元素
    let list = { // 获取额外数据
        songs: await get_data(ori_list),
        img_url: false
    }
    // 设置加载框属性
    $(obj).text("加载更多")
    $(obj).css("pointer-events", "auto")

    if (!list) {return} // 如果请求错误
    $(parent).children("div.load-more").remove() // 去除加载按钮
    ori_list.songs = [...ori_list.songs, ...list.songs] // 合并数组
    // 界面编译及加载
    let is_more = false
    if (ori_list.song_ids.length > ori_list.songs.length) {
        is_more = true
    }
    let place_holder = document.createElement("div")
    let type_ = "load_more"
    renderer( // 加载界面
        temp,
        { list, is_more, type_ },
        place_holder
    )
    // 插入节点
    let child = $(place_holder.children)
    $(parent).append(child)
}
exports.load_more = load_more
