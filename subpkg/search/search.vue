<template>
	<view>
		<view class="search-box">
		  <uni-search-bar @input="input" :radius="100" cancelButton="none"></uni-search-bar>
		</view>
    
    <!-- 搜索建议列表 -->
    <view class="sugg-list" v-if="searchResults.length !== 0">
      <view class="sugg-item" v-for="(item,i) in searchResults" :key="i" @click="gotoDetail(item)">
        <view class="goods-name">{{item.goods_name}}</view>
        <uni-icons type="arrowright" size="16"></uni-icons>
      </view>
    </view>
    
    <!-- 搜索历史 -->
    <view class="history-box" v-else>
      <!-- 标题区域 -->
      <view class="history-title">
        <text>搜索历史</text>
        <uni-icons type="trash" size="17" @click="clean"></uni-icons>
      </view>
      <!-- 列表区域 -->
      <view class="history-list">
        <uni-tag :text="item" v-for="(item,i) in histories" :key="i" @click="gotoGoodsList(item)"></uni-tag>
      </view>
    </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				timer:null,
        kw: '',
        // 搜索的结果列表
        searchResults: [],
        // 搜索历史的数组
        historyList: []
			};
		},
    onLoad() {
      this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
    },
    methods:{
      // input输入事件的函数
      input(e) {
        // 清除 timer 对应的延时器
        clearTimeout(this.timer)
        // 重新启动一个延时器，并把 timer 赋值给 this.timer
        this.timer = setTimeout(() => {
          // 如果 500 毫秒内，没有触发新的输入事件，则为搜索关键词赋值
          this.kw = e.value
          this.getSearchList()
        },500)
      },
      async getSearchList() {
        if(this.kw.length === 0) {
          this.searchResults = []
          return
        }
        
        const {data: res} = await uni.$http.get('/api/public/v1/goods/qsearch',{query: this.kw})
        if(res.meta.status !== 200) return uni.$showMsg()
        this.searchResults = res.message
        // 查询到搜索建议之后，调用 saveSearchHistory() 方法保存搜索关键词
        this.saveSearchHistory();
      },
      gotoDetail(item) {
        // console.log(item.goods_id);
        uni.navigateTo({
          url:'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
        })
      },
      // 保存搜索关键词的方法
      saveSearchHistory() {
        // 解决搜索历史关键词重复的问题
        // 将 Array 数组转化为 Set 对象
        const set = new Set(this.historyList);
        set.delete(this.kw);
        set.add(this.kw)
        // 将Set 对象转化为 Array 数组
        this.historyList = Array.from(set)
        // 调用 uni.setStorageSync(key, value) 将搜索历史记录持久性存储到本地
        uni.setStorageSync('kw', JSON.stringify(this.historyList))
      },
      // 清空历史记录
      clean() {
        this.historyList = [];
        uni.setStorageSync('kw', '[]')
      },
      gotoGoodsList(kw) {
        uni.navigateTo({
          url:'/subpkg/goods_detail/goods_detail?query=' + kw
        })
      }
    },
    computed: {
      histories() {
        return [...this.historyList].reverse()
      }
    }
	}
</script>

<style lang="scss">
  // 搜索框的样式
.search-box {
  position: sticky;
  top: 0;
  z-index: 999;
}
// 搜索列表的样式
.sugg-list {
  padding: 0 5px;
  .sugg-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    padding: 13px 10px;
    border-bottom: 1px solid #efefef;
    
    .goods-name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
// 搜索历史区域的样式
.history-box {
  padding: 0 10px;
   .history-title {
     display: flex;
     justify-content: space-between;
     height: 40px;
     align-items: center;
     font-size: 13px;
     border-bottom: 1px solid #efefef;
   }
   .history-list {
     display: flex;
     flex-wrap: wrap;
     .uni-tag {
       margin-top: 5px;
       margin-right: 5px;
     }
   }
} 
</style>
