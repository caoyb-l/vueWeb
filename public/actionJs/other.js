/**
 * 2019-08-15
 * 等待 10201
 * 休息 10222
 * 蓝牙控制 10263
 * 唤醒 10223
 * 改变表情10226
 * 摇头 10228
 * 声音大一点 10218
 * 声音小一点 10219
 * 机器人交互 10256
 * 跳转命令集 10266
 * 占位符 0000
 * 10285 开机
 * 10286 关机
 * 10287 充电
 */

'use strict'
goog.provide('Blockly.Blocks.lists') // Deprecated
goog.provide('Blockly.Constants.Lists')
goog.require('Blockly.Blocks')
goog.require('Blockly')

// 其他命令单元
// 休息 10222
var block_rest = {
  message0: '休眠',
  args0: [
  ],
  'colour': '290',
  'nextStatement': 'Action',
  'previousStatement': 'Action'
}

Blockly.Blocks['block_rest'] = {
  init: function () {
    this.jsonInit(block_rest)
  }
}
Blockly.JavaScript.block_rest = function (a) {
  var res =
        '{"code":"10222","unitName":"休息","waitingTime":"0","type":"3"},'
  return res
}

// 等待 10201
var wait_for = {
  message0: '等待   %1秒',
  args0: [
    {
      type: 'field_input',
      name: 'param',
      text: '0'
    }
  ],
  'colour': '290',
  'nextStatement': 'Action',
  'previousStatement': 'Action'
}

Blockly.Blocks['wait_for'] = {
  init: function () {
    this.jsonInit(wait_for)
  }
}
Blockly.JavaScript.wait_for = function (a) {
  var param = a.getFieldValue('param')
  var res =
        '{"code":"10201","unitName":"等待","params":"' + param + '","type":"2"},'
  return res
}

// 蓝牙控制 10263
var Bluetooth = {
  message0: '蓝牙指令 >%1',
  args0: [
    {
      type: 'field_input',
      name: 'param',
      text: '000'
    }
  ],
  'colour': '290',
  'nextStatement': 'Action',
  'previousStatement': 'Action'
}

Blockly.Blocks['Bluetooth'] = {
  init: function () {
    this.jsonInit(Bluetooth)
  }
}
Blockly.JavaScript.Bluetooth = function (a) {
  var param = a.getFieldValue('param')
  var res =
        '{"code":"10263","unitName":"蓝牙","waitingTime":"0","params":"' + param + '","type":"9"},'
  return res
}

// 唤醒 10223
var block_wakeUp = {
  message0: '唤醒',
  args0: [
  ],
  'colour': '290',
  'nextStatement': 'Action',
  'previousStatement': 'Action'
}

Blockly.Blocks['block_wakeUp'] = {
  init: function () {
    this.jsonInit(block_wakeUp)
  }
}
Blockly.JavaScript.block_wakeUp = function (a) {
  var res =
        '{"code":"10223","unitName":"唤醒","waitingTime":"0","type":"3"},'
  return res
}

// 改变表情 10226
var block_chg_express = {
  message0: '切换表情> %1',
  args0: [
    {
      type: 'field_dropdown',
      name: 'param',
      options: [
        ['尴尬', '00160000078100000000'],
        ['惊讶', '00160000073000000000'],
        ['哭', '00160000074000000000'],
        ['喜欢', '00160000076000000000'],
        ['晕', '00160000077000000000'],
        ['飞吻', '00160000079000000000'],
        ['卖萌', '00160000070100000000'],
        ['调皮', '00160000071100000000'],
        ['委屈', '00160000072100000000'],
        ['生气', '00160000075100000000'],
        ['害羞', '00160000076100000000'],
        ['叹气', '00160000077100000000'],
        ['坏笑', '00160000073200000000'],
        ['惊恐', '00160000076200000000'],
        ['劳累', '00160000077200000000'],
        ['口水', '00160000078200000000'],
        ['抓狂', '00160000075300000000']
      ]
    }
  ],
  'colour': '290',
  'nextStatement': 'Action',
  'previousStatement': 'Action'
}

Blockly.Blocks['block_chg_express'] = {
  init: function () {
    this.jsonInit(block_chg_express)
  }
}
Blockly.JavaScript.block_chg_express = function (a) {
  var param = a.getFieldValue('param')
  var res =
        '{"code":"10226","unitName":"改变表情","waitingTime":"0","params":"' + param + '","type":"4"},'
  return res
}

// 摇头 10228
var block_shook_head = {
  message0: '摇头   延迟%1秒',
  args0: [
    {
      type: 'field_input',
      name: 'secs',
      text: '3'
    }
  ],
  'colour': '290',
  'nextStatement': 'Action',
  'previousStatement': 'Action'
}

