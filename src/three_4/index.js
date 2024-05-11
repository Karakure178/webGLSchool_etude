import * as THREE from 'three';
import { gui_setup } from './guiBase.js';
import { adjustment_deviceDisplay } from './three_libraries/renderer_setup.js';
import { create_camera } from './three_libraries/camera_setup.js';
import { createShader } from './createShader.js';
import { map } from './three_libraries/map.js';
import { radians } from './three_libraries/radians.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { CopyShader } from './shader/customPass.js';
import { WarpShader } from './shader/customPass_warp.js';
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';

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

  let isNotGlitch = false; // 途中でグリッチエフェクトをはがすためのフラグ
  const glitchPass = new GlitchPass();
  composer.addPass(glitchPass);

  // 自作シェーダーを追加（歪み追加）
  let isNotWarp = false; // 途中で歪みエフェクトをはがすためのフラグ
  const warpShader = new ShaderPass(WarpShader);
  composer.addPass(warpShader);

  // 自作シェーダーを追加（走査線）
  const shaderPass = new ShaderPass(CopyShader);
  composer.addPass(shaderPass);

  // ポストエフェクトをレンダリングする
  const outputPass = new OutputPass();
  composer.addPass(outputPass);
  /* || 初期セットアップ終わり */

  /* || メッシュの設定 */
  const material = createShader(); // マテリアルの設定
  const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5); // ジオメトリ設定

  const num_group = 5;
  const groups = [];
  for (let j = 0; j < num_group; j++) {
    // グループの作成
    const meshs = [];
    const num = 30;
    const angle = 360 / num;
    const circle_radius = map(Math.random(), 0, 1, 1, 3);

    for (let i = 0; i < num; i++) {
      const mesh = new THREE.Mesh(geometry, material);
      drawCircles(0, 0, circle_radius, mesh, angle * i);
      meshs.push(mesh);
    }
    const group = new THREE.Group();
    group.add(...meshs);
    const rotate_axis = randomRotateCircle(group);
    group.name = `group-${j}`;
    scene.add(group);
    groups.push({ group, rotate_axis });
  }
  /* || メッシュの設定終わり */

  groups[1].group.rotation.x = Math.PI / 10;
  groups[0].group.position.x = -Math.PI / 10;

  /* || ループ処理設定 */
  let clock = new THREE.Clock();
  function tick() {
    requestAnimationFrame(tick);
    // frameの受け取り
    const time = clock.getDelta();
    groups.forEach((item) => {
      if (item.rotate_axis === 'x') {
        item.group.rotation.x += time;
      } else if (item.rotate_axis === 'y') {
        item.group.rotation.y += time;
      } else {
        item.group.rotation.z += time;
      }
    });

    // アニメーション受け取り用シェーダーの値
    const uniforms = shaderPass.material.uniforms;
    uniforms.u_time.value = clock.getElapsedTime();

    const uniforms_warp = warpShader.material.uniforms;
    uniforms_warp.u_time.value = clock.getElapsedTime();

    composer.render();
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
 * @param {number} circle_radius - 円の半径
 * @param {THREE.Mesh} mesh - meshインスタンス
 * @param {number} angle - 配置する角度
 * @description 円を描く関数 boxを使って円を描く
 */
const drawCircles = (x, y, circle_radius, mesh, angle) => {
  const tx = circle_radius * Math.cos(radians(angle));
  const ty = circle_radius * Math.sin(radians(angle));
  mesh.position.x = x + tx;
  mesh.position.y = y + ty;
  const size = map(circle_radius, 1, 3, 0.1, 0.5);
  mesh.scale.set(size, size, size);
};

/**
 * @function randomRotateCircle
 * @param {THREE.Group} group - グループインスタンス
 * @description cirlceが書かれたグループをランダムに回転させる
 */
const randomRotateCircle = (group) => {
  const random_axis = Math.random();
  let rotate_axis; // 回転を続ける軸
  if (random_axis < 0.33) {
    group.rotation.x = Math.random() * Math.PI;
    rotate_axis = 'z';
  } else if (random_axis < 0.66) {
    group.rotation.y = Math.random() * Math.PI;
    rotate_axis = 'x';
  } else {
    group.rotation.z = Math.random() * Math.PI;
    rotate_axis = 'y';
  }
  return rotate_axis;
};

window.addEventListener('DOMContentLoaded', () => {
  init();
});
