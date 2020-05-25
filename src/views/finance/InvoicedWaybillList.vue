<template>
  <layout navActive="finance">
    <div class="layout-content-list">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>发票管理</el-breadcrumb-item>
        <el-breadcrumb-item>待开票运单</el-breadcrumb-item>
      </el-breadcrumb>

      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">收货时间</span>
          <el-date-picker
            v-model="createTimeRange"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="onDateChange"
            :picker-options="pickerOptions"
            type="datetimerange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          ></el-date-picker>
        </div>
        <div class="toolbar-item">
          <span class="item-label">合同编号</span>
          <el-input
            v-model.trim="tableOptions.protocolSn"
            @keyup.enter.native="handleSearch"
            :maxlength="50"
            clearable
            placeholder="请输入合同编号"
          ></el-input>
        </div>

        <div class="toolbar-item">
          <span class="item-label">采购商名称</span>
          <el-input
            v-model.trim="tableOptions.orderCompanyName"
            @keyup.enter.native="handleSearch"
            :maxlength="50"
            clearable
            placeholder="请输入采购商名称"
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">供应链公司</span>
          <el-input
            v-model.trim="tableOptions.finCompanyName"
            @keyup.enter.native="handleSearch"
            :maxlength="50"
            clearable
            placeholder="请输入供应链公司"
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">开票状态</span>
          <el-select v-model="tableOptions.status" clearable placeholder="请选择开票状态" style="width:200px;">
            <div v-for="item in statusArr" :key="item.value">
              <el-option :label="item.label" :value="item.value"></el-option>
            </div>
          </el-select>
        </div>
        <div class="toolbar-item">
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="primary" @click="onExportInvoicedData">导出</el-button>
          <el-button type="primary" @click="onSyncData">数据同步</el-button>
        </div>
      </div>

      <el-table :data="tableData.list" border>
        <el-table-column label="待开票运单ID" prop="taxWaybillId" min-width="100" fixed show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="font-default">{{ scope.row.taxWaybillId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="运单号" prop="sjbId" min-width="160" fixed show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="">{{ scope.row.sjbId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单号" prop="protocolOrderSn" min-width="160" show-overflow-tooltip></el-table-column>
        <el-table-column label="合同编号" prop="protocolSn" min-width="160" show-overflow-tooltip></el-table-column>
        <el-table-column label="开票状态" prop="statusValue" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column
          label="采购商名称"
          prop="orderCompanyName"
          min-width="160"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="供应商名称"
          prop="supplierCompanyName"
          min-width="160"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="供应链公司"
          prop="finCompanyName"
          min-width="160"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="收购点" prop="coalmineName" min-width="160" show-overflow-tooltip></el-table-column>
        <el-table-column label="发货地" prop="sourceAddress" min-width="160" show-overflow-tooltip></el-table-column>
        <el-table-column label="目的地" prop="targetAddress" min-width="160" show-overflow-tooltip></el-table-column>
        <el-table-column label="装车时间" prop="sourceSignTime" min-width="140" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.sourceSignTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="发货时间" prop="sjbSendTime" min-width="140" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.sjbSendTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="收货时间" prop="signTime" min-width="140" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.signTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="车牌号" prop="plateNumber" min-width="160" show-overflow-tooltip></el-table-column>
        <el-table-column label="资源名称" prop="goodsName" min-width="160" show-overflow-tooltip></el-table-column>
        <el-table-column
          label="支付方式"
          prop="deliveryPayType"
          min-width="160"
          show-overflow-tooltip
        ></el-table-column>
        <!-- <el-table-column
        label="矿发煤价(元/吨)"
        align="right"
        prop="goodsMinePrice"
        min-width="120"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>{{ scope.row.goodsMinePrice | thousands(2) }}</span>
        </template>
      </el-table-column> -->
        <el-table-column label="价格(元/吨)" align="right" prop="protocolPrice" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.protocolPrice | thousands(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="运费(元/吨)" align="right" prop="freightPrice" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.freightPrice | thousands(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="物流运费(元/吨)"
          align="right"
          prop="transportSettlementPrice"
          min-width="120"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{ scope.row.transportSettlementPrice | thousands(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="运费优惠价点数" align="right" prop="taxRate" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.taxRate | thousands(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="实发(吨)" prop="sendCount" min-width="160" show-overflow-tooltip></el-table-column>
        <el-table-column label="实收(吨)" prop="receiveCount" min-width="160" show-overflow-tooltip></el-table-column>
        <el-table-column
          label="亏吨退款(元)"
          align="right"
          prop="unitDuctLossPrice"
          min-width="120"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{ scope.row.unitDuctLossPrice | thousands(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="实收金额(元)" align="right" prop="paymentPrice" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.paymentPrice | thousands(2) }}</span>
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
        signTimeEnd: '', //查询收货结束时间
        signTimeStart: '', //查询收货开始时间
        status: '', // 开票状态
        finCompanyName: '', // 供应链企业名称
        orderCompanyName: '', // 采购方
        protocolSn: '' // 协议单号
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      createTimeRange: [],
      tableData: {},
      statusArr: [], //业务状态字典
      maxExportCount: 2000 // 单次导出数据上限2000
    };
  },
  async created() {
    const dict = await utils.getSysDict();
    this.statusArr = dict.tax_waybill_status; //业务状态
    // 默认选择“待开票”状态
    let item = this.statusArr.filter(el => el.label === '待开票');
    item = item[0] || {};
    this.tableOptions.status = item.value || '';
    this.handleSearch();
  },
  methods: {
    // 选择时间范围回调
    onDateChange(val, type) {
      if (val && val.length > 0) {
        this.tableOptions.signTimeStart = val[0];
        this.tableOptions.signTimeEnd = val[1];
      } else {
        this.tableOptions.signTimeStart = '';
        this.tableOptions.signTimeEnd = '';
      }
    },
    handleReset() {
      this.tableOptions = {
        signTimeEnd: '', //查询收货结束时间
        signTimeStart: '', //查询收货开始时间
        status: '', // 开票状态
        finCompanyName: '', // 供应链企业名称
        orderCompanyName: '', // 采购方
        protocolSn: '' // 协议单号
      };
      this.createTimeRange = [];
      this.handleSearch();
    },
    async fetchData(opts) {
      const options = { page: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      const res = await axios.post(api.pendingTaxProtocol, options);
      this.tableData = res.data;
    },
    onExportInvoicedData() {
      if (!this.tableData.count) {
        this.$message.error('未查询到数据');
        return;
      }
      // 最多只允许导出2000条数据
      if (this.tableData.count && this.tableData.count > this.maxExportCount) {
        this.$message.error(`单次数据导出上限为${this.maxExportCount}条`);
        return;
      }
      const token = localStorage.getItem('Authorization');
      let exportListUrl = api.pendingTaxProtocolExcel + '?page=-1&pageSize=-1&token=' + token;
      for (const filter in this.sendOptions) {
        if (this.sendOptions.hasOwnProperty(filter)) {
          exportListUrl += '&' + filter + '=' + this.sendOptions[filter];
        }
      }
      window.location.href = exportListUrl;
    },
    async onSyncData() {
      await axios.get(api.sysTaxWaybill);
      this.$message.success('数据同步成功');
    }
  }
};
</script>
