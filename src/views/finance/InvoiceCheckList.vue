<template>
  <layout navActive="finance">
    <div class="layout-content-list invoice-check-list">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>发票管理</el-breadcrumb-item>
        <el-breadcrumb-item>发票登记</el-breadcrumb-item>
      </el-breadcrumb>

      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">创建时间</span>
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
          <span class="item-label">发票抬头</span>
          <el-input
            v-model.trim="tableOptions.taxPayable"
            @keyup.enter.native="handleSearch"
            :maxlength="50"
            clearable
            placeholder="请输入发票抬头"
          ></el-input>
        </div>

        <div class="toolbar-item">
          <span class="item-label">开票单位</span>
          <el-input
            v-model.trim="tableOptions.taxCompany"
            @keyup.enter.native="handleSearch"
            :maxlength="50"
            clearable
            placeholder="请输入开票单位"
          ></el-input>
        </div>

        <div class="toolbar-item">
          <span class="item-label">发票号码</span>
          <el-input
            v-model.trim="tableOptions.taxNumber"
            @keyup.enter.native="handleSearch"
            :maxlength="50"
            clearable
            placeholder="请输入发票号码"
          ></el-input>
        </div>

        <div class="toolbar-item">
          <span class="item-label">业务状态</span>
          <el-select v-model="tableOptions.status" clearable placeholder="请选择业务状态" style="width:200px;">
            <div v-for="item in statusArr" :key="item.value">
              <el-option :label="item.label" :value="item.value"></el-option>
            </div>
          </el-select>
        </div>

        <div class="toolbar-item">
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </div>
        <div class="toolbar-item">
          <div class="upload-btn-box">
            <el-upload
              class="upload-box"
              :action="excelUploadUrl"
              :headers="uploadHeader"
              :limit="1"
              :file-list="fileList"
              :on-exceed="handleExceed"
              :before-upload="handleBeforeUpload"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :show-file-list="false"
            >
              <el-button slot="trigger" size="small" type="primary">运单分票导入</el-button>
            </el-upload>
          </div>
        </div>
      </div>

      <el-table :data="tableData.list" border>
        <el-table-column label="开票申请流水号" prop="flowCode" min-width="160" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="font-default">{{ scope.row.flowCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="业务状态" prop="status" min-width="70" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.status | dictFilter(statusArr) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="发票抬头" prop="taxPayable" min-width="160" show-overflow-tooltip></el-table-column>
        <el-table-column label="开票单位" prop="taxCompany" min-width="160" show-overflow-tooltip></el-table-column>
        <el-table-column label="发票号码" prop="taxNumber" min-width="160" show-overflow-tooltip></el-table-column>

        <el-table-column label="开票时段" min-width="280" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.startTime }}</span>
            至
            <span>{{ scope.row.endTime }}</span>
          </template>
        </el-table-column>

        <el-table-column label="运单数合计" align="right" prop="waybillCount" min-width="85" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.waybillCount | thousands(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="开票数量" align="right" prop="billCount" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.billCount | thousands(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="开票总金额(元)" align="right" prop="billAmount" min-width="140" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.billAmount | thousands(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" min-width="140" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" min-width="150" fixed="right">
          <template slot-scope="scope" v-if="scope.row.status != '2'">
            <!-- <el-button type="text" size="small" @click="onJumpDetailPage(scope.row, 'show')"
            >查看</el-button
          > -->
            <el-button type="text" size="small" @click="onJumpDetailPage(scope.row, 'edit')">发票维护</el-button>
            <el-button type="text" size="small" @click="onRejectApply(scope.row)" v-if="scope.row.status != '1'"
              >分票驳回</el-button
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
        createTimeEnd: '', // 查询创建结束时间
        createTimeStart: '', //  查询创建开始时间
        status: '', // 业务状态
        taxCompany: '', // 开票单位
        taxNumber: '', // 发票号码
        taxPayable: '' //  发票抬头
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      createTimeRange: [],
      tableData: {},
      statusArr: [], //业务状态字典

      //导入所需参数
      fileList: [],
      uploadHeader: {
        Authorization: localStorage.getItem('Authorization') || ''
      },
      excelSize: 1, // excel大小限制为1M
      excelUploadUrl: api.taxExcelImport // 导入url api.taxExcelImport
    };
  },
  async created() {
    const dict = await utils.getSysDict();
    this.statusArr = dict.tax_apply_flow_status; //业务状态
    this.handleSearch();
  },
  methods: {
    // 选择时间范围回调
    onDateChange(val, type) {
      if (val && val.length > 0) {
        this.tableOptions.createTimeStart = val[0];
        this.tableOptions.createTimeEnd = val[1];
      } else {
        this.tableOptions.createTimeStart = '';
        this.tableOptions.createTimeEnd = '';
      }
    },
    handleReset() {
      this.tableOptions = {
        createTimeEnd: '', // 查询创建结束时间
        createTimeStart: '', //  查询创建开始时间
        status: '', // 业务状态
        taxCompany: '', // 开票单位
        taxNumber: '', // 发票号码
        taxPayable: '' //  发票抬头
      };
      this.createTimeRange = [];
      this.handleSearch();
    },
    async fetchData(opts) {
      const options = { page: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let res = await axios.post(api.taxApplyFlow, options);
      this.tableData = res.data;
    },
    onJumpDetailPage(row, type) {
      let path = `/invoice/detail/edit/${row.taxApplyFlowId}/${row.flowCode}`;
      this.$router.push({ path });
    },
    async onRejectApply(row) {
      await axios.get(api.rejectTaxApplyFlow, {
        params: { taxApplyFlowId: row.taxApplyFlowId }
      });
      this.$message.success('驳回操作成功');
      this.handleReset();
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件`);
    },
    handleBeforeUpload(file) {
      const isType = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ].some(e => e === file.type);
      const isLt1M = file.size / 1024 / 1024 <= this.excelSize;
      if (!isType) {
        this.$message.error('上传文件只能是excel');
      }
      if (!isLt1M) {
        this.$message.error(`上传excel文件大小不能超过 ${this.excelSize}MB!`);
      }
      return isType && isLt1M;
    },
    handleRemove(file, fileList) {},
    handleSuccess(res, file) {
      if (res.status !== 0) {
        this.$message.error(`${res.message}`);
        this.fileList = [];
        return;
      } else {
        this.$message.success('导入成功');
        this.fileList = [];
        this.handleSearch();
      }
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
