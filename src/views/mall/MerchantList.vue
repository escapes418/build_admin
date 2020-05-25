<template>
  <layout navActive="mall">
    <div class="layout-content-list">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>供应链管理</el-breadcrumb-item>
        <el-breadcrumb-item>供应链商户管理</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">企业编号</span>
          <el-input
            v-model.trim="tableOptions.companyCode"
            :maxlength="20"
            clearable
            placeholder="企业编号"
            @keyup.enter.native="handleSearch"
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">商户名称</span>
          <el-input
            v-model.trim="tableOptions.fullName"
            :maxlength="20"
            clearable
            placeholder="商户名称"
            @keyup.enter.native="handleSearch"
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">商户类型</span>
          <el-select
            v-model="tableOptions.companyType"
            clearable
            placeholder="请选择"
            style="width:140px;"
          >
            <el-option
              v-for="item in companyTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>

        <div class="toolbar-item">
          <span class="item-label">商户状态</span>
          <el-select v-model="tableOptions.status" clearable placeholder="请选择" style="width:120px;">
            <el-option
              v-for="item in companyStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="toolbar-item">
          <span class="item-label">登录手机号</span>
          <el-input
            v-model.trim="tableOptions.loginAdminName"
            :maxlength="20"
            clearable
            placeholder="登录手机号"
            @keyup.enter.native="handleSearch"
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">纳税人类型</span>
          <el-select
            v-model="tableOptions.taxpayerType"
            clearable
            placeholder="请选择"
            style="width:140px;"
          >
            <el-option
              v-for="item in taxpayerTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="toolbar-item">
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="primary" @click="onAddAccount">新增</el-button>
        </div>
      </div>
      <el-table :data="tableData.list" border>
        <el-table-column label="企业编号" prop="companyCode" min-width="130" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="text" @click="onJumpDetail(scope.row)">{{ scope.row.companyCode }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="商户名称" prop="fullName" min-width="200" show-overflow-tooltip></el-table-column>
        <el-table-column label="商户类型" prop="companyTypeValue" min-width="100"></el-table-column>
        <el-table-column label="纳税人类型" min-width="140">
          <template slot-scope="scope">
            <span>{{ scope.row.taxpayerType | valueToLabel(taxpayerTypeOptions) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="剩余开票额度" min-width="140">
          <template slot-scope="scope">
            <!-- 小规模纳税人才展示额度 -->
            <span
              v-if="scope.row.taxpayerType === 20"
            >{{ scope.row.remainLimitAmount | thousands(3) }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" min-width="140"></el-table-column>
        <el-table-column label="联系人" prop="contactPeople" min-width="110" show-overflow-tooltip></el-table-column>
        <el-table-column label="登录手机号" prop="loginAdminName" min-width="110" show-overflow-tooltip></el-table-column>
        <el-table-column label="商户状态" min-width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.status" class="font-red">已停用</span>
            <span v-else>已启用</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="80">
          <template slot-scope="scope">
            <el-button type="text" @click="onDisabledMerchant(scope.row)">
              {{
              scope.row.status ? '启用' : '停用'
              }}
            </el-button>
            <!-- 除供应链和采购商之外的商户才可以提现 -->
            <el-button
              type="text"
              @click="onWithdraw(scope.row)"
              v-if="scope.row.companyType !== 'FIN' && scope.row.companyType !== 'CONCRETE_PURCHASER'"
            >提现</el-button>
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
      <el-dialog
        title="提现"
        :visible.sync="dialog.visible"
        :destroy-on-close="true"
        class="topup-dialog"
      >
        <el-form
          ref="form"
          :model="dialog.form"
          :rules="dialog.rules"
          :validate-on-rule-change="false"
          label-position="right"
          label-width="120px"
          :destroy-on-close="true"
        >
          <el-form-item label="可用余额(元)" prop="remainMoney">
            <el-input
              v-model.trim="dialog.form.remainMoney"
              maxlength="20"
              style="width:240px"
              clearable
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="提现金额(元)" prop="cashAmount">
            <el-input
              v-model.trim="dialog.form.cashAmount"
              placeholder="请输入"
              maxlength="20"
              clearable
              style="width:240px"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              v-model.trim="dialog.form.remark"
              placeholder="请输入"
              maxlength="30"
              clearable
              style="width:240px"
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialog.visible = false">取 消</el-button>
          <el-button type="primary" @click="onConfirm">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </layout>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/mall.api';
import listMixin from '@/utils/listMixin';
import utils from '@/utils/utils';
import Validator from '@/utils/Validator';

export default {
  name: 'CoalMineList',
  mixins: [listMixin],
  data() {
    var validateCashAmount = (rule, value, callback) => {
      if (!Validator.number(value, false) || value > 50000 || value > this.dialog.form.remainMoney) {
        callback(new Error(rule.message));
      }
      callback();
    };
    return {
      toolexpand: false,
      companyTypeOptions: [],
      taxpayerTypeOptions: [],
      companyStatusOptions: [],
      tableOptions: {
        companyCode: '',
        fullName: '',
        companyType: '',
        loginAdminName: '',
        status: '',
        taxpayerType: ''
      },
      sendOptions: {},
      tableData: {},
      dialog: {
        visible: false,
        form: {
          companyId: '',
          remainMoney: '',
          cashAmount: '',
          remark: '' //提现备注
        },
        rules: {
          cashAmount: [
            { required: true, message: '请输入提现金额', trigger: 'blur' },
            { validator: validateCashAmount, message: '请输入有效的提现金额(最多5万)', trigger: 'blur' }
          ]
        }
      }
    };
  },
  async created() {
    let dict = await utils.getSysDict();
    this.companyTypeOptions = dict.company_type.filter(el => el.value !== 'FIN');
    this.taxpayerTypeOptions = dict.taxpayer_type;
    this.companyStatusOptions = dict.company_status;
    this.handleSearch();
  },
  methods: {
    handleReset() {
      this.tableOptions = {
        companyCode: '',
        fullName: '',
        companyType: '',
        companyStatus: '',
        loginAdminName: '',
        taxpayerType: ''
      };
      this.handleSearch();
    },
    onJumpDetail(row) {
      this.$router.push({ path: '/merchant/detail/' + row.companyId });
    },
    //启动或停用商户
    onDisabledMerchant(row) {
      let content = row.status ? '确定要启用此供应链商户吗？' : '确定要停用此供应链商户吗？';
      this.$confirm(content, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await axios.get(api.forbidLogin, {
          params: { companyId: row.companyId, disable: !row.status }
        });
        row.status = !row.status;
      });
    },
    async fetchData(opts) {
      const options = { page: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let result = await axios.post(api.companyList, options);
      this.tableData = result.data;
    },
    onAddAccount() {
      this.$router.push({ path: '/merchant/add' });
    },
    async onWithdraw(row) {
      //获取提现金额
      let result = await axios.post(api.queryMoneyAvailable, { companyId: row.companyId });
      //初始化数据
      this.dialog.form.companyId = row.companyId;
      this.dialog.form.remainMoney = result.data.remainMoney;
      this.dialog.form.cashAmount = '';
      this.dialog.form.remark = '';
      this.dialog.visible = true;
    },
    onConfirm() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          await axios.post(api.cashWithdrawal, { ...this.dialog.form });
          this.dialog.visible = false;
        }
      });
    }
  }
};
</script>


<style lang="postcss">
.topup-dialog {
  .el-dialog {
    width: 500px;
    .el-form {
      width: 90%;
      margin: 0 auto;
    }
  }
}
</style>
