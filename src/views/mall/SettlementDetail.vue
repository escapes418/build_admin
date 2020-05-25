<template>
  <layout navActive="mall">
    <el-breadcrumb separator=">">
      <el-breadcrumb-item>交易管理</el-breadcrumb-item>
      <el-breadcrumb-item to="/settlement/list">结算单管理</el-breadcrumb-item>
      <el-breadcrumb-item>结算单详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="detail-hander-panel mb-0">
      <div class="detail-hander-content">
        <span class="font-label">结算单编号：</span>
        <span class="font-default">{{ detailData.settlement.settlementSn }}</span>
        <span class="font-label ml-20">结算单状态：</span>
        <span :class="settlementStatus !== 'SETTLED' ? 'font-orange' : 'font-green'">{{
          settlementStatus | valueToLabel(statementStatusArr)
        }}</span>
      </div>
      <div class="detail-hander-toolbtn" v-if="settlementStatus === 'RECONCILIATION'">
        <router-link to="/settlement/list">
          <el-button>返回列表</el-button>
        </router-link>
        <el-button type="primary" class="ml-10" @click="onShowSettlementUploadDialog">上传对账纸质单据</el-button>
        <el-button type="primary" class="ml-10" @click="onJumpProjectPrice('edit')">调价</el-button>
        <el-button type="primary" class="ml-10" @click="onSettlementConfirm">确认对账信息</el-button>
      </div>
      <div class="detail-hander-toolbtn" v-if="settlementStatus === 'SETTLEMENT'">
        <router-link to="/settlement/list">
          <el-button>返回列表</el-button>
        </router-link>
        <el-button type="primary" class="ml-10" @click="onConfirmSetted">确认结算</el-button>
      </div>
    </div>
    <el-tabs v-model="tabActive" @tab-click="tabChange">
      <el-tab-pane label="结算单详情" name="detail">
        <!-- 结算单详情 -->
        <div class="segment">
          <div class="segment-header">结算单详情</div>
          <div class="segment-area flex-area" :span="4">
            <div class="segment-item">
              <div class="segment-label">创建时间</div>
              <div class="segment-content">
                {{ detailData.settlement.gmtCreate | dateFormat('YYYY-MM-DD HH:mm:ss') }}
              </div>
            </div>
            <div class="segment-item" colspan="3">
              <div class="segment-label">项目编号</div>
              <div class="segment-content">{{ detailData.project.projectName }}</div>
            </div>
            <div class="segment-item haslink">
              <div class="segment-label">供应商</div>
              <div class="segment-content">
                <span :title="detailData.project.supplierName">{{ detailData.project.supplierName }}</span>
              </div>
              <div class="the-linker" @click="onShowCompanyCert('purchaseCertViewer')">查看证件</div>
            </div>
            <div class="segment-item">
              <div class="segment-label">供应商编号</div>
              <div class="segment-content">{{ detailData.project.supplierCompanyCode }}</div>
            </div>
            <div class="segment-item">
              <div class="segment-label">供应商联系电话</div>
              <div class="segment-content">{{ detailData.project.supplierTraderMobile }}</div>
            </div>
            <div class="segment-item">
              <div class="segment-label">经办人</div>
              <div class="segment-content">{{ detailData.project.supplierTrader }}</div>
            </div>
            <div class="segment-item haslink">
              <div class="segment-label">采购商</div>
              <div class="segment-content">
                <span :title="detailData.project.purchaserName">{{ detailData.project.purchaserName }}</span>
              </div>
              <div class="the-linker" @click="onShowCompanyCert('supplierCertViewer')">查看证件</div>
            </div>
            <div class="segment-item">
              <div class="segment-label">采购商编号</div>
              <div class="segment-content">{{ detailData.project.purchaserCompanyCode }}</div>
            </div>
            <div class="segment-item">
              <div class="segment-label">采购商联系电话</div>
              <div class="segment-content">{{ detailData.project.purchaserTraderMobile }}</div>
            </div>
            <div class="segment-item">
              <div class="segment-label">经办人</div>
              <div class="segment-content">{{ detailData.project.purchaserTrader }}</div>
            </div>
            <div class="segment-item">
              <div class="segment-label">结算周期</div>
              <div class="segment-content" :title="settlementRange">
                {{ settlementRange }}
              </div>
            </div>
            <div class="segment-item">
              <div class="segment-label">结算天数</div>
              <div class="segment-content">{{ detailData.settlement.settlementDays }}天</div>
            </div>

            <div class="segment-item">
              <div class="segment-label">商售单价</div>
              <div class="segment-content">
                <span class="font-default pointer" @click="onJumpProjectPrice('view')">查看单价对照表</span>
              </div>
            </div>

            <div class="segment-item">
              <div class="segment-label">经纪人模式</div>
              <div class="segment-content">
                <span v-if="detailData.project.proxyMode === 0">否</span>
                <span v-if="detailData.project.proxyMode === 1">是</span>
              </div>
            </div>

            <div class="segment-item">
              <div class="segment-label">计费模式</div>
              <div class="segment-content">
                <span v-if="detailData.project.deliveryPayType === 0">按待结算金额计算</span>
                <span v-if="detailData.project.deliveryPayType === 1">按月结货款金额计算</span>
              </div>
            </div>

            <div class="segment-item">
              <div class="segment-label">结算方式</div>
              <div class="segment-content">
                <span v-if="detailData.project.statementMode === 0">预付款</span>
                <span v-if="detailData.project.statementMode === 1">月结</span>
              </div>
            </div>
          </div>
        </div>
        <!-- 结算单数据 -->
        <div class="segment">
          <div class="segment-header">结算单数据</div>
          <div class="segment-area flex-area" :span="4">
            <div class="segment-item">
              <div class="segment-label">累计订单数</div>
              <div class="segment-content">{{ detailData.settlement.orderQuantity }}</div>
            </div>
            <div class="segment-item">
              <div class="segment-label">累计运单数</div>
              <div class="segment-content">{{ detailData.settlement.waybillQuantity }}</div>
            </div>
            <div class="segment-item">
              <div class="segment-label">累计小票方量(m³)</div>
              <div class="segment-content">{{ detailData.settlement.waybillConcreteCube }}</div>
            </div>
            <div class="segment-item">
              <div class="segment-label">累计扣方(m³)</div>
              <div class="segment-content">{{ detailData.settlement.concreteCubeDeduction }}</div>
            </div>
            <div class="segment-item">
              <div class="segment-label">累计砼量(m³)</div>
              <div class="segment-content">{{ detailData.settlement.concreteCube }}</div>
            </div>
            <div class="segment-item haslink">
              <div class="segment-label">泵送方量(m³)</div>
              <div class="segment-content">{{ detailData.settlement.pumpCube }}</div>
              <div class="the-linker" @click="onShowTotal(1)">查看</div>
            </div>
            <div class="segment-item haslink">
              <div class="segment-label">特殊属性方量(m³)</div>
              <div class="segment-content">{{ detailData.settlement.concreteAttrCube }}</div>
              <div class="the-linker" @click="onShowTotal(0)">查看</div>
            </div>
            <div class="segment-item">
              <div class="segment-label">累计扣款(元)</div>
              <div class="segment-content">{{ detailData.settlement.totalTaxAmountDeduction | thousands }}</div>
            </div>
            <div class="segment-item">
              <div class="segment-label">上期尾款金额(元)</div>
              <div class="segment-content">{{ detailData.settlement.previousTaxFinalPayment | thousands }}</div>
            </div>
            <div class="segment-item">
              <div class="segment-label">本期货款金额(元)</div>
              <div class="segment-content">{{ detailData.settlement.currentTaxAmount | thousands }}</div>
            </div>
            <div class="segment-item">
              <div class="segment-label">月结总金额(元)</div>
              <div class="segment-content">{{ detailData.settlement.currentMonthAmount | thousands }}</div>
            </div>
            <div class="segment-item">
              <div class="segment-label">应结算金额(元)</div>
              <div class="segment-content font-orange">{{ detailData.settlement.settlementTaxAmount | thousands }}</div>
            </div>
            <div class="segment-item">
              <div class="segment-label">实付金额(元)</div>
              <div class="segment-content font-orange">{{ detailData.settlement.paidAmount | thousands }}</div>
            </div>
            <div class="segment-item">
              <div class="segment-label">本期尾款金额(元)</div>
              <div class="segment-content">{{ detailData.settlement.finalTaxPayment | thousands }}</div>
            </div>
          </div>
        </div>
        <!--结算单凭证 -->
        <div class="segment">
          <div class="segment-header">结算单凭证</div>
          <div class="segment-area flex-area" :span="2">
            <div class="segment-item warp">
              <div class="segment-label imglabel">对账纸质单据</div>
              <div class="segment-content imgcontent">
                <img
                  v-for="(el, index) in reconciliationFileList"
                  :key="index"
                  class="img-preview-item"
                  :src="el.url"
                  @click="onShowImgViewer('reconciliationViewer', index)"
                />
              </div>
            </div>
            <div class="segment-item warp">
              <div class="segment-label imglabel">调价凭证</div>
              <div class="segment-content imgcontent">
                <img
                  v-for="(el, index) in modyfyPriceFileList"
                  :key="index"
                  class="img-preview-item"
                  :src="el.url"
                  @click="onShowImgViewer('modyfyPriceViewer', index)"
                />
              </div>
            </div>
          </div>
        </div>
        <!-- 关联订单列表 -->
        <div class="item-header">关联订单列表</div>
        <div class="order-table-panel">
          <el-table :data="orderTableData.list" border @cell-click="handleCellClick">
            <el-table-column label="订单编号" prop="orderSn" min-width="140">
              <template slot-scope="scope">
                <el-button type="text" @click="onJumpOrderDetail(scope.row)">{{ scope.row.orderSn }}</el-button>
              </template>
            </el-table-column>
            <!-- <el-table-column label="订单状态" prop="statusValue" min-width="100">
              <template slot-scope="scope">
                <span>{{ scope.row.statusValue | valueToLabel(orderStatusArr) }}</span>
              </template>
            </el-table-column> -->
            <el-table-column label="创建时间" prop="gmtCreate" min-width="140">
              <template slot-scope="scope">
                <span>{{ scope.row.gmtCreate | dateFormat('YYYY-MM-DD HH:mm:ss') }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="施工部位"
              prop="orderConstructionSite"
              min-width="120"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column label="合计单价(元/m³)" prop="totalPrice" min-width="120"></el-table-column>
            <el-table-column label="商砼强度" prop="orderGoodsName" min-width="80"></el-table-column>
            <el-table-column label="小票方量(m³)" prop="orderReceiptNumber" min-width="110"></el-table-column>
            <el-table-column label="扣减方量(m³)" prop="orderConcreteCubeDeduction" min-width="130">
              <template slot="header" slot-scope="scope">
                <template v-if="settlementStatus === 'RECONCILIATION'">
                  <span class="font-default">{{ scope.column.label }}</span
                  ><i class="el-icon-edit font-default ml-5"></i>
                </template>
                <template v-else>
                  <span>{{ scope.column.label }}</span>
                </template>
              </template>
              <template slot-scope="scope">
                <span v-if="!scope.row.numberEdit">{{ scope.row.orderConcreteCubeDeduction }}</span>
                <span v-else>
                  <el-input
                    :ref="`table-number${scope.$index}`"
                    v-model="scope.row.orderConcreteCubeDeduction"
                    class="cell-mini-input"
                    type="text"
                    size="mini"
                    placeholder="扣减方量"
                    v-allow.number.float
                    @blur="onEditBlur(scope.row, 1)"
                  ></el-input>
                </span>
              </template>
            </el-table-column>
            <el-table-column label="砼量(m³)" prop="orderConcreteCube" min-width="110"></el-table-column>
            <el-table-column label="扣款金额(元)" prop="orderDeductionAmount" min-width="110">
              <template slot="header" slot-scope="scope">
                <template v-if="settlementStatus === 'RECONCILIATION'">
                  <span class="font-default">{{ scope.column.label }}</span
                  ><i class="el-icon-edit font-default ml-5"></i>
                </template>
                <template v-else>
                  <span>{{ scope.column.label }}</span>
                </template>
              </template>
              <template slot-scope="scope">
                <span v-if="!scope.row.moneyEdit">{{ scope.row.orderDeductionAmount | thousands }}</span>
                <span v-else>
                  <el-input
                    :ref="`table-money${scope.$index}`"
                    v-model="scope.row.orderDeductionAmount"
                    class="cell-mini-input"
                    type="text"
                    size="mini"
                    placeholder="扣款金额"
                    v-allow.number.float
                    @blur="onEditBlur(scope.row, 2)"
                  ></el-input>
                </span>
              </template>
            </el-table-column>
            <el-table-column label="扣款总计(元)" prop="orderDeductionAmountTotal" min-width="110"></el-table-column>
            <el-table-column label="订单金额总计(元)" min-width="130">
              <template slot-scope="scope">
                <span>{{ scope.row.orderSettlementTaxAmount | thousands }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="200">
              <template slot-scope="scope">
                <span
                  v-if="settlementStatus === 'RECONCILIATION'"
                  class="font-default pointer"
                  @click="onOrderCubeSave(scope.row)"
                  >保存</span
                >
                <span class="link-btn ml-10" @click="onShowOrderUploadDialog(scope.row)">扣款/扣方凭证</span>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-fix">
            <el-pagination
              :page-size="pageSize"
              :current-page.sync="page"
              :total="orderTableData.count"
              @current-change="handleCurrentChange"
              layout="total, prev, pager, next, jumper"
            ></el-pagination>
          </div>
        </div>
      </el-tab-pane>
      <!-- <el-tab-pane label="交易日志" name="log">
        <settlement-log ref="logTab" :settlementId="settlementId"></settlement-log>
      </el-tab-pane> -->
      <el-tab-pane label="供应链付款" name="pay">
        <settlement-pay
          ref="payTab"
          :settlementId="settlementId"
          :settlementStatus="settlementStatus || ''"
        ></settlement-pay>
      </el-tab-pane>
    </el-tabs>

    <!-- 查看特殊方量 -->
    <el-dialog
      :title="totlaCubeDialog.type === 0 ? '特殊属性方量' : '泵送方量'"
      :visible.sync="totlaCubeDialog.visible"
      width="500px"
      class="total-cube-dialog"
    >
      <el-table :data="totlaCubeDialog.data" border>
        <el-table-column label="类型" prop="attrName" min-width="110"></el-table-column>
        <el-table-column label="方量(m³)" prop="cube" min-width="110"></el-table-column>
      </el-table>
    </el-dialog>

    <!-- 对账纸质单据 -->
    <el-dialog
      title="对账纸质单据"
      :visible.sync="settlementUploadDialog.visible"
      @closed="onUploadDialogClose(1)"
      width="500px"
      class="order-upload-dialog"
    >
      <div class="upload-body-item">
        <img-upload-viewer
          ref="uploadSettlement"
          viewerTitle="对账纸质单据"
          :limit="3"
          :defaultFiles="settlementUploadDialog.settlementFiles"
        ></img-upload-viewer>
      </div>
      <span slot="footer">
        <el-button @click="settlementUploadDialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="onSettlementUploadConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 扣款扣方凭证 -->
    <el-dialog
      title="扣款扣方凭证"
      :visible.sync="orderUploadDialog.visible"
      width="550px"
      ref="orderUploadDialog"
      @closed="onUploadDialogClose(2)"
      class="order-upload-dialog"
      :class="{ 'disabled-upload': settlementStatus !== 'RECONCILIATION' }"
    >
      <div class="upload-body-item cl">
        <div class="upload-label">扣款凭证</div>
        <img-upload-viewer
          class="inlineblock"
          ref="uploadDeductMoney"
          viewerTitle="扣款凭证"
          :limit="3"
          :hidetip="true"
          :defaultFiles="orderUploadDialog.deductMoneyFiles"
        ></img-upload-viewer>
      </div>
      <div class="upload-body-item cl">
        <div class="upload-label">扣方凭证</div>
        <img-upload-viewer
          class="inlineblock"
          ref="uploadDeductCube"
          viewerTitle="扣方凭证"
          :limit="3"
          :hidetip="true"
          :defaultFiles="orderUploadDialog.deductCubeFiles"
        ></img-upload-viewer>
      </div>
      <span slot="footer">
        <template v-if="settlementStatus === 'RECONCILIATION'">
          <el-button @click="orderUploadDialog.visible = false">取 消</el-button>
          <el-button type="primary" @click="onOrderUploadConfirm">确 定</el-button>
        </template>
        <template v-else>
          <el-button type="primary" @click="orderUploadDialog.visible = false">关 闭</el-button>
        </template>
      </span>
    </el-dialog>

    <fe-viewer ref="purchaseCertViewer" title="采购商证件" :source="purchaseCertList"></fe-viewer>
    <fe-viewer ref="supplierCertViewer" title="供应商证件" :source="supplierCertList"></fe-viewer>
    <fe-viewer ref="reconciliationViewer" title="对账纸质单据" :source="reconciliationFileList"></fe-viewer>
    <fe-viewer ref="modyfyPriceViewer" title="调价凭证" :source="modyfyPriceFileList"></fe-viewer>
    <fe-viewer ref="deductViewer" title="扣款凭证" :source="modyfyPriceFileList"></fe-viewer>
  </layout>
</template>
<script>
import dayjs from 'dayjs';
import axios from '@/utils/axios';
import api from '@/api/mall.api';
import listMixin from '@/utils/listMixin';
import Validator from '@/utils/Validator';
import utils from '@/utils/utils';
import calc from '@/utils/calc';

import ImgUploadViewer from '@/components/ImgUploadViewer';

const SettlementLog = () => import('@/views/mall/SettlementLog');
const SettlementPay = () => import('@/views/mall/SettlementPay');

export default {
  components: { ImgUploadViewer, SettlementPay },
  mixins: [listMixin],
  data: function() {
    return {
      tabActive: 'detail',
      settlementId: '',
      settlementStatus: '',
      uploadAction: api.upload,
      uploadHeader: {
        Authorization: localStorage.getItem('Authorization') || ''
      },
      imgFileList: [],
      imgSize: Validator.imgLimit,

      statementStatusArr: [],
      orderStatusArr: [],
      purchaseCertList: [],
      supplierCertList: [],
      reconciliationFileList: [],
      modyfyPriceFileList: [],

      detailData: {
        project: {},
        settlement: {},
        files: []
      },
      tableOptions: {
        statementId: ''
      },
      sendOptions: {},
      orderTableData: {},
      dialogVisible: false,

      totlaCubeDialog: {
        visible: false,
        type: 1,
        data: []
      },
      orderUploadDialog: {
        visible: false,
        row: {},
        deductMoneyFiles: [],
        deductCubeFiles: []
      },
      settlementUploadDialog: {
        visible: false,
        settlementFiles: []
      }
    };
  },
  computed: {
    settlementRange() {
      const startDate = dayjs(this.detailData.settlement.settlementStartDate).format('YYYY-MM-DD');
      const endDate = dayjs(this.detailData.settlement.settlementEndDate).format('YYYY-MM-DD');
      return `${startDate} ~ ${endDate}`;
    }
  },
  async created() {
    const dict = await utils.getSysDict('');
    this.statementStatusArr = dict.statement_status; // 结算单状态
    this.orderStatusArr = dict.order_status; // 结算单订单状态

    this.settlementId = this.$route.params.settlementId;
    // 查询结算单详情
    await this.getPageDetail();

    // 查询企业证件
    const fileList = await utils.queryCompanyFileList([
      this.detailData.project.purchaserId,
      this.detailData.project.supplierId
    ]);
    this.purchaseCertList = fileList[0];
    this.supplierCertList = fileList[1];

    // 查询关联订单列表
    this.tableOptions.statementId = this.settlementId;
    this.handleSearch();
  },
  methods: {
    async getPageDetail() {
      return new Promise(async (resolve, reject) => {
        // 查询结算单详情
        const detailRes = await axios.post(api.settlementDetail, { statementId: this.settlementId });
        detailRes.data.files = detailRes.data.files || [];
        this.detailData = detailRes.data;
        this.settlementStatus = this.detailData.settlement.settlementStatus || '';

        this.reconciliationFileList = [];
        this.modyfyPriceFileList = [];
        // 凭证照片
        this.detailData.files.forEach(element => {
          if (element.fileType === 'STATEMENT_RECONCILIATION') {
            this.reconciliationFileList.push({ url: element.filePath });
          }
          if (element.fileType === 'STATEMENT_PRICE_ADJUSTMENT_CREDENTIALS') {
            this.modyfyPriceFileList.push({ url: element.filePath });
          }
        });

        resolve();
      });
    },
    tabChange(tab, event) {
      switch (this.tabActive) {
        case 'log':
          break;
        case 'pay':
          this.$refs.payTab.init(); //每次切换重新获取数据
          break;
        default:
          break;
      }
    },
    // 行内编辑
    handleCellClick(row, column, cell, event) {
      if (this.settlementStatus !== 'RECONCILIATION') {
        // 待对账状态下才能编辑
        return;
      }
      const idx = this.orderTableData.list.indexOf(row);
      if (column.property === 'orderConcreteCubeDeduction') {
        row.numberEdit = true;
        this.$nextTick(() => {
          this.$refs[`table-number${idx}`].focus();
        });
      }
      if (column.property === 'orderDeductionAmount') {
        row.moneyEdit = true;
        this.$nextTick(() => {
          this.$refs[`table-money${idx}`].focus();
        });
      }
    },
    // 文本框失去焦点计算金额
    onEditBlur(row, type) {
      if (type === 1) {
        row.numberEdit = false;
        row.orderConcreteCubeDeduction = (+row.orderConcreteCubeDeduction || 0).toFixedNew(2);
      }
      if (type === 2) {
        row.moneyEdit = false;
        row.orderDeductionAmount = (+row.orderDeductionAmount || 0).toFixedNew(2);
      }
      // 砼量 = 小票方量 - 扣减方量
      let orderConcreteCube = calc.subtract(row.orderReceiptNumber || 0, row.orderConcreteCubeDeduction || 0);
      orderConcreteCube = orderConcreteCube.toFixedNew(2);
      row.orderConcreteCube = orderConcreteCube;

      // 扣减方量金额 = 扣减方量 * 合计单价
      let orderDeductionCubeAmount = calc.multiply(row.orderConcreteCubeDeduction || 0, row.totalPrice || 0);
      orderDeductionCubeAmount = orderDeductionCubeAmount.toFixedNew(2);

      // 扣款总计 = 扣款金额 + 扣款方量金额
      let orderDeductionAmountTotal = calc.add(row.orderDeductionAmount || 0, orderDeductionCubeAmount || 0);
      orderDeductionAmountTotal = orderDeductionAmountTotal.toFixedNew(2);
      row.orderDeductionAmountTotal = orderDeductionAmountTotal;

      // 订单总额 = 合计单价 * 净胜砼量 - 扣款金额
      let orderSettlementTaxAmount = calc.multiply(row.totalPrice || 0, row.orderConcreteCube || 0);
      orderSettlementTaxAmount = orderSettlementTaxAmount.toFixedNew(2);
      orderSettlementTaxAmount = calc.subtract(orderSettlementTaxAmount || 0, row.orderDeductionAmount || 0);
      orderSettlementTaxAmount = orderSettlementTaxAmount.toFixedNew(2);
      row.orderSettlementTaxAmount = orderSettlementTaxAmount;
    },
    // 结算订单 保存
    async onOrderCubeSave(row) {
      if (row.orderConcreteCube < 0) {
        this.$message.error('扣减方量不可大于小票方量');
        return;
      }
      if (row.orderSettlementTaxAmount < 0) {
        this.$message.error('订单金额不能小于0');
        return;
      }
      let result = await axios.post(api.settlementDeduction, {
        deductionAmount: row.orderDeductionAmount,
        deductionCube: row.orderConcreteCubeDeduction,
        orderSn: row.orderSn,
        projectId: this.detailData.project.id,
        statementId: row.statementId
      });
      this.$message.success('保存成功');
      this.orderUploadDialog.visible = false;
      this.handleSearch();
      this.getPageDetail();
    },
    onShowImgViewer(ref, idx) {
      this.$refs[ref].show({ initialViewIndex: idx });
    },
    onJumpOrderDetail(row) {
      this.$router.push({ path: '/order/detail/' + row.orderSn });
    },
    // 查看企业证件
    onShowCompanyCert(ref) {
      this.$nextTick(() => this.$refs[ref].show());
    },
    // 查看累计泵送方量、特殊属性方量
    async onShowTotal(type) {
      let result = await axios.post(api.settlementOrderCubeAttr, {
        statementId: this.detailData.settlement.id,
        type: type
      });

      this.totlaCubeDialog.data = result.data || [];
      this.totlaCubeDialog.type = type;
      this.totlaCubeDialog.visible = true;
    },
    // 查看单价对照表
    onJumpProjectPrice(type) {
      let routerName = 'SettlementViewPrice';
      if (type === 'edit') {
        routerName = 'SettlementModifyPrice';
      }
      this.$router.push({
        name: routerName,
        params: {
          settlementId: this.detailData.settlement.id,
          settlementSn: this.detailData.settlement.settlementSn
        }
      });
    },
    // 结算单-订单上传凭证dialog show
    async onShowOrderUploadDialog(row) {
      let result = await axios.post(api.settlementOrderAttachment, { orderId: row.id });
      result = result.data || [];
      let deductMoneyFiles = [],
        deductCubeFiles = [];
      result.forEach(el => {
        if (el.fileType === 'STATEMENT_DEDUCTION_AMOUNT_CREDENTIALS') {
          deductMoneyFiles.push(el.filePath);
        }
        if (el.fileType === 'STATEMENT_DEDUCTION_CUBE_CREDENTIALS') {
          deductCubeFiles.push(el.filePath);
        }
      });
      this.orderUploadDialog.deductMoneyFiles = deductMoneyFiles;
      this.orderUploadDialog.deductCubeFiles = deductCubeFiles;
      this.orderUploadDialog.row = row;
      this.$nextTick(() => {
        this.orderUploadDialog.visible = true;
      });
    },
    // uploadDialog关闭时 清空已经设置的文件  否则再次弹出时 渲染会先删再加
    onUploadDialogClose(type) {
      if (type === 1) {
        this.settlementUploadDialog.settlementFiles = [];
      } else {
        this.orderUploadDialog.deductMoneyFiles = [];
        this.orderUploadDialog.deductCubeFiles = [];
      }
    },
    // 结算单-订单上传凭证dialog confirm
    async onOrderUploadConfirm() {
      const deductMoneyFiles = this.$refs.uploadDeductMoney.getUploadFiles();
      const deductCubeFiles = this.$refs.uploadDeductCube.getUploadFiles();

      if (deductMoneyFiles.length > 0 || deductCubeFiles.length > 0) {
        const uploadParams = {
          orderId: this.orderUploadDialog.row.id,
          fileInfos: [
            { fileType: 'STATEMENT_DEDUCTION_AMOUNT_CREDENTIALS', filePath: deductMoneyFiles },
            { fileType: 'STATEMENT_DEDUCTION_CUBE_CREDENTIALS', filePath: deductCubeFiles }
          ]
        };
        let result = await axios.post(api.settlementOrderUpload, uploadParams);
        this.$message.success('保存成功');
        this.orderUploadDialog.visible = false;
      } else {
        this.$message.error('请上传凭证');
      }
    },
    // 上传对账纸质单据 dialog show
    onShowSettlementUploadDialog() {
      let files = this.detailData.files.filter(el => el.fileType === 'STATEMENT_RECONCILIATION').map(el => el.filePath);
      this.settlementUploadDialog.settlementFiles = files;
      this.settlementUploadDialog.visible = true;
    },
    // 上传对账纸质单据 confirm
    async onSettlementUploadConfirm() {
      const files = this.$refs.uploadSettlement.getUploadFiles();
      await axios.post(api.settlementUploadAttachment, {
        statementId: this.detailData.settlement.id,
        fileInfos: [{ fileType: 'STATEMENT_RECONCILIATION', filePath: files }]
      });

      this.getPageDetail();
      this.$message.success('保存成功');
      this.settlementUploadDialog.settlementFiles = [];
      this.settlementUploadDialog.visible = false;
    },
    // 确认对账信息
    onSettlementConfirm() {
      this.$confirm('是否确认对账无误?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(async () => {
        await axios.post(api.settlementConfirm, { statementId: this.settlementId });
        this.getPageDetail();
        this.$message.success('确认成功');
      });
    },
    // 确认已结算 (结算支付)
    onConfirmSetted() {
      let payAmount = this.detailData.settlement.currentTaxPayAmount || 0;
      payAmount = payAmount.toFixedNew(2);
      // 加千分位
      let payAmountString = payAmount.toString().split('.');
      payAmountString[0] = payAmountString[0].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + ',');
      payAmountString = payAmountString.join('.');

      let tipText = '';
      if (this.detailData.project.statementMode === 0) {
        tipText = '预付款扣款';
      } else {
        tipText = '公对公打款金额';
      }

      this.$confirm(
        '' + tipText + ' <span class="font-orange ml-20">' + payAmountString + '元</span>',
        '是否确认结算金额？',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
          center: true
        }
      ).then(async () => {
        await axios.post(api.settlementPaymentPay, { statementId: this.settlementId, amount: payAmount });
        this.getPageDetail();
        this.$message.success('结算成功');
      });
    },
    // 查询关联结算订单列表
    async fetchData(opts) {
      const options = { page: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let result = await axios.post(api.settlementOrderList, options);
      result.data = result.data || {};
      result.data.list = result.data.list || [];
      result.data.list.forEach(row => {
        row.numberEdit = false;
        row.moneyEdit = false;

        // 扣款总计 = 扣款金额 + 扣款方量金额
        let orderDeductionAmountTotal = calc.add(row.orderDeductionAmount || 0, row.orderDeductionCubeTaxAmount || 0);
        orderDeductionAmountTotal = orderDeductionAmountTotal.toFixedNew(2);
        row.orderDeductionAmountTotal = orderDeductionAmountTotal; // 扣款总计

        // 合计单价(含税) = 商砼单价 + 特殊属性单价 + 泵送单价
        let totalPrice = calc.add(row.orderConcreteTaxPrice || 0, row.orderAttrTaxPrice || 0);
        totalPrice = totalPrice.toFixedNew(2);
        totalPrice = calc.add(totalPrice || 0, row.orderPumpTaxPrice || 0);
        totalPrice = totalPrice.toFixedNew(2);
        row.totalPrice = totalPrice;
      });

      this.orderTableData = result.data || {};
    }
  }
};
</script>
<style lang="postcss">
.order-table-panel {
  position: relative;
  min-height: 120px;
  padding-bottom: 40px;
  .cell-mini-input .el-input__inner {
    height: 21px;
    line-height: 21px;
    border-radius: 2px;
    padding: 0 5px;
  }
}
.total-cube-dialog {
  .el-table {
    width: 85%;
    margin: 10px auto 30px;
  }
}

.order-upload-dialog {
  .upload-body-item {
    .upload-label {
      margin-right: 10px;
      height: 100px;
      line-height: 100px;
      float: left;
    }
  }
  .upload-body-item + .upload-body-item {
    margin-top: 20px;
  }
}
.order-upload-dialog.disabled-upload {
  .el-upload.el-upload--picture-card {
    display: none;
  }
  .el-upload-list__item-status-label,
  .el-icon-close,
  .el-icon-close,
  .el-upload-list__item-delete {
    display: none !important;
  }
}
</style>
