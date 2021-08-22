// components/listOrderDf/listOrderDf.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //是否开通下拉刷新功能
    refresherEnabled: {
      type: Boolean,
    },
    //搜索
    searchValue: {
      type: String,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    pHeight: wx.getSystemInfoSync().windowHeight-180 + 'px',

    listArr: [
      {
        ksmc:"消防安全考试",  
        kssj:"2021-8-20 08:00",
        ksdd:"消防安全青岛市市北区同安路10号",
        xxmc:"青岛市警官培训学校",
        kszh:"1栋2楼202室5号",
        kszsj:"90分钟",
        ksjg:"通过"
      }
    ], //待服务订单
    pageNum: 1, //待服务订单当前页码
    scrollTop: '0px',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 我的订单(待服务订单和带服务订单)查询
    selectThirdOrder(type) {
      if (type === 'loadMore') { //滚动到底部,加载更多
        this.setData({
          pageNum: this.data.pageNum + 1,
        })

      } else if (type === 'onRefresh') { //下拉刷新
        this.setData({
          pageNum: 1,
          loadCompletion: false,
          searchValue: '', //搜索内容
        })
        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1]; //当前页面 var prevPage = pages[pages.length - 2]; //上一个页面 // 直接调用上一个页面的setData()方法，把数据存到上一个页面中去 prevPage.setData({ mydata: {a:1, b:2} })
        currPage.setData({
          searchValue: '', //搜索内容
        })
      } else if (type === 'search') {
        this.setData({
          pageNum: 1,
        })
      }
      // "businessNo":"油烟机清洗",//可传订单编号或商品名称
      // "orderStatus":"0"//0为待服务订单，1为待服务订单
      let obj = {
        businessNo: this.data.searchValue, //订单单号//商品名称
        orderStatus: 1, //0为待沟通订单，1为待服务订单
        pageSize: 10,
        pageNum: this.data.pageNum
      }
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      app.reqFetch.listOrder.selectThirdOrder(obj).then(res => {
        wx.hideLoading()
        if (res.data.code === 1) {
          let data = res.data.data.records;
          if (data.length > 0) {
            for (let item of data) {
              item.factPrice = parseFloat(item.factPrice).toFixed(2);
              item.pageType = 'Df'
            }
          }

          if (res.data.data.records.length > 0) {

            if (type === 'onRefresh') { //下拉刷新
              this.setData({
                triggered: false, //下拉刷新开关
                listArr0: data
              })
            } else if (type === 'loadMore') { //滚动到底部,加载更多
              let list = [...this.data.listArr, ...data];
              this.setData({
                listArr0: list
              })

            } else {
              this.setData({
                listArr0: data,
                triggered: false,
                loadCompletion: false,
              })

            }
          } else {
            if (type === 'onRefresh') { //下拉刷新
              this.setData({
                triggered: false, //下拉刷新开关
                listArr0: data
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
                listArr0: data,
                triggered: false,
                loadCompletion: false,
              })

            }

          }


        }

      }).catch(() => {})
    },




    //监听滚动
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
    },


    //下拉刷新控件被下拉
    onPulling(e) {},
    //自定义下拉刷新被触发
    onRefresh() {
      this.selectThirdOrder('onRefresh')
    },
    // 自定义下拉刷新被复位
    onRestore(e) {},
    // 自定义下拉刷新被中止
    onAbort(e) {},
    //滚动到底部,加载更多
    loadMore(e) {
      if (this.data.loadCompletion) {
        wx.showToast({
          title: '没有更多数据了',
          icon: 'none'
        })
      } else {
        this.selectThirdOrder('loadMore');
      }
    },

    //立即收款
    fuKuan(e) {
      let businessNo = e.currentTarget.dataset.businessno;
      let source = e.currentTarget.dataset.source;
      let wareId = e.currentTarget.dataset.wareid;
      let infoid = e.currentTarget.dataset.infoid;
      wx.navigateTo({
        url: `/pages/quotation/quotation?businessNo=${businessNo}&source=${source}&wareId=${wareId}&infoId=${infoid}`,
      })
    },
    //关闭订单 
    guanDan(e) {
      let _this = this;
      wx.showActionSheet({
        itemList: ['请选择关单原因:', '客户取消服务', '已线下收款', ],
        itemColor: '#6299E2',
        success(res) {
          if (res.tapIndex === 1 || res.tapIndex === 2) {
            let tapIndex = res.tapIndex === 1 ? 2 : 1; //1代表:已线下收款  2代表:客户取消服务
            wx.showModal({
              title: '提示',
              content: '您确定要关闭当前订单?',
              success(res) {
                if (res.confirm) {
                  let obj = {
                    businessNo: e.currentTarget.dataset.businessno,
                    orderStatus: tapIndex, //1代表:已线下收款  2代表:客户取消服务
                    source: e.currentTarget.dataset.source,
                  }
                  wx.showLoading({
                    title: '加载中',
                    modal: true
                  })
                  app.reqFetch.listOrder.finishOrder(obj).then(res => {
                    wx.hideLoading()
                    if (res.data.code === 1) {
                      let pages = getCurrentPages();
                      let currPage = pages[pages.length - 1];
                      currPage.setData({
                        active: 2
                      })
                    }
                  }).catch(() => {})

                }
              }
            })
          }
        },
        fail(res) {}
      })


    }



  }
})