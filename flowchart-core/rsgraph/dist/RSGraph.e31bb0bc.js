// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../../../src/utils/tools.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRandomStr = getRandomStr;
exports.creatSvgElement = creatSvgElement;
exports.typeOf = typeOf;

/**
 * 获取随机字符
 * @return {number}
 */
function getRandomStr() {
  var width = 32;
  var charStr = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; // 去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1

  var maxPos = charStr.length;
  var randomStr = '';

  for (var i = 0; i < width; i++) {
    randomStr += charStr.charAt(Math.floor(Math.random() * maxPos));
  }

  return randomStr;
}
/**
 * 创建svg元素
 * @param {*} tagName
 */


function creatSvgElement(tagName) {
  return document.createElementNS('http://www.w3.org/2000/svg', tagName);
}
/**
 * 获取数据类型
 * @param {*} data
 */


function typeOf(data) {
  return Object.prototype.toString.call(data).slice(8, -1);
}
},{}],"../../../src/core/edge.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tools = require("../utils/tools.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * flowchart核心库
 * @description 路径类
 * @author TimRChen <timrchen@foxmai.com>
 */
var Edge =
/*#__PURE__*/
function () {
  function Edge() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Edge);

    // initial class property.
    this.id = (0, _tools.getRandomStr)();
    this.source = 0;
    this.target = 0;
    this.lineData = ''; // 路径数据，path属性d对应value值

    this.edge = this.createEdge();
    this.dotLink = ''; // 节点起始连接端点

    this.dotEndLink = ''; // 节点终止连接端点

    this.watchProperty(); // 连线样式覆盖

    if ('style' in options) {
      Object.assign(this.edge.style, options.style);
    }
  }
  /**
   * 监听属性变化
   */


  _createClass(Edge, [{
    key: "watchProperty",
    value: function watchProperty() {
      var _this = this;

      var lineData = ''; // lineDragData属性值可追溯

      Object.defineProperty(this, 'lineData', {
        enumerable: true,
        get: function get() {
          return lineData;
        },
        set: function set(value) {
          lineData = value;

          _this.setPath();
        }
      });
    }
    /**
     * 初始化路径
     */

  }, {
    key: "setPath",
    value: function setPath() {
      this.edge.setAttribute('d', this.lineData);
    }
    /**
     * 创建路径元
     */

  }, {
    key: "createEdge",
    value: function createEdge() {
      var edge = (0, _tools.creatSvgElement)('path');
      edge.setAttribute('class', 'link');
      edge.setAttribute('marker-end', 'url(#mark-arrow)');
      edge = this.initializeStyle(edge);
      return edge;
    }
    /**
     * 初始化样式
     * @argument {SVGPathElement} edge
     */

  }, {
    key: "initializeStyle",
    value: function initializeStyle(edge) {
      // default style
      Object.assign(edge.style, {
        fill: 'none',
        stroke: '#000',
        strokeWidth: 2,
        strokeLinejoin: 'round'
      });
      return edge;
    }
  }]);

  return Edge;
}();

exports.default = Edge;
},{"../utils/tools.js":"../../../src/utils/tools.js"}],"../../../src/utils/path.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRectWH = getRectWH;
exports.getFittedEndX = getFittedEndX;
exports.getFittedEndY = getFittedEndY;
exports.getMidXPath = getMidXPath;
exports.getMidYPath = getMidYPath;
exports.handleTheColSameLinkDot = handleTheColSameLinkDot;
exports.handleTheSameLinkDot = handleTheSameLinkDot;
exports.handleNotSameLinkDotAndAlongStraightLine = handleNotSameLinkDotAndAlongStraightLine;
exports.handelNotSameLinkDotAndAlongColStraightLine = handelNotSameLinkDotAndAlongColStraightLine;
var rectWidth = 140;
var rectHeight = 70;

function getRectWH(style) {
  var width = style.width,
      height = style.height;
  rectWidth = width;
  rectHeight = height;
}
/**
 * 横坐标最小连线误差直线拟合
 * @argument {String} startX 起始点XAxis
 * @argument {String} endY 终点YAxis
 */


function getFittedEndX(startX, endX) {
  var minX = Math.abs(startX - endX);
  var rangeNum = 3;

  if (minX < rangeNum) {
    endX = startX;
  }

  return endX;
}
/**
 * 纵坐标最小连线误差直线拟合
 * @argument {String} startY
 * @argument {String} endY
 */


function getFittedEndY(startY, endY) {
  var minY = Math.abs(startY - endY);
  var rangeNum = 3;

  if (minY < rangeNum) {
    endY = startY;
  }

  return endY;
}
/**
 * 获取顺向异端相连时中间横坐标路径
 * @argument {String} startX 起始点XAxis
 * @argument {String} startY 起始点YAxis
 * @argument {String} endX 终点XAxis
 * @argument {String} endY 终点YAxis
 */


function getMidXPath(startX, startY, endX, endY) {
  var midX1 = (startX + endX) / 2;
  var midY1 = startY;
  var midX2 = midX1;
  var midY2 = endY;
  return {
    midX1: midX1,
    midY1: midY1,
    midX2: midX2,
    midY2: midY2
  };
}
/**
 * 获取顺向异端相连时中间纵坐标路径
 * @argument {String} startX 起始点XAxis
 * @argument {String} startY 起始点YAxis
 * @argument {String} endX 终点XAxis
 * @argument {String} endY 终点YAxis
 */


function getMidYPath(startX, startY, endX, endY) {
  var midX1 = startX;
  var midY1 = (startY + endY) / 2;
  var midX2 = endX;
  var midY2 = midY1;
  return {
    midX1: midX1,
    midY1: midY1,
    midX2: midX2,
    midY2: midY2
  };
}
/**
 * 获取上端连上端时中间路径坐标
 * @argument {String} startX 起始点XAxis
 * @argument {String} startY 起始点YAxis
 * @argument {String} endX 终点XAxis
 * @argument {String} endY 终点YAxis
 */


function getTTMidPath(startX, startY, endX, endY) {
  var dY = Math.abs(startY - endY) * 2;

  if (dY === 0 || dY < rectHeight * 2) {
    dY = 44;
  }

  if (dY > rectHeight * 2) {
    dY = 44;
  }

  var minY = startY > endY ? endY : startY;
  var midY = minY - dY;
  var midX1 = startX;
  var midX2 = endX;
  return {
    midY: midY,
    midX1: midX1,
    midX2: midX2
  };
}
/**
 * 获取上端连上端时中间路径坐标
 * @argument {String} startX 起始点XAxis
 * @argument {String} startY 起始点YAxis
 * @argument {String} endX 终点XAxis
 * @argument {String} endY 终点YAxis
 */


function getBBMidPath(startX, startY, endX, endY) {
  var dY = Math.abs(startY - endY) * 2;

  if (dY === 0 || dY < rectHeight * 2) {
    dY = 44;
  }

  if (dY > rectHeight * 2) {
    dY = 44;
  }

  var maxY = startY > endY ? startY : endY;
  var midY = maxY + dY;
  var midX1 = startX;
  var midX2 = endX;
  return {
    midY: midY,
    midX1: midX1,
    midX2: midX2
  };
}
/**
 * 获取左端连左端时中间路径坐标
 * @argument {String} startX 起始点XAxis
 * @argument {String} startY 起始点YAxis
 * @argument {String} endX 终点XAxis
 * @argument {String} endY 终点YAxis
 */


function getLLMidPath(startX, startY, endX, endY) {
  var dX = Math.abs(startX - endX) * 2;

  if (dX === 0 || dX < rectWidth * 2) {
    dX = 88;
  }

  if (dX > rectWidth * 2) {
    dX = 88;
  }

  var minX = startX > endX ? endX : startX;
  var midX = minX - dX;
  var midY1 = startY;
  var midY2 = endY;
  return {
    midX: midX,
    midY1: midY1,
    midY2: midY2
  };
}
/**
 * 获取右端连右端时中间路径坐标
 * @argument {String} startX 起始点XAxis
 * @argument {String} startY 起始点YAxis
 * @argument {String} endX 终点XAxis
 * @argument {String} endY 终点YAxis
 */


function getRRMidPath(startX, startY, endX, endY) {
  var dX = Math.abs(startX - endX) * 2;

  if (dX === 0 || dX < rectWidth * 2) {
    dX = 88;
  }

  if (dX > rectWidth * 2) {
    dX = 88;
  }

  var maxX = startX > endX ? startX : endX;
  var midX = maxX + dX;
  var midY1 = startY;
  var midY2 = endY;
  return {
    midX: midX,
    midY1: midY1,
    midY2: midY2
  };
}
/**
 * 同侧端点连接： T-T || B-B
 */


function handleTheColSameLinkDot(linkData) {
  var dotLink = linkData.dotLink,
      dotEndLink = linkData.dotEndLink,
      startX = linkData.startX,
      startY = linkData.startY,
      endX = linkData.endX,
      endY = linkData.endY;
  var pathData = {};

  if (dotLink === 'top' && dotEndLink === 'top') {
    pathData = getTTMidPath(startX, startY, endX, endY);
  } else if (dotLink === 'bottom' && dotEndLink === 'bottom') {
    pathData = getBBMidPath(startX, startY, endX, endY);
  }

  if (Object.keys(pathData).length > 0) {
    var _pathData = pathData,
        midY = _pathData.midY,
        midX1 = _pathData.midX1,
        midX2 = _pathData.midX2;
    return "M ".concat(startX, ",").concat(startY, " L ").concat(midX1, ",").concat(midY, " L ").concat(midX2, ",").concat(midY, " L ").concat(endX, ",").concat(endY);
  }

  return '';
}
/**
 * 同侧端点连接： L-L || R-R
 */


function handleTheSameLinkDot(linkData) {
  var dotLink = linkData.dotLink,
      dotEndLink = linkData.dotEndLink,
      startX = linkData.startX,
      startY = linkData.startY,
      endX = linkData.endX,
      endY = linkData.endY;
  var pathData = {};

  if (dotLink === 'left' && dotEndLink === 'left') {
    pathData = getLLMidPath(startX, startY, endX, endY);
  } else if (dotLink === 'right' && dotEndLink === 'right') {
    pathData = getRRMidPath(startX, startY, endX, endY);
  }

  if (Object.keys(pathData).length > 0) {
    var _pathData2 = pathData,
        midX = _pathData2.midX,
        midY1 = _pathData2.midY1,
        midY2 = _pathData2.midY2;
    return "M ".concat(startX, ",").concat(startY, " L ").concat(midX, ",").concat(midY1, " L ").concat(midX, ",").concat(midY2, " L ").concat(endX, ",").concat(endY);
  }

  return '';
}
/**
 * 连接端点为纵向不同侧且节点之间处于同一水平线的
 * @argument linkData - 连线数据
 */


function handleNotSameLinkDotAndAlongStraightLine(linkData) {
  var dotLink = linkData.dotLink,
      dotEndLink = linkData.dotEndLink,
      startX = linkData.startX,
      startY = linkData.startY,
      endX = linkData.endX,
      endY = linkData.endY;

  if (dotLink === 'bottom' && dotEndLink === 'top') {
    if (endY < startY) {
      if (startX + rectWidth < endX) {
        var newStartX = startX + rectWidth / 2;
        var newStartY = startY - rectHeight / 2;
        var newEndX = endX - rectWidth / 2;
        var newEndY = endY + rectHeight / 2; // 纵坐标最小连线误差直线拟合

        newEndY = getFittedEndY(newStartY, newEndY);

        var _getMidXPath = getMidXPath(newStartX, newStartY, newEndX, newEndY),
            midX1 = _getMidXPath.midX1,
            midY1 = _getMidXPath.midY1,
            midX2 = _getMidXPath.midX2,
            midY2 = _getMidXPath.midY2;

        return "M ".concat(newStartX, ",").concat(newStartY, " L ").concat(midX1, ",").concat(midY1, " L ").concat(midX2, ",").concat(midY2, " L ").concat(newEndX, ",").concat(newEndY);
      } else if (startX - rectWidth > endX) {
        var _newStartX = startX - rectWidth / 2;

        var _newStartY = startY - rectHeight / 2;

        var _newEndX = endX + rectWidth / 2;

        var _newEndY = endY + rectHeight / 2; // 纵坐标最小连线误差直线拟合


        _newEndY = getFittedEndY(_newStartY, _newEndY);

        var _getMidXPath2 = getMidXPath(_newStartX, _newStartY, _newEndX, _newEndY),
            _midX = _getMidXPath2.midX1,
            _midY = _getMidXPath2.midY1,
            _midX2 = _getMidXPath2.midX2,
            _midY2 = _getMidXPath2.midY2;

        return "M ".concat(_newStartX, ",").concat(_newStartY, " L ").concat(_midX, ",").concat(_midY, " L ").concat(_midX2, ",").concat(_midY2, " L ").concat(_newEndX, ",").concat(_newEndY);
      } else {
        var _newStartX2 = startX;

        var _newStartY2 = startY - rectHeight;

        var _newEndX2 = endX;

        var _newEndY2 = endY + rectHeight; // 横坐标最小连线误差直线拟合


        _newEndX2 = getFittedEndX(_newStartX2, _newEndX2);

        var _getMidYPath = getMidYPath(_newStartX2, _newStartY2, _newEndX2, _newEndY2),
            _midX3 = _getMidYPath.midX1,
            _midY3 = _getMidYPath.midY1,
            _midX4 = _getMidYPath.midX2,
            _midY4 = _getMidYPath.midY2;

        return "M ".concat(_newStartX2, ",").concat(_newStartY2, " L ").concat(_midX3, ",").concat(_midY3, " L ").concat(_midX4, ",").concat(_midY4, " L ").concat(_newEndX2, ",").concat(_newEndY2);
      }
    }
  } else if (dotLink === 'top' && dotEndLink === 'bottom') {
    if (startY < endY) {
      if (startX + rectWidth < endX) {
        var _newStartX3 = startX + rectWidth / 2;

        var _newStartY3 = startY + rectHeight / 2;

        var _newEndX3 = endX - rectWidth / 2;

        var _newEndY3 = endY - rectHeight / 2; // 纵坐标最小连线误差直线拟合


        _newEndY3 = getFittedEndY(_newStartY3, _newEndY3);

        var _getMidXPath3 = getMidXPath(_newStartX3, _newStartY3, _newEndX3, _newEndY3),
            _midX5 = _getMidXPath3.midX1,
            _midY5 = _getMidXPath3.midY1,
            _midX6 = _getMidXPath3.midX2,
            _midY6 = _getMidXPath3.midY2;

        return "M ".concat(_newStartX3, ",").concat(_newStartY3, " L ").concat(_midX5, ",").concat(_midY5, " L ").concat(_midX6, ",").concat(_midY6, " L ").concat(_newEndX3, ",").concat(_newEndY3);
      } else if (startX - rectWidth > endX) {
        var _newStartX4 = startX - rectWidth / 2;

        var _newStartY4 = startY + rectHeight / 2;

        var _newEndX4 = endX + rectWidth / 2;

        var _newEndY4 = endY - rectHeight / 2; // 纵坐标最小连线误差直线拟合


        _newEndY4 = getFittedEndY(_newStartY4, _newEndY4);

        var _getMidXPath4 = getMidXPath(_newStartX4, _newStartY4, _newEndX4, _newEndY4),
            _midX7 = _getMidXPath4.midX1,
            _midY7 = _getMidXPath4.midY1,
            _midX8 = _getMidXPath4.midX2,
            _midY8 = _getMidXPath4.midY2;

        return "M ".concat(_newStartX4, ",").concat(_newStartY4, " L ").concat(_midX7, ",").concat(_midY7, " L ").concat(_midX8, ",").concat(_midY8, " L ").concat(_newEndX4, ",").concat(_newEndY4);
      } else {
        var _newStartX5 = startX;

        var _newStartY5 = startY + rectHeight;

        var _newEndX5 = endX;

        var _newEndY5 = endY - rectHeight; // 横坐标最小连线误差直线拟合


        _newEndX5 = getFittedEndX(_newStartX5, _newEndX5);

        var _getMidYPath2 = getMidYPath(_newStartX5, _newStartY5, _newEndX5, _newEndY5),
            _midX9 = _getMidYPath2.midX1,
            _midY9 = _getMidYPath2.midY1,
            _midX10 = _getMidYPath2.midX2,
            _midY10 = _getMidYPath2.midY2;

        return "M ".concat(_newStartX5, ",").concat(_newStartY5, " L ").concat(_midX9, ",").concat(_midY9, " L ").concat(_midX10, ",").concat(_midY10, " L ").concat(_newEndX5, ",").concat(_newEndY5);
      }
    }
  }

  return '';
}
/**
 * 连接端点不同侧且节点之间处于同一纵向水平线的
 * @argument linkData - 连线数据
 */


function handelNotSameLinkDotAndAlongColStraightLine(linkData) {
  var dotLink = linkData.dotLink,
      dotEndLink = linkData.dotEndLink,
      startX = linkData.startX,
      startY = linkData.startY,
      endX = linkData.endX,
      endY = linkData.endY;

  if (dotLink === 'left' && dotEndLink === 'right') {
    if (startX < endX) {
      if (startX + rectWidth * 2 < endX) {
        // 起始端口距离终止端口两倍距离时连线(非顺向)
        var newStartX = startX + rectWidth;
        var newStartY = startY;
        var newEndX = endX - rectWidth;
        var newEndY = endY; // 纵坐标最小连线误差直线拟合

        newEndY = getFittedEndY(newStartY, newEndY);

        var _getMidXPath5 = getMidXPath(newStartX, newStartY, newEndX, newEndY),
            midX1 = _getMidXPath5.midX1,
            midY1 = _getMidXPath5.midY1,
            midX2 = _getMidXPath5.midX2,
            midY2 = _getMidXPath5.midY2;

        return "M ".concat(newStartX, ",").concat(newStartY, " L ").concat(midX1, ",").concat(midY1, " L ").concat(midX2, ",").concat(midY2, " L ").concat(newEndX, ",").concat(newEndY);
      } else if (startX + rectWidth * 2 >= endX) {
        // 两者正对(包括偏差)时连线
        var _newStartX6 = startX + rectWidth / 2;

        var _newStartY6 = startY + rectHeight / 2;

        var _newEndX6 = endX - rectWidth / 2;

        var _newEndY6 = endY - rectHeight / 2;

        if (startY > endY) {
          // 起始端口位于终止端口下方时
          _newStartY6 = startY - rectHeight / 2;
          _newEndY6 = endY + rectHeight / 2;
        } // 横坐标最小连线误差直线拟合


        _newEndX6 = getFittedEndX(_newStartX6, _newEndX6);

        var _getMidYPath3 = getMidYPath(_newStartX6, _newStartY6, _newEndX6, _newEndY6),
            _midX11 = _getMidYPath3.midX1,
            _midY11 = _getMidYPath3.midY1,
            _midX12 = _getMidYPath3.midX2,
            _midY12 = _getMidYPath3.midY2;

        return "M ".concat(_newStartX6, ",").concat(_newStartY6, " L ").concat(_midX11, ",").concat(_midY11, " L ").concat(_midX12, ",").concat(_midY12, " L ").concat(_newEndX6, ",").concat(_newEndY6);
      }
    }
  } else if (dotLink === 'right' && dotEndLink === 'left') {
    if (startX > endX) {
      if (endX + rectWidth * 2 < startX) {
        // 起始端口距离终止端口两倍距离时连线(非顺向)
        var _newStartX7 = startX - rectWidth;

        var _newStartY7 = startY;

        var _newEndX7 = endX + rectWidth;

        var _newEndY7 = endY; // 纵坐标最小连线误差直线拟合

        _newEndY7 = getFittedEndY(_newStartY7, _newEndY7);

        var _getMidXPath6 = getMidXPath(_newStartX7, _newStartY7, _newEndX7, _newEndY7),
            _midX13 = _getMidXPath6.midX1,
            _midY13 = _getMidXPath6.midY1,
            _midX14 = _getMidXPath6.midX2,
            _midY14 = _getMidXPath6.midY2;

        return "M ".concat(_newStartX7, ",").concat(_newStartY7, " L ").concat(_midX13, ",").concat(_midY13, " L ").concat(_midX14, ",").concat(_midY14, " L ").concat(_newEndX7, ",").concat(_newEndY7);
      } else if (endX + rectWidth * 2 >= startX) {
        // 两者正对(包括偏差)时连线
        var _newStartX8 = startX - rectWidth / 2;

        var _newStartY8 = startY + rectHeight / 2;

        var _newEndX8 = endX + rectWidth / 2;

        var _newEndY8 = endY - rectHeight / 2;

        if (startY > endY) {
          // 起始端口位于终止端口下方时
          _newStartY8 = startY - rectHeight / 2;
          _newEndY8 = endY + rectHeight / 2;
        } // 横坐标最小连线误差直线拟合


        _newEndX8 = getFittedEndX(_newStartX8, _newEndX8);

        var _getMidYPath4 = getMidYPath(_newStartX8, _newStartY8, _newEndX8, _newEndY8),
            _midX15 = _getMidYPath4.midX1,
            _midY15 = _getMidYPath4.midY1,
            _midX16 = _getMidYPath4.midX2,
            _midY16 = _getMidYPath4.midY2;

        return "M ".concat(_newStartX8, ",").concat(_newStartY8, " L ").concat(_midX15, ",").concat(_midY15, " L ").concat(_midX16, ",").concat(_midY16, " L ").concat(_newEndX8, ",").concat(_newEndY8);
      }
    }
  }

  return '';
}
},{}],"../../../src/core/core.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _edge = _interopRequireDefault(require("./edge.js"));

var _tools = require("../utils/tools.js");

