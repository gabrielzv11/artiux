'use client';

import { cn } from '@/lib/utils';
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform, useVelocity, type MotionValue } from 'motion/react';
import * as React from 'react';

type DotPosition = { x: number; y: number };

function LiquidBlob({ x, y }: { x: MotionValue<number>; y: MotionValue<number> }) {
	const vx = useVelocity(x);
	const vy = useVelocity(y);
	const rotate = useTransform([vx, vy], ([a, b]: number[]) => (Math.atan2(b, a) * 180) / Math.PI);
	const negRotate = useTransform(rotate, (r) => -r);
	const speed = useTransform([vx, vy], ([a, b]: number[]) => Math.min(Math.hypot(a, b), 2000));
	const stretch = useTransform(speed, [0, 400], [1, 1.7]);
	const squish = useTransform(speed, [0, 400], [1, 0.35]);
	const transform = useMotionTemplate`translate(-50%, -50%) rotate(${rotate}deg) scaleX(${stretch}) scaleY(${squish}) rotate(${negRotate}deg)`;

	return (
		<motion.div className='absolute top-0 left-0' style={{ x, y }}>
			<motion.div className='bg-primary size-5 rounded-full' style={{ transform }} />
		</motion.div>
	);
}

type RadioGroupContextValue = {
	value?: string;
	setValue: (value: string) => void;
	disabled?: boolean;
	orientation: 'horizontal' | 'vertical';
	registerItem: (value: string, node: HTMLButtonElement | null) => void;
	registerAnchor: (value: string, node: HTMLElement | null) => void;
};

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(null);

function useRadioGroupContext(component: string) {
	const context = React.useContext(RadioGroupContext);
	if (!context) throw new Error(`${component} must be used within a RadioGroup`);
	return context;
}

function useRadioGroupItemRef(value: string) {
	const context = useRadioGroupContext('useRadioGroupItemRef');

	return React.useCallback(
		(node: HTMLButtonElement | null) => {
			context.registerItem(value, node);
		},
		[context, value]
	);
}

function useRadioGroupAnchorRef(value: string) {
	const context = useRadioGroupContext('useRadioGroupAnchorRef');

	return React.useCallback(
		(node: HTMLElement | null) => {
			context.registerAnchor(value, node);
		},
		[context, value]
	);
}

export type RadioGroupProps = Omit<React.ComponentProps<'div'>, 'onChange'> & {
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	orientation?: 'horizontal' | 'vertical';
	disabled?: boolean;
	name?: string;
	required?: boolean;
};

