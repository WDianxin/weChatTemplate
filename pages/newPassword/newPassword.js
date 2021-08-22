// pages/newPassword/newPassword.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    original: '', //原始密码
    newPassword: '', //新密码
    newPasswordQ: '', //新密码
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
    if (this.data.original === '') {
      wx.showToast({
        title: '请输入原始密码',
        icon: 'none',
      })
    } else if (this.data.newPassword === '') {
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
      wx.showLoading({
        title: '提交中',
      })
      app.reqFetch.log.modifyPassword(this.data.original.toString(), this.data.newPassword.toString()).then(res => {
        wx.hideLoading()
        if (res.data.code === 1) {
          wx.showToast({
            title: '密码修改成功',
          })
          setTimeout(function () {
            wx.reLaunch({
              url: '/pages/index/index',
            })
          }, 2000)
        } else {

        }
      }).catch(() => {})
    }
  },
  getNewPasswordValue: function (e) {
    this.setData({
      newPassword: e.detail
    })
  },
  getNewPasswordQValue: function (e) {
    this.setData({
      newPasswordQ: e.detail
    })
  },
  getNewOriginalValue: function (e) {
    this.setData({
      original: e.detail
    })
  },
})