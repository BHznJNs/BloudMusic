const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron')
const { join } = require('path')

const { exist_file } = require("./.BloudMusic_modules/operate_file")

// 绑定打开文件选择框事件
ipcMain.on("openDialog",(event) => {
    dialog.showOpenDialog({
    }).then((result) => {
        console.log(result.filePaths) //输出结果
		event.reply("selectedItem", result.filePaths)
    })
})
//———————————————————————————————————————————————————
// 切换全屏
ipcMain.on("toggle_fullscreen", (event) => {
	if (Win.isFullScreen()) {
		Win.setFullScreen(false)
	} else {
		Win.setFullScreen(true)
	}
})
//———————————————————————————————————————————————————
var Win
function createWindow () {
	Win = new BrowserWindow({
		// width: 800,
		// height: 480,
		icon: join(__dirname, "./imgs/icons/CloudMusic_icon.png"),
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			// preload: join(__dirname, 'script/preload.js')
		}
	})
	exist_file(
		"data/user.json",
		() => {Win.loadFile('templates/login.html')},
		() => {Win.loadFile('templates/main.html')}
	)
}

app.whenReady().then(() => {
	createWindow()

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow()
		}
	})
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})
