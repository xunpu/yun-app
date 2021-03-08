<template>
  <view class="wrap">
    <tui-list-view unlined="all" v-for="(page, index) in filelist" :key="index">
      <tui-list-cell
        v-for="item in page"
        :key="item.uuid"
        unlined
        padding="0 0"
      >
        <yun-files-item
          ref="fileItems"
          @file-content-change="mychange"
          @event-bridge="eventBridge"
          @take-file="getPath"
          :showCheck="showCheck"
          :file="item"
          :onlyView=onlyView
        ></yun-files-item>
      </tui-list-cell>
    </tui-list-view>
  </view>
</template>

<script>
export default {
  props: {
    filelist: {},
    onlyView: {},
  },
  data() {
    return {
      showCheck: false,
      curPath: "",
    };
  },
  methods: {
    disableSelect() {
      this.showCheck = false;
    },
    getPath(file) {
      this.$emit("take-file", file);
    },
    eventBridge(ev) {
      this.showCheck = true;
      this.$emit("multi-select");
    },
    getSelectedItems(action) {
      var data = [];
      this.$refs.fileItems.forEach((item, index) => {
        if (item.checkState) {
          data.push(item.file);
        }
      });
      if (action == "rename") {
        uni.$emit("renameFile", data);
      } else if (action == "delete") {
        uni.$emit("deleteFile", data);
      } else if (action == "move") {
        uni.$emit("moveFile", data);
      }
    },
    selectAll() {
      this.$refs.fileItems.forEach((item, index) => {
        item.checkState = true;
      });
    },
    unSelectAll() {
      this.$refs.fileItems.forEach((item, index) => {
        item.checkState = false;
      });
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
uni-page-body/deep/ .tui-list-content {
  background-color: #FFF;
}
</style>