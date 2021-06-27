const { app, BrowserWindow, dialog, Menu, ipcMain } = require("electron")
const { join } = require("path")

const { exist_file } = require("./.BloudMusic_modules/js/general/operate_file")

// 函数：获取图片保存路径
function get_path(filename) {
	return dialog.showSaveDialogSync(main_win, {
		title: "选择保存图片路径",
		defaultPath: filename.split('==/')[1]
	})
}

// 事件监听：图片下载右键菜单
ipcMain.on("img-download-menu", (event, url) => {
	const imgDl_temp = [
		{
			label: "图片下载",
			click: () => {event.reply("save-data", {
				url: url,
				path: get_path(url)
			})}
		}
	]
	const menu = Menu.buildFromTemplate(imgDl_temp)
	menu.popup(BrowserWindow.fromWebContents(event.sender))
})
//————————————————————————————————————————

// 事件监听：切换全屏
ipcMain.on("toggle_fullscreen", () => {
	if (main_win.isFullScreen()) {
		main_win.setFullScreen(false)
	} else {
		main_win.setFullScreen(true)
	}
})
//————————————————————————————————————————

// 显示播放小部件
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

	// 返回播放控件 id 到渲染进程
	event.reply("reply_widgetWin_id", play_widget.id)
	// 隐藏主窗口
	main_win.hide()
	// 事件监听：关闭播放控件时显示主窗口
	play_widget.on("closed", () => {
		main_win.show()
	})
	// 播放控件加载 HTML 文件
	play_widget.loadFile("templates/play_widget.html")	
})
// 事件监听：关闭播放控件
ipcMain.on("close_play_widget", () => {
	play_widget.close()
})
//————————————————————————————————————————

// 函数：创建主窗口
var main_win
function create_window () {
	main_win = new BrowserWindow({
		minWidth: 720,
		minHeight: 480,
		show: false, // 显示窗口
		autoHideMenuBar: true, // 自动隐藏系统菜单栏，用 alt 键启用
		icon: join(__dirname, "./imgs/icons/CloudMusic_icon.png"),
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		}
	})
	// 事件监听：主窗口加载完成后显示
	main_win.once("ready-to-show",() => {
		main_win.show()
	})
	// 事件监听：当主窗口关闭时，退出 electron 程序
	main_win.once("closed", () => {
		if (process.platform !== "darwin") {
			app.quit()
		}
	})
	// 检查是否存在 data/user.json 文件
	exist_file(
		"data/user.json",
		() => {main_win.loadFile("templates/main.html")},
		() => {main_win.loadFile("templates/login.html")}
	)
}

app.whenReady().then(() => {
	create_window()
	// 清除 缓存
	// session.defaultSession.clearCache()

	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length == 0) {
			create_window()
		}
	})
})
// 事件监听：当窗口全部被关闭时，退出 electron 程序
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit()
	}
})
