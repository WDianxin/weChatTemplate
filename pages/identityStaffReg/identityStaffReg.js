// pages/identityStaffReg/identityStaffReg.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    regData: {}, //重新注册信息数据
    kind: '', //注册类型
    companyName: '', //公司名称
    companyId: '', //公司名称id
    nick: '', //公司名称id
    userName: '', //姓名
    genderShow: false, //性别开关
    gender: '男', //性别
    genderCode: '0', //性别
    regionShow: false, //城市开关
    provinceCode: '', //省
    cityCode: '', //市
    countyCode: '', //区
    identityNum: '',
    region: '', //城市
    certificatePic2: '', //身份证反面
    certificatePic: '', //身份证正面
    password: '',
    submitType: '', // 1代表新增认证  2代表重新提交认证

    actions: [{
        name: '男',
        code: '0'
      },
      {
        name: '女',
        code: '1'
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      kind: options.kind, //种类
      mobile: options.mobile, //手机
      password: options.password, //密码
      submitType: options.submitType, // 1代表新增认证  2代表重新提交认证
    })
    if (options.submitType == '1' || options.submitType == '2') {
      this.certificationInformation(app.auth.getHmcId(), options.kind)
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
  genderShow() {
    wx.hideKeyboard()
    this.setData({
      genderShow: true
    })
  },
  genderOnClose() {
    this.setData({
      genderShow: false
    });
  },

  genderOnSelect(event) {
    this.setData({
      genderShow: false,
      gender: event.detail.name,
      genderCode: event.detail.code,
    });
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
    wx.hideKeyboard();
    this.setData({
      regionShow: true
    })
    this.selectComponent("#region").threeLevels()
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
        name: this.data.userName, //个人姓名
        staffName: this.data.userName, //员工姓名
        sex: this.data.gender, //性别
        provinceCode: this.data.provinceCode, //省编号
        provinceName: this.data.provinceName, //省名称
        cityCode: this.data.cityCode, //市编号
        cityName: this.data.cityName, //市名称
        countyCode: this.data.countyCode, //区(县)编号
        countyName: this.data.countyName, //区(县)名称
        identityNum: this.data.identityNum, //身份证号
        certificatePic: this.data.certificatePic, //证件照片(正)
        certificatePic2: this.data.certificatePic2, //证件照片(反)
        checkState: 0, // 审核状态  默认给个0
      }
      if (fromData.kind === 'yuanGong') {
        fromData.companyName = this.data.companyName; //公司名称
        fromData.nick = this.data.nick; //公司名称
        // fromData.companyId = this.data.companyId;
      }
      let obj = JSON.parse(JSON.stringify(fromData));
      wx.showLoading({
        title: '提交中',
        modal: true
      })
      app.reqFetch.log.saveEcologyIndividual(obj).then(res => {
        wx.hideLoading()
        if (res.data.code === 1) {
          wx.navigateTo({
            url: `/pages/identitySuccessfulSubmissionReg/identitySuccessfulSubmissionReg`,
          })
        }
      }).catch(() => {
        wx.hideLoading()
      })

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
      if (type === 'zheng') {
        this.setData({
          certificatePic: url,
        })
      } else {
        this.setData({
          certificatePic2: url,
        })
      }
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
    let type = e.currentTarget.dataset.type;
    let url = '';
    if (type === 'zheng') {
      url = this.data.certificatePic;
    } else {
      url = this.data.certificatePic2;
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
  // 点击公司
  bindCompany() {
    wx.hideKeyboard()
    wx.navigateTo({
      url: '/pages/companySelect/companySelect',
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
        // checkState:(-1:认证失败, 0 :审核中, 1:认证成功   未认证:null)
        let obj = res.data.data;
        obj.kind = this.data.kind;
        obj.submitType = this.data.submitType;
        this.setData({
          regData: obj,
          companyName: obj.companyName, //公司名称
          companyId: obj.companyId, //公司名称id
          nick: obj.nick, //公司名称id
          userName: obj.name, //姓名
          gender: obj.sex, //性别
          provinceCode: obj.provinceCode, //省
          provinceName: obj.provinceName, //省
          cityCode: obj.cityCode, //市
          cityName: obj.cityName, //市
          countyCode: obj.countyCode, //区
          countyName: obj.countyName, //区
          identityNum: obj.identityNum, //身份证
          region: `${obj.provinceName||''} ${obj.cityName||''} ${obj.countyName}`, //城市
          certificatePic2: obj.certificatePic2, //身份证反面
          certificatePic: obj.certificatePic, //身份证正面
        })
        if (!this.data.region || this.data.region === '  null') {
          this.setData({
            region: ''
          })
        }
      }

    }).catch(() => {})
  },
  //企业员工认证 和 个人商家认证信息 重新提交
  updateEcologyStaffEcologyIndividual() {
    wx.showLoading({
      title: '提交中',
      modal: true
    })
    let obj = JSON.parse(JSON.stringify(this.data.regData));
    obj.companyName = this.data.companyName; //公司名称
    obj.companyId = this.data.companyId; //公司名称id
    obj.nick = this.data.nick; //公司名称id
    obj.name = this.data.userName; //姓名
    obj.staffName = this.data.userName; //姓名
    obj.sex = this.data.gender; //性别
    obj.provinceCode = this.data.provinceCode; //省
    obj.provinceName = this.data.provinceName; //省
    obj.cityCode = this.data.cityCode; //市
    obj.cityName = this.data.cityName; //市
    obj.countyCode = this.data.countyCode; //区
    obj.countyName = this.data.countyName; //区
    obj.identityNum = this.data.identityNum; //身份证
    obj.certificatePic2 = this.data.certificatePic2; //身份证反面
    obj.certificatePic = this.data.certificatePic; //身份证正面

    app.reqFetch.log.updateEcologyStaffEcologyIndividual(obj).then(res => {
      wx.hideLoading();
      if (res.data.code === 1) {
        wx.navigateTo({
          url: '/pages/identitySuccessfulSubmissionReg/identitySuccessfulSubmissionReg?brackUrl=my',
        })
      }

    }).catch(() => {})
  },
})