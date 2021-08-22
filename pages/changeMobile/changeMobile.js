// pages/changeMobile/changeMobile.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile: '', //原手机号
    newMobile: '', //新手机号
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
  },
  //点击完成
  nextPage: function (e) {
    if (!app.util.telTest(this.data.mobile)) {
      return false;
    } else {
      wx.showLoading({
        title: '提交中',
        mobile: true
      })
      app.reqFetch.common.updateUserMobile(this.data.mobile).then(res => {
        wx.hideLoading()
        if (res.data.code === 1) {
          wx.showToast({
            title: '修改成功!',
          })
          setTimeout(function () {
            wx.reLaunch({
              url: '/pages/my/my',
            })
          }, 1500)
        }
      }).catch(() => {})

    }
  },

})