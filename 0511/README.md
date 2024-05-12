# P5.js 開発環境テンプレート(2023年度版)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

モジュールバンドルである[Vite](https://vitejs.dev/)を使って [p5.js](https://p5js.org) を使った作品が作れるようになるテンプレートです。複数の作品を一括管理できるのが本環境の特徴です。

npm installで他のライブラリを使用した作品も作れます。

## インストール

以下コマンドを打つことで環境が構築できます。まだgit、nodejsを入れていない場合は先に入れてから実行してください。

```sh
git clone https://github.com/Karakure178/p5js_mydev2023.git

cd p5js_mydev2023
npm install
```

## npm scripts

- `npm start` - 開発用のポートが開きます [5173](http://localhost:5173/)
- `npm run build` - `dist` フォルダへ個々のフォルダごとにビルドします。

## 作品制作の始め方
以下コマンドを打つと開発環境が立ち上がります。
```sh
npm start
```

`src`以下のフォルダごとに作品を分けることで個別に作品管理が可能になります。

初期時点ではサンプルとして以下のフォルダにアクセスすることができます。

http://localhost:5173/p5test/

http://localhost:5173/p5test2/


p5_testフォルダをそのまま`src`フォルダ以下にコピー＆ペーストしてフォルダ名を変えるとそのフォルダ名をリンクとしてアクセスできるようになります。


## License

This project is open source and available under the [MIT License](LICENSE).
