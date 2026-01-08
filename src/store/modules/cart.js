import { getCartList, changeCount, delSel } from '@/api/cart'
export default {
  namespaced: true,
  state () {
    return {
      cartList: []
    }
  },
  mutations: {
    setCartList (state, obj) {
      state.cartList = obj
    },
    toggleCheck (state, goodsId) {
      const goods = state.cartList.find(item => item.goods_id === goodsId)
      goods.isChecked = !goods.isChecked
    },
    toggleAllCheck (state, flag) {
      state.cartList.forEach(item => {
        item.isChecked = flag
      })
    },
    changeCount (state, { goodsId, goodsNum }) {
      const updateList = state.cartList.find(item => item.goods_id === goodsId)
      updateList.goods_num = goodsNum
    }
  },
  actions: {
    async getActionCart (context) {
      const { data: { list } } = await getCartList()
      list.forEach(item => {
        item.isChecked = true
      })
      context.commit('setCartList', list)
    },
    async updateActionCart (context, { goodsNum, goodsId, goodsSkuId }) {
      context.commit('changeCount', { goodsId, goodsNum })
      await changeCount(goodsId, goodsNum, goodsSkuId)
    //   context.dispatch('getActionCart')
    },
    async delSel (context) {
      const selCartList = context.getters.selCartList
      const cartIds = selCartList.map(item => item.id)
      await delSel(cartIds)
      context.dispatch('getActionCart')
    }
  },
  getters: {
    isAllChecked (state) {
      return state.cartList.every(item => item.isChecked)
    },
    // 商品总数
    cartTotal (state) {
      return state.cartList.reduce((sum, item) => sum + item.goods_num, 0)
    },
    // 选中的商品列表
    selCartList (state) {
      return state.cartList.filter(item => item.isChecked)
    },
    // 选中的商品总数
    selCount (state, getters) {
      return getters.selCartList.reduce((sum, item) => sum + item.goods_num, 0)
    },
    // 选中的商品总价
    selPrice (state, getters) {
      return getters.selCartList.reduce((sum, item) => sum + item.goods_num * item.goods.goods_price_min, 0).toFixed(2)
    }
  }
}
