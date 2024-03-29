type CardQuantity = 'generous' | 'standard' | 'scant';

type BreakPoints = 'lg' | 'md' | 'sm';

type CardState = 'init' | 'available';

type LayoutRules = Record<CardQuantity, { amount: number } & Record<BreakPoints, [number, number]>>;

interface CardOption {
	gap: number;
	borderRadius: string;
	layoutRules: LayoutRules;
}

/** Function Props Types */

/** Styled Components Types */

interface CardStyleProps {
	$index: number;
}

interface ResultTextProps {
	$delay: number;
}

interface SetQuantityButton {
	$index: number;
	$isRun: boolean;
}

interface CardTableProps {
	$cardLayout: Record<BreakPoints, [number, number]>;
}

/** React Components Types */

interface CardProps extends Card {
	index: number;
}
