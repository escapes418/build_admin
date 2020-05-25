<template>
  <layout navActive="setting">
    <div class="dictionary-detail-page">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>系统设置</el-breadcrumb-item>
        <el-breadcrumb-item to="/dictionary/list">字典管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{ pageView.desc }}</el-breadcrumb-item>
      </el-breadcrumb>
      <el-form
        ref="dictionaryForm"
        :model="dictionaryForm"
        label-width="60px"
        :rules="rules"
        :disabled="isDisabled"
        class="dictionary-form-panel"
      >
        <el-form-item label="类型" prop="type">
          <el-input
            v-model="dictionaryForm.type"
            :disabled="isDisabledType"
            maxlength="30"
            placeholder="请输入类型"
          ></el-input>
        </el-form-item>
        <el-form-item label="键值" prop="value">
          <el-input
            v-model="dictionaryForm.value"
            type="textarea"
            autosize
            maxlength="80"
            placeholder="请输入键值"
          ></el-input>
        </el-form-item>
        <el-form-item label="标签" prop="label">
          <el-input
            v-model="dictionaryForm.label"
            type="textarea"
            autosize
            maxlength="80"
            placeholder="请输入标签"
          ></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="dictionaryForm.description" maxlength="30" placeholder="请输入描述"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="dictionaryForm.sort" maxlength="10" placeholder="请输入排序"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input
            v-model="dictionaryForm.remarks"
            type="textarea"
            maxlength="100"
            :autosize="{ minRows: 1, maxRows: 3 }"
            placeholder="请输入备注"
          ></el-input>
        </el-form-item>
      </el-form>
      <div style="margin-left:60px;">
        <el-button v-if="pageView.isShowSaveBtn" type="primary" class="mr-10" @click="onSaveMenu">保存</el-button>
        <router-link to="/dictionary/list">
          <el-button>{{ pageView.isShowSaveBtn ? '返回' : '返回列表' }}</el-button>
        </router-link>
      </div>
    </div>
  </layout>
</template>
<script>
import axios from '@/utils/axios';
import api from '@/api/setting.api';
import Validator from '@/utils/Validator';
import utils from '@/utils/utils';

export default {
  data() {
    // 数字验证
    var validateNumber = (rule, value, callback) => {
      if (!Validator.number(value)) {
        callback(new Error('请输入有效的排序数'));
      }
      callback();
    };

    return {
      dictionaryForm: {
        description: '', //描述
        id: '', //用户id
        label: '', // 标签
        parentId: '', //父级编号
        remarks: '', // 备注信息
        sort: 10, //排序
        type: '', //类型
        value: '' //键值
      },
      rules: {
        description: [{ required: true, message: '请输入描述', trigger: 'blur' }],
        label: [{ required: true, message: '请输入标签', trigger: 'blur' }],
        type: [{ required: true, message: '请输入类型', trigger: 'blur' }],
        value: [{ required: true, message: '请输入键值', trigger: 'blur' }],
        sort: [
          { required: true, message: '请输入排序', trigger: 'blur' },
          { validator: validateNumber, trigger: 'blur' }
        ]
      },
      isDisabled: false, //禁用表单
      isDisabledType: false, //禁用类型选项
      pageView: {
        desc: '',
        isShowSaveBtn: true
      }
    };
  },
  async created() {
    const routeName = this.$route.name;
    const params = this.$route.params;
    let activeDetail = {};

    if (routeName !== 'DictionaryAdd') {
      // 获取单个字典详情
      activeDetail = await axios.get(api.getSysDictById, { params: { id: params.id } });
    }
    switch (routeName) {
      case 'DictionaryDetailView':
        this.isDisabled = true;
        this.pageView = { desc: '字典详情', isShowSaveBtn: false };
        this.dictionaryForm = activeDetail.data;
        break;
      case 'DictionaryDetailEdit':
        this.pageView.desc = '编辑字典';
        this.dictionaryForm = activeDetail.data;
        break;
      case 'DictionaryAdd':
        this.pageView.desc = '新增字典';
        break;
      case 'DictionaryDetailAddValue':
        this.isDisabledType = true;
        this.pageView.desc = '新增键值';
        this.dictionaryForm.type = params.type;
        this.dictionaryForm.description = activeDetail.data.description;
        this.dictionaryForm.sort = activeDetail.data.sort ? activeDetail.data.sort + 10 : 10;
        break;
    }
  },
  methods: {
    onSaveMenu() {
      this.$refs.dictionaryForm.validate(async valid => {
        if (valid) {
          await axios.post(api.saveSysDict, { ...this.dictionaryForm });
          this.$message.success('操作成功');
          await utils.getSysDict('', true);

          if (this.$route.name === 'DictionaryAdd') {
            // 新增字典返回带类型自动筛选
            this.$router.push({
              name: 'DictionaryList',
              params: { type: this.dictionaryForm.type }
            });
          } else {
            this.$router.push({ name: 'DictionaryList' });
          }
        }
      });
    }
  }
};
</script>
<style lang="postcss">
.dictionary-detail-page {
  .dictionary-form-panel {
    .el-input__inner {
      width: 300px;
    }
    .el-input__inner.pointer-input {
      cursor: pointer;
    }
    .el-textarea {
      width: 300px;
    }
  }
}
</style>