var _path = require("../utils/path.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * flowchart核心库
 * @description 容器类
 * @author TimRChen <timrchen@foxmai.com>
 */
var Core =
/*#__PURE__*/
function () {
  function Core(svgContainer) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Core);

    // initial class property.
    this.nodes = [];
    this.edges = [];
    this.svgContainer = svgContainer;
    this.options = options;
    this.nodeG = this.createGroup(svgContainer, 'graph');
    this.virtualG = this.createGroup(svgContainer, 'virtual-edge');
    this.edgeG = this.createGroup(svgContainer, 'edges');
    this.initializeContinaer(svgContainer, options);
    this.edge = {};
    this.virtualEdge = new _edge.default({
      style: {
        strokeDasharray: 8,
        stroke: '#888'
      }
    });
  }
  /**
   * 产生容器组
   * @argument {SVGElement} container
   * @argument {string} className
   */


  _createClass(Core, [{
    key: "createGroup",
    value: function createGroup(container, className) {
      var g = (0, _tools.creatSvgElement)('g');
      g.setAttribute('class', className);
      container.appendChild(g);
      return g;
    }
    /**
     * 初始化容器
     * @argument {SVGElement} container
     * @argument {Object} options
     */

  }, {
    key: "initializeContinaer",
    value: function initializeContinaer(container, options) {
      Object.assign(container.style, options.style);
      this.createExtraElement(container);
      this.bindMouseEvent(container);
    }
    /**
     * 创建额外元素
     * @argument {SVGElement} container
     */

  }, {
    key: "createExtraElement",
    value: function createExtraElement(container) {
      // 设置连接线箭头样式
      var defs = (0, _tools.creatSvgElement)('defs');
      var marker = (0, _tools.creatSvgElement)('marker');
      var path = (0, _tools.creatSvgElement)('path');
      marker.setAttribute('id', 'mark-arrow');
      marker.setAttribute('viewBox', '0 0 11 11');
      marker.setAttribute('refX', '8');
      marker.setAttribute('refY', '6');
      marker.setAttribute('markerWidth', '10');
      marker.setAttribute('markerHeight', '10');
      marker.setAttribute('orient', 'auto');
      path.setAttribute('d', 'M1,2 L8,6 L1,10 Z'); // diy arrow style.

      if ('line' in this.options) {
        if ('arrow' in this.options.line) {
          var line = this.options.line;

          if ('style' in line.arrow) {
            Object.assign(path.style, line.arrow.style);
          }

          if ('d' in line.arrow && typeof line.arrow.d === 'string') {
            path.setAttribute('d', line.arrow.d);
          }

          if ('viewBox' in line.arrow && typeof line.arrow.viewBox === 'string') {
            marker.setAttribute('viewBox', line.arrow.viewBox);
          }
        }
      }

      marker.appendChild(path);
      defs.appendChild(marker);
      container.appendChild(defs); // 设置link dot基础样式

      var graphStyle = document.createElement('style');
      graphStyle.setAttribute('class', 'flowchart-core-style');
      var head = document.querySelector('head');

      if ('mode' in this.options && this.options.mode === 'link-mode') {
        // 用户设置为可控制时，连接点展示连接效果
        graphStyle.innerText = "\n                .link-dot:hover {\n                    r: 12px!important;\n                    stroke: red!important;\n                    fill: transparent!important;\n                }\n            ";
      } // diy dot style.


      var _ref = this.options.linkDot || {},
          _ref$r = _ref.r,
          r = _ref$r === void 0 ? 2 : _ref$r,
          _ref$fill = _ref.fill,
          fill = _ref$fill === void 0 ? '#000' : _ref$fill,
          _ref$stroke = _ref.stroke,
          stroke = _ref$stroke === void 0 ? '#000' : _ref$stroke,
          _ref$strokeWidth = _ref.strokeWidth,
          strokeWidth = _ref$strokeWidth === void 0 ? 2 : _ref$strokeWidth,
          _ref$display = _ref.display,
          display = _ref$display === void 0 ? 'unset' : _ref$display;

      graphStyle.innerText += "\n                .link-dot {\n                    r: ".concat(r, "px;\n                    fill: ").concat(fill, ";\n                    stroke: ").concat(stroke, ";\n                    stroke-width: ").concat(strokeWidth, "px;\n                    transition: all 0.2s ease-in-out;\n                    display: ").concat(display, ";\n                }\n            ");

      if (!document.querySelector('.flowchart-core-style')) {
        head.appendChild(graphStyle);
      }
    }
    /**
     * 为svg容器绑定mouse event
     * @argument {SVGElement} container
     */

  }, {
    key: "bindMouseEvent",
    value: function bindMouseEvent(container) {
      if ('mode' in this.options && this.options.mode === 'link-mode') {
        // 用户设置为可控制时，绑定相关事件
        container.onmousemove = this.handleSvgMouseMove.bind(this);
        container.onmouseup = this.handleSvgMouseUp.bind(this);
      }
    }
    /**
     * 全局SVG mouse move handle
     * @description 核心方法 - 处理连线轨迹 - 更新节点拖拽变化值
     * @argument {MouseEvent} event - mouse event
     */

  }, {
    key: "handleSvgMouseMove",
    value: function handleSvgMouseMove(event) {
      // 拖拽节点
      this.handleDragNode(event); // 连接节点

      this.handleLinkNode(event);
    }
    /**
     * 全局SVG mouse up handle.
     * @description 核心方法 - 处理连线轨迹 - 更新节点拖拽变化值
     */

  }, {
    key: "handleSvgMouseUp",
    value: function handleSvgMouseUp() {
      // 处理连接至另一节点，即连接完毕
      this.handleLinkNodeOver(); // 连线后初始化相关变量

      this.initializeLinkEnv();
    }
    /**
     * 节点拖拽处理
     * @argument {MouseEvent} event - mouse event
     */

  }, {
    key: "handleDragNode",
    value: function handleDragNode(event) {
      var _this = this;

      var node = this.nodes.find(function (node) {
        return node.mousedownNode === true;
      });

      if (node) {
        // 更新节点位置
        var movementX = event.movementX,
            movementY = event.movementY;
        var _node$position = node.position,
            x = _node$position.x,
            y = _node$position.y;
        node.position = {
          x: x + movementX,
          y: y + movementY
        }; // 获取矩形宽高

        (0, _path.getRectWH)(node.style); // 连线数据随节点位置变更实时变更处理

        if (this.edges.length > 0) {
          this.edges.forEach(function (edge) {
            edge.lineData = _this.edgeData(edge);
            return edge;
          });
        }
      }
    }
    /**
     * 变更鼠标样式
     * @argument {string} stage
     */

  }, {
    key: "changeMouseStyle",
    value: function changeMouseStyle(stage) {
      var cursor = 'initial';
      if (stage === 'start') cursor = 'crosshair';
      Object.assign(this.svgContainer.style, {
        cursor: cursor
      });
    }
    /**
     * 节点连接处理
     * @argument {MouseEvent} event - mouse event
     */

  }, {
    key: "handleLinkNode",
    value: function handleLinkNode(event) {
      var linkNode = this.nodes.find(function (node) {
        return node.dotLink !== '';
      });

      if (linkNode) {
        // 插入连线预览
        console.log('start link..'); // 设置连线时鼠标样式

        this.changeMouseStyle('start'); // diy line style.

        var style = {};

        if ('line' in this.options) {
          if ('style' in this.options.line) {
            style = this.options.line.style;
          }
        } // 生成edge实例


        this.edge = new _edge.default({
          style: style
        });
        this.edge.source = linkNode.id;
        this.edge.dotLink = linkNode.dotLink; // 插入虚拟edge实例

        this.virtualG.appendChild(this.virtualEdge.edge);
        this.virtualEdge.lineData = this.caclPathDragData(linkNode, event);
      }
    }
    /**
     * 节点连接完毕处理
     */

  }, {
    key: "handleLinkNodeOver",
    value: function handleLinkNodeOver() {
      var endLinkNode = this.nodes.find(function (node) {
        return node.dotEndLink !== '';
      });

      if (endLinkNode) {
        console.log('end link.'); // 设置连线完毕时鼠标样式

        this.changeMouseStyle('end'); // 判断路径是否已存在，对连接路径数进行限制，两个节点之间最大连接路径数为2

        var edgeExist = this.edges.find(function (edge) {
          return edge.target === endLinkNode.id;
        }) || false;

        if (!edgeExist) {
          this.edge.target = endLinkNode.id;
          this.edge.dotEndLink = endLinkNode.dotEndLink;
          this.edge.lineData = this.edgeData(this.edge); // 新连接路径推入路径栈中

          this.edges.push(this.edge); // 向路径容器中插入路径

          this.edgeG.appendChild(this.edge.edge);
        } // 清空被连接端节点，末尾连接点类型数据


        endLinkNode.dotEndLink = '';
      }
    }
    /**
     * 初始化连接环境
     */

  }, {
    key: "initializeLinkEnv",
    value: function initializeLinkEnv() {
      var _this2 = this;

      this.nodes.forEach(function (node) {
        if (node.mousedownNode) {
          node.mousedownNode = false;
        }

        if (node.linkActive) {
          node.linkActive = false;
          node.dotLink = '';

          if (_this2.virtualG.hasChildNodes()) {
            _this2.virtualG.removeChild(_this2.virtualEdge.edge);
          }
        }

        return node;
      });
    }
    /**
     * 动态计算路径拖拽数据
     * @argument {NodeClass} mousedownNode - 当前 mousedown 状态节点
     * @argument {MouseEvent} event - mouse event
     * @return {string} path attr 'd' value
     */

  }, {
    key: "caclPathDragData",
    value: function caclPathDragData(mousedownNode, event) {
      var endX = event.x,
          endY = event.y;
      var linkNode = mousedownNode.linkNode;
      var dotLink = mousedownNode.dotLink;
      var startX = linkNode[dotLink].x;
      var startY = linkNode[dotLink].y;
      return "M ".concat(startX, ",").concat(startY, " L ").concat(endX, ",").concat(endY);
    }
    /**
     * 连线数据
     * @argument edge - 路径元数据
     */

  }, {
    key: "edgeData",
    value: function edgeData(edge) {
      var dotLink = edge.dotLink,
          dotEndLink = edge.dotEndLink;

      if (edge.source && edge.target) {
        var _this$nodes$find = this.nodes.find(function (node) {
          return node.id === edge.source;
        }),
            sourceLinkNode = _this$nodes$find.linkNode,
            sourceNodeY = _this$nodes$find.y;

        var _this$nodes$find2 = this.nodes.find(function (node) {
          return node.id === edge.target;
        }),
            targetLinkNode = _this$nodes$find2.linkNode;

        var startX = sourceLinkNode[dotLink].x;
        var startY = sourceLinkNode[dotLink].y;
        var endX = targetLinkNode[dotEndLink].x;
        var endY = targetLinkNode[dotEndLink].y;
        var linkData = {
          dotLink: dotLink,
          dotEndLink: dotEndLink,
          startX: startX,
          startY: startY,
          endX: endX,
          endY: endY
        }; // 连接端点同侧

        var sameLinkDotResult = (0, _path.handleTheSameLinkDot)(linkData);

        if (sameLinkDotResult !== '') {
          return sameLinkDotResult;
        } // link dot is left or right.


        if (dotLink !== 'top' && dotLink !== 'bottom' && dotEndLink !== 'top' && dotEndLink !== 'bottom') {
          return this.linkDotIsLeftOrRight(linkData, edge, sourceNodeY);
        } // link dot is top or bottom.


        if (dotLink !== 'left' && dotLink !== 'right' && dotEndLink !== 'left' && dotEndLink !== 'right') {
          return this.linkDotIsTopOrBottom(linkData);
        }

        return this.linkDotIsOthers(linkData);
      }
    }
    /**
     * 连接点仅为左或右
     */

  }, {
    key: "linkDotIsLeftOrRight",
    value: function linkDotIsLeftOrRight(linkData, edge, sourceNodeY) {
      var startX = linkData.startX,
          startY = linkData.startY,
          endX = linkData.endX,
          endY = linkData.endY; // 连接端点同侧

      var sameLinkDotResult = (0, _path.handleTheSameLinkDot)(linkData);

      if (sameLinkDotResult !== '') {
        return sameLinkDotResult;
      } // 连接端点不同侧且节点之间处于同一纵向水平线的


      var NotSameLinkDotAndACSLResult = (0, _path.handelNotSameLinkDotAndAlongColStraightLine)(linkData);

      if (NotSameLinkDotAndACSLResult !== '') {
        return NotSameLinkDotAndACSLResult;
      } // 纵坐标最小连线误差直线拟合


      var minY = Math.abs(startY - endY);
      var rangeNum = 3;

      if (minY < rangeNum) {
        endY = startY;
        this.nodes.forEach(function (i) {
          if (i.id === edge.target) {
            i.y = sourceNodeY;
            return i;
          }
        });
      } // 连接端点不同侧且为水平线连接（最常见的连接情况）


      var _getMidXPath = (0, _path.getMidXPath)(startX, startY, endX, endY),
          midX1 = _getMidXPath.midX1,
          midY1 = _getMidXPath.midY1,
          midX2 = _getMidXPath.midX2,
          midY2 = _getMidXPath.midY2;

      return "M ".concat(startX, ",").concat(startY, " L ").concat(midX1, ",").concat(midY1, " L ").concat(midX2, ",").concat(midY2, " L ").concat(endX, ",").concat(endY);
    }
    /**
     * 连接点仅为上或下
     */

  }, {
    key: "linkDotIsTopOrBottom",
    value: function linkDotIsTopOrBottom(linkData) {
      var startX = linkData.startX,
          startY = linkData.startY,
          endX = linkData.endX,
          endY = linkData.endY; // 连接纵向端点同侧

      var sameLinkDotResult = (0, _path.handleTheColSameLinkDot)(linkData);

      if (sameLinkDotResult !== '') {
        return sameLinkDotResult;
      } // 连接端点为纵向不同侧且节点之间处于同一水平线的


      var NotSameLinkDotAndASLResult = (0, _path.handleNotSameLinkDotAndAlongStraightLine)(linkData);

      if (NotSameLinkDotAndASLResult !== '') {
        return NotSameLinkDotAndASLResult;
      } // 横坐标最小连线误差直线拟合


      endX = (0, _path.getFittedEndX)(startX, endX); // 连接端点不同侧且为纵向水平线连接（最常见的连接情况）

      var _getMidYPath = (0, _path.getMidYPath)(startX, startY, endX, endY),
          midX1 = _getMidYPath.midX1,
          midY1 = _getMidYPath.midY1,
          midX2 = _getMidYPath.midX2,
          midY2 = _getMidYPath.midY2;

      return "M ".concat(startX, ",").concat(startY, " L ").concat(midX1, ",").concat(midY1, " L ").concat(midX2, ",").concat(midY2, " L ").concat(endX, ",").concat(endY);
    }
    /**
     * 连接点为水平方向与纵向时
     */

  }, {
    key: "linkDotIsOthers",
    value: function linkDotIsOthers(linkData) {
      var startX = linkData.startX,
          startY = linkData.startY,
          endX = linkData.endX,
          endY = linkData.endY;
      return "M ".concat(startX, ",").concat(startY, " L ").concat(endX, ",").concat(endY);
    }
    /**
     * 增加节点
     * @argument {SVGGElement} node
     */

  }, {
    key: "addNode",
    value: function addNode(node) {
      this.nodes.push(node);
      this.nodeG.appendChild(node.node);
    }
    /**
     * 增加路径
     * @argument {SVGPathElement} edge
     */

  }, {
    key: "addEdge",
    value: function addEdge(edge) {
      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      Object.assign(edge, config);
      edge.lineData = this.edgeData(edge);
      this.edges.push(edge);
      this.edgeG.appendChild(edge.edge);
    }
    /**
     * 删除节点数据并移除路径
     * @argument {SVGGElement} node
     */

  }, {
    key: "deleteNode",
    value: function deleteNode(node) {
      var index = this.nodes.findIndex(function (n) {
        return n.id === node.id;
      });

      if (index !== -1) {
        this.nodes.splice(index, 1);
        this.nodeG.removeChild(node.node);
      }
    }
    /**
     * 删除路径数据并移除路径
     * @argument {SVGPathElement} edge
     */

  }, {
    key: "deleteEdge",
    value: function deleteEdge(edge) {
      var index = this.edges.findIndex(function (e) {
        return e.id === edge.id;
      });

      if (index !== -1) {
        this.edges.splice(index, 1);
        this.edgeG.removeChild(edge.edge);
      }
    }
    /**
     * 隐藏节点/连接路径
     * @argument {SVGGElement SVGPathElement} svgElement
     * @argument {String} type svg元素类型
     */

  }, {
    key: "hiddenSvgElement",
    value: function hiddenSvgElement(svgElement) {
      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'node';

      if (type in svgElement) {
        Object.assign(svgElement[type].style, {
          display: 'none'
        });
      } else {
        throw TypeError("type value must be 'node' or 'edge', '".concat(type, "' is not one of them"));
      }
    }
    /**
     * 显示节点/连接路径
     * @argument {SVGGElement} svgElement
     * @argument {String} type svg元素类型
     */

  }, {
    key: "showSvgElement",
    value: function showSvgElement(svgElement) {
      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'node';

      if (type in svgElement) {
        Object.assign(svgElement[type].style, {
          display: 'unset'
        });
      } else {
        throw TypeError("type value must be 'node' or 'edge', '".concat(type, "' is not one of them"));
      }
    }
  }]);

  return Core;
}();

exports.default = Core;
},{"./edge.js":"../../../src/core/edge.js","../utils/tools.js":"../../../src/utils/tools.js","../utils/path.js":"../../../src/utils/path.js"}],"../../../src/core/graph.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tools = require("../utils/tools.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * flowchart核心库
 * @description 节点类
 * @author TimRChen <timrchen@foxmai.com>
 */
var Node =
/*#__PURE__*/
function () {
  function Node(config) {
    _classCallCheck(this, Node);

    var _config$style = config.style,
        style = _config$style === void 0 ? {} : _config$style,
        _config$html = config.html,
        html = _config$html === void 0 ? {} : _config$html;
    var defaultStyle = {
      width: 140,
      height: 70,
      strokeWidth: 2,
      stroke: 'black',
      fill: 'transparent'
    }; // initial class property.

    this.node = {};
    this.html = html;
    this.style = Object.assign(defaultStyle, style);
    this.dotLink = ''; // 节点起始连接端点

    this.dotEndLink = ''; // 节点终止连接端点

    this.mousedownNode = false; // 标记当前节点拖拽状态

    this.linkActive = false; // 此对象标记当前连线状态

    this.linkNode = {}; // 此对象标记每个连接点的位置

    this.watchProperty(config);
    this.initializeNode();
  }
  /**
   * 监听属性变化
   * @argument {Object} config
   */


  _createClass(Node, [{
    key: "watchProperty",
    value: function watchProperty(config) {
      var _this = this;

      if ('position' in config) {
        // position属性值可追溯
        var position = config.position;
        var id = (0, _tools.getRandomStr)();
        Object.defineProperties(this, {
          position: {
            enumerable: true,
            get: function get() {
              return position;
            },
            set: function set(value) {
              position = value;

              _this.handlePositionChange(value);
            }
          },
          id: {
            enumerable: true,
            get: function get() {
              return id;
            },
            set: function set(value) {
              if (typeof value !== 'string') {
                throw TypeError("".concat(value, " is not a string"));
              } else {
                id = value;
              }
            }
          }
        });
      } else {
        throw Error('There must be have a position attribute in config Object');
      }
    }
    /**
     * 更改position
     * @argument {Object} position
     */

  }, {
    key: "changePosition",
    value: function changePosition(position) {
      if ('x' in position || 'y' in position) {
        this.position = Object.assign({}, this.position, position);
      } else {
        throw Error('There must be have x or y attribute in position Object');
      }
    }
    /**
     * 位置变更处理
     * @argument {Object} position
     */

  }, {
    key: "handlePositionChange",
    value: function handlePositionChange(position) {
      var x = position.x,
          y = position.y;
      this.node.style.transform = "translate(".concat(x, "px, ").concat(y, "px)"); // 位置变更更新连线数据

      this.initialLinkNodeData();
    }
    /**
     * 初始化连线数据
     */

  }, {
    key: "initialLinkNodeData",
    value: function initialLinkNodeData() {
      var _this$style = this.style,
          rectWidth = _this$style.width,
          rectHeight = _this$style.height;
      var _this$position = this.position,
          x = _this$position.x,
          y = _this$position.y;
      var midX = x + rectWidth / 2;
      var midY = y + rectHeight / 2;
      this.linkNode = {
        top: {
          x: midX,
          y: y
        },
        bottom: {
          x: midX,
          y: y + rectHeight
        },
        left: {
          x: x,
          y: midY
        },
        right: {
          x: x + rectWidth,
          y: midY
        }
      };
    }
    /**
     * 初始化节点
     */

  }, {
    key: "initializeNode",
    value: function initializeNode() {
      this.node = this.createNode(this.style);
    }
    /**
     * 创建节点
     * @argument {Object} style
     */

  }, {
    key: "createNode",
    value: function createNode(style) {
      var nodeContainer = (0, _tools.creatSvgElement)('g');
      nodeContainer.setAttribute('class', 'node-container');

      if ('meta' in this.html && this.html.meta) {
        // could diy svg dom structure.
        var foreignObjectDom = (0, _tools.creatSvgElement)('foreignObject');
        foreignObjectDom.setAttribute('class', 'node'); // 将diy节点样式插入foreignObject中

        foreignObjectDom.appendChild(this.html.meta); // 初始化节点样式

        foreignObjectDom = this.initialNodeStyle(foreignObjectDom, style);
        nodeContainer.appendChild(foreignObjectDom);
      } else {
        // default
        var node = (0, _tools.creatSvgElement)('rect'); // default node style.

        node.setAttribute('class', 'node'); // 初始化节点样式

        node = this.initialNodeStyle(node, style);
        nodeContainer.appendChild(node);
      } // 设置节点位置


      var _this$position2 = this.position,
          x = _this$position2.x,
          y = _this$position2.y;
      nodeContainer.style.transform = "translate(".concat(x, "px, ").concat(y, "px)"); // 实例化节点连接点

      nodeContainer = this.initializeLinkDot(nodeContainer, style); // 节点绑定事件

      nodeContainer = this.nodeBindMouseEvent(nodeContainer);
      return nodeContainer;
    }
    /**
     * 为节点绑定mouse event
     * @argument {SVGGElement} node
     */

  }, {
    key: "nodeBindMouseEvent",
    value: function nodeBindMouseEvent(node) {
      node.onmousedown = this.dragSvgNode.bind(this);
      return node;
    }
    /**
     * 标记节点为拖拽状态
     */

  }, {
    key: "dragSvgNode",
    value: function dragSvgNode() {
      // 非连线状态时
      if (!this.linkActive) {
        // 标记为拖拽态
        this.mousedownNode = true;
      }
    }
    /**
     * 初始化节点样式
     * @argument {*} node
     * @argument {Object} style
     */

  }, {
    key: "initialNodeStyle",
    value: function initialNodeStyle(node, style) {
      Object.assign(node.style, style);
      return node;
    }
    /**
     * 初始化连接点
     * @argument {SVGGElement} nodeContainer
     * @argument {Object} style
     */

  }, {
    key: "initializeLinkDot",
    value: function initializeLinkDot(nodeContainer, style) {
      var topDot = (0, _tools.creatSvgElement)('circle');
      var bottomDot = (0, _tools.creatSvgElement)('circle');
      var leftDot = (0, _tools.creatSvgElement)('circle');
      var rightDot = (0, _tools.creatSvgElement)('circle');
      topDot.setAttribute('class', 'link-dot top');
      bottomDot.setAttribute('class', 'link-dot bottom');
      leftDot.setAttribute('class', 'link-dot left');
      rightDot.setAttribute('class', 'link-dot right');
      var rectWidth = style.width,
          rectHeight = style.height;
      var midX = rectWidth / 2;
      var midY = rectHeight / 2;
      Object.assign(topDot.style, {
        cx: midX + 'px',
        cy: 0
      });
      Object.assign(bottomDot.style, {
        cx: midX + 'px',
        cy: rectHeight + 'px'
      });
      Object.assign(leftDot.style, {
        cx: 0,
        cy: midY + 'px'
      });
      Object.assign(rightDot.style, {
        cx: rectWidth + 'px',
        cy: midY + 'px'
      });
      var bindEventDot = this.dotBindMouseEvent({
        topDot: topDot,
        bottomDot: bottomDot,
        leftDot: leftDot,
        rightDot: rightDot
      });
      nodeContainer.appendChild(bindEventDot.topDot);
      nodeContainer.appendChild(bindEventDot.bottomDot);
      nodeContainer.appendChild(bindEventDot.leftDot);
      nodeContainer.appendChild(bindEventDot.rightDot); // 初始化连接点数据

      this.initialLinkNodeData();
      return nodeContainer;
    }
    /**
     * 为连接点绑定mouse event
     * @argument {Object} dots
     */

  }, {
    key: "dotBindMouseEvent",
    value: function dotBindMouseEvent(dots) {
      var topDot = dots.topDot,
          bottomDot = dots.bottomDot,
          leftDot = dots.leftDot,
          rightDot = dots.rightDot;
      topDot.onmousedown = this.startLinkNode.bind(this, 'top');
      bottomDot.onmousedown = this.startLinkNode.bind(this, 'bottom');
      leftDot.onmousedown = this.startLinkNode.bind(this, 'left');
      rightDot.onmousedown = this.startLinkNode.bind(this, 'right');
      topDot.onmouseup = this.endLinkedNode.bind(this, 'top');
      bottomDot.onmouseup = this.endLinkedNode.bind(this, 'bottom');
      leftDot.onmouseup = this.endLinkedNode.bind(this, 'left');
      rightDot.onmouseup = this.endLinkedNode.bind(this, 'right');
      return {
        topDot: topDot,
        bottomDot: bottomDot,
        leftDot: leftDot,
        rightDot: rightDot
      };
    } // 开始连线

  }, {
    key: "startLinkNode",
    value: function startLinkNode(type) {
      this.linkActive = true;
      this.mousedownNode = false;
      this.dotLink = type;
    } // 连线终止

  }, {
    key: "endLinkedNode",
    value: function endLinkedNode(type) {
      if (this.dotLink === '') {
        this.linkActive = true;
        this.mousedownNode = false;
        this.dotEndLink = type;
      }
    }
  }]);

  return Node;
}();

exports.default = Node;
},{"../utils/tools.js":"../../../src/utils/tools.js"}],"../../../src/core/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Core", {
  enumerable: true,
  get: function () {
    return _core.default;
  }
});
Object.defineProperty(exports, "Node", {
  enumerable: true,
  get: function () {
    return _graph.default;
  }
});
Object.defineProperty(exports, "Edge", {
  enumerable: true,
  get: function () {
    return _edge.default;
  }
});

var _core = _interopRequireDefault(require("./core.js"));

var _graph = _interopRequireDefault(require("./graph.js"));

var _edge = _interopRequireDefault(require("./edge.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./core.js":"../../../src/core/core.js","./graph.js":"../../../src/core/graph.js","./edge.js":"../../../src/core/edge.js"}],"../../../node_modules/d3-selection/src/namespaces.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.xhtml = void 0;
var xhtml = "http://www.w3.org/1999/xhtml";
exports.xhtml = xhtml;
var _default = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: xhtml,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
exports.default = _default;
},{}],"../../../node_modules/d3-selection/src/namespace.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _namespaces = _interopRequireDefault(require("./namespaces"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(name) {
  var prefix = name += "",
      i = prefix.indexOf(":");
  if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
  return _namespaces.default.hasOwnProperty(prefix) ? {
    space: _namespaces.default[prefix],
    local: name
  } : name;
}
},{"./namespaces":"../../../node_modules/d3-selection/src/namespaces.js"}],"../../../node_modules/d3-selection/src/creator.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _namespace = _interopRequireDefault(require("./namespace"));

var _namespaces = require("./namespaces");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function creatorInherit(name) {
  return function () {
    var document = this.ownerDocument,
        uri = this.namespaceURI;
    return uri === _namespaces.xhtml && document.documentElement.namespaceURI === _namespaces.xhtml ? document.createElement(name) : document.createElementNS(uri, name);
  };
}

function creatorFixed(fullname) {
  return function () {
    return this.ownerDocument.createElementNS(fullname.space, fullname.local);
  };
}

function _default(name) {
  var fullname = (0, _namespace.default)(name);
  return (fullname.local ? creatorFixed : creatorInherit)(fullname);
}
},{"./namespace":"../../../node_modules/d3-selection/src/namespace.js","./namespaces":"../../../node_modules/d3-selection/src/namespaces.js"}],"../../../node_modules/d3-selection/src/selector.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function none() {}

function _default(selector) {
  return selector == null ? none : function () {
    return this.querySelector(selector);
  };
}
},{}],"../../../node_modules/d3-selection/src/selection/select.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _index = require("./index");

var _selector = _interopRequireDefault(require("../selector"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(select) {
  if (typeof select !== "function") select = (0, _selector.default)(select);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
        if ("__data__" in node) subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
      }
    }
  }

  return new _index.Selection(subgroups, this._parents);
}
},{"./index":"../../../node_modules/d3-selection/src/selection/index.js","../selector":"../../../node_modules/d3-selection/src/selector.js"}],"../../../node_modules/d3-selection/src/selectorAll.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function empty() {
  return [];
}

function _default(selector) {
  return selector == null ? empty : function () {
    return this.querySelectorAll(selector);
  };
}
},{}],"../../../node_modules/d3-selection/src/selection/selectAll.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _index = require("./index");

var _selectorAll = _interopRequireDefault(require("../selectorAll"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(select) {
  if (typeof select !== "function") select = (0, _selectorAll.default)(select);

  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        subgroups.push(select.call(node, node.__data__, i, group));
        parents.push(node);
      }
    }
  }

  return new _index.Selection(subgroups, parents);
}
},{"./index":"../../../node_modules/d3-selection/src/selection/index.js","../selectorAll":"../../../node_modules/d3-selection/src/selectorAll.js"}],"../../../node_modules/d3-selection/src/matcher.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(selector) {
  return function () {
    return this.matches(selector);
  };
}
},{}],"../../../node_modules/d3-selection/src/selection/filter.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _index = require("./index");

var _matcher = _interopRequireDefault(require("../matcher"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(match) {
  if (typeof match !== "function") match = (0, _matcher.default)(match);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }

  return new _index.Selection(subgroups, this._parents);
}
},{"./index":"../../../node_modules/d3-selection/src/selection/index.js","../matcher":"../../../node_modules/d3-selection/src/matcher.js"}],"../../../node_modules/d3-selection/src/selection/sparse.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(update) {
  return new Array(update.length);
}
},{}],"../../../node_modules/d3-selection/src/selection/enter.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.EnterNode = EnterNode;

var _sparse = _interopRequireDefault(require("./sparse"));

var _index = require("./index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default() {
  return new _index.Selection(this._enter || this._groups.map(_sparse.default), this._parents);
}

function EnterNode(parent, datum) {
  this.ownerDocument = parent.ownerDocument;
  this.namespaceURI = parent.namespaceURI;
  this._next = null;
  this._parent = parent;
  this.__data__ = datum;
}

EnterNode.prototype = {
  constructor: EnterNode,
  appendChild: function (child) {
    return this._parent.insertBefore(child, this._next);
  },
  insertBefore: function (child, next) {
    return this._parent.insertBefore(child, next);
  },
  querySelector: function (selector) {
    return this._parent.querySelector(selector);
  },
  querySelectorAll: function (selector) {
    return this._parent.querySelectorAll(selector);
  }
};
},{"./sparse":"../../../node_modules/d3-selection/src/selection/sparse.js","./index":"../../../node_modules/d3-selection/src/selection/index.js"}],"../../../node_modules/d3-selection/src/constant.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(x) {
  return function () {
    return x;
  };
}
},{}],"../../../node_modules/d3-selection/src/selection/data.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _index = require("./index");

var _enter = require("./enter");

var _constant = _interopRequireDefault(require("../constant"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var keyPrefix = "$"; // Protect against keys like “__proto__”.

function bindIndex(parent, group, enter, update, exit, data) {
  var i = 0,
      node,
      groupLength = group.length,
      dataLength = data.length; // Put any non-null nodes that fit into update.
  // Put any null nodes into enter.
  // Put any remaining data into enter.

  for (; i < dataLength; ++i) {
    if (node = group[i]) {
      node.__data__ = data[i];
      update[i] = node;
    } else {
      enter[i] = new _enter.EnterNode(parent, data[i]);
    }
  } // Put any non-null nodes that don’t fit into exit.


  for (; i < groupLength; ++i) {
    if (node = group[i]) {
      exit[i] = node;
    }
  }
}

function bindKey(parent, group, enter, update, exit, data, key) {
  var i,
      node,
      nodeByKeyValue = {},
      groupLength = group.length,
      dataLength = data.length,
      keyValues = new Array(groupLength),
      keyValue; // Compute the key for each node.
  // If multiple nodes have the same key, the duplicates are added to exit.

  for (i = 0; i < groupLength; ++i) {
    if (node = group[i]) {
      keyValues[i] = keyValue = keyPrefix + key.call(node, node.__data__, i, group);

      if (keyValue in nodeByKeyValue) {
        exit[i] = node;
      } else {
        nodeByKeyValue[keyValue] = node;
      }
    }
  } // Compute the key for each datum.
  // If there a node associated with this key, join and add it to update.
  // If there is not (or the key is a duplicate), add it to enter.


  for (i = 0; i < dataLength; ++i) {
    keyValue = keyPrefix + key.call(parent, data[i], i, data);

    if (node = nodeByKeyValue[keyValue]) {
      update[i] = node;
      node.__data__ = data[i];
      nodeByKeyValue[keyValue] = null;
    } else {
      enter[i] = new _enter.EnterNode(parent, data[i]);
    }
  } // Add any remaining nodes that were not bound to data to exit.


  for (i = 0; i < groupLength; ++i) {
    if ((node = group[i]) && nodeByKeyValue[keyValues[i]] === node) {
      exit[i] = node;
    }
  }
}

function _default(value, key) {
  if (!value) {
    data = new Array(this.size()), j = -1;
    this.each(function (d) {
      data[++j] = d;
    });
    return data;
  }

  var bind = key ? bindKey : bindIndex,
      parents = this._parents,
      groups = this._groups;
  if (typeof value !== "function") value = (0, _constant.default)(value);

  for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
    var parent = parents[j],
        group = groups[j],
        groupLength = group.length,
        data = value.call(parent, parent && parent.__data__, j, parents),
        dataLength = data.length,
        enterGroup = enter[j] = new Array(dataLength),
        updateGroup = update[j] = new Array(dataLength),
        exitGroup = exit[j] = new Array(groupLength);
    bind(parent, group, enterGroup, updateGroup, exitGroup, data, key); // Now connect the enter nodes to their following update node, such that
    // appendChild can insert the materialized enter node before this node,
    // rather than at the end of the parent node.

    for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
      if (previous = enterGroup[i0]) {
        if (i0 >= i1) i1 = i0 + 1;

        while (!(next = updateGroup[i1]) && ++i1 < dataLength);

        previous._next = next || null;
      }
    }
  }

  update = new _index.Selection(update, parents);
  update._enter = enter;
  update._exit = exit;
  return update;
}
},{"./index":"../../../node_modules/d3-selection/src/selection/index.js","./enter":"../../../node_modules/d3-selection/src/selection/enter.js","../constant":"../../../node_modules/d3-selection/src/constant.js"}],"../../../node_modules/d3-selection/src/selection/exit.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _sparse = _interopRequireDefault(require("./sparse"));

