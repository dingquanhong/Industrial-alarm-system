<template>
  <div class="login-container">
    <div class="left">
      <h1>欢迎使用XX工业报警系统</h1>
      <span>Welcome to use Industrial alarm system</span>
    </div>
    <div class="login-box">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on"
        label-position="left">

        <div class="title-container">
          <h3 class="title">欢迎使用</h3>
        </div>

        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input ref="username" v-model="loginForm.username" placeholder="Username" name="username" type="text"
            tabindex="1" auto-complete="on" />
        </el-form-item>

        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input :key="passwordType" ref="password" v-model="loginForm.password" :type="passwordType"
            placeholder="Password" name="password" tabindex="2" auto-complete="on" @keyup.enter.native="handleLogin" />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>

        <el-button :loading="loading" type="primary" class="primary-btn"
          @click.native.prevent="handleLogin">登录</el-button>
      </el-form>
    </div>

  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'admin',
        password: '111111'
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
/* CSS样式 */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: url('../../assets/login_images/bg.png') no-repeat center center;
}

.left {
  margin-right: 50px;
  color: #fff;
}

.left h1 {
  font-size: 48px;

}

.primary-btn {
  width: 100%;
  background: #3269d7;
  border: none;
  height: 48px;
  margin-top: 20px;
  font-size: 18px;
  box-shadow: 0 5px 10px rgba(50, 105, 215,.5);
}
.primary-btn:hover {
  background: #3f73db;
}
.primary-btn:active {
  background: #2955af;
}
.left span {
  font-size: 18px;

}

.login-box {
  height: 400px;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 400px;
  margin-left: 100px;
}

.login-form {
  width: 90%;
  padding: 20px;

}

.title-container {
  text-align: center;
  margin-bottom: 20px;
}

.title {
  font-size: 1.8em;
  color: #3269d7;
}

.el-form-item {
  position: relative;
  margin-bottom: 20px;
}

.svg-container {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #ccc;
}

.el-input input {
  padding-left: 40px;
  height: 40px;
}

.show-pwd {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #ccc;
}

.tips {
  text-align: center;
  font-size: 0.9em;
  color: #999;
  margin-top: 20px;
}
</style>
