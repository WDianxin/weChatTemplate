// components/region/region.js
const app = getApp()
Component({
  properties: {
    searchShow: {
      type: Boolean,
    },
    showGz: { // 属性名 是否显示是否已经关注
      type: Boolean, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: true, // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function (newVal, oldVal) {} // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
    },
  },
  data: {
    columns: ['距离最近', '价格最低'],
    columnsKey:['jin','di']
  },
  methods: {
    // 关闭弹窗触发
    onClose() {

    },

    onConfirm(event) {
      const {
        picker,
        value,
        index
      } = event.detail;
      this.setData({
        searchShow: false
      })
      this.data.loadList
      // 使用 triggerEvent 方法触发自定义组件事件，指定事件名、detail对象和事件选项
      // detail对象，提供给事件监听函数
      var myEventDetail = {
        // id: event.currentTarget.dataset.id
        id: '123'
      }
      // 触发事件的选项
      var myEventOption = {}
      this.triggerEvent('loadList', myEventDetail, myEventOption)
    },

    onCancel() {
      this.setData({
        searchShow: false
      })
    },
    touch() {
      return
    },
  }
})