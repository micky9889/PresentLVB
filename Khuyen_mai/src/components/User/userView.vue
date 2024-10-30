<template>
  <div>
    <!-- Search Input and Dropdown -->
    <div class="search-bar">
      <div class="flex-con">
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
        <!-- dropdown balance -->
        <!-- <div style="display: flex; flex-direction: column; gap: 5px">
          <label for="balance-filter" class="search-label">{{
            $t("filter_balance")
          }}</label>
          <el-select
            v-model="selectedBalanceRange"
            clearable
            class="balance-filter"
            :placeholder="$t('range_balance')"
          >
            <el-option :label="$t('less500')" :value="'0-500000000'"></el-option>
            <el-option
              :label="$t('501_1000')"
              :value="'500000001-1000000000'"
            ></el-option>
            <el-option
              :label="$t('1_3')"
              :value="'1000000001-3000000000'"
            ></el-option>
            <el-option
              :label="$t('3_5')"
              :value="'3000000001-5000000000'"
            ></el-option>
            <el-option :label="$t('more5')" :value="'5000000001-'"></el-option>
          </el-select>
  
        </div> -->
        <!-- Date Picker -->
        <div style="display: flex; flex-direction: column; gap: 5px">
          <label for="balance-filter" class="search-label">{{
            $t("range_date")
          }}</label>
          <el-date-picker
            v-model="selectedDateRange"
            type="daterange"
            range-separator="To"
            :start-placeholder="$t('start_date')"
            :end-placeholder="$t('end_date')"
            clearable
            style="width: 250px"
          >
          </el-date-picker>
        </div>
        <!-- present -->
        <!-- <div style="display: flex; flex-direction: column; gap: 5px">
          <label class="search-label">{{ $t("present_name") }}</label>
          <el-select
            v-model="presentName"
            :placeholder="$t('all_present')"
            clearable
            class="present-dropdown"
          >
            <el-option
              v-for="branch in dataGift"
              :key="branch.PS_ID"
              :label="getPresentName(branch)"
              :value="branch.PS_ID"
            />
          </el-select>
        </div> -->
        <!-- status -->
        <div style="display: flex; flex-direction: column; gap: 5px">
          <label class="search-label">{{ $t("status") }}</label>
          <el-select
            v-model="statusName"
            :placeholder="$t('all_status')"
            class="present-dropdown"
          >
            <el-option
              v-for="data in dataStatus"
              :key="data.id"
              :label="getStatus(data)"
              :value="data.id"
            />
          </el-select>
        </div>
      </div>
      <!-- create button -->
      <div
        style="
          display: flex;
          flex-direction: column;
          justify-content: end;
          gap: 5px;
        "
      >
        <el-button type="primary" @click="openCreateModal">{{
          $t("Create")
        }}</el-button>
      </div>
      <!--  -->
    </div>
    <el-table
      v-loading.fullscreen.lock="fullscreenLoading"
      :element-loading-text="$t('loading')"
      :data="paginatedData"
      height="500"
      style="width: 100%"
    >
      <!-- no -->
      <el-table-column type="index" :label="$t('no')" width="60" align="center">
        <template #default="scope">
          <span class="index-column">
            {{ (currentPage - 1) * pageSize + scope.$index + 1 }}</span
          >
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
      <!--date-open -->
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
        min-width="100px"
        align="center"
      ></el-table-column>
      <!-- Status -->
      <el-table-column :label="$t('status')" align="center" min-width="150px">
        <template #default="scope">
          <el-text type="warning" v-if="scope.row.STATUS === 'P'">
            <el-icon class="is-loading">
              <Loading />
            </el-icon>
            {{ $t("pending") }}</el-text
          >
          <el-button type="success" plain round v-if="scope.row.STATUS === 'C'">
            <el-icon><Check /></el-icon>&nbsp;{{ $t("complete") }}</el-button
          >
          <el-button type="danger" plain round v-if="scope.row.STATUS === 'R'">
            <el-icon><CloseBold /></el-icon>&nbsp;{{ $t("btn_reject") }}</el-button
          >
        </template>
      </el-table-column>
      <!-- action -->

      <el-table-column
        v-if="statusName === 'P'"
        :label="$t('action')"
        align="center"
        min-width="150px"
      >
        <template #default="scope">
          <el-button
            type="primary"
            plain
            round
            @click="openEditDialog(scope.row)"
          >
            <el-icon><EditPen /></el-icon>
          </el-button>
          <el-button type="danger" plain round @click="removeClient(scope.row)"
            ><el-icon><Delete /></el-icon
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-block">
      <!-- Pagination -->
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[10, 25, 50, 100]"
        :total="filteredData.length"
        layout="sizes,prev, pager, next, jumper"
        background
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
        class="pagination-bar"
      />
    </div>

    <!-- Create Modal -->
    <el-dialog
      :title="$t('open_account')"
      v-model="isCreateModalVisible"
      width="70vw"
    >
      <el-form :model="newPresent" label-width="auto">
      
        <!-- <el-form-item :label="$t('qtt')" required>
          <el-input
            v-model="newPresent.QTT"
            type="text"
            :min="1"
            @input="validateNumber"
          />
        </el-form-item> -->
        <el-form-item :label="$t('branch_Name')" required>
          <el-select
            v-model="newPresent.BRN_CODE"
            :disabled="profile.DEP_CODE !== 'LVB010010'"
          >
            <el-option
              v-for="branch in dataBranch"
              :key="branch.BRN_CODE"
              :label="branch.BRN_NAME"
              :value="branch.BRN_CODE"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('present_name')" required>
          <el-select
            v-model="newPresent.PS_ID"
            :placeholder="$t('select_present')"
            clearable
            :disabled="!newPresent.BRN_CODE"
          >
            <el-option
              v-for="data in filteredGifts"
              :key="data.PS_ID"
              :label="getPresentName(data)"
              :value="data.PS_ID"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('cif_no')" required>
          <el-input
            v-model="newPresent.CIF_NO"
            type="text"
            @input="validateNumberCif"
          />
        </el-form-item>
        <el-form-item :label="$t('account_name')" required>
          <el-input v-model="newPresent.ACCOUNT_NAME" type="text" />
        </el-form-item>
        <el-form-item :label="$t('account_no')" required>
          <el-input
            v-model="newPresent.ACCOUNT_NO"
            type="text"
            @input="validateNumber"
          />
        </el-form-item>

        <el-form-item :label="$t('balance')" required>
          <el-input
            v-model="newPresent.BALANCE"
            type="text"
            @input="validateNumberBal"
          />
        </el-form-item>
        <!-- date_end -->
        <el-form-item :label="$t('deposit_end')" required>
          <!-- <el-date-picker
            v-model="newPresent.DEPOSIT_END"
            type="date"
            :placeholder="$t('deposit_end')"
            :disabled-date="disabledDateEnd"
          /> -->
          <el-input
            v-model="newPresent.DEPOSIT_END"
            type="text"
            @input="validateNumberDep"
          />
        </el-form-item>
        <!-- desc -->
        <el-form-item :label="$t('desc')">
          <el-input v-model="newPresent.DES" type="text" />
        </el-form-item>

        <!-- date_open -->
        <el-form-item :label="$t('date_open')" required>
          <el-date-picker
            v-model="newPresent.DATE_OPEN"
            type="date"
            :placeholder="$t('date_open')"
            :disabled-date="disabledDate"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="modal-footer">
        <!-- isCreateModalVisible = false -->
        <el-button @click="isCreateModalVisible=false">{{ $t("cancel") }}</el-button>
        <el-button type="primary" @click="createPresent">{{
        $t("Create")
        }}</el-button>
      </div>
    </el-dialog>
    <!-- Edit Modal -->
    <el-dialog
      :title="$t('edit_account')"
      v-model="isUpdateModalVisible"
      width="70vw"
      @close="closeEditModal"
    >
      <el-form :model="editPresent" label-width="auto">
        <el-form-item :label="$t('present_name')" required>
          <el-select
            v-model="editPresent.PS_ID"
            :placeholder="$t('select_present')"
            clearable
            disabled
          >
          
            <el-option
              v-for="data in dataGift"
              :key="data.PS_ID"
              :label="getPresentName(data)"
              :value="data.PS_ID"
            />
          </el-select>
        </el-form-item>
 
        <el-form-item :label="$t('branch_Name')" required>
          <el-select
            v-model="editPresent.BRN_CODE"
            disabled
          >
            <el-option
              v-for="branch in dataBranch"
              :key="branch.BRN_CODE"
              :label="branch.BRN_NAME"
              :value="branch.BRN_CODE"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('cif_no')" required>
          <el-input
            v-model="editPresent.CIF_NO"
            type="text"
            @input="validateNumberCifE"
            disabled
          />
        </el-form-item>
        <el-form-item :label="$t('account_name')" required>
          <el-input v-model="editPresent.ACCOUNT_NAME" type="text" disabled/>
        </el-form-item>
        <el-form-item :label="$t('account_no')" required>
          <el-input
            v-model="editPresent.ACCOUNT_NO"
            type="text"
            @input="validateNumberE"
            disabled
          />
        </el-form-item>

        <el-form-item :label="$t('balance')" required>
          <el-input
            v-model="editPresent.BALANCE"
            type="text"
            @input="validateNumberBalE"
          />
        </el-form-item>
        <!-- date_end -->
        <el-form-item :label="$t('deposit_end')" required>
 
          <el-input
            v-model="editPresent.DEPOSIT_END"
            type="text"
            @input="validateNumberDepE"
          />
        </el-form-item>
        <!-- desc -->
        <el-form-item :label="$t('desc')">
          <el-input v-model="editPresent.DES" type="text" />
        </el-form-item>

        <!-- date_open -->
        <el-form-item :label="$t('date_open')" required>
          <el-date-picker
            v-model="editPresent.DATE_OPEN"
            type="date"
            :placeholder="$t('date_open')"
            :disabled-date="disabledDate"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="modal-footer">
      
        <el-button @click="closeEditModal">{{ $t("cancel") }}</el-button>
        <el-button type="primary" @click="saveEditPresent">{{
        $t("Update")
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script setup>
import { Delete, Check, Loading, EditPen ,CloseBold} from "@element-plus/icons-vue";
import useUser from "./user";

const {
  Position,
  accountData,
  fullscreenLoading,
  searchTerm,
  currentPage,
  pageSize,
  withdrawDialogVisible,
  editPresent,
  dataGift,
  dataBranch,
  selectedBalanceRange,
  dataStock,
  presentName,
  newPresent,
  profile,
  isCreateModalVisible,
  formatCurrency,
  getPresentName,
  getBranchList,
  loadPresent,
  loadData,
  filteredData,
  paginatedData,
  handlePageChange,
  handleSizeChange,
  getStock,
  selectedDateRange,
  openCreateModal,
  resetNewPresent,
  validateNumber,
  createPresent,
  validateNumberBal,
  validateNumberCif,
  dataStatus,
  getStatus,
  statusName,
  disabledDate,
  disabledDateEnd,
  removeClient,
  validateNumberDep,
  filteredGiftsDer,
  openEditDialog,
  isUpdateModalVisible,
  saveEditPresent,
  closeEditModal,
  filteredGifts,
  validateNumberE,
    validateNumberBalE,
    validateNumberCifE,
    validateNumberDepE,
} = useUser();
</script>

<style scoped>
.account-name {
  color: #409eff;
}

.balance {
  font-family: Courier;
  font-weight: bold;
}

.present-name {
  color: #606266;
}
::v-deep .el-table__header-wrapper th {
  background-color: #dfdfdf;
  color: black;
}

.index-column {
  font-weight: bold;
}
.search-label {
  display: inline-block; /* Ensures proper alignment */
  font-size: 0.8rem;
}

.pagination-bar {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.search-bar {
  display: flex;
  gap: 10px; /* Space between the elements */
  justify-content: space-between;
  margin-bottom: 20px;
}
.flex-con {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.search-input,
.balance-filter,
.present-dropdown {
  min-width: 250px;
}
@media (max-width: 768px) {
  .search-bar {
    flex-direction: column;
    align-items: flex-start;
  }

  .flex-con {
    flex-direction: column;
    width: 100%;
  }

  .search-input,
  .balance-filter,
  .present-dropdown,
  .el-date-picker {
    width: 100%; /* Make the inputs full-width on small screens */
  }

  .el-button {
    width: 100%; /* Make the button full-width on small screens */
  }
}
.modal-footer {
  display: flex;
  justify-content: flex-end; /* Aligns the buttons to the right */
  gap: 10px; /* Adds spacing between the buttons */
}
</style>
