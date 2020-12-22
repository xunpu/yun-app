<template>
  <view>
    <tui-list-view class="title" :title="path" color="#777" unlined="all">
      <tui-list-cell
        v-for="item in filelist"
        :key="item.id"
        unlined
        padding="10rpx 10rpx"
      >
        <yun-files-item
          :name="item.name"
          :url="item.url"
          :type="item.type"
        ></yun-files-item>
      </tui-list-cell>
    </tui-list-view>
  </view>
</template>

<script>
import { getFiles } from "@/api/api";
export default {
  data() {
    return {
      path: "",
      filelist: [],
    };
  },
  mounted() {
    getFiles().then((res) => {
      console.log(res.data);
      this.path = res.data.path;
      this.filelist = res.data.filelist;
    });
  },
};
</script>

<style lang="scss" scoped>
.title/deep/ .tui-list-title {
  width: 70%;
  font-size: 36rpx;
  letter-spacing: 2rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>