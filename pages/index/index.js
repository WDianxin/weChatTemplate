// pages/index/index.js
// 首页登录步骤: 
// 1.进入首页(index)通过微信api(wx.login())获取临时登录code;
// 2.使用code通过obtainOpenId接口获取openId,并存储到localStorage中保存;
// 3. 使用openId通过isObtainOpenId接口获取登录Token和hmcId,首先将token和hmcId存储localStorage中,然后调取当前页面其他接口,若获取token和hmcId失败,弹出信息后跳转到登录页;
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperDataArr: [{bannerPic:'https://img1.baidu.com/it/u=8370503,1640082050&fm=26&fmt=auto&gp=0.jpg',id:1,activityUrl:"https://www.baidu.com/"},{bannerPic:'https://img1.baidu.com/it/u=8370503,1640082050&fm=26&fmt=auto&gp=0.jpg',id:2,activityUrl:'https://www.baidu.com/'}], //首页顶部轮播图
    countNum: 6,
    timeInterval: "",
    scrollTop: 5, // 设定触发条件的距离
    triggered: false, //设置当前下拉刷新状态，true 表示下拉刷新已经被触发，false 表示下拉刷新未被触发
    regionShow: false, //地区
    allShow: false, //全部
    searchShow: false, //筛选
    topNum: 0,
    floorstatus: false, //是否显示置顶按钮
    washList: [], //电器清洗
    lifeList: [], //房屋清洗(生活服务)
    bastList: [], //智家优选

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    if (!options.login) { //非登录页进入
      this.wxLogin()
    }
    //在token失效之前更新tokem(token有效期为12小时,在11小时时更新token)
    app.globalData.restTokenInteral = setInterval(function () {
      this.wxLogin(true)
    }, 39600000)
  },
  onShow() {
    if (app.auth.getToken()) {
      this.onLoadRequst()
    } else {
      this.wxLogin()
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideToast({
      success: (res) => {},
    })
    wx.hideLoading({
      success: (res) => {},
    })
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
  //监听页面滚动
  scrollFn(e) {
    let t = e.detail.scrollTop;
    if (t > 500) {
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
    this.onLoadRequst()
    if (this._freshing) return
    this._freshing = true
    setTimeout(() => {
      this.setData({
        triggered: false,
      })
      this._freshing = false
    }, 3000)
  },
  // 自定义下拉刷新被复位
  onRestore(e) {},
  // 自定义下拉刷新被中止
  onAbort(e) {},
  //滚动到底部,加载更多
  loadMore(e) {},

  //回到顶部
  goTop: function (e) { // 一键回到顶部
    this.setData({
      topNum: 0
    })
  },
  //点击列表
  onList(event) {
    wx.navigateTo({
      url: "../detailed/detailed?id=999",
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        acceptDataFromOpenedPage: function (data) {},
        someEvent: function (data) {}
      },
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          data: event.currentTarget.dataset.id
        })
      }
    })
  },
  /**
   * 小程序通过code获取openid   isRestToken:是否更新token
   */
  wxLogin(isRestToken) {
    wx.login({
      success: res => {
        // 微信临时登录凭证
        let _code = res.code;
        if (_code) {
          app.reqFetch.log.obtainOpenId(_code).then(res => {
            if (res.data.code === 1) {
              app.auth.setOpenId(res.data.data.openid) //存储openId
              this.isObtainOpenId(res.data.data.openid, isRestToken)
            }
          }).catch(() => {})
        }
      },
      fail: res => {}
    });
  },
  //通过openId 获取token和角色信息进行登录 isRestToken:是否更新token
  isObtainOpenId(openId, isRestToken) {
    if (!openId) return
    app.reqFetch.log.isObtainOpenId(openId).then(res => {
      if (res.data.code === 1) {
        if (res.data.data.tokenKey) {
          app.auth.setToken(res.data.data.tokenKey); //存储token
        }
        if (res.data.data.hmcId) {
          app.auth.setHmcId(res.data.data.hmcId); //存储hmcId
        }
        if (!isRestToken) {
          this.onLoadRequst(); //页面登录成功后首次接口请求集合
        }
      }
    }).catch((e) => {
      if (e.data.msg && e.data.msg.indexOf('非法') >= 0) {
        if (app.globalData.restTokenInteral) {
          clearInterval(app.globalData.restTokenInteral)
        }
        try {
          wx.clearStorageSync();
          wx.clearStorage();
        } catch (e) {}
        wx.reLaunch({
          url: '/pages/login/login',
        })
      } else if (e.data.msg && e.data.msg.indexOf('过期') >= 0) {
        this.wxLogin()
      } else if (e.data.code === -1) {
        if (app.globalData.restTokenInteral) {
          clearInterval(app.globalData.restTokenInteral)
        }
        setTimeout(function () {
          wx.navigateTo({
            url: '/pages/login/login',
          })
        }, 1500)

      }

    })
  },
  //首页顶部轮播图获取
  selectBannerPic() {
    return
    app.reqFetch.index.selectBannerPic().then(res => {
      if (res.data.code === 1) {
        // activityUrl:代表跳转外联地址
        this.setData({
          swiperDataArr: res.data.data.result
        })
      }
    }).catch((e) => {
      if (e.data.msg && e.data.msg.indexOf('非法') >= 0) {
        if (app.globalData.restTokenInteral) {
          clearInterval(app.globalData.restTokenInteral)
        }  
        try {
          wx.clearStorageSync();
          wx.clearStorage();
        } catch (e) {}
        wx.reLaunch({
          url: '/pages/login/login',
        })
      } else if (e.data.msg && e.data.msg.indexOf('过期') >= 0) {
        this.wxLogin()
      }
    })
  },
  //获取智家优选,生活服务和清洗类别列表
  selectServiceInformationList(typeName) {
    let data = {}
    if (typeName === '电器清洗') {
      data.dataSource = 0
    } else if (typeName === '房屋清洗') {
      data.dataSource = 1
    } else if (typeName === '智家优选') {
      data.dataSource = 2
    }
    app.reqFetch.listOrder.selectServiceInformationList(data).then(res => {
      if (res.data.code === 1) {
        let data = res.data.data;
        if (typeName === '电器清洗') {
          this.setData({
            washList: data
          })
        } else if (typeName === '房屋清洗') {
          this.setData({
            lifeList: data
          })
        } else if (typeName === '智家优选') {
          this.setData({
            bastList: data
          })
        }
      }
    }).catch((e) => {
      if (e.data.msg && e.data.msg.indexOf('非法') >= 0) {
        if (app.globalData.restTokenInteral) {
          clearInterval(app.globalData.restTokenInteral)
        }
        try {
          wx.clearStorageSync();
          wx.clearStorage();
        } catch (e) {}
        wx.reLaunch({
          url: '/pages/login/login',
        })
      } else if (e.data.msg && e.data.msg.indexOf('过期') >= 0) {
        this.wxLogin()
      }
    })
  },
  //页面登录成功后首次接口请求集合
  onLoadRequst() {
    this.selectBannerPic();
    this.selectServiceInformationList('电器清洗')
    this.selectServiceInformationList('房屋清洗')
    this.selectServiceInformationList('智家优选')
  }

})