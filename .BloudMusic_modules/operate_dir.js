const FS = require("fs")

function exist_dir(path, callback_err, callback) {
    FS.access(path, FS.constants.F_OK, (err) => {
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
            FS.mkdir(path, FS.constants.F_OK, (err) => {
                if (err) {
                    throw err
                }  
            })
        },
        () => {console.log("File \"" + path + "\" exist!")}
    )
}
exports.make_dir = make_dir
exports.exist_dir = exist_dir
