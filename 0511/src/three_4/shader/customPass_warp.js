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

          // https://gist.github.com/companje/29408948f1e8be54dd5733a74ca49bb9
          float map(float value, float min1, float max1, float min2, float max2) {
            return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
          }

          // ボロノイ図をUVの値につかう
          float rand(vec2 x){
            return fract(cos(mod(dot(x,vec2(13.9898,8.141)),3.14))*43758.5453);
          }

          vec2 rand2(vec2 x){
            return fract(cos(mod(vec2(dot(x,vec2(13.9898,8.141)),
            dot(x,vec2(3.4562,17.398))),vec2(3.14)))*43758.5453);
          }

          // Based on https://www.shadertoy.com/view/ldl3W8
          // The MIT License
          // Copyright © 2013 Inigo Quilez
          vec3 iq_voronoi(vec2 x,vec2 size,vec2 stretch,float randomness,vec2 seed){
            vec2 n=floor(x);
            vec2 f=fract(x);
            
            vec2 mg,mr,mc;
            float md=8.;
            for(int j=-1;j<=1;j++)
            for(int i=-1;i<=1;i++){
              vec2 g=vec2(float(i),float(j));
              vec2 o=randomness*rand2(seed+mod(n+g+size,size));
              vec2 c=g+o;
              vec2 r=c-f;
              vec2 rr=r*stretch;
              float d=dot(rr,rr);
              
              if(d<md){
                mc=c;
                md=d;
                mr=r;
                mg=g;
              }
            }
            
            md=8.;
            for(int j=-2;j<=2;j++)
            for(int i=-2;i<=2;i++){
              vec2 g=mg+vec2(float(i),float(j));
              vec2 o=randomness*rand2(seed+mod(n+g+size,size));
              vec2 r=g+o-f;
              vec2 rr=(mr-r)*stretch;
              if(dot(rr,rr)>.00001)
              md=min(md,dot(.5*(mr+r)*stretch,normalize((r-mr)*stretch)));
            }
            
            return vec3(md,mc+n);
          }

          vec4 voronoi(vec2 uv,vec2 size,vec2 stretch,float intensity,float randomness,float seed){
            uv*=size;
            vec3 v=iq_voronoi(uv,size,stretch,randomness,rand2(vec2(seed,1.-seed)));
            return vec4(v.yz,intensity*length((uv-v.yz)*stretch),v.x);
          }

          const float scale_x=10.;
          const float scale_y=10.;
          const float stretch_x=1.62;
          const float stretch_y=1.;
          const float intensity=1.;
          const float randomness=.85;
  
          void main() {
              vec2 uv = vUv;
              
              vec4 voronoiColor=voronoi((uv),vec2(scale_x,scale_y),vec2(stretch_y,stretch_x),intensity,randomness,0.);
              float celler=voronoiColor.z;

              float warp = map(sin(u_time), -1.0, 1.0, 0.0, 0.08);
              
              // fractでリピートできる
              vec4 tex = texture2D(tDiffuse, fract((uv+(celler * warp))));

              gl_FragColor = tex;
          }`,
};

export { WarpShader };
