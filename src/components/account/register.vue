<template>
  <view class="main" v-show="visible">
    <u-row>
      <u-col span="1.5"></u-col>
      <u-col span="9">
        <u-form :model="form" ref="loginForm" label-width="150">
          <u-form-item label="手 机" prop="phone">
            <u-input v-model="form.phone" />
          </u-form-item>
          <u-form-item label="密 码" prop="password">
            <u-input v-model="form.password" :type="password_type" />
          </u-form-item>
          <u-form-item v-show="captcha.status" label="验证码" prop="captcha">
            <u-input v-model="form.captcha" />
            <image class="cap" @click="changeCap" v-bind:src="captcha.src" />
          </u-form-item>
        </u-form>
        <u-button class="submit" shape="circle" :ripple="true" @click="submit">提交</u-button>
        <u-button @click="navToLogin" class="reg">
          已有账号返回
          <view class="reg-text">登录</view>
        </u-button>
      </u-col>
      <u-col span="1.5"></u-col>
    </u-row>
    <u-toast ref="loginToast" />
  </view>
</template>

<script>
import { getCaptcha, getPasswdSalt, register } from "@/api/api";
import sha256 from "@/utils/tools";
export default {
  data() {
    return {
      password_salt: "",
      password_type: "password",
      form: {
        phone: "",
        password: "",
        captcha: "",
      },
      rules: {
        phone: [
          {
            required: true,
            min: 11,
            max: 11,
            message: "请输入正确的手机号",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            min: 6,
            message: "密码不少于6位",
            trigger: "blur",
          },
        ],
      },
      captcha: {
        src: "",
        status: false,
        token: "",
      },
    };
  },
  props: {
    visible: {
      default: true,
      type: Boolean,
    },
  },
  methods: {
    submit() {
      let that = this;
      this.$refs.loginForm
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
          let params = {
            phone: this.form.phone,
          };

          let password_salt = sha256(Math.random().toString(36)).substring(
            0,
            8
          );
          let password_hash = sha256(
            password_salt + sha256(this.form.password)
          );
          register({
            phone: this.form.phone,
            text: this.form.captcha,
            token: this.captcha.token,
            password_hash: password_hash,
            password_salt: password_salt,
          }).then((res) => {
            if (res.code != 0) {
              this.$refs.loginToast.show({
                title: res.msg,
                callback: (res) => {
                  this.$refs.loginForm.resetFields();
                  getCaptcha().then((res) => {
                    if (res.code == 0) {
                      this.captcha.status = true;
                      this.captcha.src = res.data.src;
                      this.captcha.token = res.data.token;
                    }
                  });
                },
              });
            } else {
              uni.setStorage({
                key: "token",
                data: res.data.token,
                success: function () {
                  that.registerSuccess(res.data);
                },
              });
            }
          });
        });
    },
    changeCap() {
      getCaptcha({ assert: true }).then((res) => {
        this.captcha.src = res.data.src;
        this.captcha.token = res.data.token;
      });
    },
    registerSuccess() {
      this.navToAccount();
    },
    navToAccount() {
      uni.redirectTo({
        url: "/pages/my/index",
      });
    },
    navToLogin() {
      uni.redirectTo({
        url: "/pages/account/login",
      });
    },
  },
  mounted: function () {
    this.$nextTick(() => {
      this.$refs.loginForm.setRules(this.rules);
      getCaptcha({ assert: true }).then((res) => {
        if (res.code == 0) {
          this.captcha.status = true;
          this.captcha.src = res.data.src;
          this.captcha.token = res.data.token;
        }
      });
    });
  },
};
</script>

<style lang='scss' scoped>
.main {
  padding-top: 150rpx;
}
.cap {
  margin-left: 1em;
  width: 6.5em;
  height: 2.45em;
}
.submit {
  margin-top: 1.5rem;
  color: #fff;
  background-color: #3182bd;
}
.reg {
  background: transparent;
  border: none;
  box-shadow: none;
  font-size: 1em;
  color: $u-type-info;
}
.reg:after {
  border: 0;
}
.reg view {
  // color: red;
  color: darken($u-type-info, 25%);
}
</style>