'use client';

import { Accordion } from '@/artiux/components/accordion';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/artiux/components/drawer';
import { useIsMobile } from '@/artiux/hooks/use-mobile';
import logo from '@/assets/brand/logo.svg';
import { Link } from '@/components/link';
import { RainbowButton } from '@/components/ui/rainbow-button';
import { componentsNavItems } from '@/data/components-nav';
import { Menu } from 'lucide-react';

import Image from 'next/image';
import { useState } from 'react';

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function Header({ ...props }: HeaderProps) {
	const isMobile = useIsMobile();

	return (
		<>
			<header className='fixed top-0 z-10 flex w-full items-center justify-between px-2 pt-4'>
				<Link href={'/'} className='rounded-full bg-black/10 px-4 py-2 backdrop-blur-md'>
					<Image src={logo} alt='logo' priority width={100} />
				</Link>

				{isMobile ? <NavMobile /> : <NavDesktop />}
			</header>
		</>
	);
}

const NavMobile = () => {
	const [open, setOpen] = useState(false);
	const close = () => setOpen(false);

	return (
		<Drawer direction='right' handle={false} open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Menu />
			</DrawerTrigger>

			<DrawerContent className='p-10'>
				<DrawerHeader className='sr-only'>
					<DrawerTitle>Menu</DrawerTitle>
					<DrawerDescription>Menu de navegação</DrawerDescription>
				</DrawerHeader>

				<nav>
					<ul className='flex flex-col gap-4'>
						<li>
							<Link href='/' onClick={close}>
								Início
							</Link>
						</li>

						<li>
							<Accordion type='single'>
								<Accordion.Item value='componentes'>
									<Accordion.Trigger>
										Componentes
										<Accordion.Chevron />
									</Accordion.Trigger>

									<Accordion.Content>
										<ul className='flex flex-col gap-3 pt-3 pl-4'>
											<li>
												<Link href='/components' onClick={close} className='font-medium'>
													Todos
												</Link>
											</li>

											{componentsNavItems.map((item) => (
												<li key={item.href}>
													<Link href={item.href} onClick={close}>
														{item.label}
													</Link>
												</li>
											))}
										</ul>
									</Accordion.Content>
								</Accordion.Item>
							</Accordion>
						</li>

						{/* <li>
							<Link href='/contact'>Contato</Link>
						</li> */}
						<li>
							<Link href='https://github.com/gabrielzv11/artiux' target='_blank' onClick={close}>
								<RainbowButton>Github</RainbowButton>
							</Link>
						</li>
					</ul>
				</nav>
			</DrawerContent>
		</Drawer>
	);
};

const NavDesktop = () => {
	return (
		<nav>
			<ul className='flex items-center gap-4 rounded-full bg-black/10 p-4 backdrop-blur-md'>
				<li>
					<Link href='/'>Início</Link>
				</li>
				<li>
					<Link href='/components'>Componentes</Link>
				</li>
				{/* <li>
					<Link href='/contact'>Contato</Link>
				</li> */}
				<li>
					<Link href='https://github.com/gabrielzv11/artiux' target='_blank'>
						<RainbowButton>Github</RainbowButton>
					</Link>
				</li>
			</ul>
		</nav>
	);
};
