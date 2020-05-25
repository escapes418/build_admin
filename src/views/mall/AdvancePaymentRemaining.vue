<template>
  <layout navActive="mall">
    <div class="advance-payment-detail">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>预付款管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/advance/payment/list' }">预付款列表</el-breadcrumb-item>
        <el-breadcrumb-item>预付款余额</el-breadcrumb-item>
      </el-breadcrumb>

      <!--项目信息-->
      <section>
        <div class="item-header">项目信息</div>
        <div class="segment segment-panels noborder">
          <div class="segment-area flex-area" :span="3">
            <div class="segment-item">
              <div class="segment-label">项目编号</div>
              <div class="segment-content">{{ params.projectSn }}</div>
            </div>
            <div class="segment-item">
              <div class="segment-label">项目名称</div>
              <div class="">{{ params.projectName }}</div>
            </div>
            <div class="segment-item">
              <div class="segment-label">项目预付款总额(元)</div>
              <div class="segment-content">{{ tableData.totalAmount | thousands }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 预付款流水 -->
      <section>
        <div class="item-header">预付款流水</div>
        <el-table :data="tableData.list" border>
          <el-table-column prop="advanceId" label="预付款关系编号" min-width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="font-default pointer" @click="onJumpPaymentDetail(scope.row.advanceId)">{{
                scope.row.advanceId
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="supplierTypeName"
            label="商户类型"
            min-width="100"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column prop="supplierName" label="商户名称" min-width="100" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="amount" label="商户预付款总额(元)" min-width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ scope.row.amount | thousands }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="availableAmount" label="商户预付款余额(元)" min-width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ scope.row.availableAmount | thousands }}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" min-width="60">
            <template slot-scope="scope">
              <span class="font-default pointer" @click="onJumpPaymentDetail(scope.row.advanceId)">查看</span>
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
      // 发送请求实际字段
      sendOptions: {},
      tableOptions: {
        projectSn: '' //项目编号 ,
      },
      tableData: {
        list: [],
        count: 1
      },
      projectId: '',
      projectChainInfo: {},
      params: {
        projectSn: '',
        projectName: ''
      }
    };
  },
  computed: {},
  async created() {
    this.params.projectSn = this.$route.params.projectSn || '';
    this.params.projectName = decodeURIComponent(this.$route.params.projectName) || '';
    this.tableOptions.projectSn = this.params.projectSn;
    // 商户类型字典
    const companyTypeArr = await utils.getSysDict('company_type');
    this.companyTypeArr = [...companyTypeArr, ...[{ label: '承运商', value: 'CARRIER' }]].filter(
      el => el.value !== 'FIN'
    );

    // 项目预付款余额数据
    this.handleSearch();
  },
  methods: {
    onJumpList() {
      this.$router.push({
        path: `/advance/payment/list`
      });
    },
    onJumpPaymentDetail(advanceId = '') {
      this.$router.push({
        path: `/advance/payment/detail/${advanceId}/${encodeURIComponent(this.params.projectName)}`
      });
    },
    async fetchData(opts) {
      const options = { page: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let res = await axios.post(api.advanceBalance, options);
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
