<template>
  <layout navActive="finance">
    <div class="layout-content-list withdraw-list">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>交易管理</el-breadcrumb-item>
        <el-breadcrumb-item>提现管理</el-breadcrumb-item>
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
          <span class="item-label">订单编号</span>
          <el-input
            v-model.trim="tableOptions.businessNo"
            :maxlength="50"
            clearable
            placeholder="请输入订单编号"
            @keyup.enter.native="handleSearch"
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">支付流水号</span>
          <el-input
            v-model.trim="tableOptions.recordNo"
            :maxlength="50"
            clearable
            placeholder="请输入支付流水号"
            @keyup.enter.native="handleSearch"
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">交易状态</span>
          <el-select
            v-model="tableOptions.transStatus"
            clearable
            placeholder="请选择交易状态"
            style="width:150px;"
          >
            <div v-for="item in transStatusArr" :key="item.value">
              <el-option :label="item.label" :value="item.value"></el-option>
            </div>
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
                v-model.trim="tableOptions.fromAccNo"
                :maxlength="50"
                clearable
                placeholder="请输入账号"
                @keyup.enter.native="handleSearch"
              ></el-input>
            </div>
            <div class="toolbar-item">
              <span class="item-label">收款人姓名</span>
              <el-input
                v-model.trim="tableOptions.realName"
                :maxlength="50"
                clearable
                placeholder="请输入收款人姓名"
                @keyup.enter.native="handleSearch"
              ></el-input>
            </div>
            <div class="toolbar-item">
              <span class="item-label">银行账号</span>
              <el-input
                v-model.trim="tableOptions.bankNo"
                :maxlength="50"
                clearable
                placeholder="请输入银行账号"
                @keyup.enter.native="handleSearch"
              ></el-input>
            </div>
            <div class="toolbar-item">
              <span class="item-label">第三方流水号</span>
              <el-input
                v-model.trim="tableOptions.thirdCode"
                :maxlength="50"
                clearable
                placeholder="请输入第三方流水号"
                @keyup.enter.native="handleSearch"
              ></el-input>
            </div>
            <div class="toolbar-item">
              <span class="item-label">银行提现状态</span>
              <el-select
                v-model="tableOptions.thirdStatus"
                clearable
                placeholder="请选择提现状态"
                style="width:150px;"
              >
                <div v-for="item in withdrawStatArr" :key="item.value">
                  <el-option :label="item.label" :value="item.value"></el-option>
                </div>
              </el-select>
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
        <el-table-column label="订单编号" prop="businessNo" min-width="210" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="font-default">{{ scope.row.businessNo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="支付流水号" prop="recordNo" min-width="200" show-overflow-tooltip></el-table-column>
        <el-table-column label="交易时间" prop="gmtCreated" min-width="140" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.gmtCreated }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="交易金额"
          align="right"
          prop="txAmt"
          min-width="120"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{ scope.row.transAmt | thousands(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="交易状态" prop="transStatus" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.transStatus | valueToLabel(transStatusArr) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="银行名称" prop="bankName" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column label="银行账号" prop="bankNo" min-width="165" show-overflow-tooltip></el-table-column>
        <el-table-column label="银行提现状态" prop="thirdStatus" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.thirdStatus | valueToLabel(withdrawStatArr) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="账号" prop="fromAccNo" min-width="165" show-overflow-tooltip></el-table-column>
        <el-table-column label="收款人姓名" prop="realName" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column label="第三方流水号" prop="thirdCode" min-width="145" show-overflow-tooltip></el-table-column>
        <el-table-column label="备注" prop="remark" min-width="120" show-overflow-tooltip></el-table-column>
        <!-- <el-table-column label="操作" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="text" @click="onConfirm(scope.row)">确认</el-button>
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
import api from '@/api/finance.api';
import utils from '@/utils/utils';
import listMixin from '@/utils/listMixin';

export default {
  mixins: [listMixin],
  data() {
    return {
      tableOptions: {
        createTimeStart: '', // 交易开始日期 ,
        createTimeEnd: '', // 交易结束日期 ,
        businessNo: '', // 订单编号（来自交易流水表） ,
        recordNo: '', // 支付流水号 ,
        fromAccNo: '', // 账号
        realName: '', // 收款人姓名/用户姓名 ,
        bankNo: '', // 银行账号 ,
        thirdCode: '', // 第三方交易业务流水号 银行流水 ,
        transStatus: '', //交易状态,
        thirdStatus: '' //银行提现状态,
      },
      toolexpand: false, //展开-收起
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      createTimeRange: [],
      tableData: {},
      withdrawStatArr: [], //银行提现状态字典,
      transStatusArr: [] //交易状态
    };
  },
  async created() {
    const dict = await utils.getSysDict();
    this.transStatusArr = dict.payment_status; //交易状态
    this.withdrawStatArr = dict.withdraw_status; //银行提现状态
    this.initDatetime();
    this.handleSearch();
  },
  methods: {
    handleReset() {
      this.tableOptions = {
        createTimeStart: '', // 交易开始日期 ,
        createTimeEnd: '', // 交易结束日期 ,
        businessNo: '', // 订单编号（来自交易流水表） ,
        recordNo: '', // 支付流水号 ,
        fromAccNo: '', // 账号
        realName: '', // 收款人姓名/用户姓名 ,
        bankNo: '', // 银行账号 ,
        thirdCode: '', // 第三方交易业务流水号 银行流水 ,
        transStatus: '', //交易状态,
        thirdStatus: '' //银行提现状态,
      };
      this.createTimeRange = [];
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
        const options = { page: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
        let res = await axios.post(api.queryWithdrawalPage, options);
        this.tableData = res.data;
      } else {
        this.$message.error('请选择交易日期');
      }
    }
  }
};
</script>
