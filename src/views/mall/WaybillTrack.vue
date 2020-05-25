<template>
  <layout navActive="mall">
    <div class="wayvull-detail-track">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>运单列表</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/waybill/detail/' + waybillSn }">运单详情</el-breadcrumb-item>
        <el-breadcrumb-item>运单轨迹</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="detail-hander-panel">
        <div class="detail-hander-content">
          <span class="font-label">运单编号：</span>
          <span class="font-default">{{ waybillSn }}</span>
        </div>
        <div class="detail-hander-toolbtn">
          <router-link :to="'/waybill/detail/' + waybillSn">
            <el-button type="primary">返回运单详情</el-button>
          </router-link>
        </div>
      </div>
      <div class="track-content-panel">
        <div class="track-point-list">
          <div class="item-header">地图点</div>
          <ul>
            <li class="point-item" v-for="(el, index) in amap.pointList" :key="index">
              <span :title="el.dateTime | dateFormat('YYYY-MM-DD HH:mm:ss')" @click="onAddressClick(el)">{{
                el.address
              }}</span>
            </li>
          </ul>
        </div>
        <div class="track-amap-panel">
          <el-amap
            vid="amap-vue-track"
            ref="trackMap"
            :amap-manager="amapManager"
            :center="amap.center"
            :zoom="amap.zoom"
            :events="mapEvents"
            style="height:600px;"
          >
            <el-amap-marker
              v-for="(marker, index) in amap.markers"
              :key="index"
              :position="marker.position"
              :title="marker.title"
              :content="marker.content"
              :events="marker.events"
            ></el-amap-marker>
          </el-amap>
        </div>
      </div>
    </div>
  </layout>
</template>

<script>
import Vue from 'vue';
import VueAMap from 'vue-amap';
import axios from '@/utils/axios';
import api from '@/api/mall.api';
import trackData from './track';

Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  key: 'dc6f7d81b97b1e3f13fe76a55949a503',
  plugin: ['AMap.Driving']
});

export default {
  data() {
    return {
      amapManager: null,
      Driving: null,
      markers: [],
      amap: {
        pshow: false,
        visible: false,
        zoom: 8,
        center: [116.303843, 39.983412],
        markers: [],
        pointList: []
      },
      mapEvents: {
        init: map => {
          this.amapManager = map;
          // 初始化工具条
          map.plugin(['AMap.ToolBar'], () => {
            //在地图中添加ToolBar插件
            const toolBar = new AMap.ToolBar();
            map.addControl(toolBar);
          });
          // 线路规划
          map.plugin(['AMap.Driving'], async () => {
            this.Driving = new AMap.Driving({
              map: map,
              policy: AMap.DrivingPolicy.LEAST_DISTANCE, // 距离最短
              autoFitView: true, // 自动调整地图视野
              hideMarkers: true, // 是否隐藏marker
              showTraffic: false // 是否显示实时路况信息
            });

            let response = await axios.post(api.waybillTrack, {
              waybillSn: this.$route.params.waybillSn
            });
            this.amap.pointList = response.data || [];

            this.amap.markers = [];

            this.amap.visible = true;
            let pathPoints = [],
              pointList = [];

            let loadPoint = [],
              unloadPoint = [],
              trackPoints = [];

            this.amap.pointList.forEach((point, index) => {
              if (index === 0) {
                this.initMarker(point, 1);
                loadPoint = [point.longitude, point.latitude];
              } else if (index === this.amap.pointList.length - 1) {
                this.initMarker(point, 2);
                unloadPoint = [point.longitude, point.latitude];
              } else {
                this.initMarker(point, 3);
                trackPoints.push([point.longitude, point.latitude]);
              }
            });

            // 途经点参数，最多支持传入16个途经点
            this.Driving.search(loadPoint, unloadPoint, { waypoints: trackPoints }, (status, result) => {
              if (status !== 'complete') {
                this.$message.error('轨迹规划失败');
              }
            });
          });
        }
      }
    };
  },
  created() {
    this.waybillSn = this.$route.params.waybillSn;
    // this.clearAMapStorage();
  },
  methods: {
    initMarker(point, type) {
      console.log(type);
      let marker = {};
      marker.position = [point.longitude, point.latitude];
      if (type === 1) {
        marker.content = '<div class = "mk mk-zh"></div>';
        marker.title = '装货时间 ' + new Date(point.dateTime).toLocaleString();
      } else if (type === 2) {
        marker.content = '<div class = "mk mk-xh"></div>';
        marker.title = '装货时间 ' + new Date(point.dateTime).toLocaleString();
      } else {
        marker.content = '<div class = "mk mk-via">经</div>';
        marker.title = '途径时间 ' + new Date(point.dateTime).toLocaleString();
      }
      this.amap.markers.push(marker);
    },
    onAddressClick(point) {
      this.amap.center = [point.longitude, point.latitude];
      this.amap.zoom = 12;
    },
    clearAMapStorage() {
      let i = 0;
      while (i < 100) {
        let key = window.localStorage.key(i);
        if (key === undefined || key === null) {
          break;
        } else if (/^_AMap/.test(key)) {
          window.localStorage.removeItem(key);
        }
        i++;
      }
    }
  }
};
</script>
<style lang="postcss">
@import '../../assets/css/common/theme.css';
.track-content-panel {
  display: flex;
  .track-point-list {
    width: 400px;
    flex: 0 0 auto;
    .point-item {
      padding-right: 5px;
      margin-bottom: 5px;
      span {
        cursor: pointer;
      }
      span:hover {
        color: var(--base-color);
      }
    }
  }
  .track-amap-panel {
    flex: 1 1 auto;
    /* max-width: 920px; */
  }
}
.track-amap-panel {
  width: 600px;
  padding-top: 40px;
  .mk {
    width: 20px;
    height: 28px;
    font-size: 10px;
    line-height: 1.8;
    font-family: 'arial, helvetica, sans-serif';
    text-align: center;
    color: #000;
  }

  .mk.mk-zh {
    background: url('../../assets/img/zh.png') no-repeat;
  }

  .mk.mk-via {
    background: url('../../assets/img/via.png') no-repeat;
  }

  .mk.mk-xh {
    background: url('../../assets/img/xh.png') no-repeat;
  }
}
</style>
