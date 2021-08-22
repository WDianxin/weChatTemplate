// pages/cardLicenseIformation/cardLicenseIformation.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    customerType: '', //子商户（客户）类型  2:个体工商户3:个人商家和企业员工
    titleWidth: "116px",
    kind: '', //注册类型
    regionShow: false, //城市开关
    region: '', //城市

    businessName: '', //营业执照名称
    businessProvince: '', //营业执照省
    businessProvinceCode: '', //营业执照省
    businessCity: '', //营业执照市
    businessCityCode: '', //营业执照市
    businessArea: '', //营业执照县
    businessAreaCode: '', //营业执照县
    businessLicenseNo: '', //统一社会信用代码
    businessLicenseValidity: '', //营业执照有效期，长期有效默认传2999-01-01
    license: '', //营业执照照片
    store1: '', //门店照1
    store2: '', //门店照2
    store3: '', //门店照3
    businessleaseContract: '', //办公场所租赁合同或产权证明照

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data = app.globalData.getBindBankCardInfo;
    let region = `${data.businessProvince||''} ${data.businessCity||''} ${data.businessArea||''}`;
    this.setData({
      customerType: options.customerType || data.customerType, //子商户（客户）类型  2:个体工商户3:个人商家和企业员工
      region: region,
      startDate: app.util.dateCurrent(), //开始时间
      businessName: data.businessName, //营业执照名称
      businessProvince: data.businessProvince, //营业执照省
      businessProvinceCode: data.businessProvince, //营业执照省
      businessCity: data.businessCity, //营业执照市
      businessCityCode: data.businessCityCode, //营业执照市
      businessArea: data.businessArea, //营业执照县
      businessAreaCode: data.businessAreaCode, //营业执照县
      businessLicenseNo: data.businessLicenseNo, //统一社会信用代码
      businessLicenseValidity: data.businessLicenseValidity, //营业执照有效期，长期有效默认传2999-01-01  
      isPermanent: data.businessLicenseValidity === '2999-01-01rn' ? true : false,
      license: data.license, //营业执照照片
      store1: data.store1, //门店照1
      store2: data.store2, //门店照2
      store3: data.store3, //门店照3
      businessleaseContract: data.businessleaseContract //办公场所租赁合同或产权证明照
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
  //点击下一步
  nextPage() {
    app.globalData.getBindBankCardInfo.businessName = this.data.businessName; //营业执照名称
    app.globalData.getBindBankCardInfo.businessProvince = this.data.businessProvince; //营业执照省
    app.globalData.getBindBankCardInfo.businessProvinceCode = this.data.businessProvinceCode; //营业执照省
    app.globalData.getBindBankCardInfo.businessCity = this.data.businessCity; //营业执照市
    app.globalData.getBindBankCardInfo.businessCityCode = this.data.businessCityCode; //营业执照市
    app.globalData.getBindBankCardInfo.businessArea = this.data.businessArea; //营业执照县
    app.globalData.getBindBankCardInfo.businessAreaCode = this.data.businessAreaCode; //营业执照县
    app.globalData.getBindBankCardInfo.businessLicenseNo = this.data.businessLicenseNo; //统一社会信用代码
    app.globalData.getBindBankCardInfo.businessLicenseValidity = this.data.businessLicenseValidity; //营业执照有效期，长期有效默认传2999-01-01  
    app.globalData.getBindBankCardInfo.license = this.data.license; //营业执照照片
    app.globalData.getBindBankCardInfo.store1 = this.data.store1; //门店照1
    app.globalData.getBindBankCardInfo.store2 = this.data.store2; //门店照2
    app.globalData.getBindBankCardInfo.store3 = this.data.store3; //门店照3
    app.globalData.getBindBankCardInfo.businessleaseContract = this.data.businessleaseContract; //办公场所租赁合同或产权证明照
    if (this.data.businessProvinceCode === '' || this.data.businessCityCode === '' || this.data.businessAreaCode === '') {
      wx.showToast({
        title: '营业执照城市数据不全,请重新选择',
        icon: "none"
      })
    } else {
      wx.navigateTo({
        url: `/pages/cardBankInformation/cardBankInformation?customerType=${this.data.customerType}`,
      })
    }
  },
  //省市区
  loadList(event) {
    // 自定义组件触发事件时提供的detail对象，用来获取子组件传递来的数据
    var data = event.detail;
    this.setData({
      region: `${data.provinceName} ${data.cityName} ${data.countyName}`,
      businessProvince: data.provinceName,
      businessProvinceCode: data.provinceCode,
      businessCity: data.cityName,
      businessCityCode: data.cityCode,
      businessArea: data.countyName,
      businessAreaCode: data.countyCode,
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
  bindDateChange: function (e) {
    this.setData({
      businessLicenseValidity: e.detail.value
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
      if (type === 'yingYe') {
        this.setData({
          license: url,
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
      } else if (type === "banGong") {
        this.setData({
          businessleaseContract: url,
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
    if (type === 'yingYe') {
      url = this.data.license;
    } else if (type === "menDian1") {
      url = this.data.store1;
    } else if (type === "menDian2") {
      url = this.data.store2;
    } else if (type === "menDian3") {
      url = this.data.store3;
    } else if (type === "banGong") {
      url = this.data.businessleaseContract;
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
    let type = typeData||e.currentTarget.dataset.type;
    app.upload(type, this.uploadFile);
  },
  //固定期限和永久按钮切换
  durationSelect(e) {
    let data = e.currentTarget.dataset.type;
    this.setData({
      isPermanent: data === 'gd' ? false : true,
      businessLicenseValidity: data === 'gd' ? '' : '2999-01-01',
    })
  },
})