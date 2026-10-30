'use client';

import * as React from 'react';
import { Drawer as DrawerPrimitive } from 'vaul';

import { cn } from '@/lib/utils';
import { RippleContainer } from '../rippleContainer/rippleContainer';
import { textVariants } from '../text';

const DrawerContext = React.createContext<{ fullScreen?: boolean; handle?: boolean }>({});

export type DrawerProps = React.ComponentProps<typeof DrawerPrimitive.Root> & {
	fullScreen?: boolean;
	/** Exibe a barra de arrastar (handle). Padrão: true. */
	handle?: boolean;
};

function Drawer({ fullScreen, handle = true, ...props }: DrawerProps) {
	return (
		<DrawerContext.Provider value={{ fullScreen, handle }}>
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
	const { fullScreen, handle = true } = React.useContext(DrawerContext);

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
				{handle && <DrawerHandle />}

				{/* A MUDANÇA ESTÁ AQUI: overflow-y-auto e flex-1 */}
				<div data-slot='drawer-scroll' className='w-full max-w-prose flex-1 overflow-x-hidden overflow-y-auto px-2'>
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
