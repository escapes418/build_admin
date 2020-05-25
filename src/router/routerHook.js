// import axios from '@/utils/axios';
// import api from '@/api/base.api';

// 路由钩子 判断登录状态
export const loginStateHook = (router, store) => {
  // 不需要登录的页面
  const excludeRoutes = ['/', '/login', '/error/:code'];

  router.beforeEach((to, from, next) => {
    if (!excludeRoutes.includes(to.path)) {
      const Authorization = localStorage.getItem('Authorization');
      const userData = localStorage.getItem('userData') || {};

      if (!Authorization || Object.keys(userData).length === 0) {
        next({ path: '/login' });
      }
      next();
    } else {
      next();
    }
  });
};

// 路由钩子 判断页面访问权限
export const permissionHook = (router, store) => {
  router.beforeEach((to, from, next) => {
    // path为/ 或者去error的路由不添加tab 不设置侧栏选中
    if (to.name && to.name !== 'Error' && to.name !== 'Login') {
      store.dispatch('addTabView', to);
      store.dispatch('changeTabActive', to.name);
      store.dispatch('changeSideAction', to.meta.active);
    }

    const perList = store.state.permission || [];
    if (to.meta.permission && !perList.includes(to.meta.permission)) {
      // next({ path: '/error/403' });
      next();
    } else {
      next();
    }
  });
};

// 路由钩子 设置页面title
export const setTitleHook = router => {
  router.beforeEach((to, from, next) => {
    let title = to.meta && to.meta.title;
    title = title || '筑链社运营后台';
    document.title = title;
    next();
  });
};

// 路由钩子 设置侧栏选中菜单
export const sideActionHook = (router, store) => {
  router.beforeEach((to, from, next) => {
    if (to.meta.active) {
      store.dispatch('changeSideAction', to.meta.active);
    }
    next();
  });
};

// 路由钩子 查询消息
export const queryNoticeHook = (router, store) => {
  router.beforeEach((to, from, next) => {
    // if (store.state.permission.indexOf('notice:system:view') > -1) {
    //   axios({
    //     method: 'POST',
    //     url: api.sysMsgList,
    //     data: { page: 1, limit: 5, all: 1 },
    //     silence: true
    //   }).then(response => {
    //     if (response.data && response.data.list) {
    //       store.dispatch('setNoticeData', response.data.list);
    //     }
    //   });
    // }
    next();
  });
};
