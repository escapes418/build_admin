<template>
  <layout navActive="finance">
    <div class="layout-content-list">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>发票管理</el-breadcrumb-item>
        <el-breadcrumb-item>发票列表</el-breadcrumb-item>
      </el-breadcrumb>

      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">开票时间</span>
          <el-date-picker
            v-model="createTimeRange"
            value-format="yyyy-MM-dd"
            @change="onDateChange"
            :picker-options="pickerOptions"
            type="daterange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          ></el-date-picker>
        </div>
        <div class="toolbar-item">
          <span class="item-label">发票代码</span>
          <el-input
            v-model.trim="tableOptions.taxCode"
            @keyup.enter.native="handleSearch"
            :maxlength="50"
            clearable
            placeholder="请输入发票代码"
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">发票号码</span>
          <el-input
            v-model.trim="tableOptions.taxNumber"
            @keyup.enter.native="handleSearch"
            :maxlength="50"
            clearable
            placeholder="请输入发票号码"
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">开票抬头</span>
          <el-input
            v-model.trim="tableOptions.taxPayable"
            @keyup.enter.native="handleSearch"
            :maxlength="50"
            clearable
            placeholder="请输入开票抬头"
          ></el-input>
        </div>

        <div class="toolbar-item">
          <span class="item-label">开票单位</span>
          <el-input
            v-model.trim="tableOptions.taxCompany"
            @keyup.enter.native="handleSearch"
            :maxlength="50"
            clearable
            placeholder="请输入开票单位"
          ></el-input>
        </div>

        <div class="toolbar-item">
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </div>
      </div>

      <el-table :data="tableData.list" border>
        <el-table-column label="发票号码" prop="taxNumber" min-width="160" fixed show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="onShowInvoiceDetail(scope.row.taxApplyFlowId)">
              {{ scope.row.taxNumber }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="发票代码" prop="taxCode" min-width="160" show-overflow-tooltip></el-table-column>
        <el-table-column label="开票时间" prop="taxTicketTime" min-width="140" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.taxTicketTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="发票抬头" prop="taxPayable" min-width="160" show-overflow-tooltip></el-table-column>
        <el-table-column
          label="纳税人识别号"
          prop="socialCreditCode"
          min-width="160"
          show-overflow-tooltip
        ></el-table-column>

        <el-table-column label="开票金额(元)" align="right" prop="amount" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.amount | thousands(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="开票单位" prop="taxCompany" min-width="160" show-overflow-tooltip></el-table-column>

        <el-table-column label="操作" min-width="100" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="onShowInvoiceDetail(scope.row.taxApplyFlowId)">
              发票详情
            </el-button>
          </template>
        </el-table-column>
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
import api from '@/api/finance.api';
import utils from '@/utils/utils';
import listMixin from '@/utils/listMixin';

export default {
  mixins: [listMixin],
  data() {
    return {
      tableOptions: {
        taxCode: '', // 发票代码 ,
        taxCompany: '', // 开票单位  ,
        taxNumber: '', // 发票号码 ,
        taxPayable: '', // 发票抬头 ,
        endTime: '', // 开票结束时间 ,
        beginTime: '' // 开票开始时间 ,
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      createTimeRange: [],
      tableData: {}
    };
  },
  created() {
    this.handleSearch();
  },
  methods: {
    // 选择时间范围回调
    onDateChange(val, type) {
      if (val && val.length > 0) {
        this.tableOptions.beginTime = val[0];
        this.tableOptions.endTime = val[1];
      } else {
        this.tableOptions.beginTime = '';
        this.tableOptions.endTime = '';
      }
    },
    handleReset() {
      this.tableOptions = {
        taxCode: '', // 发票代码 ,
        taxCompany: '', // 开票单位  ,
        taxNumber: '', // 发票号码 ,
        taxPayable: '', // 发票抬头 ,
        endTime: '', // 开票结束时间 ,
        beginTime: '' // 开票开始时间 ,
      };
      this.createTimeRange = [];
      this.handleSearch();
    },
    async fetchData(opts) {
      const options = { page: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      const res = await axios.post(api.taxTicket, options);
      this.tableData = res.data;
    },
    onShowInvoiceDetail(id) {
      this.$router.push({
        path: `/invoice/detail/${id}`
      });
    }
  }
};
</script>
