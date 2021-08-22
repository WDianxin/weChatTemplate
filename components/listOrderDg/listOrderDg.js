// components/listOrderDg/listOrderDg.js
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
    scrollTop: '0px',
    pageType: 'Df', //页面类型
    pHeight: wx.getSystemInfoSync().windowHeight-180 + 'px',
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      } else if (type === 'day') {
        return `${value}日`;
      } else if (type === 'hour') {
        return `${value}时`;
      } else if (type === 'minute') {
        return `${value}分`;
      }
      return value;
    },
    listArr0: [
      // {
        // ksmc:"消防安全基础知识考试",
        // kssj:"2021-8-20 08:00",
        // ksdd:"消防安全青岛市市北区同安路10号",
        // xxmc:"青岛市警官培训学校",
        // kszh:"1栋2楼202室5号",
        // kszsj:"90分钟",
        // sfks:"否",
      // }
    ], //待沟通订单
    STimeBool: false,
    pageNum: 1, //待沟通订单当前页码
    minHour: 10,
    maxHour: 20,
    minDate: new Date().getTime(), //	可选的最小时间，精确到分钟
    maxDate: new Date(2040, 10, 1).getTime(),
    currentDate: new Date().getTime(),
    SettingsTimeBusinessNo: '', //设置上门时间选中订单号
  },

  /**
   * 组件的方法列表
   */
  methods: {
    addList(title){
      console.log('金水路',title)
      let list  = this.data.listArr0;
      console.log('list===',list)
      list.unshift({
        ksmc:title,
        kssj:"2021-8-20 08:00",
        ksdd:"消防安全青岛市市北区同安路10号",
        xxmc:"青岛市警官培训学校",
        kszh:"1栋2楼202室5号",
        kszsj:"90分钟",
      })

      this.setData({
        listArr0:list
      })
    },
    nextPage(){
        wx.navigateTo({
          url: `/pages/identitySelection/identitySelection`,
        })
    },
    // 我的订单(待沟通订单和带服务订单)查询
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
      // "orderStatus":"0"//0为待沟通订单，1为待服务订单
      let obj = {
        businessNo: this.data.searchValue, //订单单号//商品名称
        orderStatus: 0, //0为待沟通订单，1为待服务订单
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
              item.pageType = 'Dg'
            }
          }
          if (res.data.data.records.length > 0) {

            if (type === 'onRefresh') { //下拉刷新
              this.setData({
                triggered: false, //下拉刷新开关
                listArr0: data
              })
            } else if (type === 'loadMore') { //滚动到底部,加载更多
              let list = [...this.data.listArr0, ...data];
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

      }).catch((e) => {
        if (e.data.code === 7111) {
          if (app.globalData.restTokenInteral) {
            clearInterval(app.globalData.restTokenInteral)
          }
        }
      })
    },
    //点击设置上门时间
    SettingsTime: function (e) {
      let businessNo = e.target.dataset.businessno
      this.setData({
        STimeBool: true,
        SettingsTimeBusinessNo: businessNo,
        minDate: new Date().getTime(),
        currentDate: new Date().getTime(),
      })
    },
    //设置上门时间 点击确定
    timeConfirm(e) {
      let date = e.detail;
      this.setData({
        STimeBool: false
      })
      if (date) {
        this.receiveOrder(app.util.formatTime(date))
      }
    },
    //设置上门时间
    receiveOrder(date) {
      let obj = {
        businessNo: this.data.SettingsTimeBusinessNo,
        serviceTime: date,
      }
      wx.showLoading({
        title: '提交中',
        mask: true
      })
      app.reqFetch.listOrder.receiveOrder(obj).then(res => {
        wx.hideLoading()
        if (res.data.code === 1) {
          wx.showToast({
            title: '设置成功,请您准时上门服务',
            icon: 'none',
            duration: 2500
          })
          let _this = this;
          setTimeout(function () {
            _this.selectThirdOrder('search');
          }, 2500)
        }

      }).catch(() => {})
    },
    //设置上门时间 点击取消
    timeCancel(e) {
      this.setData({
        STimeBool: false
      })

    },
    //打电话
    call(e) {
      let tel = e.target.dataset.call;
      wx.makePhoneCall({
        phoneNumber: tel //仅为示例，并非真实的电话号码
      })
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



  }
})