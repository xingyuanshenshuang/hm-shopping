import request from '@/utils/request'

// 收货地址列表
export const getAddressList = () => {
  return request.get('/address/list')
}
