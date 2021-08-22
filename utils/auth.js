import website from './website'
import Base64 from './base64'
//存储openId
function setOpenId(openid) {
  return wx.setStorageSync('openId', openid);
}
//获取openId
function getOpenId() {
  return wx.getStorageSync('openId')
}
//存储hmcId
function setHmcId(hmcId) {
  return wx.setStorageSync('hmcId', hmcId);
}
//获取hmcId
function getHmcId() {
  return wx.getStorageSync('hmcId')
}
//存储token
function setToken(tokenValue) {
  return wx.setStorageSync('token', tokenValue);
}
//获取token
function getToken() {
  return wx.getStorageSync('token')
}
//存储用戶授权后的微信用户信息
function setUserInfo(obj) {
  return wx.setStorageSync('userInfo', JSON.stringify(obj));
}
//获取用戶授权后的微信用户信息
function getUserInfo() {
  return wx.getStorageSync('userInfo')
}
//存储用户信息(接口获取)
function setUserInfoInterface(obj) {
  return wx.setStorageSync('userInfoInterface', obj);
}
//获取用戶信息(接口获取)
function getUserInfoInterface() {
  return wx.getStorageSync('userInfoInterface')
}
//存储登录成功后返回的数据
function setLginSucces(data) {
  return wx.setStorageSync('lginSucce', JSON.stringify(data));
}
//获取登录成功后返回的数据
function getLginSucces() {
  return JSON.parse(wx.getStorageSync('lginSucce'))
}

//存储过期时间
function setEndTokenTime(tokenValue) {
  return wx.setStorageSync('endTokenTime', tokenValue);
}
//获取过期时间
function getEndTokenTime() {
  return wx.getStorageSync('endTokenTime')
}
//存储用户个资料对象
function setUser(tokenValue) {
  return wx.setStorageSync('userMsg', tokenValue);
}
//获取用户个资料对象
function getUser() {
  return wx.getStorageSync('userMsg');
}
//请求头参公共数
function getAuthorization() {
  return `Basic ${Base64.encode(`${website.clientId}:${website.clientSecret}`)}`
}





module.exports = {
  setOpenId,
  getOpenId,
  setToken,
  getToken,
  setEndTokenTime,
  getEndTokenTime,
  setUser,
  getUser,
  getAuthorization,
  setUserInfo,
  getUserInfo,
  setUserInfoInterface,
  getUserInfoInterface,
  setHmcId,
  getHmcId
}