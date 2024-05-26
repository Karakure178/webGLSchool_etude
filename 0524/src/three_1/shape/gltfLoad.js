//import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three';

/** gltfを読み込む関数
 * @function gltfLoad
 * @param {string} path - gltfのパス
 * @param {THREE.Scene} scene - シーン
 */
export const gltfLoad = (path, scene, material) => {
  // 実装参考：https://threejs.org/docs/#examples/en/loaders/GLTFLoader
  const loader = new GLTFLoader();

  // Load a glTF resource
  loader.load(
    path,
    function (gltf) {
      //   scene.add(gltf.scene.children[4]);
      // ジオメトリの定義
      const geometry_blade = gltf.scene.children[0].geometry;
      const geometry_net_back = gltf.scene.children[1];

      //console.log(geometry_net_back);
      const net_back1 = new THREE.Mesh(geometry_net_back.children[0].geometry, material);
      const net_back2 = new THREE.Mesh(geometry_net_back.children[1].geometry, material);
      const net_back3 = new THREE.Mesh(geometry_net_back.children[2].geometry, material);
      const net_back = new THREE.Group().add(net_back1);

      const geometry_net_front = gltf.scene.children[2].geometry;
      const geometry_prop = gltf.scene.children[3].geometry;
      const geometry_handle = gltf.scene.children[4].geometry;

      // メッシュの定義
      const blade = new THREE.Mesh(geometry_blade, material);
      //   const net_back = new THREE.Mesh(geometry_net_back, material);
      const net_front = new THREE.Mesh(geometry_net_front, material);
      const prop = new THREE.Mesh(geometry_prop, material);
      const handle = new THREE.Mesh(geometry_handle, material);

      scene.add(blade);
      scene.add(net_back);
      //scene.add(net_front);
      //scene.add(prop);
      //scene.add(handle);

      // console.log(gltf.scene);

      // gltf.scene.children[0] = プロペラ
      // gltf.scene.children[1] = 後ろの部分
      // gltf.scene.children[2] = 手前のフレーム部分
      // gltf.scene.children[3] = 棒の部分
      // gltf.scene.children[4] = ハンドルの部分
    },

    // called while loading is progressing
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
    },

    // called when loading has errors
    function (error) {
      console.log('An error happened');
    }
  );
};
