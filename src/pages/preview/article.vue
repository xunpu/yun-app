<template>
  <!-- <rich-text :nodes="content"></rich-text> -->
  <mp-html class="editor" ref="editor" :content="content" />
</template>

<script>
// import mphtml from "@/components/mp-html/mp-html";
import mphtml from "mp-html/dist/uni-app/components/mp-html/mp-html";
export default {
  components: {
    "mp-html": mphtml,
  },
  data() {
    return {
      content: "",
    };
  },
  onLoad() {
    let that = this;
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on("acceptArticleContent", function (article, modify = false) {
      that.content = article.content;
    });
  },
};
</script>

<style lang="scss" scoped>
</style>