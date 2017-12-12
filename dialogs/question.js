const builder = require('botbuilder');

// このライブラリにtravelという名前をつける
var lib = new builder.Library('travel');

//質問内容を定義
const question = [
    "予算は１０万円以下？",
    "おいしいものが食べたいですか？",
    "世界遺産に興味はありますか？",
];

// ユーザーに問いかける際のメッセージと回答に関連する情報を定義する
const menu = {
    "YES": {
        score: 1
    },
    "NO": {
        score: 0
    }
}

// 機能が呼び出される文字列の正規表現 (travel 又は travel と入力されると実行する)
const triggerRegExp = "^travel$"

// ライブラリにダイアログを定義する
// 機能が開始して最初のダイアログを定義している
lib.dialog('travel', [
    (session, args, next) => {
        // まだゲームは開始されていない
        session.send("おすすめの旅行先を答えます！");

        // 第２引数がユーザーへの問いかけ
        // 第３引数がユーザーの選択肢
        builder.Prompts.choice(session, "準備はいいですか？", ["START", "CANCEL"]);
    },
    (session, res, next) => {
        // ユーザーの回答で処理を振り分け
        switch (res.response.entity) {
            // ゲームを開始する
            case "START":
                session.send("始めます！");
                session.privateConversationData.question_num = 0;
                session.privateConversationData.score = 0;

                // ゲームを実際に開始する
                // travel_questionと名前の付いたダイアログをスタックに追加する
                session.beginDialog("travel_question");
                break;

            case "CANCEL": // 中止することをユーザーに伝え、会話を終了する
                session.endConversation("中止します");
                break;
        }
    },
    (session, args, next) => {
        // スコアを確認してユーザーがイメージした物を回答する
        if (session.privateConversationData.score = 0) {

            // scoreが0より大きい場合、
            session.send("アルゼンチンはいかが？　http://www.arukikata.co.jp/country/AR/");
            　行きたい？");
            builder.Prompts.choice(session, "YES or NO!", menu);

        } else if (session.privateConversationData.score = 1) {
            // scoreが0未満の場合、
            session.send("クロアチアがおすすめです！！　http://zagreb-apt.com/croatia-travel
            　行きたい？");
            builder.Prompts.choice(session, "YES or NO!", menu);

        } else if (session.privateConversationData.score = 2) {
            // scoreが0未満の場合、
            session.send("ベトナムはどうですか？　http://www.hankyu-travel.com/guide/vietnam/");
            　行きたい？");
            builder.Prompts.choice(session, "YES or NO!", menu);

        } else {
            //scoreが3だった時は回答不能
            session.send("台湾！！　http://www.hankyu-travel.com/guide/taiwan/");
            　行きたい？");
            builder.Prompts.choice(session, "YES or NO!", menu);
        }
    },
    (session, results, next) => {
        // 予想が当たったのかをユーザーが回答した時の処理
        if (menu[results.response.entity].score == 1) {
            session.endConversation("当たりました！");
        } else if (menu[results.response.entity].score == 0) {
            session.endConversation("外れました...");
        }
    }

    // この機能を実行するためのトリガーを定義
]).triggerAction({
    matches: [RegExp(triggerRegExp)],
    confirmPrompt: "travelゲームを始めますか？"

    // travel実施中にヘルプが打たれたら、travelに関するヘルプを実行する
}).beginDialogAction("travelHelpAction", "Help:help_travel", {
    matches: /^help$/i,

    // ゲームを途中で中止させる為のキーワードと処理を定義
}).cancelAction('canceltravel', "キャンセルしました", {
    // キャンセルのトリガーとなるパターンを定義
    matches: /^cancel|^stop|^end/i,
    // キャンセルを再度確認する為にユーザーへ送信される文字列
    confirmPrompt: "travelを終了しますか？",
});

// travel_question
lib.dialog("travel_question", [
    (session, args) => {
        // ゲームが正常に開始されているかを判定
        if (session.privateConversationData.hasOwnProperty("question_num")) {
            // 現在の質問番号を取得する
            var question_num = session.privateConversationData.question_num

            //次の質問をユーザーに送信する
            session.send("Q" + (question_num + 1) + ":" + question[question_num]);

            //yes no の選択肢をユーザーに送信する
            builder.Prompts.choice(session, "YES or NO!", menu);

        } else { // question_numが格納されていない場合は処理に問題があったということ
            session.send("ゲームに問題が有りました。")
            session.endConversation("中止します");
        }
    },
    // yes no の回答をユーザーが行った時の処理
    (session, results) => {
        if (results.response) {
            // 回答をもとにスコアを計算する
            session.privateConversationData.score += menu[results.response.entity].score;

            //現在の質問番号を加算する
            session.privateConversationData.question_num++;

            // 全て質問したかをチェック
            if (session.privateConversationData.question_num >= question.length) {
                // 質問するダイアログ終了する
                session.endDialog();

            } else {
                // まだ質問が終わっていないので、繰り返す
                session.replaceDialog("travel_question");
            }
        }
    }
]);
module.exports.createLibrary = function () {
    return lib.clone();
};
