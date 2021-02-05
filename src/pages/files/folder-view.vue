<template>
  <view class="page">
    <u-navbar
      z-index="900"
      height="60"
      title=""
      :is-back="isBack"
      :back-text="name"
      :border-bottom="false"
      :custom-back="backEvent"
    >
      <view slot="right">
        <u-button @click="submit" class="file-btn" :hair-line="false"
          >确定</u-button
        >
        <u-button class="file-btn close-btn" :hair-line="false" @click="close"
          >关闭</u-button
        >
      </view>
    </u-navbar>
    <yun-files-content
      :filelist="filelist"
      :onlyView="true"
      @multi-select="multiSelect"
      @take-file="changeBackText"
    ></yun-files-content>
  </view>
</template>
  
<script>
import { getToken } from "@/store/storage";
import storeCache from "@/store/cache";
import { FILE_LIST, move } from "@/api/api";
export default {
  data() {
    return {
      multiSelectState: true,
      isBack: true,
      isShowRight: false,
      optionPanelShow: false,
      folderPanelShow: false,
      folder: "",
      renamePanelShow: false,
      newName: "",
      path: "",
      name: "",
      pid: "root",
      fid: "",
      queue: [],
      filelist: [],
      params: {},
    };
  },
  methods: {
    changeBackText(file) {
      this.filelist = [];
      this.queue.push({
        uuid: this.pid,
        name: this.name,
      });
      this.pid = file.uuid;
      this.name = file.name;
      this.path = file.path;
      this.refreshFileList();
    },
    backEvent() {
      if (this.pid == 'root') return;
      this.filelist = [];
      var parent = this.queue.pop();
      this.pid = parent.uuid;
      this.name = parent.name;
      this.path = parent.path;
      this.refreshFileList();
    },
    onPullDownRefresh() {
      this.refreshFileList();
    },
    onReachBottom: function () {
      this.getFiles();
    },
    refreshFileList() {
      this.filelist = [];
      storeCache.delete(`${FILE_LIST}/${this.pid}`);
      let that = this;
      getToken().then((token) => {
        storeCache
          .on(`${FILE_LIST}/${this.pid}`, {}, { type: 1, token: token })
          .then((res) => {
            that.getFiles();
          });
      });
    },
    getFiles() {
      getToken().then((token) => {
        storeCache
          .next(`${FILE_LIST}/${this.pid}`, { type: 1, token: token })
          .then((res) => {
            if (res.data.length > 0) {
              var data = this.renderData(res.data);
              this.filelist.push(data);
            }
            uni.stopPullDownRefresh();
          });
      });
    },
    renderData(filelist) {
      var data = {};
      var render_data = [];
      filelist.forEach((v, i) => {
        data = {
          id: v[0],
          name: v[2],
          type: v[3],
          ext: v[4],
          size: v[5],
          pid: v[6],
          path: v[7],
          uuid: v[8],
          ctime: `${v[9].split(" ")[0]} ${v[9].split(" ")[1]}`,
          mtime: `${v[10].split(" ")[0]} ${v[10].split(" ")[1]}`,
        };
        render_data.push(data);
      });
      return render_data;
    },
    submit() {
      getToken().then((token) => {
        var params = this.params;
        params.pid = this.pid;
        params.token = token;
        params.path = this.path || "";
        move(params).then((res) => {
          if (res.code == 0) {
            setTimeout((res) => {
              uni.$emit("refreshFileList", {});
            }, 0);
            this.close();
          } else {
            uni.showToast({
              title: res.msg,
            });
          }
        });
      });
    },
    close() {
      this.params = {};
      this.pid = "";
      this.path = "";
      uni.switchTab({
        url: "/pages/home/index",
      });
    },
  },
  onReady() {
    let that = this;
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on("acceptFolderViewData", function (data) {
      that.params = data;
    });
    this.refreshFileList();
  },
};
</script>
<style lang="scss" scoped>
.page/deep/ {
  .u-line-1 {
    width: 45vw;
    display: inline-block;
  }
  .file-btn {
    width: 150rpx;
    text-align: center;
    border-width: 0;
  }
}
.opt-panel {
  padding: 200rpx 0;
  .opt-content {
    text-align: center;
    .opt-img {
      margin-bottom: 20rpx;
      width: 96rpx;
      height: 96rpx;
    }
  }
}
.new-folder-popup {
  padding: 0 75rpx;
}
.wrap-inline {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.close-btn {
  color: #fa2800;
}
</style>


