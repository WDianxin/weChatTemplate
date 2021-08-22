// pages/identitySuccess/identitySuccess.js
const app = getApp();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		sucessBool: true, // 成功标志
		navigationBarTitle: '认证成功'
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.setData({
			type: options.sucessBool,
			pageType: options.pageType, //页面展示类型
			errTitle: options.errTitle == 'null' ? '' : options.errTitle, //失败原因
			customerType: options.customerType, //跳转到新页的入参
			navigationBarTitle: options.navigationBarTitle, //navBar标题
			backPage: options.backPage, //返回页面路径
		})
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		return {
			title: app.globalData.onShareAppMessageTitle,
			path: app.globalData.onShareAppMessagePath
		}
	},
	gotIt(e) {
		let type = e.currentTarget.dataset.url;
		if (this.data.backPage) {
			wx.navigateTo({
				url: this.data.backPage,
			})
		} else if (type === "brack") {
			wx.navigateBack({
				delta: 0,
			})
		} else {
			wx.navigateTo({
				url: `${type}?customerType=${this.data.customerType}`,
			})
		}

	}
})