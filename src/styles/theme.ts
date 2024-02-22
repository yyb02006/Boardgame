import { css } from 'styled-components';

export const BorderGameColors = {
	player1: {
		noneActiveBorder: '#face6f',
		activeBorder: '#f07400',
		noneActiveBox: '#e9a71a',
		activeBox: '#face6f',
		emphaticColor: '#face6f',
		ownableBorder: '#e6740a',
	},
	player2: {
		noneActiveBorder: '#9898f8',
		activeBorder: '#00a2ff',
		noneActiveBox: '#4444dd',
		activeBox: '#9898f8',
		emphaticColor: '#a1ff09',
		ownableBorder: '#5cdeff',
	},
	common: {
		noneActiveBorder: '#808080',
		activeBorder: '#f07400',
		emphaticYellow: '#ffe030',
	},
};

export const fullWidthHeight = css`
	width: 100%;
	height: 100%;
`;

const theme = { BorderGameColors, fullWidthHeight };

export default theme;
