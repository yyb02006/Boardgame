import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { getOppositeElement } from '#libs/utils';
import { HomeProvider, useHomeContext } from '#routes/HomeContext';
import theme from '#styles/theme';
import BoxCollection from '#components/BoxCollction';
import { slideIn } from '#styles/animations';

const { colors } = theme;

/* this 사용 배제 */
const resultTransition = {
	spinAndZoom: ({
		name,
		seqDirection,
		aniDirection,
	}: {
		name: string;
		seqDirection: 'reverse' | 'normal';
		aniDirection: HorizontalPos | VerticalPos;
	}) => {
		const props: SlideInProps = {
			name,
			seqDirection,
			distance: aniDirection === 'left' || aniDirection === 'up' ? -100 : 100,
			direction: aniDirection === 'left' || aniDirection === 'right' ? 'horizontal' : 'vertical',
			duration: 0.5,
		};
		return slideIn(props);
	},
	slideInFromSide: function slideInFromSide({
		seqDirection,
		aniDirection,
		winner,
	}: {
		seqDirection: 'reverse' | 'normal';
		aniDirection: HorizontalPos | VerticalPos;
		winner: PlayerElement;
	}) {
		const directionToIndex = (aniDirection: HorizontalPos | VerticalPos) => {
			switch (aniDirection) {
				case 'left':
					return 0;
				case 'up':
					return 1;
				case 'down':
					return 2;
				case 'right':
					return 3;
				default:
					return 0;
			}
		};
		const index = directionToIndex(aniDirection);
		const props: SlideInProps = {
			name: winner,
			seqDirection,
			distance: winner === 'player1' ? -200 : 200,
			direction: 'horizontal',
			duration: 0.5,
		};
		return css`
			${slideIn(props)};
			animation-delay: ${index * 0.12}s;
		`;
	},
};

const Layout = styled.section`
	background-color: var(--bgColor-dark);
	color: #eaeaea;
	height: 100vh;
	width: 100%;
	font-size: 5rem;
	font-weight: 800;
	position: relative;
	padding: 80px 120px 40px 120px;
	@media screen and (max-width: 1024px) {
		display: flex;
		flex-direction: column;
		padding: 80px 0 40px 0;
	}
`;

const Player = styled.div<PlayerProps>`
	color: ${(props) => colors[props.$currentPlayer].noneActiveBox};
`;

const TitleContainerLayout = styled.div`
	display: flex;
	justify-content: space-between;
	margin-bottom: 24px;
	& .GameIndicator {
		display: flex;
	}
	& .Yellow {
		color: ${colors.common.emphaticYellow};
	}
	@media screen and (max-width: 1024px) {
		font-size: 2rem;
		margin: 0 24px 16px 24px;
	}
`;

const BoardLayout = styled.div`
	position: relative;
	display: flex;
	justify-content: space-between;
	height: auto;
	@media screen and (max-width: 1024px) {
		flex-direction: column;
		align-items: center;
		width: 100%;
		height: 100%;
	}
`;

const PlayerCardStyle = styled.div<PlayerCardStyleProps>`
	max-width: 400px;
	width: 100%;
	background-color: ${(props) =>
		props.$player === 'player1' ? colors.player1.noneActiveBox : colors.player2.noneActiveBox};
	margin: ${(props) => (props.$player === 'player1' ? '0 40px 0 0' : '0 0 0 40px')};
	font-size: 4vw;
	position: relative;
	padding: 12px 24px;
	text-align: ${(props) => (props.$player === 'player1' ? 'left' : 'right')};
	& .FakeLetter {
		user-select: none;
		color: transparent;
	}
	h3 {
		font-size: ${`clamp(1rem,2vw,2rem)`};
		font-weight: 600;
		margin: 0;
	}
	> .Wrapper {
		position: absolute;
		top: 0;
		left: 0;
		padding: 12px 24px;
		height: 100%;
		width: 100%;
		overflow: hidden;
		> div {
			width: 100%;
		}
	}
	& .SlideIn {
		${(props) =>
			slideIn({
				name: 'playerCard',
				seqDirection: 'normal',
				distance: props.$player === 'player1' ? -200 : 200,
				direction: 'horizontal',
				duration: 0.5,
			})}
	}
	& .SlideOut {
		${(props) =>
			slideIn({
				name: 'playerCard',
				seqDirection: 'reverse',
				distance: props.$player === 'player1' ? 200 : -200,
				direction: 'horizontal',
				duration: 0.5,
			})}
	}
	@media screen and (max-width: 1024px) {
		margin: ${(props) => (props.$player === 'player1' ? '0 0 20px 0' : '20px 0 0 0 ')};
		max-width: 100%;
		overflow: visible;
		h3 {
			font-size: 4vw;
		}
		> .Wrapper {
			> div {
				display: flex;
				justify-content: space-between;
			}
		}
	}
`;

