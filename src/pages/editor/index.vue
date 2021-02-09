<template>
  <view class="editor-wrap">
    <mp-html class="editor" ref="editor" :content="html" editable />
    <view class="editor-toolbar">
      <u-button
        @click="insertText"
        :custom-style="buttonStyle"
        :hair-line="false"
        throttle-time="0"
        ><u-icon
          name="edit-pen"
          label-pos="bottom"
          margin-top="12"
          label="文本"
          label-size="24"
        ></u-icon
      ></u-button>
      <u-button
        @click="insertImg"
        :custom-style="buttonStyle"
        :hair-line="false"
        ><u-icon
          name="photo"
          label-pos="bottom"
          margin-top="12"
          label="图片"
          label-size="24"
        ></u-icon
      ></u-button>
      <u-button
        @click="insertLink"
        :custom-style="buttonStyle"
        :hair-line="false"
        ><u-icon
          name="share"
          label-pos="bottom"
          margin-top="12"
          label="链接"
          label-size="24"
        ></u-icon
      ></u-button>
      <u-button
        @click="insertVideo"
        :custom-style="buttonStyle"
        :hair-line="false"
        ><u-icon
          name="play-circle"
          label-pos="bottom"
          margin-top="12"
          label="视频"
          label-size="24"
        ></u-icon
      ></u-button>
      <u-button
        @click="getContent"
        :custom-style="buttonStyle"
        :hair-line="false"
        ><u-icon
          name="checkmark-circle"
          label-pos="bottom"
          margin-top="12"
          label="保存"
          label-size="24"
        ></u-icon
      ></u-button>
    </view>
    <u-modal
      v-model="addVideoSrcPanel"
      show-cancel-button
      title="视频地址：外站 iframe 中的 src"
      :zoom="false"
      @cancel="cancelAddVideoSrcPanel"
      @confirm="submitAddVideoSrcPanel"
    >
      <view class="new-folder-popup">
        <u-input
          v-model="videoSrc"
          placeholder="player.bilibili.com/player.html?aid=73801474"
        />
      </view>
    </u-modal>
    <u-modal
      v-model="addLinkPanel"
      show-cancel-button
      title="请输入链接"
      :zoom="false"
      @cancel="cancelAddLinkPanel"
      @confirm="submitAddLinkPanel"
    >
      <view class="new-folder-popup">
        <u-input v-model="link" />
      </view>
    </u-modal>
  </view>
</template>
<script>
import mphtml from "@/components/mp-html/mp-html";
import { IMAGE_URL } from "@/api/api";
export default {
  components: {
    "mp-html": mphtml,
  },
  data() {
    return {
      buttonStyle: {
        "border-width": 0,
      },
      addVideoSrcPanel: false,
      addLinkPanel: false,
      videoSrc: "",
      link: "",
      html: "",
      chooseImg: null,
      article: {},
    };
  },
  methods: {
    cancelAddVideoSrcPanel() {
      this.addVideoSrcPanel = false;
      this.videoSrc = "";
    },
    submitAddVideoSrcPanel() {
      this.addVideoSrcPanel = false;
      this.$refs.editor.insertVideo();
    },
    cancelAddLinkPanel() {
      this.addLinkPanel = false;
      this.link = "";
    },
    submitAddLinkPanel() {
      this.addLinkPanel = false;
      this.$refs.editor.insertLink();
    },
    scrollBottom() {
      this.$refs.editor
        .getRect()
        .then((rect) => {
          setTimeout(function () {
            uni.pageScrollTo({
              scrollTop: rect.height,
              duration: 100,
            });
          }, 0);
        })
        .catch((err) => {});
    },
    insertText() {
      this.$refs.editor.insertText();
      this.scrollBottom();
    },
    insertImg() {
      uni.navigateTo({
        url: "/pages/files/image-view?from=article",
        success: (res) => {},
      });
      this.scrollBottom();
    },
    insertLink() {
      this.addLinkPanel = true;
      this.link = "";
      this.scrollBottom();
    },
    insertVideo() {
      this.addVideoSrcPanel = true;
      this.videoSrc = "";
      this.scrollBottom();
    },
    getContent() {
      var richtext = this.$refs.editor.getContent();
      uni.$emit("acceptContentData", { richtext: richtext });
      uni.showToast({
        title: "保存成功",
        duration: 1000,
        complete: (res) => {
          let timeout = setTimeout((res) => {
            clearTimeout(timeout);
            uni.navigateBack({ delta: 1 });
          }, 1000);
        },
      });
    },
  },
  onLoad() {},
  onUnload() {
    uni.$off("acceptArticleImageChooseData");
    uni.$off("acceptArticleData");
  },
  onReady() {
    let that = this;
    uni.$on("acceptArticleImageChooseData", (data) => {
      that.chooseImg = data.img;
      that.$refs.editor.insertImg();
    });
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on("acceptArticleData", (data) => {
      that.html = data.article.content;
      that.article = data.article;
      that.$refs.editor.getSrc = (type, value) => {
        return new Promise((resolve, reject) => {
          if (type == "img") {
            resolve(that.chooseImg.url);
          } else if (type == "link") {
            resolve(that.link);
          } else if ((type = "video")) {
            resolve(that.videoSrc);
          }
        });
      };
    });
  },
};
</script>
<style lang="scss" scoped>
.editor-wrap {
  padding-bottom: 100rpx;
  background-color: #fff;
  padding: 20rpx;
}
.editor {
  border-width: 1px;
  border-style: dashed;
  border-color: #d4c4a2;
  background-color: #fff;
}
.editor-toolbar {
  height: 100rpx;
  width: 100vw;
  display: flex;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: #fff;
}
.editor-wrap::after {
  content: " ";
  height: 100rpx;
  width: 50vw;
  display: flex;
}
.new-folder-popup {
  padding: 0 75rpx;
}
</style>