// components/region/region.js
const app = getApp()
Component({
  properties: {
    regionShow: {
      type: Boolean,
    },
    showGz: { // 属性名 是否显示是否已经关注
      type: Boolean, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: true, // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function (newVal, oldVal) {} // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
    },
  },
  data: {
    areaList: {}
  },


  methods: {
    // 关闭弹窗触发
    onClose() {

    },

    onConfirm(event) {
      this.setData({
        regionShow: false
      })
      //  使用 triggerEvent 方法触发自定义组件事件，指定事件名、detail对象和事件选项
      var myEventDetail = {
        // id: event.currentTarget.dataset.id
        provinceName: event.detail.values[0].name,
        provinceCode: event.detail.values[0].code,
        cityName: event.detail.values[1].name,
        cityCode: event.detail.values[1].code,
        countyName: event.detail.values[2] ? event.detail.values[2].name : '',
        countyCode: event.detail.values[2] ? event.detail.values[2].code : '',
      }
      //   // 触发事件的选项
      //   var myEventOption = {} 
      this.triggerEvent('loadList', myEventDetail)
    },

    onCancel(event) {
      this.setData({
        regionShow: false
      })
    },
    //获取省市区三级地址全量查询接口
    threeLevels() {
      if (Object.keys(this.data.areaList).length > 0) return
      wx.showLoading({
        title: '获取中',
        mask: true,
      })
      app.reqFetch.common.threeLevels().then(res => {
        wx.hideLoading()
        if (res.data.code === 1) {
          let list = res.data.data;
          var province_list = {}; //省
          var city_list = {}; //市
          var county_list = {}; //区
          this.regiongDataHandle(list, province_list, city_list, county_list);
          this.setData({
            areaList: {
              province_list: province_list,
              city_list: city_list,
              county_list: county_list
            }
          })
        }

      }).catch(() => {
      })
    },
    //数据处理,分离出省市区
    regiongDataHandle(data, province_list, city_list, county_list) {
      for (let item of data) {
        let value = item.value;
        let label = item.label;
        if (item.levels === 0) {
          province_list[value] = label;
        } else if (item.levels === 1) {
          city_list[value] = label;
        } else if (item.levels === 2) {
          county_list[value] = label;
        }
        if (item.children && item.children.length > 0) {
          this.regiongDataHandle(item.children, province_list, city_list, county_list)
        }

      }
    },
  }
})