Blockly.Blocks['block_shook_head'] = {
  init: function () {
    this.jsonInit(block_shook_head)
  }
}
Blockly.JavaScript.block_shook_head = function (a) {
  var secs = a.getFieldValue('secs')
  var res =
        '{"code":"10228","unitName":"摇头","waitingTime":"' +
        secs + '","type":"5"},'
  return res
}

// 声音大一点 10218
var block_amplify_sound = {
  message0: '  音量  +',
  args0: [

  ],
  'colour': '#52C41A',
  'nextStatement': 'Action',
  'previousStatement': 'Action'
}

Blockly.Blocks['block_amplify_sound'] = {
  init: function () {
    this.jsonInit(block_amplify_sound)
  }
}
Blockly.JavaScript.block_amplify_sound = function (a) {
  var res =
        '{"code":"10218","unitName":"音量增加","type":"3"},'
  return res
}

// 声音小一点 10219
var block_down_sound = {
  message0: '  音量  -',
  args0: [
  ],
  'colour': '#52C41A',
  'nextStatement': 'Action',
  'previousStatement': 'Action'
}

Blockly.Blocks['block_down_sound'] = {
  init: function () {
    this.jsonInit(block_down_sound)
  }
}
Blockly.JavaScript.block_down_sound = function (a) {
  var res =
        '{"code":"10219","unitName":"音量减小","type":"3"},'
  return res
}

// 占位符 0000
var block_placeholder = {
  message0: '占位符，无法识别（请及时手动替换--------------）',
  args0: [
  ],
  'nextStatement': 'Action',
  'previousStatement': 'Action'
}

Blockly.Blocks['block_placeholder'] = {
  init: function () {
    this.jsonInit(block_placeholder)
  }
}
Blockly.JavaScript.block_placeholder = function (a) {
  var res =
        '{"code":"0000","unitName":"占位功能","waitingTime":"0","type":"4","isWaitFinish":"0","params":""},'
  return res
}

// 机器人交互 10256
var block_robot_interaction = {
  message0: '控制机器人> %1   执行> %2',
  args0: [
    {
      type: 'field_input',
      name: 'secs',
      text: '编码'
    },
    {
      type: 'field_input',
      name: 'param',
      text: '动作编码'
    }
  ],
  'colour': '290',
  'nextStatement': 'Action',
  'previousStatement': 'Action'
}

Blockly.Blocks['block_robot_interaction'] = {
  init: function () {
    this.jsonInit(block_robot_interaction)
  }
}
Blockly.JavaScript.block_robot_interaction = function (a) {
  var param = a.getFieldValue('param')
  var secs = a.getFieldValue('secs')
  var res =
        '{"code":"10256","unitName":"机器人交互","params":"' + param + '/' + secs + '","type":"9","isWaitFinish":"0"},'
  return res
}

// 跳转命令集 10266
var block_jump_commandSet = {
  message0: '跳转动作集  动作集编码%1',
  args0: [
    {
      type: 'field_input',
      name: 'param',
      text: ''
    }
  ],
  'colour': '290',
  'nextStatement': 'Action',
  'previousStatement': 'Action'
}

Blockly.Blocks['block_jump_commandSet'] = {
  init: function () {
    this.jsonInit(block_jump_commandSet)
  }
}
Blockly.JavaScript.block_jump_commandSet = function (a) {
  var param = a.getFieldValue('param')
  var res =
        '{"code":"10266","unitName":"跳转命令集","params":"' + param + '","type":"12"},'
  return res
}

// 开机 10285
var block_robot_open = {
  message0: ' 开机 ',
  args0: [

  ],
  'colour': '#28c4bc',
  'nextStatement': 'Action',
  'previousStatement': 'Action'
}

Blockly.Blocks['block_robot_open'] = {
  init: function () {
    this.jsonInit(block_robot_open)
  }
}
Blockly.JavaScript.block_robot_open = function (a) {
  var res =
    '{"code":"10285","unitName":"开机","type":"4"},'
  return res
}

// 关机 10286
var block_robot_close = {
  message0: ' 关机 ',
  args0: [

  ],
  'colour': '#28c4bc',
  'nextStatement': 'Action',
  'previousStatement': 'Action'
}

Blockly.Blocks['block_robot_close'] = {
  init: function () {
    this.jsonInit(block_robot_close)
  }
}
Blockly.JavaScript.block_robot_close = function (a) {
  var res =
    '{"code":"10286","unitName":"关机","type":"4"},'
  return res
}

// 充电 10287
var block_charge = {
  message0: ' 充电 ',
  args0: [

  ],
  'colour': '#c4201e',
  'nextStatement': 'Action',
  'previousStatement': 'Action'
}

Blockly.Blocks['block_charge'] = {
  init: function () {
    this.jsonInit(block_charge)
  }
}
Blockly.JavaScript.block_charge = function (a) {
  var res =
    '{"code":"10287","unitName":"充电","type":"7"},'
  return res
}