const BoardItemsWrapper = styled.div`
	height: 100%;
	max-height: 100vw;
	aspect-ratio: 1;
	display: flex;
	justify-content: center;
	align-items: center;
	@media screen and (max-width: 1024px) {
		padding: 24px 0;
	}
`;

const BoardItemsContainer = styled.div<BoardItemsContainerProps>`
	position: relative;
	grid-template-columns: repeat(5, 1fr);
	background-color: ${(props) => colors[props.$currentPlayer].noneActiveBox};
	display: grid;
	width: 35vw;
	height: 35vw;
	aspect-ratio: 1;
	@media screen and (max-width: 1024px) {
		height: 100%;
		width: auto;
	}
`;

const Boxes = styled.div<BoxesProps>`
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: ${(props) => {
		if (props.$isSurrounded && props.$owner) {
			return colors[props.$owner].activeBox;
		} else {
			return 'transparent';
		}
	}};
	font-size: 3vw;
`;

const BoardBordersContainer = styled.div<BoardBordersContainerProps>`
	position: absolute;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: ${(props) => props.$borderDirection};
	justify-content: space-between;
`;

const BoxStyle = styled.div<DirectionInterface>`
	position: relative;
	width: ${(props) => (props.direction === 'horizontal' ? '100%' : '20%')};
	height: ${(props) => (props.direction === 'horizontal' ? '20%' : '100%')};
	flex-direction: ${(props) => (props.direction === 'horizontal' ? 'row' : 'column')};
	display: flex;
	flex-wrap: wrap;
`;

const PartialCover = styled.div<PartialCoverProps>`
	width: 50%;
	height: 50%;
	position: absolute;
	opacity: 1;
	background-color: ${(props) =>
		props.$winner
			? colors[props.$winner].noneActiveBox
			: ['left', 'down'].includes(props.$aniDirection)
			? colors.player1.noneActiveBox
			: colors.player2.noneActiveBox};
	${(props) =>
		props.$aniDirection === 'left' || props.$aniDirection === 'down'
			? css`
					left: 0;
			  `
			: css`
					right: 0;
			  `};
	${(props) =>
		props.$aniDirection === 'left' || props.$aniDirection === 'up'
			? css`
					top: 0;
			  `
			: css`
					bottom: 0;
			  `};
	&.Win {
		${(props) =>
			props.$winner &&
			resultTransition.slideInFromSide({
				seqDirection: 'normal',
				aniDirection: props.$aniDirection,
				winner: props.$winner,
			})};
	}
	&.Draw {
		${(props) =>
			resultTransition.spinAndZoom({
				name: 'draw',
				seqDirection: 'normal',
				aniDirection: props.$aniDirection,
			})};
	}
	&.Start {
		${(props) =>
			resultTransition.spinAndZoom({
				name: 'start',
				seqDirection: 'reverse',
				aniDirection: props.$aniDirection,
			})};
	}
	@media screen and (max-width: 1024px) {
		background-color: ${(props) =>
			props.$winner
				? colors[props.$winner].noneActiveBox
				: ['left', 'up'].includes(props.$aniDirection)
				? colors.player1.noneActiveBox
				: colors.player2.noneActiveBox};
	}
`;

const LetterOnBoard = styled.div`
	width: 100%;
	height: 100%;
	position: relative;
	font-size: ${'clamp(4rem,6vw,8rem)'};
	padding-bottom: 40px;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const StartButton = styled.button`
	position: relative;
`;

const BoardCoverLayout = styled.div<{ $winner: PlayerElement | undefined }>`
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0;
	left: 0;
	z-index: 4;
	overflow: hidden;
	color: ${(props) => (props.$winner ? colors.common.emphaticYellow : '#eaeaea')};
	> ${LetterOnBoard} {
		&.SlideDown {
			${slideIn({
				name: 'player',
				seqDirection: 'normal',
				distance: -200,
				direction: 'vertical',
				duration: 0.5,
			})};
		}
		&.SlideUp {
			${slideIn({
				name: 'player',
				seqDirection: 'reverse',
				distance: -200,
				direction: 'vertical',
				duration: 0.5,
			})};
		}
	}
