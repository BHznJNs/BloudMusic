const { get, CancelToken } = require("axios")
// 对 axios 中 get 函数的简单封装
function geter(url, time, callback, callback_err) {
    let cancel
    get(url, {
        timeout: time,
        cancelToken: new CancelToken(function executor(c) {
            cancel = c
        })
    }).then((res) => {
        callback(res)
    }).catch((err) => {
        cancel()
        callback_err(err)
    })
}
exports.geter = geter
