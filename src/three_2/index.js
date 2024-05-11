import * as THREE from 'three';
import { gui_setup } from './guiBase.js';
import { adjustment_deviceDisplay } from './three_libraries/renderer_setup.js';
import { create_camera } from './three_libraries/camera_setup.js';
import { createShader } from './createShader.js';
import { map } from './three_libraries/map.js';
import { radians } from './three_libraries/radians.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const init = () => {
  /* || 初期セットアップ */
  const height = window.innerHeight; // 高さの設定
  const scene = new THREE.Scene(); // シーンの作成
  const renderer = new THREE.WebGLRenderer(); // レンダラーの作成
  adjustment_deviceDisplay(renderer, height);

  // カメラの作成
  const camera = create_camera(scene, -0.5, 1, 4, height);
  const control = gui_setup(camera, scene, renderer);

  // ポストエフェクトを実装する
  // 実装参考：https://threejs.org/docs/#manual/ja/introduction/How-to-use-post-processing
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera)); // レンダリングパスを追加

  const glitchPass = new GlitchPass();
  composer.addPass(glitchPass);

  // ポストエフェクトをレンダリングする
  const outputPass = new OutputPass();
  composer.addPass(outputPass);
  /* || 初期セットアップ終わり */

  /* || メッシュの設定 */
  const material = createShader(); // マテリアルの設定
  const geometry = new THREE.BoxGeometry(1, 1, 1); // ジオメトリ設定

  const meshs = [];
  const num = 10;
  const angle = 360 / num;

  for (let i = 0; i < num; i++) {
    const mesh = new THREE.Mesh(geometry, material);
    drawCircles(0, 0, 0, mesh, angle * i);
    //scene.add(mesh);
    meshs.push(mesh);
  }
  const group = new THREE.Group();
  group.add(...meshs);
  group.rotation.x = Math.PI / 4;
  scene.add(group);
  /* || メッシュの設定終わり */

  /* || ループ処理設定 */
  let clock = new THREE.Clock();
  function tick() {
    requestAnimationFrame(tick);

    // アニメーション受け取り用シェーダーの値
    //const uniforms = mesh.material.uniforms;
    // frameの受け取り
    group.rotation.y += clock.getDelta();
    //uniforms.time.value += clock.getDelta();

    composer.render();
    //renderer.render(scene, camera);
    control.update();
  }
  tick();
  /* || ループ処理設定終わり */
};

// ==========================================
// 描画系関数群の定義
// ==========================================
/**
 * @function drawCircles
 * @param {number} x - 円の中心座標x
 * @param {number} y - 円の中心座標y
 * @param {number} z - 円の中心座標z
 * @param {THREE.Mesh} mesh - meshインスタンス
 * @param {number} angle - 配置する角度
 * @description 円を描く関数 boxを使って円を描く
 */
const drawCircles = (x, y, z, mesh, angle) => {
  const tx = 3 * Math.cos(radians(angle));
  const ty = 3 * Math.sin(radians(angle));
  mesh.position.x = x + tx;
  mesh.position.y = y + ty;
};

window.addEventListener('DOMContentLoaded', () => {
  init();
});
