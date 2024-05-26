import * as THREE from 'three';
import { gui_setup } from './guiBase.js';
import { adjustment_deviceDisplay } from './three_libraries/renderer_setup.js';
import { create_camera } from './three_libraries/camera_setup.js';
import { map } from './three_libraries/map.js';
import { radians } from './three_libraries/radians.js';
import { gltfLoad } from './shape/gltfLoad.js';
const meshLoad_frag = { bool: false };

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
  const fan_path =
    'https://raw.githubusercontent.com/Karakure178/webGLSchool_etude/main/0524/public/assets/image/senpuki_boolean.gltf';
  gltfLoad(fan_path, scene, material, meshLoad_frag);

  // https://observablehq.com/@kabokawakabo1/three-js-4-2
  //scene.overrideMaterial = new THREE.MeshNormalMaterial();

  // 非同期で実行
  // const mesh_1 = scene.children[0];

  /* || メッシュの設定終わり */

  let clock = new THREE.Clock();
  function tick() {
    requestAnimationFrame(tick);

    // frameの受け取り
    //group.rotation.y += clock.getDelta();
    //uniforms.time.value += clock.getDelta();

    // メッシュが読み込まれたら実行
    if (meshLoad_frag.bool) {
      rotateAroundAxis(scene.children[1]);
      scene.children[1].children[0].rotation.x += radians(30);
    }

    renderer.render(scene, camera);
    control.update();
  }
  tick();
};

window.addEventListener('DOMContentLoaded', () => {
  init();
});

/**
 * // 実装参考：https://jsfiddle.net/felixmariotto/mgf6ebah/
 */
THREE.Object3D.prototype.rotateAroundWorldAxis = (function () {
  // rotate object around axis in world space (the axis passes through point)
  // axis is assumed to be normalized
  // assumes object does not have a rotated parent

  var q = new THREE.Quaternion();

  return function rotateAroundWorldAxis(point, axis, angle) {
    q.setFromAxisAngle(axis, angle);

    this.applyQuaternion(q);

    this.position.sub(point);
    this.position.applyQuaternion(q);
    this.position.add(point);

    return this;
  };
})();

const rotateAroundAxis = (mesh) => {
  if (!mesh) return;
  const points = [];
  // 支柱の中心点二つ
  points.push(new THREE.Vector3(-1.8885620832443237, -4.280918121337891, 0));
  points.push(new THREE.Vector3(-1.8885620832443237, 4.280918121337891, 0));

  const vecA = points[0];
  const vecB = points[1];
  const vec = new THREE.Vector3();

  vec.copy(vecA).sub(vecB).normalize();

  mesh.rotateAroundWorldAxis(vecA, vec, 0.1);
};
