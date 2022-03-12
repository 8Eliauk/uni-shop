<template>
	<view>
		<view class="scroll-view-container">
		  <!-- 左侧的滑动区域 -->
      <scroll-view class="left-scroll-view" scroll-y="true" :style="{height: wh + 'px'}">
        <block v-for="(item,i) in cateList" :key="i">
          <view :class="['left-scroll-view-item',i === active ? 'active' : '']" @click="activeChanged(i)">{{item.cat_name}}</view>
        </block>
      </scroll-view>
		  <!-- 右侧的滑动区域 -->
      <scroll-view scroll-y="true" :style="{height: wh + 'px'}" :scroll-top="scrollTop">
        <view class="cate-lv2" v-for="(item2, i2) in cateLevel2" :key="i2">
          <!-- 二级分类的标题 -->
          <view class="cate-lv2-title">
            /{{item2.cat_name}}/
          </view>
          <!-- 动态渲染三级分类的列表数据 -->
          <view class="cate-lv3-list">
            <!-- 三级分类 Item 项 -->
            <view class="cate-lv3-item" v-for="(item3,i3) in item2.children" :key="i3" @click="gotGoodsList(item3)" >
              <!-- 三级分类的图片 -->
              <image :src="item3.cat_icon" mode=""></image>
              <!-- 三级分类的文本 -->
              <text>{{item3.cat_name}}</text>
            </view>
          </view>
        </view>
      </scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
        // 当前设备可用的高度
				wh:0,
        // 分类列表数据
        cateList: [],
        // 样式红色左竖线选中项
        active: 0,
        // 二级分类的列表
        cateLevel2:[],
        // 右侧滚动条距离顶部的距离
        scrollTop:0
			};
		},
    onLoad() {
      const sysInfo = uni.getSystemInfoSync()
      console.log(sysInfo)
      this.wh = sysInfo.windowHeight
      // 调用方法，获取分类列表数据的方法
      this.getCateList()
    },
    methods: {
      async getCateList() {
        // 发起请求
        const { data: res } = await uni.$http.get('/api/public/v1/categories')
        // 判断是否失败
        if(res.meta.status !== 200) return uni.$showMsg()
        // 转存数据
        this.cateList = res.message
        // 为二级分类赋值
        this.cateLevel2 = res.message[0].children
      },
      activeChanged(i) {
        // 被选中的样式
        this.active = i
        // 重新为二级分类赋值
        this.cateLevel2 = this.cateList[i].children
        // 让滚动条重新赋值为0
        this.scrollTop = this.scrollTop === 0 ? 1 : 0
      },
      // 跳转到商品列表页面
      gotGoodsList(item3) {
        uni.navigateTo({
          url:'/subpkg/goods_list/goods_list?cid=' + item3.cat_id
        })
      } 
    }
	}
</script>

<style lang="scss">
  // 左侧滑动样式
.scroll-view-container {
  display: flex;
  
  .left-scroll-view {
    width: 120px;
    
    .left-scroll-view-item {
      background-color: #F7F7F7;
      line-height: 60px;
      text-align: center;
      font-size: 12px;
      
      &.active {
        background-color: #FFFFFF;
        position: relative;
        
        &::before {
          content: ' ';
          display: block;
          width: 3px;
          height: 30px;
          background-color: #c00000;
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
        }
      }
    }
  }
}
// 二级分类样式
.cate-lv2-title {
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  padding: 15px 0;
}
// 三级分类样式
.cate-lv3-list {
  display: flex;
  flex-wrap: wrap;
  
  .cate-lv3-item {
    width: 33.33%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
    
    image {
      width: 60px;
      height: 60px;
    }
    
    text {
      font-size: 12px;
    }
  }
}
</style>
