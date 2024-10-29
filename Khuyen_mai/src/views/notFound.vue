<template>
    <div class="error-page">
      <el-row type="flex" justify="center" align="middle" class="vh-100">
        <el-col :span="12" class="text-center">
          <h1 class="display-1 fw-bold">404</h1>
          <p class="fs-3">
            <span class="text-danger">Oops!</span> Page not found.
          </p>
          <p class="lead">The page you’re looking for doesn’t exist.</p>
          <router-link to="/">
            <el-button type="primary">Go Home</el-button>
          </router-link>
        </el-col>
      </el-row>
    </div>
  </template>
  
  <script setup>
  </script>
  
  <style scoped>
  .vh-100 {
    height: 100vh;
  }
  
  .text-danger {
    color: #f56c6c;
  }
  
  .text-center {
    text-align: center;
  }
  
  .fw-bold {
    font-weight: bold;
  }
  
  .fs-3 {
    font-size: 1.75rem;
  }
  
  .lead {
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }
  </style>
  