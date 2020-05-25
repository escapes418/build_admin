<template>
  <layout navActive="finance">
    <div class="invoice-detail-page">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>发票管理</el-breadcrumb-item>
        <el-breadcrumb-item>发票登记</el-breadcrumb-item>
        <el-breadcrumb-item>查看详情</el-breadcrumb-item>
      </el-breadcrumb>

      <div class="detail-hander-panel">
        <div class="detail-hander-content"></div>
        <div class="detail-hander-toolbtn">
          <el-button type="primary" @click="onJumpBack">返回</el-button>
        </div>
      </div>
      <!-- 开票信息 -->
      <el-form :model="billingInfo" label-width="120px">
        <!-- 开票信息 -->
        <div class="segment">
          <div class="segment-header">开票信息</div>
          <div class="segment-area Info-segment">
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
          </div>
        </div>
        <!-- 发票登记 -->
        <div class="segment">
          <div class="segment-header">发票登记</div>
          <div class="segment-area Info-segment">
            <el-form-item label="票据日期">
              <span>{{ billingInfo.taxTicketTime }}</span>
            </el-form-item>
            <el-form-item label="票面金额">
              <span>{{ billingInfo.taxAmount }}</span>
            </el-form-item>
            <el-form-item label="发票代码">
              <span>{{ billingInfo.taxCode }}</span>
            </el-form-item>
            <el-form-item label="发票号码">
              <span>{{ billingInfo.taxNumber }}</span>
            </el-form-item>
            <el-form-item label="发票照片">
              <span class="linker font-default" v-if="billingInfo.taxTicketUrl" @click="onPreviewImage">
                查看
              </span>
            </el-form-item>
            <el-form-item label="登记说明">
              <span>{{ billingInfo.description }}</span>
            </el-form-item>
          </div>
        </div>
      </el-form>

      <ul id="invoice-pic-viewer">
        <li>
          <img :src="billingInfo.taxTicketUrl || ''" alt="发票证件" style="display:none" />
        </li>
      </ul>
    </div>
  </layout>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/finance.api';
import utils from '@/utils/utils';

import 'viewerjs/dist/viewer.css';
import Viewer from 'viewerjs';

export default {
  data() {
    return {
      taxApplyFlowId: '',
      billingInfo: {},
      invoicePicViewer: null
    };
  },
  async created() {
    this.taxApplyFlowId = this.$route.params.id || '';
    // 发票登记-开票详情
    const res = await axios.get(api.taxTicketQuery, {
      params: { taxApplyFlowId: this.taxApplyFlowId }
    });
    this.billingInfo = res.data;
  },
  methods: {
    onJumpBack() {
      this.$router.push({
        path: '/invoice/check/list'
      });
    },
    onPreviewImage() {
      this.$nextTick(() => {
        const dom = document.getElementById('invoice-pic-viewer');
        this.invoicePicViewer = new Viewer(dom);
        this.invoicePicViewer.show();
        dom.addEventListener('hidden', () => {
          this.invoicePicViewer.destroy(); // 关闭时销毁实例
        });
      });
    }
  }
};
</script>