var _index = require("./index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default() {
  return new _index.Selection(this._exit || this._groups.map(_sparse.default), this._parents);
}
},{"./sparse":"../../../node_modules/d3-selection/src/selection/sparse.js","./index":"../../../node_modules/d3-selection/src/selection/index.js"}],"../../../node_modules/d3-selection/src/selection/join.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(onenter, onupdate, onexit) {
  var enter = this.enter(),
      update = this,
      exit = this.exit();
  enter = typeof onenter === "function" ? onenter(enter) : enter.append(onenter + "");
  if (onupdate != null) update = onupdate(update);
  if (onexit == null) exit.remove();else onexit(exit);
  return enter && update ? enter.merge(update).order() : update;
}
},{}],"../../../node_modules/d3-selection/src/selection/merge.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _index = require("./index");

function _default(selection) {
  for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }

  for (; j < m0; ++j) {
    merges[j] = groups0[j];
  }

  return new _index.Selection(merges, this._parents);
}
},{"./index":"../../../node_modules/d3-selection/src/selection/index.js"}],"../../../node_modules/d3-selection/src/selection/order.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default() {
  for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
    for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
      if (node = group[i]) {
        if (next && node.compareDocumentPosition(next) ^ 4) next.parentNode.insertBefore(node, next);
        next = node;
      }
    }
  }

  return this;
}
},{}],"../../../node_modules/d3-selection/src/selection/sort.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _index = require("./index");

function _default(compare) {
  if (!compare) compare = ascending;

  function compareNode(a, b) {
    return a && b ? compare(a.__data__, b.__data__) : !a - !b;
  }

  for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        sortgroup[i] = node;
      }
    }

    sortgroup.sort(compareNode);
  }

  return new _index.Selection(sortgroups, this._parents).order();
}

function ascending(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}
},{"./index":"../../../node_modules/d3-selection/src/selection/index.js"}],"../../../node_modules/d3-selection/src/selection/call.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default() {
  var callback = arguments[0];
  arguments[0] = this;
  callback.apply(null, arguments);
  return this;
}
},{}],"../../../node_modules/d3-selection/src/selection/nodes.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default() {
  var nodes = new Array(this.size()),
      i = -1;
  this.each(function () {
    nodes[++i] = this;
  });
  return nodes;
}
},{}],"../../../node_modules/d3-selection/src/selection/node.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default() {
  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
      var node = group[i];
      if (node) return node;
    }
  }

  return null;
}
},{}],"../../../node_modules/d3-selection/src/selection/size.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default() {
  var size = 0;
  this.each(function () {
    ++size;
  });
  return size;
}
},{}],"../../../node_modules/d3-selection/src/selection/empty.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default() {
  return !this.node();
}
},{}],"../../../node_modules/d3-selection/src/selection/each.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(callback) {
  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
      if (node = group[i]) callback.call(node, node.__data__, i, group);
    }
  }

  return this;
}
},{}],"../../../node_modules/d3-selection/src/selection/attr.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _namespace = _interopRequireDefault(require("../namespace"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function attrRemove(name) {
  return function () {
    this.removeAttribute(name);
  };
}

function attrRemoveNS(fullname) {
  return function () {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}

function attrConstant(name, value) {
  return function () {
    this.setAttribute(name, value);
  };
}

function attrConstantNS(fullname, value) {
  return function () {
    this.setAttributeNS(fullname.space, fullname.local, value);
  };
}

function attrFunction(name, value) {
  return function () {
    var v = value.apply(this, arguments);
    if (v == null) this.removeAttribute(name);else this.setAttribute(name, v);
  };
}

function attrFunctionNS(fullname, value) {
  return function () {
    var v = value.apply(this, arguments);
    if (v == null) this.removeAttributeNS(fullname.space, fullname.local);else this.setAttributeNS(fullname.space, fullname.local, v);
  };
}

function _default(name, value) {
  var fullname = (0, _namespace.default)(name);

  if (arguments.length < 2) {
    var node = this.node();
    return fullname.local ? node.getAttributeNS(fullname.space, fullname.local) : node.getAttribute(fullname);
  }

  return this.each((value == null ? fullname.local ? attrRemoveNS : attrRemove : typeof value === "function" ? fullname.local ? attrFunctionNS : attrFunction : fullname.local ? attrConstantNS : attrConstant)(fullname, value));
}
},{"../namespace":"../../../node_modules/d3-selection/src/namespace.js"}],"../../../node_modules/d3-selection/src/window.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(node) {
  return node.ownerDocument && node.ownerDocument.defaultView || // node is a Node
  node.document && node // node is a Window
  || node.defaultView; // node is a Document
}
},{}],"../../../node_modules/d3-selection/src/selection/style.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.styleValue = styleValue;

var _window = _interopRequireDefault(require("../window"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function styleRemove(name) {
  return function () {
    this.style.removeProperty(name);
  };
}

function styleConstant(name, value, priority) {
  return function () {
    this.style.setProperty(name, value, priority);
  };
}

function styleFunction(name, value, priority) {
  return function () {
    var v = value.apply(this, arguments);
    if (v == null) this.style.removeProperty(name);else this.style.setProperty(name, v, priority);
  };
}

function _default(name, value, priority) {
  return arguments.length > 1 ? this.each((value == null ? styleRemove : typeof value === "function" ? styleFunction : styleConstant)(name, value, priority == null ? "" : priority)) : styleValue(this.node(), name);
}

function styleValue(node, name) {
  return node.style.getPropertyValue(name) || (0, _window.default)(node).getComputedStyle(node, null).getPropertyValue(name);
}
},{"../window":"../../../node_modules/d3-selection/src/window.js"}],"../../../node_modules/d3-selection/src/selection/property.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function propertyRemove(name) {
  return function () {
    delete this[name];
  };
}

function propertyConstant(name, value) {
  return function () {
    this[name] = value;
  };
}

function propertyFunction(name, value) {
  return function () {
    var v = value.apply(this, arguments);
    if (v == null) delete this[name];else this[name] = v;
  };
}

function _default(name, value) {
  return arguments.length > 1 ? this.each((value == null ? propertyRemove : typeof value === "function" ? propertyFunction : propertyConstant)(name, value)) : this.node()[name];
}
},{}],"../../../node_modules/d3-selection/src/selection/classed.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function classArray(string) {
  return string.trim().split(/^|\s+/);
}

function classList(node) {
  return node.classList || new ClassList(node);
}

function ClassList(node) {
  this._node = node;
  this._names = classArray(node.getAttribute("class") || "");
}

ClassList.prototype = {
  add: function (name) {
    var i = this._names.indexOf(name);

    if (i < 0) {
      this._names.push(name);

      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  remove: function (name) {
    var i = this._names.indexOf(name);

    if (i >= 0) {
      this._names.splice(i, 1);

      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  contains: function (name) {
    return this._names.indexOf(name) >= 0;
  }
};

function classedAdd(node, names) {
  var list = classList(node),
      i = -1,
      n = names.length;

  while (++i < n) list.add(names[i]);
}

function classedRemove(node, names) {
  var list = classList(node),
      i = -1,
      n = names.length;

  while (++i < n) list.remove(names[i]);
}

function classedTrue(names) {
  return function () {
    classedAdd(this, names);
  };
}

function classedFalse(names) {
  return function () {
    classedRemove(this, names);
  };
}

function classedFunction(names, value) {
  return function () {
    (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
  };
}

function _default(name, value) {
  var names = classArray(name + "");

  if (arguments.length < 2) {
    var list = classList(this.node()),
        i = -1,
        n = names.length;

    while (++i < n) if (!list.contains(names[i])) return false;

    return true;
  }

  return this.each((typeof value === "function" ? classedFunction : value ? classedTrue : classedFalse)(names, value));
}
},{}],"../../../node_modules/d3-selection/src/selection/text.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function textRemove() {
  this.textContent = "";
}

function textConstant(value) {
  return function () {
    this.textContent = value;
  };
}

function textFunction(value) {
  return function () {
    var v = value.apply(this, arguments);
    this.textContent = v == null ? "" : v;
  };
}

function _default(value) {
  return arguments.length ? this.each(value == null ? textRemove : (typeof value === "function" ? textFunction : textConstant)(value)) : this.node().textContent;
}
},{}],"../../../node_modules/d3-selection/src/selection/html.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function htmlRemove() {
  this.innerHTML = "";
}

function htmlConstant(value) {
  return function () {
    this.innerHTML = value;
  };
}

function htmlFunction(value) {
  return function () {
    var v = value.apply(this, arguments);
    this.innerHTML = v == null ? "" : v;
  };
}

function _default(value) {
  return arguments.length ? this.each(value == null ? htmlRemove : (typeof value === "function" ? htmlFunction : htmlConstant)(value)) : this.node().innerHTML;
}
},{}],"../../../node_modules/d3-selection/src/selection/raise.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function raise() {
  if (this.nextSibling) this.parentNode.appendChild(this);
}

function _default() {
  return this.each(raise);
}
},{}],"../../../node_modules/d3-selection/src/selection/lower.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function lower() {
  if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
}

function _default() {
  return this.each(lower);
}
},{}],"../../../node_modules/d3-selection/src/selection/append.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _creator = _interopRequireDefault(require("../creator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(name) {
  var create = typeof name === "function" ? name : (0, _creator.default)(name);
  return this.select(function () {
    return this.appendChild(create.apply(this, arguments));
  });
}
},{"../creator":"../../../node_modules/d3-selection/src/creator.js"}],"../../../node_modules/d3-selection/src/selection/insert.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _creator = _interopRequireDefault(require("../creator"));

var _selector = _interopRequireDefault(require("../selector"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function constantNull() {
  return null;
}

function _default(name, before) {
  var create = typeof name === "function" ? name : (0, _creator.default)(name),
      select = before == null ? constantNull : typeof before === "function" ? before : (0, _selector.default)(before);
  return this.select(function () {
    return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
  });
}
},{"../creator":"../../../node_modules/d3-selection/src/creator.js","../selector":"../../../node_modules/d3-selection/src/selector.js"}],"../../../node_modules/d3-selection/src/selection/remove.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function remove() {
  var parent = this.parentNode;
  if (parent) parent.removeChild(this);
}

function _default() {
  return this.each(remove);
}
},{}],"../../../node_modules/d3-selection/src/selection/clone.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function selection_cloneShallow() {
  return this.parentNode.insertBefore(this.cloneNode(false), this.nextSibling);
}

function selection_cloneDeep() {
  return this.parentNode.insertBefore(this.cloneNode(true), this.nextSibling);
}

function _default(deep) {
  return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
}
},{}],"../../../node_modules/d3-selection/src/selection/datum.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(value) {
  return arguments.length ? this.property("__data__", value) : this.node().__data__;
}
},{}],"../../../node_modules/d3-selection/src/selection/on.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.customEvent = customEvent;
exports.event = void 0;
var filterEvents = {};
var event = null;
exports.event = event;

if (typeof document !== "undefined") {
  var element = document.documentElement;

  if (!("onmouseenter" in element)) {
    filterEvents = {
      mouseenter: "mouseover",
      mouseleave: "mouseout"
    };
  }
}

function filterContextListener(listener, index, group) {
  listener = contextListener(listener, index, group);
  return function (event) {
    var related = event.relatedTarget;

    if (!related || related !== this && !(related.compareDocumentPosition(this) & 8)) {
      listener.call(this, event);
    }
  };
}

function contextListener(listener, index, group) {
  return function (event1) {
    var event0 = event; // Events can be reentrant (e.g., focus).

    exports.event = event = event1;

    try {
      listener.call(this, this.__data__, index, group);
    } finally {
      exports.event = event = event0;
    }
  };
}

function parseTypenames(typenames) {
  return typenames.trim().split(/^|\s+/).map(function (t) {
    var name = "",
        i = t.indexOf(".");
    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
    return {
      type: t,
      name: name
    };
  });
}

function onRemove(typename) {
  return function () {
    var on = this.__on;
    if (!on) return;

    for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
      if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.capture);
      } else {
        on[++i] = o;
      }
    }

    if (++i) on.length = i;else delete this.__on;
  };
}

function onAdd(typename, value, capture) {
  var wrap = filterEvents.hasOwnProperty(typename.type) ? filterContextListener : contextListener;
  return function (d, i, group) {
    var on = this.__on,
        o,
        listener = wrap(value, i, group);
    if (on) for (var j = 0, m = on.length; j < m; ++j) {
      if ((o = on[j]).type === typename.type && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.capture);
        this.addEventListener(o.type, o.listener = listener, o.capture = capture);
        o.value = value;
        return;
      }
    }
    this.addEventListener(typename.type, listener, capture);
    o = {
      type: typename.type,
      name: typename.name,
      value: value,
      listener: listener,
      capture: capture
    };
    if (!on) this.__on = [o];else on.push(o);
  };
}

function _default(typename, value, capture) {
  var typenames = parseTypenames(typename + ""),
      i,
      n = typenames.length,
      t;

  if (arguments.length < 2) {
    var on = this.node().__on;

    if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
      for (i = 0, o = on[j]; i < n; ++i) {
        if ((t = typenames[i]).type === o.type && t.name === o.name) {
          return o.value;
        }
      }
    }
    return;
  }

  on = value ? onAdd : onRemove;
  if (capture == null) capture = false;

  for (i = 0; i < n; ++i) this.each(on(typenames[i], value, capture));

  return this;
}

function customEvent(event1, listener, that, args) {
  var event0 = event;
  event1.sourceEvent = event;
  exports.event = event = event1;

  try {
    return listener.apply(that, args);
  } finally {
    exports.event = event = event0;
  }
}
},{}],"../../../node_modules/d3-selection/src/selection/dispatch.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _window = _interopRequireDefault(require("../window"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function dispatchEvent(node, type, params) {
  var window = (0, _window.default)(node),
      event = window.CustomEvent;

  if (typeof event === "function") {
    event = new event(type, params);
  } else {
    event = window.document.createEvent("Event");
    if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;else event.initEvent(type, false, false);
  }

  node.dispatchEvent(event);
}

function dispatchConstant(type, params) {
  return function () {
    return dispatchEvent(this, type, params);
  };
}

function dispatchFunction(type, params) {
  return function () {
    return dispatchEvent(this, type, params.apply(this, arguments));
  };
}

function _default(type, params) {
  return this.each((typeof params === "function" ? dispatchFunction : dispatchConstant)(type, params));
}
},{"../window":"../../../node_modules/d3-selection/src/window.js"}],"../../../node_modules/d3-selection/src/selection/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Selection = Selection;
exports.default = exports.root = void 0;

var _select = _interopRequireDefault(require("./select"));

var _selectAll = _interopRequireDefault(require("./selectAll"));

var _filter = _interopRequireDefault(require("./filter"));

var _data = _interopRequireDefault(require("./data"));

var _enter = _interopRequireDefault(require("./enter"));

var _exit = _interopRequireDefault(require("./exit"));

var _join = _interopRequireDefault(require("./join"));

var _merge = _interopRequireDefault(require("./merge"));

var _order = _interopRequireDefault(require("./order"));

var _sort = _interopRequireDefault(require("./sort"));

var _call = _interopRequireDefault(require("./call"));

var _nodes = _interopRequireDefault(require("./nodes"));

var _node = _interopRequireDefault(require("./node"));

var _size = _interopRequireDefault(require("./size"));

var _empty = _interopRequireDefault(require("./empty"));

var _each = _interopRequireDefault(require("./each"));

var _attr = _interopRequireDefault(require("./attr"));

var _style = _interopRequireDefault(require("./style"));

var _property = _interopRequireDefault(require("./property"));

var _classed = _interopRequireDefault(require("./classed"));

var _text = _interopRequireDefault(require("./text"));

var _html = _interopRequireDefault(require("./html"));

var _raise = _interopRequireDefault(require("./raise"));

var _lower = _interopRequireDefault(require("./lower"));

var _append = _interopRequireDefault(require("./append"));

var _insert = _interopRequireDefault(require("./insert"));

var _remove = _interopRequireDefault(require("./remove"));

var _clone = _interopRequireDefault(require("./clone"));

var _datum = _interopRequireDefault(require("./datum"));

var _on = _interopRequireDefault(require("./on"));

var _dispatch = _interopRequireDefault(require("./dispatch"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var root = [null];
exports.root = root;

function Selection(groups, parents) {
  this._groups = groups;
  this._parents = parents;
}

function selection() {
  return new Selection([[document.documentElement]], root);
}

Selection.prototype = selection.prototype = {
  constructor: Selection,
  select: _select.default,
  selectAll: _selectAll.default,
  filter: _filter.default,
  data: _data.default,
  enter: _enter.default,
  exit: _exit.default,
  join: _join.default,
  merge: _merge.default,
  order: _order.default,
  sort: _sort.default,
  call: _call.default,
  nodes: _nodes.default,
  node: _node.default,
  size: _size.default,
  empty: _empty.default,
  each: _each.default,
  attr: _attr.default,
  style: _style.default,
  property: _property.default,
  classed: _classed.default,
  text: _text.default,
  html: _html.default,
  raise: _raise.default,
  lower: _lower.default,
  append: _append.default,
  insert: _insert.default,
  remove: _remove.default,
  clone: _clone.default,
  datum: _datum.default,
  on: _on.default,
  dispatch: _dispatch.default
};
var _default = selection;
exports.default = _default;
},{"./select":"../../../node_modules/d3-selection/src/selection/select.js","./selectAll":"../../../node_modules/d3-selection/src/selection/selectAll.js","./filter":"../../../node_modules/d3-selection/src/selection/filter.js","./data":"../../../node_modules/d3-selection/src/selection/data.js","./enter":"../../../node_modules/d3-selection/src/selection/enter.js","./exit":"../../../node_modules/d3-selection/src/selection/exit.js","./join":"../../../node_modules/d3-selection/src/selection/join.js","./merge":"../../../node_modules/d3-selection/src/selection/merge.js","./order":"../../../node_modules/d3-selection/src/selection/order.js","./sort":"../../../node_modules/d3-selection/src/selection/sort.js","./call":"../../../node_modules/d3-selection/src/selection/call.js","./nodes":"../../../node_modules/d3-selection/src/selection/nodes.js","./node":"../../../node_modules/d3-selection/src/selection/node.js","./size":"../../../node_modules/d3-selection/src/selection/size.js","./empty":"../../../node_modules/d3-selection/src/selection/empty.js","./each":"../../../node_modules/d3-selection/src/selection/each.js","./attr":"../../../node_modules/d3-selection/src/selection/attr.js","./style":"../../../node_modules/d3-selection/src/selection/style.js","./property":"../../../node_modules/d3-selection/src/selection/property.js","./classed":"../../../node_modules/d3-selection/src/selection/classed.js","./text":"../../../node_modules/d3-selection/src/selection/text.js","./html":"../../../node_modules/d3-selection/src/selection/html.js","./raise":"../../../node_modules/d3-selection/src/selection/raise.js","./lower":"../../../node_modules/d3-selection/src/selection/lower.js","./append":"../../../node_modules/d3-selection/src/selection/append.js","./insert":"../../../node_modules/d3-selection/src/selection/insert.js","./remove":"../../../node_modules/d3-selection/src/selection/remove.js","./clone":"../../../node_modules/d3-selection/src/selection/clone.js","./datum":"../../../node_modules/d3-selection/src/selection/datum.js","./on":"../../../node_modules/d3-selection/src/selection/on.js","./dispatch":"../../../node_modules/d3-selection/src/selection/dispatch.js"}],"../../../node_modules/d3-selection/src/select.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _index = require("./selection/index");

function _default(selector) {
  return typeof selector === "string" ? new _index.Selection([[document.querySelector(selector)]], [document.documentElement]) : new _index.Selection([[selector]], _index.root);
}
},{"./selection/index":"../../../node_modules/d3-selection/src/selection/index.js"}],"../../../node_modules/d3-selection/src/create.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _creator = _interopRequireDefault(require("./creator"));

var _select = _interopRequireDefault(require("./select"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(name) {
  return (0, _select.default)((0, _creator.default)(name).call(document.documentElement));
}
},{"./creator":"../../../node_modules/d3-selection/src/creator.js","./select":"../../../node_modules/d3-selection/src/select.js"}],"../../../node_modules/d3-selection/src/local.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = local;
var nextId = 0;

function local() {
  return new Local();
}

function Local() {
  this._ = "@" + (++nextId).toString(36);
}

Local.prototype = local.prototype = {
  constructor: Local,
  get: function (node) {
    var id = this._;

    while (!(id in node)) if (!(node = node.parentNode)) return;

    return node[id];
  },
  set: function (node, value) {
    return node[this._] = value;
  },
  remove: function (node) {
    return this._ in node && delete node[this._];
  },
  toString: function () {
    return this._;
  }
};
},{}],"../../../node_modules/d3-selection/src/sourceEvent.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _on = require("./selection/on");

function _default() {
  var current = _on.event,
      source;

  while (source = current.sourceEvent) current = source;

  return current;
}
},{"./selection/on":"../../../node_modules/d3-selection/src/selection/on.js"}],"../../../node_modules/d3-selection/src/point.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(node, event) {
  var svg = node.ownerSVGElement || node;

  if (svg.createSVGPoint) {
    var point = svg.createSVGPoint();
    point.x = event.clientX, point.y = event.clientY;
    point = point.matrixTransform(node.getScreenCTM().inverse());
    return [point.x, point.y];
  }

  var rect = node.getBoundingClientRect();
  return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
}
},{}],"../../../node_modules/d3-selection/src/mouse.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _sourceEvent = _interopRequireDefault(require("./sourceEvent"));

var _point = _interopRequireDefault(require("./point"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(node) {
  var event = (0, _sourceEvent.default)();
  if (event.changedTouches) event = event.changedTouches[0];
  return (0, _point.default)(node, event);
}
},{"./sourceEvent":"../../../node_modules/d3-selection/src/sourceEvent.js","./point":"../../../node_modules/d3-selection/src/point.js"}],"../../../node_modules/d3-selection/src/selectAll.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _index = require("./selection/index");

function _default(selector) {
  return typeof selector === "string" ? new _index.Selection([document.querySelectorAll(selector)], [document.documentElement]) : new _index.Selection([selector == null ? [] : selector], _index.root);
}
},{"./selection/index":"../../../node_modules/d3-selection/src/selection/index.js"}],"../../../node_modules/d3-selection/src/touch.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _sourceEvent = _interopRequireDefault(require("./sourceEvent"));

var _point = _interopRequireDefault(require("./point"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(node, touches, identifier) {
  if (arguments.length < 3) identifier = touches, touches = (0, _sourceEvent.default)().changedTouches;

  for (var i = 0, n = touches ? touches.length : 0, touch; i < n; ++i) {
    if ((touch = touches[i]).identifier === identifier) {
      return (0, _point.default)(node, touch);
    }
  }

  return null;
}
},{"./sourceEvent":"../../../node_modules/d3-selection/src/sourceEvent.js","./point":"../../../node_modules/d3-selection/src/point.js"}],"../../../node_modules/d3-selection/src/touches.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _sourceEvent = _interopRequireDefault(require("./sourceEvent"));

var _point = _interopRequireDefault(require("./point"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(node, touches) {
  if (touches == null) touches = (0, _sourceEvent.default)().touches;

  for (var i = 0, n = touches ? touches.length : 0, points = new Array(n); i < n; ++i) {
    points[i] = (0, _point.default)(node, touches[i]);
  }

  return points;
}
},{"./sourceEvent":"../../../node_modules/d3-selection/src/sourceEvent.js","./point":"../../../node_modules/d3-selection/src/point.js"}],"../../../node_modules/d3-selection/src/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "create", {
  enumerable: true,
  get: function () {
    return _create.default;
  }
});
Object.defineProperty(exports, "creator", {
  enumerable: true,
  get: function () {
    return _creator.default;
  }
});
Object.defineProperty(exports, "local", {
  enumerable: true,
  get: function () {
    return _local.default;
  }
});
Object.defineProperty(exports, "matcher", {
  enumerable: true,
  get: function () {
    return _matcher.default;
  }
});
Object.defineProperty(exports, "mouse", {
  enumerable: true,
  get: function () {
    return _mouse.default;
  }
});
Object.defineProperty(exports, "namespace", {
  enumerable: true,
  get: function () {
    return _namespace.default;
  }
});
Object.defineProperty(exports, "namespaces", {
  enumerable: true,
  get: function () {
    return _namespaces.default;
  }
});
Object.defineProperty(exports, "clientPoint", {
  enumerable: true,
  get: function () {
    return _point.default;
  }
});
Object.defineProperty(exports, "select", {
  enumerable: true,
  get: function () {
    return _select.default;
  }
});
Object.defineProperty(exports, "selectAll", {
  enumerable: true,
  get: function () {
    return _selectAll.default;
  }
});
Object.defineProperty(exports, "selection", {
  enumerable: true,
  get: function () {
    return _index.default;
  }
});
Object.defineProperty(exports, "selector", {
  enumerable: true,
  get: function () {
    return _selector.default;
  }
});
Object.defineProperty(exports, "selectorAll", {
  enumerable: true,
  get: function () {
    return _selectorAll.default;
  }
});
Object.defineProperty(exports, "style", {
  enumerable: true,
  get: function () {
    return _style.styleValue;
  }
});
Object.defineProperty(exports, "touch", {
  enumerable: true,
  get: function () {
    return _touch.default;
  }
});
Object.defineProperty(exports, "touches", {
  enumerable: true,
  get: function () {
    return _touches.default;
  }
});
Object.defineProperty(exports, "window", {
  enumerable: true,
  get: function () {
    return _window.default;
  }
});
Object.defineProperty(exports, "event", {
  enumerable: true,
  get: function () {
    return _on.event;
  }
});
Object.defineProperty(exports, "customEvent", {
  enumerable: true,
  get: function () {
    return _on.customEvent;
  }
});

var _create = _interopRequireDefault(require("./create"));

var _creator = _interopRequireDefault(require("./creator"));

var _local = _interopRequireDefault(require("./local"));

var _matcher = _interopRequireDefault(require("./matcher"));

var _mouse = _interopRequireDefault(require("./mouse"));

var _namespace = _interopRequireDefault(require("./namespace"));

var _namespaces = _interopRequireDefault(require("./namespaces"));

var _point = _interopRequireDefault(require("./point"));

var _select = _interopRequireDefault(require("./select"));

var _selectAll = _interopRequireDefault(require("./selectAll"));

var _index = _interopRequireDefault(require("./selection/index"));

var _selector = _interopRequireDefault(require("./selector"));

var _selectorAll = _interopRequireDefault(require("./selectorAll"));

var _style = require("./selection/style");

var _touch = _interopRequireDefault(require("./touch"));

var _touches = _interopRequireDefault(require("./touches"));

var _window = _interopRequireDefault(require("./window"));

var _on = require("./selection/on");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./create":"../../../node_modules/d3-selection/src/create.js","./creator":"../../../node_modules/d3-selection/src/creator.js","./local":"../../../node_modules/d3-selection/src/local.js","./matcher":"../../../node_modules/d3-selection/src/matcher.js","./mouse":"../../../node_modules/d3-selection/src/mouse.js","./namespace":"../../../node_modules/d3-selection/src/namespace.js","./namespaces":"../../../node_modules/d3-selection/src/namespaces.js","./point":"../../../node_modules/d3-selection/src/point.js","./select":"../../../node_modules/d3-selection/src/select.js","./selectAll":"../../../node_modules/d3-selection/src/selectAll.js","./selection/index":"../../../node_modules/d3-selection/src/selection/index.js","./selector":"../../../node_modules/d3-selection/src/selector.js","./selectorAll":"../../../node_modules/d3-selection/src/selectorAll.js","./selection/style":"../../../node_modules/d3-selection/src/selection/style.js","./touch":"../../../node_modules/d3-selection/src/touch.js","./touches":"../../../node_modules/d3-selection/src/touches.js","./window":"../../../node_modules/d3-selection/src/window.js","./selection/on":"../../../node_modules/d3-selection/src/selection/on.js"}],"../../../node_modules/d3-dispatch/src/dispatch.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var noop = {
  value: function () {}
};

