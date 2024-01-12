import { css } from 'styled-components';

export const colors = {
	player1: {
		noneActiveBorder: '#1696eb',
		noneActiveBox: '#1a4de6',
		activeBox: '#1696eb',
		emphaticColor: '#00ffdd',
	},
	player2: {
		noneActiveBorder: '#73dd85',
		noneActiveBox: '#1bc237',
		activeBox: '#73dd85',
		emphaticColor: '#a1ff09',
	},
	common: {
		noneActiveBorder: '#808080',
		activeBorder: '#f07400',
		emphaticYellow: '#ffe030',
		ownableBorder: '#bda93c',
	},
};

export const fullWidthHeight = css`
	width: 100%;
	height: 100%;
`;

const theme = { colors, fullWidthHeight };

export default theme;
