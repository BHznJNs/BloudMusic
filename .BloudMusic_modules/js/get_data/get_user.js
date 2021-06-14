const { post } = require("axios")
const { hide_load } = require("../control_load")

function get_user_login(data) { // 登录
	let url
	if (data.email) {
		url = `http://localhost:3000/login?email=${data.email}&password=${data.password}`
	} else {
		url = `http://localhost:3000/login/cellphone?phone=${data.phone}&password=${data.password}`
	}
	return new Promise((resolve) => {
		geter(
			url,
			4000,
			(res) => {
				resolve({
					id: res.data.account.id, // 用户ID
					name: res.data.profile.nickname, // 用户昵称
					follows: res.data.profile.follows, // 用户关注数
					playlist: res.data.profile.playlistCount, // 用户歌单数
					cookie: res.data.cookie, // Cookie
					avatar_url: res.data.profile.avatarUrl, // 用户头像
					background_url: res.data.profile.backgroundUrl // 用户背景图
				})
			},
			(err) => {
				console.log(err)
				alert("用户信息请求错误！")
				try {hide_load()} catch {}
			}
		)
	})
}
exports.get_user = get_user_login
