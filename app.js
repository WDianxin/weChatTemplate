import auth from './utils/auth' //存储数据
import util from './utils/util' //工具类
import numberCalc from './utils/numberCalc' //数字计算
// ===========  api start
import log from './requestAPI/login' //登陆相关接口
import common from './requestAPI/common' //公用相关接口
import index from './requestAPI/index' //首页
import listOrder from './requestAPI/listOrder' //列表
import publicConfig from './utils/pubilc.js'
// ===========  api end
App({
  data: {

  },
  //监听小程序初始化 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
  onLaunch: function () {

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  onLoad: function (options) {
  },
  // 监听小程序显示 当小程序启动，或从后台进入前台显示，会触发 onShow
  onShow: function name(params) {

  },
  // 监听小程序隐藏 当小程序从前台进入后台，会触发 onHide
  onHide: function () {

  },
  //错误监听函数 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
  onError: function (msg) {},
  // 绑定请求
  reqFetch: {
    log,
    common,
    index,
    listOrder
  },
  //存储数据
  auth,
  //工具类
  util,
  //数字计算
  numberCalc,
  //有共享属性，全局共享。
  globalData: {
    onShareAppMessageTitle:'智家生活服务兵端',//分享 标题
    onShareAppMessagePath:'/pages/index/index',//分享 页面路径
    scrollTop: 200, //显示返回顶部距离
    userInfo: null,
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'],
    getBindBankCardInfo: {
      customerType: '', //子商户（客户）类型  2:个体工商户3:个人商家和企业员工
      auditStatus: '', //影印件审核状态(判断是否是绑卡)， s：审核成功；f：审核失败；p:审核中
    }, //当前用户绑卡数据对象
    restTokenInteral:null,//更新token定时器
  },
  /* 上传图片到后端
   *url:本地图片路径
   *type :回调函数使用类型
   * callbackF : 回调函数
   * isWhite : 是否使用白名单接口上传
   */
  uploadFileCommont(url, type, callbackF, isWhite) {
    if (!url) return
    wx.showLoading({
      title: '上传中',
      mask: true,
    })
    let src = '';
    let token = ''
    if (isWhite) { //白名单(注册专用)
      src = publicConfig.baseUrlImgUpload + '/ecology/zjdz-ecology/ecologyUser/simpleUpload' 
    } else {
      src = publicConfig.baseUrl2 + '/file/simpleUpload'
      token = "Bearer " + auth.getToken();
    }
    wx.uploadFile({
      url: src,
      filePath: url,
      name: 'file',
      header: {
        'Authorization': token,
        'content-type': 'multipart/form-data'
      },
      // formData: {
      //   'uploadFiledir': 'zjdz-ecology-wx-program'
      // },
      success: (res) => {
        let Result = JSON.parse(res.data);
        wx.hideLoading()
        if (Result.code === 1) {
          callbackF(Result.data, type, '成功')
        } else {
          wx.showToast({
            title: '上传失败,请重新上传',
            icon: 'none'
          })
        }
      }
    })
  },
  //图片选择,获取本地路径
  upload: function (type, uploadFile) {
    // let type = e.currentTarget.dataset.type;
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths[0];
        let nameList = tempFilePaths.split('.')
        let nameH = nameList[nameList.length - 1].toLowerCase()
        let imgType = ['jpg', 'jpeg', 'pgb', 'png']
        if (imgType.indexOf(nameH) === -1) {
          wx.showToast({
            title: '图片格式不正确,请重新上传',
            icon: 'none'
          })
          return false
        }
        var tempFilesSize = res.tempFiles[0].size; //获取图片的大小，单位B
        if (tempFilesSize <= (1024 * 1024 * 20)) { //图片小于或者等于2M时 可以执行获取图片
          uploadFile && uploadFile(tempFilePaths, type)
        } else { //图片大于2M，弹出一个提示框
          wx.showToast({
            title: '上传图片不能大于20M!', //标题
            icon: 'none' //图标 none不使用图标，详情看官方文档
          })
        }
      }
    })
  },
})
//修复number类型的tofixed方法。
Number.prototype.toFixed = function (d) {
  var s = this + "";
  if (!d) d = 0;
  d = parseFloat(d)
  if (s.indexOf(".") == -1) s += ".";
  s += new Array(d + 1).join("0");
  if (new RegExp("^(-|\\+)?(\\d+(\\.\\d{0," + (d + 1) + "})?)\\d*$").test(s)) {
    var s = "0" + RegExp.$2,
      pm = RegExp.$1,
      a = RegExp.$3.length,
      b = true;
    if (a == d + 2) {
      a = s.match(/\d/g);
      if (parseInt(a[a.length - 1]) > 4) {
        for (var i = a.length - 2; i >= 0; i--) {
          a[i] = parseInt(a[i]) + 1;
          if (a[i] == 10) {
            a[i] = 0;
            b = i != 1;
          } else break;
        }
      }
      s = a.join("").replace(new RegExp("(\\d+)(\\d{" + d + "})\\d$"), "$1.$2");
    }
    if (b) s = s.substr(1);
    return (pm + s).replace(/\.$/, "");
  }
  return this + "";
};