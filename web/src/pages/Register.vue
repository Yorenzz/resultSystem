<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import { register } from '../api/index.js'
import { useRouter } from 'vue-router'
import { userInfoStore } from '../store/index.js'

const store = userInfoStore()
const router = useRouter()
const userForm = ref(null)
const userData = reactive({
	username: '',
	password: '',
	passwordVerify: '',
})
const usernameRule = (rule, value, callback) => {
	if (value === '') {
		callback(new Error('请输入用户名'))
	} else {
		callback()
	}
}
const passwordRules = (rule, value, callback) => {
	if (value === '') {
		callback(new Error('请输入密码'))
	} else {
		callback()
	}
}

const passwordVerifyRules = (rule, value, callback) => {
	if (value === '') {
		callback(new Error('请输入密码'))
	} else if (value !== userData.password) {
		callback(new Error('两次输入密码不一致！'))
	} else {
		callback()
	}
}

const rules = reactive({
	username: [{ validator: usernameRule, trigger: 'blur' }],
	password: [{ validator: passwordRules, trigger: 'blur' }],
	passwordVerify: [{ validator: passwordVerifyRules, trigger: 'blur' }],
})
const submitRegister = () => {
	userForm.value
		.validate()
		.then(() => {
			register(userData.username, userData.password)
				.then(res => {

				})
				.catch(err => {
					console.warn(err)
				})
		})
		.catch(() => {})
}
</script>

<template>
  <el-form
    ref="userForm"
    label-suffix=":"
    class="form-content"
    :model="userData"
    :rules="rules"
  >
    <el-form-item prop="username">
      <el-input
        v-model="userData.username"
        class="input-item"
        :prefix-icon="User"
        placeholder="用户名"
      />
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        v-model="userData.password"
        class="input-item"
        :prefix-icon="Lock"
        show-password
        placeholder="密码"
      />
    </el-form-item>
    <el-form-item prop="passwordVerify">
      <el-input
        v-model="userData.passwordVerify"
        class="input-item"
        :prefix-icon="Lock"
        show-password
        placeholder="确认密码"
      />
    </el-form-item>
    <el-form-item>
      <div class="button-item">
        <el-button @click="submitRegister">
          注册
        </el-button>
        <el-button @click="router.push('/login')">
          返回登录
        </el-button>
      </div>
    </el-form-item>
  </el-form>
</template>

<style scoped lang="scss">
.form-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .input-item {
    width: 20vw;
  }
  .button-item {
    width: 100%;
    display: flex;
    justify-content: center;
  }
}
</style>
