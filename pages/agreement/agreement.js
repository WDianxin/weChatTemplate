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
    this.findSignedAddress();
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
  //获取签署银行协议
  findSignedAddress() {
    wx.showLoading({
      title: '加载中',
      mobile: true
    })
    app.reqFetch.common.findSignedAddress().then(res => {
      wx.hideLoading()
      if (res.data.code === 1) {
        let data = res.data.data;
        this.setData({
          h5url: data
        })
      }
    }).catch(() => {})

  },

})