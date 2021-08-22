import {
  request
} from './requestFetch'; 
//  * 获取付款二维码  开发人:张福磊    
const createQrCode = (orderNum) => {
  return request({
    url: `/zjdz-ecology/EcologyOrder/createQRcode?orderNum=${orderNum}`,
    method: 'POST',
    responseType: 'arraybuffer', //这一行非常重要，重中之重
    data: {}
  });
}
//获取智家优选,生活服务和清洗类别列表 开发人:张福磊
const selectServiceInformationList = (data) => {
  return request({
    url: `/zjdz-ecology/EcologyWare/selectServiceInformationList`,
    method: 'POST',
    data: data
  });
}
// 生态服务查询  商品规格信息list) 开发人:王珂真
const selectServiceSpeList = (wareId) => {
  return request({
    url: `/zjdz-ecology/Ecologyspe/selectServiceSpeList?wareId=${wareId}`,
    method: 'POST',
  });
}

// 商品详情 开发人:张福磊
const selectServiceInformation = (wareId) => {
  return request({
    url: `/zjdz-ecology/EcologyWare/selectServiceInformation`,
    method: 'POST',
    data: {
      wareId: wareId,
    }
  });
}
//账单查询接口 开发人:张福磊
const selectBillDetails = (data) => {
  return request({
    url: `/zjdz-ecology/EcologyOrder/selectBillDetails`,
    method: 'POST',
    data: data
  });
}  
// 扫描时实时判断有没有付款成功   开发人:张福磊
const selectOrder = (orderNum,source) => {
  return request({
    url: `/zjdz-ecology/EcologyOrder/selectOrder`,
    method: 'POST',
    data: {
      orderNum:orderNum,
      source:source
      
    }
  });
}
// 根据订单编号查询已完成订单详情(账单详情也是用这个接口)   开发人:张福磊
const selectAllOrderDetails = (orderNum,source) => {
  return request({
    url: '/zjdz-ecology/EcologyOrder/selectAllOrderDetails',
    method: 'POST',
    data: {
      orderNum:orderNum,
      source:source
      
    }
  });
}
// 订单类型搜索数据获取:张福磊  (0：电器清洗,1：房屋,2：智佳)
const selectServiceNameList = (type) => {
  return request({  
    url: `/zjdz-ecology/EcologyWare/selectServiceNameList`,
    method: 'POST',
    data: {
      dataSource:type
    }
  });
}
// 我的订单查询三翼鸟(待沟通订单,待服务订单) 带分页 开发人:张福磊
const selectThirdOrder = (data) => {
  return request({
    url: `/zjdz-ecology/thirdOrder/selectThirdOrder`,
    method: 'POST',
    data: data
  });
}
// 我的订单查询 带分页 开发人:张福磊
const selectOrderDetails = (data) => {
  return request({
    url: `/zjdz-ecology/EcologyOrder/selectOrderDetails`,
    method: 'POST',
    data: data
  });
}

//设置上门时间时间 开发人:赵恺
const receiveOrder = (data) => {
  return request({
    url: `/zjdz-ecology/thirdOrder/receiveOrder`,
    method: 'POST',
    data: data
  });
}
//关闭订单 开发人:赵恺
const finishOrder = (data) => {
  return request({
    url: `/zjdz-ecology/thirdOrder/finishOrder`,
    method: 'POST',
    data: data
  });
}


   
module.exports = {
  createQrCode,
  selectServiceInformationList,
  selectServiceSpeList,
  selectServiceInformation,
  selectOrderDetails,
  selectBillDetails,
  selectOrder,
  selectServiceNameList,
  selectThirdOrder,
  receiveOrder,
  selectAllOrderDetails,
  finishOrder

}