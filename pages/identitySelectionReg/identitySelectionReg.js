// pages/identitySelectionReg/identitySelectionReg.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

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

  //点击列表,跳转账号信息
  register(event){
   wx.navigateTo({
     url: '/pages/identityInformationReg/identityInformationReg?type='+event.currentTarget.dataset.type,
   })
  }
})