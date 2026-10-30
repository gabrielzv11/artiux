'use client';

import { Icon } from '@/artiux/components/icons';
import { cn } from '@/lib/utils';
import { motion, useInView } from 'motion/react';
import { useMemo, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import CodeButton from './codebutton';

interface CopyCodeProps extends React.HTMLAttributes<HTMLDivElement> {
	installs?: string;
	code?: string;
	fileName?: string;
}

const previewInstalls = `yarn add @motion/react`;

const packageManagers = ['pnpm', 'npm', 'yarn', 'bun'] as const;
type PackageManager = (typeof packageManagers)[number];

function parsePackages(installs: string) {
	const match = installs.match(/^(?:pnpm|yarn|npm|bun)\s+(?:add|install)\s+(.+)$/i);
	return match ? match[1] : installs;
}

const extLanguages: Record<string, string> = {
	ts: 'typescript',
	tsx: 'tsx',
	js: 'javascript',
	jsx: 'jsx',
	json: 'json',
	css: 'css',
	html: 'markup',
	md: 'markdown',
	sh: 'bash',
};

function detectLanguage(fileName?: string) {
	const ext = fileName?.split('.').pop()?.toLowerCase();
	return (ext && extLanguages[ext]) || 'tsx';
}

function buildCommands(installs: string): Record<PackageManager, string> {
	const packages = parsePackages(installs);

	return {
		pnpm: `pnpm add ${packages}`,
		npm: `npm install ${packages}`,
		yarn: `yarn add ${packages}`,
		bun: `bun add ${packages}`,
	};
}

export default function CopyCode({ installs = previewInstalls, code, fileName, ...props }: CopyCodeProps) {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: false, margin: '-100px' });
	const [expanded, setExpanded] = useState(false);
	const [pm, setPm] = useState<PackageManager>('pnpm');

	const commands = useMemo(() => buildCommands(installs), [installs]);
	const language = useMemo(() => detectLanguage(fileName), [fileName]);

	return (
		<div className='flex w-full flex-col gap-4 font-mono text-white' {...props}>
			<div className='overflow-hidden rounded-2xl border-2 border-[#3B341F] bg-[#09090B] shadow-2xl'>
				<div className='flex items-center gap-1 border-b border-[#3B341F] px-2 pt-2'>
					{packageManagers.map((item) => (
						<button
							key={item}
							onClick={() => setPm(item)}
							className='relative px-3 py-1.5 text-xs outline-none'
							style={{ transformStyle: 'preserve-3d' }}
						>
							{pm === item && (
								<motion.div
									layoutId='pm-indicator'
									transition={{ type: 'spring', bounce: 0.3, duration: 0.6 }}
									className='absolute inset-0 rounded-t-lg bg-white/10'
								/>
							)}
							<span className={cn('relative', pm === item ? 'text-white' : 'text-muted-foreground')}>{item}</span>
						</button>
					))}
				</div>

				<div className='flex items-center justify-between gap-2 px-4 py-3'>
					<pre className='text-muted-foreground overflow-x-auto text-start text-xs break-words whitespace-pre-wrap'>{commands[pm]}</pre>
					<CodeButton code={commands[pm]} className='shrink-0' />
				</div>
			</div>

			{code && (
				<motion.div
					ref={ref}
					initial={{ opacity: 0, y: 16 }}
					animate={isInView && { opacity: 1, y: 0 }}
					transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
					className='overflow-hidden rounded-2xl border-2 border-[#3B341F] bg-[#09090B] shadow-2xl'
				>
					<div className='flex items-center justify-between gap-2 border-b border-[#3B341F] px-4 py-3'>
						<div className='text-muted-foreground flex min-w-0 items-center gap-2 text-xs'>
							<Icon icon='code' className='size-3.5 shrink-0' />
							<span className='truncate'>{fileName ?? 'código'}</span>
						</div>

						<div className='flex shrink-0 items-center gap-3'>
							<button
								onClick={() => setExpanded((prev) => !prev)}
								className='text-muted-foreground flex items-center gap-1 text-xs transition-colors outline-none hover:text-white'
							>
								{expanded ? 'Recolher' : 'Expandir'}
								<Icon icon='chevron-down' className={cn('size-3.5 transition-transform duration-300', expanded && 'rotate-180')} />
							</button>

							<CodeButton code={code} />
						</div>
					</div>

					<motion.div
						animate={{ height: expanded ? 'auto' : '14rem' }}
						transition={{ duration: 0.3, ease: 'easeInOut' }}
						className='relative overflow-hidden'
					>
						<SyntaxHighlighter
							language={language}
							style={vscDarkPlus}
							wrapLongLines
							customStyle={{
								margin: 0,
								padding: '1rem',
								background: 'transparent',
								fontSize: '0.75rem',
								lineHeight: '1.625',
							}}
						>
							{code}
						</SyntaxHighlighter>

						{!expanded && (
							<div className='pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#09090B] to-transparent' />
						)}
					</motion.div>
				</motion.div>
			)}
		</div>
	);
}
