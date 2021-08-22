// pages/login/login.js
// login页登录步骤:
// 1. 点击登录,获取用户微信信息,并存储本地;
// 2. 将验证码入参verifyCode写死为'1111'调取获取验证码接口,获取验证码和captcha值;
// 3. 使用验证码(verifyCode:1111),captcha值,用户名和密码调取login接口,后端判断用户名,密码,验证码是否正确,若正确会返回token和hmcId,前端需将其存储本地,若错误,登录步骤终止,弹出错误;
// 4.  使用hmcId调取isEcologyUser接口,判断当前用户是否是商家,若不是,提示用户注册商家;
// 5. 若是商家就获取本地openId,通过openId和hmcId调取bindOpenId接口,获取用户个人资料,并存入本地,完成登录,跳转到首页.
// 6.  若获取本地openId失败,需调取wxLogin函数重新获取openId,最后在调取bindOpenId接口,获取用户个人资料,并存入本地,完成登录,跳转到首页.
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    account: '', //用户名
    password: '', //密码
    key: '', //验证码key
    image: '', //验证码图片
    code: '', //输入的验证码
    isPassword: false, //是否显示密码
    verifyCode: '', //验证码
    captcha: '',
    verifyCodeUrl: '', //验证码地址
    hmcId:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      hmcId:app.auth.getHmcId()
    })
    try {
      wx.clearStorageSync();
      wx.clearStorage();
    } catch (e) {}
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

  //获取用户登录验证码
  verifyCode(data) {
    let _this = this;
    app.reqFetch.log.verifyCode().then(res => {
      if (res.data.code === 1) {
        _this.setData({
          captcha: res.data.data.captcha
        })
        data.captcha = res.data.data.captcha;
        app.reqFetch.log.login(data).then((res) => {
          if (res.data.code === 1) {
            app.auth.setToken(res.data.data.token); //存储token
            app.auth.setHmcId(res.data.data.hmc_id); //存储hmc_id
            //登录成功后调取根据用户hid判断是否是商家,若不是,提示注册
            _this.isEcologyUser(res.data.data.hmc_id)
          } else {
            wx.hideLoading()
          }
        }).catch((err) => {})
        return //以下是展示校验证码的的代码
        let result = res.data.data.base64;
        if (result != null) { //result为base64的图片数据（注意：没有前缀 data:image/png;base64,）
          var array = wx.base64ToArrayBuffer(result)
          const fsm = wx.getFileSystemManager();
          const FILE_BASE_NAME = 'motian_base64src';
          const filePath = wx.env.USER_DATA_PATH + '/' + FILE_BASE_NAME + '.jpg';
          fsm.writeFile({
            filePath,
            data: array,
            encoding: 'binary',
            success() {
              _this.setData({
                verifyCodeUrl: filePath,
                captcha: res.data.data.captcha
              })
            },
            fail() {

            },
          });
        }

      }
    }).catch(() => {
      if (isLogin) {
        wx.hideLoading();
        wx.showToast({
          title: '登录失败,请重新登录',
          icon: 'none'
        })
      }
    })
  },
  /**
   * 点击登录按钮
   */
  handleSubmit(e) {
    wx.showToast({
      title: "登录成功",
    })
    wx.reLaunch({
      url: '/pages/index/index?login=1',
    })
    return

    if (e.detail.userInfo) {
      e.detail.userInfo.genderName = e.detail.userInfo.gender === 1 ? "男" : "女";
      this.setData({
        avatarUrl: e.detail.userInfo.avatarUrl
      })
      app.auth.setUserInfo(e.detail.userInfo);
      //用户按了允许授权按钮
    } else {
      //用户按了拒绝按钮
    }
    if (this.data.account === '') {
      wx.showToast({
        title: '请输入手机号或工号',
        icon: 'none'
      })
      return;
    }
    if (this.data.password === '') {
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      })
      return;
    }
    // if (this.data.verifyCode === '') {
    //   wx.showToast({
    //     title: '请输入验证码',
    //     icon: 'none'
    //   })
    //   return;
    // }
    wx.showLoading({
      title: '登陆中',
    })
    let data = {
      username: this.data.account, //用户工号
      password: this.data.password, //密码
      // verifyCode: this.data.verifyCode, //验证码
      verifyCode: '1111', //验证码(隐藏值为1111)
      captcha: this.data.captcha
    }
    if(this.data.hmcId){
      this.outLogin(this.data.hmcId,data)
    }else{
      this.verifyCode(data)
    }

  },
  /**
   * 登录用户名和密码验证成功后,根据用户hmcId判断是否是商家,若不是,提示注册商家
   */
  isEcologyUser(hmcId) {
    if (!hmcId) return
    app.reqFetch.log.isEcologyUser(hmcId).then(res => {
      if (res.data.code === 1) {
        let openid = app.auth.getOpenId() //获取openId
        if (openid) {
          this.bindOpenId(hmcId, openid)
        } else {
          this.wxLogin(hmcId)
        }
      } else {
        wx.hideLoading()
      }
    }).catch(() => {

    })
  },
  /**
   * 小程序通过code获取openid  geOpenid:是否只获取geOpenid
   */
  wxLogin(hmcId) {
    wx.login({
      success: res => {
        // 微信临时登录凭证
        let _code = res.code;
        if (_code) {
          app.reqFetch.log.obtainOpenId(_code).then(res => {
            if (res.data.code === 1) {
              this.bindOpenId(hmcId, res.data.data.openid)
              app.auth.setOpenId(res.data.data.openid) //存储openId
            } else {
              wx.hideLoading()
            }
          }).catch(() => {

          })
        }
      },
      fail: res => {}
    });
  },

  //登录根据户名和密码验证成功后,根据用户hmcId和openId 绑定openid
  bindOpenId(hmcId, openId) {
    if (!hmcId || !openId) return
    let obj = {
      hmcId: hmcId,
      openId: openId
    }
    app.reqFetch.log.bindOpenId(obj).then(res => {
      if (res.data.code === 1) {
        this.userInfo(hmcId); //获取用户个人资料
        wx.showToast({
          title: "登录成功",
        })
        wx.reLaunch({
          url: '/pages/index/index?login=1',
        })
      } else {
        wx.hideLoading()
      }
    }).catch(() => {

    })
  },
  /**
   * 响应用户输入
   */

  handleInput(e) {
    this.setData({
      account: e.detail.value
    })
  },
  /**
   * 响应用户输入
   */
  handlePassword(e) {
    this.setData({
      password: e.detail.value
    })
  },

  /**
   * 响应用户输入
   */
  handleVerifyCodet(e) {
    this.setData({
      verifyCode: e.detail.value
    })
  },
  //右侧是否可视的图标
  showPassword: function (e) {
    var isPassword = !this.data.isPassword;
    this.setData({
      isPassword: isPassword
    })
  },
  //点击注册
  registration() {
    wx.navigateTo({
      url: '/pages/identitySelectionReg/identitySelectionReg',
    })
  },
  //忘记密码
  forgotpassword() {
    wx.navigateTo({
      url: '/pages/changePassword/changePassword?type=forgotPassword',
    })
  },
  //获取数据库用户个人资料
  userInfo(hmcId) {
    if (!hmcId) return;
    app.reqFetch.common.userInfo(hmcId).then(res => {
      if (res.data.code === 1) {
        let data = res.data.data;
        //数据库若没有用户头像,将微信头像存入数据库.
        if (!data.avatar) {
          this.updateUserIcon(this.data.avatarUrl)
        }
      }
    }).catch(() => {})
  },
  //将微信头像存储数据库
  //头像修改
  updateUserIcon(avatar) {
    if (!avatar) return
    app.reqFetch.common.updateUserIcon(avatar).then(res => {}).catch(() => {})
  },
  	//退出登录(解绑openid)
	outLogin(hmcId,data) {
		// 调取退出登录接口
		app.reqFetch.log.unbindOpenId(hmcId).then(res => {
			if (res.data.code === 1) {
        this.verifyCode(data)
			}
		}).catch((ee) => {
      wx.hideToast();
      this.verifyCode(data)
    })
	},

})
