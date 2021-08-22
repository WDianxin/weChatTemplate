// components/paymentCode/paymentCode.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showCode: {
      type: Boolean,
    },
    codeObj: {
      type: Object,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    getUserInfo(event) {
    },

    onClose() {
      this.setData({
        showCode: false
      });
    },

  }
})