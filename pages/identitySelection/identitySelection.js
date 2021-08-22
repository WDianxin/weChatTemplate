// pages/identitySelection/identitySelection.js
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		selectTitle:"",
			listArr :[
				{name:'消防信息考试',active:false},
				{name:'人力资源考试',active:false},
				{name:'企业培训考试',active:false},
				{name:'健康管理考试',active:false},
				{name:'理财规划考试',active:false},
				{name:'教师招聘考试',active:false},
			]
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
	//页面跳转
	nextPage() {
	if(!this.data.selectTitle){
	return wx.showToast({
			title: '请选择考试科目',
			icon:"none"
		})
	}
	console.log('this.data.selectTitle==',this.data.selectTitle)
		wx.reLaunch({
			url: `/pages/listOrders/listOrders?title=${this.data.selectTitle}`,
		})
		return

		let type = event.currentTarget.dataset.type;
		let url = event.target.dataset.url;
		let renZheng = event.target.dataset.renzheng;
		if (renZheng == '1') { //已认证
			wx.navigateTo({
				url: `/pages/identitySuccessfulSubmissionReg/identitySuccessfulSubmissionReg?sucessBool=true&submitType=1&brackUrl=back&kind=${type}`,
			})
		} else { //未认证
			this.certificationInformation(type, url)
		}
	},
	//获取注册信息
	certificationInformation(type, url) {
		wx.showLoading({
			title: '加载中',
			modal: true
		})
		app.reqFetch.log.certificationInformation(app.auth.getHmcId(), type).then(res => {
			wx.hideLoading();
			if (res.data.code === 1) {
				// checkState:(-1:认证失败, 0 :审核中, 1:认证成功   未认证:null)
				let obj = res.data.data;
				if (!obj.checkOpinion || obj.checkOpinion == 'null') {
					obj.checkOpinion = ''
				}
				if (obj.checkState == '-1') { //认证失败 checkOpinion:审批意见
					wx.navigateTo({
						url: `/pages/identitySuccessfulSubmissionReg/identitySuccessfulSubmissionReg?brackUrl=${url}&regFail=true&submitType=2&kind=${type}&checkOpinion=${obj.checkOpinion}`,
					})
				} else if (obj.checkState == '0') { // 0 :审核中,
					wx.navigateTo({
						url: '/pages/identitySuccessfulSubmissionReg/identitySuccessfulSubmissionReg?brackUrl=back&submitType=1',
					})
				} else if (obj.checkState == '1') { //:认证成功 
					wx.navigateTo({
						url: `/pages/identitySuccessfulSubmissionReg/identitySuccessfulSubmissionReg?sucessBool=true&submitType=1&brackUrl=back&kind=${type}`,
					})
				} else {
					wx.navigateTo({
						url: `${url}?kind=${type}&submitType=1&brackUrl=my`,
					})
				}
			}

		}).catch(() => {})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		// this.certifiedRole()
	},
	// 获取用户认证信息
	certifiedRole() {
		wx.showLoading({
			title: '加载中',
			modal: true
		})
		app.reqFetch.log.certifiedRole().then(res => {
			wx.hideLoading();
			if (res.data.code === 1) {
				//通用状态位: null :未申请   0 待审批  1 审批通过   -1 审批未通过

				this.setData({
					Staff: res.data.data.Staff, //企业员工 0代表未认证 ,1代表已认证
					individual: res.data.data.individual, //个人商家 0代表未认证 ,1代表已认证
					individualMerchants: res.data.data.individualMerchants, //个体商户 0代表未认证 ,1代表已认证
				})

			}

		}).catch(() => {})
	},
	//选择
	selectItem(event){
		let i = event.currentTarget.dataset.i;
		let arr = this.data.listArr;
		arr.map((item,index)=>{
			if(index != i){
				item.active = false
			}else{
				item.active = true
				this.setData({
					selectTitle:item.name
				})
			}
		})
		this.setData({
			listArr:arr,
			select:true
		})
	
	}


})