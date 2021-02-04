<template>
  <view class="main" v-show="visible">
    <u-row>
      <u-col span="1.5"></u-col>
      <u-col span="9">
        <u-form :model="form" ref="modifyForm" label-width="150">
          <u-form-item label="旧密码" prop="password">
            <u-input v-model="form.password" :type="password_type" />
          </u-form-item>
          <u-form-item label="新密码" prop="new_password">
            <u-input v-model="form.new_password" :type="password_type" />
          </u-form-item>
          <u-form-item label="重复新密码" prop="new_password2">
            <u-input v-model="form.new_password2" :type="password_type" />
          </u-form-item>
          <u-form-item v-show="captcha.status" label="验证码" prop="captcha">
            <u-input v-model="form.captcha" />
            <image class="cap" @click="changeCap" v-bind:src="captcha.src" />
          </u-form-item>
        </u-form>
        <u-row class="btns-group">
          <u-col span="1"></u-col>
          <u-col span="4">
            <u-button
              size="medium"
              shape="circle"
              :ripple="true"
              @click="navToAccount"
              >取消</u-button
            >
          </u-col>
          <u-col span="2"></u-col>
          <u-col span="4">
            <u-button
              size="medium"
              class="submit"
              shape="circle"
              :ripple="true"
              @click="submit"
              >确定</u-button
            >
          </u-col>
          <u-col span="1"></u-col>
        </u-row>
      </u-col>
      <u-col span="1.5"></u-col>
    </u-row>
    <u-toast ref="loginToast" />
  </view>
</template>

<script>
import { getCaptcha, getPasswdSalt, modifyPasswd } from "@/api/api";
import sha256 from "@/utils/tools";
window.sha256 = sha256;
export default {
  data() {
    return {
      password_salt: "",
      password_type: "password",
      form: {
        password: "",
        new_password: "",
        new_password2: "",
        captcha: "",
        phone: "",
      },
      rules: {
        password: [
          {
            required: true,
            min: 6,
            message: "密码不少于6位",
            trigger: "blur",
          },
        ],
        new_password: [
          {
            required: true,
            min: 6,
            message: "密码不少于6位",
            trigger: "blur",
          },
        ],
        new_password2: [
          {
            required: true,
            min: 6,
            message: "密码不少于6位",
            trigger: "blur",
          },
          {
            validator: (rule, value, callback) => {
              return this.form.new_password === value;
            },
            message: "新密码输入不一致",
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
    changeCap() {
      getCaptcha().then((res) => {
        this.captcha.src = res.data.src;
        this.captcha.token = res.data.token;
      });
    },
    navToAccount() {
      uni.switchTab({ url: "/pages/my/index" });
    },
    submit() {
      let that = this;
      this.$refs.modifyForm
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
          let phone = "";
          uni.getStorage({
            key: "phone",
            success: (res) => {
              phone = res.data;
              getPasswdSalt({
                phone: phone,
              }).then((res) => {
                let password_salt = res.data;
                let password_salt2 = sha256(
                  Math.random().toString(36)
                ).substring(0, 8);
                let password_hash1 = sha256(
                  password_salt + sha256(this.form.password)
                );
                let password_hash2 = sha256(password_salt2 + password_hash1);

                let new_password_salt = sha256(
                  Math.random().toString(36)
                ).substring(0, 8);
                let new_password_hash = sha256(
                  new_password_salt + sha256(this.form.new_password)
                );
                modifyPasswd({
                  phone: phone,
                  text: this.form.captcha,
                  token: this.captcha.token,
                  password_hash2: password_hash2,
                  password_salt2: password_salt2,
                  new_password_hash: new_password_hash,
                  new_password_salt: new_password_salt,
                }).then((res) => {
                  this.$refs.modifyForm.resetFields();
                  if (res.code != 0) {
                    this.$refs.loginToast.show({
                      title: res.msg,
                      callback: (res) => {
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
                    this.$refs.loginToast.show({
                      title: res.msg,
                      callback: (res) => {
                        this.navToAccount();
                      },
                    });
                  }
                });
              });
            },
          });
        });
    },
  },
  mounted: function () {
    this.$nextTick(() => {
      this.$refs.modifyForm.setRules(this.rules);
      getCaptcha().then((res) => {
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
  color: #fff;
  background-color: #3182bd;
}
.btns-group {
  margin-top: 1.5rem;
}
</style>