// 函数：加载并展示模态框
function show_modal(list, options={}) {
    let temp = $("#modal-temp").text()
    let template = compile(temp)
    console.log(options)
    let html_output = template({ list, options })
    $("#selector div.modal-body").html(html_output)

    $("#selector").addClass("modal-active")
}
// 函数：隐藏模态框
function hide_modal(id, options={}) {
    $("#selector").removeClass("modal-active")
    // 如果返回选择（非 undefined）
    if (id) {get_detail(id, "artist", options)}
}

exports.show_modal = show_modal
exports.hide_modal = hide_modal