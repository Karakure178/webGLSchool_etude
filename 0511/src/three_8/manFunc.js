import { radians } from './three_libraries/radians.js';
import { map } from './three_libraries/map.js';
import { group_parameter, anime_parameter } from './parameter.js';

// ==========================================
// 描画系関数群の定義するファイル
// ==========================================
/**
 * @function drawCircles
 * @param {number} x - 円の中心座標x
 * @param {number} y - 円の中心座標y
 * @param {number} circle_radius - 円の半径
 * @param {THREE.Mesh} mesh - meshインスタンス
 * @param {number} angle - 配置する角度
 * @description 円を描く関数 boxを使って円を描く
 */
export const drawCircles = (x, y, circle_radius, mesh, angle) => {
  const tx = circle_radius * Math.cos(radians(angle));
  const ty = circle_radius * Math.sin(radians(angle));
  mesh.position.x = x + tx;
  mesh.position.y = y + ty;
  const size = map(circle_radius, 1, 3, 0.1, 0.5);
  mesh.scale.set(size, size, size);
};

/**
 * @function paramRotateCircle
 * @param {THREE.Group} group - グループインスタンス
 * @param {object} group_parameter - グループに渡されるパラメータ
 * @property {string} rotate_axis - 回転軸
 * @property {number} circle_radius - 円の半径
 * @property {number} angle_init - 初期角度
 * @property {string} angle_axis - 角度の軸
 * @description cirlceが書かれたグループをパラメータに沿って回転させる
 */
export const paramRotateCircle = (group, group_parameter) => {
  const rotate_axis = group_parameter.rotate_axis; // 回転を続ける軸
  const angle_init = group_parameter.angle_init; // 初期時点の角度
  const angle_axis = group_parameter.angle_axis; // angle_initを足す軸

  if (group_parameter.angle_axis === 'x') {
    group.rotation.x = angle_init;
  } else if (group_parameter.angle_axis === 'y') {
    group.rotation.y = angle_init;
  } else {
    group.rotation.z = angle_init;
  }

  return { rotate_axis, angle_init, angle_axis };
};

// ==========================================
// 円のアニメーションを定義する
// ==========================================
export const anime = (groups, time, anime_parameter) => {
  if (anime_parameter[0].isEnd) {
    groups.forEach((item) => {
      if (item.rotate_axis === 'x') {
        item.group.rotation.x += time;
      } else if (item.rotate_axis === 'y') {
        item.group.rotation.y += time;
      } else {
        item.group.rotation.z += time;
      }
    });
  }
};
