const { post } = require("axios")
const { hide_load } = require("./control_load")

function get_user_login(data) { // 登录
	return new Promise((resolve) => {
		if (data.email) {
			var url = "http://localhost:3000/login"
		} else {
			var url = "http://localhost:3000/login/cellphone"
		}
	
		post(url, data).then((res) => {
			resolve({
				id: res.data.account.id,
				name: res.data.profile.nickname,
				follows: res.data.profile.follows,
				playlist: res.data.profile.playlistCount,
				cookie: res.data.cookie
			})
		}).catch((err) => {
			alert("请求错误！")
			try {hide_load()} catch {}
		})
	})
}
// get_user(data)
exports.get_user = get_user_login
