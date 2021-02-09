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
      <view v-if="isShowRight" slot="right">
        <u-button
          class="file-btn close-btn"
          :hair-line="false"
          @click="closeOptionPanel"
          >关闭</u-button
        >
        <u-button
          @click="getSelectedItems('move')"
          class="file-btn"
          :hair-line="false"
          >移动</u-button
        >
        <u-button
          @click="getSelectedItems('rename')"
          class="file-btn"
          :hair-line="false"
          >改名</u-button
        >
        <u-button
          @click="getSelectedItems('delete')"
          class="file-btn"
          :hair-line="false"
          >删除</u-button
        >
        <u-button @click="selectAll" class="file-btn" :hair-line="false">{{
          multiSelectState ? "全选" : "全不选"
        }}</u-button>
      </view>
    </u-navbar>
    <yun-files-content
      ref="myfile"
      :filelist="filelist"
      @multi-select="multiSelect"
      @take-file="changeBackText"
    ></yun-files-content>
    <tui-fab :right="50" :bottom="150" @click="showOptionPanel"></tui-fab>
    <u-popup
      v-model="optionPanelShow"
      mode="bottom"
      z-index="99998"
      border-radius="20"
      duration="150"
      closeable
    >
      <view class="opt-panel">
        <u-row class="opt-content">
          <u-col span="4">
            <view class="wrap-inline" @click="addOptions('folder')">
              <image
                class="opt-img"
                src="/static/btn-folder.png"
                mode="aspectFill"
              />
              <text>文件夹</text>
            </view>
          </u-col>
          <u-col span="4">
            <view class="wrap-inline" @click="addOptions('image')">
              <image
                class="opt-img"
                src="/static/btn-image.png"
                mode="aspectFill"
              />
              <text>图片</text>
            </view>
          </u-col>
          <u-col span="4">
            <view class="wrap-inline" @click="addOptions('other')">
              <image
                class="opt-img"
                src="/static/btn-other.png"
                mode="aspectFill"
              />
              <text>文件</text>
            </view>
          </u-col>
        </u-row>
        <u-row class="opt-content">
          <u-col span="4">
            <view class="wrap-inline" @click="addOptions('card')">
              <image
                class="opt-img"
                src="/static/btn-card.png"
                mode="aspectFill"
              />
              <text>卡片</text>
            </view>
          </u-col>
          <u-col span="4">
            <view class="wrap-inline" @click="addOptions('article')">
              <image
                class="opt-img"
                src="/static/btn-article.png"
                mode="aspectFill"
              />
              <text>文章</text>
            </view>
          </u-col>
        </u-row>
      </view>
    </u-popup>
    <u-modal
      v-model="folderPanelShow"
      show-cancel-button
      title="创建新文件夹"
      :zoom="false"
      @cancel="cancelFolder()"
      @confirm="submitFolder()"
    >
      <view class="new-folder-popup">
        <u-input v-model="folder" />
      </view>
    </u-modal>
    <u-modal
      v-model="renamePanelShow"
      show-cancel-button
      title="修改名称"
      :zoom="false"
      @cancel="cancelRenamePanel()"
      @confirm="submitNewFilename()"
    >
      <view class="new-folder-popup">
        <u-input v-model="newName" />
      </view>
    </u-modal>
  </view>
</template>
  
