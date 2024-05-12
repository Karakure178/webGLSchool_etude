import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
//https://white-sesame.jp/archives/blog/3046
//GUIの初期化/初期wolrdの生成/コントロールオブジェクトの受け取りなど
//controlsの値を返却
export function gui_setup(camera, scene, renderer, group) {
  //world用床の生成
  const mesh = world_setup(scene);

  // 軸ヘルパーの作成
  const axesBarLength = 5.0;
  const axesHelper = new THREE.AxesHelper(axesBarLength);
  scene.add(axesHelper);

  //GUI生成・画面の初期化
  const gui = new GUI();
  const guiConfig = {
    activeOrbit: false,
    resetWindow: () => {
      document.location.reload();
    },
  };
  gui.add(guiConfig, 'resetWindow').name('ページをリセット');

  //カメラコントロール用に値を受け取る
  const controls = cameraControl(gui, guiConfig, camera, renderer);

  //実際に回転した実数値をアラートとして出力
  const cameraGuiObj = {
    getCamera: () => {
      const cameraPosition = `\n x:${camera.position.x},\n y:${camera.position.y},\n z:${camera.position.z}`;
      const cameraRotation = `\n x:${camera.rotation.x},\n y:${camera.rotation.y},\n z:${camera.rotation.z}`;
      alert('カメラポジション: {' + cameraPosition + '\n}\n\nカメラ角度: {' + cameraRotation + '\n}');
    },
  };
  gui.add(cameraGuiObj, 'getCamera').name('カメラ情報を取得');

  //ワールドの床を非表示にする関数
  const worldOffObj = {
    activeOrbit: false,
    worldOffControl: () => {
      scene.remove(mesh);
    },
  };
  gui.add(worldOffObj, 'worldOffControl').name('床を非表示');

  // グループの円の半径・回転軸・回転角度を出力する関数
  const groupGuiObj = {
    getGroup: () => {
      const groupInfo = group.map((item) => {
        return `\n name: ${item.group.name},\n radius: ${item.circle_radius},\n rotate_axis: ${item.rotate_axis},\n angle_init:${item.angle_init},\n angle_axis: ${item.angle_axis}`;
      });
      console.log('グループ情報: {' + groupInfo + '\n}');
      alert('グループ情報: {' + groupInfo + '\n}');
    },
  };
  gui.add(groupGuiObj, 'getGroup').name('group情報を取得');

  return controls;
}

//world目安の床を生成する関数
function world_setup(scene) {
  const world_floorGeo = new THREE.PlaneGeometry(1000, 1000, 50, 50);
  const world_floorMat = new THREE.MeshBasicMaterial({
    color: 0x333333,
    wireframe: true,
  });
  const world_floor = new THREE.Mesh(world_floorGeo, world_floorMat);
  world_floor.rotation.set(-Math.PI / 2, 0, 0);
  scene.add(world_floor);
  return world_floor;
}

//カメラをコントロールするか否か＆回転できるようにする関数
function cameraControl(gui, guiConfig, camera, renderer) {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  controls.enablePan = false;

  gui
    .add(guiConfig, 'activeOrbit')
    .name('コントロールを有効')
    .onChange((value) => {
      controls.enableZoom = value;
      controls.enablePan = value;
      controls.enableRotate = value;
    });
  return controls;
}
