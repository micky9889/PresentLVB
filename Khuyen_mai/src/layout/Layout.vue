<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px">
        <!-- Navigation Links -->
        <el-menu :default-active="activeMenuItem">
          <el-header class="aside-header"
            ><img
              src="../assets/icons/present.jpg"
              alt="present"
              style="width: 30px; height: auto; margin-right: 10px;font"
            />
            <span style="font-size: 0.75rem">
              {{ $t("bank_name") }}
            </span>
          </el-header>
          <router-link to="/" class="no-decoration">
            <el-menu-item index="1" class="list">
              <el-icon><Present /></el-icon>{{ $t("menu_gift") }}
            </el-menu-item>
          </router-link>
          <router-link to="/stock" class="no-decoration">
            <el-menu-item index="2" class="list">
              <el-icon><Tickets /></el-icon>{{ $t("menu_stock") }}
            </el-menu-item>
          </router-link>
          <router-link to="/user" class="no-decoration">
            <el-menu-item index="3" class="list">
              <el-icon><User /></el-icon>{{ $t("menu_user") }}
            </el-menu-item>
          </router-link>
          <router-link to="/authorize" class="no-decoration">
            <el-menu-item
              index="4"
              class="list"
              v-if="profile.ROLE_NAME=== 'CHECKER'"
            >
              <el-icon><CircleCheckFilled /></el-icon>{{ $t("menu_authorize") }}
            </el-menu-item>
          </router-link>
        </el-menu>
      </el-aside>

      <el-container class="page">
        <el-header class="header">
          <span class="header-title">{{ $t("project_name") }}</span>

          <!-- language -->
          <el-dropdown
            trigger="click"
            class="header-dropdown"
            style="margin-right: 10px"
          >
            <span class="el-dropdown-link">
              <img
                src="../assets/icons/translate.png"
                alt="Translate"
                style="width: 20px; height: 20px"
              />
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  @click="changeLanguage('la')"
                  style="display: flex; align-items: center"
                >
                  <img
                    src="../assets/icons/laos.png"
                    alt="flg1"
                    style="width: 20px; height: auto; margin-right: 10px"
                  />
                  {{ $t("tr_la") }}
                </el-dropdown-item>
                <el-dropdown-item
                  @click="changeLanguage('en')"
                  style="display: flex; align-items: center"
                >
                  <img
                    src="../assets/icons/english.png"
                    alt="flg1"
                    style="width: 20px; height: auto; margin-right: 10px"
                  />
                  {{ $t("tr_en") }}
                </el-dropdown-item>
                <el-dropdown-item
                  @click="changeLanguage('vn')"
                  style="display: flex; align-items: center"
                >
                  <img
                    src="../assets/icons/vietnam.png"
                    alt="flg1"
                    style="width: 20px; height: auto; margin-right: 10px"
                  />
                  {{ $t("tr_vn") }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <!-- setting -->
          <el-dropdown trigger="click" class="header-dropdown">
            <span class="el-dropdown-link">
              <el-icon style="color: white"><setting /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :icon="User" @click="showProfileDialog">{{
                  $t("profile")
                }}</el-dropdown-item>
                <el-dropdown-item :icon="SwitchButton" @click="logout">{{
                  $t("logout")
                }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-header>

        <el-main>
          <router-view />
        </el-main>

        <el-footer>{{ $t("bank_name") }}&nbsp;&copy;&nbsp;2024</el-footer>
      </el-container>
    </el-container>

    <!-- Profile Dialog -->
    <el-dialog
      :title="$t('user_profile')"
      v-model="isProfileDialogVisible"
      width="500px"
    >
      <el-form label-width="auto">
        <div
          style="display: flex; justify-content: center; margin-bottom: 10px"
        >
          <img
            :src="`${apiImg}/images/${profile.PICTURE}`"
            alt="Profile Picture"
            style="width: 100px; height: auto; margin-top: 10px"
          />
        </div>
        <!-- emp_name -->
        <el-form-item :label="$t('emp_name')" prop="EMPNAME">
          <el-input v-model="profile.EMPNAME" readOnly></el-input>
        </el-form-item>
        <!-- position -->
        <el-form-item :label="$t('position')" prop="POSITION">
          <el-input v-model="profile.POSITION" readOnly></el-input>
        </el-form-item>
        <!-- birthday -->
        <el-form-item :label="$t('birthday')" prop="BIRTHDAY">
          <el-input v-model="profile.BIRTHDAY" readOnly></el-input>
        </el-form-item>
        <!-- BRN_CODE -->
        <el-form-item :label="$t('branch_Code')" prop="BRN_CODE">
          <el-input v-model="profile.BRN_CODE" readOnly></el-input>
        </el-form-item>
        <!-- DEP -->
        <el-form-item :label="$t('dept')" prop="DEP">
          <el-input v-model="profile.DEP" readOnly></el-input>
        </el-form-item>
        <!-- DEP_CODE -->
        <el-form-item :label="$t('dept_Code')" prop="DEP_CODE">
          <el-input v-model="profile.DEP_CODE" readOnly></el-input>
        </el-form-item>
        <!-- EMAIL1 -->
        <el-form-item :label="$t('email')" prop="EMAIL1">
          <el-input v-model="profile.EMAIL1" readOnly></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="isProfileDialogVisible = false">{{
          $t("close")
        }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {
  Present,
  User,
  SwitchButton,
  Setting,
  Tickets,
  CircleCheckFilled,
} from "@element-plus/icons-vue";
import { useCommonLayout } from "./layout";
const {
  apiImg,
  activeMenuItem,
  changeLanguage,
  logout,
  profile,
  isProfileDialogVisible,
  showProfileDialog,
} = useCommonLayout();
</script>

<style scoped>
.common-layout {
  height: 100vh;
}
.page {
  height: 100vh;
}
.page .header {
  background: var(--el-menu-active-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}
.header-title {
  flex-grow: 1;
  text-align: center;
}
.aside-header {
  color: var(--el-menu-active-color);
  border-bottom: solid 1px rgb(241, 240, 240);
  display: flex;
  align-items: center;
  justify-content: center;
}
.el-footer {
  background: var(--el-menu-active-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}
.no-decoration {
  text-decoration: none;
}
.list:hover {
  color: var(--el-menu-active-color);
  transform: translateX(5px);
}
.el-menu {
  border: none;
}
.el-aside {
  border-right: solid 1px rgb(241, 240, 240);
}
.el-menu-item.is-active {
  color: var(--el-menu-active-color);
  background-color: var(--el-color-primary-light-9);
}
.header-dropdown {
  margin-left: auto;
}
</style>
