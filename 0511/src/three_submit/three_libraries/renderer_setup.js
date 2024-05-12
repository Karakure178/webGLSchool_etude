import * as THREE from 'three';

//デバイスの表示調整をするレンダラー関数
export function adjustment_deviceDisplay(renderer, height) {
  //背景色
  // renderer.setClearColor(new THREE.Color('#1e1e1e'));
  //sceneの大きさの通知
  renderer.setSize(window.innerWidth, height);

  //デバイスの表示調整
  renderer.setPixelRatio(window.devicePixelRatio);
  document.getElementById('myCanvas').appendChild(renderer.domElement);
  renderer.setPixelRatio(window.devicePixelRatio);
}
