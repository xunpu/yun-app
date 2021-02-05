import {
  http
} from "@/api/http";
import {
  getCurrentPage
} from '@/utils/router';

var Cache = (function () {

  function Cache() {
    this._data = {};
  }

  async function fetch(api, obj, count = 1, params = {}) {
    if (obj.pedding == obj.next) {
      return
    }
    if ((obj.next !== null || obj.next !== '')) {
      let url = '';
      if (obj.next === undefined) {
        url = api;
      } else if (typeof obj.next == 'string' && obj.next.length > 0) {
        url = obj.next;
      } else {
        return
      }
      for (let i = 0; i < count; i++) {
        obj.pedding = url;
        try {
          let res = await http.post(url, params);
          params = {};
          if (res.data.length === 0) {
            break
          }
          let data = res.data;
          obj.data.push(data);
          obj.next = data.next;
          if (obj.next == null) {
            obj.pedding = '';
          }
          url = obj.next;
        } catch (err) {
          obj.pedding = '';
        }
      }
    }
  }

  Cache.prototype.on = function (api, params = {}, preload = 2) {
    var path = getCurrentPage();
    if (this._data[path] === undefined) {
      this._data[path] = {};
    }
    if (this._data[path][api] !== undefined) {
      return Promise.resolve();
    }
    var obj = this._data[path][api] = {
      data: [],
      index: -1,
      pedding: '',
    };
    if (preload !== 0 || preload !== false) {
      return fetch(api, obj, preload, params);
    } else {
      return Promise.resolve();
    }
  }

  Cache.prototype.next = function (api, params = {}, fetch_only = false) {
    var path = getCurrentPage();
    var obj = this._data[path][api];
    if (obj.data.length >= 2) {
      fetch(api, obj, 1, params);
    } else {
      fetch(api, obj, 2, params);
    }
    if (obj.data.length == 0 && obj.next == null) {
      return Promise.resolve(false);
    } else if (fetch_only === true) {
      return Promise.resolve(true);
    } else {
      obj.index += 1;
      return Promise.resolve({
        'index': obj.index,
        'data': obj.data.shift()
      });
    }
  }

  Cache.prototype.clean = function () {
    var path = getCurrentPage();
    this._data[path] = {}
  }

  Cache.prototype.delete = function (api) {
    var path = getCurrentPage();
    if (this._data[path] === undefined) {
      return Promise.resolve(false);
    } else if (path in this._data) {
      this._data[path][api] = undefined;
    } else {
      return Promise.resolve(false);
    }
    return Promise.resolve(true);
  }

  return Cache;
}());

function createInstance() {
  var ins = new Cache();
  return ins;
}

var cache = createInstance();
cache.create = function create() {
  return createInstance();
};

export default cache;