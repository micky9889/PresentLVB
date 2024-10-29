<template>
  <div class="login-container">
    <el-card class="login-card" shadow="hover">
      <h2 class="login-title">{{ $t("project_name") }}</h2>
      <el-form
        :model="loginForm"
        :rules="rules"
        ref="loginFormRef"
        label-width="80px" 
        @keyup.enter="submitForm"
      >
        <!-- Username field with icon -->
        <el-form-item :label="$t('username')" prop="username">
          <el-input
            v-model="loginForm.username"
            :placeholder="$t('username_placeholder')"
            :prefix-icon="User"
          />
        </el-form-item>

        <!-- Password field with icon -->
        <el-form-item :label="$t('password')" prop="password">
          <el-input
            v-model="loginForm.password"
            :placeholder="$t('password_placeholder')"
            show-password
            type="password"
            :prefix-icon="Lock"
          />
        </el-form-item>

        <!-- Login button with loading state -->
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="submitForm">
            {{ $t("login_btn") }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import useLogin from "./Login"; 

const { loginForm, loading, rules, loginFormRef, submitForm, User, Lock } = useLogin();
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url("../../assets/icons/bg1.jpg");
  background-size: cover;
  background-position: center;
}

.login-card {
  padding: 10px;
  width: 400px;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 10px;
}

.login-title {
  text-align: center;
  margin-bottom: 20px;
}

.el-button {
  width: 100%;
  margin-top: 10px;
}
</style>
