<template>
  <layout navActive="finance">
    <div class="layout-content-list contract-list">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>签章管理</el-breadcrumb-item>
        <el-breadcrumb-item>合同列表</el-breadcrumb-item>
      </el-breadcrumb>

      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">创建日期</span>
          <el-date-picker
            v-model="createTimeRange"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="val => onDateChange(val, 'create')"
            :picker-options="pickerOptions"
            type="datetimerange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          ></el-date-picker>
        </div>
        <div class="toolbar-item">
          <span class="item-label">合同编号</span>
          <el-input
            v-model.trim="tableOptions.contractNum"
            :maxlength="50"
            clearable
            placeholder="请输入合同编号"
            @keyup.enter.native="handleSearch"
            style="width:240px"
          ></el-input>
        </div>
        <div class="toolbar-item">
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </div>

        <el-collapse-transition>
          <div v-show="toolexpand">
            <div class="toolbar-item">
              <span class="item-label">业务号</span>
              <el-input
                v-model.trim="tableOptions.businessNo"
                :maxlength="50"
                clearable
                placeholder="请输入业务号"
                @keyup.enter.native="handleSearch"
              ></el-input>
            </div>
            <div class="toolbar-item">
              <span class="item-label">云章合同模板ID</span>
              <el-input
                v-model.trim="tableOptions.templateId"
                :maxlength="50"
                clearable
                placeholder="请输入云章合同模板ID"
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
              <el-select
                v-model="tableOptions.contractType"
                clearable
                placeholder="请选择合同类型"
                style="width:150px;"
              >
                <div v-for="item in contractTypeArr" :key="item.value">
                  <el-option :label="item.label" :value="item.value"></el-option>
                </div>
              </el-select>
            </div>
            <!-- 签约状态 -->
            <div class="toolbar-item">
              <span class="item-label">签约状态</span>
              <el-select v-model="tableOptions.signStatus" clearable placeholder="请选择签约状态" style="width:150px;">
                <div v-for="item in signStatusArr" :key="item.value">
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
              <span class="item-label">修改日期</span>
              <el-date-picker
                v-model="updateTimeRange"
                value-format="yyyy-MM-dd HH:mm:ss"
                @change="val => onDateChange(val, 'update')"
                :picker-options="pickerOptions"
                type="datetimerange"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
              ></el-date-picker>
            </div>
          </div>
        </el-collapse-transition>
      </div>
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

      <el-table :data="tableData.list" border>
        <el-table-column label="合同编号" prop="contractNum" min-width="200" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="font-default">{{ scope.row.contractNum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="业务号" prop="businessNo" min-width="125" show-overflow-tooltip></el-table-column>
        <el-table-column label="渠道类型" prop="channelType" min-width="70" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.channelType | dictFilter(channelTypeArr) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="合同类型" prop="contractType" min-width="165" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.contractType | dictFilter(contractTypeArr) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="创建日期" prop="createTime" min-width="140" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
        label="第一次签署失败时间"
        prop="createDate"
        min-width="140"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>{{ scope.row.firstFailedDate }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="第一次签署失败描述信息"
        prop="firstFailedDesc"
        min-width="200"
        show-overflow-tooltip
      ></el-table-column> -->
        <el-table-column label="甲签署时间" prop="signDateFirst" min-width="140" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.signDateFirst }}</span>
          </template>
        </el-table-column>
        <el-table-column label="乙签署时间" prop="signDateSecond" min-width="140" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.signDateSecond }}</span>
          </template>
        </el-table-column>
        <el-table-column label="签约状态" prop="signStatus" min-width="70" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.signStatus | dictFilter(signStatusArr) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" min-width="60" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.status | dictFilter(statusArr) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="云章合同模板ID"
          prop="templateId"
          min-width="200"
          show-overflow-tooltip
        ></el-table-column>
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
        contractNum: '', //合同编号 ,
        businessNo: '', //业务号 ,
        templateId: '', //云章合同模板ID

        channelType: '', //渠道类型
        contractType: '', //合同类型(对应字典:cloud_sign_contract_type) ,
        signStatus: '', // 签约状态(对应字典:cloud_sign_sign_status) ,
        status: '', //状态(对应字典:contract_status) ,

        createTimeEnd: '', //创建日期结束时间 yyyy-MM-dd HH:mm:ss ,
        createTimeStart: '', // 创建日期开始时间 yyyy-MM-dd HH:mm:ss ,
        updateTimeEnd: '', //修改日期结束时间 yyyy-MM-dd HH:mm:ss ,
        updateTimeStart: '' //修改日期开始时间 yyyy-MM-dd HH:mm:ss
      },
      toolexpand: false, //展开-收起
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      createTimeRange: [], //创建日期
      updateTimeRange: [], //修改日期
      tableData: {},
      channelTypeArr: [], //渠道类型(对应字典:cloud_sign_chl_type) ,
      contractTypeArr: [], // 合同类型(对应字典:cloud_sign_contract_type) ,
      signStatusArr: [], //签约状态(对应字典:cloud_sign_sign_status) ,
      statusArr: [] //状态(对应字典:contract_status) ,
    };
  },
  async created() {
    const dict = await utils.getSysDict();
    this.channelTypeArr = dict.cloud_sign_chl_type; //渠道类型
    this.contractTypeArr = dict.cloud_sign_contract_type; //合同类型字典
    this.signStatusArr = dict.cloud_sign_sign_status; //签约状态字典
    this.statusArr = dict.contract_status; //状态字典

    this.handleSearch();
  },
  methods: {
    // 选择时间范围回调
    onDateChange(val, type) {
      if (val && val.length > 0) {
        this.tableOptions[`${type}TimeStart`] = val[0];
        this.tableOptions[`${type}TimeEnd`] = val[1];
      } else {
        this.tableOptions[`${type}TimeStart`] = '';
        this.tableOptions[`${type}TimeEnd`] = '';
      }
    },
    handleReset() {
      this.tableOptions = {
        contractNum: '', //合同编号 ,
        businessNo: '', //业务号 ,
        templateId: '', //云章合同模板ID

        channelType: '', //渠道类型
        contractType: '', //合同类型(对应字典:cloud_sign_contract_type) ,
        signStatus: '', // 签约状态(对应字典:cloud_sign_sign_status) ,
        status: '', //状态(对应字典:contract_status) ,

        createTimeEnd: '', //创建日期结束时间 yyyy-MM-dd HH:mm:ss ,
        createTimeStart: '', // 创建日期开始时间 yyyy-MM-dd HH:mm:ss ,
        updateTimeEnd: '', //修改日期结束时间 yyyy-MM-dd HH:mm:ss ,
        updateTimeStart: '' //修改日期开始时间 yyyy-MM-dd HH:mm:ss
      };
      // 重置创建日期&修改日期
      this.createTimeRange = [];
      this.updateTimeRange = [];
      this.tableOptions.createTimeEnd = '';
      this.tableOptions.createTimeStart = '';
      this.tableOptions.updateTimeEnd = '';
      this.tableOptions.updateTimeStart = '';
      this.handleSearch();
    },
    async fetchData(opts) {
      const options = { page: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let res = await axios.post(api.queryFinCloudSignContractLimit, options);
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
