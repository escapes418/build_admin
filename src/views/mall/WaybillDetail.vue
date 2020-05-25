<template>
  <layout navActive="mall">
    <div class="waybill-detail-page">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>运单列表</el-breadcrumb-item>
        <el-breadcrumb-item>运单详情</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="detail-hander-panel">
        <div class="detail-hander-content">
          <span class="font-label">运单编号：</span>
          <span class="font-default">{{ orderDetail.orderNumber }}</span>
        </div>
        <div class="detail-hander-toolbtn">
          <!-- <el-button type="primary" @click="onJumpCert">贸易凭证</el-button> -->
          <router-link to="/waybill/list">
            <el-button class="ml-10">返回</el-button>
          </router-link>
        </div>
      </div>

      <!-- 运单详情 -->
      <div class="segment">
        <div class="segment-header">运单详情</div>
        <div class="segment-area flex-area" :span="3">
          <div class="segment-item">
            <div class="segment-label">运单编号</div>
            <div class="segment-content">{{ orderDetail.orderNumber }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">物流承运商</div>
            <div class="segment-content">
              <span :title="orderDetail.orderCompany">{{ orderDetail.orderCompany }}</span>
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">发货地</div>
            <div class="segment-content">
              <span :title="orderDetail.loadingSite">{{ orderDetail.loadingSite }}</span>
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">交货地</div>
            <div class="segment-content">
              <span :title="orderDetail.unloadSite">{{ orderDetail.unloadSite }}</span>
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">接单时间</div>
            <div class="segment-content">{{ orderDetail.orderCreateTime }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">收单时间</div>
            <div class="segment-content">{{ orderDetail.companySignTime }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">接单司机</div>
            <div class="segment-content">
              <span :title="orderDetail.carPerson">{{ orderDetail.carPerson }}</span>
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">司机电话</div>
            <div class="segment-content">{{ orderDetail.driverPhone }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">司机证件</div>
            <div class="segment-content">
              <span class="font-default pointer" @click="onShowViewer('viewerDriverCertList')">【查看】</span>
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">车牌号</div>
            <div class="segment-content">{{ orderDetail.carNumber }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">车辆证件</div>
            <div class="segment-content">
              <span class="font-default pointer" @click="onShowViewer('viewerVehicleCertList')">【查看】</span>
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">司机委托协议</div>
            <div class="segment-content">
              <a v-if="contractDriver" :href="contractDriver" class="no-decoration" target="_blank">
                <span class="font-default pointer">【查看】</span></a
              >
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">运单轨迹</div>
            <div class="segment-content">
              <span class="font-default pointer" @click="onlookTrack">【查看】</span>
            </div>
          </div>

          <div class="segment-item">
            <div class="segment-label">小票方量(m³)</div>
            <div class="segment-content">{{ orderDetail.sendNumber | thousands }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">砼量(m³)</div>
            <div class="segment-content">{{ orderDetail.settlementNumber | thousands }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">订单编号</div>
            <div class="segment-content">{{ orderDetail.orderSn }}</div>
          </div>
        </div>
      </div>
      <!-- 运单日志 -->
      <div class="item-header">运单日志</div>
      <el-table :data="orderDetail.orderLogList" border>
        <el-table-column label="时间" prop="createDatetime" min-width="140"> </el-table-column>
        <el-table-column label="内容" prop="memo" min-width="600" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" prop="" min-width="170">
          <template slot-scope="scope">
            <span class="font-default pointer" v-if="scope.row.recordUrl" @click="onShowViewer('viewerLogCertList', scope.row)">
              【查看凭证】
            </span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 交易日志 -->
      <div class="item-header mt-40">交易日志</div>
      <el-table :data="orderDetail.orderPayFundFlowList" border>
        <el-table-column label="凭证号" prop="flowCode" min-width="200">
          <template slot-scope="scope">
            <span class="font-default">{{ scope.row.flowCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="付款方名称" prop="userName" min-width="150" show-overflow-tooltip></el-table-column>
        <el-table-column label="收款方名称" prop="toUserName" min-width="150" show-overflow-tooltip></el-table-column>
        <el-table-column label="交易金额(元)" prop="txAmt" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="font-orange">{{ scope.row.txAmt | thousands }}</span>
          </template>
        </el-table-column>
        <el-table-column label="交易类型" prop="txType" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column label="交易成分" prop="eleType" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column label="说明" prop="remark" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column label="支付方式" prop="payMethod" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column label="交易时间" prop="txDate" min-width="140" show-overflow-tooltip></el-table-column>
        <el-table-column label="银行回单" prop="" min-width="160" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="onGetBanBackkOrder(scope.row)">{{ scope.row.thirdCode }}</el-button>
          </template>
        </el-table-column>
      </el-table>

      <fe-viewer ref="viewerLogCertList" title="运单凭证" :source="logCertListSource"></fe-viewer>
      <fe-viewer ref="viewerDriverCertList" title="司机证件" :source="driverCertListSource"></fe-viewer>
      <fe-viewer ref="viewerVehicleCertList" title="车辆证件" :source="vehicleCertListSource"></fe-viewer>
    </div>
  </layout>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/mall.api';
import utils from '@/utils/utils';

export default {
  data() {
    return {
      contractDriver: '', // 司机委托协议
      contractTransport: [], // 委托运输协议
      orderDetail: {
        driverCertList: [], // 司机证件
        vehicleCertList: [], // 车辆证件
        orderLogList: [], // 订单日志
        orderPayFundFlowList: [], // 交易日志
        orderCloudSignContractList: [{}, {}, {}] // 各种协议
      },
      logCertListSource: [], // 运单凭证
      driverCertListSource: [], // 司机证件
      vehicleCertListSource: [] // 车辆证件
    };
  },
  async created() {
    this.waybillSn = this.$route.params.waybillSn;
    const result = await axios.post(api.waybillDetail, { waybillSn: this.waybillSn });

    result.data.orderLogList.forEach(el => {
      if (el.recordUrl) {
        el.recordUrl = el.recordUrl.split(',');
      }
    });

    const contractList = result.data.orderCloudSignContractList || [];
    contractList.forEach(element => {
      if (element.contractType === '1') {
        this.contractDriver = element.url; // 司机委托协议
      } else {
        this.contractTransport.push(element.url); // 委托运输协议
      }
    });
    this.orderDetail = result.data;
  },
  mounted() {},
  methods: {
    // onJumpCert() {
    //   this.$router.push({ path: '/trade/cert/fromdetail/' + this.waybillSn });
    // },
    async onGetBanBackkOrder(row) {
      if (row.thirdCodeUrl) {
        const result = await axios.post(api.waybillBankFileUrl, { thirdCodeUrl: row.thirdCodeUrl });
        utils.openNewtab(result.data);
      }
    },
    // 查看轨迹
    onlookTrack() {
      this.$router.push({ path: '/waybill/track/' + this.waybillSn });
    },
    onShowViewer(ref, info = {}) {
      switch (ref) {
        case 'viewerLogCertList': // 运单凭证
          this.logCertListSource = [info].map(el => {
            return { url: el.recordUrl || '', title: '运单凭证' };
          });
          break;
        case 'viewerDriverCertList': // 司机证件
          this.driverCertListSource = (this.orderDetail.driverCertList || []).map(el => {
            return { url: el || '', title: '司机证件' };
          });
          break;
        case 'viewerVehicleCertList': // 车辆证件
          this.vehicleCertListSource = (this.orderDetail.vehicleCertList || []).map(el => {
            return { url: el || '', title: '车辆证件' };
          });
          break;
      }
      this.$nextTick(() => {
        this.$refs[ref].show();
      });
    }
  }
};
</script>
