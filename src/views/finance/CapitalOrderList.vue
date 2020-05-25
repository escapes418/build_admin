<template>
  <layout navActive="finance">
    <div class="layout-content-list">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>资金明细</el-breadcrumb-item>
        <el-breadcrumb-item>资金订单列表</el-breadcrumb-item>
      </el-breadcrumb>

      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">交易时间</span>
          <el-date-picker
            v-model="createTimeRange"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions"
            type="datetimerange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          ></el-date-picker>
        </div>
        <div class="toolbar-item">
          <span class="item-label">金融订单编号</span>
          <el-input
            v-model.trim="tableOptions.paymentSn"
            :maxlength="50"
            clearable
            placeholder="金融订单编号"
            @keyup.enter.native="handleSearch"
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">业务编号</span>
          <el-input
            v-model.trim="tableOptions.businessSn"
            :maxlength="50"
            clearable
            placeholder="业务编号"
            @keyup.enter.native="handleSearch"
          ></el-input>
        </div>
        <div class="toolbar-item">
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </div>
      </div>
      <el-table :data="tableData.list" border>
        <el-table-column label="金融订单编号" prop="orderNo" min-width="160" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="onJumpCapitalOrderInfo(scope.row)">
              {{
              scope.row.paymentSn
              }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="业务编号" prop="businessSn" min-width="110" show-overflow-tooltip></el-table-column>
        <el-table-column label="交易时间" prop="gmtCreate " min-width="140" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.gmtCreate | dateFormat('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="交易金额"
          align="right"
          prop="paymentPrice "
          min-width="120"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="font-orange">{{ scope.row.paymentPrice | thousands(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单备注" prop="paymentDesc" min-width="110" show-overflow-tooltip></el-table-column>
        <el-table-column
          label="付款方名称"
          prop="payerCompanyName"
          min-width="120"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="收款方名称"
          prop="payeeCompanyName"
          min-width="120"
          show-overflow-tooltip
        ></el-table-column>
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
  name: 'CapitalOrderList',
  mixins: [listMixin],
  data() {
    return {
      toolexpand: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      createTimeRange: [],
      tableOptions: {
        startTime: '',
        endTime: '',
        paymentSn: '',
        businessSn: ''
      },
      sendOptions: {},
      tableData: {}
    };
  },
  created() {
    this.tableOptions.businessSn = this.$route.query.projectSn ? this.$route.query.projectSn : '';
    this.initDatetime();
    this.handleSearch();
  },
  methods: {
    onJumpCapitalOrderInfo(row) {
      this.$router.push({
        path: `/capital/order/detail/${row.paymentSn}`
      });
    },
    handleReset() {
      this.tableOptions = {
        startTime: '',
        endTime: '',
        paymentSn: '',
        businessSn: '',
        paymentStatus: ''
      };
      this.initDatetime();
      this.handleSearch();
    },
    initDatetime() {
      let date = new Date();
      this.tableOptions.startTime = `${date.getFullYear()}-${date.getMonth() + 1}-01 00:00:00`;
      this.tableOptions.endTime = `${date.getFullYear()}-${date.getMonth() +
        1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
      this.createTimeRange = [this.tableOptions.startTime, this.tableOptions.endTime];
    },
    async fetchData(opts) {
      if (Array.isArray(this.createTimeRange) && this.createTimeRange[0] && this.createTimeRange[1]) {
        console.log(this.createTimeRange);
        this.tableOptions.startTime = this.createTimeRange[0];
        this.tableOptions.endTime = this.createTimeRange[1];
        const options = { page: this.page, pageSize: this.pageSize, ...this.tableOptions, ...opts };
        const result = await axios.post(api.queryPaymentPage, options);
        this.tableData = result.data;
      } else {
        this.$message.error('请选择交易日期');
      }
    }
  }
};
</script>
