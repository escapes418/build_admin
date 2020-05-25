<template>
  <div>
    <div class="item-header">加工商信息</div>
    <div class="segment segment-panels noborder">
      <div class="segment-area flex-area" :span="3">
        <div class="segment-item haslink">
          <div class="segment-label">加工商</div>
          <div class="segment-content">{{ machining.companyName }}</div>
          <div class="the-linker" @click="onShowCompanyCert(1)">查看证件</div>
        </div>
        <div class="segment-item" colspan="2">
          <div class="segment-label">企业编号</div>
          <div class="segment-content">{{ machining.companyCode }}</div>
        </div>
        <template v-if="settlementStatus === 'SETTLED'">
          <div class="segment-item">
            <div class="segment-label">付款金额(元)</div>
            <div class="segment-content">{{ machining.settledAmount | thousands }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">付款时间</div>
            <div class="segment-content">{{ machining.paymentTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}</div>
          </div>
        </template>
      </div>
    </div>
    <div class="item-header">砂石供应商信息</div>
    <div class="segment segment-panels noborder">
      <div class="segment-area flex-area" :span="3">
        <div class="segment-item haslink">
          <div class="segment-label">砂石供应商</div>
          <div class="segment-content">{{ sand.companyName }}</div>
          <div class="the-linker" @click="onShowCompanyCert(2)">查看证件</div>
        </div>
        <div class="segment-item">
          <div class="segment-label">企业编号</div>
          <div class="segment-content">{{ sand.companyCode }}</div>
        </div>
        <div class="segment-item">
          <div class="segment-label">剩余开票额度(元)</div>
          <div class="segment-content">{{ sand.remainLimit | thousands }}</div>
        </div>
        <template v-if="settlementStatus === 'SETTLED'">
          <div class="segment-item">
            <div class="segment-label">付款金额(元)</div>
            <div class="segment-content">{{ sand.settledAmount | thousands }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">付款时间</div>
            <div class="segment-content">{{ sand.paymentTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}</div>
          </div>
        </template>
      </div>
    </div>
    <div class="item-header">水泥供应商信息</div>
    <div class="segment segment-panels noborder">
      <div class="segment-area flex-area" :span="3">
        <div class="segment-item haslink">
          <div class="segment-label">水泥供应商</div>
          <div class="segment-content">{{ cement.companyName }}</div>
          <div class="the-linker" @click="onShowCompanyCert(3)">查看证件</div>
        </div>
        <div class="segment-item" colspan="2">
          <div class="segment-label">企业编号</div>
          <div class="segment-content">{{ cement.companyCode }}</div>
        </div>
        <template v-if="settlementStatus === 'SETTLED'">
          <div class="segment-item">
            <div class="segment-label">付款金额(元)</div>
            <div class="segment-content">{{ cement.settledAmount | thousands }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">付款时间</div>
            <div class="segment-content">{{ cement.paymentTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}</div>
          </div>
        </template>
      </div>
    </div>
    <div class="item-header">经纪人信息</div>
    <div class="segment segment-panels noborder">
      <div class="segment-area flex-area" :span="3">
        <div class="segment-item haslink">
          <div class="segment-label">经纪人</div>
          <div class="segment-content">{{ agent.companyName }}</div>
          <div class="the-linker" @click="onShowCompanyCert(4)">查看证件</div>
        </div>
        <div class="segment-item">
          <div class="segment-label">企业编号</div>
          <div class="segment-content">{{ agent.companyCode }}</div>
        </div>
        <div class="segment-item">
          <div class="segment-label">剩余开票额度(元)</div>
          <div class="segment-content">{{ agent.remainLimit | thousands }}</div>
        </div>
        <template v-if="settlementStatus === 'SETTLED'">
          <div class="segment-item">
            <div class="segment-label">付款金额(元)</div>
            <div class="segment-content">{{ agent.settledAmount | thousands }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">付款时间</div>
            <div class="segment-content">{{ agent.paymentTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}</div>
          </div>
        </template>
      </div>
    </div>
    <div class="item-header">承运企业息</div>
    <div class="segment segment-panels noborder">
      <div class="segment-area flex-area" :span="3">
        <div class="segment-item">
          <div class="segment-label">承运商</div>
          <div class="segment-content">{{ carrier.companyName }}</div>
        </div>
        <div class="segment-item" colspan="2">
          <div class="segment-label">企业编号</div>
          <div class="segment-content">{{ carrier.companyCode }}</div>
        </div>
        <template v-if="settlementStatus === 'SETTLED'">
          <div class="segment-item">
            <div class="segment-label">付款金额(元)</div>
            <div class="segment-content">{{ carrier.settledAmount | thousands }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">付款时间</div>
            <div class="segment-content">{{ carrier.paymentTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}</div>
          </div>
        </template>
      </div>
    </div>

    <fe-viewer ref="companyViewer1" title="加工商证件" :source="machiningFiles"></fe-viewer>
    <fe-viewer ref="companyViewer2" title="砂石供应商证件" :source="sandFiles"></fe-viewer>
    <fe-viewer ref="companyViewer3" title="水泥供应商证件" :source="cementFiles"></fe-viewer>
    <fe-viewer ref="companyViewer4" title="经纪人证件" :source="agentFiles"></fe-viewer>
  </div>
</template>
<script>
import axios from '@/utils/axios';
import api from '@/api/mall.api';
import utils from '@/utils/utils';

export default {
  props: {
    settlementId: {
      type: String,
      required: true
    },
    settlementStatus: {
      type: String,
      required: true,
      default: ''
    }
  },
  data() {
    return {
      machining: {}, // 加工商
      sand: {}, // 砂石供应商
      cement: {}, // 水泥供应商
      agent: {}, //经纪人
      carrier: {}, //承运企业
      machiningFiles: [],
      sandFiles: [],
      cementFiles: [],
      agentFiles: []
    };
  },
  created() {},
  methods: {
    async init() {
      let companyList = await axios.post(api.settlementPaymentRecord, { statementId: this.settlementId });
      companyList = companyList.data || [];

      let companyIds = {};
      companyList.forEach(element => {
        if (element.companyType === 'CONVERTER') {
          this.machining = { ...element };
          companyIds.machining = element.companyId;
        }
        if (element.companyType === 'SANDSTONE_SUPPLIER') {
          this.sand = { ...element };
          companyIds.sand = element.companyId;
        }
        if (element.companyType === 'CEMENT_SUPPLIER') {
          this.cement = { ...element };
          companyIds.cement = element.companyId;
        }
        if (element.companyType === 'AGENT') {
          this.agent = { ...element };
          companyIds.agent = element.companyId;
        }
        if (element.companyType === 'CARRIER') {
          this.carrier = { ...element };
          // 承运商没有企业证件
        }
      });
      // 查询企业证件
      let ids = [];
      companyIds.machining && ids.push(companyIds.machining);
      companyIds.sand && ids.push(companyIds.sand);
      companyIds.cement && ids.push(companyIds.cement);
      companyIds.agent && ids.push(companyIds.agent);

      if (ids.length === 0) return;
      const fileList = await utils.queryCompanyFileList(ids);

      this.machiningFiles = fileList[0] || [];
      this.sandFiles = fileList[1] || [];
      this.cementFiles = fileList[2] || [];
      this.agentFiles = fileList[3] || [];
    },
    // 查看企业证件
    onShowCompanyCert(idx) {
      this.$nextTick(() => this.$refs['companyViewer' + idx].show());
    }
  }
};
</script>
<style>
</style>
