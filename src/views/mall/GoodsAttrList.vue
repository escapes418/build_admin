<template>
  <layout navActive="mall">
    <div class="layout-content-list">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="toolbar-panel">
        .
        <div class="toolbar-item">
          <el-button @click="onAddGoods" size="small" type="primary">新增</el-button>
        </div>
      </div>
      <el-table border :data="tableData.list">
        <el-table-column label="ID" min-width="80" prop="valueId"></el-table-column>
        <el-table-column label="类型" min-width="140" show-overflow-tooltip prop="attrName"></el-table-column>
        <el-table-column label="名称" min-width="140" show-overflow-tooltip prop="valueName"></el-table-column>
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
        :title="dialog.type === 'ADD' ? '新增属性' : '修改属性'"
        :visible.sync="dialog.visible"
        :destroy-on-close="true"
        class="goods-attr-dialog"
      >
        <el-form
          ref="attrForm"
          :model="attrForm"
          :rules="rules"
          :validate-on-rule-change="false"
          label-position="right"
          label-width="60px"
        >
          <el-form-item label="类型" prop="attrId">
            <el-select
              v-model="attrForm.attrId"
              placeholder="请选择"
              clearable
              style="width:240px"
              :disabled="dialog.type === 'EDIT'"
            >
              <el-option
                v-for="type in attrTypeArr"
                :key="type.attrId"
                :label="type.attrName"
                :value="type.attrId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="名称" prop="valueName">
            <el-input
              v-model.trim="attrForm.valueName"
              placeholder="请输入"
              maxlength="20"
              clearable
              style="width:240px"
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
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
      attrTypeArr: [],
      attrForm: {
        valueId: '',
        attrId: '',
        valueName: ''
      },
      rules: {
        attrId: [{ required: true, message: '请选择类型', trigger: 'blur' }],
        valueName: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      }
    };
  },
  async created() {
    let result = await axios.get(api.getTypeList);
    this.attrTypeArr = result.data || [];
    this.handleSearch();
  },
  methods: {
    // 新增
    onAddGoods() {
      this.dialog.type = 'ADD';
      this.attrForm.valueId = '';
      this.attrForm.attrId = '';
      this.attrForm.valueName = '';
      this.dialog.visible = true;
    },
    // 修改
    onEditGoods(row) {
      this.dialog.type = 'EDIT';
      this.attrForm.valueId = row.valueId;
      this.attrForm.attrId = row.attrId;
      this.attrForm.valueName = row.valueName;
      this.dialog.visible = true;
    },
    //确定
    onConfirm() {
      this.$refs.attrForm.validate(valid => {
        if (valid) {
          let payload = {
            attrId: this.attrForm.attrId, // 类型id
            valueName: this.attrForm.valueName
          };

          if (this.dialog.type === 'EDIT') {
            payload.valueId = this.attrForm.valueId;
          }
          // 保存商品
          axios.post(api.saveAttrValue, payload).then(res => {
            this.dialog.visible = false;
            this.fetchData();
          });
        }
      });
    },
    async fetchData(opts) {
      const options = { page: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let result = await axios.post(api.queryAttrList, options);
      this.tableData = result.data;
    }
  }
};
</script>
<style lang="postcss">
.goods-attr-dialog {
  .el-dialog {
    width: 400px;
    .el-form {
      width: 90%;
      margin: 0 auto;
    }
  }
}
</style>
