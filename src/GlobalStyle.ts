import { createGlobalStyle, css } from 'styled-components';

const GlobalStyle = createGlobalStyle`${css`
	*,
	*::before,
	*::after {
		box-sizing: border-box;
	}
	body {
		font-weight: 400;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		margin: 0 auto;
		padding: 0;
		color: #eaeaea;
		overflow-x: hidden;
		background-color: var(--bgColor-dark);
	}
	li {
		list-style: none;
	}
	a {
		text-decoration: none;
		outline: none;
		color: #eaeaea;
		&:active,
		&:focus {
			text-decoration: none;
			outline: none;
			color: #eaeaea;
		}
	}
	button {
		border: none;
		background-color: transparent;
		color: inherit;
		appearance: inherit;
		padding: 0;
		padding-block: 0;
		padding-inline: 0;
		cursor: default;
		font: inherit;
	}
	:root {
		--bgColor-dark: #101010;
		--bgGradient-purple-navy: linear-gradient(135deg, #6e1af5 0%, #110981 100%);
		--globalNavSize: 80px;
	}
`}
`;

export default GlobalStyle;
