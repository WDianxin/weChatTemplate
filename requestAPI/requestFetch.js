import publicConfig from '../utils/pubilc.js'; //地址
import auth from '../utils/auth.js'; //存储
/*
 * 请求头公用配置
 */
const contentType = 'application/json;charset=UTF-8'
const header = {
  "Content-Type": contentType,
  "Authorization": "Bearer " + auth.getToken()
}
/*
 * 超时时间配置
 */
const timeout = 600000
/*
 * 通用请求封装
 * @param param.url {String} 相对地址
 * @param param.method {Array} 请求当时 
 * @param param.data {Array} 请求数据
 * @param param.captcha {object} 登陆页面输入验证码 
 * @return void
 */
const request = (params) => {
  const header = {
    "Content-Type": contentType,
    "Authorization": "Bearer " + auth.getToken()
  }
  if (params.headers) { //自定义请求头赋值
    for (let key in params.headers) {
      header[key] = params.headers[key]
    }
  }
  let url = ''
  //本地联调使用(生产,和测试不能使用)
  // if (params.url.substring(0, 13) === "/zjdz-ecology") {
  //   url = publicConfig.baseUrl +params.url;
  // } else {
  //   url = publicConfig.baseUrl2 + params.url;
  // }
  //发布测试和生产使用(本地联调不能使用)   //注意: 注册页面中有图片上传路径需要手动修改
  if (params.url.substring(0, 13) === "/zjdz-ecology") { //本地((新接口))
    url = publicConfig.baseUrl.substring(0, 27) + '/api/ecology' + params.url;
  } else {
    url = publicConfig.baseUrl2 + params.url;
  }
  return new Promise((resolve, reject) => {
    // header['Authorization'] = 'Bearer ' + auth.getToken()
    wx.request({
      url: url,
      method: params.method,
      data: params.data,
      header: header,
      timeout: timeout,
      responseType: params.responseType, //这一行非常重要，重中之重(用来通知服务器返回数据的类型,数据流生产二维码必用)
      success: function (res) {
        const status = res.data.code === undefined ? 200 : res.data.code;
        const url = params.url;
        if (res.data.code === 401 || res.data.msg && res.data.msg.indexOf('非法') >= 0) {
          try {
            wx.clearStorageSync();
            wx.clearStorage();
          } catch (e) {}
          wx.reLaunch({
            url: '/pages/login/login',
          })
        } else if (res.data.msg && res.data.msg.indexOf('过期') >= 0) {
          wx.reLaunch({
            url: '/pages/index/index',
          })
        } else if (status === 1) {
          resolve(res)
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          reject(res)
        }
      },
      fail: function (err) {
        reject(err)
      }
    })

  })


}

module.exports = {
  request
}