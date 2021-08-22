// pages/my/my.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TodayMoney: '0.00', //今日收益
    userInfoData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.userInfo();
    this.cumuIncome();
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
  //页面跳转
  goToURL(event) {
    let url = event.target.dataset.url;
    let type = event.target.dataset.type;
    wx.navigateTo({
      url: url,
    })
  },
  //根据登录hmcId查询用户详情,Feign公共方法，基本信息
  userInfo() {
    wx.showLoading({
      title: '加载中',
      modal: true
    })
    let hmcId = app.auth.getHmcId();
    app.reqFetch.common.userInfo(hmcId).then(res => {
      wx.hideLoading()
      if (res.data.code === 1) {
        let data = res.data.data;
        //优先使用接口数据,接口数据为空是使用微信数据.
        data.avatar = data.avatar || app.auth.getUserInfo().avatarUrl; //用户头像
        data.name = data.name || app.auth.getUserInfo().nickName;
        data.sex = data.sex || app.auth.getUserInfo().genderName; //性别
        this.setData({
          userInfoData: data
        })
        app.auth.setUserInfoInterface(data);
      }
    }).catch(() => {})
  },
  //收入查询
  cumuIncome() {
    wx.showLoading({
      title: '加载中',
      modal: true
    })
    app.reqFetch.common.cumuIncome('date').then(res => {
      wx.hideLoading()
      if (res.data.code === 1) {
        this.setData({
          TodayMoney: parseFloat(res.data.data.data).toFixed(2)
        })
      }
    }).catch((e) => {
      if (e.data.code === 7111) {
        if (app.globalData.restTokenInteral) {
          clearInterval(app.globalData.restTokenInteral)
        }
      }
    })
  },
})