const { readFile } = require("fs")
const { render_nav, render_content } = require("./main_render")

$("#song-name").hide()

// 设置 日推 日期
$(async () => {
    let date_obj = new Date()
    let UTCstr = date_obj.toUTCString()
    
    let date = UTCstr.split(",")[1].split(" ")
    let month = date[2]
    let day = date[1]
    switch (month) {
        case "Jan":
            mouth = "一月"
            break
        case "Feb":
            month = "二月"
            break
        case "Mar":
            month = "三月"
            break
        case "Apr":
            month = "四月"
            break
        case "May":
            month = "五月"
            break
        case "Jun":
            month = "六月"
            break
        case "Jul":
            month = "七月"
            break
        case "Aug":
            month = "八月"
            break
        case "Sep":
            month = "九月"
            break
        case "Oct":
            month = "十月"
            break
        case "Nov":
            month = "十一月"
            break
        case "Dec":
            month = "十二月"
            break
    }
    $("#date-month").text(month)
    $("#date-day").text(day + "日")
})

// 替换用户昵称、头像、背景
$(async () => {
    readFile("data/user.json", "utf8", (err, res) => {
        if (err) {console.log(err); return}

        let data = JSON.parse(res)

        let user_name = data.name
        $("#nav-title").text(user_name)

        let avatar_url = data.avatar_url
        let background_url = data.background_url
        $("#user-avatar").attr("src", avatar_url)
        $("#user-background").attr("src", background_url)
    })
})

// 渲染页面
render_nav()
render_content()
