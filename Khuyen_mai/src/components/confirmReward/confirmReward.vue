<template>
  <div>
    <div class="search-bar">
      <!-- Search Input -->
      <div style="display: flex; flex-direction: column; gap: 5px">
        <label for="search-input" class="search-label">{{
          $t("search_label")
        }}</label>
        <el-input
          id="search-input"
          v-model="searchTerm"
          :placeholder="$t('search_placeholder')"
          clearable
          class="search-input"
        ></el-input>
      </div>
      <!-- Branch Dropdown -->
      <div
        v-if="profile.DEP_CODE === 'LVB010010'"
        style="display: flex; flex-direction: column; gap: 5px"
      >
        <label for="search-input" class="search-label">{{
          $t("branch_Name")
        }}</label>

        <el-select
          v-model="selectedBranch"
          :placeholder="$t('all_branch')"
          clearable
          class="branch-dropdown"
        >
          <el-option
            v-for="branch in dataBranch"
            :key="branch.BRN_CODE"
            :label="branch.BRN_NAME"
            :value="branch.BRN_CODE"
          ></el-option>
        </el-select>
      </div>
        <!-- download button-->
        <div style="margin-left: auto;margin-top: auto">
        <el-button type="primary" @click="exportToExcel()"><el-icon><Download /></el-icon>&nbsp;{{
          $t("export")
        }}</el-button>
       </div>
    </div>
    <!-- table -->
    <el-table
      v-loading.fullscreen.lock="fullscreenLoading"
      :element-loading-text="$t('loading')"
      :data="filteredData"
      height="500"
      style="width: 100%"
    >
      <!-- no -->
      <el-table-column type="index" :label="$t('no')" width="60" align="center">
        <template #default="scope">
          <span class="index-column"> {{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <!-- Account Number Column -->
      <el-table-column
        prop="ACCOUNT_NO"
        :label="$t('account_no')"
        min-width="100px"
      ></el-table-column>

      <!-- Account Name Column -->
      <el-table-column
        prop="ACCOUNT_NAME"
        :label="$t('account_name')"
        min-width="150px"
      >
        <template #default="scope">
          <span class="account-name">{{ scope.row.ACCOUNT_NAME }}</span>
        </template>
      </el-table-column>

      <!-- Balance Column with formatted currency -->
      <el-table-column prop="BALANCE" :label="$t('balance')" min-width="150px">
        <template #default="scope">
          <span class="balance">
            {{ formatCurrency(scope.row.BALANCE) }}
          </span>
        </template>
      </el-table-column>
      <!-- BRN_NAME -->
      <el-table-column
        prop="BRN_NAME"
        :label="$t('branch_Name')"
        min-width="200px"
      ></el-table-column>

      <!-- Present (multilingual display based on locale) -->
      <el-table-column :label="$t('present_name')" min-width="200px">
        <template #default="scope">
          <span class="present-name">
            {{ getPresentName(scope.row) }}
          </span>
        </template>
      </el-table-column>
      <!--date -->
      <el-table-column
        prop="DATE_OPEN"
        :label="$t('date_open')"
        min-width="150px"
      >
        <template #default="scope">
          <span class="balance">
            {{ new Date(scope.row.DATE_OPEN).toLocaleString().split(",")[0] }}
          </span>
        </template>
      </el-table-column>
      <!--date-end -->
      <el-table-column
        prop="DEPOSIT_END"
        :label="$t('date_end')"
        min-width="150px"
      >
        <template #default="scope">
          <span class="balance">
            {{ scope.row.DEPOSIT_END }}
          </span>
        </template>
      </el-table-column>
      <!-- desc -->
      <el-table-column
        prop="DES"
        :label="$t('desc')"
        min-width="100px"
      ></el-table-column>
      <!-- GIVER -->
      <el-table-column
        prop="EMP_NAME"
        :label="$t('giver')"
        min-width="150px"
        align="center"
      ></el-table-column>
      <!-- Status -->
      <el-table-column :label="$t('status')" align="center" min-width="150px">
        <template #default="scope">
          <el-button type="success" plain round v-if="scope.row.STATUS === 'C'">
            <el-icon><Check /></el-icon>&nbsp;{{ $t("complete") }}</el-button
          >
        </template>
      </el-table-column>
      <!-- action -->
      <el-table-column :label="$t('action')" align="center" min-width="200px">
        <template #default="scope">
          <!-- <div style="display: flex;"> -->
            <el-button
              type="primary"
              plain
              round
              @click="editAgain(scope.row)"
              >{{ $t("edit_again") }}</el-button
            >
            <!-- <el-button
              type="warning"
              plain
              round
              @click="lookDetail(scope.row)"
              >{{ $t("look") }}</el-button
            > -->
          <!-- </div> -->
        </template>
      </el-table-column>
    </el-table>
    <!-- dialog -->
    <el-dialog :title="$t('authorize_title')" v-model="isDialogVisible">
      <el-form :model="modalForm" label-width="auto">
        <!-- ID input -->
        <el-form-item :label="$t('authorize_title')" prop="EMP_NAME">
          <el-text>{{ modalForm.EMP_NAME }}</el-text>
        </el-form-item>
        <!-- button -->
        <div slot="footer" class="modal-footer">
          <el-button @click="isDialogVisible = false">{{
            $t("close")
          }}</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { Check,Download } from "@element-plus/icons-vue";
import useConfirmReward from "./confirmReward";
const {
  Position,
  searchTerm,
  fullscreenLoading,
  accountData,
  filteredData,
  loadData,
  formatCurrency,
  getPresentName,
  selectedBranch,
  dataBranch,
  profile,
  editAgain,
  lookDetail,
  isDialogVisible,
  modalForm,
  exportToExcel
} = useConfirmReward();
</script>

<style scoped>
.branch-dropdown {
  min-width: 250px; /* Minimum width for smaller screens */
}
.search-label {
  display: inline-block;
  font-size: 0.8rem;
}
.account-name {
  color: #409eff;
}
.balance {
  font-family: Courier;
  font-weight: bold;
}

::v-deep .el-table__header-wrapper th {
  background-color: #dfdfdf;
  color: black;
}
.search-bar {
  display: flex;
  gap: 10px; /* Space between the elements */
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  min-width: 250px;
}
@media (max-width: 768px) {
  .search-bar {
    flex-direction: column;
    gap: 15px;
  }

  .search-input {
    min-width: 100%;
  }
  .branch-dropdown {
    min-width: 100%; /* Minimum width for smaller screens */
  }
}
</style>
