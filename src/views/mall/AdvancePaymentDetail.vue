<template>
  <layout navActive="mall">
    <div class="advance-payment-detail">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>预付款管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/advance/payment/list' }">预付款列表</el-breadcrumb-item>
        <el-breadcrumb-item>预付款明细</el-breadcrumb-item>
      </el-breadcrumb>

      <!--项目信息-->
      <section>
        <div class="item-header">商户信息</div>
        <div class="segment segment-panels noborder">
          <div class="segment-area flex-area" :span="3">
            <div class="segment-item">
              <div class="segment-label">项目编号</div>
              <div class="segment-content">{{ tableData.projectSn }}</div>
            </div>
            <div class="segment-item">
              <div class="segment-label">项目名称</div>
              <div class="">{{ params.projectName }}</div>
            </div>
            <div class="segment-item">
              <div class="segment-label">商户类型</div>
              <div class="">{{ tableData.supplierTypeName }}</div>
            </div>
            <div class="segment-item">
              <div class="segment-label">商户预付款总额(元)</div>
              <div class="segment-content">{{ tableData.amount | thousands }}</div>
            </div>
            <div class="segment-item">
              <div class="segment-label">商户预付款余额(元)</div>
              <div class="segment-content">{{ tableData.availableAmount | thousands }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 预付款流水 -->
      <section>
        <div class="item-header">预付款流水</div>
        <el-table :data="tableData.list" border>
          <el-table-column prop="advanceDetailId" label="预付款流水号" min-width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="font-default">{{ scope.row.advanceDetailId }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="gmtCreate" label="预付时间" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="advanceModeName" label="资金类型" min-width="100" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="paymentAmount" label="金额(元)" min-width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ scope.row.paymentAmount | thousands }}</span>
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
      </section>

      <div class="text-l mt-20">
        <el-button @click="onJumpList">返回</el-button>
      </div>
    </div>
  </layout>
</template>
<script>
import axios from '@/utils/axios';
import api from '@/api/mall.api';
import listMixin from '@/utils/listMixin';
import utils from '@/utils/utils';

export default {
  mixins: [listMixin],
  data() {
    return {
      companyTypeArr: [], //商户类型
      selectedProjectPayment: {},
      // 发送请求实际字段
      sendOptions: {},
      tableData: {
        list: [],
        count: 1
      },
      tableOptions: {
        advanceId: '' //项目关系编号 ,
      },
      params: {
        projectName: ''
      }
    };
  },
  computed: {},
  async created() {
    this.params.advanceId = this.$route.params.advanceId || '';
    this.params.projectName = decodeURIComponent(this.$route.params.projectName) || '';
    this.tableOptions.advanceId = this.params.advanceId;
    // 商户类型字典
    const companyTypeArr = await utils.getSysDict('company_type');
    this.companyTypeArr = [...companyTypeArr, ...[{ label: '承运商', value: 'CARRIER' }]].filter(
      el => el.value !== 'FIN'
    );

    this.handleSearch();
  },
  methods: {
    onJumpList() {
      this.$router.push({
        path: `/advance/payment/remaining/${this.tableData.projectSn}/${encodeURIComponent(this.params.projectName)}`
      });
    },

    async fetchData(opts) {
      const options = { page: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let res = await axios.post(api.advanceBalanceDetail, options);
      this.tableData = res.data;
    }
  }
};
</script>
<style scoped lang="postcss">
.advance-payment-detail {
  .segment-item {
    .segment-label {
      width: 135px;
    }
  }
}
</style>
