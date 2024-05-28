import * as THREE from 'three';
import { vertex } from './shader/vertex.js';
import { fragment } from './shader/fragment.js';

// カスタマイズしたマテリアルを作るためのシェーダー関数
export function createShader() {
  // shaderに渡す変数をまとめる修飾子
  const uniforms = {
    time: {
      type: 'f',
      value: 0.0,
    },
    resolution: {
      type: 'v2',
      value: new THREE.Vector2(window.innerWidth, window.innerHeight),
    },
    color: {
      type: 'v4',
      value: new THREE.Vector4(0, 0, 0, 0),
    },
  };

  // ShaderMaterialの作成
  return new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertex,
    fragmentShader: fragment,
  });
}
