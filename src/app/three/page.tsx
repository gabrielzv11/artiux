'use client';

import { Center, Environment, Lightformer, MeshTransmissionMaterial, Text3D } from '@react-three/drei';
import { Canvas, useLoader } from '@react-three/fiber';
import { button, useControls } from 'leva';
import { Suspense } from 'react';
import { RGBELoader } from 'three-stdlib';

export default function Three() {
	const { autoRotate, text, shadow, ...config } = useControls({
		text: 'Brutal',
		backside: true,
		backsideThickness: { value: 0.15, min: 0, max: 2 },
		samples: { value: 16, min: 1, max: 32, step: 1 },
		resolution: { value: 1024, min: 64, max: 2048, step: 64 },
		transmission: { value: 1, min: 0, max: 1 },
		clearcoat: { value: 1, min: 0.1, max: 1 },
		clearcoatRoughness: { value: 0.0, min: 0, max: 1 },
		thickness: { value: 0.3, min: 0, max: 5 },
		chromaticAberration: { value: 0.15, min: -5, max: 5 },
		anisotropy: { value: 0.25, min: 0, max: 1, step: 0.01 },
		roughness: { value: 0, min: 0, max: 1, step: 0.01 },
		distortion: { value: 0.5, min: 0, max: 4, step: 0.01 },
		distortionScale: { value: 0.1, min: 0.01, max: 1, step: 0.01 },
		temporalDistortion: { value: 0, min: 0, max: 1, step: 0.01 },
		ior: { value: 1.25, min: 0, max: 2, step: 0.01 },
		color: 'white',
		shadow: '#94cbff',
		autoRotate: false,
		screenshot: button(() => {
			// Save the canvas as a *.png
			const link = document.createElement('a');
			link.setAttribute('download', 'canvas.png');
			link.setAttribute(
				'href',
				(document.querySelector('canvas') as HTMLCanvasElement).toDataURL('image/png').replace('image/png', 'image/octet-stream')
			);
			link.click();
		}),
	});

	return (
		<div className='relative h-screen w-full'>
			<Canvas camera={{ position: [0, 0, 25], fov: 35 }} gl={{ preserveDrawingBuffer: true }}>
				{/** The text and the grid */}

				<Suspense fallback={null}>
					<Text config={config} position={[0, -1, 3]}>
						{text}
					</Text>
				</Suspense>

				{/** The environment is just a bunch of shapes emitting light. This is needed for the clear-coat */}
				<Environment resolution={32}>
					<group rotation={[-Math.PI / 4, -0.3, 0]}>
						<Lightformer intensity={20} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
						<Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[10, 2, 1]} />
						<Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={[10, 2, 1]} />
						<Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[20, 2, 1]} />
						<Lightformer type='ring' intensity={2} rotation-y={Math.PI / 2} position={[-0.1, -1, -5]} scale={10} />
					</group>
				</Environment>
			</Canvas>
		</div>
	);
}

function Text({ children, config, font = '/inter_medium_font.json', ...props }: any) {
	const texture = useLoader(RGBELoader, 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/aerodynamics_workshop_1k.hdr');
	return (
		<>
			<group>
				<Center scale={[1, 1, 1]} {...props}>
					<Text3D
						castShadow
						bevelEnabled
						font={font}
						scale={5}
						letterSpacing={-0.03}
						height={0.25}
						bevelSize={0.01}
						bevelSegments={10}
						curveSegments={128}
						bevelThickness={0.01}
					>
						{children}
						<MeshTransmissionMaterial {...config} background={texture} />
					</Text3D>
				</Center>
			</group>
		</>
	);
}
