'use client';

import { Slot } from '@radix-ui/react-slot';
import { cva, VariantProps } from 'class-variance-authority';
import { GripVertical, PanelLeftIcon, SearchIcon } from 'lucide-react';
import * as React from 'react';
import { Drawer as DrawerPrimitive } from 'vaul';

import { useIsMobile } from '@/artiux/hooks/use-mobile';

import { Button } from '@/artiux/components/button';

import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/command';
import { Link } from '@/components/link';
import TextField from '@/components/textField/textField';
import { cn } from '@/lib/utils';
import { Icon } from '@iconify/react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Accordion, useAccordionItem } from './accordion';
import { textFieldVariants } from './textField';
import Tooltip from './tooltip';

const SIDEBAR_COOKIE_NAME = 'sidebar_state';
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = '16rem';
const SIDEBAR_WIDTH_MOBILE = '18rem';
const SIDEBAR_WIDTH_ICON = '3rem';
const SIDEBAR_KEYBOARD_SHORTCUT = 'b';

function normalizeSearch(value: string) {
	return value
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]/g, '');
}

// Match "fuzzy"
function fuzzyMatch(target: string, query: string) {
	let queryIndex = 0;
	for (let i = 0; i < target.length && queryIndex < query.length; i++) {
		if (target[i] === query[queryIndex]) queryIndex++;
	}
	return queryIndex === query.length;
}

interface NavItem {
	label?: string;
	href?: string;
	icon?: string;
	items?: NavItem[];
	type?: 'header' | 'group' | 'separator' | 'footer';
	logo?: string;
	logoMini?: string;
}

const sidebarGroupLabelClass =
	'text-sidebar-foreground/70 ring-sidebar-ring outline-hidden flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0';

function AccordionGroupLinkLabel({ href, label }: { href: string; label?: string }) {
	const { open, toggle } = useAccordionItem();

	return (
		<div className={cn(sidebarGroupLabelClass, 'justify-between')}>
			<Link href={href} className='flex-1 truncate'>
				{label}
			</Link>
			<button type='button' onClick={toggle} aria-expanded={open} aria-label='Toggle group' className='shrink-0 p-1'>
				<Accordion.Chevron />
			</button>
		</div>
	);
}

