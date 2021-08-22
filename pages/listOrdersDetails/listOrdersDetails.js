// pages/listOrdersDetails/listOrdersDetails.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titleWidth: '180rpx',
    objData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderNum: options.orderNum,
      source: options.source,
      pageType: options.pageType //页面类型  listOrders:我的订单     myOrders:我的账单
    })
    this.selectOrder(options.orderNum)
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
  selectOrder() {
    app.reqFetch.listOrder.selectAllOrderDetails(this.data.orderNum, this.data.source).then(res => {
      if (res.data.code === 1) {
        let data = res.data.data;
        data.factPrice = parseFloat(data.factPrice).toFixed(2) || '0.00'
        this.setData({
          objData: data,
        })
      }

    }).catch(() => {})
  },

})