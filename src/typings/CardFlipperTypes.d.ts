type CardQuantity = 'generous' | 'standard' | 'scant';

type BreakPoints = 'lg' | 'md' | 'sm';

type LayoutRules = Record<CardQuantity, { amount: number } & Record<BreakPoints, [number, number]>>;

interface CardOption {
	gap: number;
	borderRadius: string;
	layoutRules: LayoutRules;
}

/** Function Props Types */

/** Styled Components Types */

interface SetQuantityButton {
	$index: number;
	$isRun: boolean;
}

interface GameBoardLayoutProps {
	$cardLayout: Record<BreakPoints, [number, number]>;
}

/** React Components Types */

interface CardProps extends Card {}
