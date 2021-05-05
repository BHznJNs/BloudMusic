const { ipcRenderer } = require("electron")

function get_path_sync() {
    return new Promise((resolve) => {
        ipcRenderer.send("openDialog")

        ipcRenderer.on("selectedItem", (event, files)=>{
            // console.log(files) //输出选择的文件
            resolve(files)
        })
    })
}

async function get_path_dialog() {
    $("body").css("pointer-events", "none")
    let path = await get_path_sync()
    $("body").css("pointer-events", "auto")
}
exports.get_path_dialog = get_path_dialog
