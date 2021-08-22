// pages/shareAppMessage/shareAppMessage.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.wxLogin()
  },
  /**
   * 小程序通过code获取openid
   */
  wxLogin() {
    wx.login({
      success: res => {
        // 微信临时登录凭证
        let _code = res.code;
        if (_code) {
          app.reqFetch.log.obtainOpenId(_code).then(res => {
            if (res.data.code === 1) {
              app.auth.setOpenId(res.data.data.openid) //存储openId
              this.isObtainOpenId(res.data.data.openid)
            }
          }).catch(() => {})
        }
      },
      fail: res => {}
    });
  },
  //通过openId 获取token和角色信息进行登录
  isObtainOpenId(openId) {
    if (!openId) return
    app.reqFetch.log.isObtainOpenId(openId).then(res => {
      if (res.data.code === 1) {
        if (res.data.data.tokenKey) {
          app.auth.setToken(res.data.data.tokenKey); //存储token
        }
        if (res.data.data.hmcId) {
          app.auth.setHmcId(res.data.data.hmcId); //存储hmcId
        }
        wx.reLaunch({
          url: '/pages/index/index',
        })
      }
    }).catch((e) => {
      if (e.data.code === -1) {
        wx.navigateTo({
          url: '/pages/login/login',
        })
      }
    })
  },
})