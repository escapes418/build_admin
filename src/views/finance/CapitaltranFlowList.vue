<template>
  <layout navActive="finance">
    <div class="layout-content-list">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>资金明细</el-breadcrumb-item>
        <el-breadcrumb-item>交易流水</el-breadcrumb-item>
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
          <span class="item-label">支付流水号</span>
          <el-input
            v-model.trim="tableOptions.gatewayFlowCode"
            :maxlength="50"
            clearable
            placeholder="支付流水号"
            @keyup.enter.native="handleSearch"
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">金融订单编号</span>
          <el-input
            v-model.trim="tableOptions.transBatchNo"
            :maxlength="50"
            clearable
            placeholder="订单编号"
            @keyup.enter.native="handleSearch"
          ></el-input>
        </div>
        <div class="toolbar-item">
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </div>
        <el-collapse-transition>
          <div v-show="toolexpand">
            <div class="toolbar-item">
              <span class="item-label">第三方流水号</span>
              <el-input
                v-model.trim="tableOptions.thirdCode"
                :maxlength="50"
                clearable
                placeholder="第三方流水号"
                @keyup.enter.native="handleSearch"
              ></el-input>
            </div>
            <!-- 交易用途 -->
            <div class="toolbar-item">
              <span class="item-label">交易用途</span>
              <el-select
                v-model="tableOptions.businessType"
                clearable
                placeholder="请选择"
                style="width:120px;"
              >
                <div v-for="item in transUseageArr" :key="item.value">
                  <el-option :label="item.label" :value="item.value"></el-option>
                </div>
              </el-select>
            </div>
            <!-- 交易类型 -->
            <div class="toolbar-item">
              <span class="item-label">交易类型</span>
              <el-select
                v-model="tableOptions.transType"
                clearable
                placeholder="请选择"
                style="width:120px;"
              >
                <div v-for="item in txTypeArr" :key="item.value">
                  <el-option :label="item.label" :value="item.value"></el-option>
                </div>
              </el-select>
            </div>
            <!-- 交易状态 -->
            <div class="toolbar-item">
              <span class="item-label">交易状态</span>
              <el-select
                v-model="tableOptions.transStatus"
                clearable
                placeholder="请选择"
                style="width:120px;"
              >
                <div v-for="item in txStatArr" :key="item.value">
                  <el-option :label="item.label" :value="item.value"></el-option>
                </div>
              </el-select>
            </div>
            <div class="toolbar-item">
              <span class="item-label">付款方名称</span>
              <el-input
                v-model.trim="tableOptions.fromAccName"
                :maxlength="50"
                clearable
                placeholder="付款方名称"
                @keyup.enter.native="handleSearch"
              ></el-input>
            </div>
            <div class="toolbar-item">
              <span class="item-label">收款方名称</span>
              <el-input
                v-model.trim="tableOptions.toAccName"
                :maxlength="50"
                clearable
                placeholder="收款方名称"
                @keyup.enter.native="handleSearch"
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
        <el-table-column label="支付流水号" prop="gatewayFlowCode" min-width="180" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="onJumpCapitalFlowInfo(scope.row)">
              {{
              scope.row.gatewayFlowCode
              }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="金融订单编号" prop="transBatchNo" min-width="210" show-overflow-tooltip></el-table-column>
        <el-table-column label="第三方流水号" prop="thirdCode" min-width="160" show-overflow-tooltip></el-table-column>
        <el-table-column label="交易时间" prop="gmtCreated" min-width="140" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.gmtCreated | dateFormat('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="贸易结算单号" prop="businessNo" min-width="125" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="onJumpSettlementDetail(scope.row)"
              v-if="isBusinessNo(scope.row)"
            >
              {{
              scope.row.businessNo
              }}
            </el-button>
            <span v-else>
              {{
              scope.row.businessNo
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="交易金额(元)"
          prop="transAmt"
          align="right"
          min-width="110"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="font-orange">{{ scope.row.transAmt | thousands(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="交易用途" prop="businessType" min-width="90" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.businessType | valueToLabel(transUseageArr) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="交易类型" prop="transType" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.transType | valueToLabel(txTypeArr) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="交易状态" prop="transStatus" min-width="90" show-overflow-tooltip>
          <!-- 交易失败 初始化状态可能会有失败原因 -->
          <template slot-scope="scope">
            <el-popover
              v-if="scope.row.transStatus === '2'"
              placement="top"
              width="250"
              popper-class="multiple-popover"
              trigger="hover"
            >
              <div class="multiple-popover-item">
                <span class="font-orange">失败时间：</span>
                <br>
                {{ scope.row.failedTime}}
              </div>
              <div class="multiple-popover-item">
                <span class="font-orange">失败原因：</span>
                <br>
                {{ scope.row.failedDesc }}
              </div>
              <span
                slot="reference"
                class="pointer font-red"
              >{{ scope.row.transStatus | valueToLabel(txStatArr) }}</span>
            </el-popover>
            <span v-else>{{ scope.row.transStatus | valueToLabel(txStatArr) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="transDesc" min-width="110" show-overflow-tooltip></el-table-column>
        <el-table-column label="付款方名称" prop="fromAccName" min-width="110" show-overflow-tooltip></el-table-column>
        <el-table-column label="收款方名称" prop="toAccName" min-width="110" show-overflow-tooltip></el-table-column>
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
  name: 'CapitaltranFlowList',
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
        createTimeStart: '',
        createTimeEnd: '',
        bankChlType: '',
        gatewayFlowCode: '',
        transBatchNo: '',
        thirdCode: '',
        businessType: '',
        transStatus: '',
        transType: '',
        fromAccName: '',
        toAccName: ''
      },
      sendOptions: {},
      tableData: {},
      //交易用途：1:采购货款  2:加工费   3:服务费  4:砂石材料费  5:水泥材料费  6:物流运输费  7:提现  8:银行手续费 9:业务服务费
      transUseageArr: [], //交易用途筛选项
      //交易类型:1支付2充值3提现4退款5转账6冻结7解冻8外部支付9托管支付
      txTypeArr: [], // 交易类型筛选项
      //交易明细状态:0初始化1交易成功2交易失败 ,
      txStatArr: [] //交易状态筛选项
    };
  },
  async created() {
    const dict = await utils.getSysDict();
    this.transUseageArr = dict.finance_trans_useage; // 交易用途筛选项
    this.txTypeArr = dict.trans_type; // 交易类型筛选项
    this.txStatArr = dict.trans_status; // 交易状态筛选项
    //初始化开始日期
    this.initDatetime();
    this.handleSearch();
  },
  // async activated() {
  //   const dict = await utils.getSysDict();

  //   this.bankChlTypeArr = dict.fin_chl_type; // 银行托管筛选项
  //   this.transUseageArr = dict.fin_trans_useage; // 交易用途筛选项
  //   this.txTypeArr = dict.fin_order_trans_type; // 交易类型筛选项
  //   this.txStatArr = dict.fin_flow_tx_stat; // 交易状态筛选项
  //   this.payMethodArr = dict.fin_pay_method; // 支付方式筛选项

  //   this.handleSearch();
  // },
  methods: {
    handleReset() {
      this.tableOptions = {
        createTimeStart: '',
        createTimeEnd: '',
        bankChlType: '',
        gatewayFlowCode: '',
        transBatchNo: '',
        // payMethod: '',
        // sjbTradeNo: '',
        thirdCode: '',
        businessType: '',
        transStatus: '',
        transType: '',
        fromAccName: '',
        toAccName: ''
      };
      this.initDatetime();
      this.handleSearch();
    },
    async fetchData(opts) {
      if (Array.isArray(this.createTimeRange) && this.createTimeRange[0] && this.createTimeRange[1]) {
        this.tableOptions.createTimeStart = this.createTimeRange[0];
        this.tableOptions.createTimeEnd = this.createTimeRange[1];
        const options = { page: this.page, pageSize: this.pageSize, ...this.tableOptions, ...opts };
        let result = await axios.post(api.queryTransFlowPage, options);
        this.tableData = result.data;
      } else {
        this.$message.error('请选择交易日期');
      }
    },
    onJumpCapitalFlowInfo(row) {
      if (row.gatewayFlowCode) {
        this.$router.push({
          path: `/capital/tranflow/detail/${row.gatewayFlowCode}`
        });
      } else {
        this.$message.error('该条明细没有支付流水详情');
        return;
      }
    },
    //跳转至结算单详情
    async onJumpSettlementDetail(row) {
      if (row.businessNo) {
        //获取贸易单ID
        let result = await axios.post(api.statementView, { settlementSn: row.businessNo });
        this.$router.push({
          path: `/settlement/detail/${result.data.id}`
        });
      } else {
        this.$message.error('该条明细没有结算单详情');
        return;
      }
    },
    initDatetime() {
      let date = new Date();
      this.tableOptions.createTimeStart = `${date.getFullYear()}-${date.getMonth() + 1}-01 00:00:00`;
      this.tableOptions.createTimeEnd = `${date.getFullYear()}-${date.getMonth() +
        1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
      this.createTimeRange = [this.tableOptions.createTimeStart, this.tableOptions.createTimeEnd];
    },
    //判断是否为贸易结算单号
    isBusinessNo(row) {
      let reg = new RegExp('^ST');
      return reg.test(row.businessNo);
    }
  }
};
</script>