type SidebarContextProps = {
	state: 'expanded' | 'collapsed';
	open: boolean;
	setOpen: (open: boolean) => void;
	openMobile: boolean;
	setOpenMobile: (open: boolean) => void;
	isMobile: boolean;
	toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextProps | null>(null);

function useSidebar() {
	const context = React.useContext(SidebarContext);
	if (!context) {
		throw new Error('useSidebar must be used within a SidebarProvider.');
	}

	return context;
}

function SidebarProvider({
	defaultOpen = true,
	open: openProp,
	onOpenChange: setOpenProp,
	className,
	style,
	children,
	navItems,
	variant = 'sidebar',
	collapsible = 'icon',
	...props
}: React.ComponentProps<'div'> & {
	defaultOpen?: boolean;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	navItems?: NavItem[];
	variant?: 'sidebar' | 'floating' | 'inset';
	collapsible?: 'offcanvas' | 'icon' | 'none';
}) {
	const isMobile = useIsMobile();
	const pathname = usePathname();
	const router = useRouter();
	const [openMobile, setOpenMobile] = React.useState(false);
	const [commandOpen, setCommandOpen] = React.useState(false);
	const [search, setSearch] = React.useState('');

	const [_open, _setOpen] = React.useState(defaultOpen);
	const open = openProp ?? _open;
	const setOpen = React.useCallback(
		(value: boolean | ((value: boolean) => boolean)) => {
			const openState = typeof value === 'function' ? value(open) : value;
			if (setOpenProp) {
				setOpenProp(openState);
			} else {
				_setOpen(openState);
			}

			document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
		},
		[setOpenProp, open]
	);

	const toggleSidebar = React.useCallback(() => {
		return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
	}, [isMobile, setOpen, setOpenMobile]);

	React.useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
				event.preventDefault();
				toggleSidebar();
			}

			if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
				event.preventDefault();
				setCommandOpen((value) => !value);
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [toggleSidebar]);

	const searchItems = React.useMemo(() => {
		if (!navItems) return [];

		return navItems
			.filter((item) => item.type === 'group')
			.flatMap((group) =>
				(group.items || []).map((subItem) => ({
					label: subItem.label || '',
					href: subItem.href || '/',
					category: group.label || '',
				}))
			);
	}, [navItems]);

	const searchCategories = React.useMemo(() => {
		return Array.from(new Set(searchItems.map((item) => item.category))).filter(Boolean);
	}, [searchItems]);

	const filteredSearchItems = React.useMemo(() => {
		if (!search) return searchItems;
		const query = normalizeSearch(search);
		return searchItems.filter(
			(item) => fuzzyMatch(normalizeSearch(item.label), query) || fuzzyMatch(normalizeSearch(item.category), query)
		);
	}, [searchItems, search]);

	const handleSelectItem = React.useCallback(
		(href: string) => {
			setCommandOpen(false);
			setSearch('');
			router.push(href);
		},
		[router]
	);

	const state = open ? 'expanded' : 'collapsed';

	const contextValue = React.useMemo<SidebarContextProps>(
		() => ({
			state,
			open,
			setOpen,
			isMobile,
			openMobile,
			setOpenMobile,
			toggleSidebar,
		}),
		[state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
	);

	const closeOnMobile = React.useCallback(() => {
		if (isMobile) setOpenMobile(false);
	}, [isMobile, setOpenMobile]);

	const renderNavItems = (items: NavItem[], state: 'expanded' | 'collapsed') => {
		const headerItems = items.filter((item) => item.type === 'header');
		const footerItems = items.filter((item) => item.type === 'footer');
		const mainItems = items.filter((item) => item.type !== 'header' && item.type !== 'footer');
		const groupValues = mainItems.filter((item) => item.type === 'group').map((item, index) => item.label || `group-${index}`);

		return (
			<>
				{headerItems[0] && (
					<SidebarHeader className='flex-col items-stretch'>
						<Link href={headerItems[0].href || '/'} className='flex items-center gap-2'>
							{headerItems[0].logo && headerItems[0].logoMini && (
								<div className='w-20 overflow-hidden'>
									<motion.div
										initial={{ x: 0 }}
										animate={{ x: state === 'collapsed' ? -80 : 0 }}
										transition={{ type: 'spring', stiffness: 300, damping: 30 }}
										className='flex w-40'
									>
										<Image priority src={headerItems[0].logo} alt={headerItems[0].label || 'Logo'} className='w-20 shrink-0' />
										<Image
											priority
											src={headerItems[0].logoMini}
											alt={headerItems[0].label || 'Logo'}
											className='w-10 shrink-0 object-cover'
										/>
									</motion.div>
								</div>
							)}

							<motion.span
								className='flex-1 text-lg font-semibold'
								initial={{ opacity: 0 }}
								animate={{ opacity: state === 'collapsed' ? 0 : 1 }}
							>
								{headerItems[0].label}
							</motion.span>
						</Link>

						<button
							type='button'
							onClick={() => setCommandOpen(true)}
							className={cn(
								textFieldVariants(),
								'text-sidebar-foreground/70 hover:bg-accent hover:text-accent-foreground mt-2 flex h-8 w-full items-center gap-2 rounded-md px-2 text-sm transition-colors'
							)}
						>
							<SearchIcon className='size-4 shrink-0 opacity-50' />
							<motion.span
								className='flex-1 truncate text-left'
								initial={{ opacity: 0 }}
								animate={{ opacity: state === 'collapsed' ? 0 : 1 }}
							>
								Buscar...
							</motion.span>
							<motion.kbd
								className='bg-input text-primary pointer-events-none inline-flex h-5 shrink-0 items-center gap-1 rounded px-1.5 font-mono text-[10px] font-medium select-none'
								initial={{ opacity: 0 }}
								animate={{ opacity: state === 'collapsed' ? 0 : 1 }}
							>
								<span className='text-xs'>⌘</span>K
							</motion.kbd>
						</button>
					</SidebarHeader>
				)}

				<SidebarContent>
					<Accordion type='multiple' defaultValue={groupValues}>
						{mainItems.map((item, index) => {
							if (item.type === 'separator') {
								return <SidebarSeparator key={index} />;
							}

							if (item.type === 'group') {
								const value = item.label || `group-${index}`;

								return (
									<Accordion.Item key={index} value={value}>
										<SidebarGroup>
											{item.href ? (
												<AccordionGroupLinkLabel href={item.href} label={item.label} />
											) : (
												<Accordion.Trigger className={sidebarGroupLabelClass}>
													{item.label}
													<Accordion.Chevron />
												</Accordion.Trigger>
											)}
											<Accordion.Content>
												<SidebarGroupContent>
													<SidebarMenu>
														{item.items?.map((subItem, subIndex) => (
															<SidebarMenuItem key={subIndex}>
																<SidebarMenuButton asChild isActive={pathname === subItem.href} onClick={closeOnMobile}>
																	<Link href={subItem.href || '/'}>
																		{subItem.icon && <Icon icon={subItem.icon} />}
																		<span>{subItem.label}</span>
																	</Link>
																</SidebarMenuButton>
															</SidebarMenuItem>
														))}
													</SidebarMenu>
												</SidebarGroupContent>
											</Accordion.Content>
										</SidebarGroup>
									</Accordion.Item>
								);
							}

							return (
								<SidebarGroup key={index}>
									<SidebarGroupContent>
										<SidebarMenu>
											<SidebarMenuItem>
												<SidebarMenuButton asChild isActive={pathname === item.href} onClick={closeOnMobile}>
													<Link href={item.href || '/'}>
														{item.icon && <Icon icon={item.icon} />}
														<span>{item.label}</span>
													</Link>
												</SidebarMenuButton>
											</SidebarMenuItem>
										</SidebarMenu>
									</SidebarGroupContent>
								</SidebarGroup>
							);
						})}
					</Accordion>
				</SidebarContent>

				{footerItems.length > 0 && (
					<SidebarFooter>
						{footerItems.map((item, index) => (
							<div key={`footer-${index}`} className='flex items-center gap-2'>
								{item.icon && <Icon icon={item.icon} className='h-4 w-4' />}
								<span className='text-sm'>{item.label}</span>
							</div>
						))}
					</SidebarFooter>
				)}

				<CommandDialog open={commandOpen} onClose={() => setCommandOpen(false)}>
					<CommandInput placeholder='Buscar artigo ou categoria...' value={search} onValueChange={setSearch} />
					<CommandList>
						<CommandEmpty>Sem resultados.</CommandEmpty>
						{filteredSearchItems.length > 0 && (
							<CommandGroup heading='Sugestões'>
								{filteredSearchItems.map((item) => (
									<CommandItem key={item.href} value={`${item.label} ${item.category}`} onSelect={() => handleSelectItem(item.href)}>
										{item.label}
									</CommandItem>
								))}
							</CommandGroup>
						)}
						{searchCategories.length > 0 && (
							<>
								<CommandSeparator />
								<CommandGroup heading='Categorias'>
									{searchCategories.map((category) => (
										<CommandItem key={category} value={category} onSelect={() => setSearch(category)}>
											#{category}
										</CommandItem>
									))}
								</CommandGroup>
							</>
						)}
					</CommandList>
				</CommandDialog>
			</>
		);
	};

	return (
		<SidebarContext.Provider value={contextValue}>
			<Tooltip.Provider delayDuration={0}>
				<div
					data-slot='sidebar-wrapper'
					style={
						{
							'--sidebar-width': SIDEBAR_WIDTH,
							'--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
							...style,
						} as React.CSSProperties
					}
					className={cn('group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full', className)}
					{...props}
				>
					<Sidebar variant={'inset'} collapsible={collapsible}>
						{navItems ? <>{renderNavItems(navItems, state)}</> : children}
					</Sidebar>
					{children && <SidebarInset>{children}</SidebarInset>}
				</div>
			</Tooltip.Provider>
		</SidebarContext.Provider>
	);
}

