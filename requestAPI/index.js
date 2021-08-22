import {
  request
} from './requestFetch';
//  * 分页查询导航图信息  
const selectBannerPic = () => {
  return request({
    url: `/zjdz-ecology/EcologyBanner/selectBannerPic`,
    method: 'POST',
    data: {
      bannerStatus:1
    }
  });
}
//  * 商品详情图片和  商品详情顶部轮播
const selectHeadPic = (data) => {
  return request({
    url: `/zjdz-ecology/EcologyheadPic/selectHeadPic`,
    method: 'POST',
    data: data
  });
}
// 生成二维码前查询当前用户状态
const findIsPaymentStatus = (hmcId) => {
  return request({
    url: `/zjdz-ecology/ecologyBindBankCardInfo/findIsPaymentStatus?hmcId=${hmcId}`,
    method: 'POST',
  });
}



module.exports = {
  selectBannerPic,
  selectHeadPic,
  findIsPaymentStatus
}