<script>
import { getToken } from "@/store/storage";
import storeCache from "@/store/cache";
import { API_PATH, FILE_LIST, mkdir, rename, remove } from "@/api/api";
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
    };
  },
  methods: {
    getSelectedItems(action) {
      this.$refs.myfile.getSelectedItems(action);
    },
    multiSelect() {
      this.isShowRight = true;
      this.isBack = false;
    },
    selectAll() {
      this.multiSelectState
        ? ((this.multiSelectState = false), this.$refs.myfile.selectAll())
        : ((this.multiSelectState = true), this.$refs.myfile.unSelectAll());
    },
    closeOptionPanel() {
      this.$refs.myfile.unSelectAll();
      this.multiSelectState = true;
      this.isShowRight = false;
      this.isBack = true;
      this.$refs.myfile.disableSelect();
    },
    showOptionPanel() {
      this.optionPanelShow = true;
    },
    submitFolder() {
      let that = this;
      getToken().then((token) => {
        mkdir({ pid: that.pid, name: that.folder, token: token }).then(
          (res) => {
            if (res.code == 0) {
              that.refreshFileList();
              that.folder = "";
            } else {
              that.folder = "";
              uni.showToast({
                title: res.msg,
              });
            }
          }
        );
      });
    },
    cancelFolder() {
      this.optionPanelShow = false;
      this.folder = "";
    },
    cancelRenamePanel() {
      this.renamePanelShow = false;
      this.newName = "";
    },
    submitNewFilename() {
      let that = this;
      getToken().then((token) => {
        rename({
          fid: that.fid,
          pid: that.pid,
          name: that.newName,
          token: token,
        }).then((res) => {
          if (res.code == 0) {
            that.refreshFileList();
            that.newName = "";
            that.fid = "";
            that.closeOptionPanel();
          } else {
            uni.showToast({
              title: res.msg,
            });
          }
        });
      });
    },
    addOptions(type) {
      let that = this;
      if (type == "folder") {
        this.optionPanelShow = false;
        this.folderPanelShow = true;
      } else if (type == "image") {
        getToken().then((token) => {
          uni.navigateTo({
            url: "/pages/files/upload",
            success: function (res) {
              res.eventChannel.emit("acceptUploadData", {
                path: that.path,
                name: that.name,
                pid: that.pid,
                token: token,
              });
            },
          });
        });
      } else if (type == "other") {
        uni.chooseFile({
          count: 1,
          type: "all",
          success: function (res) {
            // console.log(JSON.stringify(res.tempFilePaths));
            getToken().then((token) => {
              uni.uploadFile({
                url: `${API_PATH}/v1/fs/upload`, //仅为示例，非真实的接口地址
                filePath: res.tempFilePaths[0],
                formData: {
                  path: that.path,
                  name: that.name,
                  pid: that.pid,
                  token: token,
                },
                success: (uploadFileRes) => {
                  console.log(uploadFileRes.data);
                },
              });
            });
          },
        });
      } else if (type == "card") {
        uni.navigateTo({
          url: "/pages/card/edit",
          success: function (res) {
            res.eventChannel.emit("acceptCardData", { pid: that.pid });
          },
        });
      } else if (type == "article") {
        uni.navigateTo({
          url: "/pages/article/edit",
          success: function (res) {
            res.eventChannel.emit("acceptArticleData", { pid: that.pid });
          },
        });
      }
    },
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
      if (this.pid == "root") return;
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
          .on(`${FILE_LIST}/${this.pid}`, {}, { token: token })
          .then((res) => {
            that.getFiles();
          });
      });
    },
    getFiles() {
      getToken().then((token) => {
        storeCache
          .next(`${FILE_LIST}/${this.pid}`, { token: token })
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
  },
  onShow() {
    this.refreshFileList();
  },
  onHide() {
    this.filelist = [];
  },
  onReady() {
    uni.$on("refreshFileList", (res) => {
      this.refreshFileList();
    });
    uni.$on("renameFile", (res) => {
      if (res.length != 1) {
        uni.showToast({
          title: "只允许一个文件",
        });
      } else {
        this.fid = res[0].uuid;
        this.renamePanelShow = true;
      }
    });
    uni.$on("deleteFile", (res) => {
      var ids = [];
      let that = this;
      if (res.length == 0) {
        uni.showToast({
          title: "未选择任何文件",
        });
        return;
      }
      res.forEach((item, index) => {
        ids.push(item.uuid);
      });
      getToken().then((token) => {
        remove({
          ids: ids,
          token: token,
        }).then((res) => {
          if (res.code == 0) {
            that.refreshFileList();
            that.closeOptionPanel();
          } else {
            uni.showToast({
              title: res.msg,
            });
          }
        });
      });
    });
    uni.$on("moveFile", (res) => {
      var ids = [];
      let that = this;
      if (res.length == 0) {
        uni.showToast({
          title: "未选择任何文件",
        });
        return;
      }
      res.forEach((item, index) => {
        ids.push(item.uuid);
      });
      uni.navigateTo({
        url: "/pages/files/folder-view",
        success: function (res) {
          res.eventChannel.emit("acceptFolderViewData", {
            pid: that.pid,
            path: that.path,
            name: that.name,
            fid: that.fid,
            ids: ids,
          });
        },
      });
    });
  },
};
</script>
<style lang="scss" scoped>
.page/deep/ {
  .u-line-1 {
    width: 45%;
    display: inline-block;
  }
  .u-back-text.u-line-1 {
    width: 45vw;
  }
  .file-btn {
    width: 150rpx;
    border-width: 0;
  }
}
.opt-panel {
  padding: 100rpx 0;
  .opt-content {
    margin-top: 50rpx;
    text-align: center;
    .opt-img {
      margin-bottom: 20rpx;
      width: 84rpx;
      height: 84rpx;
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


