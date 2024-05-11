export const fragment = /*glsl*/ `
  precision mediump float;//認識精度を下げている
  uniform float time;
  void main(void){
    // 使用例
    // vec4 color = vec4(sin(time*0.4), cos(time*0.58), sin(time*0.86), 1.0);
    // gl_FragColor = color;
    gl_FragColor = vec4(sin(time), 0.0, sin(1.0-time), 1.0);
  }
`;
