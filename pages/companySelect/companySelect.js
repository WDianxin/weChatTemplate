// pages/companySelect/companySelect.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: '',
    radio: '',
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.bindChangerValue('')
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  bindChangerValue(val) {
    let value = val.detail
    if (!value) {
      value = ''
    }
    wx.showLoading({
      title: '加载中',
      modal: true
    })
    this.setData({
      radio: ''
    })
    app.reqFetch.common.findByCompanyName(value).then(res => {
      wx.hideLoading()
      if (res.data.code === 1) {
        let data = res.data.data;
        this.setData({
          list: data
        })
        if (data.length === 0) {
          this.setData({
            isNull: true
          })
        } else {
          this.setData({
            isNull: false
          })
        }
      }
    }).catch(() => {
      wx.hideLoading()
    })
  },
  onChange(event) {
    this.setData({
      radio: event.detail,
    });
  },

  onClick(event) {
    const {
      name
    } = event.currentTarget.dataset;
    let companyName = event.currentTarget.dataset.companyname;
    let id = event.currentTarget.dataset.id;
    let nick = event.currentTarget.dataset.nick;
    let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。

    let prevPage = pages[pages.length - 2];

    //prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，-3是上上个页面以此类推。
    prevPage.setData({ // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
      companyName: companyName,
      companyId: id,
      nick: nick,
    })

    //上一个页面内执行setData操作，将我们想要的信息保存住。当我们返回去的时候，页面已经处理完毕。
    wx.navigateBack({
      delta: 1 // 返回上一级页面。
    })
    //此时页面数据已经改变为我们传递过来的数据。如果想要返回之后处理这些数据，那么要在onShow函数里执行，因为我们执行的是返回，所以不会触发onLoad函数，所以我们要在onShow里执行我们想要使用的函数。

  },
})