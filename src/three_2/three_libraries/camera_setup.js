import * as THREE from 'three';

//真正面からカメラを作成する関数
export function create_camera(scene, x, y, z,height) {
  const myCamera = new THREE.PerspectiveCamera(75, window.innerWidth / height, 0.1, 10000);
  myCamera.position.x = x;
  myCamera.position.y = y;
  myCamera.position.z = z;
  // myCamera.lookAt(scene.position);
  return myCamera;
}
