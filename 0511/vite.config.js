import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl'; //これのためにpackage.jsonにtype:moduleを追加した
import { resolve } from 'path';
import liveReload from 'vite-plugin-live-reload'; //Dev時のファイルリロード監視に任意のファイルを追加できるようにするため

// HTMLの複数出力を自動化する
//./src配下のファイル一式を取得
import fs from 'fs';
const fileNameList = fs.readdirSync(resolve(__dirname, './src'));

//build.rollupOptions.inputに渡すオブジェクトを生成
const inputFiles = {};
for (let i = 0; i < fileNameList.length; i++) {
  const file = fileNameList[i];
  inputFiles[file] = resolve(__dirname, `./src/${file}/index.html`);
  /*
    この形を自動的に作る
    input:{
      index: resolve(__dirname, './src/index.html'),
      list: resolve(__dirname, './src/list.html')
    }
  */
}

console.log(inputFiles);

export default defineConfig({
  server: {
    host: true, //IPアドレスを有効化
  },
  base: './', //相対パスでビルドする
  root: './src', //開発ディレクトリ設定
  build: {
    outDir: '../dist', //出力場所の指定
    rollupOptions: {
      //ファイル出力設定
      output: {
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split('.')[1];
          //Webフォントファイルの振り分け
          if (/ttf|otf|eot|woff|woff2/i.test(extType)) {
            extType = 'fonts';
          }
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'images';
          }
          //ビルド時のCSS名を明記してコントロールする
          if (extType === 'css') {
            return `assets/css/[name].css`;
          }
          return `assets/${extType}/[name][extname]`;
        },
        chunkFileNames: 'assets/js/[name].js',
        entryFileNames: 'assets/js/[name].js',
      },
      //input:
      //生成オブジェクトを渡す
      input: inputFiles,
    },
  },
  // glslファイルをimportできるようにする 参考↓
  // https://www.npmjs.com/package/vite-plugin-glsl
  plugins: [liveReload('**/*.html'), glsl()],
});

//参考にした記事：https://zenn.dev/hiiiita/articles/a4881dab7226aa