function Sidebar({
	side = 'left',
	variant = 'sidebar',
	collapsible = 'offcanvas',
	className,
	children,
	...props
}: React.ComponentProps<'div'> & {
	side?: 'left' | 'right';
	variant?: 'sidebar' | 'floating' | 'inset';
	collapsible?: 'offcanvas' | 'icon' | 'none';
}) {
	const { isMobile, state, openMobile, setOpenMobile, setOpen } = useSidebar();

	if (isMobile) {
		return (
			<DrawerPrimitive.Root open={openMobile} onOpenChange={setOpenMobile} direction={side}>
				<DrawerPrimitive.Portal>
					<DrawerPrimitive.Overlay className='fixed inset-0 z-[9998] bg-black/50' />
					<DrawerPrimitive.Content
						data-sidebar='sidebar'
						data-slot='sidebar'
						data-mobile='true'
						className={cn(
							'bg-sidebar text-sidebar-foreground fixed inset-y-0 z-[9999] flex h-full w-(--sidebar-width) flex-col p-0 outline-none',
							side === 'left' ? 'left-0' : 'right-0'
						)}
						style={
							{
								'--sidebar-width': SIDEBAR_WIDTH_MOBILE,
							} as React.CSSProperties
						}
					>
						<DrawerPrimitive.Title className='sr-only'>Sidebar</DrawerPrimitive.Title>
						<DrawerPrimitive.Description className='sr-only'>Displays the mobile sidebar.</DrawerPrimitive.Description>
						<div className='flex h-full w-full flex-col'>{children}</div>
					</DrawerPrimitive.Content>
				</DrawerPrimitive.Portal>
			</DrawerPrimitive.Root>
		);
	}

	return (
		<div
			className='text-sidebar-foreground group peer hidden md:block'
			data-state={state}
			data-collapsible={state === 'collapsed' ? collapsible : ''}
			data-variant={variant}
			data-side={side}
			data-slot='sidebar'
		>
			{/* This is what handles the sidebar gap on desktop */}
			<div
				data-slot='sidebar-gap'
				className={cn(
					'relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear',
					'group-data-[collapsible=offcanvas]:w-0',
					'group-data-[side=right]:rotate-180',
					variant === 'floating' || variant === 'inset'
						? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]'
						: 'group-data-[collapsible=icon]:w-(--sidebar-width-icon)'
				)}
			/>
			<div
				data-slot='sidebar-container'
				className={cn(
					'sticky inset-y-0 z-[9999] hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex',
					side === 'left'
						? 'left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]'
						: 'right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]',

					variant === 'floating' || variant === 'inset'
						? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]'
						: 'border-sidebar-border group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l',
					className
				)}
				{...props}
			>
				<div
					data-sidebar='sidebar'
					data-slot='sidebar-inner'
					className='bg-sidebar group-data-[variant=floating]:border-sidebar-border mt-4 flex w-full flex-col rounded-tl-2xl group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm'
				>
					{children}
					{collapsible !== 'none' && <SidebarRail />}
				</div>
			</div>
		</div>
	);
}

