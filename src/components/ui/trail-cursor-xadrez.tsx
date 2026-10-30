'use client';

import { shaderMaterial, useTrailTexture } from '@react-three/drei';
import { Canvas, CanvasProps, ThreeEvent, useThree } from '@react-three/fiber';
import React, { useMemo } from 'react';
import * as THREE from 'three';

interface GooeyFilterProps {
	id?: string;
	strength?: number;
}

interface SceneProps {
	gridSize: number;
	trailSize: number;
	maxAge: number;
	interpolate: number;
	easingFunction: (x: number) => number;
	pixelColor: string;
	dotRadius: number; // Nova prop para o raio dos pontos
}

interface PixelTrailProps {
	gridSize?: number;
	trailSize?: number;
	maxAge?: number;
	interpolate?: number;
	easingFunction?: (x: number) => number;
	canvasProps?: Partial<CanvasProps>;
	glProps?: WebGLContextAttributes & { powerPreference?: string };
	gooeyFilter?: { id: string; strength: number };
	color?: string;
	className?: string;
	dotRadius?: number; // Nova prop para o raio dos pontos
}

const GooeyFilter: React.FC<GooeyFilterProps> = ({ id = 'goo-filter', strength = 10 }) => {
	return (
		<svg className='absolute z-1 overflow-hidden'>
			<defs>
				<filter id={id}>
					<feGaussianBlur in='SourceGraphic' stdDeviation={strength} result='blur' />
					<feColorMatrix in='blur' type='matrix' values='1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9' result='goo' />
					<feComposite in='SourceGraphic' in2='goo' operator='atop' />
				</filter>
			</defs>
		</svg>
	);
};

const DotMaterial = shaderMaterial(
	{
		resolution: new THREE.Vector2(),
		mouseTrail: null,
		gridSize: 100,
		pixelColor: new THREE.Color('#ffffff'),
		dotRadius: 0.4, // Uniform para o raio do ponto dentro da célula
	},
	/* glsl vertex shader */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
	/* glsl fragment shader */ `
    uniform vec2 resolution;
    uniform sampler2D mouseTrail;
    uniform float gridSize;
    uniform vec3 pixelColor;
    uniform float dotRadius; // Novo uniform para o raio dos pontos

    varying vec2 vUv;

    vec2 coverUv(vec2 uv) {
      vec2 s = resolution.xy / max(resolution.x, resolution.y);
      vec2 newUv = (uv - 0.5) * s + 0.5;
      return clamp(newUv, 0.0, 1.0);
    }

    // SDF para um círculo. p é a posição relativa ao centro do círculo (0.5, 0.5)
    // r é o raio do círculo
    float circleSDF(vec2 p, float r) {
        return length(p - 0.5) - r; // Distância do ponto ao centro - raio
    }

    void main() {
      vec2 uv = coverUv(vUv);

      // Coordenadas da célula da grade atual (0-1 dentro de cada célula)
      vec2 gridUv = fract(uv * gridSize);
      // Coordenadas do centro da célula para amostrar a textura do rastro
      vec2 gridUvCenter = (floor(uv * gridSize) + 0.5) / gridSize;

      float trailIntensity = texture2D(mouseTrail, gridUvCenter).r;

      // Calcula o valor do círculo SDF para a posição atual dentro da célula.
      // Se sdfValue < 0, o fragmento está dentro do círculo.
      float sdfValue = circleSDF(gridUv, dotRadius);

      // Usa smoothstep para suavizar as bordas do ponto
      // 0.005 é uma pequena suavização para anti-aliasing
      float circleAlpha = 1.0 - smoothstep(-0.005, 0.005, sdfValue);

      // Combina a intensidade do rastro com a forma do círculo
      // O pixel só é visível se houver rastro E ele estiver dentro do círculo
      float finalAlpha = trailIntensity * circleAlpha;

      // Suaviza a transição geral do rastro para evitar "pops" de pontos
      finalAlpha = smoothstep(0.05, 0.15, finalAlpha);

      gl_FragColor = vec4(pixelColor, finalAlpha);
    }
  `
);

declare global {
	namespace JSX {
		interface IntrinsicElements {
			dotMaterial: {
				resolution?: THREE.Vector2 | number[];
				mouseTrail?: THREE.Texture | null;
				gridSize?: number;
				pixelColor?: THREE.Color;
				dotRadius?: number; // Adicione ao tipo para JSX
			};
		}
	}
}

function Scene({ gridSize, trailSize, maxAge, interpolate, easingFunction, pixelColor, dotRadius }: SceneProps) {
	const size = useThree((s) => s.size);
	const viewport = useThree((s) => s.viewport);

	const dotMaterial = useMemo(() => {
		(DotMaterial as any)._r3fType = 'DotMaterialImpl';
		return new (DotMaterial as any)();
	}, []);

	dotMaterial.uniforms.pixelColor.value = new THREE.Color(pixelColor);
	dotMaterial.uniforms.dotRadius.value = dotRadius; // Passa o raio do ponto como uniform

	const [trail, onMove] = useTrailTexture({
		size: 512,
		radius: trailSize,
		maxAge: maxAge,
		interpolate: interpolate || 0.1,
		ease: easingFunction || ((x: number) => x),
	}) as [THREE.Texture | null, (e: ThreeEvent<PointerEvent>) => void];

	if (trail) {
		trail.minFilter = THREE.NearestFilter;
		trail.magFilter = THREE.NearestFilter;
		trail.wrapS = THREE.ClampToEdgeWrapping;
		trail.wrapT = THREE.ClampToEdgeWrapping;
	}

	const scaleX = viewport.width / 2;
	const scaleY = viewport.height / 2;

	return (
		<mesh scale={[scaleX, scaleY, 1]} onPointerMove={onMove}>
			<planeGeometry args={[2, 2]} />
			<primitive
				object={dotMaterial}
				attach='material'
				gridSize={gridSize}
				resolution={[size.width * viewport.dpr, size.height * viewport.dpr]}
				mouseTrail={trail}
				dotRadius={dotRadius} // Passa como prop para o primitive
			/>
		</mesh>
	);
}

export default function PixelTrail({
	gridSize = 40,
	trailSize = 0.1,
	maxAge = 250,
	interpolate = 5,
	easingFunction = (x: number) => x,
	canvasProps = {},
	glProps = {
		antialias: false,
		powerPreference: 'high-performance',
		alpha: true,
	},
	gooeyFilter,
	color = '#ffffff',
	className = '',
	dotRadius = 0.4, // Valor padrão para o raio do ponto (0.0 a 0.5)
}: PixelTrailProps) {
	return (
		<>
			{gooeyFilter && <GooeyFilter id={gooeyFilter.id} strength={gooeyFilter.strength} />}
			<Canvas
				{...canvasProps}
				gl={glProps}
				className={`absolute inset-0 z-10 ${className}`}
				style={{
					filter: gooeyFilter ? `url(#${gooeyFilter.id})` : undefined,
					...canvasProps.style,
				}}
			>
				<Scene
					gridSize={gridSize}
					trailSize={trailSize}
					maxAge={maxAge}
					interpolate={interpolate}
					easingFunction={easingFunction}
					pixelColor={color}
					dotRadius={dotRadius} // Passa para a Scene
				/>
			</Canvas>
		</>
	);
}