function RadioGroup({
	className,
	value,
	defaultValue,
	onValueChange,
	orientation = 'vertical',
	disabled,
	name,
	required,
	children,
	onKeyDown,
	...props
}: RadioGroupProps) {
	const [internalValue, setInternalValue] = React.useState(value ?? defaultValue);
	const currentValue = value !== undefined ? value : internalValue;

	const gooId = React.useId();
	const containerRef = React.useRef<HTMLDivElement>(null);
	const itemsRef = React.useRef(new Map<string, HTMLButtonElement>());
	const anchorsRef = React.useRef(new Map<string, HTMLElement>());
	const [dot, setDot] = React.useState<DotPosition | null>(null);

	const targetX = useMotionValue(0);
	const targetY = useMotionValue(0);
	const leadX = useSpring(targetX, { stiffness: 500, damping: 30, mass: 0.6 });
	const leadY = useSpring(targetY, { stiffness: 500, damping: 30, mass: 0.6 });
	const lagX = useSpring(targetX, { stiffness: 170, damping: 24, mass: 1 });
	const lagY = useSpring(targetY, { stiffness: 170, damping: 24, mass: 1 });

	const updateDot = React.useCallback(() => {
		const container = containerRef.current;
		const anchor = currentValue ? (anchorsRef.current.get(currentValue) ?? itemsRef.current.get(currentValue)) : null;
		if (!container || !anchor) {
			setDot(null);
			return;
		}
		const containerRect = container.getBoundingClientRect();
		const anchorRect = anchor.getBoundingClientRect();
		setDot({
			x: anchorRect.left - containerRect.left + anchorRect.width / 2,
			y: anchorRect.top - containerRect.top + anchorRect.height / 2,
		});
	}, [currentValue]);

	React.useLayoutEffect(() => {
		updateDot();
	}, [updateDot]);

	React.useEffect(() => {
		if (!dot) return;
		targetX.set(dot.x);
		targetY.set(dot.y);
	}, [dot, targetX, targetY]);

	React.useEffect(() => {
		const onResize = () => updateDot();
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	}, [updateDot]);

	const setValue = React.useCallback(
		(next: string) => {
			setInternalValue(next);
			onValueChange?.(next);
		},
		[onValueChange]
	);

	const registerItem = React.useCallback((itemValue: string, node: HTMLButtonElement | null) => {
		if (node) itemsRef.current.set(itemValue, node);
		else itemsRef.current.delete(itemValue);
	}, []);

	const registerAnchor = React.useCallback((itemValue: string, node: HTMLElement | null) => {
		if (node) anchorsRef.current.set(itemValue, node);
		else anchorsRef.current.delete(itemValue);
	}, []);

	const contextValue = React.useMemo<RadioGroupContextValue>(
		() => ({ value: currentValue, setValue, disabled, orientation, registerItem, registerAnchor }),
		[currentValue, setValue, disabled, orientation, registerItem, registerAnchor]
	);

	const handleKeyDown = React.useCallback(
		(event: React.KeyboardEvent<HTMLDivElement>) => {
			onKeyDown?.(event);
			if (event.defaultPrevented || disabled) return;

			const nextKey = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight';
			const prevKey = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft';
			if (![nextKey, prevKey].includes(event.key)) return;

			const values = Array.from(itemsRef.current.keys());
			if (values.length === 0) return;

			const currentIndex = currentValue ? values.indexOf(currentValue) : -1;
			const delta = event.key === nextKey ? 1 : -1;
			const nextIndex = (currentIndex + delta + values.length) % values.length;
			const nextValue = values[nextIndex];

			event.preventDefault();
			setValue(nextValue);
			itemsRef.current.get(nextValue)?.focus();
		},
		[currentValue, disabled, onKeyDown, orientation, setValue]
	);

	return (
		<RadioGroupContext.Provider value={contextValue}>
			<div
				ref={containerRef}
				role='radiogroup'
				aria-orientation={orientation}
				aria-disabled={disabled}
				aria-required={required}
				data-slot='radio-group'
				data-name={name}
				className={cn('relative grid gap-3', className)}
				onKeyDown={handleKeyDown}
				{...props}
			>
				{children}
				{dot && (
					<div className='pointer-events-none absolute inset-0 z-10' style={{ filter: `url(#${gooId})` }}>
						<svg width='0' height='0' className='absolute'>
							<defs>
								<filter id={gooId}>
									<feGaussianBlur in='SourceGraphic' stdDeviation='6' result='blur' />
									<feColorMatrix in='blur' mode='matrix' values='1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -7' result='goo' />
								</filter>
							</defs>
						</svg>
						<LiquidBlob x={lagX} y={lagY} />
						<LiquidBlob x={leadX} y={leadY} />
					</div>
				)}
			</div>
		</RadioGroupContext.Provider>
	);
}

export type RadioGroupItemProps = Omit<React.ComponentProps<'button'>, 'value' | 'onChange'> & {
	value: string;
};

function RadioGroupItem({ className, value, disabled, onClick, ...props }: RadioGroupItemProps) {
	const context = useRadioGroupContext('RadioGroupItem');
	const refCallback = useRadioGroupItemRef(value);
	const checked = context.value === value;
	const itemDisabled = disabled ?? context.disabled;

	return (
		<button
			ref={refCallback}
			type='button'
			role='radio'
			aria-checked={checked}
			data-state={checked ? 'checked' : 'unchecked'}
			data-slot='radio-group-item'
			disabled={itemDisabled}
			tabIndex={checked || context.value === undefined ? 0 : -1}
			onClick={(event) => {
				onClick?.(event);
				if (!event.defaultPrevented && !itemDisabled) context.setValue(value);
			}}
			className={cn(
				'border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square size-6 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow,border-color] duration-200 ease-in-out outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
				'data-[state=checked]:border-primary',
				className
			)}
			{...props}
		/>
	);
}

export { RadioGroup, RadioGroupItem, useRadioGroupAnchorRef, useRadioGroupContext, useRadioGroupItemRef };
