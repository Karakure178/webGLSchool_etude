// ==========================================
// 回転するオブジェクトのサイズ等を定義する
// ==========================================
/**
 * @description 回転する円のグループのパラメータ群
 * @type {Array}
 * @property {string} radius - 円の半径
 * @property {string} rotate_axis - 回転軸
 * @property {number} angle_init - 初期角度
 * @property {string} angle_axis - 角度の軸
 */
export const group_parameter = [
  {
    radius: 2.2292904154633346,
    rotate_axis: 'x',
    angle_init: 0.1423180928694309,
    angle_axis: 'y',
  },
  {
    radius: 1.2670072311032126,
    rotate_axis: 'z',
    angle_init: 1.0665252010621749,
    angle_axis: 'x',
  },
  {
    radius: 2.9260587528685824,
    rotate_axis: 'z',
    angle_init: 2.8415036922052486,
    angle_axis: 'x',
  },
  {
    radius: 2.9357508000115398,
    rotate_axis: 'x',
    angle_init: 0.6724040021486671,
    angle_axis: 'y',
  },
  {
    radius: 2.1606144853825726,
    rotate_axis: 'y',
    angle_init: 2.8228169157310448,
    angle_axis: 'z',
  },
];

// ==========================================
// カメラワークを定義する
// ==========================================
/**
 * @type {Array}
 * @description カメラを動かすためのパラメータ群,アニメーションのtimelineより1個多い（初期地点があるため）
 */
export const camera_parameter = [
  {
    x: 0,
    y: 15,
    z: 0,
  },
  {
    x: 0,
    y: 15,
    z: 0,
  },
  {
    x: -5,
    y: 0,
    z: 1,
  },
  {
    x: 0,
    y: 15,
    z: 0,
  },
];

/**
 * @type {Array}
 * @description カメラを動かすためのパラメータ群,アニメーションのtimelineより1個多い（初期地点があるため）
 */
export const cameraRotate_parameter = [
  {
    x: -1.569396888573175,
    y: -0.006997074632404589,
    z: -1.3733958709374008,
  },
  {
    x: -1.569396888573175,
    y: -0.006997074632404589,
    z: -1.3733958709374008,
  },
  {
    x: -1.569396888573175,
    y: -0.006997074632404589,
    z: -1.3733958709374008,
  },
  {
    x: -1.569396888573175,
    y: -0.006997074632404589,
    z: -1.3733958709374008,
  },
];

// ==========================================
// アニメーションのタイムラインを定義する
// ==========================================
// 最初の2sは固定
// 後半3sはカメラを移動させる

/**
 * @description アニメーションのタイムラインを再現するパラメータ
 * @type {Array}
 * @property {boolean} isActive - アニメーションをセットする
 * @property {boolean} isStart - アニメーションが始まったか
 * @property {boolean} isEnd - アニメーションが完了したか
 * @property {number} time - 何秒アニメーションさせるか
 * @property {number} count - アニメーションがどれくらい進んだか(0-1)
 * @property {string} easing - イージングの種類（gsapに準拠）
 */
export const anime_parameter = [
  {
    isActive: true,
    isStart: false,
    isEnd: false,
    time: 2,
    count: 0,
    easing: 'linear',
  },
  {
    isActive: false,
    isStart: false,
    isEnd: false,
    time: 3,
    count: 0,
    easing: 'power1.in',
  },
  {
    isActive: false,
    isStart: false,
    isEnd: false,
    time: 3,
    count: 0,
    easing: 'power1.in',
  },
];
