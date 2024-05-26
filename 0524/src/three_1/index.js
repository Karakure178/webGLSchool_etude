import * as THREE from 'three';
import { gui_setup } from './guiBase.js';
import { adjustment_deviceDisplay } from './three_libraries/renderer_setup.js';
import { create_camera } from './three_libraries/camera_setup.js';
import { map } from './three_libraries/map.js';
import { radians } from './three_libraries/radians.js';
import { gltfLoad } from './shape/gltfLoad.js';

const init = () => {
  /* || 初期セットアップ */
  const height = window.innerHeight; // 高さの設定
  const scene = new THREE.Scene(); // シーンの作成
  const renderer = new THREE.WebGLRenderer(); // レンダラーの作成
  adjustment_deviceDisplay(renderer, height);

  // カメラの作成
  const camera = create_camera(scene, -0.5, 1, 4, height);
  const control = gui_setup(camera, scene, renderer);
  /* || 初期セットアップ終わり */

  /* || メッシュの設定 */
  const material = new THREE.MeshNormalMaterial(); // マテリアル設定
  const geometry = new THREE.BoxGeometry(1, 1, 1); // ジオメトリ設定
  const fan_path = '/assets/image/fan_boolean.glb';
  gltfLoad(fan_path, scene);

  /* || メッシュの設定終わり */

  let clock = new THREE.Clock();
  function tick() {
    requestAnimationFrame(tick);

    // frameの受け取り
    //group.rotation.y += clock.getDelta();
    //uniforms.time.value += clock.getDelta();

    renderer.render(scene, camera);
    control.update();
  }
  tick();
};

window.addEventListener('DOMContentLoaded', () => {
  init();
});