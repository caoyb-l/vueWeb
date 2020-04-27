(function () {
    if (window.RobotJsBridge) {
        // Android加上了这个if判断，如果当前window已经定义了RobotJsBridge对象，不再重新加载
        return
    }

    var JSBridge;

    function init(config) {
        JSBridge = config.bridge;
        JSBridge.init(function (msg, callback) {

        })
    }

    var app = {

        /**
         *  让机器人说话
         * @param text
         */
        tts: function (text,callBack) {
            JSBridge.callHandler('tts',text,function (result) {
                callBack(result)
            })
        },

        /**
         * 让机器人改变表情
         * @param text
         */
        expression: function (text,callBack) {
            JSBridge.callHandler('expression',text,function (result) {
                callBack(result)
            })
        },

        /**
         * 让机器人执行单个动作
         * @param text
         */
        action: function (text,callBack) {
            JSBridge.callHandler('action',text,function (result) {
                callBack(result)
            })
        },

        /**
         * 让机器人执行动作集任务
         * @param text
         */
        task: function (text,callBack) {
            JSBridge.callHandler('task',text,function (result) {
                callBack(result)
            })
        },

        /**
         * app 的统一吐司提示
         * @param text
         */
        toast: function (text){
            JSBridge.callHandler('toast',text,function (result) {
            })
        },

    }

    window.RobotJsBridge = {
        init: init,
        app: app
    }
    document.addEventListener("WebViewJavascriptBridgeReady", function onReady(ev) {
        RobotJsBridge.init({'bridge': ev.bridge})
    })
})();