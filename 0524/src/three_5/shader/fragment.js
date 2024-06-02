/**
 * Full-screen textured quad shader
 */

const WarpShader = {
  name: 'WarpShader',

  uniforms: {
    tDiffuse: { value: null },
    u_time: { value: 0.0 },
  },

  vertexShader: /* glsl */ `
          varying vec2 vUv;

          void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
          }`,

  fragmentShader: /* glsl */ `
          uniform float u_time;
          uniform sampler2D tDiffuse;
          varying vec2 vUv;

          uniform vec2 u_resolution;
          
          float pi=3.14159265358979;
          
          float map(float value, float min1, float max1, float min2, float max2) {
            return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
          }
          
          float random2(float x) {
              return fract(sin(x)*1e4);
          }
          
          // Based on Morgan McGuire @morgan3d
          // https://www.shadertoy.com/view/4dS3Wd
          // https://thebookofshaders.com/edit.php#11/3d-noise.frag
          float noise (vec3 p) {
              const vec3 step = vec3(110.0, 241.0, 171.0);
          
              vec3 i = floor(p);
              vec3 f = fract(p);
          
              // For performance, compute the base input to a
              // 1D random from the integer part of the
              // argument and the incremental change to the
              // 1D based on the 3D -> 1D wrapping
              float n = dot(i, step);
          
              vec3 u = f * f * (3.0 - 2.0 * f);
              return mix( mix(mix(random2(n + dot(step, vec3(0,0,0))),
                                  random2(n + dot(step, vec3(1,0,0))),
                                  u.x),
                              mix(random2(n + dot(step, vec3(0,1,0))),
                                  random2(n + dot(step, vec3(1,1,0))),
                                  u.x),
                          u.y),
                          mix(mix(random2(n + dot(step, vec3(0,0,1))),
                                  random2(n + dot(step, vec3(1,0,1))),
                                  u.x),
                              mix(random2(n + dot(step, vec3(0,1,1))),
                                  random2(n + dot(step, vec3(1,1,1))),
                                  u.x),
                          u.y),
                      u.z);
          }
          
          float rand(vec2 co){
            float a=fract(dot(co,vec2(2.067390879775102,12.451168662908249)))-.5;
            float s=a*(6.182785114200511+a*a*(-38.026512460676566+a*a*53.392573080032137));
            float t=fract(s*43758.5453);
            return t;
          }
          
          void main(){
            vec2 uv=vUv;
          
            // 10倍したらわけがわからなくなった
            vec3 pos = vec3(uv*1.0, u_time*0.5); // uv*1.0で拡大・縮小になる(1.0で等倍)
            float noises = noise(pos);
          
            float noises_jagi = noise(vec3(uv*100.0, 10.0)); // ジャギらせ用ノイズ UVとは別で用意した
          
            // ノイズの濃いところをジャギらせる
            float radius = map(noises_jagi, 0.0, 1.0, 0.001, 0.02);
            uv.x = uv.x + rand(uv)*radius;
            uv.y = uv.y + rand(uv)*radius;
          
            // fractでリピートできる
            // uv*0.5 = 0.5倍することで拡大される
            // noises*x = xでノイズの影響を強める
            vec4 tex=texture2D(tDiffuse,fract((uv*1.0 + (noises*0.5))));
            
            gl_FragColor = tex + random2(uv.y+u_time)*0.3;
          }`,
};

export { WarpShader };
