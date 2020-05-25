<template>
  <layout navActive="finance">
    <div class="layout-content-list">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>结算报表</el-breadcrumb-item>
        <el-breadcrumb-item>运单结算报表</el-breadcrumb-item>
      </el-breadcrumb>

      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">签收时间</span>
          <el-date-picker
            v-model="signTimeRange"
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
              <span class="item-label">运单号</span>
              <el-input
                v-model.trim="tableOptions.sjbId"
                :maxlength="50"
                clearable
                placeholder="请输入运单号"
                @keyup.enter.native="handleSearch"
              ></el-input>
            </div>
            <div class="toolbar-item">
              <span class="item-label">订单编号</span>
              <el-input
                v-model.trim="tableOptions.protocolOrderSn"
                :maxlength="50"
                clearable
                placeholder="请输入订单编号"
                @keyup.enter.native="handleSearch"
              ></el-input>
            </div>
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
              <span class="item-label">合同编号</span>
              <el-input
                v-model.trim="tableOptions.protocolSn"
                :maxlength="50"
                clearable
                placeholder="请输入合同编号"
                @keyup.enter.native="handleSearch"
              ></el-input>
            </div>

            <div class="toolbar-item">
              <span class="item-label">接单时间</span>
              <el-date-picker
                v-model="orderTimeRange"
                value-format="yyyy-MM-dd HH:mm:ss"
                @change="onOrderDateChange"
                :picker-options="pickerOptions"
                type="datetimerange"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
              ></el-date-picker>
            </div>

            <!-- <div class="toolbar-item">
            <span class="item-label">运单状态</span>
            <el-select
              v-model="tableOptions.status"
              clearable
              placeholder="请选择订单状态"
              style="width:150px;"
            >
              <div v-for="item in statusArr" :key="item.value">
                <el-option :label="item.label" :value="item.value"></el-option>
              </div>
            </el-select>
          </div> -->
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
        <el-table-column label="运单号" prop="sjbId" min-width="150" fixed>
          <template slot-scope="scope">
            <span class="font-default">{{ scope.row.sjbId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单编号" prop="protocolOrderSn" min-width="110"> </el-table-column>
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
        <el-table-column label="接单时间" prop="sjbSendTime" min-width="140" show-overflow-tooltip></el-table-column>
        <!-- <el-table-column label="运单状态" prop="status" min-width="100" show-overflow-tooltip>
      </el-table-column> -->
        <el-table-column label="签收时间" prop="signTime" min-width="140"> </el-table-column>
        <el-table-column label="司机" prop="driverName" min-width="140"> </el-table-column>
        <el-table-column label="车牌号" prop="plateNumber" min-width="140"> </el-table-column>
        <el-table-column label="实发数量(吨)" prop="sendCount" min-width="90">
          <template slot-scope="scope">
            <span>{{ scope.row.sendCount | toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="货物单价(元)" prop="goodsPrice" min-width="110">
          <template slot-scope="scope">
            <span>{{ scope.row.goodsPrice | thousands(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="实发货款金额(元)" prop="totalGoodsAmount" min-width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.totalGoodsAmount | thousands(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="实收数量(吨)" prop="receiveCount" min-width="90">
          <template slot-scope="scope">
            <span>{{ scope.row.receiveCount | toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="运价单价(不含税)" prop="freightPrice" min-width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.freightPrice | thousands(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="运价优惠价点位" prop="taxRate" min-width="110">
          <template slot-scope="scope">
            <span>{{ scope.row.taxRate }}%</span>
          </template>
        </el-table-column>
        <el-table-column label="亏吨退款(元)" prop="unitDuctLossPrice" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.unitDuctLossPrice | thousands(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="运费结算公式" prop="" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.formulaTypeText }}</span>
          </template>
        </el-table-column>
        <el-table-column label="实付运费" prop="actualFreightAmount" min-width="110">
          <template slot-scope="scope">
            <span>{{ scope.row.actualFreightAmount | thousands(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="实付总金额" prop="totalAmount" min-width="110">
          <template slot-scope="scope">
            <span>{{ scope.row.totalAmount | thousands(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="开票吨位(吨)" prop="receiveCount" min-width="90">
          <template slot-scope="scope">
            <span>{{ scope.row.receiveCount | toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="实际开票金额(元)" prop="actualInvoiceAmount" min-width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.actualInvoiceAmount | thousands(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="实付物流运费(元)" prop="paymentSjbPrice" min-width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.paymentSjbPrice | thousands(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="平台服务费(元)" prop="serviceFee" min-width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.serviceFee | thousands(2) }}</span>
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
        finCompanyName: '',
        orderCompanyName: '',
        supplierCompanyName: '',
        status: '',
        startSignTime: '', // 签收时间
        endSignTime: '', // 签收时间
        sjbId: '',
        protocolOrderSn: '',
        sjbSendStartTime: '', //接单时间
        sjbSendEndTime: '', //接单时间
        protocolSn: ''
      },
      toolexpand: false, //展开-收起
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      signTimeRange: [], // 签收时间
      orderTimeRange: [], // 签收时间
      tableData: {},
      statusArr: [] //状态字典
      // tableHeight: 100
    };
  },
  async created() {
    this.statusArr = await utils.getSysDict('waybill_status'); // 状态字典
    this.sendOptions = { ...this.tableOptions };
    // this.onResetTableHeight();
    // this.handleSearch();
  },
  mounted() {
    // window.addEventListener('resize', this.onResetTableHeight);
  },
  methods: {
    // 选择时间范围回调（签收）
    onDateChange(val, type) {
      if (val && val.length > 0) {
        this.tableOptions.startSignTime = val[0];
        this.tableOptions.endSignTime = val[1];
      } else {
        this.tableOptions.startSignTime = '';
        this.tableOptions.endSignTime = '';
      }
    },
    // 选择时间范围回调（接单时间）
    onOrderDateChange(val, type) {
      if (val && val.length > 0) {
        this.tableOptions.sjbSendStartTime = val[0];
        this.tableOptions.sjbSendEndTime = val[1];
      } else {
        this.tableOptions.sjbSendStartTime = '';
        this.tableOptions.sjbSendEndTime = '';
      }
    },
    handleReset() {
      this.tableOptions = {
        finCompanyName: '',
        orderCompanyName: '',
        supplierCompanyName: '',
        status: '',
        startSignTime: '',
        endSignTime: '',
        sjbId: '',
        protocolOrderSn: '',
        sjbSendStartTime: '',
        sjbSendEndTime: '',
        protocolSn: ''
      };
      this.signTimeRange = [];
      this.orderTimeRange = [];
      this.handleSearch();
    },
    // 导出
    onExportReport() {
      const token = localStorage.getItem('Authorization');
      if (this.sendOptions.startSignTime === '' || this.sendOptions.endSignTime === '') {
        this.$message.error('请选择时间范围，再执行导出');
        return;
      }
      if (this.tableData.count === 0) {
        this.$message.error('未查询到数据');
        return;
      }
      let exportListUrl = api.wayBillListExport + '?';
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
      let res = await axios.post(api.queryProtocolWaybill, options);
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
