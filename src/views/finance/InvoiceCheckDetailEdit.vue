<template>
  <layout navActive="finance">
    <div class="invoice-detail-page">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>发票管理</el-breadcrumb-item>
        <el-breadcrumb-item>发票登记</el-breadcrumb-item>
        <el-breadcrumb-item>维护发票信息</el-breadcrumb-item>
      </el-breadcrumb>

      <div class="detail-hander-panel">
        <div class="detail-hander-content"></div>
        <div class="detail-hander-toolbtn">
          <el-button type="primary" @click="onJumpBack">返回</el-button>
        </div>
      </div>

      <!-- 开票信息 -->
      <div class="segment">
        <div class="segment-header">开票信息</div>
        <div class="segment-area Info-segment">
          <el-form :model="billingInfo" label-width="120px">
            <el-form-item label="开票申请流水号">
              <span>{{ billingInfo.flowCode }}</span>
            </el-form-item>
            <el-form-item label="开票抬头">
              <span>{{ billingInfo.taxPayable }}</span>
            </el-form-item>
            <el-form-item label="开票单位">
              <span>{{ billingInfo.taxCompany }}</span>
            </el-form-item>
            <el-form-item label="开票时段">
              <span>{{ billingInfo.startTime }}</span>
              <span v-if="billingInfo.endTime">至</span>
              <span>{{ billingInfo.endTime }}</span>
            </el-form-item>
            <el-form-item label="运单数合计">
              <span>{{ billingInfo.waybillCount | thousands(2) }}</span>
            </el-form-item>
            <el-form-item label="开票总金额">
              <span>{{ billingInfo.amount | thousands(2) }}</span>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <div class="segment">
        <div class="segment-header">发票登记</div>
        <div class="segment-area">
          <el-form
            ref="invoiceForm"
            :model="invoiceForm"
            :rules="invoiceFormRules"
            :validate-on-rule-change="false"
            label-width="120px"
          >
            <el-form-item label="票据日期" prop="taxTicketTime">
              <el-date-picker
                v-model="invoiceForm.taxTicketTime"
                :picker-options="pickerOptions"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期时间"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="票面金额" prop="amount">
              <el-input v-model="invoiceForm.amount" :maxlength="50" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="发票代码" prop="taxCode">
              <el-input v-model="invoiceForm.taxCode" :maxlength="50" placeholder="请输入发票代码"></el-input>
            </el-form-item>
            <el-form-item label="发票号码" prop="taxNumber">
              <el-input v-model="invoiceForm.taxNumber" :maxlength="50" placeholder="请输入发票号码"></el-input>
            </el-form-item>
            <el-form-item label="发票照片" required>
              <avatar-upload
                ref="taxTicketUrl"
                :hidetip="false"
                :default-files="invoiceForm.taxTicketUrl"
              ></avatar-upload>
            </el-form-item>
            <el-form-item label="登记说明">
              <el-input
                type="textarea"
                v-model="invoiceForm.description"
                :maxlength="140"
                placeholder="请输入登记说明"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">保存</el-button>
              <el-button @click="onJumpBack">返回</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </layout>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/finance.api';
import utils from '@/utils/utils';
import AvatarUpload from '@/components/AvatarUpload';
import Validator from '@/utils/Validator';

import 'viewerjs/dist/viewer.css';
import Viewer from 'viewerjs';

export default {
  components: {
    AvatarUpload
  },
  data() {
    // 发票金额
    var validateAmount = (rule, value, callback) => {
      if (!Validator.isNumber(value)) {
        callback(new Error(rule.message));
      }
      callback();
    };
    return {
      billingInfo: {},
      invoiceForm: {
        amount: '', //发票金额 ,
        description: '', //登记说明  ,
        taxApplyFlowId: '',
        taxCode: '', //发票代码 ,
        taxNumber: '', //发票号码 ,
        taxTicketTime: '', //开票时间 ,
        taxTicketUrl: '', //发票附件地址 ,
        flowCode: ''
      },
      invoiceFormRules: {
        amount: [
          { required: true, message: '请输入发票金额', trigger: 'blur' },
          { validator: validateAmount, message: '请输入有效的发票金额', trigger: 'blur' }
        ],
        taxCode: [{ required: true, message: '请输入发票代码', trigger: 'blur' }],
        taxNumber: [{ required: true, message: '请输入发票号码', trigger: 'blur' }],
        taxTicketTime: [{ required: true, message: '请选择开票时间', trigger: 'change' }]
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      createTimeRange: [],
      invoicePicViewer: null
    };
  },
  async created() {
    this.invoiceForm.taxApplyFlowId = this.$route.params.id; // 税票申请流水主键
    this.invoiceForm.flowCode = this.$route.params.flowCode; // 开票申请流水号
    // 发票登记-开票信息
    const billingRes = await axios.get(api.taxTicketQuery, {
      params: { taxApplyFlowId: this.invoiceForm.taxApplyFlowId }
    });
    this.billingInfo = billingRes.data;
    // 复写发票登记信息
    this.invoiceForm = {
      ...this.invoiceForm,
      amount: this.billingInfo.amount || '', //发票金额 ,
      description: this.billingInfo.description || '', //登记说明  ,
      taxCode: this.billingInfo.taxCode || '', //发票代码 ,
      taxNumber: this.billingInfo.taxNumber || '', //发票号码 ,
      taxTicketTime: this.billingInfo.taxTicketTime || '', //开票时间 ,
      taxTicketUrl: this.billingInfo.taxTicketUrl || '' //发票附件地址 ,
    };
  },
  methods: {
    async onSubmit() {
      this.$refs.invoiceForm.validate(async valid => {
        if (valid) {
          const taxTicketUrl = this.$refs.taxTicketUrl.getUploadFiles();
          if (!taxTicketUrl) {
            this.$message.error('请上传发票照片');
            return;
          }
          this.invoiceForm.taxTicketUrl = taxTicketUrl;
          // 保存
          await axios.post(api.saveTaxTicket, this.invoiceForm);
          this.$message.success('保存成功');
          this.onJumpBack();
        }
      });
    },
    onJumpBack() {
      this.$router.push({
        path: '/invoice/check/list'
      });
    }
  }
};
</script>
