<template>
  <layout navActive="mall">
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/order/list' }">订单列表</el-breadcrumb-item>
      <el-breadcrumb-item :to="'/order/detail/' + protocolOrderId">订单详情</el-breadcrumb-item>
      <el-breadcrumb-item>余额退款</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="payment-header">
      <span class="font-label">订单编号：</span>
      <span class="font-green">{{ protocolOrderSn }}</span>
    </div>
    <div class="segment payment-segment">
      <div class="segment-area">
        <div class="payment-sub-header">支付类型：<span class="font-orange">订单余款退款</span></div>
        <el-row>
          <el-col :span="24">
            <div class="segment-label">已收到货款</div>
            <div class="segment-content">
              <span>{{ queryData.payCoalPrice | thousands(2) }}</span> 元
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="segment-label">订单余款金额</div>
            <div class="segment-content">
              <span>{{ queryData.surplusCoalPrice | thousands(2) }}</span> 元
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="segment-label">本订单应退金额</div>
            <div class="segment-content">
              <span>{{ queryData.refundPrice | thousands(2) }}</span> 元
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="segment-label">支付方式</div>
            <div class="segment-content">
              账户余额支付
              <span class="ml-20">
                可用余额
                <span class="font-red ml-5 mr-5 font-red">{{ queryData.balance | thousands(2) }}</span>
                元
              </span>
            </div>
          </el-col>
        </el-row>
        <el-row class="h-auto">
          <el-col :span="24">
            <div class="segment-content mt-10">
              <el-button type="primary" @click="onConfirmPay">确认支付</el-button>
              <router-link class="ml-10" :to="'/order/detail/' + protocolOrderId">
                <el-button>返 回</el-button>
              </router-link>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </layout>
</template>
<script>
import axios from '@/utils/axios';
import api from '@/api/mall.api';

export default {
  data() {
    return {
      protocolId: '',
      protocolOrderSn: '',
      protocolOrderId: '',
      queryData: {}
    };
  },
  async created() {
    this.protocolId = this.$route.params.protocolId;
    this.protocolOrderSn = this.$route.params.protocolOrderSn;
    this.protocolOrderId = this.$route.params.protocolOrderId;

    let response = await axios.get(api.displayRefundPay, {
      params: { protocolOrderId: this.protocolOrderId }
    });
    this.queryData = response.data;
  },
  methods: {
    // 确认支付
    onConfirmPay() {
      this.$confirm('是否将订单余额退还给采购商？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const sendOption = {
          protocolOrderId: this.protocolOrderId,
          refundPrice: this.queryData.refundPrice
        };
        axios.post(api.refundPay, sendOption).then(result => {
          this.$message.success('退款成功');
          this.$router.push('/order/detail/' + this.protocolOrderId);
        });
      });
    }
  }
};
</script>
<style lang="postcss">
.segment.payment-segment {
  border: none;
  .segment-label {
    width: 120px;
    text-align: left;
    padding-right: 20px;
  }
}
.payment-header {
  padding-top: 15px;
  padding-left: 13px;
  line-height: 36px;
  font-size: 20px;
}
.payment-sub-header {
  padding-bottom: 20px;
  margin-bottom: 16px;
  border-bottom: 1px solid #e2e7ed;
}
</style>
