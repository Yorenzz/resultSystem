<script setup>
import { User,
	Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import { Login } from '../api/index.js'
import { useRoute, useRouter } from 'vue-router'
import { userInfoStore } from '../store/index.js'

const store = userInfoStore()
const router = useRouter()
const route = useRoute()
const userForm = ref(null)
const loading = ref(false)
const userData = reactive({
	username: 'youlian',
	password: 'youlian',
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
const rules = reactive({
	username: [{ validator: usernameRule, trigger: 'blur' }],
	password: [{ validator: passwordRules, trigger: 'blur' }],
})
const submit = () => {
	loading.value = true
	userForm.value
		.validate()
		.then(() => {
			Login(userData.username, userData.password)
				.then(res => {
					const { username, role, token } = res
					store.saveUserInfo(
						username,
						role,
						token,
					)
					router.push({ path: route.query.redirect || '/' })
				})
				.catch(err => {
					console.warn(err)
				})
				.finally(() => {
					loading.value = false
				})
		})
		.catch(() => {})
}
const register = () => {
	router.push('/register')
}
</script>

<template>
  <div>
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
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="userData.password"
          class="input-item"
          :prefix-icon="Lock"
          show-password
        />
      </el-form-item>
      <el-form-item>
        <div class="button-item">
          <el-button
            type="primary"
            @click="submit"
            :loading="loading"
          >
            登录
          </el-button>
          <el-button @click="register">
            注册
          </el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
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
