// pages/identityInformationReg/identityInformationReg.js
const app = getApp()
import templates from "../../template/gasList/gasList"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    kind: '', //注册类型
    name:"",//姓名
    nauserId:"",//身份证号
    mobile: '', //手机号
    newPassword: '', //密码
    newPasswordQ: '', //再次输入密码
    // code: '', //验证码
    codename: '发送验证码',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      kind: options.type
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

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
  //点击下一步
  nextPage() {
    if (!app.util.telTest(this.data.mobile)) {
      return false
    } else if (this.data.newPassword === '') {
      wx.showToast({
        title: '请输入密码',
        icon: 'none',
      })
    } else if (this.data.newPasswordQ === '') {
      wx.showToast({
        title: '请再次输入密码',
        icon: 'none',
      })
    } else if (this.data.newPasswordQ !== this.data.newPassword) {
      wx.showToast({
        title: '两次输入的密码不一致,请重新输入',
        icon: 'none'
      })
    } 
    // else if (!app.util.passworderTest(this.data.newPassword)) {
    //   return false
    // } 
    else {
      wx.showLoading({
        title: '提交中',
      })
      setTimeout(()=>{
        wx.reLaunch({
          url: '/pages/index/index?login=2',
        })
      },2000)
      return
      // 验证验证码是否正确
      app.reqFetch.log.checkVerifyCode(this.data.mobile.toString(), this.data.code).then(res => {
        wx.hideLoading()
        if (res.data.code === 1) {
          //跳转到对应的基本信息页面
          let src = '';
          if ("shangHu" === this.data.kind) {
            src = `/pages/identityBusinessReg/identityBusinessReg?mobile=${this.data.mobile}&password=${this.data.newPassword}&kind=`
          } else if ('geRen' === this.data.kind || "yuanGong" === this.data.kind) {
            src = `/pages/identityStaffReg/identityStaffReg?mobile=${this.data.mobile}&password=${this.data.newPassword}&kind=`
          }
          wx.navigateTo({
            url: src + this.data.kind,
          })
        } else {
          this.setData({
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
      wx.showLoading({
        title: '获取中',
        mask: true,
      })
      app.reqFetch.log.sendVerifyCode(this.data.mobile.toString()).then(res => {
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
        wx.hideLoading()
        clearInterval(timer)
        _this.setData({
          disabled: false,
          codename: '重新发送',
        })
      })
    }
  },
})