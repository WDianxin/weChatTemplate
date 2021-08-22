// components/bestChoice/bestChoice.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    bastList: {
      type: Array,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
       //点击列表
       toList(e) {
        let data = e.currentTarget.dataset;
        let url = `/pages/quotation/quotation?type=${data.type}&id=${data.id}&source=1&wareId=${data.wareid}`
        wx.navigateTo({
          url: url,
        })
      },

  }
})
