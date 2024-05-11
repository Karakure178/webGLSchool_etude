import * as THREE from 'three';
import { gui_setup } from './guiBase.js';
import { adjustment_deviceDisplay } from './three_libraries/renderer_setup.js';
import { create_camera } from './three_libraries/camera_setup.js';
import { createShader } from './createShader.js';
import { map } from './three_libraries/map.js';
import { radians } from './three_libraries/radians.js';

function init() {
  /* || 初期セットアップ */
  // 高さの設定
  const height = window.innerHeight;
  // シーンの作成
  const scene = new THREE.Scene();
  // レンダラーの作成
  const renderer = new THREE.WebGLRenderer();
  adjustment_deviceDisplay(renderer, height);
  // カメラの作成
  const camera = create_camera(scene, -0.5, 1, 4, height);
  const control = gui_setup(camera, scene, renderer);
  /* || 初期セットアップ終わり */

  /* || メッシュの設定 */
  // マテリアルの設定
  const material = createShader();

  // ジオメトリ設定
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.z = -5;
  mesh.position.x = 0;
  scene.add(mesh);

  const triangle_num = 3;
  const triangle_points = [];
  const triangle_slope = []; //線の傾きを入れる
  const triangle_x = [-1, 1, 0];
  const triangle_y = [-1, -1, 1];
  const triangle_color = new THREE.Color();
  const triangle_colors = [];
  const distance_triangle_points = []; // 傾きからちゃんと値求めれてるかの確認用
  for (let i = 0; i < triangle_num; i++) {
    const coordinatePoint = new THREE.Vector3(triangle_x[i], triangle_y[i], 0);
    triangle_color.setHSL(0.6, 1, map(Math.cos(radians(i * 60)), -1, 1, 0.5, 1), THREE.SRGBColorSpace);
    triangle_colors.push(triangle_color.r, triangle_color.g, triangle_color.b);
    triangle_points.push(coordinatePoint);
    //傾きから値を求めて座標間の中間点を作る
    for (let j = 0.1; j <= 1.0; j += 0.1) {
      if (i + 1 < triangle_num) {
        const slope = (triangle_y[i] - triangle_y[0]) / (triangle_x[i] - triangle_x[0]);
        triangle_slope.push(slope);
        // TODO map関数からjの値をx-x1の範囲へ修正する
        const x = map(j, 0.1, 1.0, triangle_x[i], triangle_x[0]);
        // TODO 座標点を割り出して、配列の配列に追加する  new THREE.Vector3(x,y,z)
        const y =
          ((triangle_y[i] - triangle_y[0]) / (triangle_x[i] - triangle_x[0])) * (x - triangle_x[0]) + triangle_y[0];
        const distance_coordinatePoint = new THREE.Vector3(x, y, 0);
        distance_triangle_points.push(distance_coordinatePoint);
      } else {
        const slope = (triangle_y[i] - triangle_y[i]) / (triangle_x[i] - triangle_x[i]);
        triangle_slope.push(slope);
        // TODO 記述の追加
      }
    }
  }

  const triangle_geometry = new THREE.BufferGeometry().setFromPoints(triangle_points);
  triangle_geometry.setAttribute('color', new THREE.Float32BufferAttribute(triangle_colors, 3));
  const triangle_material = new THREE.LineBasicMaterial({ color: 0xffffff, vertexColors: true });
  const little_line = new THREE.LineLoop(triangle_geometry, triangle_material);
  scene.add(little_line);

  const distance_geometry = new THREE.BufferGeometry().setFromPoints(distance_triangle_points);
  // TODO 修正
  //triangle_geometry.setAttribute('color', new THREE.Float32BufferAttribute(triangle_colors, 3));
  //const triangle_material = new THREE.LineBasicMaterial({ color: 0xffffff, vertexColors: true });
  //const little_line = new THREE.LineLoop(triangle_geometry, triangle_material);
  //scene.add(little_line);
  /* || メッシュの設定終わり */

  /* || ループ処理設定 */
  let clock = new THREE.Clock();
  function tick() {
    requestAnimationFrame(tick);
    // アニメーション受け取り用シェーダーの値
    const uniforms = mesh.material.uniforms;
    // frameの受け取り
    uniforms.time.value += clock.getDelta();
    renderer.render(scene, camera);
    control.update();
  }
  tick();
  /* || ループ処理設定終わり */
}

window.addEventListener('DOMContentLoaded', () => {
  init();
});
