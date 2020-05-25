<template>
  <layout navActive="finance">
    <div class="layout-content-list">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>结算报表</el-breadcrumb-item>
        <el-breadcrumb-item>订单结算报表</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">订单确认时间</span>
          <el-date-picker
            v-model="confirmTimeRange"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="onDateChange"
            :picker-options="pickerOptions"
            type="datetimerange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          ></el-date-picker>
        </div>
        <div class="toolbar-item">
          <span class="item-label">供应链公司</span>
          <el-input
            v-model.trim="tableOptions.finCompanyName"
            :maxlength="50"
            clearable
            placeholder="请输入供应链公司"
            @keyup.enter.native="handleSearch"
          ></el-input>
        </div>

        <div class="toolbar-item">
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="primary" @click="onExportReport">导出表格</el-button>
        </div>
        <el-collapse-transition>
          <div v-show="toolexpand">
            <div class="toolbar-item">
              <span class="item-label">采购商</span>
              <el-input
                v-model.trim="tableOptions.orderCompanyName"
                :maxlength="50"
                clearable
                placeholder="请输入采购商"
                @keyup.enter.native="handleSearch"
              ></el-input>
            </div>

            <div class="toolbar-item">
              <span class="item-label">供应商</span>
              <el-input
                v-model.trim="tableOptions.supplierCompanyName"
                :maxlength="50"
                clearable
                placeholder="请输入供应商"
                @keyup.enter.native="handleSearch"
              ></el-input>
            </div>

            <div class="toolbar-item">
              <span class="item-label">订单状态</span>
              <el-select v-model="tableOptions.status" clearable placeholder="请选择订单状态" style="width:150px;">
                <div v-for="item in statusArr" :key="item.value">
                  <el-option :label="item.label" :value="item.value"></el-option>
                </div>
              </el-select>
            </div>

            <div class="toolbar-item">
              <span class="item-label">订单编号</span>
              <el-input
                v-model.trim="tableOptions.protocolOrderSn"
                :maxlength="50"
                clearable
                placeholder="请输入订单编号"
              ></el-input>
            </div>
            <div class="toolbar-item">
              <span class="item-label">合同编号</span>
              <el-input
                v-model.trim="tableOptions.protocolSn"
                :maxlength="50"
                clearable
                placeholder="请输入合同编号"
                @keyup.enter.native="handleSearch"
              ></el-input>
            </div>
          </div>
        </el-collapse-transition>
        <div class="toolmore-control mb-10">
          <div v-if="toolexpand" class="toolmore-control-btn" @click="toolexpand = false">
            <i class="el-icon-arrow-up"></i>
            <span class="">收起</span>
          </div>
          <div v-else class="toolmore-control-btn" @click="toolexpand = true">
            <i class="el-icon-arrow-down"></i>
            <span class="">展开</span>
          </div>
        </div>
      </div>
      <!-- :height="tableHeight" id="table" -->
      <el-table :data="tableData.list" border>
        <!-- 订单编号 -->
        <el-table-column label="订单编号" prop="protocolOrderSn" fixed min-width="110">
          <template slot-scope="scope">
            <span class="font-default">{{ scope.row.protocolOrderSn }}</span>
          </template>
        </el-table-column>
        <el-table-column label="合同编号" prop="protocolSn" min-width="110"></el-table-column>
        <el-table-column
          label="供应商"
          prop="supplierCompanyName"
          min-width="140"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="供应链公司"
          prop="finCompanyName"
          min-width="140"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="采购商" prop="orderCompanyName" min-width="140" show-overflow-tooltip></el-table-column>
        <el-table-column label="订单状态" prop="statusValue" min-width="110" show-overflow-tooltip> </el-table-column>
        <el-table-column label="订单确认时间" prop="confirmTime" min-width="140"> </el-table-column>
        <el-table-column label="货物单价(元/吨)" prop="taxUnitPrice" min-width="110">
          <template slot-scope="scope">
            <span>{{ scope.row.taxUnitPrice | thousands(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="要货数量(吨)" prop="number" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.number | toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="货款总金额(元)" prop="coalMoneyAmount" min-width="130">
          <template slot-scope="scope">
            <span>{{ scope.row.coalMoneyAmount | thousands(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="在途冻结数量(吨)" prop="nowSendGoods" min-width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.nowSendGoods | toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="在途冻结运费(元)" prop="nowFrozenPrice" min-width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.nowFrozenPrice | thousands(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="实发货款总额(元)" prop="payTotalSignSendGoodsAmount" min-width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.payTotalSignSendGoodsAmount | thousands(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="货款补款金额(元)" prop="supplementCoalMoneyAmount" min-width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.supplementCoalMoneyAmount | thousands(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="货款退款金额(元)" prop="refundCoalMoneyAmount" min-width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.refundCoalMoneyAmount | thousands(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="已支付货款剩余(元)" prop="surplusCoalMoneyAmount" min-width="130">
          <template slot-scope="scope">
            <span>{{ scope.row.surplusCoalMoneyAmount | thousands(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="实发数量(吨)" prop="totalSignSendGoods" min-width="90">
          <template slot-scope="scope">
            <span>{{ scope.row.totalSignSendGoods | toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="实收数量(吨)" prop="totalSignGoods" min-width="90">
          <template slot-scope="scope">
            <span>{{ scope.row.totalSignGoods | toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="实付运费" prop="payTotalFreightAmount" min-width="110">
          <template slot-scope="scope">
            <span>{{ scope.row.payTotalFreightAmount | thousands(2) }}</span>
          </template>
        </el-table-column>
        <!-- 实付总金额 -->
        <el-table-column label="实付总金额(元)" prop="realPayTotalAmount" min-width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.realPayTotalAmount | thousands(2) }}</span>
          </template>
        </el-table-column>
        <!-- 开票吨位 -->
        <el-table-column label="开票吨位(吨)" prop="billGoods" min-width="90">
          <template slot-scope="scope">
            <span>{{ scope.row.billGoods | toFixed(2) }}</span>
          </template>
        </el-table-column>
        <!-- 开票总金额 -->
        <el-table-column label="开票总金额(元)" prop="totalBillGoodsAmount" min-width="140">
          <template slot-scope="scope">
            <span>{{ scope.row.totalBillGoodsAmount | thousands(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="实付物流运费(元)" prop="payTotalSjbFreightAmount" min-width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.payTotalSjbFreightAmount | thousands(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="平台服务费(元)" prop="payTotalFinAmount" min-width="110">
          <template slot-scope="scope">
            <span>{{ scope.row.payTotalFinAmount | thousands(2) }}</span>
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
      toolexpand: false,
      tableOptions: {
        finCompanyName: '',
        orderCompanyName: '',
        supplierCompanyName: '',
        protocolOrderSn: '',
        protocolSn: '',
        status: '',
        startTime: '',
        endTime: ''
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      confirmTimeRange: [],
      tableData: {},
      statusArr: [] //状态字典
      // tableHeight: 100
    };
  },
  async created() {
    const dict = await utils.getSysDict();
    this.statusArr = await utils.getSysDict('trade_protocol_order_status'); // 状态字典
    this.sendOptions = { ...this.tableOptions };
    // this.onResetTableHeight();
    // this.handleSearch();
  },
  mounted() {
    // window.addEventListener('resize', this.onResetTableHeight);
  },
  methods: {
    // 选择时间范围回调
    onDateChange(val, type) {
      if (val && val.length > 0) {
        this.tableOptions.startTime = val[0];
        this.tableOptions.endTime = val[1];
      } else {
        this.tableOptions.startTime = '';
        this.tableOptions.endTime = '';
      }
    },
    handleReset() {
      this.tableOptions = {
        finCompanyName: '',
        orderCompanyName: '',
        supplierCompanyName: '',
        protocolOrderSn: '',
        protocolSn: '',
        status: '',
        startTime: '',
        endTime: ''
      };
      this.confirmTimeRange = [];
      this.handleSearch();
    },
    // 导出
    onExportReport() {
      const token = localStorage.getItem('Authorization');
      if (this.sendOptions.startTime === '' || this.sendOptions.endTime === '') {
        this.$message.error('请选择时间范围，再执行导出');
        return;
      }
      if (this.tableData.count === 0) {
        this.$message.error('未查询到数据');
        return;
      }
      let exportListUrl = api.selectProtocolOrderSettlementListExport + '?';
      exportListUrl += 'token=' + token;

      for (const filter in this.sendOptions) {
        if (this.sendOptions.hasOwnProperty(filter)) {
          exportListUrl += '&' + filter + '=' + this.sendOptions[filter];
        }
      }
      window.location.href = exportListUrl;
    },
    async fetchData(opts) {
      const options = { page: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let res = await axios.post(api.selectProtocolOrderSettlementList, options);
      this.tableData = res.data;
    }
    // onResetTableHeight() {
    //   this.$nextTick(() => {
    //     this.tableHeight = document.getElementById('table').offsetHeight;
    //   });
    // }
  }
};
</script>
