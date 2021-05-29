const { app, BrowserWindow, dialog, Menu, ipcMain, Tray, session } = require('electron')
const { join } = require('path')

const { exist_file } = require("./.BloudMusic_modules/general/operate_file")

// 绑定打开文件选择框事件
// ipcMain.on("openDialog",(event) => {
//     dialog.showOpenDialog({
//     }).then((result) => {
//         console.log(result.filePaths) //输出结果
// 		event.reply("selectedItem", result.filePaths)
//     })
// })
//———————————————————————————————————————————————————

// 事件监听：切换全屏
ipcMain.on("toggle_fullscreen", () => {
	if (main_win.isFullScreen()) {
		main_win.setFullScreen(false)
	} else {
		main_win.setFullScreen(true)
	}
})
//———————————————————————————————————————————————————

// 显示 / 关闭 播放小部件
var play_widget
ipcMain.on("show_play_widget", (event) => {
	play_widget = new BrowserWindow({
		width: 200,
		height: 80,
		x: 20,
		y: 20,
		frame: false,
		resizable: false,
		alwaysOnTop: true,
		icon: join(__dirname, "./imgs/icons/CloudMusic_icon.png"),
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		}
	})

	// 返回播放控件 id
	event.reply("reply_widgetWin_id", play_widget.id)

	main_win.hide()
	play_widget.on("closed", () => {
		main_win.show()
	})
	play_widget.loadFile("templates/play_widget.html")	
})
// 关闭播放控件
ipcMain.on("close_play_widget", () => {
	play_widget.close()
})
//———————————————————————————————————————————————————

// 函数：创建主窗口
var main_win
function create_window () {
	// 隐藏系统窗口菜单
	// Menu.setApplicationMenu(null)
	main_win = new BrowserWindow({
		minWidth: 600,
		minHeight: 400,
		show: false,
		icon: join(__dirname, "./imgs/icons/CloudMusic_icon.png"),
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		}
	})
	// 主窗口加载完成后显示
	main_win.once('ready-to-show',() => {
		main_win.show()
	})
	// 当主窗口关闭时，退出 electron 程序
	main_win.once("closed", () => {
		if (process.platform !== 'darwin') {
			app.quit()
		}
	})
	exist_file(
		"data/user.json",
		() => {main_win.loadFile('templates/login.html')},
		() => {main_win.loadFile('templates/main.html')}
	)
}

app.whenReady().then(() => {
	create_window()
	// 清除 缓存
	// session.defaultSession.clearCache()

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length == 0) {
			create_window()
		}
	})
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})
