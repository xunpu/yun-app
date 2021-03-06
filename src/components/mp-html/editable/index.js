"use strict";

/**
 * @fileoverview editable 插件
 */
var config = require('./config');

function editable(vm) {
  var _this = this;

  this.vm = vm;
  this.editHistory = []; // 历史记录

  this.editI = -1; // 历史记录指针

  vm._mask = []; // 蒙版被点击时进行的操作

  vm._setData = function (path, val) {
    var paths = path.split('.'),
        target = vm;

    for (var i = 0; i < paths.length - 1; i++) {
      target = target[paths[i]];
    }

    vm.$set(target, paths.pop(), val);
  };
  /**
   * @description 移动历史记录指针
   * @param {Number} num 移动距离
   */


  var move = function move(num) {
    setTimeout(function () {
      var item = _this.editHistory[_this.editI + num];

      if (item) {
        _this.editI += num;

        vm._setData(item.key, item.value);
      }
    }, 200);
  };

  vm.undo = function () {
    return move(-1);
  }; // 撤销


  vm.redo = function () {
    return move(1);
  }; // 重做

  /**
   * @description 更新记录
   * @param {String} path 更新内容路径
   * @param {*} oldVal 旧值
   * @param {*} newVal 新值
   * @param {Boolean} set 是否更新到视图
   * @private
   */


  vm._editVal = function (path, oldVal, newVal, set) {
    // 当前指针后的内容去除
    while (_this.editI < _this.editHistory.length - 1) {
      _this.editHistory.pop();
    } // 最多存储 30 条操作记录


    while (_this.editHistory.length > 30) {
      _this.editHistory.pop();

      _this.editI--;
    }

    var last = _this.editHistory[_this.editHistory.length - 1];

    if (!last || last.key != path) {
      if (last) {
        // 去掉上一次的新值
        _this.editHistory.pop();

        _this.editI--;
      } // 存入这一次的旧值


      _this.editHistory.push({
        key: path,
        value: oldVal
      });

      _this.editI++;
    } // 存入本次的新值


    _this.editHistory.push({
      key: path,
      value: newVal
    });

    _this.editI++; // 更新到视图

    if (set) vm._setData(path, newVal);
  };
  /**
   * @description 获取菜单项
   * @private
   */


  vm._getItem = function (node) {
    var items;

    if (node.name == 'img') {
      items = config.img.slice(0);

      if (!vm.getSrc) {
        var _i = items.indexOf('换图');

        if (_i != -1) items.splice(_i, 1);
        _i = items.indexOf('超链接');
        if (_i != -1) items.splice(_i, 1);
        _i = items.indexOf('预览图');
        if (_i != -1) items.splice(_i, 1);
      }

      var i = items.indexOf('禁用预览');
      if (i != -1 && node.attrs.ignore) items[i] = '启用预览';
    } else if (node.name == 'a') items = config.link.slice(0);else if (node.name == 'video' || node.name == 'audio') {
      items = config.media.slice(0);

      var _i2 = items.indexOf('封面');

      if (!vm.getSrc && _i2 != -1) items.splice(_i2, 1);
      _i2 = items.indexOf('循环');
      if (node.attrs.loop && _i2 != -1) items[_i2] = '不循环';
    } else items = config.node.slice(0);

    return items;
  };
  /**
   * @description 显示 tooltip
   * @param {object} obj
   * @private
   */


  vm._tooltip = function (obj) {
    vm.$set(vm, 'tooltip', {
      top: obj.top,
      items: obj.items
    });
    vm._tooltipcb = obj.success;
  };
  /**
   * @description 显示滚动条
   * @param {object} obj
   * @private
   */


  vm._slider = function (obj) {
    vm.$set(vm, 'slider', {
      min: obj.min,
      max: obj.max,
      value: obj.value,
      top: obj.top
    });
    vm._slideringcb = obj.changing;
    vm._slidercb = obj.change;
  };
  /**
   * @description 点击蒙版
   * @private
   */


  vm._maskTap = function () {
    // 隐藏所有悬浮窗
    while (vm._mask.length) {
      vm._mask.pop()();
    }

    if (vm.tooltip) vm.$set(vm, 'tooltip', null);
    if (vm.slider) vm.$set(vm, 'slider', null);
  };
  /**
   * @description 插入节点
   * @param {Object} node 
   */


  function insert(node) {
    if (vm._edit) vm._edit.insert(node);else vm.nodes.push(node);
  }
  /**
   * @description 在光标处插入一张图片
   */


  vm.insertImg = function () {
    vm.getSrc && vm.getSrc('img').then(function (src) {
      insert({
        name: "p",
        attrs: {
          class: 'mp-img-wrapper',
          style: "text-align:center;"
        },
        children: [{
          name: "img",
          attrs: {
            class: 'mp-img',
            src: src
          }
        }]
      });
    }).catch(function () {});
  };
  /**
   * @description 在光标处插入一个链接
   */


  vm.insertLink = function () {
    vm.getSrc && vm.getSrc('link').then(function (link) {
      insert({
        name: "p",
        attrs: {
          class: 'mp-link-wrapper'
        },
        children: [{
          name: 'a',
          attrs: {
            class: 'mp-link',
            href: link.link
          },
          children: [{
            attrs: {
              class: 'mp-link-text'
            },
            type: 'text',
            text: link.name
          }]
        }]
      });
    }).catch(function () {});
  };
  /**
   * @description 在光标处插入一个卡片
   */


  vm.insertCard = function () {
    vm.getSrc && vm.getSrc('card').then(function (card) {
      console.log();
      insert({
        name: "p",
        attrs: {
          class: 'mp-card-wrapper'
        },
        children: [{
          name: 'div',
          attrs: {
            class: 'mp-card'
          },
          children: [{
            name: 'div',
            attrs: {
              class: 'mp-card-header'
            },
            children: [{
              name: 'div',
              attrs: {
                class: 'mp-card-header-title'
              },
              children: [{
                attrs: {
                  class: 'mp-card-header-title-text'
                },
                type: 'text',
                text: card.title
              }]
            }, {
              name: 'div',
              attrs: {
                class: 'mp-card-header-time'
              },
              children: [{
                attrs: {
                  class: 'mp-card-header-time-text'
                },
                type: 'text',
                text: card.ctime
              }]
            }]
          }, {
            name: 'div',
            attrs: {
              class: 'mp-card-body'
            },
            children: [{
              name: 'img',
              attrs: {
                class: 'mp-card-img',
                src: card.img_url
              }
            }]
          }, {
            name: 'div',
            attrs: {
              class: 'mp-card-footer'
            },
            children: [{
              name: 'a',
              attrs: {
                class: 'mp-card-footer-link',
                href: card.link
              },
              children: [{
                attrs: {
                  class: 'mp-card-footer-link-text'
                },
                type: 'text',
                text: '阅读'
              }]
            }]
          }]
        }]
      });
    }).catch(function () {});
  };
  /**
   * @description 在光标处插入一个视频
   */


  vm.insertVideo = function () {
    vm.getSrc && vm.getSrc('video').then(function (src) {
      // if (typeof src == 'string') src = [src];
      insert({
        name: 'div',
        attrs: {
          class: 'mp-video-wrapper'
        },
        children: [{
          name: 'iframe',
          attrs: {
            width: '100%',
            class: 'mp-video',
            scrolling: "no",
            border: "0",
            frameborder: "no",
            framespacing: "0",
            src: src
          },
          children: []
        }]
      });
    }).catch(function () {});
  };
  /**
   * @description 在光标处插入一个音频
   */


  vm.insertAudio = function () {
    vm.getSrc && vm.getSrc('audio').then(function (src) {
      if (typeof src == 'string') src = [src];
      insert({
        name: 'div',
        attrs: {
          class: 'mp-audio-wrapper'
        },
        children: [{
          name: 'audio',
          attrs: {
            class: 'mp-audio'
          },
          children: [],
          src: src
        }]
      });
    }).catch(function () {});
  };
  /**
   * @description 在光标处插入一段文本
   */


  vm.insertText = function () {
    insert({
      name: 'p',
      attrs: {
        class: 'mp-text-wrapper'
      },
      children: [{
        type: 'text',
        text: '新段落',
        attrs: {
          class: 'mp-text'
        }
      }]
    });
  };
  /**
   * @description 清空内容
   */


  vm.clear = function () {
    vm._maskTap();

    vm._edit = void 0;
    vm.$set(vm, 'nodes', [{
      name: 'p',
      attrs: {},
      children: [{
        type: 'text',
        text: '开始'
      }]
    }]);
  };
  /**
   * @description 获取编辑后的 html
   */


  vm.getContent = function () {
    var html = ''; // 递归遍历获取

    (function traversal(nodes, table) {
      for (var i = 0; i < nodes.length; i++) {
        var item = nodes[i];
        if (item.type == 'text') html += item.text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>').replace(/\xa0/g, '&nbsp;'); // 编码实体
        else {
            if (item.name == 'img') {
              item.attrs.i = ''; // 还原被转换的 svg

              if ((item.attrs.src || '').includes('data:image/svg+xml;utf8,')) {
                html += item.attrs.src.substr(24).replace(/%23/g, '#').replace('<svg', '<svg style="' + (item.attrs.style || '') + '"');
                continue;
              }
            } // 还原 video 和 audio 的 source
            else if (item.name == 'video' || item.name == 'audio') {
                item = JSON.parse(JSON.stringify(item));

                if (item.src.length > 1) {
                  item.children = [];

                  for (var j = 0; j < item.src.length; j++) {
                    item.children.push({
                      name: 'source',
                      attrs: {
                        src: item.src[j]
                      }
                    });
                  }
                } else item.attrs.src = item.src[0];
              } // 还原滚动层
              else if (item.name == 'div' && (item.attrs.style || '').includes('overflow:auto') && (item.children[0] || {}).name == 'table') item = item.children[0]; // 还原 table


            if (item.name == 'table') {
              item = JSON.parse(JSON.stringify(item));
              table = item.attrs;

              if ((item.attrs.style || '').includes('display:grid')) {
                item.attrs.style = item.attrs.style.split('display:grid')[0];
                var children = [{
                  name: 'tr',
                  attrs: {},
                  children: []
                }];

                for (var _j = 0; _j < item.children.length; _j++) {
                  item.children[_j].attrs.style = item.children[_j].attrs.style.replace(/grid-[^;]+;*/g, '');

                  if (item.children[_j].r != children.length) {
                    children.push({
                      name: 'tr',
                      attrs: {},
                      children: [item.children[_j]]
                    });
                  } else children[children.length - 1].children.push(item.children[_j]);
                }

                item.children = children;
              }
            }

            html += '<' + item.name;

            for (var attr in item.attrs) {
              var val = item.attrs[attr];
              if (!val) continue; // bool 型省略值

              if (val == 'T' || val === true) {
                html += ' ' + attr;
                continue;
              } // 取消为了显示 table 添加的 style
              else if (item.name[0] == 't' && attr == 'style' && table) {
                  val = val.replace(/;*display:table[^;]*/, '');
                  if (table.border) val = val.replace(/border[^;]+;*/g, function ($) {
                    return $.includes('collapse') ? $ : '';
                  });
                  if (table.cellpadding) val = val.replace(/padding[^;]+;*/g, '');
                  if (!val) continue;
                }

              html += ' ' + attr + '="' + val.replace(/"/g, '&quot;') + '"';
            }

            html += '>';

            if (item.children) {
              traversal(item.children, table);
              html += '</' + item.name + '>';
            }
          }
      }
    })(vm.nodes); // 其他插件处理


    for (var i = vm.plugins.length; i--;) {
      if (vm.plugins[i].onGetContent) html = vm.plugins[i].onGetContent(html) || html;
    }

    return html;
  };
}

editable.prototype.onUpdate = function (content, config) {
  if (this.vm.editable) {
    this.vm._maskTap();

    this.vm._edit = void 0;
    config.entities.amp = '&';
    if (!content) return '<p>开始</p>';
  }
};

module.exports = editable;