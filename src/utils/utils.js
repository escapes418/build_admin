/* 业务公用脚本 */
import api from '@/api/base.api';
import axios from '@/utils/axios';

var utils = {
  /**
   * 获取地址栏参数
   * @param {string} name 参数名
   */
  getQuery(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  },
  /**
   * 设置cookie
   * @param {string} name 参数名
   * @param {string} value 值
   * @param {exdays} name 过期时间
   */
  setCookie(name, value, exdays) {
    var d = new Date();
    exdays = exdays || 365;
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    var expires = 'expires=' + d.toUTCString();
    document.cookie = name + '=' + value + '; ' + expires;
  },
  /**
   * 获取cookie
   * @param {string} name 参数名
   */
  getCookie(name) {
    var name = name + '=';
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1);
      if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
    return '';
  },
  /**
   * 清除cookie
   * @param {string} name 参数名
   */
  clearCookie(name) {
    utils.setCookie(name, '', -1);
  },
  /**
   * 打开新的标签页
   * @param {string} url 地址
   */
  openNewtab(url) {
    var a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('target', '_blank');
    a.setAttribute('id', 'camnpr');
    document.body.appendChild(a);
    a.click();
  },
  /**
   * 设置localStorage数据 item值非json对象 请直接localStorage.getItem
   * @param {string} item 键名
   * @param {object} data 键值
   */
  setStorage(item, data) {
    if (!item || !data) return false;
    localStorage.setItem(item, JSON.stringify(data));
    return true;
  },
  /**
   * 获取localStorage数据 item值非json对象 请直接localStorage.getItem
   * @param {string} item 键名
   */
  getStorage(item) {
    if (!item) return null;
    var localdata = localStorage.getItem(item);
    if (localdata === undefined || localdata === null || localdata == '') {
      return null;
    } else {
      try {
        localdata = JSON.parse(localdata);
        return localdata;
      } catch (e) {
        return null;
      }
    }
  },
  /**
   * 获取字典数据 若不指定key则返回所有字典
   * @param {string} key 键名
   * @param {boolean} reload 是否重新获取
   */
  getSysDict(key, reload = false) {
    return new Promise(async (resolve, reject) => {
      const dict = this.getStorage('sysDict') || {};
      if (!reload && Object.keys(dict).length > 0) {
        if (key) {
          resolve(dict[key]);
        } else {
          resolve(dict);
        }
      } else {
        let options = { url: api.getSysDictByAll, params: {} };
        if (key) {
          options.url = api.getSysDictByType;
          options.params = { key: key };
        }
        const result = await axios.get(options.url, { params: options.params });
        if (!key) this.setStorage('sysDict', result.data);
        resolve(result.data);
      }
    });
  },
  /**
   * 查询企业证件
   * @param {Array} companyIdList 要查询的企业id集合
   */
  async queryCompanyFileList(companyIdList) {
    return new Promise(async (resolve, reject) => {
      const fileType = { LICENSE: '营业执照', IDCARD: '身份证正面', IDCARDB: '身份证反面', OTHER: '其他' };
      let certRes = await axios.post(api.queryCompanyFileList, {
        companyIdList: companyIdList
      });
      certRes = certRes.data || [];

      const fileList = companyIdList.map(companyId => {
        if (certRes.length === 0) return [];
        let certList = certRes.filter(el => el.companyId.toString() === companyId.toString());
        certList = certList[0] || {};
        certList = certList.fileList || [];
        certList = certList.map(el => {
          return { url: el.filePath, title: fileType[el.fileType] || '' };
        });
        return certList;
      });
      resolve(fileList);
    });
  },
  /**
   * 生成随机字符串
   * @param {number} len 长度(不包含时间戳)
   * @param {boolean} time 是否要在前面加时间戳  默认为true
   */
  randomName(len, time = true) {
    len = len || 16;
    time = time === false ? time : true;
    var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var maxPos = chars.length;
    var str = '';
    for (var i = 0; i < len; i++) {
      str += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    if (time) {
      return new Date().getTime() + str;
    } else {
      return str;
    }
  }
};
export default utils;
