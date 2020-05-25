<template>
  <layout navActive="mall">
    <div class="advance-payment-form">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>预付款管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/advance/payment/list' }">预付款列表</el-breadcrumb-item>
        <el-breadcrumb-item>新建预付款</el-breadcrumb-item>
      </el-breadcrumb>

      <div class="">
        <el-form
          :model="queryForm"
          :rules="queryFormRules"
          :status-icon="false"
          :validate-on-rule-change="false"
          label-position="left"
          label-width="120px"
          ref="addPaymentForm"
        >
          <!--预付项目-->
          <section>
            <div class="item-header">预付项目</div>
            <div class="segment">
              <div class="segment-area flex-area" :span="3">
                <div class="segment-item">
                  <div class="segment-label">项目名称</div>
                  <div class="segment-content">{{ projectChainInfo.projectName }}</div>
                </div>
                <div class="segment-item">
                  <div class="segment-label">项目编号</div>
                  <div class="segment-content">{{ projectChainInfo.projectSn }}</div>
                </div>
              </div>
            </div>
          </section>
          <!-- 预付账户 -->
          <section>
            <div class="item-header">预付账户</div>
            <div class="segment">
              <div class="segment-area flex-area" :span="3">
                <div class="segment-item">
                  <div class="segment-label">供应商</div>
                  <div class="segment-content">{{ finInfo.companyName }}</div>
                </div>
                <div class="segment-item">
                  <el-form-item label="预付款金额(元)" prop="payAmount">
                    <el-input
                      v-model.trim="queryForm.payAmount"
                      :placeholder="paymentAmountPlaceholder"
                      maxlength="20"
                      :disabled="isDisabledPayAmount"
                      clearable
                    ></el-input>
                  </el-form-item>
                </div>
              </div>
            </div>
          </section>
          <!-- 收款商户 -->
          <section>
            <div class="item-header">收款商户</div>
            <el-table :data="tableList" style="width: 100%" border>
              <el-table-column prop="companyType" label="企业类型" min-width="100" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{ scope.row.companyType | valueToLabel(companyTypeOptions) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="companyName"
                label="企业名称"
                min-width="100"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column prop="remainLimitAmount" label="剩余开票额度(元)" min-width="120" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-if="scope.row.companyType === 'SANDSTONE_SUPPLIER' || scope.row.companyType === 'AGENT'">{{
                    scope.row.remainLimitAmount | thousands
                  }}</span>
                  <span v-else>-</span>
                </template>
              </el-table-column>
              <el-table-column prop="paymentScale" label="不含税货款比例(%)" min-width="130" show-overflow-tooltip>
              </el-table-column>

              <el-table-column prop="companyType" label="预付金额(元)" min-width="120" show-overflow-tooltip>
                <template slot-scope="scope">
                  <!-- <el-form-item label="" > -->
                  <el-input
                    v-model.trim="scope.row.amount"
                    class="cell-mini-input"
                    type="text"
                    size="mini"
                    v-allow.number.float
                    :maxlength="20"
                    clearable
                    placeholder="请输入金额"
                    @blur="onEditBlur(scope.row)"
                  ></el-input>
                  <!-- </el-form-item> -->
                </template>
              </el-table-column>
            </el-table>
          </section>

          <div class="text-l mt-20">
            <el-button @click="onJumpList">返回</el-button>
            <el-button type="primary" @click="onShowDialog">预览预付款单</el-button>
          </div>
        </el-form>

        <!-- 预览信息 -->
        <el-dialog title="预览支付信息" width="1000px" center :visible.sync="preViewPaymentDialog.visible">
          <section>
            <div class="segment segment-panels noborder">
              <div class="segment-area flex-area" :span="2">
                <div class="segment-item segment-item-special">
                  <div class="segment-label">项目名称</div>
                  <div class="">{{ projectChainInfo.projectName }}</div>
                </div>
                <div class="segment-item segment-item-special">
                  <div class="segment-label">项目编号</div>
                  <div class="segment-content">{{ projectChainInfo.projectSn }}</div>
                </div>
                <div class="segment-item">
                  <div class="segment-label">供应商</div>
                  <div class="segment-content">{{ finInfo.companyName }}</div>
                </div>
                <div class="segment-item">
                  <div class="segment-label">预付款金额(元)</div>
                  <div class="segment-content">{{ queryForm.payAmount | thousands }}</div>
                </div>
              </div>
            </div>
            <el-table :data="tableList" style="width: 100%" border>
              <el-table-column prop="companyType" label="企业类型" min-width="100" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{ scope.row.companyType | valueToLabel(companyTypeOptions) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="companyName"
                label="企业名称"
                min-width="100"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column prop="remainLimitAmount" label="剩余开票额度(元)" min-width="120" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-if="scope.row.companyType === 'SANDSTONE_SUPPLIER' || scope.row.companyType === 'AGENT'">{{
                    scope.row.remainLimitAmount | thousands
                  }}</span>
                  <span v-else>-</span>
                </template>
              </el-table-column>
              <el-table-column prop="amount" label="预付金额(元)" min-width="120" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-if="scope.row.amount">{{ scope.row.amount | thousands }}</span>
                  <span v-else>0</span>
                </template>
              </el-table-column>
            </el-table>
          </section>
          <span slot="footer" class="dialog-footer">
            <el-button @click="preViewPaymentDialog.visible = false">取 消</el-button>
            <el-button type="primary" @click="onSubmitForm">
              确 定
            </el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </layout>
</template>
<script>
import axios from '@/utils/axios';
import api from '@/api/mall.api';
import listMixin from '@/utils/listMixin';
import utils from '@/utils/utils';
import Validator from '@/utils/Validator';
import calc from '@/utils/calc';

export default {
  mixins: [listMixin],
  data() {
    // 收款商户预付金额
    var companyPaymentAmount = (rule, value, callback) => {
      if (!Validator.number(value, false)) {
        callback(new Error(rule.message));
      }
      callback();
    };
    var usablePaymentAmount = (rule, value, callback) => {
      if (value > this.advanceAmount) {
        callback(new Error(rule.message));
      }
      callback();
    };
    return {
      preViewPaymentDialog: {
        visible: false,
        title: '选择项目'
      },
      paymentAmountPlaceholder: '请输入预付金额',
      projectId: '',
      projectChainInfo: {},
      finInfo: {}, // 供应商数据
      advanceAmount: 0, // 供应商账户余额
      tableList: [], // 收款商户列表
      queryForm: {
        projectId: '', // 项目编号
        payAmount: '', // 支付总额
        payee: [
          {
            amount: '', // 金额
            payeeCompanyId: '' //收款方id
          }
        ]
      },
      queryFormRules: {
        payAmount: [
          { required: true, message: '请输入金额', trigger: 'blur' },
          { validator: companyPaymentAmount, message: '请输入正确的金额，最多2位小数' },
          { validator: usablePaymentAmount, message: '预付金额不能超过可用余额' }
        ]
      },
      isDisabledPayAmount: true //供应商账户是否有余额,有余额时false
    };
  },
  computed: {},
  async created() {
    this.projectId = this.$route.params.projectId || '';
    this.queryForm.projectId = this.projectId;
    // 结算方式字典
    this.companyTypeArr = await utils.getSysDict('company_type');
    this.companyTypeOptions = [...this.companyTypeArr, ...[{ label: '承运商', value: 'CARRIER' }]];

    // 项目关系详情
    let result = await axios.post(api.projectRelationDetail, { projectId: this.projectId });
    this.projectChainInfo = result.data || {};
    // 供应商信息（供应链平台）
    this.finInfo =
      this.projectChainInfo.proCompanyList &&
      this.projectChainInfo.proCompanyList.filter(el => el.companyType === 'FIN')[0];
    // 查询供应商账户余额
    let accountRes = await axios.post(api.queryFinanceAccountInfo, { companyId: this.finInfo.companyId });
    this.advanceAmount = accountRes.data.availableAmount;
    if (this.advanceAmount > 0) {
      this.isDisabledPayAmount = false;
    } else {
      this.isDisabledPayAmount = true;
    }
    this.paymentAmountPlaceholder = `可用余额${this.advanceAmount}元`;
    // 商户列表数据
    this.tableList =
      this.projectChainInfo.proCompanyList &&
      this.projectChainInfo.proCompanyList.filter(
        el => el.companyType != 'FIN' && el.companyType != 'CONCRETE_PURCHASER' && el.companyType != 'TRADE_AGENT'
      ); // 过滤供应商&&采购商&&贸易经纪人
  },
  methods: {
    onShowDialog() {
      if (this.isDisabledPayAmount) {
        this.$message.error('账户余额不足');
        return;
      }
      this.$refs.addPaymentForm.validate(async valid => {
        if (valid) {
          // 初始化queryForm.payee数据
          this.queryForm.payee = [];
          // 校验各金额的和是否小于等于总额
          let hasPass = this.onCheckPaymentSum();
          if (!hasPass) {
            return;
          }
          this.tableList.forEach(el => {
            this.queryForm.payee.push({
              payeeCompanyId: el.companyId,
              amount: el.amount || 0
            });
          });
          this.preViewPaymentDialog.visible = true;
        }
      });
    },
    onCheckPaymentSum() {
      // 收款商户“预付金额”的和，需小于等于付款账户的“预付款金融”
      let sum = 0;
      this.tableList.forEach(el => {
        if (typeof el.amount === 'number' && !isNaN(el.amount)) {
          sum = calc.add(sum, el.amount);
        } else {
          return false;
        }
      });
      if (sum > this.queryForm.payAmount) {
        this.$message.error('收款商户“预付金额”的和，需小于等于付款账户的“预付款金额”，请确认。');
        return false;
      }
      return true;
    },
    onEditBlur(row) {
      row.amount = (+row.amount || 0).toFixedNew(2);
    },
    async onSubmitForm() {
      // 项目关系详情
      let result = await axios.post(api.advanceRecharge, this.queryForm);
      this.preViewPaymentDialog.visible = false;
      this.onJumpList();
    },
    onJumpList() {
      this.$router.push({
        path: `/advance/payment/list`
      });
    }
  },
  watch: {
    'queryForm.payAmount'(newVal, oldVal) {
      // console.log(newVal, 'newVal');
      if (!Validator.number(newVal, false)) {
        this.tableList.forEach(el => (el.amount = 0));
        return;
      }
      if (newVal > this.advanceAmount) {
        this.tableList.forEach(el => (el.amount = 0));
        return;
      }
      this.tableList = this.tableList.map(el => {
        let _amount = calc.divide(el.paymentScale || 0, 100);
        _amount = calc.multiply(_amount, newVal).toFixedNew(2);
        return {
          ...el,
          amount: _amount
        };
      });
    }
  }
};
</script>
<style scoped lang="postcss">
.advance-payment-form {
  .el-input {
    width: 200px;
  }
}
</style>
