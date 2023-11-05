import { createGlobalStyle, css } from 'styled-components';

const GlobalStyle = createGlobalStyle`${css`
	body {
		font-weight: 400;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		margin: 0 auto;
		padding: 0;
		color: #eaeaea;
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
`}
`;

export default GlobalStyle;
