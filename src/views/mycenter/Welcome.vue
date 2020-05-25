<template>
  <layout navActive="mycenter">
    <div class="welcome-page">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>工作台</el-breadcrumb-item>
        <el-breadcrumb-item>欢迎页</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="segment welcome-segment">
        <div class="segment-area flex-area">
          <div class="segment-item row-width">
            <div class="segment-content">
              欢迎您，<span class="font-default">{{ userData.name }}</span>
            </div>
          </div>
          <div class="segment-item row-width h-auto">
            <div class="user-avatar">
              <img :src="userData.photo" alt="" />
            </div>
          </div>
          <div class="segment-item row-width">
            <div class="segment-label">登录帐号</div>
            <div class="segment-content">{{ userData.loginName }}</div>
          </div>
          <div class="segment-item row-width">
            <div class="segment-label">当前时间</div>
            <div class="segment-content">{{ loginTime }}</div>
          </div>
        </div>
      </div>
    </div>
  </layout>
</template>

<script>
import dayjs from 'dayjs';
import axios from '@/utils/axios';
import api from '@/api/notice.api';
import utils from '@/utils/utils';
import defaultAvatar from '@/assets/img/default.png';

export default {
  data() {
    return {
      loginTime: '',
      userData: {}
    };
  },
  created() {
    this.loginTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
    let userData = utils.getStorage('userData') || {};
    userData.photo = userData.photo || defaultAvatar;
    this.userData = userData;
  },
  methods: {}
};
</script>
<style lang="postcss">
.welcome-page {
  .segment.welcome-segment {
    border: none;
    .segment-label {
      width: 80px;
    }
  }
  .user-avatar {
    width: 100px;
    height: 100px;
    img {
      width: 100%;
    }
  }
}
</style>
