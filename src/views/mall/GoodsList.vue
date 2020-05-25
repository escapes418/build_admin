<template>
  <layout navActive="mall">
    <div class="layout-content-list">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <el-button @click="onAddGoods" size="small" type="primary">新增</el-button>
        </div>
      </div>
      <el-table border :data="tableData.list">
        <el-table-column label="商品编号" min-width="140" prop="spuSn"></el-table-column>
        <el-table-column label="商品种类" min-width="140" show-overflow-tooltip prop="categoryName"></el-table-column>
        <el-table-column label="规格型号" min-width="140" show-overflow-tooltip prop="name"></el-table-column>
        <el-table-column label="创建时间" min-width="140" prop="gmtCreate"></el-table-column>
        <el-table-column label="更新时间" min-width="140" prop="gmtModified"></el-table-column>
        <el-table-column label="操作" min-width="100">
          <template slot-scope="scope">
            <el-button type="text" @click="onEditGoods(scope.row)">修改</el-button>
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
      <el-dialog
        :title="dialog.type === 'ADD' ? '新增商品' : '修改商品'"
        :visible.sync="dialog.visible"
        :destroy-on-close="true"
        class="goods-form-dialog"
      >
        <el-form
          ref="goodsForm"
          :model="goodsForm"
          :rules="rules"
          :validate-on-rule-change="false"
          label-position="right"
          label-width="80px"
        >
          <el-form-item label="商品种类" prop="categoryId">
            <el-select
              v-model="goodsForm.categoryId"
              clearable
              placeholder="请选择"
              disabled
              style="width:240px"
            >
              <el-option
                v-for="item in categoryArr"
                :label="item.label"
                :value="item.value"
                :key="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="规格型号" prop="name">
            <el-input
              v-model.trim="goodsForm.name"
              placeholder="请输入"
              maxlength="20"
              clearable
              style="width:240px"
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="dialog.visible = false">取 消</el-button>
          <el-button type="primary" @click="onConfirm">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </layout>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/mall.api';
import utils from '@/utils/utils';
import listMixin from '@/utils/listMixin';

export default {
  name: 'GoodsList',
  mixins: [listMixin],
  data() {
    return {
      tableOptions: {},
      tableData: {}, // 表格数据
      dialog: {
        type: '', //ADD表示新增商品，EDIT表示修改商品
        visible: false
      },
      categoryArr: [{ label: '普通商品混疑土', value: 2 }],
      goodsForm: {
        id: '',
        categoryId: '',
        name: ''
      },
      rules: {
        categoryId: [{ required: true, message: '请选择商品种类', trigger: 'blur' }],
        name: [{ required: true, message: '请输入规格型号', trigger: 'blur' }]
      }
    };
  },
  async created() {
    await this.handleSearch();
  },
  methods: {
    // 新增
    onAddGoods() {
      this.dialog.type = 'ADD';
      this.goodsForm.name = '';
      this.goodsForm.categoryId = this.categoryArr[0]['value'];
      this.dialog.visible = true;
    },
    // 修改
    onEditGoods(row) {
      this.dialog.type = 'EDIT';
      this.goodsForm.id = row.id;
      this.goodsForm.name = row.name;
      this.goodsForm.categoryId = this.categoryArr[0]['value'];
      this.dialog.visible = true;
    },
    //确定
    onConfirm() {
      this.$refs.goodsForm.validate(valid => {
        if (valid) {
          let payload = {
            categoryId: this.goodsForm.categoryId,
            name: this.goodsForm.name
          };
          if (this.dialog.type === 'EDIT') {
            payload.id = this.goodsForm.id;
          }
          // 保存商品
          axios.post(api.saveGoodsSpu, payload).then(res => {
            this.dialog.visible = false;
            this.fetchData();
          });
        }
      });
    },
    async fetchData(opts) {
      const options = { page: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let result = await axios.post(api.queryGoodsList, options);
      this.tableData = result.data;
    }
  }
};
</script>
<style lang="postcss">
.goods-form-dialog {
  .el-dialog {
    width: 400px;
    .el-form {
      width: 90%;
      margin: 0 auto;
    }
  }
}
</style>
