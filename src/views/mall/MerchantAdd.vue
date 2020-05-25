<template>
  <layout navActive="mall">
    <div class="merchant-form-page">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>供应链管理</el-breadcrumb-item>
        <template v-if="merchantType === 'MERCHANT'">
          <el-breadcrumb-item :to="backRouter">供应链商户管理</el-breadcrumb-item>
          <el-breadcrumb-item>新增商户</el-breadcrumb-item>
        </template>
        <template v-else>
          <el-breadcrumb-item :to="backRouter">平台公司管理</el-breadcrumb-item>
          <el-breadcrumb-item>新增平台公司</el-breadcrumb-item>
        </template>
      </el-breadcrumb>
      <div class="merchant-form-content">
        <el-form
          :model="merchantForm"
          :rules="addAccountRules"
          :validate-on-rule-change="false"
          label-position="right"
          label-width="170px"
          ref="merchantForm"
        >
          <!--基本信息-->
          <div class="item-header">企业信息</div>
          <div class="panels">
            <el-row>
              <el-col :span="12">
                <el-form-item label="企业名称" prop="fullName">
                  <el-input
                    v-model.trim="merchantForm.fullName"
                    placeholder="请输入企业名称"
                    clearable
                    maxlength="20"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="统一社会信用代码" prop="socialCreditCode">
                  <el-input
                    v-model.trim="merchantForm.socialCreditCode"
                    placeholder="请输入统一社会信用代码"
                    maxlength="18"
                    clearable
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="企业联系地址" prop="contactAddress">
                  <el-input
                    v-model.trim="merchantForm.contactAddress"
                    placeholder="请输入企业联系地址"
                    type="textarea"
                    :autosize="{ minRows: 1, maxRows: 3 }"
                    maxlength="30"
                    style="width: 240px;"
                    clearable
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="企业电话" prop="loginAdminName">
                  <el-input
                    v-model.trim="merchantForm.loginAdminName"
                    placeholder="请输入企业电话"
                    maxlength="11"
                    clearable
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="营业执照有效期" prop="licenseDate">
                  <el-date-picker
                    v-model="merchantForm.licenseDate"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    clearable
                    style="width:240px"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="法定代表人姓名" prop="legalPersonName">
                  <el-input
                    v-model.trim="merchantForm.legalPersonName"
                    placeholder="请输入法定代表人姓名"
                    maxlength="6"
                    clearable
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="法定代表人身份证号" prop="legalPersionIdentity">
                  <el-input
                    v-model.trim="merchantForm.legalPersionIdentity"
                    placeholder="请输入法定代表人身份证号"
                    maxlength="18"
                    clearable
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="贸易商类型" prop="companyType">
                  <el-select
                    v-model="merchantForm.companyType"
                    placeholder="请选择贸易商类型"
                    @change="onCompanyTypeChange"
                    style="width:240px"
                    :disabled="merchantType === 'FIN'"
                    clearable
                  >
                    <el-option
                      v-for="item in companyTypeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="纳税人类型" prop="taxpayerType">
                  <el-select
                    v-model="merchantForm.taxpayerType"
                    placeholder="请选择纳税人类型"
                    @change="onCompanyTypeChange"
                    style="width:240px"
                    clearable
                    disabled
                  >
                    <el-option
                      v-for="item in taxpayerTypeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <!-- 联系人信息 -->
          <div class="item-header">联系人信息</div>
          <div class="panels">
            <el-row>
              <el-col :span="12">
                <el-form-item label="企业联系人" prop="contactPeople">
                  <el-input
                    v-model.trim="merchantForm.contactPeople"
                    placeholder="请输入企业联系人姓名"
                    maxlength="6"
                    clearable
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="联系人手机号" prop="contactNumber">
                  <el-input
                    v-model.trim="merchantForm.contactNumber"
                    placeholder="请输入联系人手机号"
                    maxlength="11"
                    clearable
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="联系人电子邮箱" prop="email">
                  <el-input
                    v-model.trim="merchantForm.email"
                    placeholder="请输入电子邮箱"
                    maxlength="32"
                    clearable
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <!--证件及其他文件-->
          <div class="item-header">证件及其他文件</div>
          <div class="panels">
            <el-row class="exceed-label ml-30">
              <!-- 营业执照 -->
              <el-col :span="4">
                <el-form-item label class="remove-label-left">
                  <div class="mb-10">
                    <span class="font-red mr-5">*</span>营业执照
                  </div>
                  <avatar-upload ref="licensePath" :hidetip="true"></avatar-upload>
                </el-form-item>
              </el-col>
              <!-- 法人身份证正面 -->
              <el-col :span="4">
                <el-form-item label class="remove-label-left">
                  <div class="mb-10">
                    <span class="font-red mr-5">*</span>法人身份证正面
                  </div>
                  <avatar-upload ref="idCardPath" :hidetip="true"></avatar-upload>
                </el-form-item>
              </el-col>
              <!-- 法人身份证背面 -->
              <el-col :span="4">
                <el-form-item label class="remove-label-left">
                  <div class="mb-10">
                    <span class="font-red mr-5">*</span>法人身份证背面
                  </div>
                  <avatar-upload ref="idCardBPath" :hidetip="true"></avatar-upload>
                </el-form-item>
              </el-col>
              <!-- 其他证件 -->
              <el-col :span="4">
                <el-form-item label class="remove-label-left">
                  <div class="mb-10">其他证件</div>
                  <avatar-upload ref="otherPath" :hidetip="true"></avatar-upload>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="16" type="flex" justify="flex-start" align="middle">
                <div class="font-gray upload-tips">
                  请选择
                  <span class="font-red">jpg,png,jpeg</span>格式的照片上传,图片质量最大为
                  <span class="font-red">{{ imgSize }}M</span>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-form>
        <div class="text-l mt-20">
          <el-button type="primary" @click="onSubmitFrom">保存</el-button>
          <router-link :to="backRouter">
            <el-button class="ml-10">返回</el-button>
          </router-link>
        </div>
      </div>
    </div>
  </layout>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/mall.api';
