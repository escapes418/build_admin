<template>
  <layout navActive="finance">
    <div class="layout-content-list">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>预付款管理</el-breadcrumb-item>
        <el-breadcrumb-item>电子承兑列表</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">申请时间</span>
          <el-date-picker
            v-model="createTimeRange"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="onDateChange"
            :picker-options="pickerOptions"
            type="datetimerange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          ></el-date-picker>
        </div>
        <div class="toolbar-item">
          <span class="item-label">电子承兑业务单号</span>
          <el-input
            v-model.trim="tableOptions.advancePaymentDetailSn"
            :maxlength="50"
            clearable
            placeholder="请输入电子承兑业务单号"
            @keyup.enter.native="handleSearch"
          ></el-input>
        </div>

        <div class="toolbar-item">
          <span class="item-label">采购商</span>
          <el-input
            v-model.trim="tableOptions.orderCompanyName"
            :maxlength="50"
            clearable
            placeholder="请输入采购商"
            @keyup.enter.native="handleSearch"
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">供应链公司</span>
          <el-input
            v-model.trim="tableOptions.finCompanyName"
            @keyup.enter.native="handleSearch"
            :maxlength="50"
            clearable
            placeholder="请输入供应链公司"
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">供应商</span>
          <el-input
            v-model.trim="tableOptions.supplierCompanyName"
            :maxlength="50"
            clearable
            placeholder="请输入供应商"
            @keyup.enter.native="handleSearch"
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">收购点</span>
          <el-input
            v-model.trim="tableOptions.coalMineName"
            :maxlength="50"
            clearable
            placeholder="请输入收购点"
            @keyup.enter.native="handleSearch"
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">业务状态</span>
          <el-select v-model="tableOptions.status" clearable placeholder="请选择" style="width:120px;">
            <el-option
              v-for="(item, index) in statusArr"
              :label="item.label"
              :value="item.value"
              :key="index"
            ></el-option>
          </el-select>
        </div>
        <div class="toolbar-item">
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </div>
      </div>

      <el-table :data="tableData.list" border="">
        <el-table-column
          label="电子承兑业务单号"
          prop="advancePaymentDetailSn"
          min-width="160"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="采购商" prop="orderCompanyName" min-width="160" show-overflow-tooltip></el-table-column>
        <el-table-column
          label="供应商"
          prop="supplierCompanyName"
          min-width="160"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="供应链公司"
          prop="finCompanyName"
          min-width="160"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="收购点" prop="coalMineName" min-width="160" show-overflow-tooltip></el-table-column>
        <el-table-column label="申请时间" prop="createTime" min-width="160" show-overflow-tooltip></el-table-column>

        <el-table-column label="业务状态" prop="status" min-width="160" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.status | statusFilter(statusArr) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="票面金额(元)" min-width="130" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.paymentAmount | thousands(2) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" min-width="200" fixed="right">
          <template slot-scope="scope">
            <!-- 10.待上账20.待付款30.已付款40.已取消 -->

            <el-button v-if="scope.row.status === 10" type="text" size="small" @click="onShowOriginalPic(scope.row)"
              >查看</el-button
            >
            <el-button v-if="scope.row.status === 10" type="text" size="small" @click="onShowRechargeDialog(scope.row)"
              >上账</el-button
            >
            <el-button v-if="scope.row.status === 10" type="text" size="small" @click="onCancelRecharge(scope.row)"
              >取消上账</el-button
            >
            <el-button v-if="scope.row.status === 20" type="text" size="small" @click="onShowUploadDialog(scope.row)"
              >上传付款单据</el-button
            >
            <el-button
              v-if="scope.row.status === 30 || scope.row.status === 40"
              type="text"
              size="small"
              @click="onShowReceiverPic(scope.row)"
              >查看收款单据</el-button
            >
            <el-button v-if="scope.row.status === 30" type="text" size="small" @click="onShowPaymentPic(scope.row)"
              >查看付款单据</el-button
            >
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

      <!-- 确认上账 -->
      <el-dialog title="上账信息确认" :visible.sync="reChargeDialog.visible" width="500px" center>
        <section>
          <el-row type="flex" justify="space-between" class="mb-20">
            <el-col :span="4"><span>收款方:</span></el-col>
            <el-col :span="20">
              <span>{{ reChargeDialog.data.finCompanyName }}</span>
            </el-col>
          </el-row>

          <el-row type="flex" justify="space-between">
            <el-col :span="4"><span>上账金额:</span></el-col>
            <el-col :span="20">
              <span>{{ reChargeDialog.data.paymentAmount | thousands(2) }} 元</span>
            </el-col>
          </el-row>
        </section>
        <span slot="footer" class="dialog-footer">
          <el-button @click="reChargeDialog.visible = false">取 消</el-button>
          <el-button type="primary" @click="onConfirm(reChargeDialog.data)">
            确 定
          </el-button>
        </span>
      </el-dialog>
      <!-- 上传付款单据 -->
      <el-dialog title="上传付款单据确认" :visible.sync="uploadDialog.visible" width="500px" center>
        <section>
          <el-row type="flex" justify="space-between" class="mb-20">
            <el-col :span="6"><span>上账公司:</span></el-col>
            <el-col :span="18">
              <span v-if="uploadDialog.data.isSelf === 'SELF_YES'">{{ uploadDialog.data.coalMineName }}</span>
              <span v-else-if="uploadDialog.data.isSelf === 'SELF_NOT'">{{
                uploadDialog.data.supplierCompanyName
              }}</span>
              <span v-else>-</span>
            </el-col>
          </el-row>

          <el-row type="flex" justify="space-between" class="mb-20">
            <el-col :span="6"><span>申请上账金额:</span></el-col>
            <el-col :span="18">
              <span>{{ uploadDialog.data.paymentAmount }} 元</span>
            </el-col>
          </el-row>

          <el-row>
            <el-form :model="paymentForm" ref="paymentForm" label-width="110px" label-position="left">
              <el-form-item label="上传单据:" required>
                <avatar-upload ref="paymentImg"></avatar-upload>
              </el-form-item>
            </el-form>
          </el-row>
        </section>
        <span slot="footer" class="dialog-footer">
          <el-button @click="uploadDialog.visible = false">取 消</el-button>
          <el-button type="primary" @click="onSubmitRechargeFrom">
            确 定
          </el-button>
        </span>
      </el-dialog>
      <!-- 查看 原始 -->
      <ul id="original-pic-viewer">
        <li>
          <img :src="originalPicUrl || ''" alt="原始单据" style="display:none" />
        </li>
      </ul>
      <!-- 查看收款单据 -->
      <ul id="receiver-pic-viewer">
        <li>
          <img :src="receiverPicUrl || ''" alt="收款单据" style="display:none" />
        </li>
      </ul>
      <!-- 查看付款单据 -->
      <ul id="payment-pic-viewer">
        <li>
          <img :src="paymentPicUrl || ''" alt="付款单据" style="display:none" />
        </li>
      </ul>
    </div>
  </layout>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/finance.api';
