export const vertex = /*glsl*/ `
  uniform float time;
  void main()
  {
      // 使用例
      // vec3 p = position.xyz;
      // float new_x = p.x*cos(time) - p.y*sin(time);
      // float new_y = p.y*cos(time) + p.x*sin(time);
      // gl_Position = projectionMatrix * modelViewMatrix * vec4(new_x, new_y, p.z, 1.0);
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, position.y, position.z, 1.0);
  }
`;
