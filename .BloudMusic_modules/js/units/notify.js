// 函数：展示消息
async function show_notify(content, time=8000) {
    let place_holder = document.createElement("div")
    renderer(
        "#notification-temp",
        { content },
        place_holder
    )
    // 添加节点
    let child = $(place_holder.children[0])
    $("#notification").append(child)
    $(child).addClass("toast-active")
    // 定时 8 秒后关闭
    setTimeout(() => {
        close_notify(child.find("div.close"))
    }, time)
}
// 函数：关闭消息
async function close_notify(obj) {
    // 查找并获取父元素
    let parent = $(obj).parents(".toast")
    // 移除类，隐藏元素
    $(parent).removeClass("toast-active")
    setTimeout(() => {
        // 移除元素
        $(parent).remove()
    }, 400)
}
exports.show_notify = show_notify
exports.close_notify = close_notify
