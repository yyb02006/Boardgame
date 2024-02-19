type MenuLabel = 'BorderGame' | 'CardFlipper' | 'Othello';

type MenuPath = '/border-game' | '/card-flipper' | '/othello';

interface MenuInfo {
	name: MenuLabel;
	path: MenuPath;
}

/** Styled Components Types */

interface MenuStyleProps {
	$index: number;
}

/** React Components Types */

interface MenuProps {
	label: MenuLabel;
	path: MenuPath;
	index: number;
}
