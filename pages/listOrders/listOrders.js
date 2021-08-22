// pages/listOrders/listOrders.js
const app = getApp();
import '../../template/gasList/gasList.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    refresherEnabled: true, //是否开通下拉刷新功能
    active: 0, //默认显示哪个table
    searchValue: "", //搜索内容
    triggered: false, //设置当前下拉刷新状态，true 表示下拉刷新已经被触发，false 表示下拉刷新未被触发
    loadCompletion: false, //是否分页数据都加载完成
    
    pageNum0: 1, //待沟通订单当前页码
    pageNum1: 1, //待服务订单当前页码
    pageNum2: 1, //已完成订单当前页码
    offsetTop: '76',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options==',options)
    if(options.title){
      // this.selectComponent("#listOrderDg").selectServiceNameList(0);
      console.log(' this.selectComponent("#listOrderDg").listArr0', this.selectComponent("#listOrderDg").listArr0)
      console.log(' this.selectComponent("#listOrderDg")', this.selectComponent("#listOrderDg"))
      this.selectComponent("#listOrderDg").addList(options.title);
    }
    return
    var that = this;
    //判断设备类型
    wx.getSystemInfo({
      success: function (res) {
        if (res.platform == 'ios' && (res.model.indexOf('iPhone 6s') >= 0||res.model.indexOf('iPhone 7') >= 0||res.model.indexOf('iPhone 8') >= 0)) {
          that.setData({
            offsetTop: '58',
          })
        } else if (res.platform == 'ios') {
          that.setData({
            offsetTop: '88',
          })
        } else {
          that.setData({
            offsetTop: '70',
          })
        }
      }
    })
    if (options.active || options.active == '0') {
      this.setData({
        active: parseInt(options.active)
      })
    }
    this.selectComponent("#listOrderYw").selectServiceNameList(0);
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    this.selectComponent("#listOrderYw").selectOrderDetails('search', );

  },
  onShow: function (options) {

  },
  nextPage(){
    wx.navigateTo({
      url: `/pages/identitySelection/identitySelection`,
    })
},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideLoading()
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
  //通过订单号,订单名称进行搜索
  searchListOrders(event) {
    this.setData({
      searchValue: event.detail.trim()
    })
    if (this.data.active === 0) {
      this.selectComponent("#listOrderDg").selectThirdOrder('search')
    } else if (this.data.active === 1) {
      this.selectComponent("#listOrderDf").selectThirdOrder('search')
    } else if (this.data.active === 2) {
      this.selectComponent("#listOrderYw").selectOrderDetails('search')
    }
  },

  //监听页面滚动
  onPageScroll(e) {
    let scrollTop = e.scrollTop;
    if (scrollTop === 0) {
      this.setData({
        refresherEnabled: true
      })
    } else {
      this.setData({
        refresherEnabled: false
      })
    }
    if (scrollTop > app.globalData.scrollTop) {
      // 避免重复setData
      this.setData({
        floorstatus: true
      });
    }

    if (scrollTop <= 100) {
      this.setData({
        floorstatus: false
      });
    }
  },

  //回到顶部
  goTop: function (e) { // 一键回到顶部
    if (this.data.active === 0) {
      this.selectComponent('#listOrderDg').setData({
        scrollTop: '0px',
      })
    } else if (this.data.active === 1) {
      this.selectComponent('#listOrderDf').setData({
        scrollTop: '0px',
      })
    } else if (this.data.active === 2) {
      this.selectComponent('#listOrderYw').setData({
        scrollTop: '0px',
      })
    }

    wx.pageScrollTo({
      scrollTop: 0
    })
  },

  // table切换
  onChange(event) {
    this.setData({
      active: event.detail.index
    })
    if (event.detail.index === 0) {
      this.selectComponent("#listOrderDg").selectThirdOrder('onRefresh', 0);
    } else if (event.detail.index === 1) {
      this.selectComponent("#listOrderDf").selectThirdOrder('onRefresh', 1);
    } else if (event.detail.index === 2) {
      this.selectComponent("#listOrderYw").selectOrderDetails('onRefresh', '');
    }
  },



})
