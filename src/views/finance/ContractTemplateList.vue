<template>
  <layout navActive="finance">
    <div class="layout-content-list contract-template-list">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>签章管理</el-breadcrumb-item>
        <el-breadcrumb-item>合同模板</el-breadcrumb-item>
      </el-breadcrumb>

      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">模板名称</span>
          <el-input
            v-model.trim="tableOptions.templateName"
            :maxlength="50"
            clearable
            placeholder="请输入模板名称"
            @keyup.enter.native="handleSearch"
          ></el-input>
        </div>
        <!-- 渠道类型 -->
        <div class="toolbar-item">
          <span class="item-label">渠道类型</span>
          <el-select v-model="tableOptions.channelType" clearable placeholder="请选择渠道类型" style="width:150px;">
            <div v-for="item in channelTypeArr" :key="item.value">
              <el-option :label="item.label" :value="item.value"></el-option>
            </div>
          </el-select>
        </div>
        <!-- 合同类型 -->
        <div class="toolbar-item">
          <span class="item-label">合同类型</span>
          <el-select v-model="tableOptions.contractType" clearable placeholder="请选择合同类型" style="width:150px;">
            <div v-for="item in contractTypeArr" :key="item.value">
              <el-option :label="item.label" :value="item.value"></el-option>
            </div>
          </el-select>
        </div>
        <!-- 状态 -->
        <div class="toolbar-item">
          <span class="item-label">状态</span>
          <el-select v-model="tableOptions.status" clearable placeholder="请选择状态" style="width:150px;">
            <div v-for="item in statusArr" :key="item.value">
              <el-option :label="item.label" :value="item.value"></el-option>
            </div>
          </el-select>
        </div>
        <div class="toolbar-item">
          <span class="item-label">创建日期</span>
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
          <span class="item-label">云章合同模板ID</span>
          <el-input
            v-model.trim="tableOptions.id"
            :maxlength="50"
            clearable
            placeholder="请输入云章合同模板ID"
            @keyup.enter.native="handleSearch"
            style="width:270px"
          ></el-input>
        </div>
        <div class="toolbar-item">
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </div>
      </div>

      <el-table :data="tableData.list" border>
        <el-table-column label="云章合同模板ID" prop="id" min-width="250" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="font-default">{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="模板名称" prop="templateName" min-width="165" show-overflow-tooltip></el-table-column>
        <el-table-column label="渠道类型" prop="channelType" min-width="70" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.channelType | dictFilter(channelTypeArr) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="合同类型" prop="contractType" min-width="160" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.contractType | dictFilter(contractTypeArr) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="状态" prop="status" min-width="60" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.status | dictFilter(statusArr) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建日期" prop="createTime" min-width="140" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="修改日期" prop="updateTime" min-width="140" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.updateTime }}</span>
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
        beginCreateTime: '', //创建日期,查询开始日期 yyyy-MM-dd HH:mm:ss
        endCreateTime: '', // 创建日期,查询结束日期 yyyy-MM-dd HH:mm:ss
        id: '', //主键
        templateName: '', //模板名称
        channelType: '', //渠道类型(字典字段:cloud_sign_chl_type)
        contractType: '', //合同类型(字典字段:cloud_sign_contract_type)
        status: '' //状态 (字典字段:template_status)
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      createTimeRange: [], //创建日期
      tableData: {},
      channelTypeArr: [], //渠道类型(对应字典:cloud_sign_chl_type) ,
      contractTypeArr: [], // 合同类型(对应字典:cloud_sign_contract_type) ,
      statusArr: [] //状态(对应字典:template_status) ,
    };
  },
  async created() {
    const dict = await utils.getSysDict();
    this.channelTypeArr = dict.cloud_sign_chl_type; //渠道类型
    this.contractTypeArr = dict.cloud_sign_contract_type; //合同类型字典
    this.statusArr = dict.template_status; //状态字典

    this.handleSearch();
  },
  methods: {
    // 选择时间范围回调
    onDateChange(val) {
      if (val && val.length > 0) {
        this.tableOptions.beginCreateTime = val[0];
        this.tableOptions.endCreateTime = val[1];
      } else {
        this.tableOptions.beginCreateTime = '';
        this.tableOptions.endCreateTime = '';
      }
    },
    handleReset() {
      this.tableOptions = {
        beginCreateTime: '', //创建日期,查询开始日期 yyyy-MM-dd HH:mm:ss
        endCreateTime: '', // 创建日期,查询结束日期 yyyy-MM-dd HH:mm:ss
        id: '', //主键
        templateName: '', //模板名称
        channelType: '', //渠道类型(字典字段:cloud_sign_chl_type)
        contractType: '', //合同类型(字典字段:cloud_sign_contract_type)
        status: '' //状态 (字典字段:template_status)
      };
      // 重置创建日期
      this.createTimeRange = [];
      this.tableOptions.beginCreateTime = '';
      this.tableOptions.endCreateTime = '';
      this.handleSearch();
    },
    async fetchData(opts) {
      const options = { page: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let res = await axios.post(api.queryFinCloudSignTemplateLimit, options);
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
