// components/swiperComp/swiperComp.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //数据集合
    swiperDataArr: {
      type: Array,
      value: []
    },
    //轮播图高度
    swithHeight: {
      type: String,
      value: "150px"
    },
    indicatorDots: {
      type: Boolean,
      value: true
    }, //是否显示面板指示点
    autoplay: {
      type: Boolean,
      value: true
    }, //是否自动切换
    interval: {
      type: Number,
      value: 2000
    }, //自动切换时间间隔
    duration: {
      type: Number,
      value: 500
    }, //滑动动画时长
    //前边距，可用于露出前一项的一小部分，接受 px 和 rpx 值
    previousMargin: {
      type: String,
      value: '10rpx'
    },
    //后边距，可用于露出后一项的一小部分，接受 px 和 rpx 值
    nextMargin: {
      type: String,
      value: '10rpx'
    }
  },
  created: function () {},
  attached: function () {},
  ready: function () {},
  moved: function () {},
  detached: function () {},

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    //点击轮播图片跳转到相应的页面或地址
    toUrl(e) {
      // 承载网页的容器。会自动铺满整个小程序页面，个人类型的小程序暂不支持使用。
      // wx.miniProgram.navigateTo({
      //   url: 'https://www.baidu.com/'
      // })
      let url = e.currentTarget.dataset.activityurl;
      // let url ='https://youzan.github.io/vant-weapp/#/intro';
      let src = "/pages/swiperCompH5/swiperCompH5"
      if (url) {
        wx.navigateTo({
          url: `${src}?h5url=${url}`,
        })
        // wx.miniProgram.navigateTo({
        //   url: url
        // })
      }


    }

  }
})