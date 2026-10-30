'use client';

import { useState } from 'react';

import CopyCode from '@/components/copyCode/copyCode';
import { ControlDropdown, ControlSwitch, Customize } from '@/components/customize/customize';
import { PropsTable } from '@/components/customize/propsTable';
import PreviewCode from '@/components/previewCode/previewCode';

import { Aside } from '@/artiux/components/aside';
import { Button } from '@/artiux/components/button';
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/artiux/components/drawer';

const asideItems = [
	{ id: 'preview', label: 'Prévia' },
	{ id: 'props', label: 'Props' },
	{ id: 'code', label: 'Instalação' },
];

const directions = ['bottom', 'top', 'left', 'right'] as const;

export default function DrawerComponent() {
	const [direction, setDirection] = useState<(typeof directions)[number]>('bottom');
	const [fullScreen, setFullScreen] = useState(false);
	const [dismissible, setDismissible] = useState(true);

	const props = [
		direction !== 'bottom' ? `direction='${direction}'` : null,
		fullScreen ? 'fullScreen' : null,
		!dismissible ? 'dismissible={false}' : null,
	]
		.filter(Boolean)
		.join(' ');

	const dynamicPreviewCode = `
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/artiux/components/drawer';

<Drawer ${props}>
	<DrawerTrigger asChild>
		<Button size='sm'>Abrir Drawer</Button>
	</DrawerTrigger>
	<DrawerContent>
		<DrawerHeader>
			<DrawerTitle>Você tem certeza?</DrawerTitle>
			<DrawerDescription>Essa ação não pode ser desfeita.</DrawerDescription>
		</DrawerHeader>
		<div>
			<p className='text-base'>Tem certeza que deseja continuar?</p>
		</div>
		<DrawerFooter>
			<Button>Confirmar</Button>
			<DrawerClose>
				<Button variant='ghost'>Cancelar</Button>
			</DrawerClose>
		</DrawerFooter>
	</DrawerContent>
</Drawer>
`;

	return (
		<div className='flex items-start gap-10'>
			<div className='min-w-0 flex-1'>
				<div>
					<h1 className='mt-20 text-5xl font-bold'>Drawer</h1>
					<p className='text-muted-foreground mt-4 block text-xl'>Um painel deslizante para conteúdo ou ações contextuais</p>
				</div>

				<section id='preview' className='my-8 scroll-mt-24'>
					<PreviewCode code={dynamicPreviewCode}>
						<Drawer direction={direction} fullScreen={fullScreen} dismissible={dismissible}>
							<DrawerTrigger asChild>
								<Button size='sm'>Abrir Drawer</Button>
							</DrawerTrigger>
							<DrawerContent>
								<DrawerHeader>
									<DrawerTitle>Você tem certeza?</DrawerTitle>
									<DrawerDescription>Essa ação não pode ser desfeita.</DrawerDescription>
								</DrawerHeader>
								<div>
									<p className='text-base'>Tem certeza que deseja continuar? Essa ação não pode ser desfeita.</p>
								</div>
								<DrawerFooter>
									<Button>Confirmar</Button>
									<DrawerClose>
										<Button variant='ghost'>Cancelar</Button>
									</DrawerClose>
								</DrawerFooter>
							</DrawerContent>
						</Drawer>

						<Drawer fullScreen>
							<DrawerTrigger asChild>
								<Button size='sm' variant='secondary'>
									Abrir em tela cheia
								</Button>
							</DrawerTrigger>
							<DrawerContent>
								<DrawerHeader>
									<DrawerTitle>Drawer em tela cheia</DrawerTitle>
									<DrawerDescription>Use a prop `fullScreen` para ocupar toda a viewport.</DrawerDescription>
								</DrawerHeader>
								<div>
									<p className='text-base'>Conteúdo do drawer em tela cheia.</p>
								</div>
								<DrawerFooter>
									<DrawerClose>
										<Button variant='ghost'>Fechar</Button>
									</DrawerClose>
								</DrawerFooter>
							</DrawerContent>
						</Drawer>
					</PreviewCode>
				</section>

				<section id='customize' className='my-8 scroll-mt-24'>
					<Customize>
						<ControlDropdown label='Direction' value={direction} options={directions} onChange={setDirection} />
						<ControlSwitch label='Full screen' checked={fullScreen} onChange={setFullScreen} />
						<ControlSwitch label='Dismissible' checked={dismissible} onChange={setDismissible} />
					</Customize>
				</section>

				<section id='props' className='my-8 scroll-mt-24'>
					<PropsTable rows={propRows} />
				</section>

				<section id='code' className='my-8 scroll-mt-24'>
					<h3 className='text-2xl font-bold'>Instalação:</h3>
					<div className='mt-4 place-content-start'>
						<CopyCode installs='yarn add vaul' code={componentCode} fileName='artiux/components/drawer/index.tsx' />
					</div>
				</section>
			</div>

			<Aside items={asideItems} />
		</div>
	);
}

