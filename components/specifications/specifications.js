// components/specifications/specifications.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

    //规格数据集合
    specificationsArr: {
      type: Array
    },
    //标准价格报价对象
    sfbjData: {
      type: Object
    },
    pageType: {
      type: String
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
    //规格 计算金额
    getUserInfo(event) {
      let totl = 0
      let list = [];
      let totalNumber = 0;
      for (let item of this.data.specificationsArr) {
        if (item.quantity > 0) {
          let obj = {}
          totl += app.numberCalc.mul(item.quantity, item.price);
          totalNumber += item.quantity;
          obj.specification = item.specification; //规格名称
          obj.specificationId = item.id; //规格id
          obj.number = item.quantity; //数量
          obj.speNum = item.speNum; //规格编码
          obj.price = parseFloat(item.price).toFixed(2); //单价
          obj.totalPrice = parseFloat(app.numberCalc.mul(item.quantity, item.price)).toFixed(2); //总价
          list.push(obj)
        }
      }
      let obj = {
        totl: parseFloat(totl).toFixed(2),
        list: list,
        totalNumber: totalNumber
      }
      this.triggerEvent('countTotl', obj)
    },

    //点击减
    jian(e) {
      let index = e.currentTarget.dataset.index;
      let arr = this.data.specificationsArr;
      if (parseInt(arr[index].quantity) > 0) {
        arr[index].quantity--;
      } else {
        arr[index].quantity = 0
      }
      this.setData({
        specificationsArr: arr
      })
      this.getUserInfo(); //规格计算
    },
    //点击加
    jia(e) {
      let index = e.currentTarget.dataset.index;
      let arr = this.data.specificationsArr;
      arr[index].quantity++;
      this.setData({
        specificationsArr: arr
      })
      this.getUserInfo(); //规格计算
    },
    // 修改数量,对特殊字符处理
    bindChange(e) {
      let index = e.currentTarget.dataset.index;
      let arr = this.data.specificationsArr;
      let num = e.detail || 0;
      let data = app.util.onlyNumber(num);
      arr[index].quantity = data;
      this.setData({
        specificationsArr: arr
      })
      this.getUserInfo(); //规格计算
    },
  }
})