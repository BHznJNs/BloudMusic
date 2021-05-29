const { access, accessSync, writeFileSync, createWriteStream, readFile, readFileSync, mkdir } = require("fs")
const { F_OK } = require("fs").constants
const Axios = require("axios")

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
function save_img(url, path) {
    Axios({
        method: "get",
        url: url,
        responseType:'stream'
    }).then((res) => {
        res.data.pipe(createWriteStream(path))
    }).catch((err) => {
        console.log(err)
        alert("图片下载失败！")
    })
}


function read_file_sync(path, callback, callback_err) {
    try {
        let data = readFileSync(path, "utf8")
        callback(data)
    } catch (err) {
        console.log(err)
        callback_err(err)
    }
}
// 函数：异步检测文件是否存在
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
// 函数：同步检测文件是否存在
function exist_file_sync(path, callback, callback_err) {
    try {
        accessSync(path, F_OK)
        callback()
    } catch (err) {
        callback_err(err)
    }
}
// 函数：异步创建文件夹
function make_dir(path) {
    exist_file(
        path,
        // 若文件夹不存在，则创建
        () => {
            mkdir(path, (err) => {
                if (err) {
                    console.log(err)
                }  
            })
        },
        () => {console.log("File \"" + path + "\" exist!")}
    )
}

exports.save_data = save_data
exports.save_img = save_img

exports.read_file_sync = read_file_sync

exports.exist_file = exist_file
exports.exist_file_sync = exist_file_sync

exports.make_dir = make_dir
