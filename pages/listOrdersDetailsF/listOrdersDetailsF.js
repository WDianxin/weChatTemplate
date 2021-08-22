// pages/listOrdersDetailsF/listOrdersDetailsF.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titleWidth:'180rpx'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderNum: options.orderNum,
      source: options.source,
    })
    this.selectAllOrderDetails()
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

  // 订单详情
  selectAllOrderDetails() {
    app.reqFetch.listOrder.selectAllOrderDetails(this.data.orderNum, this.data.source).then(res => {
      if (res.data.code === 1) {
        let data = res.data.data;
        data.standardPrice = parseFloat(data.standardPrice).toFixed(2) + '元'; //标准报价：
        data.factPrice = parseFloat(data.factPrice).toFixed(2) + '元'; //实收金额：
        data.number = 0;
        if (data.orderDetailsList.length > 0) {
          for (let item of data.orderDetailsList) {
            item.totalPrice = parseFloat(item.totalPrice).toFixed(2);
            data.number += item.number;
          }
          data.wareName = data.orderDetailsList[0].wareName;
        }
        this.setData({
          dataObj: data
        })
      }
    }).catch(() => {})
  },

})