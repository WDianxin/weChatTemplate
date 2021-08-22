const app = getApp()
Component({
   // 启用插槽
   options: {
    multipleSlots: true
  },
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
  },
  properties: {
    //标题
    navigationBarTitle: {
      type: String,
      value: '智家生活服务兵端'
    },
    //是否有返回按钮
    back: {
      type: Boolean,
      value: false
    },
    //是否有home按钮
    home: {
      type: Boolean,
      value: false
    },
    //是否有点击返回键回调
    backFun: {
      type: Boolean
    }
  },
  methods: {
    backHome: function () {
      wx.reLaunch({
        url: '/pages/index/index',
      })
    },
    back: function () {
      if (this.data.backFun) {
        // 使用 triggerEvent 方法触发自定义组件事件，指定事件名、detail对象和事件选项
        this.triggerEvent('backFun', '')
      } else {
        wx.navigateBack({
          delta: 1
        })
      }
    }
  }
})