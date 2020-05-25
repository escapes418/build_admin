<template>
  <layout navActive="mall">
    <el-breadcrumb separator=">">
      <el-breadcrumb-item>交易管理</el-breadcrumb-item>
      <el-breadcrumb-item to="/order/list">订单列表</el-breadcrumb-item>
      <el-breadcrumb-item>订单详情</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="detail-hander-panel mb-0">
      <div class="detail-hander-content mb-15">
        <span class="font-label">订单编号：</span>
        <span class="font-default">{{ orderDetail.orderSn }}</span>
        <span class="ml-20">订单状态：</span>
        <span class="font-default">{{ orderDetail.orderStatus | valueToLabel(orderStatusArr) }}</span>
      </div>
      <div class="detail-hander-toolbtn">
        <!-- 仅订单状态为“待确认”和“待发货”，展示订单关闭入口&&拥有关闭订单权限 -->
        <el-button
          v-has="'mall:order:pending:close'"
          v-if="orderDetail.orderStatus === 'UNCONFIRMED' || orderDetail.orderStatus === 'SENDABLE'"
          type="primary"
          class="mr-15"
          @click="handleCloseOrder"
        >
          关闭订单
        </el-button>
        <router-link to="/order/list">
          <el-button>返回列表</el-button>
        </router-link>
      </div>
    </div>
    <!-- 订单详情 -->
    <div class="segment">
      <div class="segment-header">订单详情</div>
      <div class="segment-area flex-area" :span="2">
        <div class="segment-item">
          <div class="segment-label">创建时间</div>
          <div class="segment-content">{{ orderDetail.gmtCreate }}</div>
        </div>

        <div class="segment-item">
          <div class="segment-label">项目编号</div>
          <div class="segment-content">{{ orderDetail.projectSn }}</div>
        </div>
        <div class="segment-item haslink">
          <div class="segment-label">供应商名称</div>
          <div class="segment-content">
            <span :title="orderDetail.supplierName">{{ orderDetail.supplierName }}</span>
          </div>
          <div class="the-linker" @click="onShowViewer('viewerSupplier')">查看证件</div>
        </div>
        <div class="segment-item">
          <div class="segment-label">供应商联系电话</div>
          <div class="segment-content">{{ orderDetail.supplierMobile }}</div>
        </div>
        <div class="segment-item haslink">
          <div class="segment-label">加工商名称</div>
          <div class="segment-content">
            <span :title="orderDetail.processorName">{{ orderDetail.processorName }}</span>
          </div>
          <div class="the-linker" @click="onShowViewer('viewerProcessor')">查看证件</div>
        </div>
        <div class="segment-item">
          <div class="segment-label">加工商联系电话</div>
          <div class="segment-content">{{ orderDetail.processorMobile }}</div>
        </div>
        <div class="segment-item haslink">
          <div class="segment-label">采购商名称</div>
          <div class="segment-content">
            <span :title="orderDetail.purchaserName">{{ orderDetail.purchaserName }}</span>
          </div>
          <div class="the-linker" @click="onShowViewer('viewerPurchaser')">查看证件</div>
        </div>
        <div class="segment-item">
          <div class="segment-label">采购商联系电话</div>
          <div class="segment-content">{{ orderDetail.purchaserMobile }}</div>
        </div>
        <div class="segment-line mt-10 mb-10"></div>

        <div class="segment-item">
          <div class="segment-label">施工部位</div>
          <div class="segment-content">
            <span :title="orderDetail.orderConstructionSite">{{ orderDetail.orderConstructionSite }}</span>
          </div>
        </div>
        <div class="segment-item">
          <div class="segment-label">商砼强度</div>
          <div class="segment-content">{{ orderDetail.goodsName }}</div>
        </div>
        <div class="segment-item">
          <div class="segment-label">要货数量(m³)</div>
          <div class="segment-content">
            <span>{{ orderDetail.quantity }}</span>
          </div>
        </div>
        <div class="segment-item">
          <div class="segment-label">期望到货时间</div>
          <div class="segment-content">{{ orderDetail.hopeTime | dateFormat('YYYY-MM-DD HH:mm') }}</div>
        </div>
        <div class="segment-item row-width">
          <div class="segment-label">到货地址</div>
          <div class="segment-content">
            <span :title="orderDetail.targetAddress">{{ orderDetail.targetAddress }}</span>
          </div>
        </div>
        <div class="segment-line mt-10 mb-10"></div>
        <div class="segment-item">
          <div class="segment-label">浇筑方式</div>
          <div class="segment-content">
            <span :title="orderDetail.pouringName">{{ orderDetail.pouringName }}</span>
          </div>
        </div>
        <div class="segment-item">
          <div class="segment-label">特殊属性</div>
          <div class="segment-content">{{ orderDetail.attrName }}</div>
        </div>
        <div class="segment-line mt-10 mb-10"></div>
        <div class="segment-item">
          <div class="segment-label">承运商名称</div>
          <div class="segment-content">
            <span :title="orderDetail.carrierName">{{ orderDetail.carrierName }}</span>
          </div>
        </div>
        <!-- <div class="segment-item haslink">
          <div class="segment-label">物流承运协议</div>
          <div class="segment-content">{{ orderDetail.logisticsProtocol }}</div>
          <div class="the-linker">查看</div>
        </div> -->
        <div class="segment-line mt-10 mb-10"></div>
        <div class="segment-item">
          <div class="segment-label">订单确认时间</div>
          <div class="segment-content">
            <span>{{ orderDetail.confirmTime }}</span>
          </div>
        </div>
        <div class="segment-item">
          <div class="segment-label">到货时间</div>
          <div class="segment-content">{{ orderDetail.arrivalTime }}</div>
        </div>
        <div class="segment-item">
          <div class="segment-label">完成配送时间</div>
          <div class="segment-content">{{ orderDetail.finishTime }}</div>
        </div>
      </div>
    </div>
    <!-- 订单数据 -->
    <div class="segment">
      <div class="segment-header">订单数据</div>
      <div class="segment-area flex-area" :span="3">
        <div class="segment-item">
          <div class="segment-label">在途运单</div>
          <div class="segment-content">{{ orderDetail.onWayCount }}</div>
        </div>
        <div class="segment-item">
          <div class="segment-label">累计卸货运单</div>
          <div class="segment-content">{{ orderDetail.unloadCount }}</div>
        </div>
        <div class="segment-item">
          <div class="segment-label">累计签收运单</div>
          <div class="segment-content">{{ orderDetail.signedCount }}</div>
        </div>
        <div class="segment-line mt-10 mb-10"></div>
        <div class="segment-item">
          <div class="segment-label">累计小票方量(m³)</div>
          <div class="segment-content" v-if="orderDetail.settlementStatus === 1">{{ orderDetail.receiptNumber }}</div>
          <div class="segment-content" v-else>-</div>
        </div>
        <div class="segment-item">
          <div class="segment-label">累计扣减方量(m³)</div>
          <div class="segment-content" v-if="orderDetail.settlementStatus === 1">
            {{ orderDetail.orderConcreteCubeDeduction }}
          </div>
          <div class="segment-content" v-else>-</div>
        </div>
        <div class="segment-item">
          <div class="segment-label">累计砼量(m³)</div>
          <div class="segment-content" v-if="orderDetail.settlementStatus === 1">{{ orderDetail.totalNumber }}</div>
          <div class="segment-content" v-else>-</div>
        </div>
        <div class="segment-item">
          <div class="segment-label">特殊属性方量(m³)</div>
          <div class="segment-content" v-if="orderDetail.settlementStatus === 1">{{ orderDetail.specialNumber }}</div>
          <div class="segment-content" v-else>-</div>
        </div>
        <div class="segment-item">
          <div class="segment-label">泵送方量(m³)</div>
          <div class="segment-content" v-if="orderDetail.settlementStatus === 1">{{ orderDetail.pumpNumber }}</div>
          <div class="segment-content" v-else>-</div>
        </div>
        <div class="segment-item">
          <div class="segment-label">累计扣款(元)</div>
          <div class="segment-content" v-if="orderDetail.settlementStatus === 1">
            {{ orderDetail.totalDeductionAmount }}
          </div>
          <div class="segment-content" v-else>-</div>
        </div>
        <div class="segment-item haslink" v-if="orderDetail.orderStatus === 'FINISH'">
          <div class="segment-label">扣方凭证</div>
          <div class="the-linker" @click="onShowViewer('viewerDeductionCube', orderDetail.deductionCubeFileList)">
            查看
          </div>
        </div>
        <div class="segment-item haslink" v-if="orderDetail.orderStatus === 'FINISH'">
          <div class="segment-label">扣款凭证</div>
          <div class="the-linker" @click="onShowViewer('viewerDeductionAmount', orderDetail.deductionAmountFileList)">
            查看
          </div>
        </div>
      </div>
    </div>
    <!-- 运单列表 -->
    <div class="item-header">运单列表</div>
    <div class="conn-table-panel">
      <el-table :data="tableData.list" border>
        <el-table-column label="运单编号" prop="waybillSn" min-width="140">
          <template slot-scope="scope">
            <span class="font-default pointer" @click="onJumpWaybillDetail(scope.row)">{{ scope.row.waybillSn }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="订单编号" prop="" min-width="90"></el-table-column>
        <el-table-column label="项目编号" prop="" min-width="90"></el-table-column> -->
        <el-table-column label="运单状态" prop="billStatus" min-width="90">
          <template slot-scope="scope">
            <span>{{ scope.row.billStatus | valueToLabel(statusArr) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="发货地" prop="sendAddress" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column label="交货地" prop="receiptAddress" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column label="车牌号" prop="plateNumber" min-width="90"></el-table-column>
        <el-table-column label="小票方量(m³)" prop="sendNumber" min-width="90">
          <template slot-scope="scope">
            <span>{{ scope.row.sendNumber | thousands }}</span>
          </template>
        </el-table-column>
        <el-table-column label="砼量(m³)" prop="settlementNumber" min-width="90">
          <template slot-scope="scope">
            <span>{{ scope.row.settlementNumber | thousands }}</span>
          </template>
        </el-table-column>
        <el-table-column label="结算运价(元/m³)" prop="freightPrice" min-width="110">
          <template slot-scope="scope">
            <span>{{ scope.row.freightPrice | thousands }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" prop="" min-width="80">
          <template slot-scope="scope">
            <el-button type="text" @click="onShowTradeViewer(scope.row)">贸易凭证</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="">
      <el-pagination
        :page-size="pageSize"
        :current-page.sync="page"
        :total="tableData.count"
        @current-change="handleCurrentChange"
        layout="total, prev, pager, next, jumper"
      ></el-pagination>
    </div>

    <!-- 采购商证件 -->
    <fe-viewer ref="viewerPurchaser" title="采购商证件" :source="viewerPurchaserSource"></fe-viewer>
    <!-- 供应商证件 -->
    <fe-viewer ref="viewerSupplier" title="供应商证件" :source="viewerSupplierSource"></fe-viewer>
    <!-- 加工商证件 -->
    <fe-viewer ref="viewerProcessor" title="加工商证件" :source="viewerProcessorSource"></fe-viewer>
    <!-- 扣方凭证-->
    <fe-viewer ref="viewerDeductionCube" title="扣方凭证" :source="viewerDeductionCubeSource"></fe-viewer>
    <!-- 扣款凭证-->
    <fe-viewer ref="viewerDeductionAmount" title="扣款凭证" :source="viewerDeductionAmountSource"></fe-viewer>
    <!-- 贸易凭证 -->
    <fe-viewer ref="trade_file_viewer" title="贸易凭证" :source="tradeFileSource"></fe-viewer>
  </layout>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/mall.api';
import listMixin from '@/utils/listMixin';
import utils from '@/utils/utils';

export default {
  name: 'OrderDetail',
  mixins: [listMixin],
  data() {
    return {
      tabActive: 'detail',
      purchaseCertList: [],
      purchaseCertViewer: null,
      supplierCertList: [],
      supplierCertViewer: null,
      ViewLog: '',
      orderDetail: {},
      tableOptions: { orderSn: '' },
      sendOptions: {},
      tableData: {},
      orderStatusArr: [], // 订单状态字典
      viewerPurchaserSource: [], // 采购商证件
      viewerSupplierSource: [], // 供应商证件
      viewerProcessorSource: [], // 加工商证件
      viewerDeductionCubeSource: [], // 扣方凭证
      viewerDeductionAmountSource: [], // 扣款凭证
      purchaserImgs: [],
      supplierImgs: [],
      processorImgs: [],
      statusArr: [],
      tradeFileSource: []
    };
  },
  async created() {
    // 获取订单状态字典
    this.orderStatusArr = await utils.getSysDict('order_status');
    // 获取运单状态字典
    this.statusArr = await utils.getSysDict('waybill_status');
    this.init();
  },
  methods: {
    async init() {
      // 订单详情
      const detailData = await axios.post(api.orderDetail, { orderSn: this.$route.params.id });
      this.orderDetail = detailData.data;
      this.tableOptions.orderSn = this.orderDetail.orderSn;
      // 查询企业证件
      const fileList = await utils.queryCompanyFileList([
        this.orderDetail.purchaserId,
        this.orderDetail.supplierId,
        this.orderDetail.processorId
      ]);
      // 采购商证件
      this.purchaserImgs = fileList[0];
      // 供应商证件
      this.supplierImgs = fileList[1];
      // 加工商证件
      this.processorImgs = fileList[2];

      // 订单关联的运单列表
      this.handleSearch();
    },
    onJumpWaybillDetail(row) {
      this.$router.push({ path: '/waybill/detail/' + row.waybillSn });
    },
    onShowViewer(ref, list = []) {
      switch (ref) {
        case 'viewerPurchaser': // 采购商证件
          this.viewerPurchaserSource = this.purchaserImgs;
          break;
        case 'viewerSupplier': // 供应商证件
          this.viewerSupplierSource = this.supplierImgs;
          break;
        case 'viewerProcessor': // 加工商证件
          this.viewerProcessorSource = this.processorImgs;
          break;
        case 'viewerDeductionCube': // 扣方凭证
          this.viewerDeductionCubeSource = list.map(el => {
            return { url: el || '', title: '扣方凭证' };
          });
          break;
        case 'viewerDeductionAmount': // 扣款凭证
          this.viewerDeductionAmountSource = list.map(el => {
            return { url: el || '', title: '扣款凭证' };
          });
          break;
      }
      this.$nextTick(() => {
        this.$refs[ref].show();
      });
    },
    async fetchData(opts) {
      const options = { page: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let result = await axios.post(api.waybillQueryList, options);
      this.tableData = result.data;
    },
    handleCloseOrder() {
      this.$confirm(`确定要关闭此订单吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await axios.post(api.orderClose, {
            id: this.orderDetail.id,
            version: this.orderDetail.version
          });
          this.$message.success('成功关闭订单');
          this.init();
        })
        .catch(() => {
          this.$message({ type: 'info', message: '操作已取消' });
        });
    },
    // 查看证件
    onShowTradeViewer(row) {
      let imgs = row.fileGroup ? row.fileGroup.split(',') : [];
      this.tradeFileSource = imgs.map(el => {
        return { url: el || '', title: '贸易凭证' };
      });
      this.$nextTick(() => {
        this.$refs.trade_file_viewer.show();
      });
    }
  }
};
</script>
<style lang="postcss">
.conn-table-panel {
  position: relative;
  min-height: 120px;
  padding-bottom: 40px;
}
</style>