function dispatch() {
  for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
    if (!(t = arguments[i] + "") || t in _) throw new Error("illegal type: " + t);
    _[t] = [];
  }

  return new Dispatch(_);
}

function Dispatch(_) {
  this._ = _;
}

function parseTypenames(typenames, types) {
  return typenames.trim().split(/^|\s+/).map(function (t) {
    var name = "",
        i = t.indexOf(".");
    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
    if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
    return {
      type: t,
      name: name
    };
  });
}

Dispatch.prototype = dispatch.prototype = {
  constructor: Dispatch,
  on: function (typename, callback) {
    var _ = this._,
        T = parseTypenames(typename + "", _),
        t,
        i = -1,
        n = T.length; // If no callback was specified, return the callback of the given type and name.

    if (arguments.length < 2) {
      while (++i < n) if ((t = (typename = T[i]).type) && (t = get(_[t], typename.name))) return t;

      return;
    } // If a type was specified, set the callback for the given type and name.
    // Otherwise, if a null callback was specified, remove callbacks of the given name.


    if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);

    while (++i < n) {
      if (t = (typename = T[i]).type) _[t] = set(_[t], typename.name, callback);else if (callback == null) for (t in _) _[t] = set(_[t], typename.name, null);
    }

    return this;
  },
  copy: function () {
    var copy = {},
        _ = this._;

    for (var t in _) copy[t] = _[t].slice();

    return new Dispatch(copy);
  },
  call: function (type, that) {
    if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);

    for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
  },
  apply: function (type, that, args) {
    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);

    for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
  }
};

function get(type, name) {
  for (var i = 0, n = type.length, c; i < n; ++i) {
    if ((c = type[i]).name === name) {
      return c.value;
    }
  }
}

function set(type, name, callback) {
  for (var i = 0, n = type.length; i < n; ++i) {
    if (type[i].name === name) {
      type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
      break;
    }
  }

  if (callback != null) type.push({
    name: name,
    value: callback
  });
  return type;
}

var _default = dispatch;
exports.default = _default;
},{}],"../../../node_modules/d3-dispatch/src/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "dispatch", {
  enumerable: true,
  get: function () {
    return _dispatch.default;
  }
});

var _dispatch = _interopRequireDefault(require("./dispatch"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./dispatch":"../../../node_modules/d3-dispatch/src/dispatch.js"}],"../../../node_modules/d3-drag/src/noevent.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nopropagation = nopropagation;
exports.default = _default;

var _d3Selection = require("d3-selection");

function nopropagation() {
  _d3Selection.event.stopImmediatePropagation();
}

function _default() {
  _d3Selection.event.preventDefault();

  _d3Selection.event.stopImmediatePropagation();
}
},{"d3-selection":"../../../node_modules/d3-selection/src/index.js"}],"../../../node_modules/d3-drag/src/nodrag.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.yesdrag = yesdrag;

var _d3Selection = require("d3-selection");

var _noevent = _interopRequireDefault(require("./noevent.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(view) {
  var root = view.document.documentElement,
      selection = (0, _d3Selection.select)(view).on("dragstart.drag", _noevent.default, true);

  if ("onselectstart" in root) {
    selection.on("selectstart.drag", _noevent.default, true);
  } else {
    root.__noselect = root.style.MozUserSelect;
    root.style.MozUserSelect = "none";
  }
}

function yesdrag(view, noclick) {
  var root = view.document.documentElement,
      selection = (0, _d3Selection.select)(view).on("dragstart.drag", null);

  if (noclick) {
    selection.on("click.drag", _noevent.default, true);
    setTimeout(function () {
      selection.on("click.drag", null);
    }, 0);
  }

  if ("onselectstart" in root) {
    selection.on("selectstart.drag", null);
  } else {
    root.style.MozUserSelect = root.__noselect;
    delete root.__noselect;
  }
}
},{"d3-selection":"../../../node_modules/d3-selection/src/index.js","./noevent.js":"../../../node_modules/d3-drag/src/noevent.js"}],"../../../node_modules/d3-drag/src/constant.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(x) {
  return function () {
    return x;
  };
}
},{}],"../../../node_modules/d3-drag/src/event.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = DragEvent;

function DragEvent(target, type, subject, id, active, x, y, dx, dy, dispatch) {
  this.target = target;
  this.type = type;
  this.subject = subject;
  this.identifier = id;
  this.active = active;
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this._ = dispatch;
}

DragEvent.prototype.on = function () {
  var value = this._.on.apply(this._, arguments);

  return value === this._ ? this : value;
};
},{}],"../../../node_modules/d3-drag/src/drag.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _d3Dispatch = require("d3-dispatch");

var _d3Selection = require("d3-selection");

var _nodrag = _interopRequireWildcard(require("./nodrag.js"));

var _noevent = _interopRequireWildcard(require("./noevent.js"));

var _constant = _interopRequireDefault(require("./constant.js"));

var _event = _interopRequireDefault(require("./event.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

// Ignore right-click, since that should open the context menu.
function defaultFilter() {
  return !_d3Selection.event.ctrlKey && !_d3Selection.event.button;
}

function defaultContainer() {
  return this.parentNode;
}

function defaultSubject(d) {
  return d == null ? {
    x: _d3Selection.event.x,
    y: _d3Selection.event.y
  } : d;
}

function defaultTouchable() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}

function _default() {
  var filter = defaultFilter,
      container = defaultContainer,
      subject = defaultSubject,
      touchable = defaultTouchable,
      gestures = {},
      listeners = (0, _d3Dispatch.dispatch)("start", "drag", "end"),
      active = 0,
      mousedownx,
      mousedowny,
      mousemoving,
      touchending,
      clickDistance2 = 0;

  function drag(selection) {
    selection.on("mousedown.drag", mousedowned).filter(touchable).on("touchstart.drag", touchstarted).on("touchmove.drag", touchmoved).on("touchend.drag touchcancel.drag", touchended).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }

  function mousedowned() {
    if (touchending || !filter.apply(this, arguments)) return;
    var gesture = beforestart("mouse", container.apply(this, arguments), _d3Selection.mouse, this, arguments);
    if (!gesture) return;
    (0, _d3Selection.select)(_d3Selection.event.view).on("mousemove.drag", mousemoved, true).on("mouseup.drag", mouseupped, true);
    (0, _nodrag.default)(_d3Selection.event.view);
    (0, _noevent.nopropagation)();
    mousemoving = false;
    mousedownx = _d3Selection.event.clientX;
    mousedowny = _d3Selection.event.clientY;
    gesture("start");
  }

  function mousemoved() {
    (0, _noevent.default)();

    if (!mousemoving) {
      var dx = _d3Selection.event.clientX - mousedownx,
          dy = _d3Selection.event.clientY - mousedowny;
      mousemoving = dx * dx + dy * dy > clickDistance2;
    }

    gestures.mouse("drag");
  }

  function mouseupped() {
    (0, _d3Selection.select)(_d3Selection.event.view).on("mousemove.drag mouseup.drag", null);
    (0, _nodrag.yesdrag)(_d3Selection.event.view, mousemoving);
    (0, _noevent.default)();
    gestures.mouse("end");
  }

  function touchstarted() {
    if (!filter.apply(this, arguments)) return;
    var touches = _d3Selection.event.changedTouches,
        c = container.apply(this, arguments),
        n = touches.length,
        i,
        gesture;

    for (i = 0; i < n; ++i) {
      if (gesture = beforestart(touches[i].identifier, c, _d3Selection.touch, this, arguments)) {
        (0, _noevent.nopropagation)();
        gesture("start");
      }
    }
  }

  function touchmoved() {
    var touches = _d3Selection.event.changedTouches,
        n = touches.length,
        i,
        gesture;

    for (i = 0; i < n; ++i) {
      if (gesture = gestures[touches[i].identifier]) {
        (0, _noevent.default)();
        gesture("drag");
      }
    }
  }

  function touchended() {
    var touches = _d3Selection.event.changedTouches,
        n = touches.length,
        i,
        gesture;
    if (touchending) clearTimeout(touchending);
    touchending = setTimeout(function () {
      touchending = null;
    }, 500); // Ghost clicks are delayed!

    for (i = 0; i < n; ++i) {
      if (gesture = gestures[touches[i].identifier]) {
        (0, _noevent.nopropagation)();
        gesture("end");
      }
    }
  }

  function beforestart(id, container, point, that, args) {
    var p = point(container, id),
        s,
        dx,
        dy,
        sublisteners = listeners.copy();
    if (!(0, _d3Selection.customEvent)(new _event.default(drag, "beforestart", s, id, active, p[0], p[1], 0, 0, sublisteners), function () {
      if ((_d3Selection.event.subject = s = subject.apply(that, args)) == null) return false;
      dx = s.x - p[0] || 0;
      dy = s.y - p[1] || 0;
      return true;
    })) return;
    return function gesture(type) {
      var p0 = p,
          n;

      switch (type) {
        case "start":
          gestures[id] = gesture, n = active++;
          break;

        case "end":
          delete gestures[id], --active;
        // nobreak

        case "drag":
          p = point(container, id), n = active;
          break;
      }

      (0, _d3Selection.customEvent)(new _event.default(drag, type, s, id, n, p[0] + dx, p[1] + dy, p[0] - p0[0], p[1] - p0[1], sublisteners), sublisteners.apply, sublisteners, [type, that, args]);
    };
  }

  drag.filter = function (_) {
    return arguments.length ? (filter = typeof _ === "function" ? _ : (0, _constant.default)(!!_), drag) : filter;
  };

  drag.container = function (_) {
    return arguments.length ? (container = typeof _ === "function" ? _ : (0, _constant.default)(_), drag) : container;
  };

  drag.subject = function (_) {
    return arguments.length ? (subject = typeof _ === "function" ? _ : (0, _constant.default)(_), drag) : subject;
  };

  drag.touchable = function (_) {
    return arguments.length ? (touchable = typeof _ === "function" ? _ : (0, _constant.default)(!!_), drag) : touchable;
  };

  drag.on = function () {
    var value = listeners.on.apply(listeners, arguments);
    return value === listeners ? drag : value;
  };

  drag.clickDistance = function (_) {
    return arguments.length ? (clickDistance2 = (_ = +_) * _, drag) : Math.sqrt(clickDistance2);
  };

  return drag;
}
},{"d3-dispatch":"../../../node_modules/d3-dispatch/src/index.js","d3-selection":"../../../node_modules/d3-selection/src/index.js","./nodrag.js":"../../../node_modules/d3-drag/src/nodrag.js","./noevent.js":"../../../node_modules/d3-drag/src/noevent.js","./constant.js":"../../../node_modules/d3-drag/src/constant.js","./event.js":"../../../node_modules/d3-drag/src/event.js"}],"../../../node_modules/d3-drag/src/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "drag", {
  enumerable: true,
  get: function () {
    return _drag.default;
  }
});
Object.defineProperty(exports, "dragDisable", {
  enumerable: true,
  get: function () {
    return _nodrag.default;
  }
});
Object.defineProperty(exports, "dragEnable", {
  enumerable: true,
  get: function () {
    return _nodrag.yesdrag;
  }
});

var _drag = _interopRequireDefault(require("./drag.js"));

var _nodrag = _interopRequireWildcard(require("./nodrag.js"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./drag.js":"../../../node_modules/d3-drag/src/drag.js","./nodrag.js":"../../../node_modules/d3-drag/src/nodrag.js"}],"../../../node_modules/d3-color/src/define.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.extend = extend;

function _default(constructor, factory, prototype) {
  constructor.prototype = factory.prototype = prototype;
  prototype.constructor = constructor;
}

function extend(parent, definition) {
  var prototype = Object.create(parent.prototype);

  for (var key in definition) prototype[key] = definition[key];

  return prototype;
}
},{}],"../../../node_modules/d3-color/src/color.js":[function(require,module,exports) {

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Color = Color;
exports.default = color;
exports.rgbConvert = rgbConvert;
exports.rgb = rgb;
exports.Rgb = Rgb;
exports.hslConvert = hslConvert;
exports.hsl = hsl;
exports.brighter = exports.darker = void 0;

var _define = _interopRequireWildcard(require("./define"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function Color() {}

var darker = 0.7;
exports.darker = darker;
var brighter = 1 / darker;
exports.brighter = brighter;
var reI = "\\s*([+-]?\\d+)\\s*",
    reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*",
    reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
    reHex3 = /^#([0-9a-f]{3})$/,
    reHex6 = /^#([0-9a-f]{6})$/,
    reRgbInteger = new RegExp("^rgb\\(" + [reI, reI, reI] + "\\)$"),
    reRgbPercent = new RegExp("^rgb\\(" + [reP, reP, reP] + "\\)$"),
    reRgbaInteger = new RegExp("^rgba\\(" + [reI, reI, reI, reN] + "\\)$"),
    reRgbaPercent = new RegExp("^rgba\\(" + [reP, reP, reP, reN] + "\\)$"),
    reHslPercent = new RegExp("^hsl\\(" + [reN, reP, reP] + "\\)$"),
    reHslaPercent = new RegExp("^hsla\\(" + [reN, reP, reP, reN] + "\\)$");
var named = {
  aliceblue: 0xf0f8ff,
  antiquewhite: 0xfaebd7,
  aqua: 0x00ffff,
  aquamarine: 0x7fffd4,
  azure: 0xf0ffff,
  beige: 0xf5f5dc,
  bisque: 0xffe4c4,
  black: 0x000000,
  blanchedalmond: 0xffebcd,
  blue: 0x0000ff,
  blueviolet: 0x8a2be2,
  brown: 0xa52a2a,
  burlywood: 0xdeb887,
  cadetblue: 0x5f9ea0,
  chartreuse: 0x7fff00,
  chocolate: 0xd2691e,
  coral: 0xff7f50,
  cornflowerblue: 0x6495ed,
  cornsilk: 0xfff8dc,
  crimson: 0xdc143c,
  cyan: 0x00ffff,
  darkblue: 0x00008b,
  darkcyan: 0x008b8b,
  darkgoldenrod: 0xb8860b,
  darkgray: 0xa9a9a9,
  darkgreen: 0x006400,
  darkgrey: 0xa9a9a9,
  darkkhaki: 0xbdb76b,
  darkmagenta: 0x8b008b,
  darkolivegreen: 0x556b2f,
  darkorange: 0xff8c00,
  darkorchid: 0x9932cc,
  darkred: 0x8b0000,
  darksalmon: 0xe9967a,
  darkseagreen: 0x8fbc8f,
  darkslateblue: 0x483d8b,
  darkslategray: 0x2f4f4f,
  darkslategrey: 0x2f4f4f,
  darkturquoise: 0x00ced1,
  darkviolet: 0x9400d3,
  deeppink: 0xff1493,
  deepskyblue: 0x00bfff,
  dimgray: 0x696969,
  dimgrey: 0x696969,
  dodgerblue: 0x1e90ff,
  firebrick: 0xb22222,
  floralwhite: 0xfffaf0,
  forestgreen: 0x228b22,
  fuchsia: 0xff00ff,
  gainsboro: 0xdcdcdc,
  ghostwhite: 0xf8f8ff,
  gold: 0xffd700,
  goldenrod: 0xdaa520,
  gray: 0x808080,
  green: 0x008000,
  greenyellow: 0xadff2f,
  grey: 0x808080,
  honeydew: 0xf0fff0,
  hotpink: 0xff69b4,
  indianred: 0xcd5c5c,
  indigo: 0x4b0082,
  ivory: 0xfffff0,
  khaki: 0xf0e68c,
  lavender: 0xe6e6fa,
  lavenderblush: 0xfff0f5,
  lawngreen: 0x7cfc00,
  lemonchiffon: 0xfffacd,
  lightblue: 0xadd8e6,
  lightcoral: 0xf08080,
  lightcyan: 0xe0ffff,
  lightgoldenrodyellow: 0xfafad2,
  lightgray: 0xd3d3d3,
  lightgreen: 0x90ee90,
  lightgrey: 0xd3d3d3,
  lightpink: 0xffb6c1,
  lightsalmon: 0xffa07a,
  lightseagreen: 0x20b2aa,
  lightskyblue: 0x87cefa,
  lightslategray: 0x778899,
  lightslategrey: 0x778899,
  lightsteelblue: 0xb0c4de,
  lightyellow: 0xffffe0,
  lime: 0x00ff00,
  limegreen: 0x32cd32,
  linen: 0xfaf0e6,
  magenta: 0xff00ff,
  maroon: 0x800000,
  mediumaquamarine: 0x66cdaa,
  mediumblue: 0x0000cd,
  mediumorchid: 0xba55d3,
  mediumpurple: 0x9370db,
  mediumseagreen: 0x3cb371,
  mediumslateblue: 0x7b68ee,
  mediumspringgreen: 0x00fa9a,
  mediumturquoise: 0x48d1cc,
  mediumvioletred: 0xc71585,
  midnightblue: 0x191970,
  mintcream: 0xf5fffa,
  mistyrose: 0xffe4e1,
  moccasin: 0xffe4b5,
  navajowhite: 0xffdead,
  navy: 0x000080,
  oldlace: 0xfdf5e6,
  olive: 0x808000,
  olivedrab: 0x6b8e23,
  orange: 0xffa500,
  orangered: 0xff4500,
  orchid: 0xda70d6,
  palegoldenrod: 0xeee8aa,
  palegreen: 0x98fb98,
  paleturquoise: 0xafeeee,
  palevioletred: 0xdb7093,
  papayawhip: 0xffefd5,
  peachpuff: 0xffdab9,
  peru: 0xcd853f,
  pink: 0xffc0cb,
  plum: 0xdda0dd,
  powderblue: 0xb0e0e6,
  purple: 0x800080,
  rebeccapurple: 0x663399,
  red: 0xff0000,
  rosybrown: 0xbc8f8f,
  royalblue: 0x4169e1,
  saddlebrown: 0x8b4513,
  salmon: 0xfa8072,
  sandybrown: 0xf4a460,
  seagreen: 0x2e8b57,
  seashell: 0xfff5ee,
  sienna: 0xa0522d,
  silver: 0xc0c0c0,
  skyblue: 0x87ceeb,
  slateblue: 0x6a5acd,
  slategray: 0x708090,
  slategrey: 0x708090,
  snow: 0xfffafa,
  springgreen: 0x00ff7f,
  steelblue: 0x4682b4,
  tan: 0xd2b48c,
  teal: 0x008080,
  thistle: 0xd8bfd8,
  tomato: 0xff6347,
  turquoise: 0x40e0d0,
  violet: 0xee82ee,
  wheat: 0xf5deb3,
  white: 0xffffff,
  whitesmoke: 0xf5f5f5,
  yellow: 0xffff00,
  yellowgreen: 0x9acd32
};
(0, _define.default)(Color, color, {
  copy: function (channels) {
    return Object.assign(new this.constructor(), this, channels);
  },
  displayable: function () {
    return this.rgb().displayable();
  },
  hex: color_formatHex,
  // Deprecated! Use color.formatHex.
  formatHex: color_formatHex,
  formatHsl: color_formatHsl,
  formatRgb: color_formatRgb,
  toString: color_formatRgb
});

function color_formatHex() {
  return this.rgb().formatHex();
}

function color_formatHsl() {
  return hslConvert(this).formatHsl();
}

function color_formatRgb() {
  return this.rgb().formatRgb();
}

function color(format) {
  var m;
  format = (format + "").trim().toLowerCase();
  return (m = reHex3.exec(format)) ? (m = parseInt(m[1], 16), new Rgb(m >> 8 & 0xf | m >> 4 & 0x0f0, m >> 4 & 0xf | m & 0xf0, (m & 0xf) << 4 | m & 0xf, 1) // #f00
  ) : (m = reHex6.exec(format)) ? rgbn(parseInt(m[1], 16)) // #ff0000
  : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
  : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
  : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
  : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
  : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
  : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
  : named.hasOwnProperty(format) ? rgbn(named[format]) // eslint-disable-line no-prototype-builtins
  : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0) : null;
}

function rgbn(n) {
  return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
}

function rgba(r, g, b, a) {
  if (a <= 0) r = g = b = NaN;
  return new Rgb(r, g, b, a);
}

function rgbConvert(o) {
  if (!(o instanceof Color)) o = color(o);
  if (!o) return new Rgb();
  o = o.rgb();
  return new Rgb(o.r, o.g, o.b, o.opacity);
}

function rgb(r, g, b, opacity) {
  return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
}

function Rgb(r, g, b, opacity) {
  this.r = +r;
  this.g = +g;
  this.b = +b;
  this.opacity = +opacity;
}

(0, _define.default)(Rgb, rgb, (0, _define.extend)(Color, {
  brighter: function (k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  darker: function (k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  rgb: function () {
    return this;
  },
  displayable: function () {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: rgb_formatHex,
  // Deprecated! Use color.formatHex.
  formatHex: rgb_formatHex,
  formatRgb: rgb_formatRgb,
  toString: rgb_formatRgb
}));

function rgb_formatHex() {
  return "#" + hex(this.r) + hex(this.g) + hex(this.b);
}

function rgb_formatRgb() {
  var a = this.opacity;
  a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
  return (a === 1 ? "rgb(" : "rgba(") + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", " + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", " + Math.max(0, Math.min(255, Math.round(this.b) || 0)) + (a === 1 ? ")" : ", " + a + ")");
}

function hex(value) {
  value = Math.max(0, Math.min(255, Math.round(value) || 0));
  return (value < 16 ? "0" : "") + value.toString(16);
}

function hsla(h, s, l, a) {
  if (a <= 0) h = s = l = NaN;else if (l <= 0 || l >= 1) h = s = NaN;else if (s <= 0) h = NaN;
  return new Hsl(h, s, l, a);
}

function hslConvert(o) {
  if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
  if (!(o instanceof Color)) o = color(o);
  if (!o) return new Hsl();
  if (o instanceof Hsl) return o;
  o = o.rgb();
  var r = o.r / 255,
      g = o.g / 255,
      b = o.b / 255,
      min = Math.min(r, g, b),
      max = Math.max(r, g, b),
      h = NaN,
      s = max - min,
      l = (max + min) / 2;

  if (s) {
    if (r === max) h = (g - b) / s + (g < b) * 6;else if (g === max) h = (b - r) / s + 2;else h = (r - g) / s + 4;
    s /= l < 0.5 ? max + min : 2 - max - min;
    h *= 60;
  } else {
    s = l > 0 && l < 1 ? 0 : h;
  }

  return new Hsl(h, s, l, o.opacity);
}

function hsl(h, s, l, opacity) {
  return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
}

function Hsl(h, s, l, opacity) {
  this.h = +h;
  this.s = +s;
  this.l = +l;
  this.opacity = +opacity;
}

(0, _define.default)(Hsl, hsl, (0, _define.extend)(Color, {
  brighter: function (k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  darker: function (k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  rgb: function () {
    var h = this.h % 360 + (this.h < 0) * 360,
        s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
        l = this.l,
        m2 = l + (l < 0.5 ? l : 1 - l) * s,
        m1 = 2 * l - m2;
    return new Rgb(hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2), hsl2rgb(h, m1, m2), hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2), this.opacity);
  },
  displayable: function () {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl: function () {
    var a = this.opacity;
    a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
    return (a === 1 ? "hsl(" : "hsla(") + (this.h || 0) + ", " + (this.s || 0) * 100 + "%, " + (this.l || 0) * 100 + "%" + (a === 1 ? ")" : ", " + a + ")");
  }
}));
/* From FvD 13.37, CSS Color Module Level 3 */

function hsl2rgb(h, m1, m2) {
  return (h < 60 ? m1 + (m2 - m1) * h / 60 : h < 180 ? m2 : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60 : m1) * 255;
}
},{"./define":"../../../node_modules/d3-color/src/define.js"}],"../../../node_modules/d3-color/src/math.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rad2deg = exports.deg2rad = void 0;
var deg2rad = Math.PI / 180;
exports.deg2rad = deg2rad;
var rad2deg = 180 / Math.PI;
exports.rad2deg = rad2deg;
},{}],"../../../node_modules/d3-color/src/lab.js":[function(require,module,exports) {

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.gray = gray;
exports.default = lab;
exports.Lab = Lab;
exports.lch = lch;
exports.hcl = hcl;
exports.Hcl = Hcl;

var _define = _interopRequireWildcard(require("./define"));

var _color = require("./color");

var _math = require("./math");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

// https://observablehq.com/@mbostock/lab-and-rgb
var K = 18,
    Xn = 0.96422,
    Yn = 1,
    Zn = 0.82521,
    t0 = 4 / 29,
    t1 = 6 / 29,
    t2 = 3 * t1 * t1,
    t3 = t1 * t1 * t1;

function labConvert(o) {
  if (o instanceof Lab) return new Lab(o.l, o.a, o.b, o.opacity);
  if (o instanceof Hcl) return hcl2lab(o);
  if (!(o instanceof _color.Rgb)) o = (0, _color.rgbConvert)(o);
  var r = rgb2lrgb(o.r),
      g = rgb2lrgb(o.g),
      b = rgb2lrgb(o.b),
      y = xyz2lab((0.2225045 * r + 0.7168786 * g + 0.0606169 * b) / Yn),
      x,
      z;
  if (r === g && g === b) x = z = y;else {
    x = xyz2lab((0.4360747 * r + 0.3850649 * g + 0.1430804 * b) / Xn);
    z = xyz2lab((0.0139322 * r + 0.0971045 * g + 0.7141733 * b) / Zn);
  }
  return new Lab(116 * y - 16, 500 * (x - y), 200 * (y - z), o.opacity);
}

function gray(l, opacity) {
  return new Lab(l, 0, 0, opacity == null ? 1 : opacity);
}

function lab(l, a, b, opacity) {
  return arguments.length === 1 ? labConvert(l) : new Lab(l, a, b, opacity == null ? 1 : opacity);
}

function Lab(l, a, b, opacity) {
  this.l = +l;
  this.a = +a;
  this.b = +b;
  this.opacity = +opacity;
}

(0, _define.default)(Lab, lab, (0, _define.extend)(_color.Color, {
  brighter: function (k) {
    return new Lab(this.l + K * (k == null ? 1 : k), this.a, this.b, this.opacity);
  },
  darker: function (k) {
    return new Lab(this.l - K * (k == null ? 1 : k), this.a, this.b, this.opacity);
  },
  rgb: function () {
    var y = (this.l + 16) / 116,
        x = isNaN(this.a) ? y : y + this.a / 500,
        z = isNaN(this.b) ? y : y - this.b / 200;
    x = Xn * lab2xyz(x);
    y = Yn * lab2xyz(y);
    z = Zn * lab2xyz(z);
    return new _color.Rgb(lrgb2rgb(3.1338561 * x - 1.6168667 * y - 0.4906146 * z), lrgb2rgb(-0.9787684 * x + 1.9161415 * y + 0.0334540 * z), lrgb2rgb(0.0719453 * x - 0.2289914 * y + 1.4052427 * z), this.opacity);
  }
}));

function xyz2lab(t) {
  return t > t3 ? Math.pow(t, 1 / 3) : t / t2 + t0;
}

function lab2xyz(t) {
  return t > t1 ? t * t * t : t2 * (t - t0);
}

function lrgb2rgb(x) {
  return 255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
}

function rgb2lrgb(x) {
  return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
}

function hclConvert(o) {
  if (o instanceof Hcl) return new Hcl(o.h, o.c, o.l, o.opacity);
  if (!(o instanceof Lab)) o = labConvert(o);
  if (o.a === 0 && o.b === 0) return new Hcl(NaN, 0 < o.l && o.l < 100 ? 0 : NaN, o.l, o.opacity);

  var h = Math.atan2(o.b, o.a) * _math.rad2deg;

  return new Hcl(h < 0 ? h + 360 : h, Math.sqrt(o.a * o.a + o.b * o.b), o.l, o.opacity);
}

function lch(l, c, h, opacity) {
  return arguments.length === 1 ? hclConvert(l) : new Hcl(h, c, l, opacity == null ? 1 : opacity);
}

function hcl(h, c, l, opacity) {
  return arguments.length === 1 ? hclConvert(h) : new Hcl(h, c, l, opacity == null ? 1 : opacity);
}

function Hcl(h, c, l, opacity) {
  this.h = +h;
  this.c = +c;
  this.l = +l;
  this.opacity = +opacity;
}

function hcl2lab(o) {
  if (isNaN(o.h)) return new Lab(o.l, 0, 0, o.opacity);
  var h = o.h * _math.deg2rad;
  return new Lab(o.l, Math.cos(h) * o.c, Math.sin(h) * o.c, o.opacity);
}

(0, _define.default)(Hcl, hcl, (0, _define.extend)(_color.Color, {
  brighter: function (k) {
    return new Hcl(this.h, this.c, this.l + K * (k == null ? 1 : k), this.opacity);
  },
  darker: function (k) {
    return new Hcl(this.h, this.c, this.l - K * (k == null ? 1 : k), this.opacity);
  },
  rgb: function () {
    return hcl2lab(this).rgb();
  }
}));
},{"./define":"../../../node_modules/d3-color/src/define.js","./color":"../../../node_modules/d3-color/src/color.js","./math":"../../../node_modules/d3-color/src/math.js"}],"../../../node_modules/d3-color/src/cubehelix.js":[function(require,module,exports) {

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = cubehelix;
exports.Cubehelix = Cubehelix;

var _define = _interopRequireWildcard(require("./define"));

var _color = require("./color");

var _math = require("./math");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var A = -0.14861,
    B = +1.78277,
    C = -0.29227,
    D = -0.90649,
    E = +1.97294,
    ED = E * D,
    EB = E * B,
    BC_DA = B * C - D * A;

function cubehelixConvert(o) {
  if (o instanceof Cubehelix) return new Cubehelix(o.h, o.s, o.l, o.opacity);
  if (!(o instanceof _color.Rgb)) o = (0, _color.rgbConvert)(o);
  var r = o.r / 255,
      g = o.g / 255,
      b = o.b / 255,
      l = (BC_DA * b + ED * r - EB * g) / (BC_DA + ED - EB),
      bl = b - l,
      k = (E * (g - l) - C * bl) / D,
      s = Math.sqrt(k * k + bl * bl) / (E * l * (1 - l)),
      // NaN if l=0 or l=1
  h = s ? Math.atan2(k, bl) * _math.rad2deg - 120 : NaN;
  return new Cubehelix(h < 0 ? h + 360 : h, s, l, o.opacity);
}

function cubehelix(h, s, l, opacity) {
  return arguments.length === 1 ? cubehelixConvert(h) : new Cubehelix(h, s, l, opacity == null ? 1 : opacity);
}

function Cubehelix(h, s, l, opacity) {
  this.h = +h;
  this.s = +s;
  this.l = +l;
  this.opacity = +opacity;
}

(0, _define.default)(Cubehelix, cubehelix, (0, _define.extend)(_color.Color, {
  brighter: function (k) {
    k = k == null ? _color.brighter : Math.pow(_color.brighter, k);
    return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
  },
  darker: function (k) {
    k = k == null ? _color.darker : Math.pow(_color.darker, k);
    return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
  },
  rgb: function () {
    var h = isNaN(this.h) ? 0 : (this.h + 120) * _math.deg2rad,
        l = +this.l,
        a = isNaN(this.s) ? 0 : this.s * l * (1 - l),
        cosh = Math.cos(h),
        sinh = Math.sin(h);
    return new _color.Rgb(255 * (l + a * (A * cosh + B * sinh)), 255 * (l + a * (C * cosh + D * sinh)), 255 * (l + a * (E * cosh)), this.opacity);
  }
}));
},{"./define":"../../../node_modules/d3-color/src/define.js","./color":"../../../node_modules/d3-color/src/color.js","./math":"../../../node_modules/d3-color/src/math.js"}],"../../../node_modules/d3-color/src/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "color", {
  enumerable: true,
  get: function () {
    return _color.default;
  }
});
Object.defineProperty(exports, "rgb", {
  enumerable: true,
  get: function () {
    return _color.rgb;
  }
});
Object.defineProperty(exports, "hsl", {
  enumerable: true,
  get: function () {
    return _color.hsl;
  }
});
Object.defineProperty(exports, "lab", {
  enumerable: true,
  get: function () {
    return _lab.default;
  }
});
Object.defineProperty(exports, "hcl", {
  enumerable: true,
  get: function () {
    return _lab.hcl;
  }
});
Object.defineProperty(exports, "lch", {
  enumerable: true,
  get: function () {
    return _lab.lch;
  }
});
Object.defineProperty(exports, "gray", {
  enumerable: true,
  get: function () {
    return _lab.gray;
  }
});
Object.defineProperty(exports, "cubehelix", {
  enumerable: true,
  get: function () {
    return _cubehelix.default;
  }
});

var _color = _interopRequireWildcard(require("./color"));

var _lab = _interopRequireWildcard(require("./lab"));

var _cubehelix = _interopRequireDefault(require("./cubehelix"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }
},{"./color":"../../../node_modules/d3-color/src/color.js","./lab":"../../../node_modules/d3-color/src/lab.js","./cubehelix":"../../../node_modules/d3-color/src/cubehelix.js"}],"../../../node_modules/d3-interpolate/src/basis.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.basis = basis;
exports.default = _default;

