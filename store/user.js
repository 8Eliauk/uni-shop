export default {
  // 开启命名空间
  namespaced: true,
  
  // state数据
  state: {
    // 收货地址
    // 读取本地的收货地址数据, 初始化 address 对象
    address: JSON.parse(uni.getStorageSync('address') || '{}'),
  },
  mutations: {
    // 更新收货地址
    updateAddress(state,address) {
      state.address = address
      
      // 通过 this.commit() 方法, 调用 m_user 模块下的 saveAddressToStorage方法 将address对象持久化存储到本地
      this.commit('m_user/saveAddressToStorage')
    },
    // 定义将 address 持久化存储到本地 mutations 方法
    saveAddressToStorage(state) {
      uni.setStorageSync('address', JSON.stringify(state.address))
    }
  },
  getters: {
    addstr(state) {
      if(!state.address.provinceName) return ''
      return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo
    }
  },
}