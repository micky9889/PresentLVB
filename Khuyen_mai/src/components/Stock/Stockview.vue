<template>
  <div
    v-loading.fullscreen.lock="fullscreenLoading"
    :element-loading-text="$t('loading')"
  >
    <!-- Search Input and Dropdown -->
    <div class="search-bar">
      <!-- Search Input -->
      <div style="display: flex; gap: 10px">
        <div style="display: flex; flex-direction: column; gap: 5px">
          <label for="search-input" class="search-label">{{
            $t("search_label")
          }}</label>
          <el-input
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
      </div>

      <!-- Create Button -->
      <div
        v-if="isAuthorized"
        style="
          display: flex;
          flex-direction: column;
          justify-content: end;
          gap: 5px;
        "
      >
        <el-button
          type="primary"
          @click="openCreateModal"
          class="create-button"
          >{{ $t("Create") }}</el-button
        >
      </div>
    </div>
    <!-- Presents Table -->
    <el-table :data="filteredData" height="600" style="width: 100%">
      <!-- no -->
      <el-table-column type="index" :label="$t('no')" width="60" align="center">
        <template #default="scope">
          <span class="index-column">{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('present_name')" align="center">
        <template #default="scope">
          <span class="present-name">
            {{ getPresentName(scope.row) }}
          </span>
        </template>
      </el-table-column>

      <el-table-column
        prop="BRN_CODE"
        :label="$t('branch_Code')"
        align="center"
      ></el-table-column>

      <el-table-column
        prop="BRN_NAME"
        :label="$t('branch_Name')"
      ></el-table-column>

      <el-table-column
        prop="QUANTITY"
        :label="$t('qtt')"
        align="center"
      ></el-table-column>

      <el-table-column :label="$t('Created_At')" align="center">
        <template #default="scope">
          {{ new Date(scope.row.CREATE_AT).toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column
        prop="EMP_NAME"
        :label="$t('giver')"
        align="center"
      ></el-table-column>
      <!-- action -->
      <el-table-column
        :label="$t('action')"
        align="center"
        v-if="isAuthorized"
      >
        <template #default="scope">
          <el-icon
            color="#409efc"
            class="edit_btn"
            :size="20"
            @click="openEditModal(scope.row)"
          >
            <Edit />
          </el-icon>
          <!-- <el-icon 
          style="margin-left: 20px;"
          color="red"
            class="edit_btn"
            :size="20"
            @click="removeRegister(scope.row)"><Delete /></el-icon> -->
        </template>
      </el-table-column>
    </el-table>

    <!-- Create Modal -->
    <el-dialog v-model="isCreateModalVisible" :title="$t('add_ps2branch')">
      <el-form :model="newPresent" label-width="auto">
        <el-form-item :label="$t('present_name')" required>
          <el-select
            v-model="newPresent.PS_ID"
            :placeholder="$t('select_present')"
            clearable
          >
            <el-option
              v-for="branch in dataGift"
              :key="branch.PS_ID"
              :label="getPresentName(branch)"
              :value="branch.PS_ID"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('qtt')" required>
          <el-input
            v-model="newPresent.QTT"
            type="text"
            :min="1"
            @input="validateNumber"
          />
        </el-form-item>
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
      </el-form>
      <div slot="footer" class="modal-footer">
        <el-button @click="isCreateModalVisible = false">{{
          $t("cancel")
        }}</el-button>
        <el-button type="primary" @click="createPresent">{{
          $t("Create")
        }}</el-button>
      </div>
    </el-dialog>
    <!-- edit dialog -->
    <el-dialog v-model="isEditModalVisible" :title="$t('add_qtt_ps')">
      <el-form :model="editPresent" label-width="auto">
        <el-form-item :label="$t('present_name')" required>
          <el-select v-model="editPresent.PS_ID" :disabled="true">
            <el-option
              v-for="branch in dataGift"
              :key="branch.PS_ID"
              :label="getPresentName(branch)"
              :value="branch.PS_ID"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('add_qtt')" required>
          <el-input
            v-model="editPresent.QUANTITY"
            type="text"
            @input="checkQuantityInput"
          />
        </el-form-item>
        <el-form-item :label="$t('branch_Name')" required>
          <el-select v-model="editPresent.BRN_CODE" :disabled="true">
            <el-option
              v-for="branch in dataBranch"
              :key="branch.BRN_CODE"
              :label="branch.BRN_NAME"
              :value="branch.BRN_CODE"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="modal-footer">
        <el-button @click="isEditModalVisible = false">{{
          $t("cancel")
        }}</el-button>
        <el-button type="primary" @click="saveEditPresent">{{
          $t("Update")
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { Delete } from "@element-plus/icons-vue";
import useStock from "./stock";
const {
  Edit,
  data,
  searchTerm,
  selectedBranch,
  profile,
  dataBranch,
  dataGift,
  newPresent,
  fullscreenLoading,
  isCreateModalVisible,
  isEditModalVisible,
  editPresent,
  loadData,
  createPresent,
  resetNewPresent,
  openCreateModal,
  filteredData,
  getBranchList,
  loadPresent,
  openEditModal,
  saveEditPresent,
  validateNumber,
  checkQuantityInput,
  getPresentName,
  removeRegister,
  isAuthorized,
} = useStock();
</script>

<style scoped>
.search-bar {
  display: flex;
  justify-content: space-between; /* Aligns child elements across the width */
  gap: 10px; /* Space between the elements */
  margin-bottom: 20px;
}

.search-input {
  flex: 1; /* Allows the input to take up available space */
  min-width: 200px; /* Minimum width for smaller screens */
}

.branch-dropdown {
  min-width: 150px; /* Minimum width for smaller screens */
  max-width: 200px; /* Prevents it from becoming too wide */
}

/* Styles for the Create Button */
.create-button {
  margin-left: 10px; /* Optional spacing */
}

.el-table th {
  background-color: #f0f0f0;
  font-weight: bold;
}

.el-table-column {
  text-align: center;
}

::v-deep .el-table__header-wrapper th {
  background-color: #dfdfdf;
  color: black;
}

/* Media Queries for Responsive Design */
@media (max-width: 768px) {
  .search-input {
    min-width: 30vw; /* Adjust for smaller screens */
  }

  .branch-dropdown {
    min-width: 120px; /* Adjust for smaller screens */
  }
}

@media (min-width: 769px) {
  .search-input {
    min-width: 30vw; /* Width for larger screens */
  }

  .branch-dropdown {
    min-width: 200px; /* Width for larger screens */
  }
}
.modal-footer {
  display: flex;
  justify-content: flex-end; /* Aligns the buttons to the right */
  gap: 10px; /* Adds spacing between the buttons */
}
.edit_btn:hover {
  transform: scale(1.2);
}
.search-label {
  display: inline-block;
  font-size: 0.8rem;
}
.index-column {
  font-weight: bold;
}
</style>
