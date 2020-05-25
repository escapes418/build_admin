<template>
  <layout navActive="mall">
    <div class="layout-content-list">
      <div class="item-header">交易日志</div>
      <el-table :data="tableData.list" border>
        <el-table-column label="交易时间" prop="tradeTime" min-width="140" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.tradeTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="付款方" prop="tradeCompanyName" min-width="150" show-overflow-tooltip></el-table-column>
        <el-table-column
          label="收款方"
          prop="supplierCompanyName"
          min-width="150"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="交易金额(元)" prop="transAmount" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="font-orange">{{ scope.row.transAmount | thousands(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="交易类型" prop="transTypeText" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column label="说明" prop="remarks" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column label="银行回单" prop="" min-width="80">
          <!-- <template slot-scope="scope">
          <el-button type="text" @click="onPreviewImage(scope.row)">查看</el-button>
        </template> -->
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

      <ul id="protocol-log-viewer-panel">
        <li v-for="(el, index) in imgList" :key="index">
          <img :src="el" alt="银行回单" style="display:none" />
        </li>
      </ul>
    </div>
  </layout>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/mall.api';
import listMixin from '@/utils/listMixin';

import 'viewerjs/dist/viewer.css';
import Viewer from 'viewerjs';

export default {
  props: {
    protocolOrderSn: {
      type: String,
      required: true
    }
  },
  mixins: [listMixin],
  data() {
    return {
      tableOptions: {
        protocolOrderSn: ''
      },
      sendOptions: {},
      tableData: {},
      imgList: [],
      imgViewer: null
    };
  },
  watch: {
    protocolOrderId: function(newValue, oldValue) {
      this.tableOptions.protocolOrderSn = this.protocolOrderSn;
      this.handleSearch();
    }
  },
  async created() {
    this.tableOptions.protocolOrderSn = this.protocolOrderSn;
    this.handleSearch();
  },
  methods: {
    // 预览图片
    onPreviewImage(row) {
      // this.imgList = row.urlList;
      this.$nextTick(() => {
        const dom = document.getElementById('protocol-log-viewer-panel');
        this.orderViewer = new Viewer(dom);
        this.orderViewer.show();
        dom.addEventListener('hidden', () => {
          this.orderViewer.destroy(); // 关闭时销毁实例
        });
      });
    },
    async fetchData(opts) {
      const options = { page: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let result = await axios.post(api.selectProtocolFinOrdersList, options);
      this.tableData = result.data;
    }
  }
};
</script>
