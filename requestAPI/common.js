import {
  request
} from './requestFetch'
//获取省市区三级地址全量查询接口
const threeLevels = () => {
  return request({
    url: `/basic/address/threeLevels`,
    method: 'get',
  });
}
//查询用户公司  开发人:何旭昌
const findByCompanyName = (CompanyName) => {
  return request({
    url: `/zjdz-ecology/ecologyStaffCompany/findByCompanyName?companyName=${CompanyName}`,
    method: 'post',
  });
}
//绑卡用户资料查询  开发人:何旭昌
const selectBindBankCardInfo = (hmcId) => {
  return request({
    url: `/zjdz-ecology/ecologyBindBankCardInfo/selectBindBankCardInfo?hmcId=${hmcId}`,
    method: 'post',
  });
}
//通过银行卡号获取开户行  开发人:何旭昌
const selectBankCode = (bankCardNo) => {
  return request({
    url: `/zjdz-ecology/ecologyBindBankCardInfo/selectBankCode?code=${bankCardNo}`,
    method: 'post',
  });
}
//个体工商户绑卡  开发人:何旭昌
const bindBindBankCardMerchants = (data) => {
  return request({
    url: `/zjdz-ecology/ecologyBindBankCardInfo/bindBindBankCardMerchants`,
    method: 'post',
    data: data
  });
}
//个人商家or企业员工绑卡(简称个人)  开发人:何旭昌
const bindBindBankCardPersonal = (data) => {
  return request({
    url: `/zjdz-ecology/ecologyBindBankCardInfo/bindBindBankCardPersonal`,
    method: 'post',
    data: data
  });
}
//获取绑卡协议地址  开发人:赵恺
const findSignedAddress = (data) => {
  return request({
    url: `/zjdz-ecology/ecologyBindBankCardInfo/findSignedAddress`,
    method: 'post',
  });
}
//根据登录hmcId查询用户详情,Feign公共方法，基本信息 开发人:何旭昌
const userInfo = (hmcId) => {
  return request({
    url: `/zjdz-ecology/ecologyUser/info?hmcId=${hmcId}`,
    method: 'post',
  });
}
//根据选中的订单信息查询订单付款码连接  开发人:赵恺
const insertOrder = (data) => {
  return request({
    url: `/zjdz-ecology/EcologyOrder/insertOrder`,
    method: 'post',
    data: data
  });
}
//头像修改  开发人:张福磊
const updateUserIcon = (avatar) => {
  return request({
    url: `/zjdz-ecology/EcologyUsermo/updateUserIcon`,
    method: 'post',
    data: {
      avatar: avatar
    }
  });
}
//手机号修改  开发人:张福磊
const updateUserMobile = (mobile) => {
  return request({
    url: `/zjdz-ecology/EcologyUsermo/updateUserMobile`,
    method: 'post',
    data: {
      mobile: mobile
    }
  });
}
//收入查询  开发人:张福磊
const cumuIncome = (data) => {
  return request({
    url: `/zjdz-ecology/EcologyOrder/cumuIncome?date=${data}`,
    method: 'post',
  });
}
  
module.exports = {
  threeLevels,
  findByCompanyName,
  selectBindBankCardInfo,
  selectBankCode,
  bindBindBankCardMerchants,
  bindBindBankCardPersonal,
  findSignedAddress,
  userInfo,
  insertOrder,
  updateUserIcon,
  updateUserMobile,
  cumuIncome

}