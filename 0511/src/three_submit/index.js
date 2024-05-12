import * as THREE from 'three';
import { adjustment_deviceDisplay } from './three_libraries/renderer_setup.js';
import { create_camera, camera_animation } from './three_libraries/camera_setup.js';
import { drawCircles, paramRotateCircle, anime } from './manFunc.js';
import { group_parameter, camera_parameter, anime_parameter, composer_parameter } from './parameter.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { CopyShader } from './shader/customPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const init = () => {
  /* || 初期セットアップ */
  const height = window.innerHeight; // 高さの設定
  const scene = new THREE.Scene(); // シーンの作成
  const renderer = new THREE.WebGLRenderer(); // レンダラーの作成
  const backgroundColor = new THREE.Color(0x060505);
  renderer.setClearColor(backgroundColor);
  adjustment_deviceDisplay(renderer, height);

  // カメラの作成
  const camera = create_camera(scene, 0, 15, 0, height);

  // エフェクトの設定
  // ポストエフェクトを実装する
  // 実装参考：https://threejs.org/docs/#manual/ja/introduction/How-to-use-post-processing
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera)); // レンダリングパスを追加

  // 自作シェーダーを追加（走査線）
  const shaderPass = new ShaderPass(CopyShader);
  composer.addPass(shaderPass);

  const outputPass = new OutputPass();
  composer.addPass(outputPass);

  /* || 初期セットアップ終わり */

  /* || メッシュの設定 */
  const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5); // ジオメトリ設定

  const num_group = 5;
  // カラーグループの設定
  const color_group1 = [0x003c43, 0x135d66, 0x77b0aa, 0xe3fef7];
  const color_group2 = [0xa34343, 0xe9c874, 0xfbf8dd, 0xc0d6e8];
  const color_group3 = [0x59d5e0, 0xf5dd61, 0xfaa300, 0xf4538a];

  /**
   * @description グループの設定
   * @type {Array}
   * @property {THREE.Group} group - グループインスタンス
   * @property {string} rotate_axis - 回転軸
   * @property {number} circle_radius - 円の半径
   * @property {number} angle_init - 初期角度
   * @property {string} angle_axis - 角度の軸
   */
  const groups = [];

  for (let j = 0; j < num_group; j++) {
    let colors;
    const random_index = parseInt(Math.random() * 4);
    if (Math.random() < 0.33) {
      colors = color_group1[random_index];
    } else if (Math.random() < 0.66) {
      colors = color_group2[random_index];
    } else {
      colors = color_group3[random_index];
    }
    const material = new THREE.MeshBasicMaterial({ color: colors });
    // グループの作成
    const meshs = [];
    const num = 30;
    const angle = 360 / num;
    const circle_radius = group_parameter[j].radius; //map(Math.random(), 0, 1, 1, 3);

    // 円状にmeshを配置
    for (let i = 0; i < num; i++) {
      const mesh = new THREE.Mesh(geometry, material);
      drawCircles(0, 0, circle_radius, mesh, angle * i);
      meshs.push(mesh);
    }

    const group = new THREE.Group();
    group.add(...meshs);
    const rotateGroup = paramRotateCircle(group, group_parameter[j]);
    const rotate_axis = rotateGroup.rotate_axis;
    const angle_init = rotateGroup.angle_init;
    const angle_axis = rotateGroup.angle_axis;

    group.name = `group-${j}`;
    scene.add(group);
    groups.push({ group, rotate_axis, circle_radius, angle_init, angle_axis });
  }
  /* || メッシュの設定終わり */

  /* || ループ処理設定 */
  let clock = new THREE.Clock();
  function tick() {
    requestAnimationFrame(tick);
    // frameの受け取り
    const time = clock.getDelta();
    // アニメーション受け取り用シェーダーの値
    const uniforms = shaderPass.material.uniforms;
    uniforms.u_time.value = clock.getElapsedTime();
    anime(groups, composer, time, anime_parameter, composer_parameter, clock.getElapsedTime());

    // カメラアニメーション
    camera_animation(scene, camera, camera_parameter, anime_parameter);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // 画面の更新系
    composer.render();
  }
  tick();
  /* || ループ処理設定終わり */
};

window.addEventListener('DOMContentLoaded', () => {
  init();
});
