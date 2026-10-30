// Label component extends from shadcnui - https://ui.shadcn.com/docs/components/label

'use client';
import * as LabelPrimitive from '@radix-ui/react-label';
import * as React from 'react';

import { cn } from '@/lib/utils';

const Label = React.forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>>(
	({ className, ...props }, ref) => (
		<LabelPrimitive.Root
			ref={ref}
			className={cn(
				'flex items-center gap-2 text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-white',
				className
			)}
			{...props}
		/>
	)
);
Label.displayName = LabelPrimitive.Root.displayName;

export default Label;
