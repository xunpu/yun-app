<template>
  <view class="warp">
    <u-form :model="form" ref="card">
      <u-form-item label="标题"><u-input v-model="form.title" /></u-form-item>
      <u-form-item label="简介"><u-input v-model="form.desc" /></u-form-item>
      <u-form-item class="image-wrap" label="图片">
        <image
          class="pre-image"
          mode="aspectFill"
          :src="form.image"
          @error="imageError"
          @load="imageLoad"
        ></image>
        <u-button class="image-btn" @click="changeImage" :hair-line="false"
          >更改</u-button
        >
      </u-form-item>
      <!-- <u-form-item label="内容"
        ><u-input v-model="form.text" type="textarea"
      /></u-form-item> -->
      <!-- <u-form-item label="链接"><u-input v-model="form.link" /></u-form-item> -->
      <u-form-item class="editor-wrap" label="内容">
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
import { getCards } from "@/api/api";
export default {
  data() {
    return {
      action: "",
      fileList: [],
      form: {
        image: "-",
      },
      default_image:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJ4AAABGCAYAAAA96C05AAAGCXpUWHRSYXcgcHJvZmlsZSB0eXBlIGV4aWYAAHja7VdRkiWpDfznFD4CkhCC4wgkInwDH99Jvde90zOz3tm1/WUX8YpqihJCmUrRJf/x91P+hourjNLURp+9V1xttsmOh1Ff13zuVNtzfw3l+x19HS+tv18whgS9vP40f893jOtvH3ysQevreBnvNzzehujT8HPJXfk+x7dOYpxf49Tehj5c7XPYt66ut6H9nvi48v61T7de3f27fBkwRCkUCwlzCkl97u3lgdwfiaO/d4zzferPSC1Px29jCMiX7X30tX4boC9B/ngq30ff6OfBZ3/PkO9i+Qar4OGnL0i/G5fP9fnbheXTI/76Yn+a+jHI58Q4J1+789YR0f5m1BNs+jCDiQshl+ezjmb4KZ7taRNtVK8bkAdWXGibJjFQOYUaBTkdyqfftOFi42RDz7wB1B0bYjx5P4i12+iwyZSQASw3ZxHBMH/6Qs+681lv08DKQZjKBGOET363lX/18s+0cs6+IaIbTHvCdgHmyyy4cZG7d8wCIHTeuOkT4I/2hr9+QyxQFQjqE+aBDXpdLxNL6TduyYOzYJ6if6UQFYu3AYQIayucIQECtZModarGbESI4wBADs8ZubGAAKlywEluIp2L8eC7Nr4xeuaycuc7DG0CEIpsMmAzxQFWawr+WBvgkKtoU9WupqPoVO/SW9feu/Urcm5izdS6mQ2b5kNGGzr6sDHGHD55CjRQZ582x5zTnYtjIYctx3zHyOIlqy1dfdkaay7foM9uW3fftsee24NDAjIRPSxGzPCkklCKbKnZ03LkTD/g2pHTjp5+7Iwzj3+i9kb1h/YnUKM3avwgdefZJ2oYLWYfJujKiV7MgBg3AuJ2EQCh+WJWB7XGF7mLWZ2MpFCGk3qxKUEXMUDYklgPfWL3G3K/hFvR8Uu48R8hVy50/wnkCqD7EbefoBb+qJ48uN0svDGtguxLx/Jcht+a5vzv9v9DhqwB/zbBRssDalYDNG2Z9ckx28m2IdxnbKgPVP1+NzP6zqJrW284SrA2gp7nFjnBowHNDox1QqMaVrj0lAULV5gYp5W5q1+mraqhXpLAVFACvAEjfHVjz1jDaOrYR1lmtgo9PqlaA16BZW6rY7iByzUhddFOmawxxumrZo7XHieODf481l/vyx9NuEELbkG7r2MzsNjBUsN7yKxIAB+LfEmRBbleC3mYbbpR7DkNGZHh0Wu0ZKq7R8fGF7IX25hpMHAi8LntZbun4FiDYNecg/bCBDnI+43ZDdvrkHzjQFHux21CVGbXI6meNtkChyEAFu6RjuwfwAaJH9L7XHvUhNOQNCjHzT2up+W6JS+6n6mx95mTm4n4QvXY5GOPZYgRUl1qnKGJQyR3vAVPqmg29w3RQwFqcKj2Jf1gx4d5HUGAGPC1gBnBdtcoJlGPJTQpkhLSMQY832sTo3oQfDPkOoSCA7pjpnv1q4JjeeNth3PVEYPKNl775GozaYVoz34adjC2dx7QJbV1pTXXccRvNBxmdkUehLesKQfLTl+reG19T2CDjUZ2XrhXzwR340qXSsy1xg1Pv5uLmgAQueC61hwrsoG0TiV24GhkgsNLgPfHAzHUjc07KAA9kw6PHZmjkFyLDUrlIjukq2ldyL04kLeCbDo9k2aOq+95FNkKhUwAYoJ0RdJU3jC6UCKazH1ArtrBpERuwTT+8/ClZc7d5tAOs/dMZlfXdwWjtuZpyFeUhMC1A9q+gTw9g0xDn6daX335ePgLPaOUOFTeG5SndCg6NpWNIBCYwCiKcp0FUUj2PCDipR7KjmDTGwge7O9qFBojitvm4VlQI3Agbkgyxk6pJcI6cTByaAMnqqq3herVJgYBMGr4jl1p5DkK2qH8jWkqQI07Tqin77CzeTGynhbKEHagFEi9BxMUaFS9+yTR5fbrNIQbh62OFd1GOTgeGHKhK03BcVJQVQUkUIGMLJRh4gXMHVCEgF7rnpcRG7slH9KYyJ8lZxVpcdGgNDCn7kE5J1g8ArHkkR1HAGr7pXjgze9GvvxVyP5v6L9mCEw7OAP9E7tC1fspZ7cMAAABhmlDQ1BJQ0MgcHJvZmlsZQAAeJx9kT1Iw1AUhU9TpSJVBzuIOGSoLloQFREnrUIRKoRaoVUHk5f+CE0akhQXR8G14ODPYtXBxVlXB1dBEPwBcXNzUnSREu9LCi1ivPB4H+fdc3jvPkColZhmtY0Cmm6bqURczGRXxNArAuhGCNMYlpllzEpSEr71dU/dVHcxnuXf92d1qTmLAQGReIYZpk28Tjy5aRuc94kjrCirxOfEIyZdkPiR64rHb5wLLgs8M2KmU3PEEWKx0MJKC7OiqRFPEEdVTad8IeOxynmLs1aqsMY9+QvDOX15ieu0BpDAAhYhQYSCCjZQgo0Y7TopFlJ0Hvfx97t+iVwKuTbAyDGPMjTIrh/8D37P1sqPj3lJ4TjQ/uI4H4NAaBeoVx3n+9hx6idA8Bm40pv+cg2Y+iS92tSiR0DPNnBx3dSUPeByB+h7MmRTdqUgLSGfB97P6JuyQO8t0Lnqza1xjtMHIE2zSt4AB4fAUIGy13ze3dE6t397GvP7AZ+hcrnLuzMUAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5QEOCAACt/9OhgAABJBJREFUeNrt3FlMFHcAx/HfzB6wbJFdCkVdl0UWGoG0IEcgHKla0FRJqdiHJsbY2iNp2kQbtWnT+lBT0xhi4ksPG2NMmrYGbZEAxWLFlELTiqTlFAVUBDlCLYvLtezuTB+wS8eFpgTbNDu/zwvZ//xnJhm+mdn/PKxQWloqg+g/JvISEMMjhkfE8IjhETE8YnhEDI8YHhHDI4ZHDI+I4RHDI2J4xPCIGB4xPCKGRwyPiOERwyOGR8TwiOERMTxieEQMb0nMmU8iIit/Uftcj8lA+sZCfCra/9F83dp1aLGk+j5XhCYiJX8LvjUlqfa6a9UeXs5KEwCgchH7pEUtw+owAyIMOmDi7+d+LMSiNi4Sm2MjEH9iEDKAYxnLEW8OAQDsHVvhm3skbJDhBaKr0el4M92mGNNrZm/6RcXbFOOnrg7D0F6/5HMezosHAAxPuND7Uq5i2/GCRMXn6OP1qolPVeENjLvQ5ZhSjCU+bAQAv/Fro5NIXuL5vjauwZdRyzDjlfDqhU68nmKFUadBnsUE54wXDQMOxXyvpJ5fjBPU/vt4hVtn73SVZV8t6nthfnQ4JNn/0h1puoWYG5fw/rQVjdszoRcFXB+bQrBGhClYC60oQi8KkGQZ015JsW9dvwPOxlre8QLJF0GP4lh+gt94sHb2UfvEliK/bbtqOrDT3bXgMV1eGZ777lJ3ZzwAgJObkqAXhbkLLQrQCIJvzC3J0AiC8i7AxUXgiTDo8UiIfsHt821bYQwCHAsfc1dNO4onOhVjj9/723t3GpEGHVaFBgMAvq8qx7sTFnQ+n40exyR+OV+l6kWdasLb6GjD6dNtc1FlFyDHYoIsy5BkQCMK+HHAgYGG83P7LOF8HzTewOi0B9deyPaNvZZshQDAbgqBbduzivnOGQ8uVJxVTXiqfI/XaklFrsWEU51DcHlluCUZn3UMImelCVesaQ/kHPu0vTj00G3FWJzJgN+m3Lgz5caYy4MxlwcurwSdKCBIo65/herCuxSVgvey7Zj0eLGvbu7729v13Rh3e3EgKxatf3nZ+yBNXL6Ij5r7sL26DRcrz6K4otn3PW9/XRcftYFoz+hynNyUhBLb7Gr0xZoOHDUP+bYfNQ/huapWlD2djIPZdtT2mbGjul0xZ6lOaONQnRULAOh3JuAZYxB0ooCSy71Y/3srwwtE72SuRoEtHDNeCYXlv+Jlb4/fnJ3uLmwuk1C1dS02WMNxKNeO7wYisCc1WjEv+t6CoSQvHk53rN9xPmnpR+5Ii/9ixNONgz+FYW+azbfomPR48cPtUcRwcRGYDjfexLpVZuw414a39LcWnPeK1IP8MxI+3LAGBxp6sD89Bgnhxnnn/hnP/VIiQ4GR+Y+f0NeEb/qa0G3LwO5UK0K0Gnz+1GM4V66uR63qXyAPx2fBLclY1fPzv3J8Q9p6tN0Zh/1mo9+23aNReCPVhuYRJ4rGrzA8Iq5qieERMTxieEQMjxgeEcMjhkfE8IjhEcMjYnjE8IgYHjE8IoZHDI+I4RHDI4ZHxPCI4RExPGJ4RAyPGB4Rw6P/uT8AFixRoXeGaTsAAAAASUVORK5CYII=",
      richText: "",
    };
  },
  methods: {
    imageError(e) {
      console.log(111);
      this.form.image = this.default_image;
    },
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
        url: "/pages/files/image-view?id=",
      });
    },
    beforeUpload() {},
    submit() {},
  },
  onLoad(params) {
    let that = this;
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on("acceptArticleData", function (res) {
      let article = res["article"];
      that.form = article;
    });
    uni.$on("acceptImageData", (res) => {
      let img = res["image"];

      that.form.image = img.image;
    });
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
  margin-left: 20rpx;
  width: 140rpx;
  height: 140rpx;
  border-width: 0;
}
.pre-image {
  width: 317rpx;
  height: 140rpx;
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