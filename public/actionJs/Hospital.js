/**
 * 2019-08-14
 * writer:lzy
 * 开始喷雾 10279
 * 关闭喷雾 10280
 * 开始臭氧 10281
 * 关闭臭氧 10282
 * 紫外线开启 10283
 * 紫外线关闭 10284
 */
"use strict";
goog.provide("Blockly.Blocks.lists"); // Deprecated
goog.provide("Blockly.Constants.Lists");
goog.require("Blockly.Blocks");
goog.require("Blockly");

// 开始喷雾 10279
var block_on_spray = {
  message0: "  喷雾开启 ON",
  args0: [
  ],
  "colour": '#52C41A',
  "nextStatement": "Action",
  "previousStatement": "Action",
};

Blockly.Blocks["block_on_spray"] = {
  init: function () {
      this.jsonInit(block_on_spray)
  }
};
Blockly.JavaScript.block_on_spray = function (a) {
  var res =
      '{"code":"10279","unitName":"喷雾开启","type":"14"},';
  return res;
};

// 关闭喷雾 10280
var block_off_spray = {
  message0: "  喷雾关闭 OFF",
  args0: [
  ],
  "colour": '#FF2D2D',
  "nextStatement": "Action",
  "previousStatement": "Action",
};

Blockly.Blocks["block_off_spray"] = {
  init: function () {
      this.jsonInit(block_off_spray)
  }
};
Blockly.JavaScript.block_off_spray = function (a) {
  var res =
      '{"code":"10280","unitName":"喷雾关闭","type":"14"},';
  return res;
};

// 开启臭氧 10281
var block_on_ozone = {
  message0: "  臭氧开启 ON",
  args0: [
  ],
  "colour": '#52C41A',
  "nextStatement": "Action",
  "previousStatement": "Action",
};

Blockly.Blocks["block_on_ozone"] = {
  init: function () {
      this.jsonInit(block_on_ozone)
  }
};
Blockly.JavaScript.block_on_ozone = function (a) {
  var res =
      '{"code":"10281","unitName":"臭氧开启","type":"14"},';
  return res;
};

// 关闭臭氧 10282
var block_off_ozone = {
  message0: "  臭氧关闭 OFF",
  args0: [
  ],
  "colour": '#FF2D2D',
  "nextStatement": "Action",
  "previousStatement": "Action",
};

Blockly.Blocks["block_off_ozone"] = {
  init: function () {
      this.jsonInit(block_off_ozone)
  }
};
Blockly.JavaScript.block_off_ozone = function (a) {
  var res =
      '{"code":"10282","unitName":"臭氧关闭","type":"14"},';
  return res;
};
// 紫外线开启 10283
var block_on_uvgi = {
  message0: "  紫外线开启 ON",
  args0: [
  ],
  "colour": '#52C41A',
  "nextStatement": "Action",
  "previousStatement": "Action",
};

Blockly.Blocks["block_on_uvgi"] = {
  init: function () {
      this.jsonInit(block_on_uvgi)
  }
};
Blockly.JavaScript.block_on_uvgi = function (a) {
  var res =
      '{"code":"10283","unitName":"紫外线开启","type":"14"},';
  return res;
};

// 紫外线关闭 10284
var block_off_uvgi = {
  message0: "  紫外线关闭 OFF",
  args0: [
  ],
  "colour": '#FF2D2D',
  "nextStatement": "Action",
  "previousStatement": "Action",
};

Blockly.Blocks["block_off_uvgi"] = {
  init: function () {
      this.jsonInit(block_off_uvgi)
  }
};
Blockly.JavaScript.block_off_uvgi = function (a) {
  var res =
      '{"code":"10284","unitName":"紫外线关闭","type":"14"},';
  return res;
};