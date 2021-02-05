import {
    http
} from "@/api/http";
import {
    getCurrentPage
} from '@/utils/router';

const PAGE_DEFAULT = 0;
const NEXT_DEFAULT = 1;
const PEDDING_DEFAULT = 0;

var Cache = (function () {

    function Cache() {
        this._data = {};
    }

    async function fetch(api, obj, count = 1, params = {}) {
        if (obj.pedding == obj.next) {
            return
        }
        for (let i = 0; i < count; i++) {
            obj.pedding = obj.next;
            params.page = obj.next;
            try {
                let res = await http.post(api, params);
                if (res.data.length == 0) {
                    obj.pedding = PEDDING_DEFAULT;
                    break
                }
                obj.data.push(res.data);
                obj.next += 1;
            } catch (err) {
                obj.pedding = PEDDING_DEFAULT;
            }
        }
    }

    /*
     * 局部变量 obj 中的各个 key 说明:
     * data 数据列表
     * page 渲染页面中载入的页码
     * next 数据列表待请求页码
     * pedding 请求中的数据页
     * filter 当前过滤条件，如用户改变需要重新调用 clean 方法后重新调用 on 绑定
     */
    Cache.prototype.on = function (api, filter = {}, params = {}, preload = 2) {
        var path = getCurrentPage();
        if (this._data[path] === undefined) {
            this._data[path] = {};
        }
        if (this._data[path][api] !== undefined) {
            return Promise.resolve();
        }
        var obj = this._data[path][api] = {
            filter: filter,
            data: [],
            page: PAGE_DEFAULT,
            next: NEXT_DEFAULT,
            pedding: PEDDING_DEFAULT,
        };
        if (!preload) {
            return Promise.resolve();
        } else {
            return fetch(api, obj, preload, params);
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
            obj.page += 1;
            return Promise.resolve({
                'page': obj.page,
                'data': obj.data.shift() || []
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