'use client';

import { Cell, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface PieChartProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function PieChart({ ...props }: PieChartProps) {
	const dataPie = [
		{ name: 'A', value: 300 },
		{ name: 'B', value: 200 },
		{ name: 'C', value: 100 },
	];

	const pastelColors = ['#A8DADC', '#F4A261', '#E9C46A', '#E76F51', '#2A9D8F'];

	return (
		<>
			{/* Pie Chart */}
			<div className='shadow-retro w-min min-w-64 rounded-md border-2 border-black bg-[#edf6f9] p-4'>
				<h2 className='mb-2 font-mono text-sm text-gray-800'>Gráfico de Pizza</h2>
				<div className='drop-shadow-[1px_1px_0_#333] filter'>
					<ResponsiveContainer width='100%' height={220}>
						<RechartsPieChart>
							<Pie data={dataPie} dataKey='value' outerRadius={70} innerRadius={30} stroke='#000' strokeWidth={2} label>
								{dataPie.map((entry, index) => (
									<Cell key={`cell-${index}`} fill={pastelColors[index % pastelColors.length]} stroke='#000' strokeWidth={2} />
								))}
							</Pie>
							<Tooltip
								wrapperStyle={{ border: '1px solid #000', borderRadius: 0 }}
								contentStyle={{
									backgroundColor: '#edf6f9',
									fontSize: 12,
									border: '2px solid #000',
									borderRadius: 0,
								}}
							/>
						</RechartsPieChart>
					</ResponsiveContainer>
				</div>
			</div>
		</>
	);
}
