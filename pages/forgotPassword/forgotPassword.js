// pages/forgotPassword/forgotPassword.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile: '', //原手机号
    newPassword: '', //新密码
    newPasswordQ: '', //新密码
    dataToke: '', //找回密码专用token
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      mobile: options.mobile, //原手机号
      dataToke: options.dataToke, //找回密码专用token
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
  //点击完成
  completion() {
    let d = app.auth.getHmcId()
    if (this.data.newPassword === '') {
      wx.showToast({
        title: '请输入新的登录密码',
        icon: 'none',
      })
    } else if (this.data.newPasswordQ === '') {
      wx.showToast({
        title: '请再次输入新密码',
        icon: 'none',
      })
    } else if (this.data.newPassword !== this.data.newPasswordQ) {
      wx.showToast({
        title: '两次输入的密码不一致,请重新输入',
        icon: 'none'
      })
    } else if (!app.util.passworderTest(this.data.newPassword)) {
      return false
    } else {
      let obj = {
        hmcId: this.data.mobile,
        newPass: this.data.newPassword,
        token: this.data.dataToke,
        mobile: this.data.mobile,
      }
      wx.showLoading({
        title: '提交中',
      })
      app.reqFetch.log.forgetPassword(obj).then(res => {
        wx.hideLoading()
        if (res.data.code === 1) {
          wx.showToast({
            title: '新密码保存成功,请重新登录',
          })
          setTimeout(function () {
            wx.reLaunch({
              url: '/pages/login/login',
            })
          }, 2000)
        } else {

        }
      }).catch(() => {})
    }
  },

})