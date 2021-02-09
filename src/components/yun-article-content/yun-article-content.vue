<template>
  <view>
    <tui-list-view unlined="all">
      <view v-for="(page, index) in articlelist" :key="index">
        <tui-list-cell
          v-for="item in page"
          :key="item.id"
          unlined
          padding="0 0"
          backgroundColor="transparent"
        >
          <yun-article-item @detail="detail" :article="item"></yun-article-item>
        </tui-list-cell>
      </view>
    </tui-list-view>
    <u-modal
      v-model="articleModal"
      title="跳转到链接"
      :show-cancel-button="true"
      :content="link"
      @confirm="goto"
    ></u-modal>
  </view>
</template>

<script>
import yunArticleItem from '../yun-article-item/yun-article-item.vue';
export default {
  components: { yunArticleItem },
  props: {
    articlelist: {
      require: true,
    },
  },
  data() {
    return {
      link: "",
      articleModal: false,
      curPath: "",
    };
  },
  methods: {
    goto() {},
    detail(params) {
      this.link = params.link;
      this.articleModal = true;
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
uni-page-body {
  background-color: #eee;
}
</style>