function basis(t1, v0, v1, v2, v3) {
  var t2 = t1 * t1,
      t3 = t2 * t1;
  return ((1 - 3 * t1 + 3 * t2 - t3) * v0 + (4 - 6 * t2 + 3 * t3) * v1 + (1 + 3 * t1 + 3 * t2 - 3 * t3) * v2 + t3 * v3) / 6;
}

function _default(values) {
  var n = values.length - 1;
  return function (t) {
    var i = t <= 0 ? t = 0 : t >= 1 ? (t = 1, n - 1) : Math.floor(t * n),
        v1 = values[i],
        v2 = values[i + 1],
        v0 = i > 0 ? values[i - 1] : 2 * v1 - v2,
        v3 = i < n - 1 ? values[i + 2] : 2 * v2 - v1;
    return basis((t - i / n) * n, v0, v1, v2, v3);
  };
}
},{}],"../../../node_modules/d3-interpolate/src/basisClosed.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _basis = require("./basis");

function _default(values) {
  var n = values.length;
  return function (t) {
    var i = Math.floor(((t %= 1) < 0 ? ++t : t) * n),
        v0 = values[(i + n - 1) % n],
        v1 = values[i % n],
        v2 = values[(i + 1) % n],
        v3 = values[(i + 2) % n];
    return (0, _basis.basis)((t - i / n) * n, v0, v1, v2, v3);
  };
}
},{"./basis":"../../../node_modules/d3-interpolate/src/basis.js"}],"../../../node_modules/d3-interpolate/src/constant.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(x) {
  return function () {
    return x;
  };
}
},{}],"../../../node_modules/d3-interpolate/src/color.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hue = hue;
exports.gamma = gamma;
exports.default = nogamma;

var _constant = _interopRequireDefault(require("./constant"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function linear(a, d) {
  return function (t) {
    return a + t * d;
  };
}

function exponential(a, b, y) {
  return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function (t) {
    return Math.pow(a + t * b, y);
  };
}

function hue(a, b) {
  var d = b - a;
  return d ? linear(a, d > 180 || d < -180 ? d - 360 * Math.round(d / 360) : d) : (0, _constant.default)(isNaN(a) ? b : a);
}

function gamma(y) {
  return (y = +y) === 1 ? nogamma : function (a, b) {
    return b - a ? exponential(a, b, y) : (0, _constant.default)(isNaN(a) ? b : a);
  };
}

function nogamma(a, b) {
  var d = b - a;
  return d ? linear(a, d) : (0, _constant.default)(isNaN(a) ? b : a);
}
},{"./constant":"../../../node_modules/d3-interpolate/src/constant.js"}],"../../../node_modules/d3-interpolate/src/rgb.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rgbBasisClosed = exports.rgbBasis = exports.default = void 0;

var _d3Color = require("d3-color");

var _basis = _interopRequireDefault(require("./basis"));

var _basisClosed = _interopRequireDefault(require("./basisClosed"));

var _color = _interopRequireWildcard(require("./color"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function rgbGamma(y) {
  var color = (0, _color.gamma)(y);

  function rgb(start, end) {
    var r = color((start = (0, _d3Color.rgb)(start)).r, (end = (0, _d3Color.rgb)(end)).r),
        g = color(start.g, end.g),
        b = color(start.b, end.b),
        opacity = (0, _color.default)(start.opacity, end.opacity);
    return function (t) {
      start.r = r(t);
      start.g = g(t);
      start.b = b(t);
      start.opacity = opacity(t);
      return start + "";
    };
  }

  rgb.gamma = rgbGamma;
  return rgb;
}(1);

exports.default = _default;

function rgbSpline(spline) {
  return function (colors) {
    var n = colors.length,
        r = new Array(n),
        g = new Array(n),
        b = new Array(n),
        i,
        color;

    for (i = 0; i < n; ++i) {
      color = (0, _d3Color.rgb)(colors[i]);
      r[i] = color.r || 0;
      g[i] = color.g || 0;
      b[i] = color.b || 0;
    }

    r = spline(r);
    g = spline(g);
    b = spline(b);
    color.opacity = 1;
    return function (t) {
      color.r = r(t);
      color.g = g(t);
      color.b = b(t);
      return color + "";
    };
  };
}

var rgbBasis = rgbSpline(_basis.default);
exports.rgbBasis = rgbBasis;
var rgbBasisClosed = rgbSpline(_basisClosed.default);
exports.rgbBasisClosed = rgbBasisClosed;
},{"d3-color":"../../../node_modules/d3-color/src/index.js","./basis":"../../../node_modules/d3-interpolate/src/basis.js","./basisClosed":"../../../node_modules/d3-interpolate/src/basisClosed.js","./color":"../../../node_modules/d3-interpolate/src/color.js"}],"../../../node_modules/d3-interpolate/src/array.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _value = _interopRequireDefault(require("./value"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(a, b) {
  var nb = b ? b.length : 0,
      na = a ? Math.min(nb, a.length) : 0,
      x = new Array(na),
      c = new Array(nb),
      i;

  for (i = 0; i < na; ++i) x[i] = (0, _value.default)(a[i], b[i]);

  for (; i < nb; ++i) c[i] = b[i];

  return function (t) {
    for (i = 0; i < na; ++i) c[i] = x[i](t);

    return c;
  };
}
},{"./value":"../../../node_modules/d3-interpolate/src/value.js"}],"../../../node_modules/d3-interpolate/src/date.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(a, b) {
  var d = new Date();
  return a = +a, b -= a, function (t) {
    return d.setTime(a + b * t), d;
  };
}
},{}],"../../../node_modules/d3-interpolate/src/number.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(a, b) {
  return a = +a, b -= a, function (t) {
    return a + b * t;
  };
}
},{}],"../../../node_modules/d3-interpolate/src/object.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _value = _interopRequireDefault(require("./value"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(a, b) {
  var i = {},
      c = {},
      k;
  if (a === null || typeof a !== "object") a = {};
  if (b === null || typeof b !== "object") b = {};

  for (k in b) {
    if (k in a) {
      i[k] = (0, _value.default)(a[k], b[k]);
    } else {
      c[k] = b[k];
    }
  }

  return function (t) {
    for (k in i) c[k] = i[k](t);

    return c;
  };
}
},{"./value":"../../../node_modules/d3-interpolate/src/value.js"}],"../../../node_modules/d3-interpolate/src/string.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _number = _interopRequireDefault(require("./number"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
    reB = new RegExp(reA.source, "g");

function zero(b) {
  return function () {
    return b;
  };
}

function one(b) {
  return function (t) {
    return b(t) + "";
  };
}

function _default(a, b) {
  var bi = reA.lastIndex = reB.lastIndex = 0,
      // scan index for next number in b
  am,
      // current match in a
  bm,
      // current match in b
  bs,
      // string preceding current number in b, if any
  i = -1,
      // index in s
  s = [],
      // string constants and placeholders
  q = []; // number interpolators
  // Coerce inputs to strings.

  a = a + "", b = b + ""; // Interpolate pairs of numbers in a & b.

  while ((am = reA.exec(a)) && (bm = reB.exec(b))) {
    if ((bs = bm.index) > bi) {
      // a string precedes the next number in b
      bs = b.slice(bi, bs);
      if (s[i]) s[i] += bs; // coalesce with previous string
      else s[++i] = bs;
    }

    if ((am = am[0]) === (bm = bm[0])) {
      // numbers in a & b match
      if (s[i]) s[i] += bm; // coalesce with previous string
      else s[++i] = bm;
    } else {
      // interpolate non-matching numbers
      s[++i] = null;
      q.push({
        i: i,
        x: (0, _number.default)(am, bm)
      });
    }

    bi = reB.lastIndex;
  } // Add remains of b.


  if (bi < b.length) {
    bs = b.slice(bi);
    if (s[i]) s[i] += bs; // coalesce with previous string
    else s[++i] = bs;
  } // Special optimization for only a single match.
  // Otherwise, interpolate each of the numbers and rejoin the string.


  return s.length < 2 ? q[0] ? one(q[0].x) : zero(b) : (b = q.length, function (t) {
    for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);

    return s.join("");
  });
}
},{"./number":"../../../node_modules/d3-interpolate/src/number.js"}],"../../../node_modules/d3-interpolate/src/value.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _d3Color = require("d3-color");

var _rgb = _interopRequireDefault(require("./rgb"));

var _array = _interopRequireDefault(require("./array"));

var _date = _interopRequireDefault(require("./date"));

var _number = _interopRequireDefault(require("./number"));

var _object = _interopRequireDefault(require("./object"));

var _string = _interopRequireDefault(require("./string"));

var _constant = _interopRequireDefault(require("./constant"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(a, b) {
  var t = typeof b,
      c;
  return b == null || t === "boolean" ? (0, _constant.default)(b) : (t === "number" ? _number.default : t === "string" ? (c = (0, _d3Color.color)(b)) ? (b = c, _rgb.default) : _string.default : b instanceof _d3Color.color ? _rgb.default : b instanceof Date ? _date.default : Array.isArray(b) ? _array.default : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? _object.default : _number.default)(a, b);
}
},{"d3-color":"../../../node_modules/d3-color/src/index.js","./rgb":"../../../node_modules/d3-interpolate/src/rgb.js","./array":"../../../node_modules/d3-interpolate/src/array.js","./date":"../../../node_modules/d3-interpolate/src/date.js","./number":"../../../node_modules/d3-interpolate/src/number.js","./object":"../../../node_modules/d3-interpolate/src/object.js","./string":"../../../node_modules/d3-interpolate/src/string.js","./constant":"../../../node_modules/d3-interpolate/src/constant.js"}],"../../../node_modules/d3-interpolate/src/discrete.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(range) {
  var n = range.length;
  return function (t) {
    return range[Math.max(0, Math.min(n - 1, Math.floor(t * n)))];
  };
}
},{}],"../../../node_modules/d3-interpolate/src/hue.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _color = require("./color");

function _default(a, b) {
  var i = (0, _color.hue)(+a, +b);
  return function (t) {
    var x = i(t);
    return x - 360 * Math.floor(x / 360);
  };
}
},{"./color":"../../../node_modules/d3-interpolate/src/color.js"}],"../../../node_modules/d3-interpolate/src/round.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(a, b) {
  return a = +a, b -= a, function (t) {
    return Math.round(a + b * t);
  };
}
},{}],"../../../node_modules/d3-interpolate/src/transform/decompose.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.identity = void 0;
var degrees = 180 / Math.PI;
var identity = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
exports.identity = identity;

function _default(a, b, c, d, e, f) {
  var scaleX, scaleY, skewX;
  if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
  if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
  if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
  if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
  return {
    translateX: e,
    translateY: f,
    rotate: Math.atan2(b, a) * degrees,
    skewX: Math.atan(skewX) * degrees,
    scaleX: scaleX,
    scaleY: scaleY
  };
}
},{}],"../../../node_modules/d3-interpolate/src/transform/parse.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseCss = parseCss;
exports.parseSvg = parseSvg;

var _decompose = _interopRequireWildcard(require("./decompose"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var cssNode, cssRoot, cssView, svgNode;

function parseCss(value) {
  if (value === "none") return _decompose.identity;
  if (!cssNode) cssNode = document.createElement("DIV"), cssRoot = document.documentElement, cssView = document.defaultView;
  cssNode.style.transform = value;
  value = cssView.getComputedStyle(cssRoot.appendChild(cssNode), null).getPropertyValue("transform");
  cssRoot.removeChild(cssNode);
  value = value.slice(7, -1).split(",");
  return (0, _decompose.default)(+value[0], +value[1], +value[2], +value[3], +value[4], +value[5]);
}

function parseSvg(value) {
  if (value == null) return _decompose.identity;
  if (!svgNode) svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svgNode.setAttribute("transform", value);
  if (!(value = svgNode.transform.baseVal.consolidate())) return _decompose.identity;
  value = value.matrix;
  return (0, _decompose.default)(value.a, value.b, value.c, value.d, value.e, value.f);
}
},{"./decompose":"../../../node_modules/d3-interpolate/src/transform/decompose.js"}],"../../../node_modules/d3-interpolate/src/transform/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.interpolateTransformSvg = exports.interpolateTransformCss = void 0;

var _number = _interopRequireDefault(require("../number"));

var _parse = require("./parse");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function interpolateTransform(parse, pxComma, pxParen, degParen) {
  function pop(s) {
    return s.length ? s.pop() + " " : "";
  }

  function translate(xa, ya, xb, yb, s, q) {
    if (xa !== xb || ya !== yb) {
      var i = s.push("translate(", null, pxComma, null, pxParen);
      q.push({
        i: i - 4,
        x: (0, _number.default)(xa, xb)
      }, {
        i: i - 2,
        x: (0, _number.default)(ya, yb)
      });
    } else if (xb || yb) {
      s.push("translate(" + xb + pxComma + yb + pxParen);
    }
  }

  function rotate(a, b, s, q) {
    if (a !== b) {
      if (a - b > 180) b += 360;else if (b - a > 180) a += 360; // shortest path

      q.push({
        i: s.push(pop(s) + "rotate(", null, degParen) - 2,
        x: (0, _number.default)(a, b)
      });
    } else if (b) {
      s.push(pop(s) + "rotate(" + b + degParen);
    }
  }

  function skewX(a, b, s, q) {
    if (a !== b) {
      q.push({
        i: s.push(pop(s) + "skewX(", null, degParen) - 2,
        x: (0, _number.default)(a, b)
      });
    } else if (b) {
      s.push(pop(s) + "skewX(" + b + degParen);
    }
  }

  function scale(xa, ya, xb, yb, s, q) {
    if (xa !== xb || ya !== yb) {
      var i = s.push(pop(s) + "scale(", null, ",", null, ")");
      q.push({
        i: i - 4,
        x: (0, _number.default)(xa, xb)
      }, {
        i: i - 2,
        x: (0, _number.default)(ya, yb)
      });
    } else if (xb !== 1 || yb !== 1) {
      s.push(pop(s) + "scale(" + xb + "," + yb + ")");
    }
  }

  return function (a, b) {
    var s = [],
        // string constants and placeholders
    q = []; // number interpolators

    a = parse(a), b = parse(b);
    translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q);
    rotate(a.rotate, b.rotate, s, q);
    skewX(a.skewX, b.skewX, s, q);
    scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q);
    a = b = null; // gc

    return function (t) {
      var i = -1,
          n = q.length,
          o;

      while (++i < n) s[(o = q[i]).i] = o.x(t);

      return s.join("");
    };
  };
}

var interpolateTransformCss = interpolateTransform(_parse.parseCss, "px, ", "px)", "deg)");
exports.interpolateTransformCss = interpolateTransformCss;
var interpolateTransformSvg = interpolateTransform(_parse.parseSvg, ", ", ")", ")");
exports.interpolateTransformSvg = interpolateTransformSvg;
},{"../number":"../../../node_modules/d3-interpolate/src/number.js","./parse":"../../../node_modules/d3-interpolate/src/transform/parse.js"}],"../../../node_modules/d3-interpolate/src/zoom.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var rho = Math.SQRT2,
    rho2 = 2,
    rho4 = 4,
    epsilon2 = 1e-12;

function cosh(x) {
  return ((x = Math.exp(x)) + 1 / x) / 2;
}

function sinh(x) {
  return ((x = Math.exp(x)) - 1 / x) / 2;
}

function tanh(x) {
  return ((x = Math.exp(2 * x)) - 1) / (x + 1);
} // p0 = [ux0, uy0, w0]
// p1 = [ux1, uy1, w1]


function _default(p0, p1) {
  var ux0 = p0[0],
      uy0 = p0[1],
      w0 = p0[2],
      ux1 = p1[0],
      uy1 = p1[1],
      w1 = p1[2],
      dx = ux1 - ux0,
      dy = uy1 - uy0,
      d2 = dx * dx + dy * dy,
      i,
      S; // Special case for u0 ≅ u1.

  if (d2 < epsilon2) {
    S = Math.log(w1 / w0) / rho;

    i = function (t) {
      return [ux0 + t * dx, uy0 + t * dy, w0 * Math.exp(rho * t * S)];
    };
  } // General case.
  else {
      var d1 = Math.sqrt(d2),
          b0 = (w1 * w1 - w0 * w0 + rho4 * d2) / (2 * w0 * rho2 * d1),
          b1 = (w1 * w1 - w0 * w0 - rho4 * d2) / (2 * w1 * rho2 * d1),
          r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0),
          r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
      S = (r1 - r0) / rho;

      i = function (t) {
        var s = t * S,
            coshr0 = cosh(r0),
            u = w0 / (rho2 * d1) * (coshr0 * tanh(rho * s + r0) - sinh(r0));
        return [ux0 + u * dx, uy0 + u * dy, w0 * coshr0 / cosh(rho * s + r0)];
      };
    }

  i.duration = S * 1000;
  return i;
}
},{}],"../../../node_modules/d3-interpolate/src/hsl.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hslLong = exports.default = void 0;

var _d3Color = require("d3-color");

var _color = _interopRequireWildcard(require("./color"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function hsl(hue) {
  return function (start, end) {
    var h = hue((start = (0, _d3Color.hsl)(start)).h, (end = (0, _d3Color.hsl)(end)).h),
        s = (0, _color.default)(start.s, end.s),
        l = (0, _color.default)(start.l, end.l),
        opacity = (0, _color.default)(start.opacity, end.opacity);
    return function (t) {
      start.h = h(t);
      start.s = s(t);
      start.l = l(t);
      start.opacity = opacity(t);
      return start + "";
    };
  };
}

var _default = hsl(_color.hue);

exports.default = _default;
var hslLong = hsl(_color.default);
exports.hslLong = hslLong;
},{"d3-color":"../../../node_modules/d3-color/src/index.js","./color":"../../../node_modules/d3-interpolate/src/color.js"}],"../../../node_modules/d3-interpolate/src/lab.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = lab;

var _d3Color = require("d3-color");

var _color = _interopRequireDefault(require("./color"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function lab(start, end) {
  var l = (0, _color.default)((start = (0, _d3Color.lab)(start)).l, (end = (0, _d3Color.lab)(end)).l),
      a = (0, _color.default)(start.a, end.a),
      b = (0, _color.default)(start.b, end.b),
      opacity = (0, _color.default)(start.opacity, end.opacity);
  return function (t) {
    start.l = l(t);
    start.a = a(t);
    start.b = b(t);
    start.opacity = opacity(t);
    return start + "";
  };
}
},{"d3-color":"../../../node_modules/d3-color/src/index.js","./color":"../../../node_modules/d3-interpolate/src/color.js"}],"../../../node_modules/d3-interpolate/src/hcl.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hclLong = exports.default = void 0;

var _d3Color = require("d3-color");

var _color = _interopRequireWildcard(require("./color"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function hcl(hue) {
  return function (start, end) {
    var h = hue((start = (0, _d3Color.hcl)(start)).h, (end = (0, _d3Color.hcl)(end)).h),
        c = (0, _color.default)(start.c, end.c),
        l = (0, _color.default)(start.l, end.l),
        opacity = (0, _color.default)(start.opacity, end.opacity);
    return function (t) {
      start.h = h(t);
      start.c = c(t);
      start.l = l(t);
      start.opacity = opacity(t);
      return start + "";
    };
  };
}

var _default = hcl(_color.hue);

exports.default = _default;
var hclLong = hcl(_color.default);
exports.hclLong = hclLong;
},{"d3-color":"../../../node_modules/d3-color/src/index.js","./color":"../../../node_modules/d3-interpolate/src/color.js"}],"../../../node_modules/d3-interpolate/src/cubehelix.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cubehelixLong = exports.default = void 0;

var _d3Color = require("d3-color");

var _color = _interopRequireWildcard(require("./color"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function cubehelix(hue) {
  return function cubehelixGamma(y) {
    y = +y;

    function cubehelix(start, end) {
      var h = hue((start = (0, _d3Color.cubehelix)(start)).h, (end = (0, _d3Color.cubehelix)(end)).h),
          s = (0, _color.default)(start.s, end.s),
          l = (0, _color.default)(start.l, end.l),
          opacity = (0, _color.default)(start.opacity, end.opacity);
      return function (t) {
        start.h = h(t);
        start.s = s(t);
        start.l = l(Math.pow(t, y));
        start.opacity = opacity(t);
        return start + "";
      };
    }

    cubehelix.gamma = cubehelixGamma;
    return cubehelix;
  }(1);
}

var _default = cubehelix(_color.hue);

exports.default = _default;
var cubehelixLong = cubehelix(_color.default);
exports.cubehelixLong = cubehelixLong;
},{"d3-color":"../../../node_modules/d3-color/src/index.js","./color":"../../../node_modules/d3-interpolate/src/color.js"}],"../../../node_modules/d3-interpolate/src/piecewise.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = piecewise;

function piecewise(interpolate, values) {
  var i = 0,
      n = values.length - 1,
      v = values[0],
      I = new Array(n < 0 ? 0 : n);

  while (i < n) I[i] = interpolate(v, v = values[++i]);

  return function (t) {
    var i = Math.max(0, Math.min(n - 1, Math.floor(t *= n)));
    return I[i](t - i);
  };
}
},{}],"../../../node_modules/d3-interpolate/src/quantize.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(interpolator, n) {
  var samples = new Array(n);

  for (var i = 0; i < n; ++i) samples[i] = interpolator(i / (n - 1));

  return samples;
}
},{}],"../../../node_modules/d3-interpolate/src/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "interpolate", {
  enumerable: true,
  get: function () {
    return _value.default;
  }
});
Object.defineProperty(exports, "interpolateArray", {
  enumerable: true,
  get: function () {
    return _array.default;
  }
});
Object.defineProperty(exports, "interpolateBasis", {
  enumerable: true,
  get: function () {
    return _basis.default;
  }
});
Object.defineProperty(exports, "interpolateBasisClosed", {
  enumerable: true,
  get: function () {
    return _basisClosed.default;
  }
});
Object.defineProperty(exports, "interpolateDate", {
  enumerable: true,
  get: function () {
    return _date.default;
  }
});
Object.defineProperty(exports, "interpolateDiscrete", {
  enumerable: true,
  get: function () {
    return _discrete.default;
  }
});
Object.defineProperty(exports, "interpolateHue", {
  enumerable: true,
  get: function () {
    return _hue.default;
  }
});
Object.defineProperty(exports, "interpolateNumber", {
  enumerable: true,
  get: function () {
    return _number.default;
  }
});
Object.defineProperty(exports, "interpolateObject", {
  enumerable: true,
  get: function () {
    return _object.default;
  }
});
Object.defineProperty(exports, "interpolateRound", {
  enumerable: true,
  get: function () {
    return _round.default;
  }
});
Object.defineProperty(exports, "interpolateString", {
  enumerable: true,
  get: function () {
    return _string.default;
  }
});
Object.defineProperty(exports, "interpolateTransformCss", {
  enumerable: true,
  get: function () {
    return _index.interpolateTransformCss;
  }
});
Object.defineProperty(exports, "interpolateTransformSvg", {
  enumerable: true,
  get: function () {
    return _index.interpolateTransformSvg;
  }
});
Object.defineProperty(exports, "interpolateZoom", {
  enumerable: true,
  get: function () {
    return _zoom.default;
  }
});
Object.defineProperty(exports, "interpolateRgb", {
  enumerable: true,
  get: function () {
    return _rgb.default;
  }
});
Object.defineProperty(exports, "interpolateRgbBasis", {
  enumerable: true,
  get: function () {
    return _rgb.rgbBasis;
  }
});
Object.defineProperty(exports, "interpolateRgbBasisClosed", {
  enumerable: true,
  get: function () {
    return _rgb.rgbBasisClosed;
  }
});
Object.defineProperty(exports, "interpolateHsl", {
  enumerable: true,
  get: function () {
    return _hsl.default;
  }
});
Object.defineProperty(exports, "interpolateHslLong", {
  enumerable: true,
  get: function () {
    return _hsl.hslLong;
  }
});
Object.defineProperty(exports, "interpolateLab", {
  enumerable: true,
  get: function () {
    return _lab.default;
  }
});
Object.defineProperty(exports, "interpolateHcl", {
  enumerable: true,
  get: function () {
    return _hcl.default;
  }
});
Object.defineProperty(exports, "interpolateHclLong", {
  enumerable: true,
  get: function () {
    return _hcl.hclLong;
  }
});
Object.defineProperty(exports, "interpolateCubehelix", {
  enumerable: true,
  get: function () {
    return _cubehelix.default;
  }
});
Object.defineProperty(exports, "interpolateCubehelixLong", {
  enumerable: true,
  get: function () {
    return _cubehelix.cubehelixLong;
  }
});
Object.defineProperty(exports, "piecewise", {
  enumerable: true,
  get: function () {
    return _piecewise.default;
  }
});
Object.defineProperty(exports, "quantize", {
  enumerable: true,
  get: function () {
    return _quantize.default;
  }
});

