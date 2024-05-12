import * as THREE from 'three';
import gsap from 'gsap';
import { map } from './../three_libraries/map';

//真正面からカメラを作成する関数
export const create_camera = (scene, x, y, z, height) => {
  const myCamera = new THREE.PerspectiveCamera(75, window.innerWidth / height, 0.1, 10000);
  myCamera.position.x = x;
  myCamera.position.y = y;
  myCamera.position.z = z;
  myCamera.lookAt(scene.position);
  return myCamera;
};

// カメラのアニメーション設定
// gsapを使ってアニメーションさせたい
// gsapを一回だけ実行して、後半は発火し続けるようにしてほしい
// anime_parameterは参照渡しで上書きされる前提
export const camera_animation = (myCamera, camera_parameter, anime_parameter) => {
  // もしまだアニメーションのセット(gsap起動)してなかったら起動する
  if (anime_parameter[anime_parameter.length - 1].isEnd) {
    // すでにアニメーションが完全に終了していたら処理を止める
  } else {
    for (let i = 0; i < anime_parameter.length; i++) {
      // まだgsapの登録が始まっていなかったら始める(isStartとisEndがfalseなら登録してない)
      // 前のアニメーションが終わったら始める(isActive)
      if (!anime_parameter[i].isStart && !anime_parameter[i].isEnd && anime_parameter[i].isActive) {
        gsap.timeline({ repeat: -1 }).to(camera_parameter, {
          count: camera_parameter.count,
          duration: camera_parameter.time,
          ease: camera_parameter.easing,
          onComplete: () => {
            // アニメーション終了時
            anime_parameter[i].isEnd = true;
            anime_parameter[i + 1].isActive = true;
          },
        });
        anime_parameter.isStart = true;
      }

      // カメラ位置を更新する
      if (!anime_parameter[i].isEnd) {
        // アニメーションの実行途中だった場合に更新する
        if (anime_parameter[i].isStart && !anime_parameter[i].isEnd) {
          const map_x = map(anime_parameter[i].count, 0, 1, camera_parameter[i].x, camera_parameter[i + 1].x);
          const map_y = map(anime_parameter[i].count, 0, 1, camera_parameter[i].y, camera_parameter[i + 1].y);
          const map_z = map(anime_parameter[i].count, 0, 1, camera_parameter[i].z, camera_parameter[i + 1].z);
          myCamera.position.x = map_x;
          myCamera.position.y = map_y;
          myCamera.position.z = map_z;
        }
      }
    }
  }
};
