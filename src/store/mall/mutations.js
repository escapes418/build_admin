import * as types from './types';

const mutations = {
  [types.CHANGE_PROJECT_STATUS]: function (state, data) {
    state.project_status = data;
  },
};
export default mutations;
