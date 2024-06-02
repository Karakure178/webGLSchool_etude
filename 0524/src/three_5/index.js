import * as THREE from 'three';
import { adjustment_deviceDisplay } from './three_libraries/renderer_setup.js';
import { create_camera } from './three_libraries/camera_setup.js';
import { map } from './three_libraries/map.js';
import { radians } from './three_libraries/radians.js';
import { gltfLoad, gltfLoad_group } from './shape/gltfLoad.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { WarpShader } from './shader/fragment.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { gsap } from 'gsap';

// 画像の読み込み:https://ics.media/entry/210708/#javascript%2Ftypescript%E3%81%8B%E3%82%89%E7%94%BB%E5%83%8F%E3%82%92%E8%AA%AD%E3%81%BF%E8%BE%BC%E3%82%80
import imgUrl from './threeTone.jpg'; // フォルダ内の画像であれば呼び出せる.. なぜ？

const meshLoad_frag = { bool: false };
const meshLoad_fragGroup = { bool: false };
let isLight = false;
const colorBox = [0x01204e, 0x028391, 0xf97300, 0xfeae6f];

const num = 10;
const num_setting = { materials: [], scales: [], blowHead: [], frame: [] };
const textureLoader = new THREE.TextureLoader();
const threeTone = textureLoader.load(imgUrl);
threeTone.minFilter = THREE.NearestFilter;
threeTone.magFilter = THREE.NearestFilter;

for (let i = 0; i < num; i++) {
  const color = new THREE.Color(colorBox[Math.floor(Math.random() * colorBox.length)]);

  // toneMaterialの設定
  const material = new THREE.MeshToonMaterial({
    color: color,
    gradientMap: threeTone,
  });
  num_setting.materials.push(material); // マテリアル
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
  world_setup(scene);
  const controls = new OrbitControls(camera, renderer.domElement);

  // resize処理の追加
  window.addEventListener(
    'resize',
    () => {
      // レンダラの大きさを設定
      renderer.setSize(window.innerWidth, window.innerHeight);
      // カメラが撮影する視錐台のアスペクト比を再設定
      camera.aspect = window.innerWidth / window.innerHeight;

      // カメラのパラメータが変更されたときは行列を更新する
      camera.updateProjectionMatrix();
    },
    false
  );

  /* || 初期セットアップ終わり */

  // エフェクト設定
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera)); // レンダリングパスを追加

  const shaderPass = new ShaderPass(WarpShader);
  composer.addPass(shaderPass);

  /* || メッシュの設定 */
  const material = new THREE.MeshNormalMaterial(); // マテリアル設定
  const fan_path =
    'https://raw.githubusercontent.com/Karakure178/webGLSchool_etude/main/0524/public/assets/image/senpuki_boolean.gltf';
  gltfLoad(fan_path, scene, material, meshLoad_frag);
  gltfLoad_group(fan_path, scene, num_setting.materials, meshLoad_fragGroup, 10, 10, mesh_group);

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

    // アニメーション受け取り用シェーダーの値
    const uniforms = shaderPass.material.uniforms;
    uniforms.u_time.value = clock.getElapsedTime();

    // メッシュが読み込まれたら実行
    if (meshLoad_frag.bool) {
      if (!isLight) {
        isLight = true;
        // ライトの設定
        const ambientLight = new THREE.AmbientLight(0xc1c1c1, 1);
        scene.add(ambientLight);

        const light1 = new THREE.DirectionalLight(0xffffff, 3);
        light1.position.set(0, 3, 5);
        scene.add(light1);

        const light2 = new THREE.DirectionalLight(0xffffff, 3);
        light2.position.set(10, 20, 10);
        scene.add(light2);

        const light3 = new THREE.DirectionalLight(0xffffff, 3);
        light3.position.set(-10, -20, -10);
        scene.add(light3);
      }
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

    composer.render();
    controls.update();
  }
  tick();
};

window.addEventListener('DOMContentLoaded', () => {
  init();
});

//world目安の床を生成する関数
const world_setup = (scene) => {
  const world_floorGeo = new THREE.PlaneGeometry(1000, 1000, 50, 50);
  const world_floorMat = new THREE.MeshBasicMaterial({
    color: 0x333333,
    wireframe: true,
  });
  const world_floor = new THREE.Mesh(world_floorGeo, world_floorMat);
  world_floor.rotation.set(-Math.PI / 2, 0, 0);
  scene.add(world_floor);
  return world_floor;
};

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
