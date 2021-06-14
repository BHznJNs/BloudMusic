const { readFile } = require("original-fs")
const { read_file_sync } = require("./general/operate_file")
const { render_nav, render_content } = require("./main_render")

$("#song-name").hide()

// 函数：根据英文，返回对应中文月份
function month_toCn (month) {
    let month_en = [ // 英文月份表
        "Jan", "Feb", "Mar", "Apr",
        "May", "Jun", "Jul", "Aug",
        "Sep", "Oct", "Nov", "Dec"
    ]
    let month_cn = [ // 中文月份表
        "一月", "二月", "三月", "四月",
        "五月", "六月", "七月", "八月",
        "九月", "十月", "十一月", "十二月"
    ]
    let index = month_en.indexOf(month)
    return month_cn[index]
}

// 设置 日推 日期
$(async () => {
    // 获取设备时间
    let date_obj = new Date()
    let UTCstr = date_obj.toUTCString()
    // 获取日期
    let date = UTCstr.split(',')[1].split(' ')
    let month = date[2]
    let day = date[1] 
    // 设置日期
    $("#date-month").text(month_toCn(month))
    $("#date-day").text(day + "日")
})

// 读取并替换用户昵称、头像、背景
$(async () => {
    readFile("data/user.json", "utf8", (err, res) => {
        if (err) {console.log(err); return}

        let data = JSON.parse(res)
        // 设置用户名
        let user_name = data.name
        $("#main-nav-title").text(user_name)
        // 设置用户背景图 & 头图
        let avatar_url = data.avatar_url
        let background_url = data.background_url
        $("#user-avatar").attr("src", avatar_url)
        $("#user-background").attr("src", background_url)
    })
})

// 载入界面时，加载上次播放数据
$(async () => {
    // 读取用户喜欢数据
    read_file_sync(
        "cache/loves.json",
        (res) => {
            let data = JSON.parse(res)
            LOVEs = data
        },
        (err) => {
            console.log("loves.json 不存在！" + err)
        }
    )
    // 读取上次退出保存数据
    readFile("cache/last_played.json", "utf8", (err, res) => {
        if (err) { // 如果上次播放数据保存错误 || 文件不存在
            console.log("last_played.json 不存在！")
            PLAYLIST = LOVEs // 默认将播放列表设为用户收藏单曲
            console.log("PLAYLIST = LOVEs", PLAYLIST)
            render_playlist(PLAYLIST, PLAYLIST.name)
            $("#player")[0].volume = 0.7 // 默认音量
            return
        }
        data = JSON.parse(res)

        PLAYLIST = data.playlist
        PLAY_INDEX = data.play_index
        // 调节音量
        $("#player")[0].volume = data.volume
        // 设定播放模式为上次播放模式
        switch_playMode(data.play_mode)
        // 加载上次播放列表
        render_playlist(PLAYLIST, PLAYLIST.name)
    })
})

// 渲染页面
render_nav()
render_content()
