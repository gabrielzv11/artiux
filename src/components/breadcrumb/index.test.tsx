import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Breadcrumb } from '.';

const pathname = vi.hoisted(() => ({ value: '/' }));

vi.mock('next/navigation', () => ({ usePathname: () => pathname.value }));
vi.mock('@/artiux/components/icons', () => ({ Icon: () => <svg data-testid='separator' /> }));
vi.mock('@/components/link', () => ({
	Link: ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href}>{children}</a>,
}));

function renderAt(path: string) {
	pathname.value = path;
	return render(<Breadcrumb />);
}

afterEach(cleanup);

describe('Breadcrumb', () => {
	it.each(['/', '/components'])('não renderiza com menos de 2 segmentos (%s)', (path) => {
		const { container } = renderAt(path);
		expect(container.innerHTML).toBe('');
	});

	it('renderiza links para os segmentos anteriores e texto no último', () => {
		renderAt('/components/text-animations/splitText');

		const links = screen.getAllByRole('link');
		expect(links.map((a) => [a.textContent, a.getAttribute('href')])).toEqual([
			['Components', '/components'],
			['Text Animations', '/components/text-animations'],
		]);

		const last = screen.getByText('Split Text');
		expect(last.tagName).toBe('SPAN');
		expect(screen.getAllByTestId('separator')).toHaveLength(2);
	});
});
