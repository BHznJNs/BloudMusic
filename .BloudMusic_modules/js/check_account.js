function check_account() {
    let account_num = $("#account-num").val()
    let password = $("#password").val()

    if (account_num.indexOf("@") !== -1 && password.length !== 0) {
        return { // 帐号为邮箱帐号时
            email: account_num,
            password: password
        }
    } else if (account_num.replace(/[^0-9]/ig, "") == account_num && password.length !== 0) {
        return { // 帐号为手机号时
            phone: account_num,
            password: password
        }
    } else {
        alert("输入有错误哟～")
        return false
    }
}
exports.check_account = check_account
