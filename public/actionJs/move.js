/**
 * 2019-08-13
 * writer:lzy
 * 前进 10212
 * 后退 10213
 * 旋转 10217
 * 左转 10214
 * 右转 10215
 * 回到初始位置 10235
 */
"use strict";
goog.provide("Blockly.Blocks.lists"); // Deprecated
goog.provide("Blockly.Constants.Lists");
goog.require("Blockly.Blocks");
goog.require("Blockly");

// 前进 10212
var block_move_goForward = {
  message0: "往前走一小步",
  args0: [
  ],
  "colour": '230',
  "nextStatement": "Action",
  "previousStatement": "Action",
};

Blockly.Blocks["block_move_goForward"] = {
  init: function () {
    this.jsonInit(block_move_goForward)
  }
};
Blockly.JavaScript.block_move_goForward = function (a) {
  var res =
    '{"code":"10212","unitName":"往前走一小步","waitingTime":"0","type":"6"},';

  return res;
};

// 后退 10213
var block_move_goBack = {
  message0: "往后退一小步",
  args0: [
  ],
  "colour": '230',
  "nextStatement": "Action",
  "previousStatement": "Action",
};

Blockly.Blocks["block_move_goBack"] = {
  init: function () {
    this.jsonInit(block_move_goBack)
  }
};
Blockly.JavaScript.block_move_goBack = function (a) {
  var res =
    '{"code":"10213","unitName":"往后退一小步","waitingTime":"0","type":"6"},';

  return res;
};


// 旋转 10217
var block_move_revolve = {
  message0: "旋转>%1度",
  args0: [
    {
      type: 'field_input',
      name: 'param',
      text: '  '
    }
  ],
  "colour": '#411BEA',
  "nextStatement": "Action",
  "previousStatement": "Action",
};

Blockly.Blocks["block_move_revolve"] = {
  init: function () {
    this.jsonInit(block_move_revolve)
  }
};
Blockly.JavaScript.block_move_revolve = function (a) {
  var param = a.getFieldValue("param");
  var res =
    '{"code":"10217","unitName":"旋转","waitingTime":"0","params":"' + param + '","type":"7"},';

  return res;
};


// 左转 10214
var block_turn_left = {
  message0: "向左转动一小步",
  args0: [
  ],
  "colour": '#411BEA',
  "nextStatement": "Action",
  "previousStatement": "Action",
};

Blockly.Blocks["block_turn_left"] = {
  init: function () {
    this.jsonInit(block_turn_left)
  }
};
Blockly.JavaScript.block_turn_left = function (a) {
  var res =
    '{"code":"10214","unitName":"向左转动一小步","waitingTime":"0","type":"6"},';

  return res;
};


// 右转 10215
var block_turn_right = {
  message0: "向右转动一小步",
  args0: [
  ],
  "colour": '#411BEA',
  "nextStatement": "Action",
  "previousStatement": "Action",
};

Blockly.Blocks["block_turn_right"] = {
  init: function () {
    this.jsonInit(block_turn_right)
  }
};
Blockly.JavaScript.block_turn_right = function (a) {
  var res =
    '{"code":"10215","unitName":"向右转动一小步","waitingTime":"0","type":"6"},';

  return res;
};

//回到初始位置 10235
var block_go_home = {
  message0: "回到初始位置",
  args0: [
  ],
  message1: "执行 %1",
  args1: [
    {
      type: "input_statement",
      name: "DO0"
    }
  ],
  "colour": "#B430E5",
  "nextStatement": "Action",
  "previousStatement": "Action",
};
Blockly.Blocks["block_go_home"] = {
  init: function () {
    this.jsonInit(block_go_home);
  }
};

Blockly.JavaScript.block_go_home = function (a) {
  var action = Blockly.JavaScript.statementToCode(a, "DO0");
  // 去掉action内最后一个逗号
  if (action) {
    action = action.substr(0, action.length - 1);
  }
  var res =
    '{"code":"10235","unitName":"回到初始位置","type":"7","unit":[' + action + ']},';
  return res;
};