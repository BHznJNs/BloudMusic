// 函数：判断音乐是否添加过喜欢，并切换喜欢图标
function toggle_love_icon() {
    // 如果音乐添加过喜欢
    var love_obj = $("#love")
    if (LOVEs.song_ids.includes(Number(PLAY_INFO.id))) {
        love_obj.attr("data-loved", "true")
        love_obj.attr("title", "已喜欢")
        love_obj.attr("src", "../imgs/icons/loved.svg")
    } else { // 如果音乐未添加过喜欢
        love_obj.attr("data-loved", "false")
        love_obj.attr("title", "添加喜欢")
        love_obj.attr("src", "../imgs/icons/love.svg")
    }
}
// 函数：向服务器请求 添加 / 删除 喜欢
function request_love(id, bool) {
    let cancel
    let url = `http://localhost:3000/like?id=${id}&like=${bool}`
    return new Promise((resolve) => {
        get(url, {
            timeout: 4000,
            cancelToken: new CancelToken(function executor(c) {
                cancel = c
            })
        }).then(() => {
            resolve(true)
        }).catch((err) => { // 超时
            cancel()
            console.log("切换喜欢超时!", err)
            resolve(false)
        })
    })
}
// 函数：操作喜欢列表
function operate_love(bool) {
    let id = PLAY_INFO.id
    if (bool) { // 将单曲添加入喜欢列表
        LOVEs.song_ids.unshift(id)
        LOVEs.songs.unshift(PLAY_INFO)
    } else { // 将单曲从喜欢列表移除
        let index = LOVEs.song_ids.indexOf(id)
        LOVEs.song_ids.splice(index, 1)
        if (index <= LOVEs.songs.length - 1) {
            LOVEs.songs.splice(index, 1)
        }
    }
}
// 函数：切换音乐喜欢状态
function toggle_love() {
    // 判断是否存在正在播放
    if (PLAY_INFO.name == "" || $("#player").src == "") {
        show_notify("你未在播放音乐，无法添加喜欢。")
        return
    }

    let love_obj = $("#love")
    // 判断是否添加喜欢过
    // 如果未添加喜欢，将添加喜欢
    if (love_obj.attr("data-loved") == "false") {
        var loved = true
        var message = `单曲 ${PLAY_INFO.name} 已添加喜欢。`
        var fail_message = "添加喜欢失败。"
    } else { // 如果已添加喜欢，将取消喜欢
        var loved = false
        var message = `单曲 ${PLAY_INFO.name} 已取消喜欢。`
        var fail_message = "取消喜欢失败。"
    }
    // 切换图标 & 请求服务器
    love_obj.fadeOut(300, async () => {
        love_obj.css("pointer-events", "none") // 禁用喜欢按钮
        var res = await request_love(PLAY_INFO.id, loved)

        if (res) { // 如果请求成功
            operate_love(loved) // 操作喜欢列表
            toggle_love_icon() // 切换图标
            show_notify(message)
        } else { // 如果请求 失败 || 超时
            show_notify(fail_message)
        }

        love_obj.fadeIn(300, () => { // 取消禁用
            love_obj.css("pointer-events", "auto")
        })
    })
}
exports.toggle_love_icon = toggle_love_icon
exports.toggle_love = toggle_love