var _value = _interopRequireDefault(require("./value"));

var _array = _interopRequireDefault(require("./array"));

var _basis = _interopRequireDefault(require("./basis"));

var _basisClosed = _interopRequireDefault(require("./basisClosed"));

var _date = _interopRequireDefault(require("./date"));

var _discrete = _interopRequireDefault(require("./discrete"));

var _hue = _interopRequireDefault(require("./hue"));

var _number = _interopRequireDefault(require("./number"));

var _object = _interopRequireDefault(require("./object"));

var _round = _interopRequireDefault(require("./round"));

var _string = _interopRequireDefault(require("./string"));

var _index = require("./transform/index");

var _zoom = _interopRequireDefault(require("./zoom"));

var _rgb = _interopRequireWildcard(require("./rgb"));

var _hsl = _interopRequireWildcard(require("./hsl"));

var _lab = _interopRequireDefault(require("./lab"));

var _hcl = _interopRequireWildcard(require("./hcl"));

var _cubehelix = _interopRequireWildcard(require("./cubehelix"));

var _piecewise = _interopRequireDefault(require("./piecewise"));

var _quantize = _interopRequireDefault(require("./quantize"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./value":"../../../node_modules/d3-interpolate/src/value.js","./array":"../../../node_modules/d3-interpolate/src/array.js","./basis":"../../../node_modules/d3-interpolate/src/basis.js","./basisClosed":"../../../node_modules/d3-interpolate/src/basisClosed.js","./date":"../../../node_modules/d3-interpolate/src/date.js","./discrete":"../../../node_modules/d3-interpolate/src/discrete.js","./hue":"../../../node_modules/d3-interpolate/src/hue.js","./number":"../../../node_modules/d3-interpolate/src/number.js","./object":"../../../node_modules/d3-interpolate/src/object.js","./round":"../../../node_modules/d3-interpolate/src/round.js","./string":"../../../node_modules/d3-interpolate/src/string.js","./transform/index":"../../../node_modules/d3-interpolate/src/transform/index.js","./zoom":"../../../node_modules/d3-interpolate/src/zoom.js","./rgb":"../../../node_modules/d3-interpolate/src/rgb.js","./hsl":"../../../node_modules/d3-interpolate/src/hsl.js","./lab":"../../../node_modules/d3-interpolate/src/lab.js","./hcl":"../../../node_modules/d3-interpolate/src/hcl.js","./cubehelix":"../../../node_modules/d3-interpolate/src/cubehelix.js","./piecewise":"../../../node_modules/d3-interpolate/src/piecewise.js","./quantize":"../../../node_modules/d3-interpolate/src/quantize.js"}],"../../../node_modules/d3-timer/src/timer.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.now = now;
exports.Timer = Timer;
exports.timer = timer;
exports.timerFlush = timerFlush;
var frame = 0,
    // is an animation frame pending?
timeout = 0,
    // is a timeout pending?
interval = 0,
    // are any timers active?
pokeDelay = 1000,
    // how frequently we check for clock skew
taskHead,
    taskTail,
    clockLast = 0,
    clockNow = 0,
    clockSkew = 0,
    clock = typeof performance === "object" && performance.now ? performance : Date,
    setFrame = typeof window === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function (f) {
  setTimeout(f, 17);
};

function now() {
  return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
}

function clearNow() {
  clockNow = 0;
}

function Timer() {
  this._call = this._time = this._next = null;
}

Timer.prototype = timer.prototype = {
  constructor: Timer,
  restart: function (callback, delay, time) {
    if (typeof callback !== "function") throw new TypeError("callback is not a function");
    time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);

    if (!this._next && taskTail !== this) {
      if (taskTail) taskTail._next = this;else taskHead = this;
      taskTail = this;
    }

    this._call = callback;
    this._time = time;
    sleep();
  },
  stop: function () {
    if (this._call) {
      this._call = null;
      this._time = Infinity;
      sleep();
    }
  }
};

function timer(callback, delay, time) {
  var t = new Timer();
  t.restart(callback, delay, time);
  return t;
}

function timerFlush() {
  now(); // Get the current time, if not already set.

  ++frame; // Pretend we’ve set an alarm, if we haven’t already.

  var t = taskHead,
      e;

  while (t) {
    if ((e = clockNow - t._time) >= 0) t._call.call(null, e);
    t = t._next;
  }

  --frame;
}

function wake() {
  clockNow = (clockLast = clock.now()) + clockSkew;
  frame = timeout = 0;

  try {
    timerFlush();
  } finally {
    frame = 0;
    nap();
    clockNow = 0;
  }
}

function poke() {
  var now = clock.now(),
      delay = now - clockLast;
  if (delay > pokeDelay) clockSkew -= delay, clockLast = now;
}

function nap() {
  var t0,
      t1 = taskHead,
      t2,
      time = Infinity;

  while (t1) {
    if (t1._call) {
      if (time > t1._time) time = t1._time;
      t0 = t1, t1 = t1._next;
    } else {
      t2 = t1._next, t1._next = null;
      t1 = t0 ? t0._next = t2 : taskHead = t2;
    }
  }

  taskTail = t0;
  sleep(time);
}

function sleep(time) {
  if (frame) return; // Soonest alarm already set, or will be.

  if (timeout) timeout = clearTimeout(timeout);
  var delay = time - clockNow; // Strictly less than if we recomputed clockNow.

  if (delay > 24) {
    if (time < Infinity) timeout = setTimeout(wake, time - clock.now() - clockSkew);
    if (interval) interval = clearInterval(interval);
  } else {
    if (!interval) clockLast = clock.now(), interval = setInterval(poke, pokeDelay);
    frame = 1, setFrame(wake);
  }
}
},{}],"../../../node_modules/d3-timer/src/timeout.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _timer = require("./timer");

function _default(callback, delay, time) {
  var t = new _timer.Timer();
  delay = delay == null ? 0 : +delay;
  t.restart(function (elapsed) {
    t.stop();
    callback(elapsed + delay);
  }, delay, time);
  return t;
}
},{"./timer":"../../../node_modules/d3-timer/src/timer.js"}],"../../../node_modules/d3-timer/src/interval.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _timer = require("./timer");

function _default(callback, delay, time) {
  var t = new _timer.Timer(),
      total = delay;
  if (delay == null) return t.restart(callback, delay, time), t;
  delay = +delay, time = time == null ? (0, _timer.now)() : +time;
  t.restart(function tick(elapsed) {
    elapsed += total;
    t.restart(tick, total += delay, time);
    callback(elapsed);
  }, delay, time);
  return t;
}
},{"./timer":"../../../node_modules/d3-timer/src/timer.js"}],"../../../node_modules/d3-timer/src/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "now", {
  enumerable: true,
  get: function () {
    return _timer.now;
  }
});
Object.defineProperty(exports, "timer", {
  enumerable: true,
  get: function () {
    return _timer.timer;
  }
});
Object.defineProperty(exports, "timerFlush", {
  enumerable: true,
  get: function () {
    return _timer.timerFlush;
  }
});
Object.defineProperty(exports, "timeout", {
  enumerable: true,
  get: function () {
    return _timeout.default;
  }
});
Object.defineProperty(exports, "interval", {
  enumerable: true,
  get: function () {
    return _interval.default;
  }
});

var _timer = require("./timer");

var _timeout = _interopRequireDefault(require("./timeout"));

var _interval = _interopRequireDefault(require("./interval"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./timer":"../../../node_modules/d3-timer/src/timer.js","./timeout":"../../../node_modules/d3-timer/src/timeout.js","./interval":"../../../node_modules/d3-timer/src/interval.js"}],"../../../node_modules/d3-transition/src/transition/schedule.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.init = init;
exports.set = set;
exports.get = get;
exports.ENDED = exports.ENDING = exports.RUNNING = exports.STARTED = exports.STARTING = exports.SCHEDULED = exports.CREATED = void 0;

var _d3Dispatch = require("d3-dispatch");

var _d3Timer = require("d3-timer");

var emptyOn = (0, _d3Dispatch.dispatch)("start", "end", "cancel", "interrupt");
var emptyTween = [];
var CREATED = 0;
exports.CREATED = CREATED;
var SCHEDULED = 1;
exports.SCHEDULED = SCHEDULED;
var STARTING = 2;
exports.STARTING = STARTING;
var STARTED = 3;
exports.STARTED = STARTED;
var RUNNING = 4;
exports.RUNNING = RUNNING;
var ENDING = 5;
exports.ENDING = ENDING;
var ENDED = 6;
exports.ENDED = ENDED;

function _default(node, name, id, index, group, timing) {
  var schedules = node.__transition;
  if (!schedules) node.__transition = {};else if (id in schedules) return;
  create(node, id, {
    name: name,
    index: index,
    // For context during callback.
    group: group,
    // For context during callback.
    on: emptyOn,
    tween: emptyTween,
    time: timing.time,
    delay: timing.delay,
    duration: timing.duration,
    ease: timing.ease,
    timer: null,
    state: CREATED
  });
}

function init(node, id) {
  var schedule = get(node, id);
  if (schedule.state > CREATED) throw new Error("too late; already scheduled");
  return schedule;
}

function set(node, id) {
  var schedule = get(node, id);
  if (schedule.state > STARTED) throw new Error("too late; already running");
  return schedule;
}

function get(node, id) {
  var schedule = node.__transition;
  if (!schedule || !(schedule = schedule[id])) throw new Error("transition not found");
  return schedule;
}

function create(node, id, self) {
  var schedules = node.__transition,
      tween; // Initialize the self timer when the transition is created.
  // Note the actual delay is not known until the first callback!

  schedules[id] = self;
  self.timer = (0, _d3Timer.timer)(schedule, 0, self.time);

  function schedule(elapsed) {
    self.state = SCHEDULED;
    self.timer.restart(start, self.delay, self.time); // If the elapsed delay is less than our first sleep, start immediately.

    if (self.delay <= elapsed) start(elapsed - self.delay);
  }

  function start(elapsed) {
    var i, j, n, o; // If the state is not SCHEDULED, then we previously errored on start.

    if (self.state !== SCHEDULED) return stop();

    for (i in schedules) {
      o = schedules[i];
      if (o.name !== self.name) continue; // While this element already has a starting transition during this frame,
      // defer starting an interrupting transition until that transition has a
      // chance to tick (and possibly end); see d3/d3-transition#54!

      if (o.state === STARTED) return (0, _d3Timer.timeout)(start); // Interrupt the active transition, if any.

      if (o.state === RUNNING) {
        o.state = ENDED;
        o.timer.stop();
        o.on.call("interrupt", node, node.__data__, o.index, o.group);
        delete schedules[i];
      } // Cancel any pre-empted transitions.
      else if (+i < id) {
          o.state = ENDED;
          o.timer.stop();
          o.on.call("cancel", node, node.__data__, o.index, o.group);
          delete schedules[i];
        }
    } // Defer the first tick to end of the current frame; see d3/d3#1576.
    // Note the transition may be canceled after start and before the first tick!
    // Note this must be scheduled before the start event; see d3/d3-transition#16!
    // Assuming this is successful, subsequent callbacks go straight to tick.


    (0, _d3Timer.timeout)(function () {
      if (self.state === STARTED) {
        self.state = RUNNING;
        self.timer.restart(tick, self.delay, self.time);
        tick(elapsed);
      }
    }); // Dispatch the start event.
    // Note this must be done before the tween are initialized.

    self.state = STARTING;
    self.on.call("start", node, node.__data__, self.index, self.group);
    if (self.state !== STARTING) return; // interrupted

    self.state = STARTED; // Initialize the tween, deleting null tween.

    tween = new Array(n = self.tween.length);

    for (i = 0, j = -1; i < n; ++i) {
      if (o = self.tween[i].value.call(node, node.__data__, self.index, self.group)) {
        tween[++j] = o;
      }
    }

    tween.length = j + 1;
  }

  function tick(elapsed) {
    var t = elapsed < self.duration ? self.ease.call(null, elapsed / self.duration) : (self.timer.restart(stop), self.state = ENDING, 1),
        i = -1,
        n = tween.length;

    while (++i < n) {
      tween[i].call(node, t);
    } // Dispatch the end event.


    if (self.state === ENDING) {
      self.on.call("end", node, node.__data__, self.index, self.group);
      stop();
    }
  }

  function stop() {
    self.state = ENDED;
    self.timer.stop();
    delete schedules[id];

    for (var i in schedules) return; // eslint-disable-line no-unused-vars


    delete node.__transition;
  }
}
},{"d3-dispatch":"../../../node_modules/d3-dispatch/src/index.js","d3-timer":"../../../node_modules/d3-timer/src/index.js"}],"../../../node_modules/d3-transition/src/interrupt.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _schedule = require("./transition/schedule");

function _default(node, name) {
  var schedules = node.__transition,
      schedule,
      active,
      empty = true,
      i;
  if (!schedules) return;
  name = name == null ? null : name + "";

  for (i in schedules) {
    if ((schedule = schedules[i]).name !== name) {
      empty = false;
      continue;
    }

    active = schedule.state > _schedule.STARTING && schedule.state < _schedule.ENDING;
    schedule.state = _schedule.ENDED;
    schedule.timer.stop();
    schedule.on.call(active ? "interrupt" : "cancel", node, node.__data__, schedule.index, schedule.group);
    delete schedules[i];
  }

  if (empty) delete node.__transition;
}
},{"./transition/schedule":"../../../node_modules/d3-transition/src/transition/schedule.js"}],"../../../node_modules/d3-transition/src/selection/interrupt.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _interrupt = _interopRequireDefault(require("../interrupt"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(name) {
  return this.each(function () {
    (0, _interrupt.default)(this, name);
  });
}
},{"../interrupt":"../../../node_modules/d3-transition/src/interrupt.js"}],"../../../node_modules/d3-transition/src/transition/tween.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.tweenValue = tweenValue;

var _schedule = require("./schedule");

function tweenRemove(id, name) {
  var tween0, tween1;
  return function () {
    var schedule = (0, _schedule.set)(this, id),
        tween = schedule.tween; // If this node shared tween with the previous node,
    // just assign the updated shared tween and we’re done!
    // Otherwise, copy-on-write.

    if (tween !== tween0) {
      tween1 = tween0 = tween;

      for (var i = 0, n = tween1.length; i < n; ++i) {
        if (tween1[i].name === name) {
          tween1 = tween1.slice();
          tween1.splice(i, 1);
          break;
        }
      }
    }

    schedule.tween = tween1;
  };
}

function tweenFunction(id, name, value) {
  var tween0, tween1;
  if (typeof value !== "function") throw new Error();
  return function () {
    var schedule = (0, _schedule.set)(this, id),
        tween = schedule.tween; // If this node shared tween with the previous node,
    // just assign the updated shared tween and we’re done!
    // Otherwise, copy-on-write.

    if (tween !== tween0) {
      tween1 = (tween0 = tween).slice();

      for (var t = {
        name: name,
        value: value
      }, i = 0, n = tween1.length; i < n; ++i) {
        if (tween1[i].name === name) {
          tween1[i] = t;
          break;
        }
      }

      if (i === n) tween1.push(t);
    }

    schedule.tween = tween1;
  };
}

function _default(name, value) {
  var id = this._id;
  name += "";

  if (arguments.length < 2) {
    var tween = (0, _schedule.get)(this.node(), id).tween;

    for (var i = 0, n = tween.length, t; i < n; ++i) {
      if ((t = tween[i]).name === name) {
        return t.value;
      }
    }

    return null;
  }

  return this.each((value == null ? tweenRemove : tweenFunction)(id, name, value));
}

function tweenValue(transition, name, value) {
  var id = transition._id;
  transition.each(function () {
    var schedule = (0, _schedule.set)(this, id);
    (schedule.value || (schedule.value = {}))[name] = value.apply(this, arguments);
  });
  return function (node) {
    return (0, _schedule.get)(node, id).value[name];
  };
}
},{"./schedule":"../../../node_modules/d3-transition/src/transition/schedule.js"}],"../../../node_modules/d3-transition/src/transition/interpolate.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _d3Color = require("d3-color");

var _d3Interpolate = require("d3-interpolate");

function _default(a, b) {
  var c;
  return (typeof b === "number" ? _d3Interpolate.interpolateNumber : b instanceof _d3Color.color ? _d3Interpolate.interpolateRgb : (c = (0, _d3Color.color)(b)) ? (b = c, _d3Interpolate.interpolateRgb) : _d3Interpolate.interpolateString)(a, b);
}
},{"d3-color":"../../../node_modules/d3-color/src/index.js","d3-interpolate":"../../../node_modules/d3-interpolate/src/index.js"}],"../../../node_modules/d3-transition/src/transition/attr.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _d3Interpolate = require("d3-interpolate");

var _d3Selection = require("d3-selection");

var _tween = require("./tween");

var _interpolate = _interopRequireDefault(require("./interpolate"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function attrRemove(name) {
  return function () {
    this.removeAttribute(name);
  };
}

function attrRemoveNS(fullname) {
  return function () {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}

function attrConstant(name, interpolate, value1) {
  var string00,
      string1 = value1 + "",
      interpolate0;
  return function () {
    var string0 = this.getAttribute(name);
    return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
  };
}

function attrConstantNS(fullname, interpolate, value1) {
  var string00,
      string1 = value1 + "",
      interpolate0;
  return function () {
    var string0 = this.getAttributeNS(fullname.space, fullname.local);
    return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
  };
}

function attrFunction(name, interpolate, value) {
  var string00, string10, interpolate0;
  return function () {
    var string0,
        value1 = value(this),
        string1;
    if (value1 == null) return void this.removeAttribute(name);
    string0 = this.getAttribute(name);
    string1 = value1 + "";
    return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
  };
}

function attrFunctionNS(fullname, interpolate, value) {
  var string00, string10, interpolate0;
  return function () {
    var string0,
        value1 = value(this),
        string1;
    if (value1 == null) return void this.removeAttributeNS(fullname.space, fullname.local);
    string0 = this.getAttributeNS(fullname.space, fullname.local);
    string1 = value1 + "";
    return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
  };
}

function _default(name, value) {
  var fullname = (0, _d3Selection.namespace)(name),
      i = fullname === "transform" ? _d3Interpolate.interpolateTransformSvg : _interpolate.default;
  return this.attrTween(name, typeof value === "function" ? (fullname.local ? attrFunctionNS : attrFunction)(fullname, i, (0, _tween.tweenValue)(this, "attr." + name, value)) : value == null ? (fullname.local ? attrRemoveNS : attrRemove)(fullname) : (fullname.local ? attrConstantNS : attrConstant)(fullname, i, value));
}
},{"d3-interpolate":"../../../node_modules/d3-interpolate/src/index.js","d3-selection":"../../../node_modules/d3-selection/src/index.js","./tween":"../../../node_modules/d3-transition/src/transition/tween.js","./interpolate":"../../../node_modules/d3-transition/src/transition/interpolate.js"}],"../../../node_modules/d3-transition/src/transition/attrTween.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _d3Selection = require("d3-selection");

function attrInterpolate(name, i) {
  return function (t) {
    this.setAttribute(name, i(t));
  };
}

function attrInterpolateNS(fullname, i) {
  return function (t) {
    this.setAttributeNS(fullname.space, fullname.local, i(t));
  };
}

function attrTweenNS(fullname, value) {
  var t0, i0;

  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t0 = (i0 = i) && attrInterpolateNS(fullname, i);
    return t0;
  }

  tween._value = value;
  return tween;
}

function attrTween(name, value) {
  var t0, i0;

  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t0 = (i0 = i) && attrInterpolate(name, i);
    return t0;
  }

  tween._value = value;
  return tween;
}

function _default(name, value) {
  var key = "attr." + name;
  if (arguments.length < 2) return (key = this.tween(key)) && key._value;
  if (value == null) return this.tween(key, null);
  if (typeof value !== "function") throw new Error();
  var fullname = (0, _d3Selection.namespace)(name);
  return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value));
}
},{"d3-selection":"../../../node_modules/d3-selection/src/index.js"}],"../../../node_modules/d3-transition/src/transition/delay.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _schedule = require("./schedule");

function delayFunction(id, value) {
  return function () {
    (0, _schedule.init)(this, id).delay = +value.apply(this, arguments);
  };
}

function delayConstant(id, value) {
  return value = +value, function () {
    (0, _schedule.init)(this, id).delay = value;
  };
}

function _default(value) {
  var id = this._id;
  return arguments.length ? this.each((typeof value === "function" ? delayFunction : delayConstant)(id, value)) : (0, _schedule.get)(this.node(), id).delay;
}
},{"./schedule":"../../../node_modules/d3-transition/src/transition/schedule.js"}],"../../../node_modules/d3-transition/src/transition/duration.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _schedule = require("./schedule");

function durationFunction(id, value) {
  return function () {
    (0, _schedule.set)(this, id).duration = +value.apply(this, arguments);
  };
}

function durationConstant(id, value) {
  return value = +value, function () {
    (0, _schedule.set)(this, id).duration = value;
  };
}

function _default(value) {
  var id = this._id;
  return arguments.length ? this.each((typeof value === "function" ? durationFunction : durationConstant)(id, value)) : (0, _schedule.get)(this.node(), id).duration;
}
},{"./schedule":"../../../node_modules/d3-transition/src/transition/schedule.js"}],"../../../node_modules/d3-transition/src/transition/ease.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _schedule = require("./schedule");

function easeConstant(id, value) {
  if (typeof value !== "function") throw new Error();
  return function () {
    (0, _schedule.set)(this, id).ease = value;
  };
}

function _default(value) {
  var id = this._id;
  return arguments.length ? this.each(easeConstant(id, value)) : (0, _schedule.get)(this.node(), id).ease;
}
},{"./schedule":"../../../node_modules/d3-transition/src/transition/schedule.js"}],"../../../node_modules/d3-transition/src/transition/filter.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _d3Selection = require("d3-selection");

var _index = require("./index");

function _default(match) {
  if (typeof match !== "function") match = (0, _d3Selection.matcher)(match);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }

  return new _index.Transition(subgroups, this._parents, this._name, this._id);
}
},{"d3-selection":"../../../node_modules/d3-selection/src/index.js","./index":"../../../node_modules/d3-transition/src/transition/index.js"}],"../../../node_modules/d3-transition/src/transition/merge.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _index = require("./index");

function _default(transition) {
  if (transition._id !== this._id) throw new Error();

  for (var groups0 = this._groups, groups1 = transition._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }

  for (; j < m0; ++j) {
    merges[j] = groups0[j];
  }

  return new _index.Transition(merges, this._parents, this._name, this._id);
}
},{"./index":"../../../node_modules/d3-transition/src/transition/index.js"}],"../../../node_modules/d3-transition/src/transition/on.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _schedule = require("./schedule");

function start(name) {
  return (name + "").trim().split(/^|\s+/).every(function (t) {
    var i = t.indexOf(".");
    if (i >= 0) t = t.slice(0, i);
    return !t || t === "start";
  });
}

function onFunction(id, name, listener) {
  var on0,
      on1,
      sit = start(name) ? _schedule.init : _schedule.set;
  return function () {
    var schedule = sit(this, id),
        on = schedule.on; // If this node shared a dispatch with the previous node,
    // just assign the updated shared dispatch and we’re done!
    // Otherwise, copy-on-write.

    if (on !== on0) (on1 = (on0 = on).copy()).on(name, listener);
    schedule.on = on1;
  };
}

function _default(name, listener) {
  var id = this._id;
  return arguments.length < 2 ? (0, _schedule.get)(this.node(), id).on.on(name) : this.each(onFunction(id, name, listener));
}
},{"./schedule":"../../../node_modules/d3-transition/src/transition/schedule.js"}],"../../../node_modules/d3-transition/src/transition/remove.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function removeFunction(id) {
  return function () {
    var parent = this.parentNode;

    for (var i in this.__transition) if (+i !== id) return;

    if (parent) parent.removeChild(this);
  };
}

function _default() {
  return this.on("end.remove", removeFunction(this._id));
}
},{}],"../../../node_modules/d3-transition/src/transition/select.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _d3Selection = require("d3-selection");

var _index = require("./index");

var _schedule = _interopRequireWildcard(require("./schedule"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _default(select) {
  var name = this._name,
      id = this._id;
  if (typeof select !== "function") select = (0, _d3Selection.selector)(select);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
        if ("__data__" in node) subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
        (0, _schedule.default)(subgroup[i], name, id, i, subgroup, (0, _schedule.get)(node, id));
      }
    }
  }

  return new _index.Transition(subgroups, this._parents, name, id);
}
},{"d3-selection":"../../../node_modules/d3-selection/src/index.js","./index":"../../../node_modules/d3-transition/src/transition/index.js","./schedule":"../../../node_modules/d3-transition/src/transition/schedule.js"}],"../../../node_modules/d3-transition/src/transition/selectAll.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _d3Selection = require("d3-selection");

var _index = require("./index");

var _schedule = _interopRequireWildcard(require("./schedule"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _default(select) {
  var name = this._name,
      id = this._id;
  if (typeof select !== "function") select = (0, _d3Selection.selectorAll)(select);

  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        for (var children = select.call(node, node.__data__, i, group), child, inherit = (0, _schedule.get)(node, id), k = 0, l = children.length; k < l; ++k) {
          if (child = children[k]) {
            (0, _schedule.default)(child, name, id, k, children, inherit);
          }
        }

        subgroups.push(children);
        parents.push(node);
      }
    }
  }

  return new _index.Transition(subgroups, parents, name, id);
}
},{"d3-selection":"../../../node_modules/d3-selection/src/index.js","./index":"../../../node_modules/d3-transition/src/transition/index.js","./schedule":"../../../node_modules/d3-transition/src/transition/schedule.js"}],"../../../node_modules/d3-transition/src/transition/selection.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _d3Selection = require("d3-selection");

var Selection = _d3Selection.selection.prototype.constructor;

function _default() {
  return new Selection(this._groups, this._parents);
}
},{"d3-selection":"../../../node_modules/d3-selection/src/index.js"}],"../../../node_modules/d3-transition/src/transition/style.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _d3Interpolate = require("d3-interpolate");

var _d3Selection = require("d3-selection");

var _schedule = require("./schedule");

var _tween = require("./tween");

