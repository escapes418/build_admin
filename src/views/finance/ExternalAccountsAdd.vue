<template>
  <layout navActive="finance">
    <div class="page-extemal-accounts-add">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>商户管理</el-breadcrumb-item>
        <el-breadcrumb-item to="/externalacc/list">外部商户列表</el-breadcrumb-item>
        <el-breadcrumb-item>签约</el-breadcrumb-item>
      </el-breadcrumb>

      <div class="extemal-accounts-content">
        <el-form
          :model="addAccountFrom"
          :rules="addAccountRules"
          :validate-on-rule-change="false"
          label-position="right"
          label-width="135px"
          ref="addAccountFrom"
        >
          <!--基本信息-->
          <div class="item-header">基本信息</div>
          <div class="panels">
            <el-row>
              <el-col :span="12">
                <el-form-item label="签约编号" prop="agentId">
                  <el-input v-model.trim="addAccountFrom.agentId" disabled clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="客户类型" prop="agentType">
                  <el-select
                    v-model="addAccountFrom.agentType"
                    placeholder="请选择客户类型"
                    style="width:140px;"
                    disabled
                    clearable
                  >
                    <el-option
                      v-for="agentType in agentTypeOptions"
                      :key="agentType.key"
                      :label="agentType.value"
                      :value="agentType.key"
                      style="width:140px;"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item label="企业名称" prop="agentName">
                  <el-input
                    v-model.trim="addAccountFrom.agentName"
                    :title="addAccountFrom.agentName"
                    maxlength="20"
                    disabled
                    clearable
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="签约渠道" prop="chlType">
                  <el-select
                    v-model="addAccountFrom.chlType"
                    placeholder="请选择签约渠道"
                    style="width:140px;"
                    clearable
                  >
                    <el-option
                      v-for="chlType in chlTypeOptions"
                      :key="chlType.value"
                      :label="chlType.label"
                      :value="chlType.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <!--子账户相关信息-->
          <div class="item-header">子账户相关信息</div>
          <div class="panels">
            <el-row>
              <el-col :span="7">
                <el-form-item label="企业证件类型" prop="entcertType">
                  <el-select
                    v-model="addAccountFrom.entcertType"
                    placeholder="请选择证件类型"
                    style="width:140px;"
                    clearable
                  >
                    <el-option label="组织机构代码证" :value="17" :disabled="isPerson"></el-option>
                    <el-option label="营业执照" :value="16" :disabled="isPerson"></el-option>
                    <el-option label="身份证" :value="10" :disabled="!isPerson"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="9" class="col-item-c">
                <el-form-item
                  label="企业证件号"
                  prop="entcertCode"
                  :rules="
                    addAccountFrom.entcertType === 10 ? addAccountRules.legalCertCode : addAccountRules.entcertCode
                  "
                >
                  <el-input v-model.trim="addAccountFrom.entcertCode" maxlength="20" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="企业证件有效期" prop="entcertValidDate">
                  <el-date-picker
                    v-model="addAccountFrom.entcertValidDate"
                    type="date"
                    placeholder="选择日期"
                    format="yyyy-MM-dd"
                    value-format="timestamp"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="7">
                <el-form-item label="法人姓名" required>
                  <el-input v-model.trim="addAccountFrom.legalName" disabled clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="9" class="col-item-c">
                <el-form-item label="法人身份证号" required>
                  <el-input v-model.trim="addAccountFrom.legalCertCode" disabled clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="法人证件有效期" prop="legalCertValidDate">
                  <el-date-picker
                    v-model="addAccountFrom.legalCertValidDate"
                    type="date"
                    placeholder="选择日期"
                    format="yyyy-MM-dd"
                    value-format="timestamp"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="7">
                <el-form-item label="法人固定电话" prop="legalTel">
                  <el-input v-model.trim="addAccountFrom.legalTel" maxlength="14" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="9" class="col-item-c">
                <el-form-item label="法人移动电话" prop="legalMobile">
                  <el-input
                    v-model.trim="addAccountFrom.legalMobile"
                    type="text"
                    maxlength="20"
                    clearable
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="法人联系地址" prop="legalAddress">
                  <el-input
                    v-model.trim="addAccountFrom.legalAddress"
                    type="textarea"
                    :autosize="{ minRows: 1, maxRows: 3 }"
                    maxlength="30"
                    style="width: 220px;"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <!--结算账户相关信息-->
          <div class="item-header">结算账户相关信息</div>
          <div class="panels">
            <el-row>
              <el-col :span="7">
                <el-form-item label="结算银行">
                  <el-select
                    v-model.trim="addAccountFrom.bankCode"
                    filterable
                    placeholder="请选择结算银行"
                    clearable
                  >
                    <el-option
                      v-for="(item,index) in clearBankOptions"
                      :key="index"
                      :label="item.bankName"
                      :value="item.bankCode"
                      :title="item.bankName"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="9" class="col-item-c">
                <el-form-item label="结算账户名">
                  <el-input v-model.trim="addAccountFrom.clearAcctName" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="结算账户号">
                  <el-input
                    v-model.trim="addAccountFrom.clearAcct"
                    type="text"
                    maxlength="40"
                    clearable
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <!--电子银行信息-->
          <div class="item-header">电子银行信息</div>
          <div class="panels">
            <el-row>
              <el-col :span="7">
                <!-- 电子银行账号 -->
                <el-form-item label="账号" prop="eAcctNo">
                  <el-input
                    v-model.trim="addAccountFrom.eAcctNo"
                    :title="addAccountFrom.eAcctNo"
                    disabled
                    clearable
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="9" class="col-item-c">
                <!-- 电子银行账户名 -->
                <el-form-item label="账户名" prop="eAcctName">
                  <el-input
                    v-model.trim="addAccountFrom.eAcctName"
                    :title="addAccountFrom.eAcctName"
                    disabled
                    clearable
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <!-- 电子银行账户开户行 -->
                <el-form-item label="开户行" prop="payBankName">
                  <el-input
                    v-model.trim="addAccountFrom.payBankName"
                    :title="addAccountFrom.payBankName"
                    disabled
                    clearable
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <el-row class="footer-btn-box">
            <el-col :span="24">
              <el-form-item>
                <el-button type="primary" @click="onSubmitFrom">保存</el-button>
                <el-button @click="onJumpList">返回</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
  </layout>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/finance.api';
