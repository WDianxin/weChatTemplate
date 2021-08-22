// pages/cardBankInformation/cardBankInformation.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    customerType: '', //子商户（客户）类型  2:个体工商户3:个人商家和企业员工
    titleWidth: "100px",
    regionShow: false, //城市开关
    region: '', //城市
    companyOrPerson: '', //行卡类别，b：对公，c：对私rn* 个体对私，有营业执照对公
    bankCardNo: '', // 结算银行卡号，不支持信用卡和存折账号，只支持借记卡
    bankAccountName: '', // 银行卡户名rn
    bankName: '', // 开户行名称
    bankProv: '', // 开户行省份
    bankCity: '', // 开户行城市
    bankBranchName: '', // 开户银行支行名称
    shopType: '2', //商户店面类型rn   *1:网店，2:门店rn   * 默认门店
    bankCardFont: '', // 银行卡有卡号一面的照片
    bankCardInHand: '', // shouChi银行卡照片
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data = app.globalData.getBindBankCardInfo
    this.setData({
      customerType: options.customerType || data.customerType, //子商户（客户）类型  2:个体工商户3:个人商家和企业员工
      companyOrPerson: data.companyOrPerson || 'C', //行卡类别，b：对公，c：对私rn* 个体对私，有营业执照对公
      isPermanent: data.companyOrPerson === 'B' ? false : true,
      bankCardNo: data.bankCardNo, // 结算银行卡号，不支持信用卡和存折账号，只支持借记卡
      bankAccountName: data.bankAccountName, // 银行卡户名rn
      bankCode: data.bankCode, // 银行卡户名rn
      bankName: data.bankName, // 开户行名称
      bankProv: data.bankProv, // 开户行省份
      bankCity: data.bankCity, // 开户行城市
      bankBranchName: data.bankBranchName, // 开户银行支行名称
      shopType: data.shopType||2, //商户店面类型rn   *1:网店，2:门店rn   * 默认门店
      bankCardFont: data.bankCardFont, // 银行卡有卡号一面的照片
      bankCardInHand: data.bankCardInHand, // shouChi银行卡照片
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
  //点击绑定
  nextPage() {
    if (this.data.bankCity === '' || this.data.bankProv === '') {
      wx.showToast({
        title: '开户行城市选择数据不全,请重新选择',
        icon: "none"
      })
    } else {
      wx.showLoading({
        title: '提交中',
      })
      this.selectBankCode('提交');
    }
  },
  // 点击协议
  xieYi() {
    wx.navigateTo({
      url: '/pages/agreement/agreement',
    })
  },
  //对公对私
  durationSelect(e) {
    let data = e.currentTarget.dataset.type;
    this.setData({
      isPermanent: data === 'gong' ? false : true,
      companyOrPerson: data === 'gong' ? "B" : "C",
    })
  },
  //显示地区选择
  regionShow() {
    wx.hideKeyboard();
    this.setData({
      regionShow: true
    })
    this.selectComponent("#region").threeLevels()
  },
  //省市区
  loadList(event) {
    // 自定义组件触发事件时提供的detail对象，用来获取子组件传递来的数据
    var data = event.detail;
    this.setData({
      region: `${data.provinceName} ${data.cityName} ${data.countyName}`,
      bankProv: data.provinceName,
      provinceCode: data.provinceCode,
      bankCity: data.cityName,
      cityCode: data.cityCode,
      countyName: data.countyName,
      countyCode: data.countyCode,
    })
  },
  /* 上传图片到后端
   *url:本地图片路径或返回的网络图片路径
   *type :操作类型
   * type2 : 成功后的标志
   */
  uploadFile(url, type, type2) {
    if (!url) return
    if (type2 === '成功') {
      if (type === 'yinHang') {
        this.setData({
          bankCardFont: url,
        })
      } else if (type === "yinHangShouChi") {
        this.setData({
          bankCardInHand: url,
        })
      }
    } else {
      app.uploadFileCommont(url, type, this.uploadFile)
    }
  },
  //展示图片
  showImg: function (e) {
    let type = e.currentTarget.dataset.type;
    let url = '';
    if (type === 'yinHang') {
      url = this.data.bankCardFont;
    } else if (type === "yinHangShouChi") {
      url = this.data.bankCardInHand;
    }
    if (!url) {
      this.upload('',type)
      return
    }
    wx.previewImage({
      urls: [url],
      current: url
    })
  },
  //图片选择,获取本地路径
  upload: function (e,typeData) {
    let type = typeData || e.currentTarget.dataset.type;
      app.upload(type, this.uploadFile);
  },
  selectBankCode(type) {
    if (!this.data.bankCardNo) {
      wx.showToast({
        title: '银行卡号不能为空',
        icon: 'none'
      })
      return
    }
    if (type != '提交') {
      wx.showLoading({
        title: '查询中',
        modal: true
      })
    }
    app.reqFetch.common.selectBankCode(this.data.bankCardNo).then(res => {
      if (type != '提交') {
        wx.hideLoading()
      }
      if (res.data.code === 1) {
        this.setData({
          bankName: res.data.data.itemName, // 开户行
          bankCode: res.data.data.itemCode, // 开户银行编码
        })
        if (type === '提交') {
          this.submit();
        }

      }
    }).catch(() => {
      this.setData({
        bankName: '', // 开户行
      })
    })
  },
  submit() {
    let data = this.data;
    app.globalData.getBindBankCardInfo.bankCardNo = data.bankCardNo; // 结算银行卡号，不支持信用卡和存折账号，只支持借记卡
    app.globalData.getBindBankCardInfo.companyOrPerson = data.companyOrPerson; //行卡类别，b：对公，c：对私rn* 个体对私，有营业执照对公
    app.globalData.getBindBankCardInfo.bankAccountName = data.bankAccountName; // 银行卡户名rn
    app.globalData.getBindBankCardInfo.bankName = data.bankName; // 开户行名称
    app.globalData.getBindBankCardInfo.bankProv = data.bankProv; // 开户行省份
    app.globalData.getBindBankCardInfo.bankCity = data.bankCity; // 开户行城市
    app.globalData.getBindBankCardInfo.bankBranchName = data.bankBranchName; // 开户银行支行名称
    app.globalData.getBindBankCardInfo.bankCode = data.bankCode; // 开户银行编码
    app.globalData.getBindBankCardInfo.shopType = data.shopType||2; //商户店面类型rn   *1:网店，2:门店rn   * 默认门店
    app.globalData.getBindBankCardInfo.bankCardFont = data.bankCardFont; // 银行卡有卡号一面的照片
    app.globalData.getBindBankCardInfo.bankCardInHand = data.bankCardInHand; // shouChi银行卡照片
    if (this.data.customerType === '2') { ////子商户（客户）类型  2:个体工商户3:个人商家和企业员工
      this.bindBindBankCardMerchants(app.globalData.getBindBankCardInfo);
    } else if (this.data.customerType === '3') {
      this.bindBindBankCardPersonal(app.globalData.getBindBankCardInfo);
    }
  },
  //3::个人商家和企业员工
  bindBindBankCardPersonal(data) {
    app.reqFetch.common.bindBindBankCardPersonal(data).then(res => {
      wx.hideLoading()
      if (res.data.code === 1) {
        let backPage  = "/pages/myBurse/myBurse"
        wx.navigateTo({
          url: `/pages/identitySuccess/identitySuccess?sucessBool=${true}&pageType=shenHeZhong&backPage=${backPage}&navigationBarTitle=绑定银行卡`,
        })
      }
    }).catch(() => {})
  },
  //2:个体工商户
  bindBindBankCardMerchants(data) {
    app.reqFetch.common.bindBindBankCardMerchants(data).then(res => {
      wx.hideLoading()
      if (res.data.code === 1) {
        if (res.data.code === 1) {
          let backPage  = "/pages/myBurse/myBurse"
          wx.navigateTo({
            url: `/pages/identitySuccess/identitySuccess?sucessBool=${true}&pageType=shenHeZhong&backPage=${backPage}&navigationBarTitle=绑定银行卡`,
          })
        }
      }
    }).catch(() => {})
  },
})