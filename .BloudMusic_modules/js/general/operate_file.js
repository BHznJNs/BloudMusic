const { access, accessSync, writeFileSync, readFileSync, mkdir } = require("fs")
const { F_OK } = require("fs").constants
const { get, CancelToken } = require("axios")

const { show_notify } = require("../units/notify")

// 函数：同步保存数据
function save_data(path, data, callback_err) {
    try {
        writeFileSync(path, data, "utf8")
    } catch(err) {
        console.log(err)
        if (callback_err) {
            callback_err()
        }
    }
}

// 第一个 then：将返回的图片二进制信息转为 base64 编码
// 第二个 then：将第一个 then 返回的 base64 解码，保存到文件
// 函数：通过 URL 下载图片
function save_img(url, path) {
    show_notify("图片开始下载。")
    let cancel
    get(url, {
        timeout: 8000,
        cancelToken: new CancelToken(function executor(c) {
            cancel = c
        }),
        responseType: "arraybuffer"
    }).then((response) => 
        new Buffer.from(response.data, 'binary').toString('base64')
    ).then((ret) => {
        writeFileSync(path, atob(ret), "binary")
        show_notify("图片下载完成。")
    }).catch((err) => {
        cancel()
        console.log("图片下载失败。" + err)
        show_notify("图片下载失败。")
    })
}
// 函数：同步读取文件封装
function read_file_sync(path, callback, callback_err=()=>{}) {
    try {
        let data = readFileSync(path, "utf8")
        callback(data)
    } catch (err) {
        console.log(err)
        callback_err(err)
    }
}
// 函数：异步检测文件是否存在
function exist_file(path, callback, callback_err=()=>{}) {
    access(path, F_OK, (err) => {
        if (err) {
            // 若文件夹不存在，则执行
            callback_err(err, path)
        } else {
            // 若文件夹存在，则执行
            callback(path)
        }
    })
}
// 函数：同步检测文件是否存在
function exist_file_sync(path, callback, callback_err) {
    try {
        accessSync(path, F_OK)
        callback()
    } catch (err) {
        callback_err(err)
    }
}

exports.save_data = save_data
exports.save_img = save_img

exports.read_file_sync = read_file_sync

exports.exist_file = exist_file
exports.exist_file_sync = exist_file_sync