import Validator from '@/utils/Validator';
import utils from '@/utils/utils';
import AvatarUpload from '@/components/AvatarUpload';

export default {
  components: { AvatarUpload },
  data() {
    //企业名称
    var validateFullname = (rule, value, callback) => {
      if (!Validator.chinese(value)) {
        callback(new Error(rule.message));
      }
      callback();
    };
    // 统一社会信用编码验证
    var validateUSCode = (rule, value, callback) => {
      if (!Validator.companyCode(value)) {
        callback(new Error(rule.message));
      }
      callback();
    };
    //企业联系地址
    var validateContactAddress = (rule, value, callback) => {
      if (!Validator.chinese(value, 1, 30)) {
        callback(new Error(rule.message));
      }
      callback();
    };
    //个人姓名
    var validatePersonName = (rule, value, callback) => {
      if (!Validator.chinese(value, 2, 6)) {
        callback(new Error(rule.message));
      }
      callback();
    };
    // 手机号验证
    var validateMoble = (rule, value, callback) => {
      if (!Validator.phone(value)) {
        callback(new Error(rule.message));
      }
      callback();
    };
    // 身份证号验证
    var validateLegalID = (rule, value, callback) => {
      console.log(Validator.idCard(value).isTrue);
      if (!Validator.idCard(value).isTrue) {
        callback(new Error(rule.message));
      }
      callback();
    };

    return {
      merchantType: '', // 账户类型  MERCHANT 或者 FIN
      backRouter: '/merchant/list', // 返回列表对应路由
      companyTypeOptions: [],
      taxpayerTypeOptions: [],
      merchantForm: {
        fullName: '', //企业名称
        socialCreditCode: '', //统一社会信用代码
        contactAddress: '', //企业联系地址
        contactNumber: '', //企业电话 (只进行普通数字的校验即可，这样既可以输入电话号码也可以输入手机号码)
        licenseDate: '', //营业执照有效期
        legalPersonName: '', //法定代表人姓名
        legalPersionIdentity: '', //法定代表人身份证号
        companyType: '', //贸易商类型
        taxpayerType: '', //纳税人类型

        contactPeople: '', //企业联系人
        loginAdminName: '', //联系人手机号
        email: '', //电子邮箱

        licensePath: '', //营业执照
        idCardPath: '', //法人身份证正面
        idCardBPath: '', //法人身份证背面
        otherPath: '' //其他证件
      }, // 提交表单数据
      addAccountRules: {
        fullName: [
          { required: true, message: '请输入企业名称', trigger: 'blur' },
          {
            validator: validateFullname,
            message: '请输入20位以内的中文字符',
            trigger: 'blur'
          }
        ],
        socialCreditCode: [
          { required: true, message: '请输入统一社会信用代码', trigger: 'blur' },
          {
            validator: validateUSCode,
            message: '请输入18位有效的统一社会信用代码',
            trigger: 'blur'
          }
        ],
        contactAddress: [{ required: true, message: '请输入企业联系地址', trigger: 'blur' }],
        contactNumber: [
          { required: true, message: '请输入联系人手机号', trigger: 'blur' },
          {
            validator: validateMoble,
            message: '请输入有效的手机号码',
            trigger: 'blur'
          }
        ],
        licenseDate: [{ required: true, message: '请选择营业执照有效期', trigger: 'blur' }],
        legalPersonName: [
          { required: true, message: '请输入法定代表人姓名', trigger: 'blur' },
          {
            validator: validatePersonName,
            message: '请输入2至6位中文字符',
            trigger: 'blur'
          }
        ],
        legalPersionIdentity: [
          { required: true, message: '请输入法定代表人身份证号', trigger: 'blur' },
          { validator: validateLegalID, message: '请输入18位有效身份证', trigger: 'blur' }
        ],
        companyType: [{ required: true, message: '请选择贸易商类型', trigger: 'blur' }],
        taxpayerType: [{ required: true, message: '请选择贸易商类型', trigger: 'blur' }],

        contactPeople: [
          { required: true, message: '请输入企业联系人', trigger: 'blur' },
          {
            validator: validatePersonName,
            message: '请输入2至6位中文字符',
            trigger: 'blur'
          }
        ],
        loginAdminName: [
          { required: true, message: '请输入企业电话', trigger: 'blur' },
          { validator: validateMoble, message: '请输入有效的手机号码', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入电子邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的电子邮箱', trigger: 'blur' }
        ]
      }, // 表单校验规则
      imgSize: Validator.imgLimit
    };
  },
  async created() {
    this.merchantType = this.$route.query.merchantType || 'MERCHANT';

    let dict = await utils.getSysDict();
    this.taxpayerTypeOptions = dict.taxpayer_type;

    // 新增供应链 不可选
    if (this.merchantType === 'FIN') {
      this.companyTypeOptions = dict.company_type;
      this.merchantForm.companyType = 'FIN';
      this.merchantForm.taxpayerType = '10';
      this.backRouter = '/merchant/fin/list';
    } else {
      this.companyTypeOptions = dict.company_type.filter(el => el.value !== 'FIN');
    }
  },
  methods: {
    onSubmitFrom() {
      this.$refs.merchantForm.validate(async valid => {
        if (valid) {
          const imageRefs = [
            { ref: 'licensePath', msg: '请上传营业执照' },
            { ref: 'idCardPath', msg: '请上传法人身份证正面' },
            { ref: 'idCardBPath', msg: '请上传法人身份证背面' },
            { ref: 'otherPath', msg: '请上传其他证件' }
          ];
          let message = '';
          for (let index = 0; index < imageRefs.length; index++) {
            const element = imageRefs[index];
            this.merchantForm[element.ref] = this.$refs[element.ref].getUploadFiles();
            if (!this.merchantForm[element.ref] && element.ref !== 'otherPath') {
              message = element.msg;
              break;
            }
          }
          if (message) {
            this.$message.error(message);
            return;
          }
          await axios.post(api.saveCompany, this.onDataAdapter(this.merchantForm));
          this.$message.success('新增成功');
          this.$router.push({ path: this.backRouter });
        }
      });
    },
    //同步纳税人类型
    onCompanyTypeChange(type) {
      if (type === 'SANDSTONE_SUPPLIER' || type === 'AGENT' || type === 'TRADE_AGENT') {
        this.merchantForm.taxpayerType = '20';
      } else {
        this.merchantForm.taxpayerType = '10';
      }
    },
    onDataAdapter(merchantForm) {
      return {
        fullName: merchantForm.fullName, //企业名称
        socialCreditCode: merchantForm.socialCreditCode, //统一社会信用代码
        contactAddress: merchantForm.contactAddress, //企业联系地址
        contactNumber: merchantForm.contactNumber, //企业电话 (只进行普通数字的校验即可，这样既可以输入电话号码也可以输入手机号码)
        licenseStartTime: merchantForm.licenseDate[0], //营业执照有效期开始时间
        licenseEndTime: merchantForm.licenseDate[1], ////营业执照有效期结束时间
        legalPersonName: merchantForm.legalPersonName, //法定代表人姓名
        legalPersionIdentity: merchantForm.legalPersionIdentity, //法定代表人身份证号
        companyType: merchantForm.companyType, //贸易商类型
        taxpayerType: merchantForm.taxpayerType, //纳税人类型
        isSelf: 'SELF_NOT',
        contactPeople: merchantForm.contactPeople, //企业联系人
        loginAdminName: merchantForm.loginAdminName, //联系人手机号
        email: merchantForm.email, //电子邮箱

        licensePath: merchantForm.licensePath, //营业执照
        idCardPath: merchantForm.idCardPath, //法人身份证正面
        idCardBPath: merchantForm.idCardBPath, //法人身份证背面
        otherPath: merchantForm.otherPath //其他证件
      };
    }
  }
};
</script>
<style lang="postcss" >
.merchant-form-page {
  .merchant-form-content {
    padding: 0 10px;
    .el-form {
      .el-input {
        width: 240px;
      }
    }
    .el-radio {
      margin-right: 20px;
      &:nth-last-child(1) {
        margin-right: 0;
      }
    }
    .bank-account-section {
      .el-input {
        width: 300px;
      }
    }
    .upload-tips {
      text-align: left;
      margin: 10px 0 10px 38px;
    }
  }
  .remove-label-left {
    padding: 0 10px;
    .el-form-item__content {
      margin-left: 0 !important;
    }
  }
}
</style>
