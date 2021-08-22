// pages/changePassword/changePassword.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: '', //手机验证码
    mobile: '', //手机号
    codename: '获取验证码',
    disabled: false,
    type: '' // 页面类型
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type: options.type,
      mobile: options.mobile
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
  //获取手机验证码
  getCode: function () {
    if (this.data.disabled) return
    var _this = this;
    if (!app.util.telTest(this.data.mobile)) {
      return false;
    } else {
      _this.setData({
        disabled: true
      })
      var num = 60;
      var timer = null;
      let hmcid = ''
      if (this.data.type === 'forgotPassword') {
        hmcid = this.data.mobile.toString()
      } else {
        hmcid = app.auth.getHmcId()
      }
      wx.showLoading({
        title: '获取中',
        mask: true,
      })
      app.reqFetch.log.sendVerifyCode(this.data.mobile.toString(), hmcid, 'forgotPassword').then(res => {
        wx.hideLoading()
        if (res.data.code === 1) {
          timer = setInterval(function () {
            num--;
            if (num <= 0) {
              clearInterval(timer);
              _this.setData({
                codename: '重新发送',
                disabled: false
              })
            } else {
              _this.setData({
                codename: num + "s"
              })
            }
          }, 1000)
        } else {
          clearInterval(timer)
          _this.setData({
            disabled: false,
            codename: '重新发送',
          })
        }

      }).catch(() => {
        clearInterval(timer)
        _this.setData({
          disabled: false,
          codename: '重新发送',
        })
      })
    }
  },
  //下一步和換綁手機
  nextPage: function (e) {
    let type = this.data.type;
    var _this = this;
    if (!app.util.telTest(this.data.mobile)) {
      return false;
    } else if (this.data.code === '') {
      wx.showToast({
        title: '验证码不能为空',
        icon: "none"
      })
    } else {
      _this.setData({
        disabled: true
      })
      wx.showLoading({
        title: '加载中',
        mask: true,
      })
      //验证验证吗
      let hmcid = ''
      if (this.data.type === 'forgotPassword') {
        hmcid = this.data.mobile.toString()
      } else {
        hmcid = app.auth.getHmcId()
      }
      app.reqFetch.log.checkVerifyCode(this.data.mobile.toString().trim(), this.data.code, 'forgotPassword', hmcid).then(res => {
        if (res.data.code === 1) {
          if (type === "forgotPassword") {
            let dataToke = res.data.data;
            wx.navigateTo({
              url: `/pages/forgotPassword/forgotPassword?mobile=${this.data.mobile.toString().trim()}&dataToke=${dataToke}&mobile=${this.data.mobile.toString().trim()}`,
            })
          } else if (this.data.type === 'changeMobile') {
            wx.navigateTo({
              url: `/pages/changeMobile/changeMobile?mobile=${this.mobile}&code`,
            })
          } else {
            wx.hideLoading()
            wx.navigateTo({
              url: `/pages/newPassword/newPassword?type=${this.data.type}`,
            })
          }
        } else {
          wx.hideLoading()
          _this.setData({
            disabled: false
          })
        }
      }).catch(() => {
        _this.setData({
          disabled: false
        })
      })
    }
  },
  getPhoneValue: function (e) {
    this.setData({
      mobile: e.detail
    })
  },
  getCodeValue: function (e) {
    this.setData({
      code: e.detail
    })
  },
})