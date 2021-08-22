// pages/identityBusinessReg/identityBusinessReg.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sex: '男',
    genderCode: '0', //性别
    genderShow: false, //性别开关
    startDate: '', //开始日期
    regionShow: false, //城市开关
    provinceCode: '', //省
    cityCode: '', //市
    countyCode: '', //区
    identityNum: '', //身份证号
    region: '', //城市
    titleWidth: "116px",
    isPermanent: false, //营业照是否永久有效 1:永久   2:固定
    businessLicensePic: '', //营业执照地址
    password: '',
    indName: '', //经营者姓名
    businessLicenseName: '', //营业执照名称
    creditCode: "", //统一社会信用代码
    businessLicenseDate: '', //营业执照有效期
    submitType: '', // 1代表新增认证  2代表重新提交认证
    actions: [{
      name: '男',
      code: '0'
    },
    {
      name: '女',
      code: '1'
    }
  ]
   
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
genderOnClose() {
  this.setData({
    genderShow: false
  });
},
genderOnSelect(event) {
  this.setData({
    genderShow: false,
    sex: event.detail.name,
    genderCode: event.detail.code,
  });
},
/**
 * 生命周期函数--监听页面加载
 */
onLoad: function (options) {
  this.setData({
    kind: options.kind, //种类
    mobile: options.mobile, //手机
    password: options.password, //密码
    startDate: app.util.dateCurrent(),
    submitType: options.submitType, // 1代表新增认证  2代表重新提交认证
  })
  if (options.submitType == '1' || options.submitType == '2') {
    this.certificationInformation(app.auth.getHmcId(), options.kind)
  }
},
genderShow() {
  wx.hideKeyboard()
  this.setData({
    genderShow: true
  })
},
//省市区
loadList(event) {
  // 自定义组件触发事件时提供的detail对象，用来获取子组件传递来的数据
  var data = event.detail;
  this.setData({
    region: `${data.provinceName} ${data.cityName} ${data.countyName}`,
    provinceName: data.provinceName,
    provinceCode: data.provinceCode,
    cityName: data.cityName,
    cityCode: data.cityCode,
    countyName: data.countyName,
    countyCode: data.countyCode,
  })
},
regionShow() {
  wx.hideKeyboard()
  this.setData({
    regionShow: true
  })
  this.selectComponent("#region").threeLevels()
},
//固定期限和永久按钮切换
durationSelect(e) {
  let data = e.currentTarget.dataset.type;
  this.setData({
    isPermanent: data === 'gd' ? false : true
  })
},

//下一步
nextPage2: function () {
  if (this.data.provinceCode === '' || this.data.cityCode === '' || this.data.countyCode === '') {
    wx.showToast({
      title: '城市资料不全,请重新选择',
      icon: "none"
    })
  } else if (!app.util.identityNumTest(this.data.identityNum)) {
    return false;
  } else {
    if (this.data.submitType == '1' || this.data.submitType == '2') {
      this.updateEcologyStaffEcologyIndividual()
      return
    }
    let fromData = {
      hmcId: this.data.mobile, //登录账号
      password: this.data.password, //密码
      kind: this.data.kind, //用户种类
      avatar: this.data.avatar, //用户头像
      mobile: this.data.mobile, //手机号
      indName: this.data.indName, //经营者姓名
      sex: this.data.sex, //性别
      identityNum: this.data.identityNum, //身份证号
      businessLicensePic: this.data.businessLicensePic, //营业执照图片
      businessLicenseName: this.data.businessLicenseName, //营业执照名称
      provinceCode: this.data.provinceCode, //省编号
      provinceName: this.data.provinceName, //省名称
      cityCode: this.data.cityCode, //市编号
      cityName: this.data.cityName, //市名称
      countyCode: this.data.countyCode, //区(县)编号
      countyName: this.data.countyName, //区(县)名称
      creditCode: this.data.creditCode, //统一社会信用代码
      isPermanent: this.data.isPermanent ? 1 : 2, //是否永久有效1:永久   2:固定
      businessLicenseDate: this.data.businessLicenseDate, //营业执照有效期
      checkState: 0, // 审核状态  默认给个0
    }
    if (fromData.isPermanent === 1) {
      fromData.businessLicenseDate = ''
    }
    let data = JSON.parse(JSON.stringify(fromData))
    wx.showLoading({
      title: '提交中',
      modal: true
    })
    app.reqFetch.log.saveEcologyIndividualMerchants(data).then(res => {
      wx.hideLoading()
      if (res.data.code === 1) {
        wx.navigateTo({
          url: '/pages/identitySuccessfulSubmissionReg/identitySuccessfulSubmissionReg',
        })
      }
    }).catch(() => {})

  }
},
/* 上传图片到后端
 *url:本地图片路径或返回的网络图片路径
 *type :操作类型
 * type2 : 成功后的标志
 */
