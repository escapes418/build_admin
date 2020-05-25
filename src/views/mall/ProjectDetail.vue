<template>
  <layout navActive="mall">
    <div class="layout-content-list">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>交易管理</el-breadcrumb-item>
        <el-breadcrumb-item to="/project/list">项目管理</el-breadcrumb-item>
        <el-breadcrumb-item>项目详情</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="detail-hander-panel mb-0">
        <div class="detail-hander-content">
          <span class="font-label">项目编号：</span>
          <span class="font-default">{{ detailInfo.projectSn }}</span>
          <span class="font-label ml-15">项目状态：</span>
          <span class="font-default">{{ project_status | valueToLabel(statusArr) }}</span>
        </div>
        <div class="detail-hander-toolbtn">
          <el-button type="primary" @click="onJumpOrderList(detailInfo.projectSn)">查看订单</el-button>
          <!-- 新增关系相关操作 -->
          <el-button
            v-if="project_status === 'INITIALIZE'"
            type="primary"
            @click="onAddChain"
          >新增关联企业</el-button>
          <el-button
            v-if="project_status === 'INITIALIZE'"
            type="primary"
            @click="onTakeEffectChain"
          >确认项目生效</el-button>
          <el-button
            v-if="project_status === 'EFFECTED'"
            type="primary"
            @click="onCompleteProject"
          >项目完工</el-button>
          <el-button
            v-if="project_status === 'COMPLETED'"
            type="primary"
            @click="onCloseProject"
          >终止项目</el-button>
          <router-link to="/project/list" class="ml-10">
            <el-button>返回列表</el-button>
          </router-link>
        </div>
      </div>
      <el-tabs v-model="tabActive" @tab-click="tabChange">
        <el-tab-pane label="项目详情" name="detail">
          <!-- 项目信息 -->
          <div class="segment">
            <div class="segment-header">项目信息</div>
            <div class="segment-area flex-area" :span="3">
              <div class="segment-item">
                <div class="segment-label">项目名称</div>
                <div class="segment-content">{{ detailInfo.projectName }}</div>
              </div>
              <div class="segment-item">
                <div class="segment-label">创建时间</div>
                <div
                  class="segment-content"
                >{{ detailInfo.gmtCreate | dateFormat('YYYY-MM-DD HH:mm:ss') }}</div>
              </div>
              <div class="segment-item">
                <div class="segment-label">合同生效时间</div>
                <div
                  class="segment-content"
                >{{ detailInfo.effectiveTime | dateFormat('YYYY-MM-DD') }}</div>
              </div>

              <div class="segment-item">
                <div class="segment-label">工程结构</div>
                <div class="segment-content">{{ detailInfo.projectStructure }}</div>
              </div>
              <div class="segment-item">
                <div class="segment-label">计划供应时间</div>
                <div class="segment-content">
                  {{ detailInfo.beginTime | dateFormat('YYYY-MM-DD') }}
                  <span>至</span>
                  {{ detailInfo.endTime | dateFormat('YYYY-MM-DD') }}
                </div>
              </div>
              <div class="segment-item" v-if="project_status === 'COMPLETED'">
                <div class="segment-label">项目完工时间</div>
                <div
                  class="segment-content"
                >{{ detailInfo.completeTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}</div>
              </div>

              <div class="segment-item">
                <div class="segment-label">计划混凝土方量(m³)</div>
                <div class="segment-content">{{ detailInfo.number }}</div>
              </div>
              <div class="segment-item">
                <div class="segment-label">有效期(年)</div>
                <div class="segment-content">{{ detailInfo.validPeriod }}</div>
              </div>
              <div class="segment-item">
                <div class="segment-label">采购合同编号</div>
                <div class="segment-content">
                  {{ detailInfo.contractSn }}
                  <span
                    class="font-default pointer"
                    @click="onShowViewer('viewerAgreement')"
                  >查看</span>
                </div>
              </div>

              <div class="segment-item warp">
                <div class="segment-label">商砼强度</div>
                <div
                  class="segment-content"
                  :title="detailInfo.goodsCategory"
                >{{ detailInfo.goodsCategory }}</div>
              </div>
              <div class="segment-item warp">
                <div class="segment-label">到达地点</div>
                <div
                  class="segment-content"
                  :title="detailInfo.deliveryPlace"
                >{{ detailInfo.deliveryPlace }}</div>
              </div>
              <div class="segment-item warp">
                <div class="segment-label">经纪人模式</div>
                <div
                  class="segment-content"
                  :title="detailInfo.proxyMode | valueToLabel(proxyModeArr)"
                >{{ detailInfo.proxyMode | valueToLabel(proxyModeArr) }}</div>
              </div>
            </div>
          </div>
          <!-- 结算信息 -->
          <div class="segment mt-20">
            <div class="segment-header">结算信息</div>
            <div class="segment-area flex-area" :span="3">
              <div class="segment-item">
                <div class="segment-label">结算账户</div>
                <div class="segment-content">{{ detailInfo.settlementAccount }}</div>
              </div>
              <div class="segment-item">
                <div class="segment-label">结算方式</div>
                <div
                  class="segment-content"
                >{{ detailInfo.statementMode | valueToLabel(statementModeArr) }}</div>
              </div>
              <div class="segment-item">
                <div class="segment-label">计费模式</div>
                <div
                  class="segment-content"
                >{{ detailInfo.deliveryPayType | valueToLabel(PayTypeArr) }}</div>
              </div>
              <div class="segment-item">
                <div class="segment-label">结算时间(天)</div>
                <div class="segment-content">{{ detailInfo.timeLimit }}</div>
              </div>
              <!-- <div class="segment-item">
                <div class="segment-label">结算税率(%)</div>
                <div class="segment-content">{{ detailInfo.taxRate }}</div>
              </div>-->
              <div class="segment-item">
                <div class="segment-label">次月支付货款比例(%)</div>
                <div class="segment-content">{{ detailInfo.nextMonthPaymentScale }}</div>
              </div>
              <div class="segment-item">
                <div class="segment-label">结算单价对照表</div>
                <div class="segment-content">
                  <span class="font-default pointer" @click="onJumpProjectPrice">查看</span>
                </div>
              </div>
            </div>
          </div>
          <!-- 采购双方信息 -->
          <div class="segment mt-20">
            <div class="segment-header">贸易双方信息</div>
            <div class="segment-area flex-area" :span="3">
              <div class="segment-item">
                <div class="segment-label">采购商</div>
                <div class="segment-content">
                  {{ detailInfo.purchaserName }}
                  <span
                    class="font-default pointer"
                    @click="onShowViewer('viewerPurchaser')"
                  >查看证件</span>
                </div>
              </div>
              <div class="segment-item">
                <div class="segment-label">采购商联系人</div>
                <div class="segment-content">{{ detailInfo.purchaserTrader }}</div>
              </div>
              <div class="segment-item">
                <div class="segment-label">联系电话</div>
                <div class="segment-content">{{ detailInfo.purchaserTraderMobile }}</div>
              </div>

              <div class="segment-item">
                <div class="segment-label">供应商</div>
                <div class="segment-content">
                  {{ detailInfo.supplierName }}
                  <span
                    class="font-default pointer"
                    @click="onShowViewer('viewerSupplier')"
                  >查看证件</span>
                </div>
              </div>
              <div class="segment-item warp">
                <div class="segment-label">供应商联系人</div>
                <div class="segment-content">{{ detailInfo.supplierTrader }}</div>
              </div>
              <div class="segment-item">
                <div class="segment-label">联系电话</div>
                <div class="segment-content">{{ detailInfo.supplierTraderMobile }}</div>
              </div>
            </div>
          </div>
          <!-- 结算数据 -->
          <div class="segment mt-20">
            <div class="segment-header">结算数据</div>
            <div class="segment-area flex-area" :span="4">
              <div class="segment-item">
                <div class="segment-label">累计砼量(m³)</div>
                <div class="segment-content">{{ detailInfo.settlementNumber }}</div>
              </div>
              <div class="segment-item">
                <div class="segment-label">累计签收运单</div>
                <div class="segment-content">{{ detailInfo.settlementWaybill }}</div>
              </div>
              <div class="segment-item">
                <div class="segment-label">累计结算金额(元)</div>
                <div class="segment-content">{{ detailInfo.settlementAmount | thousands(2) }}</div>
              </div>
              <div class="segment-item">
                <div class="segment-label">累计尾款金额(元)</div>
                <div class="segment-content">{{ detailInfo.settlementBalance | thousands(2) }}</div>
              </div>
            </div>
          </div>
          <!-- 结算单列表 -->
          <div class="item-header">结算单列表</div>
          <el-table :data="detailInfo.settlementlist || []" border>
            <el-table-column
              label="结算单编号"
              prop="settlementSn"
              min-width="100"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span class="font-default pointer" @click="onJumpSettlementDetail(scope.row.id)">
                  {{
                  scope.row.settlementSn
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="结算周期" min-width="200" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.settlementStartDate }}</span>
                <span>至</span>
                <span>{{ scope.row.settlementEndDate }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="结算日期"
              prop="settlementDate"
              min-width="100"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              label="结算单状态"
              prop="settlementStatus"
              min-width="100"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span>{{ scope.row.settlementStatus | valueToLabel(settlementStatusArr) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="供应商" prop="supplierName" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column
              label="砼量(m³)"
              prop="concreteCube"
              min-width="100"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column label="金额(元)" prop="paidAmount" min-width="100" show-overflow-tooltip></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="供应链关系" name="chain">
          <!-- statementMode (integer, optional): 结算方式：0预付款，1月结 , -->
          <ProjectChain
            ref="chain"
            :projectId="detailInfo.id"
            :statementMode="detailInfo.statementMode"
          />
        </el-tab-pane>
        <el-tab-pane label="项目日志" name="log">
          <ProjectLog ref="log" :projectId="detailInfo.id" :projectSn="detailInfo.projectSn"/>
        </el-tab-pane>
      </el-tabs>

      <!-- 采购商证件 -->
      <fe-viewer ref="viewerPurchaser" title="采购商证件" :source="viewerPurchaserSource"></fe-viewer>
      <!-- 供应商证件 -->
      <fe-viewer ref="viewerSupplier" title="供应商证件" :source="viewerSupplierSource"></fe-viewer>
      <!-- 采购合同协议 -->
      <fe-viewer ref="viewerAgreement" title="采购合同协议" :source="viewerAgreementSource"></fe-viewer>
    </div>
  </layout>
</template>
<script>
import axios from '@/utils/axios';
import api from '@/api/mall.api';
import listMixin from '@/utils/listMixin';
import utils from '@/utils/utils';
import { mapState, mapActions } from 'vuex';

const ProjectLog = () => import('@/views/mall/ProjectLog');
const ProjectChain = () => import('@/views/mall/ProjectChain');

export default {
  components: {
    ProjectLog,
    ProjectChain
  },
  mixins: [listMixin],
  data() {
    return {
      tabActive: 'detail',
      purchaseCertViewer: null,
      supplierCertViewer: null,
      ViewLog: {},
      detailInfo: {},
      coalMine: {},
      protocolOrderResponse: {},
      tableOptions: {
        protocolOrderSn: '',
        protocolSn: '',
        status: '',
        startTime: '',
        endTime: ''
      },
      sendOptions: {},
      tableData: {},

      viewerPurchaserSource: [],
      viewerSupplierSource: [],
      viewerAgreementSource: [], // 采购合同协议
      purchaserImgs: [], //采购商证件
      supplierImgs: [], //供应商证件
      agreementImgs: [], // 合同协议附件
      statusArr: [],
      PayTypeArr: [], //计费模式
      settlementStatusArr: [], // 结算状态
      proxyModeArr: [], //经纪人模式
      statementModeArr: [] //结算方式
    };
  },
  computed: {
    ...mapState({
      project_status: state => state.project_status
    })
  },
  async created() {
    // 计费模式
    this.PayTypeArr = await utils.getSysDict('project_payment_type');
    //经纪人模式
    this.proxyModeArr = await utils.getSysDict('proxy_mode');
    //结算方式
    this.statementModeArr = await utils.getSysDict('statement_mode');

    // 项目状态字典
    this.statusArr = await utils.getSysDict('project_status');
    // 结算状态
    this.settlementStatusArr = await utils.getSysDict('statement_status');

    const projectRes = await axios.post(api.projectDetail, { projectId: this.$route.params.id });
    this.detailInfo = projectRes.data;
    // 缓存项目状态到store
    this.changeProjectStatus(this.detailInfo.projectStatus || '');

    const fileList = await utils.queryCompanyFileList([this.detailInfo.purchaserId, this.detailInfo.supplierId]);
    // 采购商证件
    this.purchaserImgs = fileList[0];
    // 供应商证件
    this.supplierImgs = fileList[1];
    // 合同协议附件
    let fileGroupRes = await axios.post(api.projectViewCompanyFile, { bizId: this.detailInfo.id });
    this.agreementImgs = fileGroupRes.data || [];
  },
  methods: {
    ...mapActions(['changeProjectStatus']),
    tabChange(tab, event) {
      switch (this.tabActive) {
        case 'log':
          this.ViewLog = ProjectLog;
          this.$refs.log.handleSearch();
          break;
        case 'chain':
          this.$refs.chain.handleChainData();
          break;
        default:
          break;
      }
    },
    onAddChain() {
      this.tabActive = 'chain';
      this.$refs.chain.onShowAddChainDialog('add');
    },
    onTakeEffectChain() {
      this.$refs.chain.handleTakeEffectChain();
    },
    onCompleteProject() {
      this.$refs.chain.handleCompleteProject();
    },
    onCloseProject() {
      this.$refs.chain.handleCloseProject();
    },
    onJumpProjectPrice() {
      this.$router.push({ path: `/project/price/comparison/${this.$route.params.id}/${this.detailInfo.projectSn}` });
    },
    onShowViewer(ref) {
      switch (ref) {
        case 'viewerPurchaser': // 采购商证件
          this.viewerPurchaserSource = this.purchaserImgs;
          break;
        case 'viewerSupplier': // 供应商证件
          this.viewerSupplierSource = this.supplierImgs;
          break;
        case 'viewerAgreement': // 采购合同协议
          this.viewerAgreementSource = this.agreementImgs.map(el => {
            return { url: el.filePath || '', title: el.fileName || '' };
          });
          break;
      }
      this.$nextTick(() => {
        this.$refs[ref].show();
      });
    },
    onfindFileList(value, list) {
      if (value === null || value === undefined || value === '') return [];
      if (!Array.isArray(list)) return [];
      let item = list.filter(el => el.companyId.toString() === value.toString());
      if (item.length === 0) {
        return [];
      }
      return item[0].fileList || [];
    },
    onJumpOrderList(projectSn) {
      this.$router.push({ path: `/order/list/${projectSn}` });
    },
    onJumpSettlementDetail(id) {
      this.$router.push({ path: `/settlement/detail/${id}` });
    }
  }
};
</script>

<style lang="postcss" scoped>
.segment-label {
  width: 140px !important;
}
</style>
