<template>
	<view>
		<view class="goods-list">
		  <view v-for="(goods, i) in goodsList" :key="i" @click="gotoDetail(goods)">
        <my-goods :goods="goods"></my-goods>
      </view>
    </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 请求参数对象
        queryObj: {
          // 查询关键词
          query: '',
          // 商品分类id
          cid: '',
          // 页码值
          pagenum: 1,
          // 每页显示多少条数据
          pagesize: 10
        },
        // 商品列表的数据
        goodsList: [],
        // 总数
        total: 0,
        // 是否请求数据
        isloading: false
			};
		},
    onLoad(options) {
      this.queryObj.query = options.query || '',
      this.queryObj.cid = options.cid || '',
      // console.log(this.queryObj);
      this.getGoodsList();
    },
    methods:{
      // 获取商品列表数据的方法
      async getGoodsList(cd) {
        // 打开节流阀
        this.isloading = true
        // 发起请求
        const { data: res } = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
        // 关闭节流阀
        this.isloading = false
        cd && cd();
        if (res.meta.status !== 200) return uni.$showMsg()
        // 为数据赋值
        this.goodsList = [...this.goodsList,...res.message.goods]
        this.total = res.message.total
      },
      gotoDetail(goods) {
        uni.navigateTo({
          url: '/subpkg/goods_detail/goods_detail?goods_id=' + goods.goods_id
        })
      }
    },
    onReachBottom() {
      if(this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('数据加载完毕')
      
      if(this.isloading) return 
      // 让页码值自增加一
      this.queryObj.pagenum++
      this.getGoodsList()
    },
    onPullDownRefresh() {
      // 重置关键数据
      this.queryObj.pagenum = 1,
      this.total = 0,
      this.isloading = false,
      this.goodsList = []
      
      // 重新发起数据请求
      this.getGoodsList(() => uni.stopPullDownRefresh())
    }
	}
</script>

<style lang="scss">

</style>
