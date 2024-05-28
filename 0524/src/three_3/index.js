import * as THREE from 'three';
import { gui_setup } from './guiBase.js';
import { adjustment_deviceDisplay } from './three_libraries/renderer_setup.js';
import { create_camera } from './three_libraries/camera_setup.js';
import { map } from './three_libraries/map.js';
import { radians } from './three_libraries/radians.js';
import { gltfLoad, gltfLoad_group } from './shape/gltfLoad.js';
import { gsap } from 'gsap';

const meshLoad_frag = { bool: false };
const meshLoad_fragGroup = { bool: false };
// TODO num分マテリアルをランダム&スケール保存&頭吹き飛ばすかどうかを保存するオブジェクトを作成する
const num = 10;
const num_setting = { materials: [], scales: [], blowHead: [], frame: [] };
for (let i = 0; i < num; i++) {
  num_setting.materials.push(new THREE.MeshNormalMaterial()); // マテリアル
  num_setting.scales.push(Math.random() * 0.5 + 0.5); // スケール
  num_setting.blowHead.push(Math.random() > 0.5 ? true : false); // 頭を飛ばすか否か
  num_setting.frame.push({ count: 0 }); // アニメーションフレーム
}
const mesh_group = new THREE.Group();

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
  gltfLoad_group(fan_path, scene, material, meshLoad_fragGroup, 10, 10, mesh_group);

  // 非同期でメッシュが読み込まれたらスケールを変更する
  new Promise((resolve) => {
    const interval = setInterval(() => {
      if (meshLoad_fragGroup.bool) {
        mesh_group.children.forEach((group, i) => {
          group.children[0].scale.set(num_setting.scales[i], num_setting.scales[i], num_setting.scales[i]);
          group.scale.set(num_setting.scales[i], num_setting.scales[i], num_setting.scales[i]);

          if (num_setting.blowHead[i]) {
            gsapSetup(num_setting.frame[i]); // アニメーションの初期化
          }
        });
        clearInterval(interval);
        resolve();
      }
    }, 1000);
  });

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

    if (meshLoad_fragGroup.bool) {
      // 円で回転させる
      //scene.children[4].rotation.y += radians(0.2);
      scene.children[4].children.forEach((group, i) => {
        //rotateAroundAxis(group.children[0]);
        group.children[0].children[0].rotation.x += radians(30);

        // 扇風機の頭をそれぞれ回転させる
        group.children[0].children[1].rotation.y += radians(1);
        group.children[0].children[2].rotation.y += radians(1);

        // アニメーションの実行
        const animationFrame = map(num_setting.frame[i].count, 0, 1, 0, 100);
        group.children[0].position.y = animationFrame;
      });
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
 * gsapの初期設定をする
 * @param {object} frame - フレーム
 */
const gsapSetup = (frame) => {
  gsap.timeline({ repeat: 0 }).to(frame, {
    count: 1,
    duration: 10,
    ease: 'power1.inOut',
    onComplete: () => {
      // アニメーション終了時
      console.log('end');
      // anime_parameter[i].isEnd = true;
    },
  });
};

/**
 * layerをセットする関数
 * @param {*} object
 * @see https://threejs.org/docs/#api/en/core/Object3D.getObjectByName
 * @see https://zenn.dev/dami/articles/5d9792736a4ffc
 */
const layerSet = (object) => {
  // 以下はAIが提示したMeshを全文探索するコード(効率悪そう)
  function assignLayerToOneRecursively(object) {
    if (object instanceof THREE.Mesh) {
      object.layers.set(1); // Meshの場合はlayerを設定
    }

    if (object.children && object.children.length > 0) {
      object.children.forEach(function (child) {
        assignLayerToOneRecursively(child); // 子供たちに再帰的に適用
      });
    }
  }

  // 使用例
  const group = new THREE.Group();
  // グループにMeshを追加するなどの操作...
  assignLayerToOneRecursively(group); // グループ内のすべてのMeshにlayer 1を割り当てる
};
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
