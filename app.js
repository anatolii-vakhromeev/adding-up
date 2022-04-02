'use strict';
const fs = require('fs'); //FileSystem:ファイルを扱うモジュール
const readline = require('readline');//readLine:ファイルを1行ずつ読むためのモジュール
const rs = fs.createReadStream('./popu-pref.csv');//Streamを生成
const rl = readline.createInterface({ input: rs, output: {} });
const prefectureDataMap = new Map();
rl.on('line', lineString => {//lineというイベント発生時に無名関数を呼ぶ
    const columns = lineString.split(',');//Srtingをカンマごとに1項目になるよう分ける
    const year = parseInt(columns[0]);//parseIntは整数に変換する関数。ここでは文字列を数値に変換している。
    const prefecture = columns[1];
    const popu = parseInt(columns[3]);
    if (year === 2010 || year === 2015) {
        let value = null;
        if (prefectureDataMap.has(prefecture)) {
            value = prefectureDataMap.get(prefecture);
        } else {
            value = {
                popu10: 0,
                popu15: 0,
                change: null
            };
        }
        if (year === 2010) {
            value.popu10 = popu;
        }
        prefectureDataMap.set(prefecture, value);
        if (year === 2015) {
            value.popu15 = popu;
        }
    }
});
rl.on('close', () => {
    for (const [key, value] of prefectureDataMap) {
        value.change = value.popu15 / value.popu10;
    }
    const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
        return pair2[1].change - pair1[1].change;
    });
    const rankingStrings = rankingArray.map(([key, value]) => {
        return (
            `${key}: ${value.popu10}=>${value.popu15} 変化率: ${value.change}`
        );;
    })
    console.log(rankingStrings)
});