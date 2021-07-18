const { geter } = require("./general/geter");
const { show_notify } = require("./units/notify");

/*
    TYPEs = [
        "album", "playlist",
        "collected_art", "followed_art"
    ]
*/

/*
id : 专辑 id

t : 1 为收藏,其他为取消收藏

接口地址 : /album/sub

调用例子 : /album/sub?t=1 /album/sub?t=0
*/

function res_func(id, type_, bool) {
    let list, ids
    switch (type_) {
        case "album":
            list = albums.albums
            ids = albums.ids
            break
    }
    let index = ids.indexOf(id)
    if (bool) {
        list.splice(index, 1)
        ids.splice(index, 1)
    } else {
        let album = SPLIT_DETAIL.content.slice(-1)[0]
        list.unshift({
            id: album.id,
            name: album.name,
            cover_url: album.cover_url
        })
        ids.unshift(album.id)
    }
}
// 函数：根据传入类型选择对应的返回值
function selector(id, type_, bool) {
    let url, succeed_text, err_message
    switch (type_) {
        case "album":
            let t
            if (bool) {
                t = 0
                succeed_text = "收藏专辑"
                err_message = "专辑取消收藏失败"
            } else {
                t = 1
                succeed_text = "取消收藏"
                err_message = "专辑收藏失败"
            }                                                      /* 使用时间戳，防止请求缓存 */
            url = `http://localhost:3000/album/sub?id=${id}&t=${t}&timestamp=${new Date().getTime()}`
            break
    }
    return {
        url,
        succeed_text, // 成功后按钮文本
        err_message, // 错误信息
    }
}
// 函数：切换 （歌单/歌手/）专辑 收藏状态
function toggle_collect(obj, id, type_, bool) {
    bool = Number(bool)
    $(obj).css("pointer-events", "none")
    let req = selector(id, type_, bool)
    return new Promise((resolve) => {
        geter(
            req.url,
            4000,
            (res) => {
                $(obj).text(req.succeed_text)
                $(obj).attr("data-is-included", Number(!Number(bool)))
                res_func(res, type_, bool)
            },
            (err) => {
                show_notify(req.err_message)
                console.log(req.err_message)
                console.error(err)
            }
        )
        $(obj).css("pointer-events", "auto")
        resolve()
    })
}
exports.toggle_collect = toggle_collect
