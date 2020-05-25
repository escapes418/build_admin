<template>
  <layout navActive="finance">
    <div class="invoice-detail">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>发票管理</el-breadcrumb-item>
        <el-breadcrumb-item>发票列表</el-breadcrumb-item>
        <el-breadcrumb-item>发票详情</el-breadcrumb-item>
      </el-breadcrumb>

      <div class="detail-hander-panel">
        <div class="detail-hander-content"></div>
        <div class="detail-hander-toolbtn">
          <el-button type="primary" @click="onJumpBack">返回</el-button>
        </div>
      </div>
      <!-- 发票信息 -->
      <div class="segment">
        <div class="segment-header header-box">
          <span>发票信息</span>
          <span class="linker handle-btn" v-if="ticketDetailData.taxTicketUrl" @click="onShowInvoicePic">查看发票</span>
        </div>
        <div class="segment-area Info-segment">
          <el-form ref="form" :model="ticketDetailData" label-width="140px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="发票代码">
                  <span>{{ ticketDetailData.taxCode }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="采购商">
                  <span>{{ ticketDetailData.orderCompanyName }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="发票号码">
                  <span>{{ ticketDetailData.taxNumber }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="供应链公司">
                  <span>{{ ticketDetailData.finCompanyName }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="开票日期">
                  <span>{{ ticketDetailData.taxTicketTime }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="供应商">
                  <span>{{
                    ticketDetailData.supplierCompanyName && ticketDetailData.supplierCompanyName.length > 0
                      ? ticketDetailData.supplierCompanyName.join('、')
                      : '-'
                  }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="发票抬头">
                  <span>{{ ticketDetailData.taxPayable }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="纳税人识别号">
                  <span>{{ ticketDetailData.socialCreditCode }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="关联合同数">
                  <span>{{ ticketDetailData.protocolCount }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="开票金额">
                  <span>{{ ticketDetailData.amount }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="关联订单数">
                  <span>{{ ticketDetailData.orderCount }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="开票单位">
                  <span>{{ ticketDetailData.taxCompany }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="关联运单数">
                  <span>{{ ticketDetailData.waybillCount }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>

      <div class="segment noborder">
        <el-tabs type="border-card" v-model="tabActive">
          <!-- 关联合同 -->
          <el-tab-pane name="protocol">
            <span slot="label">
              <span>关联合同</span>
              <span class="font-default" v-if="ticketDetailData.protocolCount">
                ({{ ticketDetailData.protocolCount }})
              </span>
            </span>

            <section>
              <template v-for="(item, index) in ticketDetailData.protocolList">
                <el-form :model="item" label-width="140px" :key="index" class="pact-section">
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="合同编号">
                        <span
                          class="font-default linker"
                          @click="onJumpDetailPage(item.protocolPurchaseUrl, 'protocol')"
                        >
                          {{ item.protocolSn }}
                        </span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="资源名称">
                        <span>{{ item.goodsName }}</span>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <!-- <el-col :span="12">
                    <el-form-item label="创建日期">
                      <span>{{ item.lsh }}</span>
                    </el-form-item>
                  </el-col> -->
                    <el-col :span="12" :offset="12">
                      <el-form-item label="合同结算数量">
                        <span>{{ item.protocolCount }}</span>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="采购商">
                        <span>{{ item.orderCompanyName }}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="合同结算货款">
                        <span>{{ item.protocolAmount }}</span>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="供应链公司">
                        <span>{{ item.finCompanyName }}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="发票关联结算数量">
                        <span>{{ item.numberCount }}</span>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="供应商">
                        <span>{{ item.supplierCompanyName }}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="发票关联结算货款">
                        <span>{{ item.amountCount }}</span>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </template>
            </section>
          </el-tab-pane>
          <!-- 关联订单 -->
          <el-tab-pane name="order">
            <span slot="label">
              <span>关联订单</span>
              <span class="font-default" v-if="ticketDetailData.orderCount"> ({{ ticketDetailData.orderCount }}) </span>
            </span>

            <section>
              <template v-for="(item, index) in relatedOrderList">
                <el-form :model="item" label-width="140px" :key="index" class="pact-section">
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="订单编号">
                        <span class="font-default linker" @click="onJumpDetailPage(item.protocolOrderSn, 'order')">
                          {{ item.protocolOrderSn }}
                        </span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="订单结算数量">
                        <span>{{ item.orderCount }}</span>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <!-- <el-col :span="12">
                    <el-form-item label="创建日期">
                      <span>{{ item.lsh }}</span>
                    </el-form-item>
                  </el-col> -->
                    <el-col :span="12" :offset="12">
                      <el-form-item label="订单结算货款">
                        <span>{{ item.orderAmount }}</span>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="采购商">
                        <span>{{ item.orderCompanyName }}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="发票关联结算数量">
                        <span>{{ item.numberCount }}</span>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="供应商">
                        <span>{{ item.supplierCompanyName }}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="发票关联结算货款">
                        <span>{{ item.amountCount }}</span>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </template>
            </section>
          </el-tab-pane>
          <!-- 关联运单 -->
          <el-tab-pane name="waybill">
            <span slot="label">
              <span>关联运单</span>
              <span class="font-default" v-if="ticketDetailData.waybillCount">
                ({{ ticketDetailData.waybillCount }})
              </span>
            </span>

            <section>
              <el-table :data="relatedWaybillData.list" border>
                <el-table-column label="运单编号" prop="sjbId" min-width="160" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span class="linker font-default" @click="onJumpDetailPage(scope.row.sjbId, 'waybill')">
                      {{ scope.row.sjbId }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="订单编号" prop="protocolOrderSn" min-width="160" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{ scope.row.protocolOrderSn }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="合同编号" prop="protocolSn" min-width="160" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{ scope.row.protocolSn }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="发货时间" prop="sjbSendTime" min-width="140" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{ scope.row.sjbSendTime }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="收货时间" prop="signTime" min-width="140" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{ scope.row.signTime }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="车牌号"
                  prop="plateNumber"
                  min-width="160"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column label="司机" prop="driverName" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column
                  label="运单结算数量"
                  prop="receiveCount"
                  min-width="120"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  label="运单结算货款(元)"
                  align="right"
                  prop="paymentPrice"
                  min-width="120"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    <span>{{ scope.row.paymentPrice | thousands(2) }}</span>
                  </template>
                </el-table-column>
              </el-table>

              <div class="">
                <el-pagination
                  :page-size="pageSize"
                  :current-page.sync="page"
                  :total="relatedWaybillData.count"
                  @current-change="handleCurrentChange"
                  layout="total, prev, pager, next, jumper"
                ></el-pagination>
              </div>
            </section>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- 查看发票 -->
      <ul id="invoice-pic-viewer">
        <li>
          <img :src="ticketDetailData.taxTicketUrl || ''" alt="发票证件" style="display:none" />
        </li>
      </ul>
    </div>
  </layout>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/finance.api';
import utils from '@/utils/utils';
import listMixin from '@/utils/listMixin';

import 'viewerjs/dist/viewer.css';
import Viewer from 'viewerjs';

export default {
  mixins: [listMixin],
  data() {
    return {
      ticketDetailData: {}, //发票详情数据
      relatedOrderList: [], // 关联订单列表
      relatedWaybillData: {}, // 关联运单列表
      taxApplyFlowId: '', //税票申请流水主键
      tabActive: '',
      tableOptions: { taxApplyFlowId: '' },
      invoicePicViewer: null
    };
  },
  async created() {
    this.taxApplyFlowId = this.$route.params.id || '';
    this.tableOptions = { taxApplyFlowId: this.taxApplyFlowId };
    // 发票列表-发票详情
    const ticketDetailData = await axios.get(api.taxTicketDetail, {
      params: { taxApplyFlowId: this.taxApplyFlowId }
    });
    this.tabActive = 'protocol';
    this.ticketDetailData = ticketDetailData.data;
    // 发票列表-关联订单
    const relatedOrderList = await axios.get(api.taxTicketOrder, {
      params: { taxApplyFlowId: this.taxApplyFlowId }
    });
    this.relatedOrderList = relatedOrderList.data;
    // 发票列表-关联运单
    this.handleSearch();
  },
  methods: {
    onJumpDetailPage(id, type) {
      let path = '';
      switch (type) {
        case 'protocol':
          utils.openNewtab(id); // 跳转采购协议
          break;
        case 'order':
          path = `/mall.html#/order/list/${id}`; //订单详情
          window.location.href = path;
          break;
        case 'waybill':
          path = `/mall.html#/waybill/detail/${id}`; //运单详情
          window.location.href = path;
          break;
      }
    },
    onJumpBack() {
      this.$router.push({
        path: '/invoice/list'
      });
    },
    onShowInvoicePic() {
      this.$nextTick(() => {
        const dom = document.getElementById('invoice-pic-viewer');
        this.invoicePicViewer = new Viewer(dom);
        this.invoicePicViewer.show();
        dom.addEventListener('hidden', () => {
          this.invoicePicViewer.destroy(); // 关闭时销毁实例
        });
      });
    },
    async fetchData(opts) {
      const options = { page: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      // 获取 关联运单数据
      const res = await axios.post(api.taxTicketWaybill, options);
      this.relatedWaybillData = res.data;
    }
  }
};
</script>
