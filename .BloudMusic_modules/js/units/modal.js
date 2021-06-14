// 函数：加载并展示模态框
function show_modal(list, options={}) {
    renderer(
        "#modal-temp",
        { list, options },
        "#selector div.modal-body"
    )
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
