// const FS = require("fs")
const { access, mkdir, rmdirSync } = require("fs")
const { F_OK } = require("fs").constants

function exist_dir(path, callback_err, callback) {
    access(path, F_OK, (err) => {
        if (err) {
            // 若文件夹不存在，则执行
            callback_err()
        } else {
            // 若文件夹存在，则执行
            callback()
        }
    })
}

function make_dir(path) {
    exist_dir(
        path,
        // 若文件夹不存在，则创建
        () => {
            mkdir(path, (err) => {
                if (err) {
                    throw err
                }  
            })
        },
        () => {console.log("File \"" + path + "\" exist!")}
    )
}
function del_dir(path, callback, callback_err) {
    try {
        rmdirSync(path, {recursive: true})
        callback()
    } catch (err) {
        callback_err()
    }
}

exports.make_dir = make_dir
exports.exist_dir = exist_dir
exports.del_dir = del_dir
