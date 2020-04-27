/**
 * 2019-08-13
 * writer:lzy
 * 图片全屏、内容区 10237\10239
 * 隐藏全屏、内容区10238\10240
 * 打开网页 10245
 * 回到主界面 10246
 * 视频播放 10243
 * 音频播放 10241
 */

"use strict";
goog.provide("Blockly.Blocks.lists"); // Deprecated
goog.provide("Blockly.Constants.Lists");
goog.require("Blockly.Blocks");
goog.require("Blockly");

// 多媒体
// 图片全屏 10237\10239

var block_img_fullScreen = {
    message0: "%1显示图片  链接%2   延时   %3秒",
    args0: [
        {
            type: 'field_dropdown',
            name: 'typeId',
            options: [
                ["全屏", "10237"],
                ["内容区", "10239"],
            ]
        }, {
            type: 'field_input',
            name: 'param',
            text: '    '
        }, {
            type: 'field_input',
            name: 'secs',
            text: '0'
        }
    ],
    "colour": '#13C2C2',
    "nextStatement": "Action",
    "previousStatement": "Action",
};

Blockly.Blocks["block_img_fullScreen"] = {
    init: function () {
        this.jsonInit(block_img_fullScreen)
    }
};
Blockly.JavaScript.block_img_fullScreen = function (a) {
    var param = a.getFieldValue("param");
    var secs = a.getFieldValue("secs");
    var typeId = a.getFieldValue("typeId");
    var res =
        '{"code":"' + typeId + '","unitName":"图片显示","waitingTime":"' +
        secs + '","params":"' + param + '","type":"8"},';

    return res;
};


// 隐藏（全屏）10238\10240
var block_hiden_fullScreen = {
    message0: "隐藏   %1 图片  延迟   %2秒",
    args0: [
        {
            type: 'field_dropdown',
            name: 'typeId',
            options: [
                ["全屏", "10238"],
                ["内容区", "10240"],
            ]
        }, {
            type: 'field_input',
            name: 'secs',
            text: '0'
        }
    ],
    "colour": '#13C2C2',
    "nextStatement": "Action",
    "previousStatement": "Action",
};

Blockly.Blocks["block_hiden_fullScreen"] = {
    init: function () {
        this.jsonInit(block_hiden_fullScreen)
    }
};
Blockly.JavaScript.block_hiden_fullScreen = function (a) {
    var typeId = a.getFieldValue("typeId");
    var secs = a.getFieldValue("secs");
    var res =
        '{"code":"' + typeId + '","unitName":"隐藏图片","waitingTime":"' +
        secs +
        '","type":"8"},';

    return res;
};

// 音频播放 10241
var block_play_audio = {
    message0: "播放音频   链接>%1   延迟> %2秒   ",
    args0: [
        {
            type: 'field_input',
            name: 'param',
            text: '    '
        }, {
            type: 'field_input',
            name: 'secs',
            text: '0'
        }
    ],
    "colour": '330',
    "nextStatement": "Action",
    "previousStatement": "Action",
};

Blockly.Blocks["block_play_audio"] = {
    init: function () {
        this.jsonInit(block_play_audio)
    }
};
Blockly.JavaScript.block_play_audio = function (a) {
    var param = a.getFieldValue("param");
    var secs = a.getFieldValue("secs");
    var res =
        '{"code":"10241","unitName":"音频播放","waitingTime":"' +
        secs + '","params":"' + param + '","type":"8"},';

    return res;
};

// 视频播放 10243
var block_play_video = {
    message0: "视频   链接>%1   延迟> %2秒",
    args0: [
        {
            type: 'field_input',
            name: 'param',
            text: '    '
        }, {
            type: 'field_input',
            name: 'secs',
            text: '0'
        }
    ],
    "colour": '330',
    "nextStatement": "Action",
    "previousStatement": "Action",
};

Blockly.Blocks["block_play_video"] = {
    init: function () {
        this.jsonInit(block_play_video)
    }
};
Blockly.JavaScript.block_play_video = function (a) {
    var param = a.getFieldValue("param");
    var secs = a.getFieldValue("secs");
    var res =
        '{"code":"10243","unitName":"视频播放","waitingTime":"' +
        secs + '","params":"' + param + '","type":"8"},';

    return res;
};

// 打开一个网页 10245
var block_openUrl = {
    message0: "打开网页> %1",
    args0: [
        {
            type: 'field_input',
            name: 'param',
            text: ''
        }
    ],
    "colour": '330',
    "nextStatement": "Action",
    "previousStatement": "Action",
};

Blockly.Blocks["block_openUrl"] = {
    init: function () {
        this.jsonInit(block_openUrl)
    }
};
Blockly.JavaScript.block_openUrl = function (a) {
    var param = a.getFieldValue("param");
    var secs = a.getFieldValue("secs");
    var res =
        '{"code":"10245","unitName":"打开网页","waitingTime":"0","params":"' + param + '","type":"8"},';

    return res;
};

// 回到主界面 10246
var block_backHome = {
    message0: "回到主页",
    args0: [

    ],
    "colour": '330',
    "nextStatement": "Action",
    "previousStatement": "Action",
};

Blockly.Blocks["block_backHome"] = {
    init: function () {
        this.jsonInit(block_backHome)
    }
};
Blockly.JavaScript.block_backHome = function (a) {
    var res =
        '{"code":"10246","unitName":"回到主界面","waitingTime":"0","type":"8"},';

    return res;
};