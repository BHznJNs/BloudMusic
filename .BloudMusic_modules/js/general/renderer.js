const { compile } = require("ejs")

// 函数：编译模板，加载界面
function renderer (temp_id="", data={}, target_id="") {
    // 获取模板
    let temp = $(temp_id).text()
    // 编译模板
    let template = compile(temp)

    let html_output = template(data)
    $(target_id).html(html_output)
}
exports.renderer = renderer
