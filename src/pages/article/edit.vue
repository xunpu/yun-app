<template>
  <view class="warp">
    <u-form :model="form" ref="articleForm">
      <u-form-item label="名称" prop="name"
        ><u-input v-model="form.name"
      /></u-form-item>
      <u-form-item label="标题" prop="title"
        ><u-input v-model="form.title"
      /></u-form-item>
      <u-form-item label="简介" prop="desc"
        ><u-input v-model="form.desc"
      /></u-form-item>
      <u-form-item prop="img" class="image-wrap" label="图片">
        <image
          v-if="imgUrl"
          class="pre-image"
          mode="aspectFit"
          :src="imgUrl"
        ></image>
        <u-button class="image-btn" @click="changeImage" :hair-line="false"
          >更改</u-button
        >
      </u-form-item>
      <u-form-item prop="content" class="editor-wrap" label="内容">
        <u-button class="editor-btn" @click="goToEditor" :hair-line="false"
          >编辑</u-button
        >
        <!-- <rich-text :nodes="richText"></rich-text> -->
      </u-form-item>
    </u-form>
    <u-button class="submit" @click="submit" type="primary">提交</u-button>
  </view>
</template>
<script>
import { createArticle, modifyArticle } from "@/api/api";
import { getToken } from "@/store/storage";
export default {
  data() {
    return {
      action: "",
      fileList: [],
      imgUrl: "",
      isModify: false,
      pid: "",
      rules: {
        name: {
          required: true,
          message: "请输入名称",
          trigger: "blur",
        },
        title: {
          required: true,
          message: "请输入标题",
          trigger: "blur",
        },
        desc: {
          required: true,
          message: "请输入简介",
          trigger: "blur",
        },
        content: {
          required: true,
          message: "请输入内容",
          trigger: "blur",
        },
        img: {
          required: true,
          message: "请选择一张图片",
          trigger: "blur",
        },
      },
      form: {
        content:''
      },
      richText: "",
    };
  },
  methods: {
    goToEditor() {
      let that = this;
      uni.navigateTo({
        url: "/pages/editor/index",
        success: function (res) {
          res.eventChannel.emit("acceptArticleData", { article: that.form });
        },
      });
    },
    choose() {
      // this.form.image = "";
    },
    changeImage() {
      uni.navigateTo({
        url: "/pages/files/image-view",
      });
    },
    beforeUpload() {},
    submit() {
      this.$refs.articleForm
        .validate((vaild) => {
          if (vaild) {
            return Promise.resolve(true);
          } else {
            return Promise.resolve(false);
          }
        })
        .then((res) => {
          if (res == false) {
            return;
          }
          getToken().then((token) => {
            this.form.pid = this.pid;
            this.form.token = token;
            if (this.isModify) {
              modifyArticle(this.form).then((res) => {
                if (res.code == 0) {
                  uni.navigateBack({
                    delta: 1,
                  });
                  uni.$emit("refreshFileList");
                } else {
                  uni.showToast({
                    title: res.msg,
                  });
                }
              });
            } else {
              createArticle(this.form).then((res) => {
                if (res.code == 0) {
                  uni.navigateBack({
                    delta: 1,
                  });
                  uni.$emit("refreshFileList");
                } else {
                  uni.showToast({
                    title: res.msg,
                  });
                }
              });
            }
          });
        });
    },
  },
  onReady() {
    this.$refs.articleForm.setRules(this.rules);
  },
  onLoad(params) {
    let that = this;
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on("acceptArticleData", function (res, modify = false) {
      if (res["article"] == undefined) {
        that.form = {};
      } else {
        that.form = res["article"];
        that.imgUrl = res["article"]["img_url"];
      }
      that.pid = res["pid"];
      that.isModify = modify;
    });
    uni.$on("acceptContentData", (res) => {
      this.form.content = res.richtext;
    })
    uni.$on("acceptImageData", (res) => {
      let img = res["img"];
      this.imgUrl = img.url;
      this.form.img = img.uuid;
    })
  },
};
</script>

<style lang="scss" scoped>
.warp {
  padding: 20rpx 40rpx;
}
.image-wrap {
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
.image-btn {
  // margin-left: 20rpx;
  width: 140rpx;
  height: 140rpx;
  border-width: 0;
}
.pre-image {
  width: 200rpx;
  height: 150rpx;
  border-radius: 10rpx;
}
.editor-wrap {
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
.editor-btn {
  border-width: 0;
}
.submit {
  margin-top: 80rpx;
}
</style>