function SidebarRail({ className, ...props }: React.ComponentProps<'button'>) {
	const { toggleSidebar } = useSidebar();
	return (
		<button
			data-sidebar='rail'
			data-slot='sidebar-rail'
			aria-label='Toggle Sidebar'
			tabIndex={-1}
			onClick={toggleSidebar}
			title='Toggle Sidebar'
			className={cn(
				'hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] sm:flex',
				'in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize',
				'[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize',
				'hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full',
				'[[data-side=left][data-collapsible=offcanvas]_&]:-right-2',
				'[[data-side=right][data-collapsible=offcanvas]_&]:-left-2',
				className
			)}
			{...props}
		>
			<div className='bg-primary mt-20 h-max rounded px-0.5 py-1'>
				<GripVertical size={20} />
			</div>
		</button>
	);
}

function SidebarTrigger({ className, onClick, ...props }: React.ComponentProps<typeof Button>) {
	const { toggleSidebar } = useSidebar();

	return (
		<Button
			data-sidebar='trigger'
			data-slot='sidebar-trigger'
			variant='ghost'
			className={cn('size-7', className)}
			onClick={(event) => {
				onClick?.(event);
				toggleSidebar();
			}}
			{...props}
		>
			<PanelLeftIcon />
			<span className='sr-only'>Toggle Sidebar</span>
		</Button>
	);
}

function SidebarInset({ className, ...props }: React.ComponentProps<'main'>) {
	return (
		<main
			data-slot='sidebar-inset'
			className={cn(
				'md:scrollbar-thin md:scrollbar-thumb-zinc-400 md:scrollbar-track-zinc-100/0',
				'bg-background relative h-screen w-full flex-1 flex-col overflow-auto px-4 py-4',
				'border-sidebar md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-tl-xl md:peer-data-[variant=inset]:border-t-2 md:peer-data-[variant=inset]:shadow-sm',
				className
			)}
			{...props}
		/>
	);
}

