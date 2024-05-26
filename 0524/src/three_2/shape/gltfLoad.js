//import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three';

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

      // 原点をずらすための重み付け
      const inversion_net_back = net_back.clone();
      const inversion_net_front = net_front.clone();
      inversion_net_back.rotation.y = Math.PI;
      inversion_net_back.position.x = -3.03;
      inversion_net_front.rotation.y = Math.PI;
      inversion_net_front.position.x = -3.75;
      console.log(head.worldToLocal(new THREE.Vector3(10, 0, 0)), 'hello');
      const target = new THREE.Vector3(0, 0, 0);

      const target_local = prop.getWorldPosition(target);
      // console.log(target_local, 'hello');
      //head.add(inversion_net_back);
      //head.add(inversion_net_front);

      //scene.add(blade);
      //scene.add(net_back);
      //scene.add(net_front);

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
