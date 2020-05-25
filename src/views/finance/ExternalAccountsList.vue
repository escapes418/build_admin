<template>
  <layout navActive="finance">
    <div class="layout-content-list">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>商户管理</el-breadcrumb-item>
        <el-breadcrumb-item>外部账户列表</el-breadcrumb-item>
      </el-breadcrumb>

      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">账号</span>
          <el-input
            v-model.trim="tableOptions.accountNo"
            :maxlength="50"
            clearable
            placeholder="账号"
            @keyup.enter.native="handleSearch"
          ></el-input>
        </div>

        <div class="toolbar-item">
          <span class="item-label">企业名称</span>
          <el-input
            v-model.trim="tableOptions.udfName"
            :maxlength="50"
            clearable
            placeholder="企业名称"
            @keyup.enter.native="handleSearch"
          ></el-input>
        </div>

        <!-- <div class="toolbar-item">
          <span class="item-label">企业类型</span>
          <el-select
            v-model="tableOptions.companyType"
            clearable
            placeholder="请选择"
            style="width:120px;"
          >
            <el-option
              v-for="item in companyTypeArr"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>-->

        <div class="toolbar-item">
          <span class="item-label">账户状态</span>
          <el-select v-model="tableOptions.status" clearable placeholder="请选择" style="width:120px;">
            <el-option label="生效" value="1"></el-option>
            <el-option label="冻结" value="2"></el-option>
            <el-option label="注销" value="3"></el-option>
          </el-select>
        </div>

        <div class="toolbar-item">
          <span class="item-label">账户类型</span>
          <el-select
            v-model="tableOptions.accountType"
            clearable
            placeholder="请选择"
            style="width:120px;"
          >
            <el-option
              v-for="accountType in accountTypeArr"
              :key="accountType.value"
              :value="accountType.value"
              :label="accountType.label"
            ></el-option>
          </el-select>
        </div>

        <div class="toolbar-item">
          <span class="item-label">是否签约</span>
          <el-select
            v-model="tableOptions.signedStatus"
            clearable
            placeholder="请选择"
            style="width:120px;"
          >
            <el-option
              v-for="signedStatus in signedStatusArr"
              :key="signedStatus.value"
              :label="signedStatus.label"
              :value="signedStatus.value"
            ></el-option>
          </el-select>
        </div>

        <div class="toolbar-item">
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </div>
      </div>

      <el-table :data="tableData.list" border>
        <el-table-column label="账号" prop="accountNo" min-width="160" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="font-default">{{ scope.row.accountNo }}</span>
          </template>
        </el-table-column>

        <el-table-column label="账户名称" prop="accountName" min-width="105" show-overflow-tooltip></el-table-column>

        <el-table-column label="账户状态" prop="status" min-width="105" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.status | valueToLabel(statusArr)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="账户类型" prop="accountType" min-width="105" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.accountType | valueToLabel(accountTypeArr)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="企业名称" prop="udfName" min-width="110" show-overflow-tooltip></el-table-column>

        <el-table-column label="结算账户" prop="cleanAccountNo" min-width="70" show-overflow-tooltip></el-table-column>

        <el-table-column
          label="结算账户名称"
          prop="cleanAccountName"
          min-width="110"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="电子银行账号" prop="eleAccountNo" min-width="110" show-overflow-tooltip></el-table-column>
        <el-table-column
          label="电子银行账户名称"
          prop="eleAccountName"
          min-width="110"
          show-overflow-tooltip
        ></el-table-column>
        <!-- <el-table-column label="状态" prop="acctStat" min-width="50" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.acctStat === '1'">生效</span>
            <span v-else-if="scope.row.acctStat === '2'">冻结</span>
            <span v-else>注销</span>
          </template>
        </el-table-column>-->

        <el-table-column label="签约状态" prop="signedStatus" min-width="60" show-overflow-tooltip>
          <template slot-scope="scope">
            <span
              :class="scope.row.signedStatus === 1 ? 'font-green' : 'font-red'"
            >{{ scope.row.signedStatus === 1 ? '是' : '否' }}</span>
          </template>
        </el-table-column>

        <el-table-column label="账户总额" align="right" prop="totalAmount" min-width="105">
          <template slot-scope="scope">
            <span>{{ scope.row.totalAmount | thousands(2) }}</span>
          </template>
        </el-table-column>

        <!-- <el-table-column label="冻结金额" align="right" prop="frzAmt" min-width="105" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.frzAmt | thousands(2) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="账户余额" align="right" prop="acctBal" min-width="105" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="font-orange">{{ scope.row.acctBal | thousands(2) }}</span>
        </template>
        </el-table-column>-->

        <el-table-column label="创建日期" prop="gmtCreated" min-width="140">
          <template slot-scope="scope">
            <span>{{ scope.row.gmtCreated}}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" min-width="50">
          <template slot-scope="scope">
            <el-button type="text" @click="onJumpSign(scope.row)">签约</el-button>
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
  name: 'ExternalAccountsList',
  mixins: [listMixin],
  data() {
    return {
      sendOptions: {},
      tableData: {},
      //账户状态 1:生效 2:冻结 3:注销 ,
      statusArr: [],
      // 帐户类型（1: "交易帐户"; 2:"托管帐户"） ,
      accountTypeArr: [],
      //签约状态 1：已签约 2：未签约 ,
      signedStatusArr: [],
      tableOptions: {
        accountNo: '', // 账号
        udfName: '', //企业名称 ,
        status: '', //账户状态:1生效2冻结3注销 ,
        accountType: '', //帐户类型（1: "交易帐户"; 2:"托管帐户"）
        signedStatus: '' //是否签约1是0否 ,
      },
      companyTypeArr: [] //企业类型字典
    };
  },
  async created() {
    const dict = await utils.getSysDict();
    this.statusArr = dict.account_status; //账户状态
    this.accountTypeArr = dict.account_type; //账户类型
    this.signedStatusArr = dict.signed_status; //签约状态
    this.companyTypeArr = dict.companyType; //交易类型
    this.handleSearch();
  },
  methods: {
    handleReset() {
      this.tableOptions = {
        accountNo: '', // 账号:账户类型为钱包时为钱包账号 ,
        status: '', //账户状态:1生效2冻结3注销 ,
        accountType: '', //账户类型
        udfName: '', //企业名称 ,
        signedStatus: '' //是否签约1是0否 ,
      };
      this.handleSearch();
    },
    onJumpSign(row) {
      this.$router.push({ path: `/externalacc/add/${row.groupNo}?accountType=${row.accountType}` });
    },
    async fetchData(opts) {
      const options = { page: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let res = await axios.post(api.queryFinanceAccountPage, options);
      this.tableData = res.data;
    }
  }
};
</script>
