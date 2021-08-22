// components/listOrderYw/listOrderYw.js
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
    pHeight: wx.getSystemInfoSync().windowHeight - 180 + 'px',
    pageNum: 1, //待服务订单当前页码
    value1: '全部类型',
    timeSelectionValue: '1', //值为0,按时间升序查;值为1,按时间倒序查
    mainActiveIndex: 0, //类型选择(左侧选中项的索引)
    activeId: '', //类型选择(右侧选中项的 id，支持传入数组)
    activeId: null,
    listArr2: [],
    typeSeachList: [],
    qingXiList: [], //电器清洗搜索数据集合
    fangWuList: [], //房屋搜索数据集合
    zhiJiaList: [], //智佳搜索数据集合
    option2: [{
        text: '时间正序',
        value: '0'
      },
      {
        text: '时间倒序',
        value: '1'
      },
    ],
  },

  /**
   * 组件的方法列表
   */
  methods: {

    // 我的订单(已完成订单)查询

    selectOrderDetails(type) {
      if (type === 'loadMore') { //滚动到底部,加载更多
        this.setData({
          pageNum: this.data.pageNum + 1,
        })
      } else if (type === 'onRefresh') { //下拉刷新
        this.setData({
          pageNum: 1,
          loadCompletion: false,
          wareName: '', //订单类型
          value1: '全部类型', //订单类型
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
      let obj = {
        orderNum: this.data.searchValue, //订单单号//商品名称
        timeFlag: this.data.timeSelectionValue, //值为0,按时间升序查;值为1,按时间倒序查
        pageSize: 10,
        pageNum: this.data.pageNum,
        wareName: this.data.value1, //订单类型
        source: this.data.source || '', //1:家电清洗 2:生活服务
      }
      if (obj.wareName == '全部类型') {
        obj.wareName = '';
      }

      wx.showLoading({
        title: '加载中',
        mask: true
      })
      app.reqFetch.listOrder.selectOrderDetails(obj).then(res => {
        wx.hideLoading()
        if (res.data.code === 1) {
          let data = res.data.data.records;
          if (data.length > 0) {
            for (let item of data) {
              item.factPrice = parseFloat(item.factPrice).toFixed(2);
              if (item.orderDetailsList && item.orderDetailsList.length > 0) {
                for (let item2 of item.orderDetailsList) {
                  item2.price = parseFloat(item2.price).toFixed(2);
                }
              }
              if (item.ecologyThirdOrder && Object.keys(item.ecologyThirdOrder).length > 0) {
                let price = parseFloat(item.ecologyThirdOrder.price).toFixed(2);
                if (isNaN(price)) {
                  item.ecologyThirdOrder.price = '0.00'
                } else {
                  item.ecologyThirdOrder.price = price;
                }
              }

            }
          }
          if (res.data.data.records.length > 0) {
            if (type === 'onRefresh') { //下拉刷新
              this.setData({
                triggered: false, //下拉刷新开关
                listArr2: data
              })
            } else if (type === 'loadMore') { //滚动到底部,加载更多
              let list = [...this.data.listArr2, ...data]
              this.setData({
                listArr2: list
              })
            } else {
              this.setData({
                listArr2: data,
                triggered: false,
                loadCompletion: false,
              })
            }
          } else {
            if (type === 'onRefresh') { //下拉刷新
              this.setData({
                triggered: false, //下拉刷新开关
                listArr2: data
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
                listArr2: data,
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
    // 类型选择,点击项目选择(左侧导航点击时，触发的事件)
    onClickNav({
      detail = {}
    }) {
      let index = detail.index;
      if (index === 0) {
        this.setData({
          value1: '全部类型',
          wareName: '全部类型',
          source: '',
          pageNum: 1
        });
        this.selectOrderDetails()
        this.selectComponent('#dropdownType').toggle();

      }
      this.setData({
        mainActiveIndex: detail.index || 0,
      });
    },


    //下拉刷新控件被下拉
    onPulling(e) {},
    //自定义下拉刷新被触发
    onRefresh() {
      this.selectOrderDetails('onRefresh')
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
        this.selectOrderDetails('loadMore');
      }
    },
    //类型选择,右侧选择项被点击时，会触发的事件
    onClickItem({
      detail = {}
    }) {
      const activeId = this.data.activeId === detail.id ? null : detail.id;
      const value1 = detail.text;
      const source = detail.source;
      this.setData({
        value1: value1,
        wareName: value1,
        source: source || ''
      });
      this.selectOrderDetails()
      this.selectComponent('#dropdownType').toggle();
    },
    //点击列表 跳转到详情页
    onList(event) {
      let source = event.currentTarget.dataset.source; //1:服务兵 ,2 :三翼鸟 
      if (source === 1) {
        wx.navigateTo({
          url: `/pages/listOrdersDetailsF/listOrdersDetailsF?orderNum=${event.currentTarget.dataset.ordernum}&source=${source}`,
        })
      } else if (source === 2) {
        wx.navigateTo({
          url: `/pages/listOrderDetailsS/listOrderDetailsS?orderNum=${event.currentTarget.dataset.ordernum}&source=${source}`,
        })
      }
    },
    //时间 排序选择 
    timeSelectionChange(e) {
      let type = e.detail;
      this.setData({
        timeSelectionValue: type
      })
      this.selectOrderDetails()
    },
    //订单类型搜索数据获取 (0：电器清洗,1：房屋,2：智佳)
    selectServiceNameList(type) {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      app.reqFetch.listOrder.selectServiceNameList(type).then(res => {
        wx.hideLoading()
        if (res.data.code === 1) {
          if (type === 0) {
            this.setData({
              qingXiList: res.data.data
            })
          } else if (type === 1) {
            this.setData({
              fangWuList: res.data.data
            })
          } else if (type === 2) {
            this.setData({
              zhiJiaList: res.data.data
            })
          }
          this.typeSeachListFun()
        }

      }).catch(() => {})
    },
    //根据类型进行搜索数据处理
    typeSeachListFun() {
      let qingXiList = {
        text: '家电清洗',
        source: 1,
        children: []
      }; //电器清洗搜索数据集合
      let fangWuList = {
        text: '生活服务',
        source: 2,
        children: []
      }; //房屋搜索数据集合
      let zhiJiaList = {
        text: '智家优选',
        children: []
      }; //智家清洗
      for (let item of this.data.qingXiList) {
        let obj = {};
        obj.disabled = false;
        obj.text = item.wareName;
        obj.id = item.id;
        obj.source = 1;
        obj.wareId = item.wareId;
        qingXiList.children.push(obj)
      }
      for (let item of this.data.fangWuList) {
        let obj = {};
        obj.text = item.wareName;
        obj.id = item.id;
        obj.wareId = item.wareId;
        obj.source = 2;
        fangWuList.children.push(obj)
      }
      for (let item of this.data.zhiJiaList) {
        let obj = {};
        obj.text = item.wareName;
        obj.id = item.id;
        obj.wareId = item.wareId;
        zhiJiaList.children.push(obj)
      }
      let listAll = [];
      let qb = {
        text: '全部类型',
        children: [],
      }
      listAll.push(qb)
      listAll.push(qingXiList)
      listAll.push(fangWuList)
      listAll.push(zhiJiaList)
      this.setData({
        typeSeachList: listAll
      })
    },
    //解决弹窗滚动穿透问题
    preventTouchMove() {
      return
    }




  }
})