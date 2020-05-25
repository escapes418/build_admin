<template>
  <layout navActive="mall">
    <div class="layout-content-list">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>交易管理</el-breadcrumb-item>
        <el-breadcrumb-item>结算单管理</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">结算周期</span>
          <el-date-picker
            v-model="timeRange"
            value-format="yyyy-MM-dd"
            @change="handleDateChange"
            :picker-options="pickerOptions"
            type="daterange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          ></el-date-picker>
        </div>
        <div class="toolbar-item">
          <span class="item-label">结算单编号</span>
          <el-input
            v-model.trim="tableOptions.settlementSn"
            :maxlength="50"
            clearable
            placeholder="结算单编号"
            @keyup.enter.native="handleSearch"
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">结算单状态</span>
          <el-select
            v-model="tableOptions.settlementStatus"
            size="small"
            clearable
            placeholder="请选择"
            style="width:120px;"
          >
            <el-option
              v-for="item in statementStatusArr"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="toolbar-item">
          <span class="item-label">采购商名称</span>
          <el-input
            v-model.trim="tableOptions.purchaserName"
            :maxlength="50"
            clearable
            placeholder="采购商名称"
            @keyup.enter.native="handleSearch"
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">项目编号</span>
          <el-input
            v-model.trim="tableOptions.projectSn"
            :maxlength="50"
            clearable
            placeholder="项目编号"
            @keyup.enter.native="handleSearch"
          ></el-input>
        </div>
        <div class="toolbar-item">
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="primary" @click="onAddSettment">新建结算单</el-button>
        </div>
      </div>
      <el-table :data="tableData.list" border>
        <el-table-column label="结算单编号" prop="settlementSn" min-width="130">
          <template slot-scope="scope">
            <span class="font-default pointer" @click="onJumpDetail(scope.row)">{{ scope.row.settlementSn }}</span>
          </template>
        </el-table-column>
        <el-table-column label="项目编号" prop="projectSn" min-width="130"></el-table-column>
        <el-table-column label="项目名称" prop="projectName" min-width="130" show-overflow-tooltip></el-table-column>
        <el-table-column label="采购商" prop="purchaserName" min-width="130" show-overflow-tooltip></el-table-column>
        <el-table-column label="供应商" prop="supplierName" min-width="130" show-overflow-tooltip></el-table-column>
        <el-table-column label="结算周期" prop="createTimeString" min-width="180">
          <template slot-scope="scope">
            <span
              >{{ scope.row.settlementStartDate | dateFormat('YYYY-MM-DD') }} ~
              {{ scope.row.settlementEndDate | dateFormat('YYYY-MM-DD') }}</span
            >
          </template>
        </el-table-column>
        <el-table-column label="结算日期" prop="settlementDate" min-width="90">
          <template slot-scope="scope">
            <span>{{ scope.row.settlementDate | dateFormat('YYYY-MM-DD') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="结算单状态" prop="settlementStatus" min-width="90">
          <template slot-scope="scope">
            <span :class="scope.row.settlementStatus !== 'SETTLED' ? 'font-orange' : 'font-green'">{{
              scope.row.settlementStatus | valueToLabel(statementStatusArr)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="砼量(m³)" prop="concreteCube" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.concreteCube | toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="月结总金额(元)" prop="currentMonthAmount" min-width="120">
          <template slot-scope="scope">
            <span class="font-orange">{{ scope.row.currentMonthAmount | thousands(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="100">
          <template slot-scope="scope">
            <span
              v-if="scope.row.settlementStatus === 'RECONCILIATION'"
              class="font-default pointer"
              @click="onExportList(scope.row)"
              >导出对账单</span
            >
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
      <!-- 新建结算单 -->
      <el-dialog title="新建结算单" :visible.sync="dialogVisible" width="440px">
        <el-form ref="addForm" :model="addForm" :rules="addRules" label-width="80px">
          <el-form-item label="结算项目" prop="projectId">
            <el-select
              v-model="addForm.projectId"
              filterable
              remote
              @click="handleQueryProject"
              :filter-method="handleQueryProject"
              placeholder="请输入项目名称搜索"
              style="width:296px"
            >
              <el-option
                v-for="item in projectList"
                :label="item.projectName"
                :value="item.id"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="结算周期" required>
            <el-date-picker
              v-model="addForm.settlementStartDate"
              type="date"
              disabled
              placeholder="选择日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width:140px"
            >
            </el-date-picker>
            <span class="ml-5 mr-5">~</span>
            <el-form-item label="" prop="settlementEndDate" class="inlineblock">
              <el-date-picker
                v-model="addForm.settlementEndDate"
                :picker-options="pickerOptions"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="width:140px"
              >
              </el-date-picker>
            </el-form-item>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="onAddConfirm">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </layout>
</template>

<script>
import dayjs from 'dayjs';
import axios from '@/utils/axios';
import api from '@/api/mall.api';
import listMixin from '@/utils/listMixin';
import utils from '@/utils/utils';
import config from '@/config/config';

export default {
  name: 'OrderList',
  mixins: [listMixin],
  data() {
    var _this = this;
    return {
      pickerOptions: {
        disabledDate(time) {
          // if (config.env === 'prod') {
          //   return time.getTime() > Date.now() - 86400000;
          // } else {
          //   return time.getTime() > Date.now();
          // }

          if (_this.isCheckedCurrentDay === 'on') {
            return time.getTime() > Date.now() - 86400000;
          } else {
            return time.getTime() > Date.now();
          }
        }
      },
      timeRange: [],
      addForm: {
        projectId: '',
        settlementStartDate: '',
        settlementEndDate: ''
      },
      addRules: {
        projectId: [{ required: true, message: '请选择结算项目', trigger: 'change' }],
        settlementEndDate: [{ required: true, message: '请选择结算周期', trigger: 'change' }]
      },
      dialogVisible: false,
      projectList: [],
      statementStatusArr: [],
      tableOptions: {
        projectSn: '',
        projectStatus: '',
        settementSn: '',
        settlementStatus: '',
        purchaserName: '',
        startTime: '',
        endTime: ''
      },
      sendOptions: {},
      tableData: {
        count: 0,
        list: []
      },
      env: config.env,
      isCheckedCurrentDay: 'on' // on表带当天不能选，off表示能选当天
    };
  },
  watch: {
    // 远程搜索select 不会触发change事件  原因未知 暂时使用监听解决
    'addForm.projectId': function(newValue, oldValue) {
      this.handleProjectChange(newValue);
    }
  },
  async created() {
    this.statementStatusArr = await utils.getSysDict('statement_status'); // 结算单状态
    // getByEnName
    let res = await axios.post(api.getByEnName, { paramEnName: 'statement_same_day_switch' });
    this.isCheckedCurrentDay = res.data.paramValue; // on表带当天不能选，off表示能选当天
    this.handleSearch();
  },
  methods: {
    onAddSettment() {
      this.addForm.projectId = '';
      this.addForm.settlementStartDate = '';
      this.addForm.settlementEndDate = '';
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.addForm.clearValidate();
        // this.handleQueryProject();
      });
    },
    async handleQueryProject(query = '') {
      const options = { page: 1, pageSize: 10, projectName: query, projectStatus: 'EFFECTED' };
      let res = await axios.post(api.projectList, options);
      this.projectList = res.data.list || [];
    },
    async handleProjectChange(projectId) {
      if (!projectId) return;
      let res = await axios.post(api.settlementStarttime, { projectId: projectId });
      this.addForm.settlementStartDate = dayjs(res.data.startTime).format('YYYY-MM-DD HH:mm:ss') || '';
    },
    onAddConfirm() {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          const options = { ...this.addForm };
          options.settlementEndDate = options.settlementEndDate.split(' ')[0] + ' 23:59:59';
          if (dayjs(options.settlementStartDate).valueOf() > dayjs(options.settlementEndDate).valueOf()) {
            this.$message.error('结算周期开始时间不能大于结束时间');
            return;
          }
          await axios.post(api.settlementAdd, options);
          this.dialogVisible = false;
          this.fetchData();
        }
      });
    },
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
        projectSn: '',
        projectStatus: '',
        settementSn: '',
        settlementStatus: '',
        purchaserName: '',
        startTime: '',
        endTime: ''
      };
      this.timeRange = '';
      this.handleSearch();
    },
    onJumpDetail(row) {
      this.$router.push({ path: '/settlement/detail/' + row.id });
    },
    // 导出对账单
    onExportList(row) {
      const token = localStorage.getItem('Authorization');

      let exportUrl = api.settlementExport + '?';
      exportUrl += 'token=' + token;
      exportUrl += '&statementId=' + row.id;
      utils.openNewtab(exportUrl);
      // window.location.href = exportUrl;
    },
    async fetchData(opts) {
      const options = { page: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      const result = await axios.post(api.settlementList, options);
      this.tableData = result.data || {};
    }
  }
};
</script>
<style lang="postcss">
</style>
