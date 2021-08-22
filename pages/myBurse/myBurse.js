// pages/myBurse/myBurse.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    getBindBankCardInfo: {
      auditStatus: '', //影印件审核状态(绑卡状态)，该状态为异步状态，建议主动查询和接入异步通知rn   绑卡状态: null:未申请绑卡 S：审核成功；F：审核失败；P:审核中
      signStatus: '', //签署状态(签署绑卡协议)，0：未签署，1：签署中，2：已签署
    }, //用户绑卡资料
    show: false,
    classify: '今日收入',
    moneys: '0.00', //收入
    actions: [{
        name: '今日收入',
      },
      {
        name: '本月收入',
      },
      {
        name: '本季度收入',
      },
      {
        name: '本年收入',
      },
      {
        name: '累计收入',
      },
    ],
  },
  //页面跳转
  goToURL(event) {
    let url = event.target.dataset.url;
    let type = event.target.dataset.type;
    wx.navigateTo({
      url: url,
    })
  },
  // 点击选择分类
  classifyTap() {
    this.setData({
      show: true
    });
  },
  onClose() {
    this.setData({
      show: false
    });
  },

  onSelect(event) {
    this.setData({
      classify: event.detail.name
    });
    let data = event.detail.name;
    if (data === '今日收入') {
      this.cumuIncome('date')
    } else if (data === '本月收入') {
      this.cumuIncome('month')
    } else if (data === '本季度收入') {
      this.cumuIncome('quarter')
    } else if (data === '本年收入') {
      this.cumuIncome('year')
    } else if (data === '累计收入') {
      this.cumuIncome('all')
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.selectBindBankCardInfo();
  },
  onShow: function () {
    this.cumuIncome('date');
    this.selectBindBankCardInfo();
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
  //点击绑卡
  toBkPage(e) {
    if (!app.globalData.getBindBankCardInfo.customerType) {
      wx.showToast({
        title: '用户未认证角色信息,不能绑卡!',
        icon: 'none'
      })
      return
    }
    let data = e.currentTarget.dataset.type;
    if (data === "bangKa") {
      wx.navigateTo({
        url: `/pages/cardBindingInformation/cardBindingInformation?customerType=${this.data.getBindBankCardInfo.customerType}`,
      })
    } else if (data === 'daiQianXiYi') { //待签协议
      wx.navigateTo({
        url: `/pages/agreement/agreement`,
      })
    } else {
      let errTitle = this.data.getBindBankCardInfo.rejectedReason;
      wx.navigateTo({
        url: `/pages/identitySuccess/identitySuccess?sucessBool=${true}&pageType=${data}&errTitle=${errTitle}&customerType=${this.data.getBindBankCardInfo.customerType}&navigationBarTitle=绑定银行卡`,
      })
    }
  },
  //绑卡基本信息查询
  selectBindBankCardInfo() {
    let hmcId = app.auth.getHmcId();
    wx.showLoading({
      title: '加载中',
      mobile: true
    })
    app.reqFetch.common.selectBindBankCardInfo(hmcId).then(res => {
      wx.hideLoading()
      if (res.data.code === 1) {
        let data = res.data.data;
        //  auditStatus //绑卡状态: null:未申请绑卡 S：审核成功；F：审核失败；P:审核中
        //  signStatus// 签署银行协议状态，0：未签署，1：签署中，2：已签署 
        // data.auditStatus = 's'
        // data.signStatus = '0'
        app.globalData.getBindBankCardInfo = data;
        if (data.backCardNo) {
          data.bankCardNum = '***** ***** ***** ' + data.bankCardNo.subString(data.bankCardNo.length - 4)
        }
        this.setData({
          getBindBankCardInfo: data
        })
      }
    }).catch(() => {})

  },
  //收入查询
  cumuIncome(type) {
    wx.showLoading({
      title: '加载中',
      modal: true
    })
    app.reqFetch.common.cumuIncome(type).then(res => {
      wx.hideLoading()
      if (res.data.code === 1) {
        this.setData({
          moneys: parseFloat(res.data.data.data).toFixed(2)
        })
      }
    }).catch(() => {})
  },

})