function SidebarInput({ className, ...props }: React.ComponentProps<typeof TextField>) {
	return (
		<TextField
			data-slot='sidebar-input'
			data-sidebar='input'
			className={cn('bg-background h-8 w-full shadow-none', className)}
			{...props}
		/>
	);
}

function SidebarHeader({ className, ...props }: React.ComponentProps<'div'>) {
	return <div data-slot='sidebar-header' data-sidebar='header' className={cn('flex gap-2 p-2', className)} {...props} />;
}

function SidebarFooter({ className, ...props }: React.ComponentProps<'div'>) {
	return <div data-slot='sidebar-footer' data-sidebar='footer' className={cn('flex flex-col gap-2 p-2', className)} {...props} />;
}

function SidebarSeparator({ className, ...props }: React.HTMLAttributes<HTMLHRElement>) {
	return <hr className={cn('border-sidebar-border mx-2 w-auto', className)} {...props} />;
}

function SidebarContent({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot='sidebar-content'
			data-sidebar='content'
			className={cn(
				'flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden',
				'scrollbar-thin scrollbar-thumb-zinc-400 scrollbar-track-zinc-100/0 overflow-y-scroll',
				className
			)}
			{...props}
		/>
	);
}

function SidebarGroup({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div data-slot='sidebar-group' data-sidebar='group' className={cn('relative flex w-full min-w-0 flex-col p-2', className)} {...props} />
	);
}

function SidebarGroupLabel({ className, asChild = false, ...props }: React.ComponentProps<'div'> & { asChild?: boolean }) {
	const Comp = asChild ? Slot : 'div';

	return (
		<Comp
			data-slot='sidebar-group-label'
			data-sidebar='group-label'
			className={cn(
				'text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
				'group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0',
				className
			)}
			{...props}
		/>
	);
}

function SidebarGroupAction({ className, asChild = false, ...props }: React.ComponentProps<'button'> & { asChild?: boolean }) {
	const Comp = asChild ? Slot : 'button';

	return (
		<Comp
			data-slot='sidebar-group-action'
			data-sidebar='group-action'
			className={cn(
				'text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
				'after:absolute after:-inset-2 md:after:hidden',
				'group-data-[collapsible=icon]:hidden',
				className
			)}
			{...props}
		/>
	);
}

function SidebarGroupContent({ className, ...props }: React.ComponentProps<'div'>) {
	return <div data-slot='sidebar-group-content' data-sidebar='group-content' className={cn('w-full text-sm', className)} {...props} />;
}

function SidebarMenu({ className, ...props }: React.ComponentProps<'ul'>) {
	return <ul data-slot='sidebar-menu' data-sidebar='menu' className={cn('flex w-full min-w-0 flex-col gap-1', className)} {...props} />;
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<'li'>) {
	return <li data-slot='sidebar-menu-item' data-sidebar='menu-item' className={cn('group/menu-item relative', className)} {...props} />;
}

