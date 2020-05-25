<template>
  <layout navActive="mall">
    <div class="trade-certform-page">
      <el-breadcrumb separator=">">
        <template v-if="routerName === 'TradeCertFormOrderDetail'">
          <el-breadcrumb-item>订单列表</el-breadcrumb-item>
          <el-breadcrumb-item :to="'/order/detail/' + protocolOrderId">订单详情</el-breadcrumb-item>
          <el-breadcrumb-item>运单贸易凭证</el-breadcrumb-item>
        </template>
        <template v-else-if="routerName === 'TradeCertFormWaybillList'">
          <el-breadcrumb-item>运单列表</el-breadcrumb-item>
          <el-breadcrumb-item>贸易凭证</el-breadcrumb-item>
        </template>
        <template v-else>
          <el-breadcrumb-item>运单列表</el-breadcrumb-item>
          <el-breadcrumb-item :to="'/waybill/detail/' + sjbId">运单详情</el-breadcrumb-item>
          <el-breadcrumb-item>贸易凭证</el-breadcrumb-item>
        </template>
      </el-breadcrumb>
      <div class="detail-hander-panel">
        <div class="detail-hander-content">
          <span class="font-label">运单编号：</span>
          <span class="font-default">{{ sjbId }}</span>
        </div>
        <div class="detail-hander-toolbtn">
          <router-link v-if="routerName === 'TradeCertFormOrderDetail'" :to="'/order/detail/' + protocolOrderId">
            <el-button type="primary">返回订单详情</el-button>
          </router-link>
          <router-link v-else-if="routerName === 'TradeCertFormWaybillList'" to="/waybill/list">
            <el-button type="primary">返回运单列表</el-button>
          </router-link>
          <router-link v-else :to="'/waybill/detail/' + sjbId">
            <el-button type="primary">返回运单详情</el-button>
          </router-link>
        </div>
      </div>
      <div class="item-header">运单相关凭证</div>
      <el-table :data="tableDataList" border>
        <el-table-column label="单据类型" prop="voucherType" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.voucherType === '1'">磅单</span>
            <span v-else-if="scope.row.voucherType === '4'">装货视频</span>
            <span v-else-if="scope.row.voucherType === '5'">卸货视频</span>
            <span v-else>图片</span>
          </template>
        </el-table-column>
        <el-table-column label="单据" prop="voucherUrl" min-width="420">
          <template slot-scope="scope">
            <div class="">
              <template v-if="scope.row.voucherType === '1'">
                <img
                  class="table-col-img"
                  v-for="(src, index) in scope.row.voucherUrlList"
                  :key="index"
                  :src="src ? src : noCert"
                  alt="凭证"
                  @click="onPreviewImage(src)"
                />
              </template>
              <template v-else>
                <!-- <avatar-upload
                :ref="'tradeCert' + scope.row.voucherType"
                :default-files="scope.row.voucherUrl"
                :hidetip="true"
                @change="img => onTradeCertChange(scope.row, img)"
              ></avatar-upload> -->
                <div style="width:100px" class="text-c">
                  <el-button v-if="scope.row.voucherUrl" type="text" @click="onPreviewVideo(scope.row.voucherUrl)"
                    >查看视频</el-button
                  >
                </div>
              </template>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column label="创建日期" prop="createTime" min-width="140" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.voucherType !== '1'">{{ scope.row.createTime }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column> -->
        <el-table-column label="更新日期" prop="updateTime" min-width="140" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.voucherType !== '1'">{{ scope.row.updateTime }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="操作人" prop="updateUserName" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.updateUserName }}</span>
          </template>
        </el-table-column>
      </el-table>

      <!-- 查看图片dialog -->
      <el-dialog :visible.sync="previewData.visible" class="preview-img">
        <img width="100%" :src="previewData.url" />
      </el-dialog>

      <!-- 查看视频dialog -->
      <el-dialog :visible.sync="previewVideoData.visible" class="preview-img">
        <!-- @play="onPlayerPlay($event)" @pause="onPlayerPause($event)" @ended="onPlayerEnded($event)"
      @loadeddata="onPlayerLoadeddata($event)" @waiting="onPlayerWaiting($event)"
      @playing="onPlayerPlaying($event)" @timeupdate="onPlayerTimeupdate($event)"
      @canplay="onPlayerCanplay($event)" @canplaythrough="onPlayerCanplaythrough($event)"
      @statechanged="playerStateChanged($event)" -->
        <video-player
          class="vjs-custom-skin"
          ref="videoPlayer"
          :options="playerOptions"
          :playsinline="true"
          @ready="playerReadied"
        >
        </video-player>
      </el-dialog>
    </div>
  </layout>
</template>
<script>
import axios from '@/utils/axios';
import api from '@/api/mall.api';
import utils from '@/utils/utils';

import noCert from '@/assets/img/noimg.png';

import AvatarUpload from '@/components/AvatarUpload';
import 'video.js/dist/video-js.css';
import { videoPlayer } from 'vue-video-player';

export default {
  components: {
    AvatarUpload,
    videoPlayer
  },
  data() {
    return {
      noCert,
      routerName: '',
      sjbId: '',
      protocolOrderId: '',
      avatarImg: '',
      orderDetail: {},
      tableDataList: [],
      previewData: {
        visible: false,
        url: ''
      },
      previewVideoData: {
        visible: false,
        url: ''
      },
      playerOptions: {
        height: '360',
        autoplay: false,
        muted: true,
        language: 'en',
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        sources: [
          {
            type: 'video/mp4',
            // mp4
            src: ''
            // webm
            // src: "https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm"
          }
        ],
        poster: ''
      },
      player: {}
    };
  },
  async created() {
    this.routerName = this.$route.name;
    this.sjbId = this.$route.params.sjbId;
    if (this.routerName === 'TradeCertFormOrderDetail') {
      this.protocolOrderId = this.$route.params.protocolOrderId;
    }
    this.onGetList();
  },
  methods: {
    async onGetList() {
      let result = await axios.post(api.selectVoucherList, { sjbId: this.sjbId });
      result.data.forEach(element => {
        if (element.voucherType === '1' || element.voucherType === '2' || element.voucherType === '3') {
          element.voucherUrlList = element.voucherUrl.split(',');
        } else {
          element.voucherUrlList = [];
        }
      });
      this.tableDataList = result.data;
    },
    //预览图片
    onPreviewImage(url) {
      if (!url) return;
      this.previewData.visible = true;
      this.previewData.url = url;
    },
    async onTradeCertChange(row, img) {
      row.voucherUrl = img.imageUrl;

      const type = row.id !== '' && row.id !== 0 ? 'edit' : 'add';
      let options = {
        sjbId: this.sjbId,
        voucherType: row.voucherType,
        voucherUrl: img.responseUrl
      };
      if (type === 'edit') options.id = row.id; // 更新时传入id
      let result = await axios.post(api.saveVoucher, options);

      this.onGetList();
    },
    onPreviewVideo(url) {
      // console.log(url);
      this.previewVideoData = {
        visible: true,
        url: url
      };

      this.$nextTick(function() {
        this.player = this.$refs.videoPlayer.player;
        this.player.muted(false);
        this.playerOptions.sources = [
          {
            type: 'video/mp4',
            src: this.previewVideoData.url
            // webm
            // src: "https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm"
          }
        ];
      });
    },
    playerReadied(player) {
      player.currentTime(10);
    }
  }
};
</script>
<style></style>
