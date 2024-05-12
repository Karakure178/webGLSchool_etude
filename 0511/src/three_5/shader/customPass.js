/**
 * Full-screen textured quad shader
 */

const CopyShader = {
  name: 'CopyShader',

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

		void main() {
			vec4 tex = texture2D( tDiffuse, vUv );
            
            // 走査線を書く
            float scanLineInterval = 1500.0; // 大きいほど幅狭く
            float scanLineSpeed = u_time * 5.0; // 走査線移動速度
            float scanLine = max(1.0, sin(vUv.y * scanLineInterval + scanLineSpeed) * 1.6);

            tex.rgb *= scanLine;
			gl_FragColor = tex;
		}`,
};

export { CopyShader };
