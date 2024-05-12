import * as THREE from 'three';
import gsap from 'gsap';
import { map } from './../three_libraries/map';

//真正面からカメラを作成する関数
export const create_camera = (scene, x, y, z, height) => {
  const myCamera = new THREE.PerspectiveCamera(75, window.innerWidth / height, 0.1, 10000);
  myCamera.position.x = x;
  myCamera.position.y = y;
  myCamera.position.z = z;
  myCamera.rotation.x = 0;
  myCamera.rotation.y = 0;
  myCamera.rotation.z = 0;

  // myCamera.rotation.x = -1.569396888573175;
  // myCamera.rotation.y = -0.006997074632404589;
  // myCamera.rotation.z = -1.3733958709374008;
  // myCamera.lookAt(scene.position);
  return myCamera;
};

// カメラのアニメーション設定
// gsapを使ってアニメーションさせたい
// gsapを一回だけ実行して、後半は発火し続けるようにしてほしい
// anime_parameterは参照渡しで上書きされる前提
export const camera_animation = (scene, myCamera, camera_parameter, rotate_parameter, anime_parameter) => {
  // もしまだアニメーションのセット(gsap起動)してなかったら起動する
  if (anime_parameter[anime_parameter.length - 1].isEnd) {
    // すでにアニメーションが完全に終了していたら処理を止める
  } else {
    for (let i = 0; i < anime_parameter.length; i++) {
      // まだgsapの登録が始まっていなかったら始める(isStartとisEndがfalseなら登録してない)
      // 前のアニメーションが終わったら始める(isActive)
      if (!anime_parameter[i].isStart && !anime_parameter[i].isEnd && anime_parameter[i].isActive) {
        gsap.timeline({ repeat: 0 }).to(anime_parameter[i], {
          count: 1,
          duration: anime_parameter[i].time,
          ease: anime_parameter[i].easing,
          onComplete: () => {
            // アニメーション終了時
            console.log('end');
            anime_parameter[i].isEnd = true;
            if (i + 1 < anime_parameter.length) anime_parameter[i + 1].isActive = true;
          },
        });
        anime_parameter[i].isStart = true;
      }

      // カメラ位置を更新する
      if (!anime_parameter[i].isEnd) {
        // アニメーションの実行途中だった場合に更新する
        if (anime_parameter[i].isStart && !anime_parameter[i].isEnd) {
          // console.log(myCamera.position.y, anime_parameter[i].count);
          console.log(myCamera.rotation.x, myCamera.rotation.y, myCamera.rotation.z);
          const map_x = map(anime_parameter[i].count, 0, 1, camera_parameter[i].x, camera_parameter[i + 1].x);
          const map_y = map(anime_parameter[i].count, 0, 1, camera_parameter[i].y, camera_parameter[i + 1].y);
          const map_z = map(anime_parameter[i].count, 0, 1, camera_parameter[i].z, camera_parameter[i + 1].z);
          myCamera.position.x = map_x;
          myCamera.position.y = map_y;
          myCamera.position.z = map_z;

          const map_rx = map(anime_parameter[i].count, 0, 1, rotate_parameter[i].x, rotate_parameter[i + 1].x);
          const map_ry = map(anime_parameter[i].count, 0, 1, rotate_parameter[i].y, rotate_parameter[i + 1].y);
          const map_rz = map(anime_parameter[i].count, 0, 1, rotate_parameter[i].z, rotate_parameter[i + 1].z);
          cameraRotateUpdate(myCamera, map_rx, map_ry, map_rz);
        }
      }
    }
    //myCamera.lookAt(new THREE.Vector3(0, 0, 0));
  }
};

const cameraRotateUpdate = (myCamera, x, y, z) => {
  myCamera.rotation.x = x;
  myCamera.rotation.y = y;
  myCamera.rotation.z = z;
};
