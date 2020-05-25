<template>
  <layout navActive="setting">
    <div class="layout-content-list dictionary-list-page">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>系统设置</el-breadcrumb-item>
        <el-breadcrumb-item>字典管理</el-breadcrumb-item>
      </el-breadcrumb>

      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">类型</span>
          <el-input
            v-model.trim="tableOptions.type"
            :maxlength="20"
            placeholder="类型"
            @keyup.enter.native="handleSearch"
            clearable
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">描述</span>
          <el-input
            v-model.trim="tableOptions.description"
            :maxlength="20"
            placeholder="描述"
            @keyup.enter.native="handleSearch"
            clearable
          ></el-input>
        </div>
        <div class="toolbar-item">
          <el-button type="primary" @click="onSearch">查询</el-button>
        </div>
        <div class="toolbar-item">
          <el-button @click="onReset">重置</el-button>
        </div>
        <div class="toolbar-item">
          <el-button type="primary" @click="onAddDictionary">新增字典</el-button>
        </div>
      </div>

      <el-table :data="tableData.list" border>
        <el-table-column label="类型" prop="type" min-width="200" show-overflow-tooltip
          ><template slot-scope="scope">
            <span :class="['font-default', { pointer: !flag }]" @click="onSelectDictType(scope.row.type)">{{
              scope.row.type
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="键值" prop="value" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column label="标签" prop="label" min-width="150" show-overflow-tooltip></el-table-column>
        <el-table-column label="描述" prop="description" min-width="150" show-overflow-tooltip></el-table-column>
        <el-table-column label="排序" prop="sort" min-width="50" show-overflow-tooltip></el-table-column>

        <el-table-column label="操作" min-width="150">
          <template slot-scope="scope">
            <el-button type="text" @click="handleActiveDict(scope.row, 'view')">查看</el-button>
            <el-button type="text" @click="handleActiveDict(scope.row, 'edit')">编辑</el-button>
            <el-button type="text" @click="handleActiveDict(scope.row, 'delete')">删除</el-button>
            <el-button type="text" @click="handleActiveDict(scope.row, 'add')">新增键值</el-button>
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
    </div>
  </layout>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/setting.api';
import listMixin from '@/utils/listMixin';
import utils from '@/utils/utils';

export default {
  name: 'DictionaryList',
  mixins: [listMixin],
  data() {
    return {
      tableOptions: { description: '', type: '' },
      tableData: {},
      flag: false //点击筛选节流阀开关
    };
  },
  created() {},
  activated() {
    const params = this.$route.params;
    let activeType = params.type || '';
    if (activeType) {
      this.tableOptions.type = activeType;
    }
    this.handleSearch();
  },
  methods: {
    onAddDictionary() {
      this.$router.push({ path: '/dictionary/add' });
    },
    onSelectDictType(type) {
      if (this.flag) return;
      this.flag = true;
      this.tableOptions.type = type;
      this.handleSearch();
    },
    handleActiveDict(row, type) {
      let id = row.id;
      switch (type) {
        case 'view':
          this.$router.push({ path: `/dictionary/detail/view/${id}` });
          break;
        case 'edit':
          this.$router.push({ path: `/dictionary/detail/edit/${id}` });
          break;
        case 'add':
          this.$router.push({ path: `/dictionary/detail/add/value/${id}/${row.type}` });
          break;
        case 'delete':
          this.$confirm('此操作将永久删除该条字典, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.onConfirmDelete(id);
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });
            });
          break;
      }
    },
    onSearch() {
      this.flag = false;
      this.handleSearch();
    },
    onReset() {
      this.tableOptions = { description: '', type: '' };
      this.onSearch();
    },
    async onConfirmDelete(id) {
      await axios.get(api.deleteSysDict, { params: { id: id } });
      this.$message.success('删除成功');
      await utils.getSysDict('', true);
      this.onSearch();
    },
    async fetchData(opts) {
      const options = { page: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let res = await axios.post(api.selectSysDictByLimit, options);
      this.tableData = res.data;
    }
  }
};
</script>
<style lang="postcss">
</style>