`;

const BorderBox = ({ direction }: BorderBoxProps) => {
	return (
		<>
			{Array.from({ length: 5 }, (_, borderId) => (
				<BoxStyle key={borderId} direction={direction}>
					<BoxCollection direction={direction} borderId={borderId} />
					{borderId === 4 ? (
						<BoxCollection direction={direction} isLast={borderId === 4} borderId={borderId + 1} />
					) : null}
				</BoxStyle>
			))}
		</>
	);
};

const PlayerCard = ({ player }: { player: PlayerElement }) => {
	const {
		players,
		boxes,
		gameState: { isPlayerWin, playState },
		lazyPlayState,
	} = useHomeContext();
	const getConditions = (
		playState: PlayState,
		lazyPlayState: PlayState,
		state: 'winRender' | 'notWinRender' | 'winExit' | 'notWinExit'
	) => {
		switch (state) {
			case 'winRender':
				return playState === 'win' || lazyPlayState === 'win';
			case 'notWinRender':
				return playState !== 'win' || lazyPlayState !== 'win';
			case 'winExit':
				return playState !== 'win' && lazyPlayState === 'win';
			case 'notWinExit':
				return playState === 'win' && lazyPlayState !== 'win';
			default:
				break;
		}
	};
	return (
		<PlayerCardStyle $player={player} $playState={playState}>
			<span className="FakeLetter">player2</span>
			{getConditions(playState, lazyPlayState, 'winRender') ? (
				<div className="Wrapper">
					<div
						className={getConditions(playState, lazyPlayState, 'winExit') ? 'SlideOut' : 'SlideIn'}
					>
						{isPlayerWin[player] ? 'Win!' : 'Lose...'}
					</div>
				</div>
			) : null}
			{getConditions(playState, lazyPlayState, 'notWinRender') ? (
				<div className="Wrapper">
					<div
						className={
							getConditions(playState, lazyPlayState, 'notWinExit') ? 'SlideOut' : 'SlideIn'
						}
					>
						{players[player].name}
						<h3>ownable : {players[player].ownableBoxCount}</h3>
						<h3>
							score : {boxes.filter((box) => box.isSurrounded && box.owner === player).length}
						</h3>
					</div>
				</div>
			) : null}
		</PlayerCardStyle>
	);
};

const TitleContainer = () => {
	const {
		currentPlayer,
		seconds,
		gameState: { isPlayerWin, playState },
	} = useHomeContext();
	const winner = (Object.entries(isPlayerWin) as Array<[PlayerElement, boolean]>).find(
		(entry) => entry[1]
	)?.[0];
	const player = playState === 'win' && winner ? winner : currentPlayer;
	switch (playState) {
		case 'draw':
			return <span className="Yellow">Draw</span>;
		case 'ready':
			return <span className="Yellow">Ready</span>;
		case 'playing':
		case 'win':
			return (
				<>
					<div className="GameIndicator">
						<Player $currentPlayer={player}>{player}</Player>
						{playState === 'win' ? <span>&nbsp;</span> : <span>{`'s`}&nbsp;</span>}
						<div className="Yellow">{playState === 'win' ? `win` : `turn`}</div>
					</div>
					{playState === 'playing' && <div className="Yellow">{seconds}</div>}
				</>
			);
		default:
			return null;
	}
};

