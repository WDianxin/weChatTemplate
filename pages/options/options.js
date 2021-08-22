// pages/options/options.js
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {

	},
	//页面跳转
	goToURL(event) {
		let url = event.target.dataset.url;
		let type = event.target.dataset.type;
		wx.navigateTo({
			url: url + '?type=' + type,
		})
	},
	//退出登录
	outLogin() {
		let hmcId = app.auth.getHmcId();
		if (!hmcId) return
		wx.showLoading({
			title: '退出中',
			mask: true
		})
		// 调取退出登录接口
		app.reqFetch.log.unbindOpenId(hmcId).then(res => {
			wx.hideLoading()
			if (res.data.code === 1) {
				try {
					wx.clearStorageSync();
					wx.clearStorage();
				} catch (e) {}
				wx.showToast({
					title: res.data.msg,
				})
				setTimeout(function () {
					wx.redirectTo({
						url: '/pages/login/login',
					})
				}, 1500)
			}
		}).catch(() => {})
	},


	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

	},
	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		return {
			title: app.globalData.onShareAppMessageTitle,
			path: app.globalData.onShareAppMessagePath
		}
	}
})