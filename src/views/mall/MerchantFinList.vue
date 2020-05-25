<template>
  <layout navActive="mall">
    <div class="layout-content-list">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>供应链管理</el-breadcrumb-item>
        <el-breadcrumb-item>平台公司管理</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">企业编号</span>
          <el-input
            v-model.trim="tableOptions.companyCode"
            :maxlength="20"
            clearable
            placeholder="企业编号"
            @keyup.enter.native="handleSearch"
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">商户名称</span>
          <el-input
            v-model.trim="tableOptions.fullName"
            :maxlength="20"
            clearable
            placeholder="商户名称"
            @keyup.enter.native="handleSearch"
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">创建时间</span>
          <el-date-picker
            v-model="timeRange"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions"
            type="datetimerange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          ></el-date-picker>
        </div>
        <div class="toolbar-item">
          <span class="item-label">登录手机号</span>
          <el-input
            v-model.trim="tableOptions.loginAdminName"
            :maxlength="20"
            clearable
            placeholder="登录手机号"
            @keyup.enter.native="handleSearch"
          ></el-input>
        </div>
        <!-- <div class="toolbar-item">
          <span class="item-label">商户状态</span>
          <el-select v-model="tableOptions.status" clearable placeholder="请选择" style="width:120px;">
            <el-option
              v-for="item in companyStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>-->
        <div class="toolbar-item">
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="primary" @click="onAddChainAccount">新增</el-button>
        </div>
      </div>
      <el-table :data="tableData.list" border>
        <el-table-column label="企业编号" prop="companyCode" min-width="130" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="text" @click="onJumpDetail(scope.row)">{{ scope.row.companyCode }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="商户名称" prop="fullName" min-width="220" show-overflow-tooltip></el-table-column>
        <el-table-column label="创建时间" prop="createTime" min-width="140"></el-table-column>
        <el-table-column label="联系人" prop="contactPeople" min-width="110" show-overflow-tooltip></el-table-column>
        <el-table-column label="登录手机号" prop="loginAdminName" min-width="110" show-overflow-tooltip></el-table-column>
        <el-table-column label="商户类型" prop="companyTypeValue" min-width="110"></el-table-column>
        <!-- <el-table-column label="商户状态" min-width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.status" class="font-orange">已停用</span>
            <span v-else class="font-green">已启用</span>
          </template>
        </el-table-column>-->
      </el-table>
      <div class="pagination-fix">
        <el-pagination
          :page-size="pageSize"
          :current-page.sync="page"
          :total="tableData.count"
          @current-change="handleCurrentChange"
          layout="total, prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </div>
  </layout>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/mall.api';
import listMixin from '@/utils/listMixin';
import utils from '@/utils/utils';
import Validator from '@/utils/Validator';

export default {
  mixins: [listMixin],
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      companyStatusOptions: [],
      timeRange: [],
      tableOptions: {
        companyType: 'FIN',
        companyCode: '',
        fullName: '',
        loginAdminName: '',
        startTime: '',
        endTime: ''
        // status: ''
      },
      sendOptions: {},
      tableData: {}
    };
  },
  created() {
    // this.companyStatusOptions = await utils.getSysDict('company_status');
    this.handleSearch();
  },
  methods: {
    handleReset() {
      this.tableOptions = {
        companyType: 'FIN',
        companyCode: '',
        fullName: '',
        loginAdminName: '',
        // status: '',
        startTime: '',
        endTime: ''
      };
      this.timeRange = [];
      this.handleSearch();
    },
    onJumpDetail(row) {
      this.$router.push({ path: '/merchant/fin/detail/' + row.companyId });
    },
    async fetchData(opts) {
      if (Array.isArray(this.timeRange) && this.timeRange[0] && this.timeRange[1]) {
        this.tableOptions.startTime = this.timeRange[0];
        this.tableOptions.endTime = this.timeRange[1];
      } else {
        this.tableOptions.startTime = '';
        this.tableOptions.endTime = '';
      }
      const options = { page: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let result = await axios.post(api.companyListFin, options);
      this.tableData = result.data;
    },
    onAddChainAccount() {
      this.$router.push({ path: '/merchant/fin/add', query: { merchantType: 'FIN' } });
    }
  }
};
</script>