const BoardCover = ({ playState, isPlayerWin }: BoardCoverProps) => {
	const { setGameState, initializeIngame } = useHomeContext();
	const [seqState, setSeqState] = useState<'Start' | ''>('');
	const letterAnimation = seqState === 'Start' ? 'SlideUp' : 'SlideDown';
	const winner = (Object.entries(isPlayerWin) as Array<[PlayerElement, boolean]>).find(
		(entry) => entry[1]
	)?.[0];
	const partialCovers = ({
		partialCoverClass,
		winner,
	}: {
		partialCoverClass: PartialCoverClass;
		winner: PlayerElement | undefined;
	}) => {
		const aniDrections: Array<HorizontalPos | VerticalPos> = ['left', 'right', 'up', 'down'];
		return aniDrections.map((direction, id) => (
			<PartialCover
				key={id}
				className={partialCoverClass}
				$aniDirection={direction}
				$winner={winner}
			/>
		));
	};
	const createContent = ({
		element,
		winner,
		partialCoverClass,
		letterAnimation,
	}: {
		element: JSX.Element;
		partialCoverClass: PartialCoverClass;
		winner: PlayerElement | undefined;
		letterAnimation: 'SlideUp' | 'SlideDown';
	}) => (
		<BoardCoverLayout $winner={winner}>
			{partialCovers({ winner, partialCoverClass })}
			<LetterOnBoard className={letterAnimation}>{element}</LetterOnBoard>
		</BoardCoverLayout>
	);
	const onStartClick = (playState: Exclude<PlayState, 'playing'>) => {
		setSeqState('Start');
		setGameState((p) => ({ ...p, playState: 'playing' }));
		if (playState !== 'ready') {
			initializeIngame();
		}
	};
	const createStartButton = (label: string) => (
		<StartButton
			onClick={() => {
				onStartClick(playState);
			}}
		>
			{label}
		</StartButton>
	);
	switch (playState) {
		case 'draw': {
			return createContent({
				element: createStartButton('Draw'),
				partialCoverClass: seqState === 'Start' ? seqState : 'Draw',
				winner,
				letterAnimation,
			});
		}
		case 'win':
			return createContent({
				element: (
					<div>
						{createStartButton('Winner')}
						<div>{winner}</div>
					</div>
				),
				partialCoverClass: seqState === 'Start' ? seqState : 'Win',
				winner,
				letterAnimation,
			});
		case 'ready':
			return createContent({
				element: createStartButton('Start'),
				partialCoverClass: seqState,
				winner,
				letterAnimation,
			});
		default:
			return null;
	}
};

const Board = () => {
	const {
		boxes,
		currentPlayer,
		setCurrentPlayer,
		gameState: { isPlayerWin, playState },
		seconds,
		setSeconds,
		lazyPlayState,
		setLazyPlayState,
	} = useHomeContext();
	useEffect(() => {
		const interval =
			playState === 'playing' &&
			setInterval(() => {
				playState === 'playing' && setSeconds((p) => p - 1);
			}, 1000);
		const timeout = setTimeout(() => {
			setLazyPlayState(playState);
		}, 600);
		return () => {
			interval && clearInterval(interval);
			timeout && clearTimeout(timeout);
		};
	}, [playState]);
	useEffect(() => {
		if (seconds <= 0) {
			setSeconds(30);
			setCurrentPlayer((p) => getOppositeElement(p));
		}
	}, [seconds]);
	return (
		<>
			<TitleContainerLayout>
				<TitleContainer />
			</TitleContainerLayout>
			<BoardLayout>
				<PlayerCard player="player1" />
				<BoardItemsWrapper>
					<BoardItemsContainer $currentPlayer={currentPlayer}>
						{boxes.map((box, id) => (
							<Boxes
								key={box.id}
								$isSurrounded={box.isSurrounded}
								$currentPlayer={currentPlayer}
								$owner={box.owner}
							>
								{box.id}
							</Boxes>
						))}
						{/* playState와 lazyPlayState가 'playing'인 시간의 합집합 */}
						{(playState === 'playing' || lazyPlayState === 'playing') && (
							<BoardBordersContainer $borderDirection="column">
								<BoardBordersContainer $borderDirection="row">
									<BorderBox direction="vertical" />
								</BoardBordersContainer>
								<BorderBox direction="horizontal" />
							</BoardBordersContainer>
						)}
						{/* playState와 lazyPlayState가 'playing'인 시간의 교집합의 여집합 */}
						{(playState !== 'playing' || lazyPlayState !== 'playing') && (
							<BoardCover
								playState={
									/* 여집합 구간의 0.6초간은 lazyPlayState가 여전히 'playing'이기 때문에 이 시간동안만 playState를 대신 써줌 */
									lazyPlayState === 'playing'
										? (playState as Exclude<PlayState, 'playing'>)
										: (lazyPlayState as Exclude<PlayState, 'playing'>)
								}
								isPlayerWin={isPlayerWin}
							/>
						)}
					</BoardItemsContainer>
				</BoardItemsWrapper>
				<PlayerCard player="player2" />
			</BoardLayout>
		</>
	);
};

const Home = () => {
	return (
		<HomeProvider>
			<Layout>
				<Board />
			</Layout>
		</HomeProvider>
	);
};

export default Home;