var _interpolate = _interopRequireDefault(require("./interpolate"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function styleNull(name, interpolate) {
  var string00, string10, interpolate0;
  return function () {
    var string0 = (0, _d3Selection.style)(this, name),
        string1 = (this.style.removeProperty(name), (0, _d3Selection.style)(this, name));
    return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : interpolate0 = interpolate(string00 = string0, string10 = string1);
  };
}

function styleRemove(name) {
  return function () {
    this.style.removeProperty(name);
  };
}

function styleConstant(name, interpolate, value1) {
  var string00,
      string1 = value1 + "",
      interpolate0;
  return function () {
    var string0 = (0, _d3Selection.style)(this, name);
    return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
  };
}

function styleFunction(name, interpolate, value) {
  var string00, string10, interpolate0;
  return function () {
    var string0 = (0, _d3Selection.style)(this, name),
        value1 = value(this),
        string1 = value1 + "";
    if (value1 == null) string1 = value1 = (this.style.removeProperty(name), (0, _d3Selection.style)(this, name));
    return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
  };
}

function styleMaybeRemove(id, name) {
  var on0,
      on1,
      listener0,
      key = "style." + name,
      event = "end." + key,
      remove;
  return function () {
    var schedule = (0, _schedule.set)(this, id),
        on = schedule.on,
        listener = schedule.value[key] == null ? remove || (remove = styleRemove(name)) : undefined; // If this node shared a dispatch with the previous node,
    // just assign the updated shared dispatch and we’re done!
    // Otherwise, copy-on-write.

    if (on !== on0 || listener0 !== listener) (on1 = (on0 = on).copy()).on(event, listener0 = listener);
    schedule.on = on1;
  };
}

function _default(name, value, priority) {
  var i = (name += "") === "transform" ? _d3Interpolate.interpolateTransformCss : _interpolate.default;
  return value == null ? this.styleTween(name, styleNull(name, i)).on("end.style." + name, styleRemove(name)) : typeof value === "function" ? this.styleTween(name, styleFunction(name, i, (0, _tween.tweenValue)(this, "style." + name, value))).each(styleMaybeRemove(this._id, name)) : this.styleTween(name, styleConstant(name, i, value), priority).on("end.style." + name, null);
}
},{"d3-interpolate":"../../../node_modules/d3-interpolate/src/index.js","d3-selection":"../../../node_modules/d3-selection/src/index.js","./schedule":"../../../node_modules/d3-transition/src/transition/schedule.js","./tween":"../../../node_modules/d3-transition/src/transition/tween.js","./interpolate":"../../../node_modules/d3-transition/src/transition/interpolate.js"}],"../../../node_modules/d3-transition/src/transition/styleTween.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function styleInterpolate(name, i, priority) {
  return function (t) {
    this.style.setProperty(name, i(t), priority);
  };
}

function styleTween(name, value, priority) {
  var t, i0;

  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t = (i0 = i) && styleInterpolate(name, i, priority);
    return t;
  }

  tween._value = value;
  return tween;
}

function _default(name, value, priority) {
  var key = "style." + (name += "");
  if (arguments.length < 2) return (key = this.tween(key)) && key._value;
  if (value == null) return this.tween(key, null);
  if (typeof value !== "function") throw new Error();
  return this.tween(key, styleTween(name, value, priority == null ? "" : priority));
}
},{}],"../../../node_modules/d3-transition/src/transition/text.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _tween = require("./tween");

function textConstant(value) {
  return function () {
    this.textContent = value;
  };
}

function textFunction(value) {
  return function () {
    var value1 = value(this);
    this.textContent = value1 == null ? "" : value1;
  };
}

function _default(value) {
  return this.tween("text", typeof value === "function" ? textFunction((0, _tween.tweenValue)(this, "text", value)) : textConstant(value == null ? "" : value + ""));
}
},{"./tween":"../../../node_modules/d3-transition/src/transition/tween.js"}],"../../../node_modules/d3-transition/src/transition/transition.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _index = require("./index");

var _schedule = _interopRequireWildcard(require("./schedule"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _default() {
  var name = this._name,
      id0 = this._id,
      id1 = (0, _index.newId)();

  for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        var inherit = (0, _schedule.get)(node, id0);
        (0, _schedule.default)(node, name, id1, i, group, {
          time: inherit.time + inherit.delay + inherit.duration,
          delay: 0,
          duration: inherit.duration,
          ease: inherit.ease
        });
      }
    }
  }

  return new _index.Transition(groups, this._parents, name, id1);
}
},{"./index":"../../../node_modules/d3-transition/src/transition/index.js","./schedule":"../../../node_modules/d3-transition/src/transition/schedule.js"}],"../../../node_modules/d3-transition/src/transition/end.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _schedule = require("./schedule");

function _default() {
  var on0,
      on1,
      that = this,
      id = that._id,
      size = that.size();
  return new Promise(function (resolve, reject) {
    var cancel = {
      value: reject
    },
        end = {
      value: function () {
        if (--size === 0) resolve();
      }
    };
    that.each(function () {
      var schedule = (0, _schedule.set)(this, id),
          on = schedule.on; // If this node shared a dispatch with the previous node,
      // just assign the updated shared dispatch and we’re done!
      // Otherwise, copy-on-write.

      if (on !== on0) {
        on1 = (on0 = on).copy();

        on1._.cancel.push(cancel);

        on1._.interrupt.push(cancel);

        on1._.end.push(end);
      }

      schedule.on = on1;
    });
  });
}
},{"./schedule":"../../../node_modules/d3-transition/src/transition/schedule.js"}],"../../../node_modules/d3-transition/src/transition/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Transition = Transition;
exports.default = transition;
exports.newId = newId;

var _d3Selection = require("d3-selection");

var _attr = _interopRequireDefault(require("./attr"));

var _attrTween = _interopRequireDefault(require("./attrTween"));

var _delay = _interopRequireDefault(require("./delay"));

var _duration = _interopRequireDefault(require("./duration"));

var _ease = _interopRequireDefault(require("./ease"));

var _filter = _interopRequireDefault(require("./filter"));

var _merge = _interopRequireDefault(require("./merge"));

var _on = _interopRequireDefault(require("./on"));

var _remove = _interopRequireDefault(require("./remove"));

var _select = _interopRequireDefault(require("./select"));

var _selectAll = _interopRequireDefault(require("./selectAll"));

var _selection = _interopRequireDefault(require("./selection"));

var _style = _interopRequireDefault(require("./style"));

var _styleTween = _interopRequireDefault(require("./styleTween"));

var _text = _interopRequireDefault(require("./text"));

var _transition = _interopRequireDefault(require("./transition"));

var _tween = _interopRequireDefault(require("./tween"));

var _end = _interopRequireDefault(require("./end"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var id = 0;

function Transition(groups, parents, name, id) {
  this._groups = groups;
  this._parents = parents;
  this._name = name;
  this._id = id;
}

function transition(name) {
  return (0, _d3Selection.selection)().transition(name);
}

function newId() {
  return ++id;
}

var selection_prototype = _d3Selection.selection.prototype;
Transition.prototype = transition.prototype = {
  constructor: Transition,
  select: _select.default,
  selectAll: _selectAll.default,
  filter: _filter.default,
  merge: _merge.default,
  selection: _selection.default,
  transition: _transition.default,
  call: selection_prototype.call,
  nodes: selection_prototype.nodes,
  node: selection_prototype.node,
  size: selection_prototype.size,
  empty: selection_prototype.empty,
  each: selection_prototype.each,
  on: _on.default,
  attr: _attr.default,
  attrTween: _attrTween.default,
  style: _style.default,
  styleTween: _styleTween.default,
  text: _text.default,
  remove: _remove.default,
  tween: _tween.default,
  delay: _delay.default,
  duration: _duration.default,
  ease: _ease.default,
  end: _end.default
};
},{"d3-selection":"../../../node_modules/d3-selection/src/index.js","./attr":"../../../node_modules/d3-transition/src/transition/attr.js","./attrTween":"../../../node_modules/d3-transition/src/transition/attrTween.js","./delay":"../../../node_modules/d3-transition/src/transition/delay.js","./duration":"../../../node_modules/d3-transition/src/transition/duration.js","./ease":"../../../node_modules/d3-transition/src/transition/ease.js","./filter":"../../../node_modules/d3-transition/src/transition/filter.js","./merge":"../../../node_modules/d3-transition/src/transition/merge.js","./on":"../../../node_modules/d3-transition/src/transition/on.js","./remove":"../../../node_modules/d3-transition/src/transition/remove.js","./select":"../../../node_modules/d3-transition/src/transition/select.js","./selectAll":"../../../node_modules/d3-transition/src/transition/selectAll.js","./selection":"../../../node_modules/d3-transition/src/transition/selection.js","./style":"../../../node_modules/d3-transition/src/transition/style.js","./styleTween":"../../../node_modules/d3-transition/src/transition/styleTween.js","./text":"../../../node_modules/d3-transition/src/transition/text.js","./transition":"../../../node_modules/d3-transition/src/transition/transition.js","./tween":"../../../node_modules/d3-transition/src/transition/tween.js","./end":"../../../node_modules/d3-transition/src/transition/end.js"}],"../../../node_modules/d3-ease/src/linear.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.linear = linear;

function linear(t) {
  return +t;
}
},{}],"../../../node_modules/d3-ease/src/quad.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.quadIn = quadIn;
exports.quadOut = quadOut;
exports.quadInOut = quadInOut;

function quadIn(t) {
  return t * t;
}

function quadOut(t) {
  return t * (2 - t);
}

function quadInOut(t) {
  return ((t *= 2) <= 1 ? t * t : --t * (2 - t) + 1) / 2;
}
},{}],"../../../node_modules/d3-ease/src/cubic.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cubicIn = cubicIn;
exports.cubicOut = cubicOut;
exports.cubicInOut = cubicInOut;

function cubicIn(t) {
  return t * t * t;
}

function cubicOut(t) {
  return --t * t * t + 1;
}

function cubicInOut(t) {
  return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
}
},{}],"../../../node_modules/d3-ease/src/poly.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.polyInOut = exports.polyOut = exports.polyIn = void 0;
var exponent = 3;

var polyIn = function custom(e) {
  e = +e;

  function polyIn(t) {
    return Math.pow(t, e);
  }

  polyIn.exponent = custom;
  return polyIn;
}(exponent);

exports.polyIn = polyIn;

var polyOut = function custom(e) {
  e = +e;

  function polyOut(t) {
    return 1 - Math.pow(1 - t, e);
  }

  polyOut.exponent = custom;
  return polyOut;
}(exponent);

exports.polyOut = polyOut;

var polyInOut = function custom(e) {
  e = +e;

  function polyInOut(t) {
    return ((t *= 2) <= 1 ? Math.pow(t, e) : 2 - Math.pow(2 - t, e)) / 2;
  }

  polyInOut.exponent = custom;
  return polyInOut;
}(exponent);

exports.polyInOut = polyInOut;
},{}],"../../../node_modules/d3-ease/src/sin.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sinIn = sinIn;
exports.sinOut = sinOut;
exports.sinInOut = sinInOut;
var pi = Math.PI,
    halfPi = pi / 2;

function sinIn(t) {
  return 1 - Math.cos(t * halfPi);
}

function sinOut(t) {
  return Math.sin(t * halfPi);
}

function sinInOut(t) {
  return (1 - Math.cos(pi * t)) / 2;
}
},{}],"../../../node_modules/d3-ease/src/exp.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.expIn = expIn;
exports.expOut = expOut;
exports.expInOut = expInOut;

function expIn(t) {
  return Math.pow(2, 10 * t - 10);
}

function expOut(t) {
  return 1 - Math.pow(2, -10 * t);
}

function expInOut(t) {
  return ((t *= 2) <= 1 ? Math.pow(2, 10 * t - 10) : 2 - Math.pow(2, 10 - 10 * t)) / 2;
}
},{}],"../../../node_modules/d3-ease/src/circle.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.circleIn = circleIn;
exports.circleOut = circleOut;
exports.circleInOut = circleInOut;

function circleIn(t) {
  return 1 - Math.sqrt(1 - t * t);
}

function circleOut(t) {
  return Math.sqrt(1 - --t * t);
}

function circleInOut(t) {
  return ((t *= 2) <= 1 ? 1 - Math.sqrt(1 - t * t) : Math.sqrt(1 - (t -= 2) * t) + 1) / 2;
}
},{}],"../../../node_modules/d3-ease/src/bounce.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bounceIn = bounceIn;
exports.bounceOut = bounceOut;
exports.bounceInOut = bounceInOut;
var b1 = 4 / 11,
    b2 = 6 / 11,
    b3 = 8 / 11,
    b4 = 3 / 4,
    b5 = 9 / 11,
    b6 = 10 / 11,
    b7 = 15 / 16,
    b8 = 21 / 22,
    b9 = 63 / 64,
    b0 = 1 / b1 / b1;

function bounceIn(t) {
  return 1 - bounceOut(1 - t);
}

function bounceOut(t) {
  return (t = +t) < b1 ? b0 * t * t : t < b3 ? b0 * (t -= b2) * t + b4 : t < b6 ? b0 * (t -= b5) * t + b7 : b0 * (t -= b8) * t + b9;
}

function bounceInOut(t) {
  return ((t *= 2) <= 1 ? 1 - bounceOut(1 - t) : bounceOut(t - 1) + 1) / 2;
}
},{}],"../../../node_modules/d3-ease/src/back.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.backInOut = exports.backOut = exports.backIn = void 0;
var overshoot = 1.70158;

var backIn = function custom(s) {
  s = +s;

  function backIn(t) {
    return t * t * ((s + 1) * t - s);
  }

  backIn.overshoot = custom;
  return backIn;
}(overshoot);

exports.backIn = backIn;

var backOut = function custom(s) {
  s = +s;

  function backOut(t) {
    return --t * t * ((s + 1) * t + s) + 1;
  }

  backOut.overshoot = custom;
  return backOut;
}(overshoot);

exports.backOut = backOut;

var backInOut = function custom(s) {
  s = +s;

  function backInOut(t) {
    return ((t *= 2) < 1 ? t * t * ((s + 1) * t - s) : (t -= 2) * t * ((s + 1) * t + s) + 2) / 2;
  }

  backInOut.overshoot = custom;
  return backInOut;
}(overshoot);

exports.backInOut = backInOut;
},{}],"../../../node_modules/d3-ease/src/elastic.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.elasticInOut = exports.elasticOut = exports.elasticIn = void 0;
var tau = 2 * Math.PI,
    amplitude = 1,
    period = 0.3;

var elasticIn = function custom(a, p) {
  var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau);

  function elasticIn(t) {
    return a * Math.pow(2, 10 * --t) * Math.sin((s - t) / p);
  }

  elasticIn.amplitude = function (a) {
    return custom(a, p * tau);
  };

  elasticIn.period = function (p) {
    return custom(a, p);
  };

  return elasticIn;
}(amplitude, period);

exports.elasticIn = elasticIn;

var elasticOut = function custom(a, p) {
  var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau);

  function elasticOut(t) {
    return 1 - a * Math.pow(2, -10 * (t = +t)) * Math.sin((t + s) / p);
  }

  elasticOut.amplitude = function (a) {
    return custom(a, p * tau);
  };

  elasticOut.period = function (p) {
    return custom(a, p);
  };

  return elasticOut;
}(amplitude, period);

exports.elasticOut = elasticOut;

var elasticInOut = function custom(a, p) {
  var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau);

  function elasticInOut(t) {
    return ((t = t * 2 - 1) < 0 ? a * Math.pow(2, 10 * t) * Math.sin((s - t) / p) : 2 - a * Math.pow(2, -10 * t) * Math.sin((s + t) / p)) / 2;
  }

  elasticInOut.amplitude = function (a) {
    return custom(a, p * tau);
  };

  elasticInOut.period = function (p) {
    return custom(a, p);
  };

  return elasticInOut;
}(amplitude, period);

exports.elasticInOut = elasticInOut;
},{}],"../../../node_modules/d3-ease/src/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "easeLinear", {
  enumerable: true,
  get: function () {
    return _linear.linear;
  }
});
Object.defineProperty(exports, "easeQuad", {
  enumerable: true,
  get: function () {
    return _quad.quadInOut;
  }
});
Object.defineProperty(exports, "easeQuadIn", {
  enumerable: true,
  get: function () {
    return _quad.quadIn;
  }
});
Object.defineProperty(exports, "easeQuadOut", {
  enumerable: true,
  get: function () {
    return _quad.quadOut;
  }
});
Object.defineProperty(exports, "easeQuadInOut", {
  enumerable: true,
  get: function () {
    return _quad.quadInOut;
  }
});
Object.defineProperty(exports, "easeCubic", {
  enumerable: true,
  get: function () {
    return _cubic.cubicInOut;
  }
});
Object.defineProperty(exports, "easeCubicIn", {
  enumerable: true,
  get: function () {
    return _cubic.cubicIn;
  }
});
Object.defineProperty(exports, "easeCubicOut", {
  enumerable: true,
  get: function () {
    return _cubic.cubicOut;
  }
});
Object.defineProperty(exports, "easeCubicInOut", {
  enumerable: true,
  get: function () {
    return _cubic.cubicInOut;
  }
});
Object.defineProperty(exports, "easePoly", {
  enumerable: true,
  get: function () {
    return _poly.polyInOut;
  }
});
Object.defineProperty(exports, "easePolyIn", {
  enumerable: true,
  get: function () {
    return _poly.polyIn;
  }
});
Object.defineProperty(exports, "easePolyOut", {
  enumerable: true,
  get: function () {
    return _poly.polyOut;
  }
});
Object.defineProperty(exports, "easePolyInOut", {
  enumerable: true,
  get: function () {
    return _poly.polyInOut;
  }
});
Object.defineProperty(exports, "easeSin", {
  enumerable: true,
  get: function () {
    return _sin.sinInOut;
  }
});
Object.defineProperty(exports, "easeSinIn", {
  enumerable: true,
  get: function () {
    return _sin.sinIn;
  }
});
Object.defineProperty(exports, "easeSinOut", {
  enumerable: true,
  get: function () {
    return _sin.sinOut;
  }
});
Object.defineProperty(exports, "easeSinInOut", {
  enumerable: true,
  get: function () {
    return _sin.sinInOut;
  }
});
Object.defineProperty(exports, "easeExp", {
  enumerable: true,
  get: function () {
    return _exp.expInOut;
  }
});
Object.defineProperty(exports, "easeExpIn", {
  enumerable: true,
  get: function () {
    return _exp.expIn;
  }
});
Object.defineProperty(exports, "easeExpOut", {
  enumerable: true,
  get: function () {
    return _exp.expOut;
  }
});
Object.defineProperty(exports, "easeExpInOut", {
  enumerable: true,
  get: function () {
    return _exp.expInOut;
  }
});
Object.defineProperty(exports, "easeCircle", {
  enumerable: true,
  get: function () {
    return _circle.circleInOut;
  }
});
Object.defineProperty(exports, "easeCircleIn", {
  enumerable: true,
  get: function () {
    return _circle.circleIn;
  }
});
Object.defineProperty(exports, "easeCircleOut", {
  enumerable: true,
  get: function () {
    return _circle.circleOut;
  }
});
Object.defineProperty(exports, "easeCircleInOut", {
  enumerable: true,
  get: function () {
    return _circle.circleInOut;
  }
});
Object.defineProperty(exports, "easeBounce", {
  enumerable: true,
  get: function () {
    return _bounce.bounceOut;
  }
});
Object.defineProperty(exports, "easeBounceIn", {
  enumerable: true,
  get: function () {
    return _bounce.bounceIn;
  }
});
Object.defineProperty(exports, "easeBounceOut", {
  enumerable: true,
  get: function () {
    return _bounce.bounceOut;
  }
});
Object.defineProperty(exports, "easeBounceInOut", {
  enumerable: true,
  get: function () {
    return _bounce.bounceInOut;
  }
});
Object.defineProperty(exports, "easeBack", {
  enumerable: true,
  get: function () {
    return _back.backInOut;
  }
});
Object.defineProperty(exports, "easeBackIn", {
  enumerable: true,
  get: function () {
    return _back.backIn;
  }
});
Object.defineProperty(exports, "easeBackOut", {
  enumerable: true,
  get: function () {
    return _back.backOut;
  }
});
Object.defineProperty(exports, "easeBackInOut", {
  enumerable: true,
  get: function () {
    return _back.backInOut;
  }
});
Object.defineProperty(exports, "easeElastic", {
  enumerable: true,
  get: function () {
    return _elastic.elasticOut;
  }
});
Object.defineProperty(exports, "easeElasticIn", {
  enumerable: true,
  get: function () {
    return _elastic.elasticIn;
  }
});
Object.defineProperty(exports, "easeElasticOut", {
  enumerable: true,
  get: function () {
    return _elastic.elasticOut;
  }
});
Object.defineProperty(exports, "easeElasticInOut", {
  enumerable: true,
  get: function () {
    return _elastic.elasticInOut;
  }
});

var _linear = require("./linear");

var _quad = require("./quad");

var _cubic = require("./cubic");

var _poly = require("./poly");

var _sin = require("./sin");

var _exp = require("./exp");

var _circle = require("./circle");

var _bounce = require("./bounce");

var _back = require("./back");

var _elastic = require("./elastic");
},{"./linear":"../../../node_modules/d3-ease/src/linear.js","./quad":"../../../node_modules/d3-ease/src/quad.js","./cubic":"../../../node_modules/d3-ease/src/cubic.js","./poly":"../../../node_modules/d3-ease/src/poly.js","./sin":"../../../node_modules/d3-ease/src/sin.js","./exp":"../../../node_modules/d3-ease/src/exp.js","./circle":"../../../node_modules/d3-ease/src/circle.js","./bounce":"../../../node_modules/d3-ease/src/bounce.js","./back":"../../../node_modules/d3-ease/src/back.js","./elastic":"../../../node_modules/d3-ease/src/elastic.js"}],"../../../node_modules/d3-transition/src/selection/transition.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _index = require("../transition/index");

var _schedule = _interopRequireDefault(require("../transition/schedule"));

var _d3Ease = require("d3-ease");

var _d3Timer = require("d3-timer");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultTiming = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: _d3Ease.easeCubicInOut
};

function inherit(node, id) {
  var timing;

  while (!(timing = node.__transition) || !(timing = timing[id])) {
    if (!(node = node.parentNode)) {
      return defaultTiming.time = (0, _d3Timer.now)(), defaultTiming;
    }
  }

  return timing;
}

function _default(name) {
  var id, timing;

  if (name instanceof _index.Transition) {
    id = name._id, name = name._name;
  } else {
    id = (0, _index.newId)(), (timing = defaultTiming).time = (0, _d3Timer.now)(), name = name == null ? null : name + "";
  }

  for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        (0, _schedule.default)(node, name, id, i, group, timing || inherit(node, id));
      }
    }
  }

  return new _index.Transition(groups, this._parents, name, id);
}
},{"../transition/index":"../../../node_modules/d3-transition/src/transition/index.js","../transition/schedule":"../../../node_modules/d3-transition/src/transition/schedule.js","d3-ease":"../../../node_modules/d3-ease/src/index.js","d3-timer":"../../../node_modules/d3-timer/src/index.js"}],"../../../node_modules/d3-transition/src/selection/index.js":[function(require,module,exports) {
"use strict";

var _d3Selection = require("d3-selection");

var _interrupt = _interopRequireDefault(require("./interrupt"));

var _transition = _interopRequireDefault(require("./transition"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_d3Selection.selection.prototype.interrupt = _interrupt.default;
_d3Selection.selection.prototype.transition = _transition.default;
},{"d3-selection":"../../../node_modules/d3-selection/src/index.js","./interrupt":"../../../node_modules/d3-transition/src/selection/interrupt.js","./transition":"../../../node_modules/d3-transition/src/selection/transition.js"}],"../../../node_modules/d3-transition/src/active.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _index = require("./transition/index");

var _schedule = require("./transition/schedule");

var root = [null];

function _default(node, name) {
  var schedules = node.__transition,
      schedule,
      i;

  if (schedules) {
    name = name == null ? null : name + "";

    for (i in schedules) {
      if ((schedule = schedules[i]).state > _schedule.SCHEDULED && schedule.name === name) {
        return new _index.Transition([[node]], root, name, +i);
      }
    }
  }

  return null;
}
},{"./transition/index":"../../../node_modules/d3-transition/src/transition/index.js","./transition/schedule":"../../../node_modules/d3-transition/src/transition/schedule.js"}],"../../../node_modules/d3-transition/src/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "transition", {
  enumerable: true,
  get: function () {
    return _index2.default;
  }
});
Object.defineProperty(exports, "active", {
  enumerable: true,
  get: function () {
    return _active.default;
  }
});
Object.defineProperty(exports, "interrupt", {
  enumerable: true,
  get: function () {
    return _interrupt.default;
  }
});

require("./selection/index");

var _index2 = _interopRequireDefault(require("./transition/index"));

var _active = _interopRequireDefault(require("./active"));

var _interrupt = _interopRequireDefault(require("./interrupt"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./selection/index":"../../../node_modules/d3-transition/src/selection/index.js","./transition/index":"../../../node_modules/d3-transition/src/transition/index.js","./active":"../../../node_modules/d3-transition/src/active.js","./interrupt":"../../../node_modules/d3-transition/src/interrupt.js"}],"../../../node_modules/d3-zoom/src/constant.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(x) {
  return function () {
    return x;
  };
}
},{}],"../../../node_modules/d3-zoom/src/event.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ZoomEvent;

function ZoomEvent(target, type, transform) {
  this.target = target;
  this.type = type;
  this.transform = transform;
}
},{}],"../../../node_modules/d3-zoom/src/transform.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Transform = Transform;
exports.default = transform;
exports.identity = void 0;

function Transform(k, x, y) {
  this.k = k;
  this.x = x;
  this.y = y;
}

Transform.prototype = {
  constructor: Transform,
  scale: function (k) {
    return k === 1 ? this : new Transform(this.k * k, this.x, this.y);
  },
  translate: function (x, y) {
    return x === 0 & y === 0 ? this : new Transform(this.k, this.x + this.k * x, this.y + this.k * y);
  },
  apply: function (point) {
    return [point[0] * this.k + this.x, point[1] * this.k + this.y];
  },
  applyX: function (x) {
    return x * this.k + this.x;
  },
  applyY: function (y) {
    return y * this.k + this.y;
  },
  invert: function (location) {
    return [(location[0] - this.x) / this.k, (location[1] - this.y) / this.k];
  },
  invertX: function (x) {
    return (x - this.x) / this.k;
  },
  invertY: function (y) {
    return (y - this.y) / this.k;
  },
  rescaleX: function (x) {
    return x.copy().domain(x.range().map(this.invertX, this).map(x.invert, x));
  },
  rescaleY: function (y) {
    return y.copy().domain(y.range().map(this.invertY, this).map(y.invert, y));
  },
  toString: function () {
    return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
  }
};
var identity = new Transform(1, 0, 0);
exports.identity = identity;
transform.prototype = Transform.prototype;

function transform(node) {
  while (!node.__zoom) if (!(node = node.parentNode)) return identity;

  return node.__zoom;
}
},{}],"../../../node_modules/d3-zoom/src/noevent.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nopropagation = nopropagation;
exports.default = _default;

var _d3Selection = require("d3-selection");

function nopropagation() {
  _d3Selection.event.stopImmediatePropagation();
}

function _default() {
  _d3Selection.event.preventDefault();

  _d3Selection.event.stopImmediatePropagation();
}
},{"d3-selection":"../../../node_modules/d3-selection/src/index.js"}],"../../../node_modules/d3-zoom/src/zoom.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _d3Dispatch = require("d3-dispatch");

var _d3Drag = require("d3-drag");

var _d3Interpolate = require("d3-interpolate");

var _d3Selection = require("d3-selection");

var _d3Transition = require("d3-transition");

var _constant = _interopRequireDefault(require("./constant.js"));

var _event = _interopRequireDefault(require("./event.js"));

var _transform = require("./transform.js");

var _noevent = _interopRequireWildcard(require("./noevent.js"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Ignore right-click, since that should open the context menu.
function defaultFilter() {
  return !_d3Selection.event.ctrlKey && !_d3Selection.event.button;
}

function defaultExtent() {
  var e = this;

  if (e instanceof SVGElement) {
    e = e.ownerSVGElement || e;

    if (e.hasAttribute("viewBox")) {
      e = e.viewBox.baseVal;
      return [[e.x, e.y], [e.x + e.width, e.y + e.height]];
    }

    return [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]];
  }

  return [[0, 0], [e.clientWidth, e.clientHeight]];
}

function defaultTransform() {
  return this.__zoom || _transform.identity;
}

function defaultWheelDelta() {
  return -_d3Selection.event.deltaY * (_d3Selection.event.deltaMode === 1 ? 0.05 : _d3Selection.event.deltaMode ? 1 : 0.002);
}

function defaultTouchable() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}

function defaultConstrain(transform, extent, translateExtent) {
  var dx0 = transform.invertX(extent[0][0]) - translateExtent[0][0],
      dx1 = transform.invertX(extent[1][0]) - translateExtent[1][0],
      dy0 = transform.invertY(extent[0][1]) - translateExtent[0][1],
      dy1 = transform.invertY(extent[1][1]) - translateExtent[1][1];
  return transform.translate(dx1 > dx0 ? (dx0 + dx1) / 2 : Math.min(0, dx0) || Math.max(0, dx1), dy1 > dy0 ? (dy0 + dy1) / 2 : Math.min(0, dy0) || Math.max(0, dy1));
}

