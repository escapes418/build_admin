<template>
  <layout navActive="mall">
    <div class="layout-content-list">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>预付款管理</el-breadcrumb-item>
        <el-breadcrumb-item>预付款列表</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">项目编号</span>
          <el-input
            v-model="tableOptions.projectSn"
            :maxlength="30"
            clearable
            placeholder="项目编号"
            @keyup.enter.native="handleSearch"
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">项目名称</span>
          <el-input
            v-model="tableOptions.projectName"
            :maxlength="80"
            clearable
            placeholder="项目名称"
            @keyup.enter.native="handleSearch"
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">贸易经纪人</span>
          <el-input
            v-model="tableOptions.tradeAgentName"
            :maxlength="80"
            clearable
            placeholder="贸易经纪人"
            @keyup.enter.native="handleSearch"
          ></el-input>
        </div>

        <div class="toolbar-item">
          <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </div>
      </div>

      <el-table :data="tableData.list" border>
        <el-table-column prop="projectSn" label="项目编号" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="font-default pointer" @click="onJumpPaymentRemaining(scope.row)">{{
              scope.row.projectSn
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="projectName" label="项目名称" min-width="100" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="purchaserName" label="采购商" min-width="100" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="supplierName" label="供应商" min-width="100" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="tradeAgentName" label="贸易经纪人" min-width="100" show-overflow-tooltip>
        </el-table-column>

        <el-table-column label="操作" min-width="100">
          <template slot-scope="scope">
            <span class="font-default pointer" @click="onJumpPaymentRemaining(scope.row)">详情</span>
            <span class="font-default pointer ml-10" @click="onAddPayment(scope.row.id)">新建预付款</span>
            <span class="font-default pointer ml-10" @click="onJumpPaymentFin(scope.row.projectSn)">金融订单</span>
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
import api from '@/api/mall.api';
import listMixin from '@/utils/listMixin';
import utils from '@/utils/utils';

export default {
  mixins: [listMixin],
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      createTimeRange: [],
      tableOptions: {
        proxyMode: 1, // 预付款项目列表专用字段
        statementMode: 0, // 预付款项目列表专用字段
        projectStatus: 'EFFECTED', // 预付款项目列表专用字段(已生效的项目)
        projectName: '', // 项目名称
        contractSn: '', // 签署项目编号 ,
        projectSn: '', //项目编号 ,
        purchaserName: '', // 采购商名称 ,
        startTime: '', // 创建时间-开始时间
        endTime: '' //创建时间-结束时间 ,
      },
      sendOptions: {},
      tableData: {},
      refundDialog: {
        visible: false,
        data: {}
      },
      statusArr: [
        {
          value: 0,
          label: '正常'
        },
        {
          value: 1,
          label: '退款中'
        }
      ] //
    };
  },
  created() {
    this.handleSearch();
  },
  methods: {
    onAddPayment(projectId = '') {
      this.$router.push({
        path: `/advance/payment/add/${projectId}`
      });
    },
    onJumpPaymentRemaining(row = {}) {
      this.$router.push({
        path: `/advance/payment/remaining/${row.projectSn}/${encodeURIComponent(row.projectName)}`
      });
    },
    onJumpPaymentFin(projectSn = '') {
      this.$router.push({
        query: { projectSn: projectSn },
        path: `/capital/order/list`
      });
    },

    handleReset() {
      this.tableOptions = {
        proxyMode: 1, // 预付款项目列表专用字段
        statementMode: 0, // 预付款项目列表专用字段
        projectStatus: 'EFFECTED', // 预付款项目列表专用字段(已生效的项目)
        projectName: '', // 项目名称
        contractSn: '', // 签署项目编号 ,
        projectSn: '', //项目编号 ,
        purchaserName: '', // 采购商名称 ,
        startTime: '', // 创建时间-开始时间
        endTime: '' //创建时间-结束时间 ,
      };

      this.handleSearch();
    },
    async fetchData(opts) {
      const options = { page: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let res = await axios.post(api.projectAdvance, options);
      this.tableData = res.data;
    }
  }
};
</script>
