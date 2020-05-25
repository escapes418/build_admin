<template>
  <layout navActive="mall">
    <div class="layout-content-list">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>交易管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">创建日期</span>
          <el-date-picker
            v-model="creatTimeRange"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="handleDateChange"
            :picker-options="pickerOptions"
            type="datetimerange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          ></el-date-picker>
        </div>
        <div class="toolbar-item">
          <span class="item-label">项目编号</span>
          <el-input
            v-model.trim="tableOptions.projectSn"
            :maxlength="50"
            clearable
            placeholder="请输入项目编号"
            @keyup.enter.native="handleSearch"
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">订单编号</span>
          <el-input
            v-model.trim="tableOptions.orderSn"
            :maxlength="50"
            clearable
            placeholder="请输入订单编号"
            @keyup.enter.native="handleSearch"
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">采购商名称</span>
          <el-input
            v-model.trim="tableOptions.purchaserName"
            :maxlength="50"
            clearable
            placeholder="请输入采购商名称"
            @keyup.enter.native="handleSearch"
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">加工商名称</span>
          <el-input
            v-model.trim="tableOptions.processorName"
            :maxlength="50"
            clearable
            placeholder="请输入加工商名称"
            @keyup.enter.native="handleSearch"
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">订单状态</span>
          <el-select
            v-model="tableOptions.orderStatus"
            size="small"
            clearable
            placeholder="请选择"
            style="width:120px;"
          >
            <el-option
              v-for="item in orderStatusArr"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="toolbar-item">
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </div>
      </div>
      <el-table :data="tableData.list" border>
        <el-table-column label="订单编号" prop="orderSn" min-width="130" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="font-default pointer" @click="onJumpDetail(scope.row)">{{ scope.row.orderSn }}</span>
          </template>
        </el-table-column>
        <el-table-column label="项目编号" prop="projectSn" min-width="110" show-overflow-tooltip> </el-table-column>
        <el-table-column label="订单状态" prop="orderStatus" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.orderStatus | valueToLabel(orderStatusArr) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建日期" prop="gmtCreate" min-width="140" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.gmtCreate | dateFormat('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="采购商名称" prop="purchaserName" min-width="120" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="加工商名称" prop="processorName" min-width="120" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="累计砼量(m³)" prop="totalNumber" min-width="90" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="font-orange">{{ scope.row.totalNumber | thousands }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" min-width="80">
          <template slot-scope="scope">
            <span class="font-default pointer" @click="onJumpDetail(scope.row)">详情</span>
            <span class="font-default pointer ml-10" @click="onJumpWaybillList(scope.row.orderSn)">查看运单</span>
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
  name: 'OrderList',
  mixins: [listMixin],
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      creatTimeRange: [],
      orderStatusArr: [],
      tableOptions: {
        orderSn: '', // 订单编号
        orderStatus: '', // 订单状态: 待确认UNCONFIRMED 待发货SENDABLE 发货中SENDING 完成配送FINISH 已取消CANCELED 已关闭CLOSED ,
        processorName: '', // 加工商名称
        projectSn: '', // 项目(合同)编号 ,
        purchaserName: '', // 采购商名称
        startTime: '',
        endTime: ''
      },
      sendOptions: {},
      tableData: {}
    };
  },
  created() {},
  async activated() {
    // this.tableOptions.protocolSn = this.$route.params.protocolSn || '';
    this.orderStatusArr = await utils.getSysDict('order_status'); // 订单状态字典
    if (this.$route.name === 'OrderListSn') {
      this.tableOptions.projectSn = this.$route.params.projectSn;
    }
    this.handleSearch();
  },
  methods: {
    // 选择时间范围回调
    handleDateChange(val) {
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
        orderSn: '',
        orderStatus: '',
        processorName: '',
        projectSn: '',
        purchaserName: '',
        startTime: '',
        endTime: ''
      };
      this.creatTimeRange = [];
      this.handleSearch();
    },
    onJumpDetail(row) {
      this.$router.push({ path: '/order/detail/' + row.orderSn });
    },
    async fetchData(opts) {
      const options = { page: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let result = await axios.post(api.orderQueryList, options);
      this.tableData = result.data;
    },
    onJumpWaybillList(orderSn) {
      this.$router.push({ path: `/waybill/list/${orderSn}` });
    }
  }
};
</script>
