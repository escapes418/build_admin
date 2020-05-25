<template>
  <layout navActive="finance">
    <div class="layout-content-list">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>交易管理</el-breadcrumb-item>
        <el-breadcrumb-item>充值管理</el-breadcrumb-item>
      </el-breadcrumb>

      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">交易时间</span>
          <el-date-picker
            v-model="createTimeRange"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions"
            type="datetimerange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          ></el-date-picker>
        </div>
        <div class="toolbar-item">
          <span class="item-label">充值流水号</span>
          <el-input
            v-model.trim="tableOptions.recordNo"
            :maxlength="50"
            clearable
            placeholder="充值流水号"
            @keyup.enter.native="handleSearch"
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">银行转账流水号</span>
          <el-input
            v-model.trim="tableOptions.thirdOrderNo"
            :maxlength="50"
            placeholder="账户编号"
            @keyup.enter.native="handleSearch"
            clearable
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">交易状态</span>
          <el-select v-model="tableOptions.status" clearable placeholder="请选择" style="width:120px;">
            <div v-for="item in transStateArr" :key="item.value">
              <el-option :label="item.label" :value="item.value"></el-option>
            </div>
          </el-select>
        </div>
        <div class="toolbar-item">
          <span class="item-label">充值状态类型</span>
          <el-select v-model="tableOptions.type" clearable placeholder="请选择" style="width:120px;">
            <div v-for="item in topupTypeArr" :key="item.value">
              <el-option :label="item.label" :value="item.value"></el-option>
            </div>
          </el-select>
        </div>
        <div class="toolbar-item">
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </div>
      </div>
      <el-table :data="tableData.list" border>
        <el-table-column label="充值流水号" prop="recordNo" min-width="200" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="font-default">
              {{
              scope.row.recordNo
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="交易时间" prop="createTime" min-width="140" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="交易金额"
          align="right"
          prop="chargeAmount"
          min-width="120"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="font-orange">{{ scope.row.chargeAmount | thousands(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="交易状态" prop="status" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.status | valueToLabel(transStateArr) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="thirdRemark" min-width="110" show-overflow-tooltip></el-table-column>
        <el-table-column
          label="付款方企业名称"
          prop="payerCompanyName"
          min-width="120"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="收款账号" prop="payeeGroupNo" min-width="160" show-overflow-tooltip></el-table-column>
        <el-table-column label="充值记录类型" prop="type" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.type | valueToLabel(topupTypeArr)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="银行转账流水号" prop="thirdOrderNo" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column label="银行转账凭证" prop="urls" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope" v-if="scope.row.type===1">
            <el-button type="text" @click="onView(scope.row)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope" v-if="scope.row.type===1">
            <el-button type="text" v-if="scope.row.status  === 1" @click="onEdit(scope.row)">修改</el-button>
            <el-button type="text" v-else @click="onAdd(scope.row)">添加</el-button>
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
    <el-dialog
      :title="dialog.type === 'ADD' ? '添加' : '修改'"
      :visible.sync="dialog.visible"
      :destroy-on-close="true"
      @close="resetData"
      class="topup-dialog"
    >
      <el-form
        ref="addForm"
        :model="dialog.addForm"
        :rules="dialog.addRules"
        :validate-on-rule-change="false"
        label-position="right"
        label-width="120px"
        v-if="dialog.type==='ADD'"
      >
        <el-form-item label="付款方企业名称" prop="companyId">
          <el-select
            v-model="dialog.addForm.companyId"
            placeholder="请选择"
            clearable
            style="width:240px"
          >
            <el-option
              v-for="company in companyList"
              :key="company.companyId"
              :value="company.companyId"
              :label="company.fullName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="银行转账流水号" prop="thirdOrderNo">
          <el-input
            v-model.trim="dialog.addForm.thirdOrderNo"
            placeholder="请输入"
            maxlength="20"
            style="width:240px"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="银行打款凭证" prop="urls">
          <img-upload ref="addBankProof" :limit="10" :defaultFiles="dialog.defaultFiles"></img-upload>
        </el-form-item>
      </el-form>
      <el-form
        ref="editForm"
        :model="dialog.editForm"
        :rules="dialog.editRules"
        :validate-on-rule-change="false"
        label-position="right"
        label-width="120px"
        v-else
      >
        <el-form-item label="付款方企业名称" prop="companyId">
          <el-select v-model="dialog.payerCompanyName" style="width:240px" disabled clearable></el-select>
        </el-form-item>
        <el-form-item label="银行转账流水号" prop="thirdOrderNo">
          <el-input
            v-model.trim="dialog.editForm.thirdOrderNo"
            maxlength="20"
            disabled
            style="width:240px"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="银行打款凭证" prop="urls">
          <img-upload ref="editBankProof" :limit="10" :defaultFiles="dialog.defaultFiles"></img-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="onConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <fe-viewer ref="bankProofViewer" title="银行转账凭证" :source="bankProofList"></fe-viewer>
  </layout>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/finance.api';
import utils from '@/utils/utils';
import listMixin from '@/utils/listMixin';
import ImgUpload from '@/components/ImgUpload';

export default {
  name: 'CapitalOrderList',
  mixins: [listMixin],
  components: {
    ImgUpload
  },
  data() {
    return {
      toolexpand: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      companyList: [],
      bankProofList: [],
      dialog: {
        visible: false,
        type: '',
        defaultFiles: [],
        payerCompanyName: '',
        addForm: {
          recordNo: '',
          thirdOrderNo: '',
          companyId: '',
          urls: []
        },
        editForm: {
          recordNo: '',
          thirdOrderNo: '',
          urls: []
        },
        addRules: {},
        editRules: {}
      },
      createTimeRange: [],
      tableOptions: {
        createStart: '',
        createEnd: '',
        recordNo: '',
        thirdOrderNo: '',
        status: '',
        type: '' //充值记录类型
      },
      sendOptions: {},
      tableData: {},
      //充值状态;0:初始化(已经打款到电子帐户) 1:充值成功(上台账) 2:充值失败(上台账) ,
      transStateArr: [], //交易状态,
      topupTypeArr: [] //充值类型
    };
  },
  async created() {
    const dict = await utils.getSysDict();
    this.transStateArr = dict.topup_status; //充值状态
    this.topupTypeArr = dict.topup_type; //充值类型
    await this.initCompanyList();
    this.initDatetime();
    this.handleSearch();
  },
  methods: {
    handleReset() {
      this.createTimeRange = [];
      this.tableOptions = {
        createStart: '',
        createEnd: '',
        recordNo: '',
        thirdOrderNo: '',
        status: '',
        type: ''
      };
      this.initDatetime();
      this.handleSearch();
    },
    onView(row) {
      //查看
      this.bankProofList = row.urls.map((el, index) => {
        return { url: el, title: index };
      });
      this.$nextTick(() => {
        this.$refs.bankProofViewer.show();
      });
    },
    onAdd(row) {
      //添加
      this.dialog.type = 'ADD';
      //初始化数据
      this.dialog.defaultFiles = [];
      this.dialog.addForm.recordNo = row.recordNo;
      this.dialog.addForm.thirdOrderNo = row.thirdOrderNo;
      this.dialog.visible = true;
    },
    onEdit(row) {
      //修改
      this.dialog.type = 'EDIT';
      this.dialog.payerCompanyName = row.payerCompanyName;
      //初始化数据
      this.dialog.defaultFiles = row.urls || [];
      this.dialog.editForm.recordNo = row.recordNo;
      this.dialog.editForm.thirdOrderNo = row.thirdOrderNo;
      this.dialog.visible = true;
    },
    onConfirm() {
      // 提交表单数据
      if (this.dialog.type === 'ADD') {
        this.$refs.addForm.validate(async valid => {
          if (valid) {
            let payload = { ...this.dialog.addForm, urls: this.$refs.addBankProof.getUploadFiles() };
            await axios.post(api.chargeVoucherUpload, payload);
            await this.handleSearch();
            this.dialog.visible = false;
          }
        });
      } else {
        this.$refs.editForm.validate(async valid => {
          if (valid) {
            let payload = { ...this.dialog.editForm, urls: this.$refs.editBankProof.getUploadFiles() };
            await axios.post(api.changeChargeVoucher, payload);
            await this.handleSearch();
            this.dialog.visible = false;
          }
        });
      }
    },
    async fetchData(opts) {
      if (Array.isArray(this.createTimeRange) && this.createTimeRange[0] && this.createTimeRange[1]) {
        //同步时间
        this.tableOptions.createStart = this.createTimeRange[0];
        this.tableOptions.createEnd = this.createTimeRange[1];
        const options = { page: this.page, pageSize: this.pageSize, ...this.tableOptions, ...opts };
        const result = await axios.post(api.queryRechargePage, options);
        this.tableData = result.data;
      } else {
        this.$message.error('请选择交易时间');
      }
    },
    async initCompanyList() {
      let result = await axios.post(api.queryCompanyTypeList, { companyType: 'CONCRETE_PURCHASER' });
      this.companyList = result.data || [];
    },
    initDatetime() {
      let date = new Date();
      this.tableOptions.createStart = `${date.getFullYear()}-${date.getMonth() + 1}-01 00:00:00`;
      this.tableOptions.createEnd = `${date.getFullYear()}-${date.getMonth() +
        1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
      this.createTimeRange = [this.tableOptions.createStart, this.tableOptions.createEnd];
    },
    //避免图片渲染效果
    resetData() {
      this.dialog.defaultFiles = [];
    }
  }
};
</script>

<style lang="postcss">
.topup-dialog {
  .el-dialog {
    width: 600px;
    .el-form {
      width: 90%;
      margin: 0 auto;
    }
  }
}
</style>
