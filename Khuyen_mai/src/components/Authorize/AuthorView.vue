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
        <label class="search-label">{{ $t("branch_Name") }}</label>

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
          <el-text v-if="scope.row.STATUS === 'P'" type="warning">
            <el-icon class="is-loading">
              <Loading />
            </el-icon>
            {{ $t("pending") }}</el-text
          >
        </template>
      </el-table-column>
      <!-- action -->
      <el-table-column :label="$t('action')" align="center" min-width="200px">
        <template #default="scope">
          <div style="display: flex">
            <el-button
              type="primary"
              plain
              round
              @click="confirmRewawrd(scope.row)"
              >{{ $t("btn_approve") }}</el-button
            >
            <el-button
              type="danger"
              plain
              round
              @click="rejectRewawrd(scope.row)"
              >{{ $t("btn_reject") }}</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- reject modal -->
    <el-dialog :title="$t('reason_reject')" v-model="isDialogVisible">
      <el-form :model="rejectForm" ref="formRef" label-width="auto">
        <!-- present en -->
        <el-form-item
          :label="$t('desc')"
          prop="DES"
          :rules="[
            {
              required: true,
              message: $t('validate_reject'),
              trigger: 'blur',
            },
            {
              validator: validateDescription,
              trigger: 'blur',
            },
          ]"
        >
          <el-input v-model="rejectForm.DES"></el-input>
        </el-form-item>

        <!-- button -->
        <div slot="footer" class="modal-footer">
          <el-button @click="isDialogVisible = false">{{
            $t("cancel")
          }}</el-button>
          <el-button type="primary" @click="submitForm">{{
            $t("send")
          }}</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { Loading } from "@element-plus/icons-vue";
import useAuthor from "./Author";
const {
  Position,
  searchTerm,
  fullscreenLoading,
  accountData,
  filteredData,
  loadData,
  formatCurrency,
  getPresentName,
  confirmRewawrd,
  selectedBranch,
  dataBranch,
  profile,
  rejectRewawrd,
  isDialogVisible,
  rejectForm,
  formRef,
  submitForm,
  validateDescription,
} = useAuthor();
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
.modal-footer {
  display: flex;
  justify-content: flex-end; /* Aligns the buttons to the right */
  gap: 10px; /* Adds spacing between the buttons */
}
</style>
