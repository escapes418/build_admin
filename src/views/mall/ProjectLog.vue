<template>
  <div class="layout-content-list">
    <el-table :data="tableData.list" border>
      <el-table-column prop="gmtCreate" label="时间" min-width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.gmtCreate | dateFormat('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="日志信息" prop="logInfo" min-width="600" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.logInfo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="" min-width="250">
        <template slot-scope="scope">
          <span class="font-default pointer" v-if="scope.row.bizType === 3" @click="onJumpProjectPrice(scope.row)">
            查看调价对照表
          </span>
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
    <!-- 查看图片dialog -->
    <!-- <el-dialog :visible.sync="previewData.visible" class="preview-img">
      <img width="100%" :src="previewData.url" />
    </el-dialog> -->

    <ul id="protocol-log-viewer-panel">
      <li v-for="(el, index) in imgList" :key="index">
        <img :src="el.path" :alt="el.title" style="display:none" />
      </li>
    </ul>
  </div>
</template>
<script>
import Vue from 'vue';
import axios from '@/utils/axios';
import api from '@/api/mall.api';
import listMixin from '@/utils/listMixin';

import 'viewerjs/dist/viewer.css';
import Viewer from 'viewerjs';
export default {
  props: {
    projectId: {
      type: String,
      required: true,
      default: ''
    },
    projectSn: {
      type: String,
      required: true,
      default: ''
    }
  },
  mixins: [listMixin],
  data() {
    return {
      tableOptions: {
        projectId: ''
      }, // 工具栏筛选字段
      sendOptions: {}, // 发送请求实际字段
      tableData: {},
      imgList: [],
      imgViewer: null
    };
  },
  watch: {
    projectId: function(newValue, oldValue) {
      this.tableOptions.projectId = this.projectId = newValue;
      this.handleSearch();
    }
  },
  created() {
    // this.tableOptions.projectId = this.projectId;
    // this.handleSearch();
  },
  methods: {
    // 预览图片
    onPreviewImage(row) {
      this.imgList = row.imglist;
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
      let res = await axios.post(api.projectLogList, options);
      this.tableData = res.data;
    },
    onJumpProjectPrice(row) {
      let bizId = row.bizId || '';
      this.$router.push({ path: `/project/modify/price/show/${this.$route.params.id}/${bizId}/${this.projectSn}` });
    }
  }
};
</script>
<style lang="postcss"></style>
