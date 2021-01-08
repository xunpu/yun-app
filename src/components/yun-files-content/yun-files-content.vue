<template>
  <view class="wrap">
    <tui-list-view unlined="all" v-for="(page, index) in filelist" :key="index">
      <tui-list-cell v-for="item in page" :key="item.id" unlined padding="0 0">
        <yun-files-item
          ref="fileItems"
          @file-content-change="mychange"
          @event-bridge="eventBridge"
          @take-file="getPath"
          :showCheck="showCheck"
          :file="item"
        ></yun-files-item>
      </tui-list-cell>
    </tui-list-view>
  </view>
</template>

<script>
import { getFiles } from "@/api/api";
export default {
  props: {
    filelist: {},
  },
  data() {
    return {
      showCheck: false,
      curPath: "",
    };
  },
  methods: {
    disableSelect(){
      this.showCheck = false;
    },
    getPath(file) {
      this.$emit("take-file", file);
    },
    eventBridge(ev) {
      this.showCheck = true;
      this.$emit("multi-select");
    },
    selectAll() {
      this.$refs.fileItems.forEach((fileItem, index) => {
        fileItem.checkState = true;
      });
    },
    unSelectAll() {
      this.$refs.fileItems.forEach((fileItem, index) => {
        fileItem.checkState = false;
      });
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
// .warp {
//   touch-action: none;
// }
</style>