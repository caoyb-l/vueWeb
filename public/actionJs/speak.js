/**
 * 2019-08-13
 * writer:lzy
 * 语音
 */

"use strict";
goog.provide("Blockly.Blocks.lists"); // Deprecated
goog.provide("Blockly.Constants.Lists");
goog.require("Blockly.Blocks");
goog.require("Blockly");
// 语音 10200
var block_speak = {
    message0: "语音   %1   执行   %2   延时   %3秒",
    args0: [
        {
            type: 'field_input',
            name: 'param',
            text: '请输入要说的话'
        },
        {
            type: "field_dropdown",
            name: 'iswait',
            options: [
                ["后", "0"],
                ["前", "1"],
            ]
        }, {
            type: 'field_input',
            name: 'secs',
            text: '0'
        }
    ],
    "colour": '#8080FF',
    "nextStatement": "Action",
    "previousStatement": "Action",
};

Blockly.Blocks["block_speak"] = {
    init: function () {
        this.jsonInit(block_speak)
    }
};
Blockly.JavaScript.block_speak = function (a) {
    var param = a.getFieldValue("param");
    var iswait = a.getFieldValue("iswait");
    var secs = a.getFieldValue("secs");
    var res =
        '{"code":"10200","unitName":"说话","waitingTime":"' +
        secs + '","params":"' + param + '","type":"1","isWaitFinish":"' +
        iswait + '"},';
    return res;
};