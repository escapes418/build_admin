import Vue from 'vue';
import VueRouter from 'vue-router';

import store from './store';
import * as routerHook from '@/router/routerHook';

import routerPublic from '@/router/routerPublic';
import index from '@/router/index';
import mycenter from '@/router/mycenter';
import mall from '@/router/mall';
import finance from '@/router/finance';
import notice from '@/router/notice';
import setting from '@/router/setting';

Vue.use(VueRouter);

const routes = [...index, ...mycenter, ...mall, ...finance, ...notice, ...setting, ...routerPublic];

// 初始化一个空路由对象 当权限获取完成后 动态添加路由地址
const router = new VueRouter({ routes: [] });

// 路由钩子 判断登录状态
routerHook.loginStateHook(router, store);
// 路由钩子 判断页面访问权限
routerHook.permissionHook(router, store);
// 路由钩子 设置页面title
routerHook.setTitleHook(router);
// 路由钩子 设置侧栏选中
routerHook.sideActionHook(router, store);
// 路由钩子 查询消息
routerHook.queryNoticeHook(router, store);

export { router, routes };
