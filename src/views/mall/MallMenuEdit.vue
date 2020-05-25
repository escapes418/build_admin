<template>
  <div class="menu-edit-page">
    <el-breadcrumb separator=">">
      <el-breadcrumb-item>系统设置</el-breadcrumb-item>
      <el-breadcrumb-item to="/menu/mng">菜单管理</el-breadcrumb-item>
      <el-breadcrumb-item>
        <span v-if="type === 'edit'">修改菜单</span>
        <span v-else>添加菜单</span>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <el-form ref="menuForm" :model="menuForm" label-width="120px" :rules="rules" class="menu-form-panel">
      <el-form-item label="上级菜单" prop="parentName">
        <el-input
          v-model.trim="menuForm.parentName"
          readonly
          placeholder="请选择"
          class="pointer-input"
          @focus="onShowMenuDialog"
        ></el-input>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model.trim="menuForm.name" maxlength="20" placeholder="请输入菜单名称"></el-input>
      </el-form-item>
      <el-form-item label="归属方" prop="attach">
        <el-checkbox-group v-model="menuForm.attach">
          <section style="width:300px">
            <el-checkbox v-for="(item, index) in attachNameList" :key="index" :label="item.value">
              {{ item.label }}
            </el-checkbox>
          </section>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="链接" prop="href">
        <el-input v-model.trim="menuForm.href" maxlength="50" placeholder="请输入菜单链接"></el-input>
      </el-form-item>
      <el-form-item label="图标" prop="icon">
        <el-input v-model.trim="menuForm.icon" maxlength="20" placeholder="请输入菜单图标"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input v-model.trim="menuForm.sort" maxlength="20" placeholder="请输入排序数字"></el-input>
      </el-form-item>
      <!-- <el-form-item label="可见" prop="isDisable">
        <el-radio-group v-model="menuForm.isDisable">
          <el-radio label="0">显示</el-radio>
          <el-radio label="1">隐藏</el-radio>
        </el-radio-group>
      </el-form-item> -->
      <el-form-item label="默认选中" prop="isDefault">
        <el-radio-group v-model="menuForm.isDefault">
          <el-radio label="1">是</el-radio>
          <el-radio label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="禁止点击" prop="isForbidden">
        <el-radio-group v-model="menuForm.isForbidden">
          <el-radio label="1">是</el-radio>
          <el-radio label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="权限标识" prop="permission">
        <el-input v-model.trim="menuForm.permission" maxlength="50" placeholder="请输入权限标识"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSaveMenu">保存</el-button>
        <router-link to="/menu/mng" class="ml-10">
          <el-button>取消</el-button>
        </router-link>
      </el-form-item>
    </el-form>
    <el-dialog title="选择菜单" :visible.sync="menuDialog.visible" width="600px">
      <el-input clearable placeholder="输入关键字进行筛选" v-model="menuDialog.filterText"></el-input>
      <el-tree
        class="menu-dialog-tree"
        :data="menuDialog.treeData"
        :props="menuDialog.defaultProps"
        :expand-on-click-node="false"
        :filter-node-method="handleFilterNode"
        highlight-current
        ref="menuTree"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSelectedMenu">确定</el-button>
        <el-button @click="menuDialog.visible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import axios from '@/utils/axios';
import api from '@/api/mall.api';
import utils from '@/utils/utils';

export default {
  data() {
    return {
      type: 'add',
      menuForm: {
        id: '',
        parentId: '1',
        parentName: '功能菜单',
        name: '',
        href: '',
        icon: '',
        sort: 0,
        isDefault: '1',
        // isDisable: '0',
        isForbidden: '0',
        permission: '',
        attach: []
      },
      rules: {
        name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
        attach: [{ required: true, message: '请选择至少一个归属方', trigger: 'change' }]
      },
      menuDialog: {
        visible: false,
        filterText: '',
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        }
      },
      attachNameList: []
    };
  },
  watch: {
    'menuDialog.filterText': function(newValue, oldValue) {
      this.$refs.menuTree.filter(newValue);
    }
  },
  async created() {
    const dict = await utils.getSysDict();
    this.attachNameList = dict.companyType; // 读取归属方

    const routeName = this.$route.name;
    // 获取菜单树
    let tree = await axios.get(api.queryAllMenuListTree, {});
    this.menuDialog.treeData = tree.data[0].children || [];

    if (routeName === 'MenuEdit') {
      this.type = 'edit';
      // 获取菜单详情
      let result = await axios.post(api.queryMenuDetailForId, { id: this.$route.params.menuid });
      this.menuForm = {
        ...result.data,
        attach: result.data.attach ? result.data.attach.split(',') : []
      };
      this.menuForm.id = this.$route.params.menuid;
    }

    if (routeName === 'MenuSubAdd' || routeName === 'MenuEdit') {
      if (routeName === 'MenuSubAdd') this.menuForm.parentId = this.$route.params.parentId;

      // 获取parentId对应的parentName
      const parentName = this.getNodeName(tree.data, this.menuForm.parentId);
      if (parentName === '') {
        this.menuForm.parentId = '';
        this.menuForm.parentName = '功能菜单';
      } else {
        this.menuForm.parentName = parentName;
      }
    }
  },
  methods: {
    handleFilterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    onShowMenuDialog() {
      this.menuDialog.visible = true;
      // if (this.menuForm.parentId) this.$refs.menuTree.setCurrentKey(this.menuForm.parentId);
    },
    onSelectedMenu() {
      const node = this.$refs.menuTree.getCurrentNode();
      this.menuDialog.visible = false;
      this.menuDialog.filterText = '';
      this.menuForm.parentId = node.id;
      this.menuForm.parentName = node.name;
    },
    onSaveMenu() {
      this.$refs.menuForm.validate(async valid => {
        if (valid) {
          let options = { ...this.menuForm };
          options.attach = options.attach.join();

          await axios.post(api.saveMenuInfo, options);
          this.$message.success('保存成功');
          this.$router.push({ path: '/menu/mng' });
        }
      });
    },
    getNodeName(nodeArr, nodeId) {
      let parentName = '';
      function loopTree(arr) {
        if (parentName) return;
        arr.some(item => {
          if (item.id === nodeId) {
            parentName = item.name;
            return true;
          } else {
            item.children = item.children || [];
            if (item.children.length > 0) {
              loopTree(item.children);
            }
          }
        });
      }
      loopTree(nodeArr);
      return parentName;
    }
  }
};
</script>
