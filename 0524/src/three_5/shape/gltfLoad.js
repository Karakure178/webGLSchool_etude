//import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three';
import { radians } from './../three_libraries/radians';

/** gltfを読み込む関数
 * @function gltfLoad
 * @param {string} path - gltfのパス
 * @param {THREE.Scene} scene - シーン
 */
export const gltfLoad = (path, scene, material, meshLoad_frag) => {
  // 実装参考：https://threejs.org/docs/#examples/en/loaders/GLTFLoader
  const loader = new GLTFLoader();

  // Load a glTF resource
  loader.load(
    path,
    function (gltf) {
      // メッシュの定義
      const blade = gltf.scene.children[0]; // new THREE.Mesh(geometry_blade, material);(個別に設定するとサイズ感も狂う)
      const net_back = gltf.scene.children[1];
      const net_front = gltf.scene.children[2];
      const prop = gltf.scene.children[3];
      const handle = gltf.scene.children[4];
      blade.material = material; // 上書きできる

      for (let i = 0; i < net_back.children.length; i++) {
        net_back.children[i].material = material;
      }

      //   console.log(net_back, 'hello');
      //   console.log(net_front, 'hello');
      for (let i = 0; i < net_front.children.length; i++) {
        net_front.children[i].material = material;
      }

      prop.material = material;
      handle.material = material;
      const head = new THREE.Group();
      head.add(blade);
      head.add(net_back);
      head.add(net_front);

      // ここ(扇風機の支柱・ようはprops)を中心点として扇風機を回転させてる
      // const target = new THREE.Vector3(0, 0, 0);
      // const target_local = prop.getWorldPosition(target);
      // console.log(target_local, 'hello');

      scene.add(head);
      scene.add(prop);
      scene.add(handle);

      // gltf.scene.children[0] = プロペラ
      // gltf.scene.children[1] = 後ろの部分
      // gltf.scene.children[2] = 手前のフレーム部分
      // gltf.scene.children[3] = 棒の部分
      // gltf.scene.children[4] = ハンドルの部分
      meshLoad_frag.bool = true;
    },

    // called while loading is progressing
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
    },

    // called when loading has errors
    function (error) {
      console.log('An error happened');
      return false;
    }
  );
};

/** gltfを指定された個数読み込む関数
 * @function gltfLoad
 * @param {string} path - gltfのパス
 * @param {THREE.Scene} scene - シーン
 * @param {THREE.Material} materials - マテリアル(num分)
 * @param {object} meshLoad_frag - メッシュロードフラグ
 * @param {number} num - 扇風機の個数
 * @param {number} radius - 扇風機を配置する円の半径
 */
export const gltfLoad_group = (path, scene, materials, meshLoad_frag, num, radius, circle_fan) => {
  // 実装参考：https://threejs.org/docs/#examples/en/loaders/GLTFLoader
  const loader = new GLTFLoader();

  // Load a glTF resource
  loader.load(
    path,
    function (gltf) {
      // メッシュの定義
      const blade = gltf.scene.children[0];
      const net_back = gltf.scene.children[1];
      const net_front = gltf.scene.children[2];
      const prop = gltf.scene.children[3];
      const handle = gltf.scene.children[4];

      const head = new THREE.Group();
      head.add(blade);
      head.add(net_back);
      head.add(net_front);

      const group = new THREE.Group();
      group.add(head);
      group.add(prop);
      group.add(handle);

      const angle = 360 / num;
      circle_fan.name = 'circle_fan';
      for (let i = 0; i < num; i++) {
        const group_clone = group.clone();
        const x = radius * Math.cos(radians(angle * i));
        const z = radius * Math.sin(radians(angle * i));
        group_clone.position.set(x, 0, z);

        // グループに含まれるオブジェクトにマテリアルを適用する(全探索)
        group_clone.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.material = materials[i];
          }
        });

        circle_fan.add(group_clone);
      }
      scene.add(circle_fan);
      meshLoad_frag.bool = true;
    },

    // called while loading is progressing
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
    },

    // called when loading has errors
    function (error) {
      console.log('An error happened');
      return false;
    }
  );
};
