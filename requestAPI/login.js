import {
  request
} from './requestFetch';
//小程序通过code获取openid  开发人:何旭昌
const obtainOpenId = (code) => {
  return request({
    url: `/zjdz-ecology/ecologyUser/obtainOpenId?code=${code}&appId=wx3aac4341a8f3b5f6`,
    method: 'POST',
    headers: {
      Authorization: ''
    }
  });
}
//通过apenId 获取token和角色信息  开发人:何旭昌
const isObtainOpenId = (openId) => {
  return request({
    url: `/zjdz-ecology/ecologyUser/isObtainOpenId?openId=${openId}`,
    method: 'POST',
    headers: {
      Authorization: ''
    }
  });
}
//登录用户名和密码验证成功后,根据用户hmcId判断是否是商家  开发人:何旭昌
const isEcologyUser = (hmcId) => {
  return request({
    url: `/zjdz-ecology/ecologyUser/isEcologyUser?hmcId=${hmcId}`,
    method: 'POST',
  });
}
//登录用户名和密码验证成功后,根据用户hmcId和openId 绑定openid  开发人:何旭昌
const bindOpenId = (data) => {
  return request({
    url: `/zjdz-ecology/ecologyUser/bindOpenId`,
    method: 'POST',
    data: data
  });
}
//获取用户登录验证码
const verifyCode = () => {
  return request({
    url: `/auth/captcha/base64`,
    method: 'get',
    headers: {
      Authorization: ''
    }
  });
}
//根据用户名,密码和验证码登录获取token

const login = (data) => {
  return request({
    url: `/login`,
    method: 'post',
    headers: {
      'content-type': 'application/x-www-form-urlencoded' //修改此处即可 
    },
    data: data
  });
}
//获取手机验证码和校验账号和手机号，同时发送短信验证码
const sendVerifyCode = (phone, hmcId, type) => {
  let url = ''
  if (type === 'forgotPassword') { //校验账号和手机号，同时发送短信验证码
    url = `/basic/user/check/number?hmcId=${hmcId}&phone=${phone}`;
  } else {
    url = `/basic/sms/send/verifyCode?phone=${phone}`;
  }
  return request({
    url: url,
    method: 'get',
  });
}
//验证手机验证码 和校验手机验证码，生成token返回前端
const checkVerifyCode = (mobile, code, type, hmcId) => {
  let url = '';
  if (type === 'forgotPassword') {
    url = `/basic/user/check/message?code=${code}&hmcId=${hmcId}&phone=${mobile}`;
  } else {
    url = `/basic/sms/check/verifyCode?phone=${mobile}&code=${code}`;
  }
  return request({
    url: url,
    method: 'get',
  });
}
//修改密码
const modifyPassword = (original, newPass) => {
  return request({
    url: `/basic/user/modifyPassword?original=${original}&newPass=${newPass}`,
    method: 'post',
  });
}
// 个人注册基本信息 开发人:何旭昌
const saveEcologyIndividual = (data) => {
  let url = '';
  if (data.kind === 'geRen') { //个人
    url = `/zjdz-ecology/ecologyUser/saveEcologyIndividual`;
  } else { //员工
    url = `/zjdz-ecology/ecologyUser/saveEcologyStaff`;
  }
  data.kind = 6;
  return request({
    url: url,
    method: 'post',
    data: data
  });
}
// 个体工商户注册基本信息 开发人:何旭昌
const saveEcologyIndividualMerchants = (data) => {
  data.kind = 6;
  return request({
    url: `/zjdz-ecology/ecologyUser/saveEcologyIndividualMerchants`,
    method: 'post',
    data: data
  });
}
// 退出登錄 解綁openId 开发人:何旭昌
const unbindOpenId = (hmcId) => {
  return request({
    url: `/zjdz-ecology/ecologyUser/unbindOpenId?hmcId=${hmcId}`,
    method: 'post',
  });
}

//企业员工认证 ,个体工商户认证和 个人商家认证信息 获取 开发人:何旭昌
const certificationInformation = (hmcId, type) => {
  let url = '';
  if (type === 'geRen') { //个人商家
    url = `/zjdz-ecology/ecologyIndividual/selectEcologyIndividualByHmcId?hmcId=${hmcId}`;
  } else if (type === 'shangHu') { //个体商户商家
    url = `/zjdz-ecology/ecologyIndividualMerchants/selectEcologyIndividualMerchantsByHmcId?hmcId=${hmcId}`;
  } else if (type === 'yuanGong') { //企业员工
    url = `/zjdz-ecology/ecologyStaff/selectEcologyStaffByHmcId?hmcId=${hmcId}`;
  }
  return request({
    url: url,
    method: 'post',
  });
}


//企业员工认证 ,个体工商户认证和 个人商家认证信息 重新提交 开发人:何旭昌
const updateEcologyStaffEcologyIndividual = (data) => {
  let url = '';
  if (data.kind === 'geRen') { //个人商家
    url = `/zjdz-ecology/ecologyIndividual/updateEcologyIndividual`;
  } else if (data.kind === 'shangHu') { //个体商户商家
    url = `/zjdz-ecology/ecologyIndividualMerchants/updateEcologyIndividualMerchants`;
  } else if (data.kind === 'yuanGong') { //企业员工
    url = `/zjdz-ecology/ecologyStaff/updateEcologyStaff`;
  }
  data.kind = 6;
  return request({
    url: url,
    method: 'post',
    data: data
  });
}

// 获取用户认证信息 开发人:何旭昌
const certifiedRole = () => {
  return request({
    url: `/zjdz-ecology/EcologyUsermo/certifiedRole`,
    method: 'post',
  });
}

//忘记密码
const forgetPassword = (data) => {
  return request({
    url: `/basic/user/forgetPassword`,
    method: 'post',
    data:data
  });
}
module.exports = {
  login,
  obtainOpenId,
  sendVerifyCode,
  checkVerifyCode,
  isObtainOpenId,
  isEcologyUser,
  bindOpenId,
  verifyCode,
  modifyPassword,
  saveEcologyIndividual,
  saveEcologyIndividualMerchants,
  unbindOpenId,
  certificationInformation,
  updateEcologyStaffEcologyIndividual,
  certifiedRole,
  forgetPassword
}