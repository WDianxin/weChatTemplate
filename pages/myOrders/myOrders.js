// pages/listOrders/listOrders.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNum: 1, //当前页码
    triggered: false, //设置当前下拉刷新状态，true 表示下拉刷新已经被触发，false 表示下拉刷新未被触发
    loadCompletion: false, //是否分页数据都加载完成
    topNum: 0,
    listArr: [],
    value1: '全部类型',
    timeSelectionValue: 'zheng', //时间排序
    mainActiveIndex: 0, //类型选择(左侧选中项的索引)
    activeId: '', //类型选择(右侧选中项的 id，支持传入数组)
    activeId: null,
    items: [{
        text: '全部类型',
        children: [{
          // 名称
          text: '全部类型',
          // id，作为匹配选中状态的标识
          id: 1,
        }, ],
      },
      {
        // 导航名称
        text: '家电清洗',
        // 禁用选项
        disabled: false,
        // 该导航下所有的可选项
        children: [{
            // 名称
            text: '空调清洗',
            // id，作为匹配选中状态的标识
            id: 1,
          },
          {
            text: '洗衣机清洗',
            id: 2,
          },
        ],
      }
    ]
  },
  //页面跳转
  goToURL(event) {
    let url = event.target.dataset.url;
    let type = event.target.dataset.type;
    wx.navigateTo({
      url: url,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.selectBillDetails()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

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
  scrollFn(e) {
    let t = e.detail.scrollTop;
    if (t > app.globalData.scrollTop) {
      // 避免重复setData
      this.setData({
        floorstatus: true
      });
    }

    if (t <= 100) {
      this.setData({
        floorstatus: false
      });
    }
    // 防抖，优化性能
    // 当滚动时，滚动条位置距离页面顶部小于设定值时，触发下拉刷新
    // 通过将设定值尽可能小，并且初始化scroll-view组件竖向滚动条位置为设定值。来实现下拉刷新功能，但没有官方的体验好
    clearTimeout(this.timer)
    if (e.detail.scrollTop < this.data.scrollTop) {
      this.timer = setTimeout(() => {
        this.onPulling()
      }, 350)
    }
  },
  //下拉刷新控件被下拉
  onPulling(e) {},
  //自定义下拉刷新被触发
  onRefresh() {
    this.selectBillDetails('onRefresh')
  },
  // 自定义下拉刷新被复位
  onRestore(e) {
  },
  // 自定义下拉刷新被中止
  onAbort(e) {
  },
  //滚动到底部,加载更多
  loadMore(e) {
    if (this.data.loadCompletion) {
      wx.showToast({
        title: '没有更多数据了',
        icon: 'none'
      })
    } else {
      this.selectBillDetails('loadMore');
    }
  },




  //回到顶部
  goTop: function (e) { // 一键回到顶部
    this.setData({
      topNum: 0
    })
  },
  //点击列表
  onList(event) {
    wx.navigateTo({
      url: `/pages/listOrdersDetails/listOrdersDetails?orderNum=${event.currentTarget.dataset.ordernum}&pageType=myOrders&source=${event.currentTarget.dataset.source}`,
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        acceptDataFromOpenedPage: function (data) {
        },
        someEvent: function (data) {
        }
      },
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          data: event.currentTarget.dataset.id
        })
      }
    })
    // templates.onList(event)
  },
  // 我的账单查询
  selectBillDetails(type) {
    if (type === 'loadMore') { //滚动到底部,加载更多
      this.setData({
        pageNum: this.data.pageNum + 1,
      })
    } else if (type === 'onRefresh') { //下拉刷新
      this.setData({
        pageNum: 1,
        loadCompletion: false,
      })
    }
    let obj = {
      pageSize: 10,
      pageNum: this.data.pageNum,
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    app.reqFetch.listOrder.selectBillDetails(obj).then(res => {
      wx.hideLoading()
      if (res.data.code === 1) {
        let data = res.data.data.records;
        for (let item of data) {
          item.factPrice = parseFloat(item.factPrice).toFixed(2);
        }
        if (res.data.data.records.length > 0) {
          if (type === 'onRefresh') { //下拉刷新
            this.setData({
              triggered: false, //下拉刷新开关
              listArr: data
            })
          } else if (type === 'loadMore') { //滚动到底部,加载更多
            let list = [...this.data.listArr, ...data]
            this.setData({
              listArr: list
            })
          } else {
            this.setData({
              listArr: data,
              triggered: false,
              loadCompletion: false,
            })
          }
        } else {
          if (type === 'onRefresh') { //下拉刷新
            this.setData({
              triggered: false, //下拉刷新开关
              listArr: data
            })
          } else if (type === 'loadMore') { //滚动到底部,加载更多
            this.setData({
              loadCompletion: true,
            })
            wx.showToast({
              title: '没有更多数据了',
              icon: 'none'
            })
          } else {
            this.setData({
              listArr: data,
              triggered: false,
              loadCompletion: false,
            })
          }

        }


      }

    }).catch(() => {})
  },

})