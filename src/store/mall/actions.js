import * as types from './types';
export default {
  // 设置项目状态
  changeProjectStatus({ commit }, data) {
    commit(types.CHANGE_PROJECT_STATUS, data);
  }
};
