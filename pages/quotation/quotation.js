// pages/quotation/quotation.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isDisable: true, //付款码是否可用
    insertOrder: {
      totalNumber: 0
    },
    pageType: '', //当前页面类型
    codeObj: {}, //付款码数据
    showCode: false, //是否显示二维码
    swiperDataArr: [], //顶部轮播图
    active: 0, //默认显示
    //产品详情图
    detailsImg: [],
    //产品详情内容
    sfbjData: {},
    //规格列表
    specificationsArr: [],
    neEditMoney: 0, //正在修改的价格
    editMoneyShow: false, //是否显示修改价格
    orderNum: '', //生成的收款码连接
    setIntervalFun: null,
    remarks: '', //备注
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      pageType: options.type,
      orderNum: '', //清空orderNum
      source: options.source, //1:服务兵,2:三翼鸟
      id: options.id || options.infoId, //商品id
      businessNo: options.businessNo, //三翼鸟生产付款码id
      wareId: options.wareId, //订单编码
    })
    this.selectHeadPic(1, options.wareId);
    this.selectHeadPic(2, options.wareId);
    this.selectServiceInformation(options.wareId);
    this.selectServiceSpeList(options.wareId);
    var that = this;
    //判断设备类型
    wx.getSystemInfo({
      success: function (res) {
        if (res.platform == 'ios' && (res.model.indexOf('iPhone 6s') >= 0||res.model.indexOf('iPhone 7') >= 0||res.model.indexOf('iPhone 8') >= 0)) {
          that.setData({
            offsetTop: '58',
          })
        } else if (res.platform == 'ios') {
          that.setData({
            offsetTop: '88',
          })
        } else {
          that.setData({
            offsetTop: '70',
          })
        }
      }
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
  onChange(event) {
    // wx.showToast({
    //   title: `切换到标签 ${event.detail.index}`,
    //   icon: 'none',
    // });
  },
  onHide() {
    this.data.setIntervalFun && clearInterval(this.data.setIntervalFun)
  },
  onShow() {},
  //规格选择金额计算
  countTotl(e) {
    let data = e.detail;
    this.setData({
      insertOrder: data
    })
    let obj = this.data.sfbjData;
    let bjTool = parseFloat(data.totl) === 0 || !parseFloat(data.totl) ? obj.bjCopy : data.totl;
    obj.bj = "￥" + bjTool; //标准报价
    obj.shbj = "￥" + data.totl; //实收报价
    this.setData({
      sfbjData: obj,
      neEditMoney: data.totl
    })
  },

  //根据订单付款码连接生成付款码
  newMoneyCode() {
    if (this.data.insertOrder.totalNumber === 0) {
      wx.showToast({
        title: '请您先选择规格',
        icon: 'none'
      })
    } else {
      let that = this;
      wx.showModal({
        title: '温馨提示',
        content: '您确定要生成收款码?',
        success(res) {
          if (res.confirm) {
            that.insertOrder()
          } else if (res.cancel) {}
        }
      })
    }
  },
  //点击收款码,判断生产付款码是否可点
  findIsPaymentStatus() {
    let hmcId = app.auth.getHmcId();
    if (!hmcId) return
    wx.showLoading({
      title: '加载中',
      modal: true
    })
    app.reqFetch.index.findIsPaymentStatus(hmcId).then(res => {
      wx.hideLoading()
      if (res.data.code === 1) {
        let data = res.data.data;
        if (data === "通过") {
          this.newMoneyCode()
        } else if (data === "未签署协议" || data === "银行卡信息未审批通过") {
          wx.showModal({
            title: '',
            content: '您还未绑定银行卡，快去绑定吧',
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/myBurse/myBurse',
                })
              } else if (res.cancel) {

              }
            }
          })

        } else if (data === '未认证角色') {
          wx.showModal({
            title: '',
            content: '您还未完成信息认证，快去认证吧',
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/identitySelection/identitySelection',
                })
              } else if (res.cancel) {

              }
            }
          })

        }
        this.setData({
          isDisable: false
        })
      } else {
        wx.hideLoading()
      }
    }).catch(() => {})
  },
  //根据选中的订单信息查询订单付款码连接
  insertOrder() {
    let data = JSON.parse(JSON.stringify(this.data.insertOrder));
    if (this.data.orderNum) {
      data.orderNum = this.data.orderNum;
    }
    // source来源1自己生成2三翼鸟
    //  businessNo 派单单号，自己的不用传，三翼鸟的派单表中有
    if (this.data.source == 2) { //三翼鸟
      data.businessNo = this.data.businessNo; //派单单号，自己的不用传，三翼鸟的派单表中有
      data.source = 2; //订单来源 1:智家生活服务兵, 2:三翼鸟
    } else {
      data.source = 1; //订单来源 1:智家生活服务兵, 2:三翼鸟
    }

    data.remarks = this.data.remarks; //备注
    data.standardPrice = this.data.sfbjData.bj.substring(1); //标准报价
    data.factPrice = this.data.sfbjData.shbj.substring(1); //实收报价
    for (let item of data.list) {
      item.wareName = this.data.sfbjData.wareName; //商品名称
      item.wareId = this.data.sfbjData.wareId; //商品编码
      item.serviceId = this.data.sfbjData.id; //商品表id
    }
    app.reqFetch.common.insertOrder(data).then(res => {
      if (res.data.code === 1) {
        this.setData({
          orderNum: res.data.data
        })
        this.createQrCode(res.data.data)
      } else {
        wx.hideLoading()
      }

    }).catch(() => {

    })
  },
  //通过url生产二维码  
  createQrCode(orderNum) {
    let that = this;
    app.reqFetch.listOrder.createQrCode(orderNum).then(res => {
      wx.hideLoading()
      var base64 = wx.arrayBufferToBase64(res.data);
      let obj = this.data.codeObj;
      obj.imgUrl = "data:image/PNG;base64," + base64;
      obj.brandName = this.data.sfbjData.brandName || '';
      that.setData({
        codeObj: obj,
        showCode: true
      })
      wx.hideLoading()
      that.setData({
        setIntervalFun: setInterval(function () {
          that.selectOrder(orderNum)
        }, 5000)
      })

    }).catch((err) => {})
  },
  //实时判断有没有付款成功
  selectOrder(orderNum) {
    let that = this;
    app.reqFetch.listOrder.selectOrder(orderNum, parseInt(this.data.source)).then(res => {
      if (res.data.code === 1) {
        let obj = res.data.data;
        // 支付状态 -1付款失败/0待付款/1已付款/2已关闭
        if (obj.payStatus === -1) {
          wx.showToast({
            title: '付款失败,请重新生成付款码',
            icon: 'none'
          })
          clearInterval(this.data.setIntervalFun)
          this.selectComponent("#paymentCode").onClose();
        } else if (obj.payStatus === 1 || obj.payStatus === 2) {
          clearInterval(that.data.setIntervalFun)
          wx.showToast({
            title: '付款成功',
            icon: 'none'
          })
          setTimeout(function () {
            wx.reLaunch({
              url: '/pages/listOrders/listOrders?active=2',
            })
          }, 1500)
          that.selectComponent("#paymentCode").onClose();
        }
      } else {
        clearInterval(that.data.setIntervalFun)
        that.selectComponent("#paymentCode").onClose();
      }
    }).catch(() => {
      clearInterval(that.data.setIntervalFun)
      that.selectComponent("#paymentCode").onClose();
    })
  },
  // 编辑报价
  editMoney() {
    let str = this.data.sfbjData.shbj;
    if (str.indexOf('￥') >= 0) {
      str = str.substring(1)
    }
    this.setData({
      editMoneyShow: true,
      neEditMoney: str
    })
  },
  //修改价格确认
  getUserInfo(event) {
    let obj = this.data.sfbjData;
    let str = parseFloat(this.data.neEditMoney).toFixed(2);
    if (isNaN(str)) {
      str = '0.00'
    }
    obj.shbj = '￥' + str;
    this.setData({
      sfbjData: obj
    })
  },
  //修改价格取消
  onClose() {
    this.setData({
      close: false
    });
  },
  // 修改金额处理
  bindChange(e) {
    this.setData({
      neEditMoney: app.util.onlyNumber(e.detail)
    })
  },
  //详情页轮播图和商品详情图片获取//(1:商品详情图片;2:滚动栏图片)
  selectHeadPic(picType, wareId) {
    let data = {
      picType: picType, //(1:商品详情图片;2:滚动栏图片)
      serviceId: wareId, //商品编码
    }
    app.reqFetch.index.selectHeadPic(data).then(res => {
      if (res.data.code === 1) {
        if (picType === 1) {
          let data = res.data.data;
          if (this.data.pageType === '智家优选') {
            let list = []
            for (let item of data) {
              // let str = item.picture.replace(/\<img src=\\/g, `<img style="width:100%!important;height:auto!important;display:block!important; word-break:break-all;object-fit: cover;" src=`);
              let str = item.picture.replace(/\<img src=/g, `<img style="width:100%;height:auto;display:block;" src=`);
              let tem = str.replace(/\\"/g, `"`);
              item.picture = tem;
              list.push(item)
            }
            this.setData({
              detailsImg: list
            })
          } else {
            this.setData({
              detailsImg: data
            })
          }

        } else if (picType === 2) {
          for (let item of res.data.data) {
            item.bannerPic = item.picture;
          }
          this.setData({
            swiperDataArr: res.data.data
          })
        }
      }
    }).catch(() => {})
  },
  //商品详情
  selectServiceInformation(wareId) {
    app.reqFetch.listOrder.selectServiceInformation(wareId).then(res => {
      if (res.data.code === 1) {
        let data = res.data.data.result[0];
        let num = isNaN(parseFloat(data.defaultPrice).toFixed(2))? '0.00' : parseFloat(data.defaultPrice).toFixed(2);
        data.defaultPrice = num
        data.bj = "￥" + num;
        data.bjCopy = num;
        data.shbj = "￥" + num;
        data.unitS = data.unit.indexOf('/') >= 0 ? true : false;
        this.setData({
          sfbjData: data
        })
      }
    }).catch(() => {})
  },
  //商品规格信息list
  selectServiceSpeList(id, wareId) {
    app.reqFetch.listOrder.selectServiceSpeList(id, wareId).then(res => {
      if (res.data.code === 1) {
        for (let item of res.data.data) {
          item.quantity = 0;
          item.unitS = item.unit.indexOf('/') >= 0 ? true : false;
          item.price = isNaN(parseFloat(item.price).toFixed(2)) ? '0.00' : parseFloat(item.price).toFixed(2);
        }
        this.setData({
          specificationsArr: res.data.data
        })
      }
    }).catch(() => {})
  },
})