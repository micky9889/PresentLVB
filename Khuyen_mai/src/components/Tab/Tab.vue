<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="$t('pending_tab')" name="first">
        <AuthorView
      /></el-tab-pane>
      <el-tab-pane :label="$t('confirm_tab')" name="second"
        ><confirmReward
      /></el-tab-pane>
      <!-- <el-tab-pane :label="$t('reject_tab')" name="third"></el-tab-pane> -->
    </el-tabs>
  </div>
</template>
<script setup>
import { ref } from "vue";
import AuthorView from "../Authorize/AuthorView.vue";
import confirmReward from "../confirmReward/confirmReward.vue";

const activeName = ref("first");

const handleClick = async (tab) => {
  if (tab.name === "third") {
    try {
      // const response = await axios.get("YOUR_API_ENDPOINT");
      console.log("Data from API:");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
};
</script>

<style></style>