const sidebarMenuButtonVariants = cva(
	'peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0',
	{
		variants: {
			variant: {
				default: 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
				outline:
					'bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]',
			},
			size: {
				default: 'h-8 text-sm',
				sm: 'h-7 text-xs',
				lg: 'h-12 text-sm group-data-[collapsible=icon]:p-0!',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	}
);

function SidebarMenuButton({
	asChild = false,
	isActive = false,
	variant = 'default',
	size = 'default',
	tooltip,
	className,
	...props
}: React.ComponentProps<'button'> & {
	asChild?: boolean;
	isActive?: boolean;
	tooltip?: string | React.ComponentProps<typeof Tooltip.Content>;
} & VariantProps<typeof sidebarMenuButtonVariants>) {
	const Comp = asChild ? Slot : 'button';
	const { isMobile, state } = useSidebar();

	const button = (
		<Comp
			data-slot='sidebar-menu-button'
			data-sidebar='menu-button'
			data-size={size}
			data-active={isActive}
			className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
			{...props}
		/>
	);

	if (!tooltip) {
		return button;
	}

	if (typeof tooltip === 'string') {
		tooltip = {
			children: tooltip,
		};
	}

	return (
		<Tooltip>
			<Tooltip.Trigger asChild>{button}</Tooltip.Trigger>
			<Tooltip.Content side='right' align='center' hidden={state !== 'collapsed' || isMobile} {...tooltip} />
		</Tooltip>
	);
}

function SidebarMenuAction({
	className,
	asChild = false,
	showOnHover = false,
	...props
}: React.ComponentProps<'button'> & {
	asChild?: boolean;
	showOnHover?: boolean;
}) {
	const Comp = asChild ? Slot : 'button';

	return (
		<Comp
			data-slot='sidebar-menu-action'
			data-sidebar='menu-action'
			className={cn(
				'text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground peer-hover/menu-button:text-sidebar-accent-foreground absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
				'after:absolute after:-inset-2 md:after:hidden',
				'peer-data-[size=sm]/menu-button:top-1',
				'peer-data-[size=default]/menu-button:top-1.5',
				'peer-data-[size=lg]/menu-button:top-2.5',
				'group-data-[collapsible=icon]:hidden',
				showOnHover &&
					'peer-data-[active=true]/menu-button:text-sidebar-accent-foreground group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 md:opacity-0',
				className
			)}
			{...props}
		/>
	);
}

function SidebarMenuBadge({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot='sidebar-menu-badge'
			data-sidebar='menu-badge'
			className={cn(
				'text-sidebar-foreground pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums select-none',
				'peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground',
				'peer-data-[size=sm]/menu-button:top-1',
				'peer-data-[size=default]/menu-button:top-1.5',
				'peer-data-[size=lg]/menu-button:top-2.5',
				'group-data-[collapsible=icon]:hidden',
				className
			)}
			{...props}
		/>
	);
}

function SidebarMenuSub({ className, ...props }: React.ComponentProps<'ul'>) {
	return (
		<ul
			data-slot='sidebar-menu-sub'
			data-sidebar='menu-sub'
			className={cn(
				'border-sidebar-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5',
				'group-data-[collapsible=icon]:hidden',
				className
			)}
			{...props}
		/>
	);
}

function SidebarMenuSubItem({ className, ...props }: React.ComponentProps<'li'>) {
	return (
		<li
			data-slot='sidebar-menu-sub-item'
			data-sidebar='menu-sub-item'
			className={cn('group/menu-sub-item relative', className)}
			{...props}
		/>
	);
}

function SidebarMenuSubButton({
	asChild = false,
	size = 'md',
	isActive = false,
	className,
	...props
}: React.ComponentProps<'a'> & {
	asChild?: boolean;
	size?: 'sm' | 'md';
	isActive?: boolean;
}) {
	const Comp = asChild ? Slot : 'a';

	return (
		<Comp
			data-slot='sidebar-menu-sub-button'
			data-sidebar='menu-sub-button'
			data-size={size}
			data-active={isActive}
			className={cn(
				'text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground [&>svg]:text-sidebar-accent-foreground flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 outline-hidden focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0',
				'data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground',
				size === 'sm' && 'text-xs',
				size === 'md' && 'text-sm',
				'group-data-[collapsible=icon]:hidden',
				className
			)}
			{...props}
		/>
	);
}

Sidebar.Content = SidebarContent;
Sidebar.Footer = SidebarFooter;
Sidebar.Group = SidebarGroup;
Sidebar.GroupAction = SidebarGroupAction;
Sidebar.GroupContent = SidebarGroupContent;
Sidebar.GroupLabel = SidebarGroupLabel;
Sidebar.Header = SidebarHeader;
Sidebar.Input = SidebarInput;
Sidebar.Inset = SidebarInset;
Sidebar.Menu = SidebarMenu;
Sidebar.MenuAction = SidebarMenuAction;
Sidebar.MenuBadge = SidebarMenuBadge;
Sidebar.MenuButton = SidebarMenuButton;
Sidebar.MenuItem = SidebarMenuItem;
Sidebar.MenuSub = SidebarMenuSub;
Sidebar.MenuSubButton = SidebarMenuSubButton;
Sidebar.MenuSubItem = SidebarMenuSubItem;
Sidebar.Provider = SidebarProvider;
Sidebar.Separator = SidebarSeparator;
Sidebar.Trigger = SidebarTrigger;

export { Sidebar, useSidebar, type NavItem };
