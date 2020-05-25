<template>
  <layout navActive="mall">
    <div class="layout-content-list">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>交易管理</el-breadcrumb-item>
        <el-breadcrumb-item>项目管理</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">创建日期</span>
          <el-date-picker
            v-model="timeRange"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="onDateChange"
            :picker-options="pickerOptions"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </div>
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
          <span class="item-label">采购合同编号</span>
          <el-input
            v-model="tableOptions.contractSn"
            :maxlength="20"
            clearable
            placeholder="采购合同编号"
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
          <span class="item-label">采购商名称</span>
          <el-input
            v-model="tableOptions.purchaserName"
            :maxlength="12"
            clearable
            placeholder="采购商名称"
            @keyup.enter.native="handleSearch"
          ></el-input>
        </div>

        <div class="toolbar-item">
          <span class="item-label">项目状态</span>
          <el-select
            v-model="tableOptions.projectStatus"
            placeholder="请选择"
            clearable
            class="track-elselect"
          >
            <el-option
              v-for="item in statusArr"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="toolbar-item">
          <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="primary" size="small" @click="onJumpAdd">新增项目</el-button>
        </div>
      </div>

      <el-table :data="tableData.list" border>
        <el-table-column prop="projectSn" label="项目编号" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span
              class="font-default pointer"
              @click="onJumpDetail(scope.row.id)"
            >{{ scope.row.projectSn }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="contractSn" label="采购合同编号" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="projectName" label="项目名称" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="purchaserName" label="采购商" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="supplierName" label="供应商" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="processorName" label="加工商" min-width="100" show-overflow-tooltip></el-table-column>

        <el-table-column prop="gmtCreate" label="创建日期" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.gmtCreate | dateFormat('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="projectStatus" label="状态" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.projectStatus | valueToLabel(statusArr) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="80">
          <template slot-scope="scope">
            <span class="font-default pointer" @click="onJumpDetail(scope.row.id)">详情</span>
            <span
              class="font-default pointer ml-10"
              @click="onJumpOrderList(scope.row.projectSn)"
            >查看订单</span>
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
import utils from '@/utils/utils';
import listMixin from '@/utils/listMixin';

export default {
  name: 'ProjectList',
  mixins: [listMixin],
  data: function() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      timeRange: [],
      statusArr: [
        // {
        //   label: '初始化',
        //   value: 'INITIALIZE'
        // },
        // {
        //   label: '已生效',
        //   value: 'EFFECTED'
        // },
        // {
        //   label: '已完工',
        //   value: 'COMPLETED'
        // },
        // {
        //   label: '已终止',
        //   value: 'OVERED'
        // }
      ], // 项目状态
      // 工具栏筛选字段
      tableOptions: {
        projectName: '', // 项目名称
        contractSn: '', // 签署项目编号 ,
        projectSn: '', //项目编号 ,
        projectStatus: '', //项目状态 ,
        purchaserName: '', // 采购商名称 ,
        startTime: '', // 创建时间-开始时间
        endTime: '' //创建时间-结束时间 ,
      },
      // 发送请求实际字段
      sendOptions: {},
      tableData: {} // 表格数据
    };
  },
  created() {},
  async activated() {
    this.statusArr = await utils.getSysDict('project_status'); // 项目状态字典

    if (this.$route.name === 'ProjectListAdd') {
      this.tableOptions.contractSn = this.$route.params.contractSn;
    }
    this.handleSearch();
  },
  methods: {
    // 选择时间范围回调
    onDateChange(val) {
      if (val && val.length > 0) {
        this.tableOptions.startTime = val[0];
        this.tableOptions.endTime = val[1];
      } else {
        this.tableOptions.startTime = '';
        this.tableOptions.endTime = '';
      }
    },
    onJumpDetail(id) {
      this.$router.push({ path: `/project/detail/${id}` });
    },
    handleReset() {
      this.tableOptions = {
        projectName: '',
        contractSn: '',
        projectSn: '',
        projectStatus: '',
        purchaserName: '',
        startTime: '',
        endTime: ''
      };
      this.timeRange = [];
      this.handleSearch();
    },
    async fetchData(opts) {
      const options = { page: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let res = await axios.post(api.projectList, options);
      this.tableData = res.data;
    },
    onJumpAdd() {
      this.$router.push({ path: `/project/add` });
    },
    onJumpOrderList(projectSn) {
      this.$router.push({ path: `/order/list/${projectSn}` });
    }
  }
};
</script>
