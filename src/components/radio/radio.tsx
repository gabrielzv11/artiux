import { Icon } from '@iconify/react';
import { Play } from 'lucide-react';

interface RadioProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function Radio({ ...props }: RadioProps) {
	return (
		<>
			<div className='absolute top-4 left-1/2 flex w-max -translate-x-1/2 items-center gap-4 rounded-lg border-2 border-orange-700/50 bg-[#ddb892] p-2'>
				<div className='relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-md border border-orange-700/50 bg-yellow-800/15 p-2'>
					<Icon icon='streamline:music-equalizer' className='w-10' />
				</div>
				{/* <div className='text-center'>
					<p className='text-sm font-light'>Michael Jackson</p>
					<p className='font-bold'>Beat it</p>
				</div> */}
				<div className='rounded-md border border-orange-700/50 bg-yellow-800/15 p-2'>
					<Play />
				</div>
			</div>

			{/* <div className='absolute left-1/2 top-4 flex w-max -translate-x-1/2 items-center gap-4 rounded-md bg-white p-2 shadow-lg'>
				<div className='relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-orange-700/50 bg-yellow-800/15 p-2'>
					<Icon icon='streamline:music-equalizer' className='w-10' />
				</div>
				<div className='text-center'>
					<p className='text-sm font-light'>Michael Jackson</p>
					<p className='font-bold'>Beat it</p>
				</div>
				<div className='rounded-full border border-orange-700/50 bg-yellow-800/15 p-2'>
					<Play />
				</div>
			</div> */}
		</>
	);
}
