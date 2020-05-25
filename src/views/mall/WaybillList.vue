<template>
  <layout navActive="mall">
    <div class="layout-content-list">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>交易管理</el-breadcrumb-item>
        <el-breadcrumb-item>运单列表</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">运单编号</span>
          <el-input
            v-model.trim="tableOptions.waybillSn"
            :maxlength="50"
            clearable
            placeholder="运单编号"
            @keyup.enter.native="handleSearch"
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">签收日期</span>
          <el-date-picker
            v-model="signTimeRange"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="val => handleDateChange(val, 'sign')"
            :picker-options="pickerOptions"
            type="datetimerange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          ></el-date-picker>
        </div>
        <div class="toolbar-item">
          <span class="item-label">运单状态</span>
          <el-select v-model="tableOptions.billStatus" clearable placeholder="请选择运单状态" style="width:140px;">
            <div v-for="item in statusArr" :key="item.value">
              <el-option :label="item.label" :value="item.value"></el-option>
            </div>
          </el-select>
        </div>
        <div class="toolbar-item">
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </div>
        <el-collapse-transition>
          <div v-show="toolexpand">
            <div class="toolbar-item">
              <span class="item-label">订单编号</span>
              <el-input
                v-model.trim="tableOptions.orderSn"
                :maxlength="50"
                clearable
                placeholder="订单编号"
                @keyup.enter.native="handleSearch"
              ></el-input>
            </div>
            <div class="toolbar-item">
              <span class="item-label">项目编号</span>
              <el-input
                v-model.trim="tableOptions.projectSn"
                :maxlength="50"
                clearable
                placeholder="项目编号"
                @keyup.enter.native="handleSearch"
              ></el-input>
            </div>
            <div class="toolbar-item">
              <span class="item-label">采购商名称</span>
              <el-input
                v-model.trim="tableOptions.purchaserName"
                :maxlength="50"
                clearable
                placeholder="采购商名称"
                @keyup.enter.native="handleSearch"
              ></el-input>
            </div>
            <div class="toolbar-item">
              <span class="item-label">供应商名称</span>
              <el-input
                v-model.trim="tableOptions.supplierName"
                :maxlength="50"
                clearable
                placeholder="供应商名称"
                @keyup.enter.native="handleSearch"
              ></el-input>
            </div>
            <div class="toolbar-item">
              <span class="item-label">发货地</span>
              <el-input
                v-model.trim="tableOptions.sendAddress"
                :maxlength="30"
                clearable
                placeholder="发货地"
                @keyup.enter.native="handleSearch"
              ></el-input>
            </div>
            <div class="toolbar-item">
              <span class="item-label">交货地</span>
              <el-input
                v-model.trim="tableOptions.receiptAddress"
                :maxlength="30"
                clearable
                placeholder="交货地"
                @keyup.enter.native="handleSearch"
              ></el-input>
            </div>
            <div class="toolbar-item">
              <span class="item-label">发货日期</span>
              <el-date-picker
                v-model="sendTimeRange"
                value-format="yyyy-MM-dd HH:mm:ss"
                @change="val => handleDateChange(val, 'send')"
                :picker-options="pickerOptions"
                type="datetimerange"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
              ></el-date-picker>
            </div>
          </div>
        </el-collapse-transition>
        <div class="toolmore-control mb-10">
          <div v-if="toolexpand" class="toolmore-control-btn" @click="toolexpand = false">
            <i class="el-icon-arrow-up"></i>
            <span class="">收起</span>
          </div>
          <div v-else class="toolmore-control-btn" @click="toolexpand = true">
            <i class="el-icon-arrow-down"></i>
            <span class="">展开</span>
          </div>
        </div>
      </div>

      <el-table :data="tableData.list" border>
        <el-table-column type="expand" width="40">
          <template slot-scope="scope">
            <el-form label-position="left" inline>
              <el-form-item label="订单编号">
                <span>{{ scope.row.orderSn }}</span>
              </el-form-item>
              <el-form-item label="项目编号">
                <span>{{ scope.row.projectSn }}</span>
              </el-form-item>
              <el-form-item label="发货地">
                <span :title="scope.row.sendAddress">{{ scope.row.sendAddress }}</span>
              </el-form-item>
              <el-form-item label="交货地">
                <span :title="scope.row.receiptAddress">{{ scope.row.receiptAddress }}</span>
              </el-form-item>
              <!-- <el-form-item label="货款状态">
                <span>{{ scope.row.isPaidValue }}</span>
              </el-form-item> -->
              <el-form-item label="采购商名称">
                <span :title="scope.row.purchaserName">
                  {{ scope.row.purchaserName }}
                </span>
              </el-form-item>
              <el-form-item label="供应商名称">
                <span :title="scope.row.supplierName">
                  {{ scope.row.supplierName }}
                </span>
              </el-form-item>
              <!-- <el-form-item label="供应链公司">
                <span :title="scope.row.finCompanyName">
                  {{ scope.row.finCompanyName }}
                </span>
              </el-form-item> -->
              <!-- <el-form-item label="税率">
                <span>{{ scope.row.taxRate | toFixed(2) }}%</span>
              </el-form-item>
              <el-form-item label="平台运价">
                <span>{{ scope.row.freightPrice | thousands }} 元/吨</span>
              </el-form-item>
              <el-form-item label="发货运价">
                <span>{{ scope.row.transportPrice | thousands }} 元/吨</span>
              </el-form-item>
              <el-form-item label="价格">
                <span>{{ scope.row.protocolPrice | thousands }} 元/吨</span>
              </el-form-item> -->
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="运单编号" prop="waybillSn" min-width="140">
          <template slot-scope="scope">
            <span class="font-default pointer" @click="onJumpDetail(scope.row)">{{ scope.row.waybillSn }}</span>
          </template>
        </el-table-column>
        <el-table-column label="运单状态" prop="billStatus" min-width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.billStatus | valueToLabel(statusArr) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="接单时间" prop="affirmTime" min-width="140" show-overflow-tooltip></el-table-column>
        <el-table-column label="签收时间" prop="targetTime" min-width="140" show-overflow-tooltip></el-table-column>
        <el-table-column label="车牌号" prop="plateNumber" min-width="90"></el-table-column>
        <el-table-column label="小票方量(m³)" prop="sendNumber" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.sendNumber | thousands }}</span>
          </template>
        </el-table-column>
        <el-table-column label="砼量(m³)" prop="settlementNumber" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.settlementNumber | thousands }}</span>
          </template>
        </el-table-column>
        <el-table-column label="运费单价(元/m³)" prop="freightPrice" min-width="110">
          <template slot-scope="scope">
            <span>{{ scope.row.freightPrice | thousands }}</span>
          </template>
        </el-table-column>
        <el-table-column label="实付金额(元)" prop="payAmount" min-width="90">
          <template slot-scope="scope">
            <span class="font-orange">{{ scope.row.payAmount | thousands }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="" min-width="80">
          <template slot-scope="scope">
            <el-button type="text" @click="onShowViewer(scope.row)">贸易凭证</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-fix">
        <el-pagination
          :page-size="pageSize"
          :current-page.sync="page"
          :total="tableData.count"
          @current-change="handleCurrentChange"
          layout="total, prev, pager, next, jumper"
        ></el-pagination>
      </div>

      <!-- 贸易凭证 -->
      <fe-viewer ref="trade_file_viewer" title="贸易凭证" :source="tradeFileSource"></fe-viewer>
    </div>
  </layout>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/mall.api';
import listMixin from '@/utils/listMixin';
import utils from '@/utils/utils';

export default {
  name: 'WaybillList',
  mixins: [listMixin],
  data() {
    return {
      toolexpand: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      sendTimeRange: [],
      signTimeRange: [],
      tableOptions: {
        affirmTimeEnd: '', // 运单接单结束时间
        affirmTimeStart: '', // 运单接单开始时间 ,
        billStatus: '', // 运单状态
        orderSn: '', // 订单编号
        projectSn: '', // 项目编号
        purchaserName: '', // 采购商名称
        receiptAddress: '', // 收货地
        sendAddress: '', // 发货地
        targetTimeEnd: '', // 运单签收结束时间
        targetTimeStart: '', // 运单签收结束时间
        supplierName: '', // 供应名称
        waybillSn: '' // 运单编号
      },
      sendOptions: {},
      tableData: {},
      statusArr: [],
      tradeFileSource: []
    };
  },
  async created() {
    const dict = await utils.getSysDict();
    this.statusArr = dict.waybill_status; //运单状态
    if (this.$route.name === 'WaybillListSn') {
      this.tableOptions.orderSn = this.$route.params.orderSn;
    }
    this.handleSearch();
  },
  methods: {
    onJumpDetail(row) {
      this.$router.push({ path: '/waybill/detail/' + row.waybillSn });
    },
    // 选择时间范围回调
    handleDateChange(val, type) {
      if (type === 'send') {
        // 发货
        if (val && val.length > 0) {
          this.tableOptions.affirmTimeStart = val[0];
          this.tableOptions.affirmTimeEnd = val[1];
        } else {
          this.tableOptions.affirmTimeStart = '';
          this.tableOptions.affirmTimeEnd = '';
        }
      } else {
        // 签收
        if (val && val.length > 0) {
          this.tableOptions.targetTimeStart = val[0];
          this.tableOptions.targetTimeEnd = val[1];
        } else {
          this.tableOptions.targetTimeStart = '';
          this.tableOptions.targetTimeEnd = '';
        }
      }
    },
    handleReset() {
      this.tableOptions = {
        affirmTimeEnd: '', // 运单接单结束时间
        affirmTimeStart: '', // 运单接单开始时间 ,
        billStatus: '', // 运单状态
        orderSn: '', // 订单编号
        projectSn: '', // 项目编号
        purchaserName: '', // 采购商名称
        receiptAddress: '', // 收货地
        sendAddress: '', // 发货地
        targetTimeEnd: '', // 运单签收结束时间
        targetTimeStart: '', // 运单签收结束时间
        supplierName: '', // 供应名称
        waybillSn: '' // 运单编号
      };
      this.sendTimeRange = [];
      this.signTimeRange = [];
      this.handleSearch();
    },
    async fetchData(opts) {
      const options = { page: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let result = await axios.post(api.waybillQueryList, options);
      this.tableData = result.data;
    },
    // 查看证件
    onShowViewer(row) {
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
