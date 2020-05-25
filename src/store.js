import Vue from 'vue';
import Vuex from 'vuex';

import global from '@/store/global/index';
import goods from '@/store/goods/index';
import mall from '@/store/mall/index';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    ...global.state,
    ...goods.state,
    ...mall.state,
  },
  mutations: {
    ...global.mutations,
    ...goods.mutations,
    ...mall.mutations,
  },
  actions: {
    ...global.actions,
    ...goods.actions,
    ...mall.actions,
  }
});
