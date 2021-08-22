// pages/myData/myData.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userImg: '../../image/user.png',
    isReadonly: true, //是否可以编辑
    isDisabled: false,
    name: '', //姓名
    genderShow: false, //性别开关
    sex: '', //性别
    mobile: '', //联系方式
    regionShow: false, //城市开关
    provinceCode: '', //省
    cityCode: '', //市
    countyCode: '', //区
    region: '', //城市
    companyName: '', // 公司
    identity: '', //1个人  2个体商户  3公司员工
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
    let data = app.auth.getUserInfoInterface();
    let region = `${data.provinceName||''} ${data.cityName||''} ${data.countyName||''}`
    this.setData({
      identity: data.identity, //1个人  2个体商户  3公司员工
      avatar: data.avatar,
      kind: data.kind,
      name: data.name, //姓名
      sex: data.sex, //性别开关
      mobile: data.mobile, //性别开关
      provinceCode: data.provinceCode, //省
      provinceName: data.provinceName, //省
      cityCode: data.cityCode, //市
      cityName: data.cityName, //市
      countyCode: data.countyCode, //区
      countyName: data.countyName, //区
      region: region, //城市
      companyName: data.companyName, // 公司
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
  //页面跳转
  goToURL(event) {
    if (this.data.isReadonly) return
    let url = event.target.dataset.url;
    wx.navigateTo({
      url: url,
    })
  },
  //性别选择
  genderShow() {
    wx.hideKeyboard();
    if (this.data.isReadonly) return
    this.setData({
      genderShow: true
    })
  },
  genderOnClose() {
    this.setData({
      genderShow: false
    });
  },
  //性别选择
  genderOnSelect(event) {
    if (this.data.isReadonly) return
    this.setData({
      genderShow: false,
      sex: event.detail.name,
    });
  },

  //省市区
  loadList(event) {
    // 自定义组件触发事件时提供的detail对象，用来获取子组件传递来的数据
    var data = event.detail;
    this.setData({
      region: `${data.provinceName} ${data.cityName} ${data.countyName}`,
      provinceName: data.provinceNam,
      provinceCode: data.provinceCode,
      cityName: data.cityName,
      cityCode: data.cityCode,
      countyName: data.countyNam,
      countyCode: data.countyCode,
    })
  },
  //地区
  regionShow() {
    if (this.data.isReadonly) return
    wx.hideKeyboard();
    this.setData({
      regionShow: true
    })
    this.selectComponent("#region").threeLevels()
  },





  //点击 服务条款
  bindServe() {
    wx.navigateTo({
      url: '../serveTerms/serveTerms'
    })
  },
  //点击修改
  bindEdit() {
    this.setData({
      isReadonly: false
    })
  },
  //点击保存
  bindSubmit() {
    if (!app.util.telTest(this.data.mobile)) {
      return
    } else if (!this.data.avatar) {
      wx.showToast({
        title: '请选择用户头像',
      })
    } else {
      wx.showLoading({
        title: '提交中',
        modal: true
      })
      this.setData({
        submitNumber: 0
      })
      this.updateUserMobile(this.data.mobile.trim())
      this.updateUserIcon(this.data.avatar.trim())
    }

  },
  //点击修改图片
  //图片选择,获取本地路径
  upload: function (e) {
    // if (this.data.isReadonly) return
    let type = e.currentTarget.dataset.type;
    app.upload(type, this.uploadFile);
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
        avatar: url,
      })
      this.updateUserIcon(this.data.avatar.trim())
    } else {
      app.uploadFileCommont(url, type, this.uploadFile)
    }
  },
  //头像修改
  updateUserIcon(avatar) {
    app.reqFetch.common.updateUserIcon(avatar).then(res => {
      wx.hideLoading()
      if (res.data.code === 1) {
        wx.showToast({
          title: '保存成功',
        })
      } else {
        this.setData({
          avatar: '',
        })
      }
    }).catch(() => {
      this.setData({
        avatar: '',
      })
    })
  },
  //手机号修改
  updateUserMobile(mobile) {
    app.reqFetch.common.updateUserMobile(mobile).then(res => {
      wx.hideLoading()
      if (res.data.code === 1) {
        this.setData({
          submitNumber: this.data.submitNumber + 1
        })
        if (this.data.submitNumber >= 2) {
          this.setData({
            isReadonly: true,
            submitNumber: this.data.submitNumber + 1
          })
          wx.hideLoading();
          wx.showToast({
            title: '保存成功',
          })
        }
      }
    }).catch(() => {
      this.setData({
        submitNumber: this.data.submitNumber + 1
      })
    })
  },
})