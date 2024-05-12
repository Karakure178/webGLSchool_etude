import * as THREE from 'three';
import { gui_setup } from './guiBase.js';
import { adjustment_deviceDisplay } from './three_libraries/renderer_setup.js';
import { create_camera } from './three_libraries/camera_setup.js';
import { map } from './three_libraries/map.js';
import { radians } from './three_libraries/radians.js';

const init = () => {
  /* || 初期セットアップ */
  const height = window.innerHeight; // 高さの設定
  const scene = new THREE.Scene(); // シーンの作成
  const renderer = new THREE.WebGLRenderer(); // レンダラーの作成
  adjustment_deviceDisplay(renderer, height);

  // カメラの作成
  const camera = create_camera(scene, -0.5, 1, 4, height);
  /* || 初期セットアップ終わり */

  /* || メッシュの設定 */
  const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5); // ジオメトリ設定

  const num_group = 5;
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
    const circle_radius = map(Math.random(), 0, 1, 1, 3);

    // 円状にmeshを配置
    for (let i = 0; i < num; i++) {
      const mesh = new THREE.Mesh(geometry, material);
      drawCircles(0, 0, circle_radius, mesh, angle * i);
      meshs.push(mesh);
    }

    const group = new THREE.Group();
    group.add(...meshs);
    const rotateGroup = randomRotateCircle(group);
    const rotate_axis = rotateGroup.rotate_axis;
    const angle_init = rotateGroup.angle_init;
    const angle_axis = rotateGroup.angle_axis;

    group.name = `group-${j}`;
    scene.add(group);
    groups.push({ group, rotate_axis, circle_radius, angle_init, angle_axis });
  }
  /* || メッシュの設定終わり */

  const control = gui_setup(camera, scene, renderer, groups);

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

    renderer.render(scene, camera);
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
  let angle_init = 0; // 初期時点の角度
  let angle_axis; // angle_initを足す軸
  if (random_axis < 0.33) {
    angle_init = Math.random() * Math.PI;
    angle_axis = 'x';

    group.rotation.x = angle_init;
    rotate_axis = 'z';
  } else if (random_axis < 0.66) {
    angle_init = Math.random() * Math.PI;
    angle_axis = 'y';

    group.rotation.y = angle_init;
    rotate_axis = 'x';
  } else {
    angle_init = Math.random() * Math.PI;
    angle_axis = 'z';

    group.rotation.z = angle_init;
    rotate_axis = 'y';
  }
  return { rotate_axis, angle_init, angle_axis };
};

window.addEventListener('DOMContentLoaded', () => {
  init();
});
