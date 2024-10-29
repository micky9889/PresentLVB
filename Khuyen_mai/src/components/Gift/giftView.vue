<template>
  <div
    v-loading.fullscreen.lock="fullscreenLoading"
    :element-loading-text="$t('loading')"
  >
    <div class="button-wrapper">
      <!-- Search Field -->
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

      <!-- Create Button -->
      <!-- <div
        style="
          display: flex;
          flex-direction: column;
          justify-content: end;
          gap: 5px;
        "
      >
        <el-button type="primary" @click="createPresent">
          {{ $t("Create") }}
        </el-button>
      </div> -->
    </div>
    <el-row :gutter="20">
      <el-col
        :sm="12"
        :md="8"
        :lg="8"
        v-for="(item, index) in filteredPresents"
        :key="index"
        class="card-column"
      >
        <!-- Beautifully styled card -->
        <el-card
          class="present-card"
          shadow="always"
          :body-style="{ padding: '20px' }"
          @click="openEditDialog(item)"
        >
          <!-- Card Header -->
          <div class="card-header">
            <h3
              class="present-title"
              style="color: var(--el-menu-active-color)"
            >
              {{ presentName(item) }}
            </h3>
          </div>

          <!-- Card Body -->
          <div class="card-body">
            <p>
              <strong>{{ $t("Created_At") }}:</strong>
              {{ new Date(item.CREATE_AT).toLocaleString() }}
            </p>
            <!-- <p>
              <strong>{{ $t("total") }}:</strong> {{ item.TOTAL || 0 }}
            </p> -->
            <p>
              <strong>{{ $t("condition") }}:</strong> {{ conditionName(item) }}
            </p>
          </div>

          <!-- <el-divider /> -->

          <!-- Table of Branches inside the card -->
          <!-- <el-table :data="item.branch" style="width: 100%; height: 200px">
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
              prop="TOTAL"
              :label="$t('total')"
              align="center"
            ></el-table-column>
          </el-table> -->
        </el-card>
      </el-col>
    </el-row>

    <!-- Dialog for Create Present -->
    <el-dialog
      :title="isEditMode ? $t('edit_title') : $t('create_title')"
      v-model="isDialogVisible"
      @close="resetForm"
    >
      <el-form :model="form" ref="formRef" label-width="auto">
        <!-- ID input -->
        <el-form-item v-if="isEditMode" :label="$t('present_id')" prop="PS_ID">
          <el-input v-model="form.PS_ID" disabled></el-input>
        </el-form-item>
        <!-- present la -->
        <el-form-item
          :label="$t('present_name_la')"
          prop="PRESENT_LA"
          :rules="[
            {
              required: true,
              message: $t('validate_name_present'),
              trigger: 'blur',
            },
          ]"
        >
          <el-input v-model="form.PRESENT_LA"></el-input>
        </el-form-item>
        <!-- present en -->
        <el-form-item
          :label="$t('present_name_en')"
          prop="PRESENT_EN"
          :rules="[
            {
              required: true,
              message: $t('validate_name_present'),
              trigger: 'blur',
            },
          ]"
        >
          <el-input v-model="form.PRESENT_EN"></el-input>
        </el-form-item>
        <!-- present vn -->
        <el-form-item
          :label="$t('present_name_vn')"
          prop="PRESENT_VN"
          :rules="[
            {
              required: true,
              message: $t('validate_name_present'),
              trigger: 'blur',
            },
          ]"
        >
          <el-input v-model="form.PRESENT_VN"></el-input>
        </el-form-item>
        <!-- condition -->
        <el-form-item
          :label="$t('condition')"
          prop="PCT_ID"
          :rules="[
            {
              required: true,
              message: $t('validate_condition'),
              trigger: 'change',
            },
          ]"
        >
          <el-select
            v-model="form.PCT_ID"
            :placeholder="$t('select_condition')"
            clearable
          >
            <el-option
              v-for="condition in dataCondition"
              :key="condition.PCT_ID"
              :label="conditionName(condition)"
              :value="condition.PCT_ID"
            />
          </el-select>
        </el-form-item>
        <!--  -->
        <div slot="footer" class="modal-footer">
          <el-button @click="resetForm">{{ $t("cancel") }}</el-button>
          <el-button type="primary" @click="submitForm">{{
            isEditMode ? $t("Update") : $t("Create")
          }}</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import usePresent from "./gift";

const {
  fullscreenLoading,
  data,
  isDialogVisible,
  form,
  formRef,
  isEditMode,
  searchTerm,
  loadPresent,
  openEditDialog,
  createPresent,
  resetForm,
  submitForm,
  filteredPresents,
  presentName,
  conditionName,
  dataCondition,
} = usePresent(); // Adjust the path if necessary

</script>

<style scoped>
.card-column {
  margin-bottom: 20px; /* Add margin bottom to each card */
}

.present-card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  max-height: 300px;
  overflow: auto;
  -ms-overflow-style: none;  /* For Internet Explorer 10+ */
  scrollbar-width: none;
}
@media (max-width: 768px) {
  .present-card {
    max-height: 200px; 
  }
}
.present-card:hover {
  box-shadow: 0 8px 25px rgba(1, 99, 152, 0.3);
  transform: translateY(-5px);
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.present-title {
  margin-left: 10px;
  font-weight: bold;
  font-size: 18px;
  color: #3f3f3f;
  text-align: center; /* Center the text */
  flex-grow: 1;
}

.card-body p {
  margin: 5px 0;
  color: #555;
}

.el-divider {
  margin: 15px 0;
}

.el-table {
  border-radius: 10px;
  overflow: hidden;
}

.el-table th,
.el-table td {
  color: #333;
  font-size: 14px;
}

.el-table-column {
  text-align: left;
}

.el-table th {
  background-color: #f0f0f0;
  color: #333;
}
.button-wrapper {
  display: flex;
  justify-content: space-between; /* Align items to the right */
  gap: 10px; /* Space between input and button */
  margin-bottom: 10px; /* Spacing below the button and input */
}

.search-input {
  margin-right: 10px; /* Optional spacing on the right */
  width: 50vw;
}

@media (max-width: 768px) {
  .search-input {
    width: 50vw; /* Increase input width to 70% of the viewport */
  }
}

@media (max-width: 480px) {
  .search-input {
    width: 80vw; /* Increase input width to 90% of the viewport */
  }
}
.modal-footer {
  display: flex;
  justify-content: flex-end; /* Aligns the buttons to the right */
  gap: 10px; /* Adds spacing between the buttons */
}
.search-label {
  display: inline-block;
  font-size: 0.8rem;
}
</style>
