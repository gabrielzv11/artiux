export interface PropRow {
	property: string;
	type: string;
	default?: string;
	description: string;
}

export function PropsTable({ rows }: { rows: PropRow[] }) {
	return (
		<>
			<h3 className='text-2xl font-bold'>Props:</h3>
			<div className='border-border mt-4 overflow-auto rounded-xl border'>
				<table className='w-full text-left text-sm'>
					<thead>
						<tr className='border-border text-muted-foreground border-b text-xs tracking-wide uppercase'>
							<th className='px-4 py-3 font-medium'>Property</th>
							<th className='px-4 py-3 font-medium'>Type</th>
							<th className='px-4 py-3 font-medium'>Default</th>
							<th className='px-4 py-3 font-medium'>Description</th>
						</tr>
					</thead>
					<tbody>
						{rows.map((row) => (
							<tr key={row.property} className='border-border/60 border-b last:border-0'>
								<td className='px-4 py-3'>
									<code className='bg-input rounded px-1.5 py-0.5 text-xs'>{row.property}</code>
								</td>
								<td className='text-muted-foreground px-4 py-3 font-mono text-xs'>{row.type}</td>
								<td className='px-4 py-3'>
									<code className='bg-input rounded px-1.5 py-0.5 text-xs'>{row.default ?? '-'}</code>
								</td>
								<td className='text-muted-foreground px-4 py-3'>{row.description}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</>
	);
}
