// pages/agreement/agreement.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    h5url: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      h5url:options.h5url
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
})