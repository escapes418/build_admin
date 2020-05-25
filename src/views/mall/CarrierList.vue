<template>
  <layout navActive="mall">
    <div class="layout-content-list">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>供应链管理</el-breadcrumb-item>
        <el-breadcrumb-item>承运商管理</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">承运商名称</span>
          <el-input
            v-model.trim="tableOptions.fullName"
            :maxlength="20"
            clearable
            placeholder="请输入承运商名称"
            @keyup.enter.native="handleSearch"
          ></el-input>
        </div>

        <div class="toolbar-item">
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="primary" v-has="'mall:carrier:trade:add'" @click="onShowAddDialog">新增</el-button>
        </div>
      </div>
      <el-table :data="tableData.list" border>
        <el-table-column label="承运商名称" prop="sjbCarrierName" min-width="200" show-overflow-tooltip></el-table-column>
        <el-table-column label="联系人" prop="sjbCarrierContact" min-width="110" show-overflow-tooltip></el-table-column>
        <el-table-column label="注册账号" prop="sjbCarrierPhone" min-width="110" show-overflow-tooltip></el-table-column>
        <el-table-column
          label="联系地址"
          prop="sjbCarrierAddress"
          min-width="150"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="创建时间" prop="createTime" min-width="110" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" min-width="150">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              v-has="'mall:carrier:trade:del'"
              @click="handleDeleteCarrier(scope.row)"
            >删除</el-button>
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

      <el-dialog title="新增承运商" width="600px" :visible.sync="dialogVisible">
        <section>
          <div class="toolbar-panel">
            <div class="toolbar-item">
              <span class="item-label">承运商名称</span>
              <el-input
                v-model.trim="addTableOptions.fullName"
                :maxlength="20"
                clearable
                placeholder="请输入承运商名称"
                @keyup.enter.native="handleAddSearch"
              ></el-input>
            </div>

            <div class="toolbar-item">
              <el-button type="primary" @click="handleAddSearch">查询</el-button>
            </div>
          </div>
          <div class="carrier-dialog-content mb-10">
            <el-table :data="addTableData.list" border>
              <el-table-column
                label="承运商名称"
                prop="companyName"
                min-width="200"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column label="操作" min-width="50">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="small"
                    v-has="'mall:carrier:trade:add'"
                    @click="onAddCarrier(scope.row)"
                  >添加</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-pagination
            :page-size="pageSize"
            :current-page.sync="addpage"
            :total="addTableData.count"
            @current-change="handleAddCurrentChange"
            layout="total, prev, pager, next, jumper"
          ></el-pagination>
        </section>
      </el-dialog>
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
      tableOptions: {
        fullName: ''
      },
      addTableOptions: {
        fullName: ''
      },
      sendOptions: {},
      tableData: {},
      dialogVisible: false,
      addpage: 1,
      addTableData: {}
    };
  },
  created() {
    this.handleSearch();
  },
  methods: {
    handleReset() {
      this.tableOptions = {
        fullName: ''
      };
      this.handleSearch();
    },
    async fetchData(opts) {
      const options = { page: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let result = await axios.post(api.querySjbCarrierList, options);
      this.tableData = result.data;
    },
    onShowAddDialog() {
      this.dialogVisible = true;
      // 重置add dialog数据
      this.addTableOptions.fullName = '';
      this.addpage = 1;
      this.addTableData = {};
    },
    handleDeleteCarrier(row) {
      this.$confirm('确定要删除此承运商吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.onDeleteCarrier(row);
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    async onDeleteCarrier(row) {
      await axios.get(api.deleteCompanyCarrier, {
        params: { companyCarrierId: row.companyCarrierId || '' }
      });
      this.$message.success('删除成功');
      this.handleSearch();
    },
    async onAddCarrier(row) {
      await axios.post(api.saveCompanyCarrier, { companyCode: row.companyCode });
      this.dialogVisible = false;
      this.handleSearch();
    },
    handleAddSearch() {
      if (!this.addTableOptions.fullName) {
        this.$message({
          message: '请先输入承运商名称',
          type: 'warning'
        });
        return;
      }
      this.addpage = 1;
      this.onGetLogisticsCarrierData();
    },
    handleAddCurrentChange(page) {
      this.addpage = page;
      this.onGetLogisticsCarrierData();
    },
    async onGetLogisticsCarrierData() {
      const options = { page: this.addpage, pageSize: 10, ...this.addTableOptions };
      let result = await axios.post(api.queryLogisticsCarrier, options);
      this.addTableData = result.data;
    }
  }
};
</script>

<style lang="postcss" scoped>
.carrier-dialog-content {
  max-height: 450px;
  overflow: auto;
}
</style>
