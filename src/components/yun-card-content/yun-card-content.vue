<template>
  <view>
    <tui-list-view unlined="all">
      <view v-for="(page, index) in cardlist" :key="index">
        <tui-list-cell
          v-for="item in page"
          :key="item.id"
          unlined
          padding="0 0"
          backgroundColor="transparent"
        >
          <yun-card-item @detail="detail" :card="item"></yun-card-item>
        </tui-list-cell>
      </view>
    </tui-list-view>
    <u-modal
      v-model="cardModal"
      title="跳转到链接"
      :show-cancel-button="true"
      :content="link"
      @confirm="goto"
    ></u-modal>
  </view>
</template>

<script>
import { getCards } from "@/api/api";
export default {
  props: {
    cardlist: {
      require: true,
    },
  },
  data() {
    return {
      link: "",
      cardModal: false,
      curPath: "",
    };
  },
  methods: {
    goto() {},
    detail(params) {
      this.link = params.link;
      this.cardModal = true;
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
uni-page-body/deep/ .tui-list-content {
  background-color: #eee;
  padding-bottom: 140rpx;
}
</style>