const propRows = [
	{
		property: 'fullScreen',
		type: 'boolean',
		default: 'false',
		description: 'Faz o drawer ocupar toda a viewport, ignorando a direção definida.',
	},
	{
		property: 'direction',
		type: "'top' | 'bottom' | 'left' | 'right'",
		default: "'bottom'",
		description: 'Direção de onde o drawer desliza (herdado do Root do vaul).',
	},
	{
		property: 'dismissible',
		type: 'boolean',
		default: 'true',
		description: 'Permite fechar o drawer arrastando o handle ou clicando fora dele.',
	},
	{
		property: 'open',
		type: 'boolean',
		description: 'Controla a visibilidade do drawer de forma controlada.',
	},
	{
		property: 'onOpenChange',
		type: '(open: boolean) => void',
		description: 'Callback disparado quando o estado de abertura muda.',
	},
	{
		property: 'modal',
		type: 'boolean',
		default: 'true',
		description: 'Define se o drawer bloqueia a interação com o restante da página.',
	},
];

const componentCode = `
'use client';

import * as React from 'react';
import { Drawer as DrawerPrimitive } from 'vaul';

import { cn } from '@/lib/utils';
import { RippleContainer } from '../rippleContainer';
import { textVariants } from '../text';

const DrawerContext = React.createContext<{ fullScreen?: boolean }>({});

export type DrawerProps = React.ComponentProps<typeof DrawerPrimitive.Root> & {
	fullScreen?: boolean;
};

function Drawer({ fullScreen, ...props }: DrawerProps) {
	return (
		<DrawerContext.Provider value={{ fullScreen }}>
			<DrawerPrimitive.Root data-slot='drawer' {...props} />
		</DrawerContext.Provider>
	);
}

function DrawerTrigger({ ...props }: React.ComponentProps<typeof DrawerPrimitive.Trigger>) {
	return props.asChild ? (
		<DrawerPrimitive.Trigger data-slot='drawer-trigger' {...props} />
	) : (
		<RippleContainer>
			<DrawerPrimitive.Trigger data-slot='drawer-trigger' {...props} />
		</RippleContainer>
	);
}

function DrawerPortal({ ...props }: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
	return <DrawerPrimitive.Portal data-slot='drawer-portal' {...props} />;
}

function DrawerClose({ ...props }: React.ComponentProps<typeof DrawerPrimitive.Close>) {
	return <DrawerPrimitive.Close data-slot='drawer-close' {...props} />;
}

function DrawerOverlay({ className, ...props }: React.ComponentProps<typeof DrawerPrimitive.Overlay>) {
	return (
		<DrawerPrimitive.Overlay
			data-slot='drawer-overlay'
			className={cn('fixed inset-0 z-50 bg-black/50 backdrop-blur-[4px]', className)}
			{...props}
		/>
	);
}

function DrawerContent({ className, children, ...props }: React.ComponentProps<typeof DrawerPrimitive.Content>) {
	const { fullScreen } = React.useContext(DrawerContext);

	return (
		<DrawerPortal data-slot='drawer-portal'>
			<DrawerOverlay />
			<DrawerPrimitive.Content
				data-slot='drawer-content'
				className={cn(
					'group/drawer-content bg-background shadow-top-xl fixed z-50 flex flex-col items-center p-4 outline-none',
					fullScreen
						? 'inset-0 h-screen w-full rounded-none'
						: [
								'data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-lg',
								'data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-t-lg',
								'data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:sm:max-w-sm',
								'data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:sm:max-w-sm',
							],
					className
				)}
				{...props}
			>
				<DrawerHandle />

				<div data-slot='drawer-scroll' className='w-full max-w-prose flex-1 overflow-y-auto overflow-x-hidden px-2'>
					{children}
				</div>
			</DrawerPrimitive.Content>
		</DrawerPortal>
	);
}

function DrawerHandle() {
	return (
		<div
			data-vaul-handle
			className='bg-border mx-auto my-2 hidden h-1 w-[90px] shrink-0 rounded-full group-data-[vaul-drawer-direction=bottom]/drawer-content:block'
		/>
	);
}
function DrawerHeader({ className, ...props }: React.ComponentProps<'div'>) {
	return <div data-slot='drawer-header' className={cn('flex flex-col py-4 text-left md:text-left', className)} {...props} />;
}

function DrawerFooter({ className, ...props }: React.ComponentProps<'div'>) {
	return <div data-slot='drawer-footer' className={cn('mt-auto flex w-full flex-col gap-2 pt-4', className)} {...props} />;
}

function DrawerTitle({ className, ...props }: React.ComponentProps<typeof DrawerPrimitive.Title>) {
	return <DrawerPrimitive.Title data-slot='drawer-title' className={cn(textVariants({ typography: 'h4' }), className)} {...props} />;
}

function DrawerDescription({ className, ...props }: React.ComponentProps<typeof DrawerPrimitive.Description>) {
	return (
		<DrawerPrimitive.Description
			data-slot='drawer-description'
			className={cn('text-emphasis-low', textVariants({ typography: 'description-2' }), className)}
			{...props}
		/>
	);
}

function DrawerBody({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div {...props} data-slot='drawer-body' className={cn(' ', className)}>
			{children}
		</div>
	);
}

export {
	Drawer,
	DrawerBody,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	DrawerPortal,
	DrawerTitle,
	DrawerTrigger,
};
`;
