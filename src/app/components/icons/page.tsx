'use client';

import CopyCode from '@/components/copyCode/copyCode';
import { PropsTable } from '@/components/customize/propsTable';
import PreviewCode from '@/components/previewCode/previewCode';

import { Aside } from '@/artiux/components/aside';
import { Icon, IconName } from '@/artiux/components/icons';

const asideItems = [
	{ id: 'preview', label: 'Prévia' },
	{ id: 'props', label: 'Props' },
	{ id: 'code', label: 'Instalação' },
];

const iconGallery: IconName[] = [
	'house',
	'search',
	'settings',
	'bell',
	'heart',
	'star',
	'user',
	'users',
	'calendar',
	'clock',
	'download',
	'upload',
	'folder',
	'file-text',
	'image',
	'camera',
	'globe',
	'lock',
	'key',
	'trash-2',
	'copy',
	'share-2',
	'eye',
	'x',
	'check',
	'info',
	'triangle-alert',
	'circle-check-big',
	'circle-alert',
	'award',
	'cloud',
];

export default function IconsComponent() {
	return (
		<div className='flex items-start gap-10'>
			<div className='min-w-0 flex-1'>
				<div>
					<h1 className='mt-20 text-5xl font-bold'>Icons</h1>
					<p className='text-muted-foreground mt-4 block text-xl'>
						Milhares de ícones lucide, acessados por nome através do componente <code>Icon</code>
					</p>
					<p className='text-muted-foreground mt-2 block text-sm'>
						Ícones cedidos pela{' '}
						<a href='https://lucide.dev/icons' target='_blank' rel='noreferrer' className='text-primary underline'>
							lucide
						</a>
						. O nome do ícone (ex: <code>house</code>, <code>chevron-right</code>) carrega só o SVG usado, sob demanda — nenhum ícone não
						utilizado entra no bundle.
					</p>
				</div>

				<section id='preview' className='my-8 scroll-mt-24'>
					<PreviewCode code={previewCode}>
						<div className='grid grid-cols-4 gap-4 sm:grid-cols-6 md:grid-cols-8'>
							{iconGallery.map((name) => (
								<div key={name} className='border-border bg-card flex flex-col items-center justify-center gap-2 rounded-lg border p-3'>
									<Icon icon={name} className='text-primary size-6' />
									<span className='text-muted-foreground text-center text-[10px] leading-tight'>{name}</span>
								</div>
							))}
						</div>
					</PreviewCode>
				</section>

				<section id='props' className='my-8 scroll-mt-24'>
					<PropsTable rows={propRows} />
				</section>

				<section id='code' className='my-8 scroll-mt-24'>
					<h3 className='text-2xl font-bold'>Instalação:</h3>
					<div className='mt-4 place-content-start'>
						<CopyCode
							installs='yarn add lucide-react class-variance-authority'
							code={componentCode}
							fileName='artiux/components/icons/index.tsx'
						/>
					</div>
				</section>
			</div>

			<Aside items={asideItems} />
		</div>
	);
}

const propRows = [
	{ property: 'icon', type: 'IconName', description: 'Nome do ícone lucide a ser renderizado (carregado sob demanda).' },
	{ property: 'strokeWidth', type: 'number', description: 'Espessura do traço do ícone.' },
	{
		property: 'size',
		type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'",
		default: "'md'",
		description: 'Tamanho pré-definido do ícone.',
	},
	{
		property: '...props',
		type: 'React.SVGProps<SVGSVGElement>',
		description: 'Demais props nativas de svg (className, style, onClick, etc.), repassadas diretamente ao ícone.',
	},
];

const previewCode = `
import { Icon } from '@/artiux/components/icons';

<Icon icon='heart' className='text-primary size-6' />
<Icon icon='star' className='text-primary size-6' />
<Icon icon='bell' className='text-primary size-6' />
`;

const componentCode = `
import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import { DynamicIcon, type IconName } from 'lucide-react/dynamic';
import { type Ref, type SVGProps } from 'react';

export type { IconName };

const sizeMap = {
	xs: 12,
	sm: 16,
	md: 20,
	lg: 24,
	xl: 32,
} as const;

export const iconVariants = cva('select-none', {
	variants: {
		size: {
			xs: '',
			sm: '',
			md: '',
			lg: '',
			xl: '',
		},
	},
	defaultVariants: {
		size: 'md',
	},
});

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'children'>, VariantProps<typeof iconVariants> {
	icon: IconName;
	strokeWidth?: number;
	ref?: Ref<SVGSVGElement>;
}

export function Icon({ icon, size = 'md', strokeWidth, className, ref, ...props }: IconProps) {
	const fontSize = sizeMap[size ?? 'md'];

	return (
		<DynamicIcon
			{...props}
			ref={ref}
			name={icon}
			size={fontSize}
			strokeWidth={strokeWidth}
			className={cn(iconVariants({ size }), className)}
		/>
	);
}
`;