uploadFile(url, type, type2) {
  if (!url) return
  if (type2 === '成功') {
    this.setData({
      businessLicensePic: url,
    })
  } else {
    if (this.data.submitType == '1' || this.data.submitType == '2') {
      app.uploadFileCommont(url, type, this.uploadFile)
    } else {
      app.uploadFileCommont(url, type, this.uploadFile, true)
    }

  }
},
//展示图片
showImg: function (e) {
  let url = this.data.businessLicensePic
  if (!url) {
    this.upload('', '11')
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
bindDateChange: function (e) {
  this.setData({
    businessLicenseDate: e.detail.value
  })
},
//获取注册信息
certificationInformation(hmcId, type) {
  wx.showLoading({
    title: '加载中',
    modal: true
  })
  app.reqFetch.log.certificationInformation(hmcId, type).then(res => {
    wx.hideLoading();
    if (res.data.code === 1) {
      let obj = res.data.data;
      obj.kind = this.data.kind;
      obj.submitType = this.data.submitType;
      this.setData({
        regData: obj,
        indName: obj.indName, //经营者姓名
        sex: obj.sex, //性别
        identityNum: obj.identityNum, //身份证号
        businessLicensePic: obj.businessLicensePic, //营业执照图片
        businessLicenseName: obj.businessLicenseName, //营业执照名称
        provinceCode: obj.provinceCode, //省编号
        provinceName: obj.provinceName, //省名称
        cityCode: obj.cityCode, //市编号
        cityName: obj.cityName, //市名称
        countyCode: obj.countyCode, //区(县)编号
        countyName: obj.countyName, //区(县)名称
        creditCode: obj.creditCode, //统一社会信用代码
        isPermanent: obj.isPermanent === 1 ? true : false, //是否永久有效1:永久   2:固定
        businessLicenseDate: obj.businessLicenseDate, //营业执照有效期
        region: `${obj.provinceName||''} ${obj.cityName||''} ${obj.countyName}`, //城市
      })
      if (!this.data.region || this.data.region === '  null') {
        this.setData({
          region: ''
        })
      }
    }

  }).catch(() => {})
},
//个体商家认证信息 重新提交
updateEcologyStaffEcologyIndividual() {
  wx.showLoading({
    title: '提交中',
    modal: true
  })
  let obj = JSON.parse(JSON.stringify(this.data.regData));
  obj.indName = this.data.indName; //经营者姓名
  obj.sex = this.data.sex; //经营者姓名
  obj.identityNum = this.data.identityNum; //身份证号
  obj.businessLicensePic = this.data.businessLicensePic; //营业执照图片
  obj.businessLicenseName = this.data.businessLicenseName; //营业执照名称
  obj.provinceCode = this.data.provinceCode; //省编号
  obj.provinceName = this.data.provinceName; //省名称
  obj.cityCode = this.data.cityCode; //市编号
  obj.cityName = this.data.cityName; //市名称

  obj.countyCode = this.data.countyCode; //区(县)编号
  obj.countyName = this.data.countyName; //区(县)名称
  obj.creditCode = this.data.creditCode; //统一社会信用代码
  obj.isPermanent = this.data.isPermanent ? 1 : 2; //是否永久有效1:永久   2:固定
  obj.businessLicenseDate = this.data.businessLicenseDate; //营业执照有效期
  app.reqFetch.log.updateEcologyStaffEcologyIndividual(obj).then(res => {
    wx.hideLoading();
    if (res.data.code === 1) {
      wx.navigateTo({
        url: '/pages/identitySuccessfulSubmissionReg/identitySuccessfulSubmissionReg?brackUrl=my',
      })
    }

  }).catch(() => {})
},
genderOnSelect(event) {
  this.setData({
    genderShow: false,
    sex: event.detail.name,
    genderCode: event.detail.code,

  });
},
})