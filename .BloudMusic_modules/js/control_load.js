function show_load() {
    $("button.btn").attr("disabled", true)
    $("#progress").height("100vh")
    $("div.progress-bar").addClass("progress-bar-animated")
}
function hide_load() {
    $("button.btn").attr("disabled", false)
    $("#progress").height("0vh")
    $("div.progress-bar").removeClass("progress-bar-animated")
}
exports.show_load = show_load
exports.hide_load = hide_load
