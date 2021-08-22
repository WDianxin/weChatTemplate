// pages/identitySuccessfulSubmissionReg/identitySuccessfulSubmissionReg.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    brackUrl: '',
    checkOpinion:'',//失败原因
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      brackUrl: options.brackUrl,
      sucessBool: options.sucessBool, //是否显示成功
      regFail: options.regFail, //是否认证失败
      submitType: options.submitType, //1代表新增认证  2代表重新提交认证
      kind: options.kind, //认证类型 
      checkOpinion: options.checkOpinion //失败原因 
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
  // 点击我知道了,跳转首页
  gotIt() {
    if (this.data.brackUrl === 'my') {
      wx.reLaunch({
        url: '/pages/my/my',
      })
    } else if (this.data.regFail) { //认证失败重新认证
      wx.navigateTo({
        url: `${this.data.brackUrl}?kind=${this.data.kind}&submitType=2&brackUrl=my`,
      })
    } else if (this.data.brackUrl === 'back') { //返回上一页
     wx.navigateBack()
    } else {
      wx.reLaunch({
        url: '/pages/login/login',
      })
    }

  }
})