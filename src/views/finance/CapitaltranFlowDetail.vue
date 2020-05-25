<template>
  <layout navActive="finance">
    <div class="capital-order-detail">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>资金明细</el-breadcrumb-item>
        <el-breadcrumb-item to="/capital/tranflow/list">交易流水</el-breadcrumb-item>
        <el-breadcrumb-item>交易流水详情</el-breadcrumb-item>
      </el-breadcrumb>

      <div class="detail-hander-panel">
        <div class="detail-hander-content">
          <span class="font-label">交易流水号：</span>
          <span class="font-default">{{ detail.gatewayFlowCode }}</span>
          <span class="font-label ml-40">交易状态：</span>
          <span>{{ detail.transStatus | valueToLabel(txStatArr) }}</span>
        </div>
        <div class="detail-hander-toolbtn">
          <el-button type="primary" @click="onJumpBack">返回</el-button>
        </div>
      </div>
      <!-- 交易流水详情 -->
      <div class="segment">
        <div class="segment-header">
          <span>交易流水详情</span>
        </div>
        <div class="segment-area Info-segment">
          <el-form ref="form" :model="detail" label-width="100px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="交易时间">
                  <span>{{ detail.gmtCreated | dateFormat('YYYY-MM-DD HH:mm:ss') }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="金融订单编号">
                  <span>{{ detail.transBatchNo }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="第三方流水号">
                  <span>{{ detail.thirdCode }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="贸易结算单号">
                  <span>{{ detail.businessNo }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="交易用途">
                  <span>{{ detail.businessType | valueToLabel(transUseageArr) }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="交易类型">
                  <span>{{ detail.transType | valueToLabel(txTypeArr) }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="付款方账号">
                  <span>{{ detail.fromAccNo }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="托管银行">
                  <span>{{ detail.fromChlType | valueToLabel(chlTypeArr) }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="付款方名称">
                  <span>{{ detail.fromAccName }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="交易金额">
                  <span class="font-orange">{{ detail.transAmt | thousands(2) }}</span>
                  <span class="ml-5" v-if="detail.transAmt ">元</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="收款方账号">
                  <span>{{ detail.toAccNo }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="支付方式">
                  <span>{{ detail.payMethod | valueToLabel(paymentMethodArr) }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="收款方名称">
                  <span>{{ detail.toAccName }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="备注">
                  <span>{{ detail.transDesc }}</span>
                </el-form-item>
              </el-col>
            </el-row>
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

export default {
  data() {
    return {
      paramsId: '',
      //交易用途：1:采购货款  2:加工费   3:服务费  4:砂石材料费  5:水泥材料费  6:物流运输费  7:提现  8:银行手续费 9:业务服务费
      transUseageArr: [], //交易用途筛选项
      //交易类型:1支付2充值3提现4退款5转账6冻结7解冻8外部支付9托管支付
      txTypeArr: [], // 交易类型筛选项
      //交易明细状态:0初始化1交易成功2交易失败 ,
      txStatArr: [], //交易状态筛选项
      //支付方式：1余额支付2信用支付3支付宝4微信5易宝
      paymentMethodArr: [], //支付方式
      //0未签约3华夏 ,
      chlTypeArr: [],
      detail: {}
    };
  },
  async created() {
    this.paramsId = this.$route.params.id || '';
    //获取字典
    const dict = await utils.getSysDict();
    this.transUseageArr = dict.finance_trans_useage; // 交易用途筛选项
    this.txTypeArr = dict.trans_type; // 交易类型筛选项
    this.txStatArr = dict.trans_status; // 交易状态筛选项
    this.paymentMethodArr = dict.payment_method;
    this.chlTypeArr = dict.chl_type; //托管银行
    // 交易流水详情
    const res = await axios.post(api.queryTransFlowDetail, {
      gatewayFlowCode: this.paramsId
    });
    this.detail = res.data;
  },
  methods: {
    onJumpBack() {
      this.$router.push({
        path: '/capital/tranflow/list'
      });
    }
  }
};
</script>
