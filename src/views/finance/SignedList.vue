<template>
  <layout navActive="finance">
    <div class="layout-content-list">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>签约管理</el-breadcrumb-item>
        <el-breadcrumb-item>签约信息管理</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">签约编号</span>
          <el-input
            v-model.trim="tableOptions.agentId"
            :maxlength="50"
            clearable
            placeholder="签约编号"
            @keyup.enter.native="handleSearch"
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">账户编号</span>
          <el-input
            v-model.trim="tableOptions.acctNo"
            :maxlength="50"
            clearable
            placeholder="账户编号"
            @keyup.enter.native="handleSearch"
          ></el-input>
        </div>

        <div class="toolbar-item">
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </div>
        <el-collapse-transition>
          <div v-show="toolexpand">
            <div class="toolbar-item">
              <span class="item-label">帐号类型</span>
              <el-select
                v-model="tableOptions.acctType"
                size="small"
                clearable
                placeholder="请选择"
                style="width:120px;"
              >
                <el-option
                  v-for="item in acctTypeArr"
                  :label="item.label"
                  :value="item.value"
                  :key="item.value"
                ></el-option>
              </el-select>
            </div>
            <div class="toolbar-item">
              <span class="item-label">签约状态</span>
              <el-select v-model="tableOptions.status" size="small" clearable placeholder="请选择" style="width:120px;">
                <el-option
                  v-for="item in statusArr"
                  :label="item.label"
                  :value="item.value"
                  :key="item.value"
                ></el-option>
              </el-select>
            </div>
            <div class="toolbar-item">
              <span class="item-label">签约渠道</span>
              <el-select
                v-model="tableOptions.chlType"
                size="small"
                clearable
                placeholder="请选择"
                style="width:120px;"
              >
                <el-option
                  v-for="item in chlTypeArr"
                  :label="item.label"
                  :value="item.value"
                  :key="item.value"
                ></el-option>
              </el-select>
            </div>
            <div class="toolbar-item">
              <span class="item-label">渠道状态</span>
              <el-select
                v-model="tableOptions.chlStatus"
                size="small"
                clearable
                placeholder="请选择"
                style="width:120px;"
              >
                <el-option
                  v-for="item in chlStatusArr"
                  :label="item.label"
                  :value="item.value"
                  :key="item.value"
                ></el-option>
              </el-select>
            </div>
            <div class="toolbar-item">
              <span class="item-label">结算账户</span>
              <el-input
                v-model.trim="tableOptions.clearAcct"
                :maxlength="50"
                clearable
                placeholder="结算账户"
                @keyup.enter.native="handleSearch"
              ></el-input>
            </div>
            <div class="toolbar-item">
              <span class="item-label">结算账户名</span>
              <el-input
                v-model.trim="tableOptions.clearAcctName"
                :maxlength="50"
                clearable
                placeholder="结算账户名"
                @keyup.enter.native="handleSearch"
              ></el-input>
            </div>
            <div class="toolbar-item">
              <span class="item-label">法人证件号</span>
              <el-input
                v-model.trim="tableOptions.legalCertCode"
                :maxlength="50"
                clearable
                placeholder="法人证件号"
                @keyup.enter.native="handleSearch"
              ></el-input>
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
        <el-table-column type="expand" width="40">
          <template slot-scope="scope">
            <el-form label-position="left" inline>
              <el-form-item label="签约编号">
                <span>{{ scope.row.agentId }}</span>
              </el-form-item>
              <el-form-item label="签约渠道">
                <span v-if="scope.row.chlType === '5'">武汉兴业</span>
                <span v-else>-</span>
              </el-form-item>
              <el-form-item label="交易类型">
                <span v-if="scope.row.tradeType === '1'">买方</span>
                <span v-else-if="scope.row.tradeType === '2'">卖方</span>
                <span v-else>两方</span>
              </el-form-item>
              <el-form-item label="企业证件类型">
                <span v-if="scope.row.entcertType === '17'">组织机构代码证</span>
                <span v-else-if="scope.row.entcertType === '16'">营业执照</span>
                <span v-else>身份证</span>
              </el-form-item>
              <el-form-item label="企业证件号码">
                <span>{{ scope.row.entcertCode }}</span>
              </el-form-item>
              <el-form-item label="企业证件有效期">
                <span>{{ scope.row.entcertValidDate }}</span>
              </el-form-item>
              <el-form-item label="法人姓名">
                <span> {{ scope.row.legalName }} </span>
              </el-form-item>
              <el-form-item label="法人固定电话">
                <span> {{ scope.row.legalTel }} </span>
              </el-form-item>
              <el-form-item label="法人移动电话">
                <span> {{ scope.row.legalMobile }} </span>
              </el-form-item>
              <el-form-item label="法人联系地址">
                <span :title="scope.row.legalAddress">{{ scope.row.legalAddress }}</span>
              </el-form-item>
              <el-form-item label="法人证件号码">
                <span>{{ scope.row.legalCertCode }}</span>
              </el-form-item>
              <el-form-item label="法人证件有效期">
                <span>{{ scope.row.legalCertValidDate }}</span>
              </el-form-item>
              <el-form-item label="支付系统号">
                <span>{{ scope.row.payBankCode }}</span>
              </el-form-item>
              <el-form-item label="支付行名">
                <span>{{ scope.row.payBankName }}</span>
              </el-form-item>
              <el-form-item label="创建时间">
                <span>{{ scope.row.createTimeString }}</span>
              </el-form-item>
              <el-form-item label="更新时间">
                <span>{{ scope.row.updateTimeString }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="账户编号" prop="acctNo" min-width="160">
          <template slot-scope="scope">
            <span class="font-default">{{ scope.row.acctNo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="企业名称" prop="agentName" min-width="130" show-overflow-tooltip></el-table-column>
        <el-table-column label="企业类型" prop="acctType" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.acctType | valueToLabel(acctTypeArr) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="结算账户" prop="clearAcct" min-width="160"></el-table-column>
        <el-table-column
          label="结算账户名"
          prop="clearAcctName"
          min-width="110"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="电子银行账号" prop="eAcctNo" min-width="190"></el-table-column>
        <el-table-column
          label="电子银行账户名"
          prop="eAcctName"
          min-width="110"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="签约状态" prop="status" min-width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.status === '0'" class="font-green">成功</span>
            <span v-else-if="scope.row.status === '1'">初始化</span>
            <span v-else class="font-red">失败</span>
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
import listMixin from '@/utils/listMixin';
import utils from '@/utils/utils';

export default {
  mixins: [listMixin],
  data() {
    return {
      toolexpand: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      acctTypeArr: [],
      statusArr: [],
      chlTypeArr: [],
      chlStatusArr: [],
      tableOptions: {
        acctNo: '',
        acctType: '',
        agentId: '',
        chlStatus: '',
        chlType: '',
        clearAcct: '',
        clearAcctName: '',
        companyId: '',
        legalCertCode: '',
        status: ''
      },
      sendOptions: {},
      tableData: {}
    };
  },
  async created() {
    const dict = await utils.getSysDict();
    this.acctTypeArr = dict.fin_eacct_type;
    this.statusArr = dict.fin_ebank_apply_status;
    this.chlTypeArr = dict.sign_channel_type;
    this.chlStatusArr = dict.sign_status;

    this.handleSearch();
  },
  methods: {
    handleReset() {
      this.tableOptions = {
        acctNo: '',
        acctType: '',
        agentId: '',
        chlStatus: '',
        chlType: '',
        clearAcct: '',
        clearAcctName: '',
        companyId: '',
        legalCertCode: '',
        status: ''
      };
      this.handleSearch();
    },
    async fetchData(opts) {
      const options = { page: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let result = await axios.post(api.queryFinOpenEbankApplyPage, options);
      this.tableData = result.data;
    }
  }
};
</script>