function _default() {
  var filter = defaultFilter,
      extent = defaultExtent,
      constrain = defaultConstrain,
      wheelDelta = defaultWheelDelta,
      touchable = defaultTouchable,
      scaleExtent = [0, Infinity],
      translateExtent = [[-Infinity, -Infinity], [Infinity, Infinity]],
      duration = 250,
      interpolate = _d3Interpolate.interpolateZoom,
      listeners = (0, _d3Dispatch.dispatch)("start", "zoom", "end"),
      touchstarting,
      touchending,
      touchDelay = 500,
      wheelDelay = 150,
      clickDistance2 = 0;

  function zoom(selection) {
    selection.property("__zoom", defaultTransform).on("wheel.zoom", wheeled).on("mousedown.zoom", mousedowned).on("dblclick.zoom", dblclicked).filter(touchable).on("touchstart.zoom", touchstarted).on("touchmove.zoom", touchmoved).on("touchend.zoom touchcancel.zoom", touchended).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }

  zoom.transform = function (collection, transform, point) {
    var selection = collection.selection ? collection.selection() : collection;
    selection.property("__zoom", defaultTransform);

    if (collection !== selection) {
      schedule(collection, transform, point);
    } else {
      selection.interrupt().each(function () {
        gesture(this, arguments).start().zoom(null, typeof transform === "function" ? transform.apply(this, arguments) : transform).end();
      });
    }
  };

  zoom.scaleBy = function (selection, k, p) {
    zoom.scaleTo(selection, function () {
      var k0 = this.__zoom.k,
          k1 = typeof k === "function" ? k.apply(this, arguments) : k;
      return k0 * k1;
    }, p);
  };

  zoom.scaleTo = function (selection, k, p) {
    zoom.transform(selection, function () {
      var e = extent.apply(this, arguments),
          t0 = this.__zoom,
          p0 = p == null ? centroid(e) : typeof p === "function" ? p.apply(this, arguments) : p,
          p1 = t0.invert(p0),
          k1 = typeof k === "function" ? k.apply(this, arguments) : k;
      return constrain(translate(scale(t0, k1), p0, p1), e, translateExtent);
    }, p);
  };

  zoom.translateBy = function (selection, x, y) {
    zoom.transform(selection, function () {
      return constrain(this.__zoom.translate(typeof x === "function" ? x.apply(this, arguments) : x, typeof y === "function" ? y.apply(this, arguments) : y), extent.apply(this, arguments), translateExtent);
    });
  };

  zoom.translateTo = function (selection, x, y, p) {
    zoom.transform(selection, function () {
      var e = extent.apply(this, arguments),
          t = this.__zoom,
          p0 = p == null ? centroid(e) : typeof p === "function" ? p.apply(this, arguments) : p;
      return constrain(_transform.identity.translate(p0[0], p0[1]).scale(t.k).translate(typeof x === "function" ? -x.apply(this, arguments) : -x, typeof y === "function" ? -y.apply(this, arguments) : -y), e, translateExtent);
    }, p);
  };

  function scale(transform, k) {
    k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], k));
    return k === transform.k ? transform : new _transform.Transform(k, transform.x, transform.y);
  }

  function translate(transform, p0, p1) {
    var x = p0[0] - p1[0] * transform.k,
        y = p0[1] - p1[1] * transform.k;
    return x === transform.x && y === transform.y ? transform : new _transform.Transform(transform.k, x, y);
  }

  function centroid(extent) {
    return [(+extent[0][0] + +extent[1][0]) / 2, (+extent[0][1] + +extent[1][1]) / 2];
  }

  function schedule(transition, transform, point) {
    transition.on("start.zoom", function () {
      gesture(this, arguments).start();
    }).on("interrupt.zoom end.zoom", function () {
      gesture(this, arguments).end();
    }).tween("zoom", function () {
      var that = this,
          args = arguments,
          g = gesture(that, args),
          e = extent.apply(that, args),
          p = point == null ? centroid(e) : typeof point === "function" ? point.apply(that, args) : point,
          w = Math.max(e[1][0] - e[0][0], e[1][1] - e[0][1]),
          a = that.__zoom,
          b = typeof transform === "function" ? transform.apply(that, args) : transform,
          i = interpolate(a.invert(p).concat(w / a.k), b.invert(p).concat(w / b.k));
      return function (t) {
        if (t === 1) t = b; // Avoid rounding error on end.
        else {
            var l = i(t),
                k = w / l[2];
            t = new _transform.Transform(k, p[0] - l[0] * k, p[1] - l[1] * k);
          }
        g.zoom(null, t);
      };
    });
  }

  function gesture(that, args, clean) {
    return !clean && that.__zooming || new Gesture(that, args);
  }

  function Gesture(that, args) {
    this.that = that;
    this.args = args;
    this.active = 0;
    this.extent = extent.apply(that, args);
    this.taps = 0;
  }

  Gesture.prototype = {
    start: function () {
      if (++this.active === 1) {
        this.that.__zooming = this;
        this.emit("start");
      }

      return this;
    },
    zoom: function (key, transform) {
      if (this.mouse && key !== "mouse") this.mouse[1] = transform.invert(this.mouse[0]);
      if (this.touch0 && key !== "touch") this.touch0[1] = transform.invert(this.touch0[0]);
      if (this.touch1 && key !== "touch") this.touch1[1] = transform.invert(this.touch1[0]);
      this.that.__zoom = transform;
      this.emit("zoom");
      return this;
    },
    end: function () {
      if (--this.active === 0) {
        delete this.that.__zooming;
        this.emit("end");
      }

      return this;
    },
    emit: function (type) {
      (0, _d3Selection.customEvent)(new _event.default(zoom, type, this.that.__zoom), listeners.apply, listeners, [type, this.that, this.args]);
    }
  };

  function wheeled() {
    if (!filter.apply(this, arguments)) return;
    var g = gesture(this, arguments),
        t = this.__zoom,
        k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], t.k * Math.pow(2, wheelDelta.apply(this, arguments)))),
        p = (0, _d3Selection.mouse)(this); // If the mouse is in the same location as before, reuse it.
    // If there were recent wheel events, reset the wheel idle timeout.

    if (g.wheel) {
      if (g.mouse[0][0] !== p[0] || g.mouse[0][1] !== p[1]) {
        g.mouse[1] = t.invert(g.mouse[0] = p);
      }

      clearTimeout(g.wheel);
    } // If this wheel event won’t trigger a transform change, ignore it.
    else if (t.k === k) return; // Otherwise, capture the mouse point and location at the start.
      else {
          g.mouse = [p, t.invert(p)];
          (0, _d3Transition.interrupt)(this);
          g.start();
        }

    (0, _noevent.default)();
    g.wheel = setTimeout(wheelidled, wheelDelay);
    g.zoom("mouse", constrain(translate(scale(t, k), g.mouse[0], g.mouse[1]), g.extent, translateExtent));

    function wheelidled() {
      g.wheel = null;
      g.end();
    }
  }

  function mousedowned() {
    if (touchending || !filter.apply(this, arguments)) return;
    var g = gesture(this, arguments, true),
        v = (0, _d3Selection.select)(_d3Selection.event.view).on("mousemove.zoom", mousemoved, true).on("mouseup.zoom", mouseupped, true),
        p = (0, _d3Selection.mouse)(this),
        x0 = _d3Selection.event.clientX,
        y0 = _d3Selection.event.clientY;
    (0, _d3Drag.dragDisable)(_d3Selection.event.view);
    (0, _noevent.nopropagation)();
    g.mouse = [p, this.__zoom.invert(p)];
    (0, _d3Transition.interrupt)(this);
    g.start();

    function mousemoved() {
      (0, _noevent.default)();

      if (!g.moved) {
        var dx = _d3Selection.event.clientX - x0,
            dy = _d3Selection.event.clientY - y0;
        g.moved = dx * dx + dy * dy > clickDistance2;
      }

      g.zoom("mouse", constrain(translate(g.that.__zoom, g.mouse[0] = (0, _d3Selection.mouse)(g.that), g.mouse[1]), g.extent, translateExtent));
    }

    function mouseupped() {
      v.on("mousemove.zoom mouseup.zoom", null);
      (0, _d3Drag.dragEnable)(_d3Selection.event.view, g.moved);
      (0, _noevent.default)();
      g.end();
    }
  }

  function dblclicked() {
    if (!filter.apply(this, arguments)) return;
    var t0 = this.__zoom,
        p0 = (0, _d3Selection.mouse)(this),
        p1 = t0.invert(p0),
        k1 = t0.k * (_d3Selection.event.shiftKey ? 0.5 : 2),
        t1 = constrain(translate(scale(t0, k1), p0, p1), extent.apply(this, arguments), translateExtent);
    (0, _noevent.default)();
    if (duration > 0) (0, _d3Selection.select)(this).transition().duration(duration).call(schedule, t1, p0);else (0, _d3Selection.select)(this).call(zoom.transform, t1);
  }

  function touchstarted() {
    if (!filter.apply(this, arguments)) return;
    var touches = _d3Selection.event.touches,
        n = touches.length,
        g = gesture(this, arguments, _d3Selection.event.changedTouches.length === n),
        started,
        i,
        t,
        p;
    (0, _noevent.nopropagation)();

    for (i = 0; i < n; ++i) {
      t = touches[i], p = (0, _d3Selection.touch)(this, touches, t.identifier);
      p = [p, this.__zoom.invert(p), t.identifier];
      if (!g.touch0) g.touch0 = p, started = true, g.taps = 1 + !!touchstarting;else if (!g.touch1 && g.touch0[2] !== p[2]) g.touch1 = p, g.taps = 0;
    }

    if (touchstarting) touchstarting = clearTimeout(touchstarting);

    if (started) {
      if (g.taps < 2) touchstarting = setTimeout(function () {
        touchstarting = null;
      }, touchDelay);
      (0, _d3Transition.interrupt)(this);
      g.start();
    }
  }

  function touchmoved() {
    if (!this.__zooming) return;
    var g = gesture(this, arguments),
        touches = _d3Selection.event.changedTouches,
        n = touches.length,
        i,
        t,
        p,
        l;
    (0, _noevent.default)();
    if (touchstarting) touchstarting = clearTimeout(touchstarting);
    g.taps = 0;

    for (i = 0; i < n; ++i) {
      t = touches[i], p = (0, _d3Selection.touch)(this, touches, t.identifier);
      if (g.touch0 && g.touch0[2] === t.identifier) g.touch0[0] = p;else if (g.touch1 && g.touch1[2] === t.identifier) g.touch1[0] = p;
    }

    t = g.that.__zoom;

    if (g.touch1) {
      var p0 = g.touch0[0],
          l0 = g.touch0[1],
          p1 = g.touch1[0],
          l1 = g.touch1[1],
          dp = (dp = p1[0] - p0[0]) * dp + (dp = p1[1] - p0[1]) * dp,
          dl = (dl = l1[0] - l0[0]) * dl + (dl = l1[1] - l0[1]) * dl;
      t = scale(t, Math.sqrt(dp / dl));
      p = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
      l = [(l0[0] + l1[0]) / 2, (l0[1] + l1[1]) / 2];
    } else if (g.touch0) p = g.touch0[0], l = g.touch0[1];else return;

    g.zoom("touch", constrain(translate(t, p, l), g.extent, translateExtent));
  }

  function touchended() {
    if (!this.__zooming) return;
    var g = gesture(this, arguments),
        touches = _d3Selection.event.changedTouches,
        n = touches.length,
        i,
        t;
    (0, _noevent.nopropagation)();
    if (touchending) clearTimeout(touchending);
    touchending = setTimeout(function () {
      touchending = null;
    }, touchDelay);

    for (i = 0; i < n; ++i) {
      t = touches[i];
      if (g.touch0 && g.touch0[2] === t.identifier) delete g.touch0;else if (g.touch1 && g.touch1[2] === t.identifier) delete g.touch1;
    }

    if (g.touch1 && !g.touch0) g.touch0 = g.touch1, delete g.touch1;
    if (g.touch0) g.touch0[1] = this.__zoom.invert(g.touch0[0]);else {
      g.end(); // If this was a dbltap, reroute to the (optional) dblclick.zoom handler.

      if (g.taps === 2) {
        var p = (0, _d3Selection.select)(this).on("dblclick.zoom");
        if (p) p.apply(this, arguments);
      }
    }
  }

  zoom.wheelDelta = function (_) {
    return arguments.length ? (wheelDelta = typeof _ === "function" ? _ : (0, _constant.default)(+_), zoom) : wheelDelta;
  };

  zoom.filter = function (_) {
    return arguments.length ? (filter = typeof _ === "function" ? _ : (0, _constant.default)(!!_), zoom) : filter;
  };

  zoom.touchable = function (_) {
    return arguments.length ? (touchable = typeof _ === "function" ? _ : (0, _constant.default)(!!_), zoom) : touchable;
  };

  zoom.extent = function (_) {
    return arguments.length ? (extent = typeof _ === "function" ? _ : (0, _constant.default)([[+_[0][0], +_[0][1]], [+_[1][0], +_[1][1]]]), zoom) : extent;
  };

  zoom.scaleExtent = function (_) {
    return arguments.length ? (scaleExtent[0] = +_[0], scaleExtent[1] = +_[1], zoom) : [scaleExtent[0], scaleExtent[1]];
  };

  zoom.translateExtent = function (_) {
    return arguments.length ? (translateExtent[0][0] = +_[0][0], translateExtent[1][0] = +_[1][0], translateExtent[0][1] = +_[0][1], translateExtent[1][1] = +_[1][1], zoom) : [[translateExtent[0][0], translateExtent[0][1]], [translateExtent[1][0], translateExtent[1][1]]];
  };

  zoom.constrain = function (_) {
    return arguments.length ? (constrain = _, zoom) : constrain;
  };

  zoom.duration = function (_) {
    return arguments.length ? (duration = +_, zoom) : duration;
  };

  zoom.interpolate = function (_) {
    return arguments.length ? (interpolate = _, zoom) : interpolate;
  };

  zoom.on = function () {
    var value = listeners.on.apply(listeners, arguments);
    return value === listeners ? zoom : value;
  };

  zoom.clickDistance = function (_) {
    return arguments.length ? (clickDistance2 = (_ = +_) * _, zoom) : Math.sqrt(clickDistance2);
  };

  return zoom;
}
},{"d3-dispatch":"../../../node_modules/d3-dispatch/src/index.js","d3-drag":"../../../node_modules/d3-drag/src/index.js","d3-interpolate":"../../../node_modules/d3-interpolate/src/index.js","d3-selection":"../../../node_modules/d3-selection/src/index.js","d3-transition":"../../../node_modules/d3-transition/src/index.js","./constant.js":"../../../node_modules/d3-zoom/src/constant.js","./event.js":"../../../node_modules/d3-zoom/src/event.js","./transform.js":"../../../node_modules/d3-zoom/src/transform.js","./noevent.js":"../../../node_modules/d3-zoom/src/noevent.js"}],"../../../node_modules/d3-zoom/src/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "zoom", {
  enumerable: true,
  get: function () {
    return _zoom.default;
  }
});
Object.defineProperty(exports, "zoomTransform", {
  enumerable: true,
  get: function () {
    return _transform.default;
  }
});
Object.defineProperty(exports, "zoomIdentity", {
  enumerable: true,
  get: function () {
    return _transform.identity;
  }
});

var _zoom = _interopRequireDefault(require("./zoom.js"));

var _transform = _interopRequireWildcard(require("./transform.js"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./zoom.js":"../../../node_modules/d3-zoom/src/zoom.js","./transform.js":"../../../node_modules/d3-zoom/src/transform.js"}],"../../../src/layout/RSGraph.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = require("../core/index.js");

var _tools = require("../utils/tools.js");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * flowchart layout - relationship grap.
 * @description 容器类
 * @author TimRChen <timrchen@foxmai.com>
 */
var RSGraph =
/*#__PURE__*/
function () {
  function RSGraph(selectors, config) {
    _classCallCheck(this, RSGraph);

    var data = config.data;
    this.nodes = this.initData(data);
    this.core = {};
    this.init(selectors, config);
  }
  /**
   * 初始化处理数据
   * @argument {Array} data
   */


  _createClass(RSGraph, [{
    key: "initData",
    value: function initData(data) {
      if ((0, _tools.typeOf)(data) === 'Array') {
        return data.map(function (node) {
          var hasPosition = 'position' in node;

          if (!hasPosition) {
            node.position = {
              x: 50,
              y: 50
            };
          }

          return node;
        });
      } else {
        throw TypeError("".concat(data, " is not Array"));
      }
    }
    /**
     * 初始化全局
     * @argument {String} selectors dom选择字符串
     * @argument {Object} config
     */

  }, {
    key: "init",
    value: function init(selectors, config) {
      var _config$zoom = config.zoom,
          zoom = _config$zoom === void 0 ? true : _config$zoom,
          _config$coreOptions = config.coreOptions,
          coreOptions = _config$coreOptions === void 0 ? {} : _config$coreOptions;
      var svgDom = document.querySelector(selectors);

      if (_typeof(svgDom) === 'object') {
        var options = {
          linkDot: {
            display: 'none'
          }
        };
        Object.assign(options, coreOptions, {
          mode: 'render-mode'
        });
        this.core = new _index.Core(svgDom, options);
        this.initialLayout(this.nodes);
        if (zoom) this.initialZoom(selectors);
      } else {
        throw TypeError("".concat(svgDom, " is not a Svg DOM Element."));
      }
    }
    /**
     * 初始化缩放
     * @argument {String} selectors dom选择字符串
     */

  }, {
    key: "initialZoom",
    value: function initialZoom(selectors) {
      var d3 = require('d3-selection');

      var d3Zoom = require('d3-zoom');

      var svg = d3.select(selectors);
      var g = d3.selectAll('g').filter('.graph, .edges');
      var zoomRange = [0.5, 8];
      svg.call(d3Zoom.zoom().scaleExtent(zoomRange).on('zoom', function () {
        g.attr('transform', d3.event.transform);
      }));
    }
    /**
     * 布局
     * @argument {Array} nodes
     */

  }, {
    key: "initialLayout",
    value: function initialLayout(nodes) {
      var _this = this;

      // 找出根节点
      var rootNode = this.findRoot(nodes); // 判断根节点是否已存在

      var rootIndex = this.core.nodes.findIndex(function (node) {
        return node.id === rootNode.id;
      });

      if (rootIndex === -1) {
        // 若根节点不存在则创建
        this.createNode(rootNode);
      } // 筛选子节点


      var cNodes = nodes.filter(function (node) {
        return node.parent === rootNode.id;
      }); // 将后续子孙节点注入递归队列中

      var recursionQueue = [];
      cNodes.forEach(function (node) {
        if (node.parent === rootNode.id) {
          if (node.children.length > 0) {
            var list = cNodes.filter(function (n) {
              return node.children.indexOf(n.id) !== -1;
            });

            var childs = _this.findChilds(_this.nodes, node);

            list = Array.from(new Set([node].concat(_toConsumableArray(list), _toConsumableArray(childs))));
            recursionQueue.push(list);
          }
        }
      }); // 创建子节点并初始化位置 position is the key.

      var lastNodeLen = 0;
      cNodes.forEach(function (node, index) {
        var nodeInstance = _this.createNode(node);

        var len = node.children.length; // 根据子节点个数生成父节点位置

        if (len >= 1) {
          // 明确子节点的子节点的子节点的个数
          var bNodes = _this.nodes.filter(function (n) {
            if (node.children.indexOf(n.id) !== -1) {
              return n;
            }
          });

          var bChildrenLen = bNodes.reduce(function (acc, curv) {
            if (curv.children.length > 0) {
              return acc + curv.children.length;
            } else {
              return acc;
            }
          }, 0);

          var position = _this.getPosition(node, rootNode, lastNodeLen);

          nodeInstance.changePosition(position);

          if (len > 1) {
            lastNodeLen += len + bChildrenLen;
          } else {
            lastNodeLen += 1;
          }
        } else {
          var _position = _this.getPosition(node, rootNode, index);

          nodeInstance.changePosition(_position);
          lastNodeLen += 1;
        }
      }); // 绘制连接

      this.drawLink(cNodes, rootNode); // 递归子节点包含有子孙节点情况

      if (recursionQueue.length > 0) {
        recursionQueue.forEach(function (list) {
          _this.initialLayout(list);
        });
      }
    }
    /**
     * 查找根节点
     * @argument {Array} nodes
     * @return {Object} rootNode
     */

  }, {
    key: "findRoot",
    value: function findRoot(nodes) {
      var rootNode = nodes.find(function (node) {
        if (node.children.length > 0) {
          var index = nodes.findIndex(function (n) {
            return node.parent === n.id;
          });
          return index === -1;
        }
      });
      return rootNode;
    }
    /**
     * 将当前节点下的所有子孙节点找出
     * @description 此 node 具备两个条件：1. 它是当前父节点下的子节点 2. 它有子节点
     * @argument {Array} nodes
     * @argument {Object} node
     * @return {Array}
     */

  }, {
    key: "findChilds",
    value: function findChilds(nodes, node) {
      var _this2 = this;

      var cs = [];
      var childs = nodes.filter(function (n) {
        if (n.parent === node.id) {
          if (n.children.length > 0) {
            cs = _this2.findChilds(nodes, n);
          }

          return n;
        }
      });
      return Array.from(new Set([].concat(_toConsumableArray(childs), _toConsumableArray(cs))));
    }
    /**
     * 初始化position属性
     * @argument {Object} node
     * @argument {Object} rootNode
     * @argument {Number} len
     * @return {Object} position
     */

  }, {
    key: "getPosition",
    value: function getPosition(node, rootNode, len) {
      var width = node.width,
          height = node.height;

      if (width === 0 || height === 0 || width === undefined || height === undefined) {
        throw Error('node must has "width" an "height" attributes');
      }

      var baseWidth = width * 2;
      var baseHeight = height * 2;
      var _rootNode$position = rootNode.position,
          x = _rootNode$position.x,
          y = _rootNode$position.y;
      var xPosition = x + baseWidth * len;
      var yPosition = y + baseHeight;
      node.position = {
        x: xPosition,
        y: yPosition
      };
      return node.position;
    }
    /**
     * 创建节点
     * @argument {Object} node
     * @return {Object} node instance
     */

  }, {
    key: "createNode",
    value: function createNode(node) {
      var domSelectors = ".item[data-rsgraph-id=\"".concat(node.id, "\"]");
      var htmlData = document.querySelector(domSelectors);
      var _node$width = node.width,
          width = _node$width === void 0 ? 0 : _node$width,
          _node$height = node.height,
          height = _node$height === void 0 ? 0 : _node$height,
          position = node.position;

      if (width === 0 || height === 0 || width === undefined || height === undefined) {
        throw Error('node must has "width" an "height" attributes');
      }

      var nodeInstance = new _index.Node({
        position: position,
        style: {
          width: width,
          height: height,
          userSelect: 'none',
          rx: 10
        },
        html: {
          meta: htmlData
        }
      });
      Object.assign(nodeInstance, node);
      this.core.addNode(nodeInstance);
      return nodeInstance;
    }
    /**
     * 绘制连接关系
     * @argument {Array} nodes
     * @argument {Object} rootNode
     */

  }, {
    key: "drawLink",
    value: function drawLink(nodes, rootNode) {
      var _this3 = this;

      nodes.forEach(function (node) {
        var edge = new _index.Edge();

        _this3.core.addEdge(edge, {
          source: rootNode.id,
          target: node.id,
          dotLink: 'bottom',
          dotEndLink: 'top'
        });
      });
    }
  }]);

  return RSGraph;
}();

exports.default = RSGraph;
},{"../core/index.js":"../../../src/core/index.js","../utils/tools.js":"../../../src/utils/tools.js","d3-selection":"../../../node_modules/d3-selection/src/index.js","d3-zoom":"../../../node_modules/d3-zoom/src/index.js"}],"../../../src/layout/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "RSGraph", {
  enumerable: true,
  get: function () {
    return _RSGraph.default;
  }
});

var _RSGraph = _interopRequireDefault(require("./RSGraph.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./RSGraph.js":"../../../src/layout/RSGraph.js"}],"config/nodes.json":[function(require,module,exports) {
module.exports = [{
  "id": "43509809",
  "title": "1-2-1",
  "desc": "node",
  "children": [],
  "parent": "333"
}, {
  "id": "3237",
  "title": "1-4-4-2",
  "desc": "node",
  "children": ["4234", "4235"],
  "parent": "1237"
}, {
  "id": "333",
  "title": "1-2",
  "desc": "node",
  "children": ["43509809", "43509808", "4350980891", "43509808123", "4350980891424"],
  "parent": "111"
}, {
  "id": "4350980891",
  "title": "1-2-3",
  "desc": "node",
  "children": [],
  "parent": "333"
}, {
  "id": "1235",
  "title": "1-4-2",
  "desc": "node",
  "children": [],
  "parent": "555"
}, {
  "id": "222",
  "title": "1-1",
  "desc": "node",
  "children": [],
  "parent": "111"
}, {
  "id": "4350980891424",
  "title": "1-2-5",
  "desc": "node",
  "children": [],
  "parent": "333"
}, {
  "id": "111",
  "title": "0",
  "desc": "node",
  "children": ["222", "333", "444", "555"],
  "parent": null
}, {
  "id": "555",
  "title": "1-4",
  "desc": "node",
  "children": ["1234", "1235", "1236", "1237"],
  "parent": "111"
}, {
  "id": "4234",
  "title": "1-4-4-2-1",
  "desc": "node",
  "children": [],
  "parent": "3237"
}, {
  "id": "2234",
  "title": "1-3-1",
  "desc": "node",
  "children": [],
  "parent": "444"
}, {
  "id": "1236",
  "title": "1-4-3",
  "desc": "node",
  "children": ["3292"],
  "parent": "555"
}, {
  "id": "43509808123",
  "title": "1-2-4",
  "desc": "node",
  "children": [],
  "parent": "333"
}, {
  "id": "444",
  "title": "1-3",
  "desc": "node",
  "children": ["2234", "2235"],
  "parent": "111"
}, {
  "id": "3292",
  "title": "1-4-3-1",
  "desc": "node",
  "children": [],
  "parent": "1236"
}, {
  "id": "4235",
  "title": "1-4-4-2-2",
  "desc": "node",
  "children": [],
  "parent": "3237"
}, {
  "id": "43509808",
  "title": "1-2-2",
  "desc": "node",
  "children": [],
  "parent": "333"
}, {
  "id": "2235",
  "title": "1-3-2",
  "desc": "node",
  "children": [],
  "parent": "444"
}, {
  "id": "1237",
  "title": "1-4-4",
  "desc": "node",
  "children": ["3236", "3237"],
  "parent": "555"
}, {
  "id": "1234",
  "title": "1-4-1",
  "desc": "node",
  "children": [],
  "parent": "555"
}, {
  "id": "3236",
  "title": "1-4-4-1",
  "desc": "node",
  "children": [],
  "parent": "1237"
}];
},{}],"index.js":[function(require,module,exports) {
"use strict";

var _index = require("../../../src/layout/index.js");

var data = require('./config/nodes.json'); // sort data.


data.sort(function (a, b) {
  return a.title > b.title ? 1 : -1;
}); // random data.
// data.sort(() => (Math.random() * 10 > 5 ? -1 : 1))
// set node width & height

var width = 50;
var height = 50;
var nodes = data.map(function (node) {
  node.width = width;
  node.height = height;
  return node;
}); // create node div dom element.

nodes.forEach(function (node) {
  var title = node.title,
      desc = node.desc;
  var body = document.querySelector('body');
  var div = document.createElement('div');
  div.setAttribute('data-rsgraph-id', node.id);
  div.setAttribute('class', 'item');
  div.innerHTML = "<div class=\"desc\">".concat(desc, "</div><div class=\"title\">").concat(title, "</div>");
  body.appendChild(div);
}); // RSGraph config.

var config = {
  data: nodes // 可选
  // zoom: true,
  // coreOptions: {
  //     style: {
  //         borderTop: '1px dashed #000',
  //         overflow: 'scroll',
  //     },
  //     line: {
  //         style: {
  //             stroke: 'deepskyblue',
  //         },
  //         arrow: {
  //             style: {
  //                 fill: '#888',
  //             },
  //             viewBox: '0 0 18 18',
  //         },
  //     },
  //     linkDot: {
  //         display: 'none',
  //     },
  //     mode: 'link-mode', // set link-mode will not work.
  // },

}; // create rsgraph instance, just use one statement.

var graph = new _index.RSGraph('#container', config);
},{"../../../src/layout/index.js":"../../../src/layout/index.js","./config/nodes.json":"config/nodes.json"}],"../../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "64402" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/RSGraph.e31bb0bc.js.map