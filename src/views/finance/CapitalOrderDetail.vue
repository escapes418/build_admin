<template>
  <layout navActive="finance">
    <div class="capital-order-detail">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>资金明细</el-breadcrumb-item>
        <el-breadcrumb-item to="/capital/order/list">订单列表</el-breadcrumb-item>
        <el-breadcrumb-item>金融订单详情</el-breadcrumb-item>
      </el-breadcrumb>

      <div class="detail-hander-panel">
        <div class="detail-hander-content">
          <span class="font-label">金融订单编号：</span>
          <span class="font-default">{{ CapitalOrderDetailData.paymentInfo.paymentSn }}</span>
          <span class="font-label ml-40">支付状态：</span>
          <span>{{ CapitalOrderDetailData.paymentInfo.paymentStatus | valueToLabel(paymentStatusOptions) }}</span>
        </div>
        <div class="detail-hander-toolbtn">
          <el-button type="primary" @click="onCompensateOrder" :disabled="isDisabled">补偿支付</el-button>
          <el-button type="primary" @click="onJumpBack">返回</el-button>
        </div>
      </div>
      <!-- 金融订单详情 -->
      <div class="segment">
        <div class="segment-header">
          <span>金融订单详情</span>
        </div>
        <div class="segment-area Info-segment">
          <el-form ref="form" :model="CapitalOrderDetailData.paymentInfo" label-width="100px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="交易时间">
                  <span>{{ CapitalOrderDetailData.paymentInfo.gmtCreate | dateFormat('YYYY-MM-DD HH:mm:ss') }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="业务编号">
                  <span>{{ CapitalOrderDetailData.paymentInfo.businessSn }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="交易金额">
                  <span
                    class="font-orange"
                  >{{ CapitalOrderDetailData.paymentInfo.paymentPrice | thousands(2) }}</span>
                  <span class="ml-5" v-if="CapitalOrderDetailData.paymentInfo.paymentPrice">元</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="订单备注">
                  <span>{{ CapitalOrderDetailData.paymentInfo.paymentDesc }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="付款方名称">
                  <span>{{ CapitalOrderDetailData.paymentInfo.payerCompanyName }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="收款方名称">
                  <span>{{ CapitalOrderDetailData.paymentInfo.payeeCompanyName }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>

      <div class="item-header">金融订单成分</div>
      <div class="conn-table-panel">
        <el-table :data="CapitalOrderDetailData.payOrders" border>
          <el-table-column type="index" width="50" label="序号"></el-table-column>
          <el-table-column
            label="交易流水号"
            prop="gatewayFlowCode"
            min-width="210"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span
                class="font-default pointer"
                @click="onJumpCapitalFlowInfo(scope.row)"
              >{{ scope.row.gatewayFlowCode }}</span>
            </template>
          </el-table-column>
          <el-table-column label="交易类型" prop="transType" min-width="110" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ scope.row.transType | valueToLabel(transTypeOptions) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="交易用途" prop="businessType" min-width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ scope.row.businessType | valueToLabel(businessTypeOptions) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="交易金额(元)" prop="transAmt" min-width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="font-orange">{{ scope.row.transAmt | thousands(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="交易状态" prop="transStatus" min-width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ scope.row.transStatus | valueToLabel(transStatusOptions) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="transDesc" min-width="110" show-overflow-tooltip></el-table-column>
          <el-table-column label="付款方名称" prop="fromAccName" min-width="150" show-overflow-tooltip></el-table-column>
          <el-table-column label="收款方名称" prop="toAccName" min-width="150" show-overflow-tooltip></el-table-column>
        </el-table>
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
      //交易类型:1支付2充值3提现4退款5转账6冻结7解冻8外部支付
      transTypeOptions: [],
      //交易用途 1:采购货款 2:加工费 3:服务费 4:砂石材料费 5:水泥材料费 6:物流运输费 7:提现 8:银行手续费 9:业务服务费 ,
      businessTypeOptions: [],
      //transStatus (string, optional): 交易状态:0初始化1交易成功2交易失败
      transStatusOptions: [],
      //支付状态  [0初始化1交易成功2交易失败3交易处理中]
      paymentStatusOptions: [],
      CapitalOrderDetailData: {
        paymentInfo: {},
        payOrders: []
      },
      isDisabled: true
    };
  },
  async created() {
    this.paramsId = this.$route.params.id || '';
    //获取字典
    let dict = await utils.getSysDict();
    this.transTypeOptions = dict.trans_type;
    this.businessTypeOptions = dict.finance_trans_useage;
    this.paymentStatusOptions = dict.payment_status;
    this.transStatusOptions = dict.trans_status;
    // 金融订单详情
    const res = await axios.post(api.queryPaymentDetail, {
      transBatchNo: this.paramsId
    });
    this.CapitalOrderDetailData = res.data;
    // 交易状态为交易成功则禁止
    this.isDisabled = res.data.paymentInfo.paymentStatus === '1' ? true : false;
  },
  methods: {
    onJumpBack() {
      this.$router.push({
        path: '/capital/order/list'
      });
    },
    onJumpCapitalFlowInfo(row) {
      if (row.gatewayFlowCode) {
        this.$router.push({
          path: `/capital/tranflow/detail/${row.gatewayFlowCode}`
        });
      } else {
        this.$message.error('该条明细没有支付流水详情');
        return;
      }
    },
    async onCompensateOrder() {
      await axios.post(api.compensateOrderPay, {
        transBatchNo: this.CapitalOrderDetailData.paymentInfo.paymentSn || ''
      });
      this.$message.success('操作成功');
    }
  }
};
</script>
