//import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/** gltfを読み込む関数
 * @function gltfLoad
 * @param {string} path - gltfのパス
 * @param {THREE.Scene} scene - シーン
 */
export const gltfLoad = (path, scene) => {
  // 実装参考：https://threejs.org/docs/#examples/en/loaders/GLTFLoader
  //   return new Promise((resolve, reject) => {
  //     const loader = new GLTFLoader();
  //     loader.load(path, (data) => {
  //       resolve(data);
  //     });
  //   });
  const loader = new GLTFLoader();

  // Load a glTF resource
  loader.load(
    path,
    function (gltf) {
      scene.add(gltf.scene);
      gltf.animations; // Array<THREE.AnimationClip>
      gltf.scene; // THREE.Group
      gltf.scenes; // Array<THREE.Group>
      gltf.cameras; // Array<THREE.Camera>
      gltf.asset; // Object
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
