const { access, accessSync, writeFileSync, createWriteStream, readFile, readFileSync } = require("fs")
const { F_OK } = require("fs").constants
const Axios = require("axios")

function save_data(path, data) {
    try {
        writeFileSync(path, data, "utf8")
    } catch(err) {
        console.log(err)
    }
}
function save_img(url, path) {
    Axios({
        method: "get",
        url: url,
        responseType:'stream'
    }).then((res) => {
        res.data.pipe(createWriteStream(path))
    })
}

function read_file(path, callback_err, callback) {
    readFile(path, "utf8", (err, res) => {
        if (err) {
            callback_err(err)
        } else {
            callback(res)
        }
    })
}
function read_file_sync(path, callback, callback_err) {
    try {
        let data = readFileSync(path, "utf8")
        callback(data)
    } catch (err) {
        callback_err(err)
    }
}

function exist_file(path, callback_err, callback) {
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

exports.read_file = read_file
exports.read_file_sync = read_file_sync

exports.exist_file = exist_file
exports.exist_file_sync = exist_file_sync
