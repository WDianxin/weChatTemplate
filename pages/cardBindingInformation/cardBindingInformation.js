// pages/cardBindingInformation/cardBindingInformation.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    customerType: '', //子商户（客户）类型  2:个体工商户3:个人商家和企业员工
    name: '', //姓名
    mobile: '', //手机号
    email: '', //邮箱
    region: '', //地址
    userTitle2: '冠照',
    regionShow: false, //城市开关
    provinceCode: '', //省
    provinceName: '', //省
    cityCode: '', //市
    cityName: '', //市
    countyCode: '', //区
    countyName: '', //区
    address: '', //详细地址
    userTitle1: '个人免',
    certificatesNumber: '', //身份证号
    certificatesValidity: '', //有效期值
    certificatesFront: '', //身份证正面
    certificatesBack: '', //身份证反面
    certificatesInHandFront: '', //shouChi证件正面的照片
    store1: '', //门店照1
    store2: '', //门店照2
    store3: '', //门店照3
    userTitle: '头像'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data = app.globalData.getBindBankCardInfo;
    let region = `${data.province||''} ${data.city||''} ${data.area||''}`;
    this.setData({
      startDate: app.util.dateCurrent(), //开始时间
      customerType: data.customerType, //子商户（客户）类型  2:个体工商户3:个人商家和企业员工
      hmcId: data.hmcId || app.auth.getHmcId(), //注册表hmcId
      name: data.name, //姓名
      mobile: data.mobile, //手机号
      email: data.email, //邮箱
      region: region, //地址
      provinceCode: data.provinceCode, //省
      province: data.province, //省
      cityCode: data.cityCode, //市
      city: data.city, //市
      areaCode: data.areaCode, //区
      area: data.area, //区
      address: data.address, //详细地址
      certificatesNumber: data.certificatesNumber, //身份证号
      certificatesValidity: data.certificatesValidity, //有效期值
      isPermanent: data.certificatesValidity === '2999-01-01' ? true : false,
      certificatesFront: data.certificatesFront, //身份证正面
      certificatesBack: data.certificatesBack, //身份证反面
      certificatesInHandFront: data.certificatesInHandFront, //shouChi证件正面的照片
      store1: data.store1, //门店照1
      store2: data.store2, //门店照2
      store3: data.store3, //门店照3
    })

    if (app.auth.getToken()) {
      this.setData({
        userTitle: this.data.userTitle1 + this.data.userTitle2,
        isShow: true
      })
    }

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
  //点击下一步
  nextPage() {
    let customerType = this.data.customerType;
    if (!app.util.telTest(this.data.mobile)) {
      return false
    } else if (!app.util.identityNumTest(this.data.certificatesNumber)) {
      return false;
    } else if (!app.util.emailTest(this.data.email)) {
      return false;
    } else if (this.data.provinceCode === '' || this.data.cityCode === '' || this.data.areaCode === '') {
      wx.showToast({
        title: '地址资料不全,请重新选择',
        icon: "none"
      })
    } else if (this.data.address.length > 250 || this.data.address.length < 6) {
      wx.showToast({
        title: '详细地址长度应为6至256个字符,请重新输入',
        icon: "none"
      })
    } else {
      app.globalData.getBindBankCardInfo.hmcId = this.data.hmcId; //姓名
      app.globalData.getBindBankCardInfo.name = this.data.name; //姓名
      app.globalData.getBindBankCardInfo.contactName = this.data.name; //企业、个体工商户/个人商家联系人姓名
      app.globalData.getBindBankCardInfo.mobile = this.data.mobile; //手机号
      app.globalData.getBindBankCardInfo.phoneNum = this.data.mobile; //联系人手机号，可为企业、个体工商户业务联系人手机号；个人商家提供联系手机号
      app.globalData.getBindBankCardInfo.email = this.data.email; //邮箱
      app.globalData.getBindBankCardInfo.provinceCode = this.data.provinceCode; //省
      app.globalData.getBindBankCardInfo.province = this.data.province; //省
      app.globalData.getBindBankCardInfo.cityCode = this.data.cityCode; //市
      app.globalData.getBindBankCardInfo.city = this.data.city; //市
      app.globalData.getBindBankCardInfo.areaCode = this.data.areaCode; //区
      app.globalData.getBindBankCardInfo.area = this.data.area; //区
      app.globalData.getBindBankCardInfo.address = this.data.address; //详细地址
      app.globalData.getBindBankCardInfo.certificatesNumber = this.data.certificatesNumber; //身份证号
      app.globalData.getBindBankCardInfo.certificatesValidity = this.data.certificatesValidity; //有效期值
      app.globalData.getBindBankCardInfo.certificatesFront = this.data.certificatesFront; //身份证正面
      app.globalData.getBindBankCardInfo.certificatesBack = this.data.certificatesBack; //身份证反面
      app.globalData.getBindBankCardInfo.certificatesInHandFront = this.data.certificatesInHandFront; //shouChi证件正面的照片
      if (customerType == '2') { //子商户（客户）类型  2:个体工商户3:个人商家和企业员工
        wx.navigateTo({ //个人商家或企业员工绑卡
          url: `/pages/cardLicenseIformation/cardLicenseIformation?customerType=${this.data.customerType}`,
        })
      } else if (customerType == '3') {
        app.globalData.getBindBankCardInfo.store1 = this.data.store1; //门店照1
        app.globalData.getBindBankCardInfo.store2 = this.data.store2; //门店照2
        app.globalData.getBindBankCardInfo.store3 = this.data.store3; //门店照3
        wx.navigateTo({
          url: `/pages/cardBankInformation/cardBankInformation?customerType=${this.data.customerType}`,
        })
      }
    }
  },
  //省市区
  loadList(event) {
    // 自定义组件触发事件时提供的detail对象，用来获取子组件传递来的数据
    var data = event.detail;
    this.setData({
      region: `${data.provinceName} ${data.cityName} ${data.countyName}`,
      province: data.provinceName,
      provinceCode: data.provinceCode,
      city: data.cityName,
      cityCode: data.cityCode,
      area: data.countyName,
      areaCode: data.countyCode,
    })
  },
  regionShow() {
    wx.hideKeyboard();
    this.setData({
      regionShow: true
    })
    this.selectComponent("#region").threeLevels()
  },
  bindDateChange: function (e) {
    this.setData({
      certificatesValidity: e.detail.value
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
      if (type === 'zheng') {
        this.setData({
          certificatesFront: url
        })
      } else if (type === "fan") {
        this.setData({
          certificatesBack: url
        })
      } else if (type === "shouChi") {
        this.setData({
          certificatesInHandFront: url
        })
      } else if (type === "menDian1") {
        this.setData({
          store1: url,
        })
      } else if (type === "menDian2") {
        this.setData({
          store2: url,
        })
      } else if (type === "menDian3") {
        this.setData({
          store3: url,
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
    if (type === 'zheng') {
      url = this.data.certificatesFront
    } else if (type === 'fan') {
      url = this.data.certificatesBack
    } else if (type === 'shouChi') {
      url = ''
      // url = this.data.certificatesInHandFront
    } else if (type === "menDian1") {
      url = this.data.store1;
    } else if (type === "menDian2") {
      url = this.data.store2;
    } else if (type === "menDian3") {
      url = this.data.store3;
    }
    if (!url) {
      this.upload('', type)
      return
    }
    wx.previewImage({
      urls: [url],
      current: url
    })
  },
  //图片选择,获取本地路径
  upload: function (e, typeData) {
    let type = typeData || e.currentTarget.dataset.type;
    app.upload(type, this.uploadFile);
  },
  //固定期限和永久按钮切换
  durationSelect(e) {
    let data = e.currentTarget.dataset.type;
    this.setData({
      isPermanent: data === 'gd' ? false : true,
      certificatesValidity: data === 'gd' ? '' : '2999-01-01',
    })
  },

})