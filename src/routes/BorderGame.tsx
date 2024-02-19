import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { getOppositeElement } from '#libs/utils';
import { BorderGameProvider, useBorderGameContext } from '#routes/BorderGameContext';
import theme, { fullWidthHeight } from '#styles/theme';
import BoxCollection from '#components/BoxCollction';
import { alert, fadeInZ, slideIn } from '#styles/animations';

const { colors } = theme;

/* this 사용 배제 */
export const resultTransition = {
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
			duration: 500,
		};
		return slideIn(props);
	},
	slideInFromSide: ({
		seqDirection,
		aniDirection,
		winner,
	}: {
		seqDirection: 'reverse' | 'normal';
		aniDirection: HorizontalPos | VerticalPos;
		winner: PlayerElement;
	}) => {
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
			duration: 500,
		};
		return css`
			${slideIn(props)};
			animation-delay: ${index * 120}ms;
		`;
	},
};

const Layout = styled.section`
	height: 100vh;
	width: 100vw;
	font-size: 5rem;
	font-weight: 800;
	position: relative;
	perspective: 1000px;
`;

const BoardLayout = styled.div`
	height: 45vw;
	width: 100%;
	padding: 80px 120px 40px 120px;
	display: flex;
	font-size: 5rem;
	font-weight: 800;
	justify-content: space-between;
	position: relative;
	@media screen and (max-width: 1024px) {
		height: 100vh;
		flex-direction: column;
		align-items: center;
		padding: 80px 0 40px 0;
	}
`;

const PlayerCardStyle = styled.div<PlayerCardStyleProps>`
	max-width: 400px;
	width: 100%;
	background-color: ${(props) => {
		if (props.$player === props.$currentPlayer || props.$playState !== 'playing') {
			return props.$player === 'player1'
				? colors.player1.noneActiveBox
				: colors.player2.noneActiveBox;
		} else {
			return colors.common.noneActiveBorder;
		}
	}};
	margin: ${(props) => (props.$player === 'player1' ? '0 4vw 0 0' : '0 0 0 4vw')};
	font-size: 4vw;
	position: relative;
	padding: 12px 24px;
	opacity: 0;
	${(props) =>
		fadeInZ({
			name: 'playerCard',
			distance: 200,
			duration: 300,
			seqDirection: 'normal',
			delay: props.$player === 'player1' ? 100 : 300,
		})}
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
		${fullWidthHeight}
		position: absolute;
		top: 0;
		left: 0;
		overflow: hidden;
		> div {
			${fullWidthHeight}
			padding: 12px 24px;
		}
	}
	& .Timer {
		position: absolute;
		top: 0;
		left: 0;
		${fullWidthHeight};
		display: flex;
		justify-content: center;
		align-items: center;
		> h3 {
			position: relative;
			font-size: 7.5vw;
			font-weight: 700;
		}
		> .FakeLetter {
			position: absolute;
		}
	}
	& .Error {
		${(props) =>
			props.$hasError &&
			alert({
				name: `${props.$player}error`,
				duration: 50,
				alternateColor: 'red',
				startColor:
					props.$player === 'player1' ? colors.player1.noneActiveBox : colors.player2.noneActiveBox,
				targetProperty: 'backgroundColor',
			})};
	}
	& .SlideIn {
		${(props) =>
			slideIn({
				name: 'playerCard',
				seqDirection: 'normal',
				distance: props.$player === 'player1' ? -200 : 200,
				direction: 'horizontal',
				duration: 500,
			})}
	}
	& .SlideOut {
		${(props) =>
			slideIn({
				name: 'playerCard',
				seqDirection: 'reverse',
				distance: props.$player === 'player1' ? 200 : -200,
				direction: 'horizontal',
				duration: 500,
			})}
	}
	@media screen and (max-width: 1024px) {
		margin: ${(props) => (props.$player === 'player1' ? '0 0 20px 0' : '20px 0 0 0 ')};
		max-width: 100%;
		h3 {
			font-size: 4vw;
		}
		> .Wrapper {
			> div {
				display: flex;
				justify-content: space-between;
			}
		}
		& .Timer {
			position: relative;
			width: auto;
			height: auto;
			> h3 {
				position: absolute;
				top: 0;
				right: 0;
				font-size: 4vw;
			}
			> .FakeLetter {
				position: relative;
				font-size: 4vw;
			}
		}
	}
`;

const BoardItemsWrapper = styled.div`
	height: min(100vw, 100%);
	aspect-ratio: 1;
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	opacity: 0;
	${fadeInZ({ name: 'board', distance: 200, duration: 300, seqDirection: 'normal', delay: 200 })}
`;

const BoardItemsContainer = styled.div<BoardItemsContainerProps>`
	${fullWidthHeight}
	position: relative;
	grid-template-columns: repeat(5, 1fr);
	background-color: ${(props) => colors[props.$currentPlayer].noneActiveBox};
	display: grid;
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
	${fullWidthHeight}
	position: absolute;
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
	${fullWidthHeight}
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
	${fullWidthHeight}
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
				duration: 500,
			})};
		}
		&.SlideUp {
			${slideIn({
				name: 'player',
				seqDirection: 'reverse',
				distance: -200,
				direction: 'vertical',
				duration: 500,
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
		seconds,
		currentPlayer,
		setPlayers,
	} = useBorderGameContext();
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
	useEffect(() => {
		if (players[currentPlayer].hasError) {
			setTimeout(() => {
				setPlayers((p) => ({ ...p, [currentPlayer]: { ...p[currentPlayer], hasError: false } }));
			}, 200);
		}
	}, [players[currentPlayer].hasError]);
	return (
		<PlayerCardStyle
			$player={player}
			$playState={playState}
			$hasError={players[player].hasError}
			$currentPlayer={currentPlayer}
		>
			<span className="FakeLetter">player2</span>
			{getConditions(playState, lazyPlayState, 'winRender') ? (
				<div className={`Wrapper ${players[player].hasError ? 'Error' : ''}`}>
					<div
						className={getConditions(playState, lazyPlayState, 'winExit') ? 'SlideOut' : 'SlideIn'}
					>
						{isPlayerWin[player] ? 'Win!' : 'Lose...'}
					</div>
				</div>
			) : null}
			{getConditions(playState, lazyPlayState, 'notWinRender') ? (
				<div className={`Wrapper ${players[player].hasError ? 'Error' : ''}`}>
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
						<div className="Timer">
							<span className="FakeLetter">&nbsp;00</span>
							{currentPlayer === player && playState === 'playing' ? (
								<h3 className="Seconds">{seconds}</h3>
							) : null}
						</div>
					</div>
				</div>
			) : null}
		</PlayerCardStyle>
	);
};

const BoardCover = ({ playState, isPlayerWin }: BoardCoverProps) => {
	const { setGameState, initializeIngame } = useBorderGameContext();
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
	} = useBorderGameContext();
	useEffect(() => {
		const interval =
			playState === 'playing' &&
			setInterval(() => {
				playState === 'playing' && setSeconds((p) => p - 1);
			}, 1000);
		return () => {
			interval && clearInterval(interval);
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
			<BoardLayout>
				<PlayerCard player="player1" />
				<BoardItemsWrapper>
					<BoardItemsContainer $currentPlayer={currentPlayer}>
						{boxes.map((box) => (
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

const BorderGame = () => {
	return (
		<BorderGameProvider>
			<Layout>
				<Board />
			</Layout>
		</BorderGameProvider>
	);
};

export default BorderGame;
