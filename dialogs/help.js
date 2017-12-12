const builder = require('botbuilder');

// この機能の名前を定義
var lib = new builder.Library('Help');

// 機能を実行する為のキーワードの正規表現
const triggerRegExp = "^help$"

// 実装されているヘルプの一覧
const func = [
    "wiki",
    "travel",
    "weather"
]

// 他機能の未実行時に開始するヘルプ機能
lib.dialog('help_global', [
    (session, args, next) => {
        // ユーザーにどの機能のヘルプを実行したいかを問い合わせる
        builder.Prompts.choice(session, "詳しく知りたい機能を選んでください", func);
    },
    (session, res, next) => {

        // ユーザーが選択した機能に振り分ける
        switch (res.response.entity) {
            case "wiki":
                session.replaceDialog("help_wiki")
                break;
            case "travel":
                session.replaceDialog("help_travel")
                break;
            case "weather":
                session.replaceDialog("help_weather")
                break;
        }
    }

    // この機能を実行するためのトリガーを定義
]).triggerAction({
    matches: RegExp(triggerRegExp),
    confirmPrompt: "This will cancel your current request. Are you sure?",

    // デフォルトでは、ダイアログスタックが全て初期化されるため
    // それを回避する為の定義
    onSelectAction: (session, args, next) => {
        session.beginDialog(args.action, args);
    }
});

// wikiのヘルプを定義する
lib.dialog("help_wiki", [
    (session, args, next) => {
        session.send("Wikipediaでキーワードの概要を検索します。");
        session.send("wiki Bot");
        session.endConversation("と入力して頂くと、Botとは何かを私が検索します。");
    }
])

// travelのヘルプを定義する
lib.dialog("help_travel", [
    (session, args, next) => {
        session.send("ゲームのtravelで遊べます");
        session.endConversation("travel と入力すると開始します");
    }
])
// 天気予報のヘルプを定義する
lib.dialog("help_weather", [
    (session, args, next) => {
        session.send("毎日８時に天気予報を取得します。");
        session.endConversation("weatherと入力すると開始します。");
    }
])

module.exports.createLibrary = function () {
    return lib.clone();
};
