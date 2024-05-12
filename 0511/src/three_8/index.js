import * as THREE from 'three';
import { gui_setup } from './guiBase.js';
import { adjustment_deviceDisplay } from './three_libraries/renderer_setup.js';
import { create_camera, camera_animation } from './three_libraries/camera_setup.js';
import { drawCircles, paramRotateCircle, anime } from './manFunc.js';
import { group_parameter, camera_parameter, anime_parameter } from './parameter.js';

const init = () => {
  /* || 初期セットアップ */
  const height = window.innerHeight; // 高さの設定
  const scene = new THREE.Scene(); // シーンの作成
  const renderer = new THREE.WebGLRenderer(); // レンダラーの作成
  adjustment_deviceDisplay(renderer, height);

  // カメラの作成
  const camera = create_camera(scene, 0, 15, 0, height);
  /* || 初期セットアップ終わり */

  /* || メッシュの設定 */
  const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5); // ジオメトリ設定

  const num_group = 5;
  // カラーグループの設定
  const color_group1 = [0x003c43, 0x135d66, 0x77b0aa, 0xe3fef7];
  const color_group2 = [0xa34343, 0xe9c874, 0xfbf8dd, 0xc0d6e8];

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
    if (Math.random() < 0.5) {
      colors = color_group1[random_index];
    } else {
      colors = color_group2[random_index];
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

  const myCamera = new THREE.PerspectiveCamera(75, window.innerWidth / height, 0.1, 10000);
  const control = gui_setup(myCamera, scene, renderer, groups);

  /* || ループ処理設定 */
  let clock = new THREE.Clock();
  function tick() {
    requestAnimationFrame(tick);
    // frameの受け取り
    const time = clock.getDelta();
    anime(groups, time, anime_parameter);

    // カメラアニメーション
    camera_animation(scene, camera, camera_parameter, anime_parameter);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // 画面の更新系
    renderer.render(scene, camera);
    control.update();
  }
  tick();
  /* || ループ処理設定終わり */
};

window.addEventListener('DOMContentLoaded', () => {
  init();
});