import listMixin from '@/utils/listMixin';
import utils from '@/utils/utils';

import 'viewerjs/dist/viewer.css';
import Viewer from 'viewerjs';
import AvatarUpload from '@/components/AvatarUpload';

export default {
  mixins: [listMixin],
  components: {
    AvatarUpload
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      createTimeRange: [],
      tableOptions: {
        advancePaymentDetailSn: '', //业务单号
        coalMineName: '', //收购点名称
        orderCompanyName: '', //采购商名称 ,
        finCompanyName: '', //供应链公司 ,
        supplierCompanyName: '', //供应商 ,
        status: '', //10.待上账20.待付款30.已付款40.已取消
        startDate: '', //
        endDate: '' //申请结束时间
      },
      sendOptions: {},
      tableData: {},
      reChargeDialog: {
        visible: false,
        data: {}
      }, // 上账dialog
      uploadDialog: {
        visible: false,
        data: {}
      }, // 上传单据dialog
      originalPicUrl: '', // 原始单据
      receiverPicUrl: '', // 收款单据
      paymentPicUrl: '', // 付款单据

      originalPicViewer: {}, // 原始单据
      receiverPicViewer: {}, // 收款单据
      paymentPicViewer: {}, // 付款单据

      // paymentImgList: [],
      paymentForm: {
        advancePaymentDetailId: '',
        voucherSendUrl: ''
      },
      statusArr: [
        {
          value: 10,
          label: '待上账'
        },
        {
          value: 20,
          label: '待付款'
        },
        {
          value: 30,
          label: '已付款'
        },
        {
          value: 40,
          label: '已取消'
        }
      ]
    };
  },
  created() {
    this.handleSearch();
  },
  methods: {
    // 选择时间范围回调
    onDateChange(val, type) {
      if (val && val.length > 0) {
        this.tableOptions.startDate = val[0];
        this.tableOptions.endDate = val[1];
      } else {
        this.tableOptions.startDate = '';
        this.tableOptions.endDate = '';
      }
    },
    handleReset() {
      this.tableOptions = {
        advancePaymentDetailSn: '', //业务单号
        coalMineName: '', //收购点名称
        orderCompanyName: '', //采购商名称 ,
        finCompanyName: '', //供应链公司 ,
        supplierCompanyName: '', //供应商 ,
        status: '', //10.待上账20.待付款30.已付款40.已取消
        startDate: '', //
        endDate: '' //申请结束时间
      };
      this.createTimeRange = '';
      this.handleSearch();
    },
    async fetchData(opts) {
      const options = { page: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let result = await axios.post(api.queryVoucherList, options);
      this.tableData = result.data;
    },
    // 上账
    onShowRechargeDialog(row) {
      this.reChargeDialog = {
        visible: true,
        data: row
      };
    },
    // 确认上账
    async onConfirm(row) {
      await axios.post(api.booking, { advancePaymentDetailId: row.advancePaymentDetailId });
      this.$message.success('操作成功');
      this.reChargeDialog = {
        visible: false,
        data: {}
      };
      this.handleSearch();
    },
    // 取消上账
    onCancelRecharge(row) {
      this.$confirm('确定取消上账, 是否继续?', '取消上账', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await axios.post(api.cancelBooking, {
            advancePaymentDetailId: row.advancePaymentDetailId
          });
          this.$message({
            type: 'success',
            message: '取消成功!'
          });
          this.handleSearch();
        })
        .catch(error => {
          this.$message({
            type: 'warning',
            message: error === 'cancel' ? '操作已撤回' : error
          });
        });
    },
    // 上传付款单据
    onShowUploadDialog(row) {
      this.uploadDialog = {
        visible: true,
        data: row
      };
      this.paymentForm.advancePaymentDetailId = row.advancePaymentDetailId;
    },
    onSubmitRechargeFrom() {
      this.$refs.paymentForm.validate(async valid => {
        if (valid) {
          const uploadUrl = this.$refs.paymentImg.getUploadFiles();
          if (!uploadUrl) {
            this.$message.error('请上传单据');
            return;
          }
          this.paymentForm.voucherSendUrl = uploadUrl;
          await axios.post(api.updateVoucherSendUrl, this.paymentForm);
          // 清空上传dialog
          this.uploadDialog = {
            visible: false,
            data: {}
          };
          this.$message.success('上传成功');
          this.handleSearch();
        }
      });
    },
    // 查看原始单据
    onShowOriginalPic(row) {
      this.originalPicUrl = row.voucherReceiveUrl;
      this.onShowViewer('original-pic-viewer', this.originalPicViewer);
    },
    // 查看收款单据
    onShowReceiverPic(row) {
      this.receiverPicUrl = row.voucherReceiveUrl;
      this.onShowViewer('receiver-pic-viewer', this.receiverPicViewer);
    },
    // 查看付款单据
    onShowPaymentPic(row) {
      this.paymentPicUrl = row.voucherSendUrl;
      this.onShowViewer('payment-pic-viewer', this.paymentPicViewer);
    },
    onShowViewer(id, viewer) {
      this.$nextTick(() => {
        const dom = document.getElementById(id);
        viewer = new Viewer(dom);
        viewer.show();
        dom.addEventListener('hidden', () => {
          viewer.destroy(); // 关闭时销毁实例
        });
      });
    }
  },
  filters: {
    statusFilter: (value, arr) => {
      let item = arr.filter(el => el.value.toString() === value.toString());
      item = item[0] || {};
      return item.label || '';
    }
  }
};
</script>