import Validator from '@/utils/Validator';

export default {
  data() {
    // 身份证号验证
    var validateLegalID = (rule, value, callback) => {
      if (!Validator.idCard(value).isTrue) {
        callback(new Error(rule.message));
      }
      callback();
    };
    //组织机构或营业执照
    var validateEntcertCode = (rule, value, callback) => {
      if (value.length < 10 || value.length > 20) {
        callback(new Error(rule.message));
      }
      callback();
    };
    // 结算账户号验证
    var validateBankId = (rule, value, callback) => {
      if (!Validator.bankCard(value)) {
        callback(new Error(rule.message));
      }
      callback();
    };
    //法人移动电话
    var validateMobile = (rule, value, callback) => {
      if (!Validator.phone(value)) {
        callback(new Error(rule.message));
      }
      callback();
    };
    //企业电话
    var validateTel = (rule, value, callback) => {
      //7-14位   手机 固话都可以
      let reg = new RegExp('^[0-9]{7,14}$');
      if (!reg.test(value)) {
        callback(new Error(rule.message));
      }
      callback();
    };
    return {
      groupNo: '',
      accountType: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      //客户类型 1：个人  2：企业
      agentTypeOptions: [{ key: 1, value: '个人' }, { key: 2, value: '企业' }],
      chlTypeOptions: [{ label: '华夏直连', value: 3 }],
      addAccountFrom: {
        agentId: '', //签约编号 ,
        agentType: '', //用户账户类型 1个人 2企业 ,
        agentName: '', // 企业名称 ,
        chlType: '', //渠道：1华夏，2兴业，5 武汉兴业 ,
        entcertType: '', //证件种类 10:身份证 16：营业执照；17：组织机构代码证
        entcertCode: '', //企业证件号 ,
        entcertValidDate: '', //企业证件有效期
        legalName: '', //法人姓名 ,
        legalCertCode: '', //法人证件号码 ,
        legalCertValidDate: '', //法人证件有效期
        legalTel: '', //法人固定电话 ,
        legalMobile: '', //法人移动电话 ,
        legalAddress: '', //法人联系地址 ,

        clearAcct: '', //结算账户号 ,
        clearAcctName: '', //结算账户名 ,
        bankCode: '', //结算银行名 ,

        payBankName: '', //电子银行账户开户行
        eAcctName: '', //电子银行账户名
        eAcctNo: '' //电子银行账户
      }, // 提交表单数据
      addAccountRules: {
        clearAcctName: [{ required: true, message: '请输入结算账户名', trigger: 'blur' }],
        clearAcct: [
          { required: true, message: '请输入结算账户号', trigger: 'blur' },
          { validator: validateBankId, message: '请输入有效的结算账户号', trigger: 'blur' }
        ],
        entcertCode: [
          { required: true, message: '请输入企业证件号', trigger: 'blur' },
          { validator: validateEntcertCode, message: '企业证件号10位至20位', trigger: 'blur' }
        ],
        entcertType: [{ required: true, message: '请选择企业证件类型', trigger: 'change' }],
        bankCode: [{ required: true, message: '请选择结算银行', trigger: 'change' }],
        legalCertValidDate: [{ required: true, message: '请输入法人证件有效期', trigger: 'blur' }],
        entcertValidDate: [{ required: true, message: '请输入企业证件有效期', trigger: 'blur' }],
        legalCertCode: [
          { required: true, message: '请输入身份证号', trigger: 'blur' },
          { validator: validateLegalID, message: '请输入18位有效身份证号', trigger: 'blur' }
        ],
        agentType: [{ required: true, message: '请选择客户类型', trigger: 'change' }],
        chlType: [{ required: true, message: '请选择签约渠道', trigger: 'change' }],
        legalMobile: [
          { required: true, message: '请输入移动电话', trigger: 'blur' },
          { validator: validateMobile, message: '请输入有效移动电话', trigger: 'blur' }
        ],
        legalAddress: [{ required: true, message: '请输入法人联系地址', trigger: 'blur' }],
        //企业固定电话
        legalTel: [
          { required: true, message: '请输入法人固定电话', trigger: 'blur' },
          { validator: validateTel, message: '请输入有效的固定电话', trigger: 'blur' }
        ]
      }, // 表单校验规则
      clearBankOptions: [], // 结算银行列表
      isPerson: false // 客户类型为个人
    };
  },
  async created() {
    this.groupNo = this.$route.params.id;
    this.accountType = this.$route.query.accountType;
    // 获取银行列表
    const clearBanks = await axios.get(api.queryBankList);
    this.clearBankOptions = clearBanks.data;

    // 获取签约信息
    const signResult = await axios.post(api.singBankApplyInfo, {
      groupNo: this.groupNo,
      accountType: this.accountType
    });
    this.addAccountFrom = signResult.data;
    this.initParams();
  },
  methods: {
    async onSubmitFrom() {
      this.$refs.addAccountFrom.validate(async valid => {
        if (valid) {
          // 提交表单数据
          let payload = { ...this.addAccountFrom, groupNo: this.groupNo, accountType: this.accountType };
          await axios.post(api.saveBankApply, payload);
          this.onJumpList();
        }
      });
    },
    onJumpList() {
      this.$router.push({ path: '/externalacc/list' });
    },
    initParams() {
      //isPerson
      this.isPerson = this.addAccountFrom.agentType === 1 ? true : false;
      //当前日期范围
      if (this.addAccountFrom.legalCertValidDate === 0) {
        this.addAccountFrom.legalCertValidDate = '';
      }
      if (this.addAccountFrom.entcertValidDate === 0) {
        this.addAccountFrom.entcertValidDate = '';
      }
      //签约渠道 暂时只有华夏直连
      if (this.addAccountFrom.chlType === 0) {
        this.addAccountFrom.chlType = 3;
      }
      //企业证件类型
      if (this.addAccountFrom.entcertType === 0) {
        this.addAccountFrom.entcertType = '';
      }
    }
  }
};
</script>

<style lang="postcss">
.extemal-accounts-content {
  .el-form {
    .el-select {
      .el-input {
        width: 220px;
      }
    }
    .el-input {
      width: 220px;
    }
    .col-item-c {
      .el-form-item {
        margin-left: 20px;
      }
    }
    .footer-btn-box {
      .el-form-item__content {
        margin-left: 0 !important;
      }
    }
  }
}
</style>
