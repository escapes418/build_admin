<template>
  <layout navActive="finance">
    <div class="layout-content-list recharge-list">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>交易管理</el-breadcrumb-item>
        <el-breadcrumb-item>数据维护</el-breadcrumb-item>
      </el-breadcrumb>

      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">申请时间</span>
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
          <span class="item-label">订单编号</span>
          <el-input
            v-model.trim="tableOptions.orderId"
            :maxlength="50"
            clearable
            placeholder="请输入订单编号"
            @keyup.enter.native="handleSearch"
          ></el-input>
        </div>

        <div class="toolbar-item">
          <span class="item-label">目标账户</span>
          <el-input
            v-model.trim="tableOptions.accNo"
            :maxlength="50"
            clearable
            placeholder="请输入目标账户"
            @keyup.enter.native="handleSearch"
          ></el-input>
        </div>

        <div class="toolbar-item">
          <span class="item-label">交易类型</span>
          <el-select v-model="tableOptions.maintainType" clearable placeholder="请选择交易类型" style="width:150px;">
            <div v-for="item in maintainTypeArr" :key="item.value">
              <el-option :label="item.label" :value="item.value"></el-option>
            </div>
          </el-select>
        </div>
        <div class="toolbar-item">
          <span class="item-label">审批状态</span>
          <el-select v-model="tableOptions.approveStatus" clearable placeholder="请选择审批状态" style="width:150px;">
            <div v-for="item in approveStatusArr" :key="item.value">
              <el-option :label="item.label" :value="item.value"></el-option>
            </div>
          </el-select>
        </div>

        <div class="toolbar-item">
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </div>
      </div>

      <el-table :data="tableData.list" border>
        <el-table-column label="订单编号" prop="orderId" min-width="160" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="font-default">{{ scope.row.orderId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="目标账户" prop="accNo" min-width="160" show-overflow-tooltip></el-table-column>
        <el-table-column label="审批状态" prop="approveStatus" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.approveStatus | dictFilter(approveStatusArr) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="银行名称" prop="bankName" min-width="140" show-overflow-tooltip></el-table-column>
        <el-table-column label="银行卡号" prop="bankNo" min-width="160" show-overflow-tooltip></el-table-column>
        <el-table-column label="申请时间" prop="createDate" min-width="140" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.createDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="初审时间" prop="firstApproveDate" min-width="140" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.firstApproveDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="审批时间" prop="finalApproveDate" min-width="140" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.finalApproveDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="第三方流水号" prop="flowCode" min-width="150" show-overflow-tooltip></el-table-column>
        <el-table-column label="绑定电话" prop="boundPhone" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column label="经办人" prop="handlePerson" min-width="60" show-overflow-tooltip></el-table-column>
        <el-table-column label="交易类型" prop="maintainType" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.maintainType | dictFilter(maintainTypeArr) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="交易金额" align="right" prop="transAmt" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.transAmt | thousands(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="交易描述" prop="maintainDesc" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column label="企业名称" prop="realName" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column label="复核人" prop="approvePerson" min-width="60" show-overflow-tooltip></el-table-column>
        <el-table-column label="用户类型" prop="userType" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column label="备注" prop="remark" min-width="100" show-overflow-tooltip></el-table-column>
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
        accNo: '', //目标账户
        approveStatus: '', //审批状态
        maintainType: '', // 交易类型 ,
        orderId: '', //订单id ,
        quyBeginTime: '',
        quyEndTime: ''
      },
      toolexpand: false, //展开-收起
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      createTimeRange: [],
      tableData: {},
      maintainTypeArr: [], //交易状态字典
      approveStatusArr: [] //审批状态字典
    };
  },
  async created() {
    const dict = await utils.getSysDict();
    this.approveStatusArr = dict.fin_order_mnt_status; //审批状态
    this.maintainTypeArr = dict.fin_maintain_type; //交易状态

    this.handleSearch();
  },
  methods: {
    // 选择时间范围回调
    onDateChange(val, type) {
      if (val && val.length > 0) {
        this.tableOptions.quyBeginTime = val[0];
        this.tableOptions.quyEndTime = val[1];
      } else {
        this.tableOptions.quyBeginTime = '';
        this.tableOptions.quyEndTime = '';
      }
    },
    handleReset() {
      this.tableOptions = {
        accNo: '', //目标账户
        approveStatus: '', //审批状态 ,
        maintainType: '', // 交易类型 ,
        orderId: '', //订单id ,
        quyBeginTime: '',
        quyEndTime: ''
      };
      this.createTimeRange = [];
      this.handleSearch();
    },
    async fetchData(opts) {
      const options = { page: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let res = await axios.post(api.queryMaintainApprove, options);
      this.tableData = res.data;
    }
  },
  filters: {
    dictFilter: (value, arr) => {
      let item = arr.filter(el => el.value.toString() === value.toString());
      item = item[0] || {};
      return item.label || '';
    }
  }
};
</script>
