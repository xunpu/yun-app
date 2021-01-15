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
          label="卡片"
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
  </view>
</template>
<script>
import mphtml from "@/components/mp-html/mp-html";
export default {
  components: {
    "mp-html": mphtml,
  },
  data() {
    return {
      buttonStyle: {
        "border-width": 0,
      },
      html: "",
      article: {},
    };
  },
  methods: {
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
      this.$refs.editor.insertImg();
      this.scrollBottom();
    },
    insertLink() {
      this.$refs.editor.insertLink();
      this.scrollBottom();
    },
    insertVideo() {
      this.$refs.editor.insertVideo();
      this.scrollBottom();
    },
    getContent() {
      console.log(this.$refs.editor.getContent());
    },
  },
  onLoad() {},
  onReady() {
    let that = this;
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on("acceptArticleData", function (data) {
      that.article = data.article;
      that.$refs.editor.getSrc = (type, value) => {
        return new Promise((resolve, reject) => {
          if (type == "img") {
            // resolve(that.article.link);
            resolve("/static/avatar_logo.png");
          } else if (type == "link") {
            resolve(that.article.link);
          } else if ((type = "video")) {
            resolve(
              "https://player.bilibili.com/player.html?aid=886051604&bvid=BV1fK4y1p7TN&cid=280017300"
            );
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
</style>