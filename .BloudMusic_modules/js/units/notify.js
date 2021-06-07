// 函数：展示消息
async function show_notify(content) {
    let temp = $("#notification-temp").text()
    let template = compile(temp)
    let html_output = template({ content })

    let place_holder = document.createElement("div")
    $(place_holder).html(html_output)
    // 添加节点
    let child = $(place_holder.children[0])
    $("#notification").append(child)
    $(child).addClass("toast-active")
    // 定时 8 秒后关闭
    setTimeout(() => {
        close_notify(child.find("div.close"))
    }, 8000)
}
// 函数：关闭消息
async function close_notify(obj) {
    let parent = $(obj).parents(".toast")
    $(parent).removeClass("toast-active")
    setTimeout(() => {
        $(parent).remove()
    }, 400)
}
exports.show_notify = show_notify
exports.close_notify = close_notify
