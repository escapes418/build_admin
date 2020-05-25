<template>
  <layout navActive="finance">
    <div class="layout-content-list">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>资金明细</el-breadcrumb-item>
        <el-breadcrumb-item>资金变动查询</el-breadcrumb-item>
      </el-breadcrumb>

      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">交易日期</span>
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
            v-model.trim="tableOptions.tradeNo"
            :maxlength="50"
            clearable
            placeholder="支付订单号"
            @keyup.enter.native="handleSearch"
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">交易名称</span>
          <el-select
            v-model.trim="tableOptions.typeDetail"
            :maxlength="50"
            clearable
            placeholder="交易名称"
            @keyup.enter.native="handleSearch"
          >
            <el-option
              v-for="typeDetail in typeDetailOptions"
              :key="typeDetail.value"
              :value="typeDetail.value"
              :label="typeDetail.label"
            ></el-option>
          </el-select>
        </div>
        <div class="toolbar-item">
          <span class="item-label">收支类型</span>
          <el-select
            v-model="tableOptions.changeType"
            clearable
            placeholder="请选择"
            style="width:120px;"
          >
            <el-option
              v-for="changeType in changeTypeOptions"
              :label="changeType.label"
              :value="changeType.value"
              :key="changeType.value"
            ></el-option>
          </el-select>
        </div>
        <div class="toolbar-item">
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </div>
        <el-collapse-transition>
          <div v-show="toolexpand">
            <div class="toolbar-item">
              <span class="item-label">账号</span>
              <el-input
                v-model.trim="tableOptions.accountNo"
                :maxlength="50"
                clearable
                placeholder="账号"
                @keyup.enter.native="handleSearch"
              ></el-input>
            </div>
            <div class="toolbar-item">
              <span class="item-label">账号名称</span>
              <el-input
                v-model.trim="tableOptions.accountName"
                @keyup.enter.native="handleSearch"
                :maxlength="50"
                clearable
                placeholder="账号名称"
              ></el-input>
            </div>
          </div>
        </el-collapse-transition>
      </div>
      <div class="toolmore-control mb-10">
        <div v-if="toolexpand" class="toolmore-control-btn" @click="toolexpand = false">
          <i class="el-icon-arrow-up"></i>
          <span class>收起</span>
        </div>
        <div v-else class="toolmore-control-btn" @click="toolexpand = true">
          <i class="el-icon-arrow-down"></i>
          <span class>展开</span>
        </div>
      </div>
      <el-table :data="tableData.list" border>
        <el-table-column label="金融订单编号" prop="tradeNo " min-width="180" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="font-default">{{ scope.row.tradeNo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="账号" prop="accountNo" min-width="160" show-overflow-tooltip></el-table-column>
        <el-table-column label="账号名称" prop="accountName" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column label="账户类型" prop="accountType" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.accountType | valueToLabel(accountTypeOptions) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="交易日期" prop="gmtCreated" width="140" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.gmtCreated | dateFormat('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="交易名称" prop="typeDetail" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.typeDetail | valueToLabel(typeDetailOptions) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="收支类型" prop="changeType " width="80" show-overflow-tooltip>
          <template slot-scope="scope">
            <span :class="scope.row.changeType === 1 ? 'font-green' : 'font-red'">
              {{
              scope.row.changeType === 1 ? '收入' : '支出'
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="冻结金额" prop="changeFreeze" width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="font-orange" v-if="scope.row.typeDetail === 5">
              {{
              scope.row.changeFreeze | thousands(2)
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="解冻金额" prop="changeFreeze" width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.typeDetail === 6">{{ scope.row.changeFreeze | thousands(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="交易前余额" prop="beforeAvialble" min-width="140" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.beforeAvialble | thousands(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="交易金额" prop="changeTotal" width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="font-orange">{{ scope.row.changeTotal | thousands(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="交易后余额" prop="afterAvialble" width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.afterAvialble | thousands(2) }}</span>
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
import listMixin from '@/utils/listMixin';
import utils from '@/utils/utils';

export default {
  name: 'CapitalDetailList',
  mixins: [listMixin],
  data() {
    return {
      toolexpand: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      //资金变动的交易名称 1:充值,2:提现,3:转账,4:支付,5:冻结,6:解冻
      typeDetailOptions: [],
      //收支类型：1:收入  2：支出
      changeTypeOptions: [],
      //账户类型 1:交易账户，2：托管账户，3：利润账户
      accountTypeOptions: [],
      createTimeRange: [],
      tableOptions: {
        accountName: '',
        accountNo: '',
        changeType: '',
        tradeNo: '',
        createTimeEnd: '',
        typeDetail: '',
        createTimeStart: ''
      },
      tableData: {}
    };
  },
  async created() {
    let dict = await utils.getSysDict();
    this.typeDetailOptions = dict.type_detail;
    this.changeTypeOptions = dict.change_type;
    this.accountTypeOptions = dict.account_type;
    this.initDatetime();
    this.handleSearch();
  },
  methods: {
    handleReset() {
      this.tableOptions = {
        accountName: '',
        accountNo: '',
        changeType: '',
        tradeNo: '',
        createTimeEnd: '',
        typeDetail: '',
        createTimeStart: ''
      };
      this.initDatetime();
      this.handleSearch();
    },
    initDatetime() {
      let date = new Date();
      this.tableOptions.createTimeStart = `${date.getFullYear()}-${date.getMonth() + 1}-01 00:00:00`;
      this.tableOptions.createTimeEnd = `${date.getFullYear()}-${date.getMonth() +
        1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
      this.createTimeRange = [this.tableOptions.createTimeStart, this.tableOptions.createTimeEnd];
    },
    async fetchData(opts) {
      if (Array.isArray(this.createTimeRange) && this.createTimeRange[0] && this.createTimeRange[1]) {
        this.tableOptions.createTimeStart = this.createTimeRange[0];
        this.tableOptions.createTimeEnd = this.createTimeRange[1];
        const options = { page: this.page, pageSize: this.pageSize, ...this.tableOptions, ...opts };
        let result = await axios.post(api.queryAccountChangePage, options);
        this.tableData = result.data;
      } else {
        this.$message.error('请选择日期');
      }
    }
  }
};
</script>
