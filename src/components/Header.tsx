import { useAppContext } from '#AppContext';
import useToggle from '#hooks/useToggle';
import { fadeInZ } from '#styles/animations';
import { fullWidthHeight } from '#styles/theme';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const Layout = styled.section`
  height: 80px;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  padding: 0 48px 10px 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1;
  @media screen and (max-width: 1024px) {
    height: 80px;
    font-size: 2rem;
  }
  @media screen and (max-width: 640px) {
    height: 60px;
    padding: 0 48px;
    font-size: 1rem;
  }
`;

const HeaderNav = styled(NavLink)`
  font-weight: 700;
`;

const HambergerMenu = styled.div`
  width: 24px;
  height: 24px;
  position: relative;
`;

const MenuIcon = styled.div`
  ${fullWidthHeight};
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  > div {
    height: 2px;
    background-color: #eaeaea;
  }
  &:hover {
    > div {
      background-color: yellow;
    }
  }
`;

const Spread = styled.div`
  width: 200px;
  height: 240px;
  background-color: #202020;
  position: absolute;
  top: 0;
  right: 0;
  box-shadow: 0 0 24px #101010;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0;
  gap: 24px;
  font-size: 1rem;
  &.Open {
    ${fadeInZ({
      name: 'openMenu',
      distance: 200,
      duration: 300,
      seqDirection: 'reverse',
    })}
  }
  &.Closed {
    ${fadeInZ({
      name: 'closeMenu',
      distance: 200,
      duration: 300,
      seqDirection: 'normal',
    })}
  }
  & .Title {
    font-size: 1.5em;
    font-weight: 800;
    color: yellow;
    height: auto;
    flex-shrink: 0;
  }
  & .Links {
    ${fullWidthHeight}
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    font-weight: 600;
    & > a {
      &:hover {
        color: var(--color-royalBlue);
      }
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  &::before,
  &::after {
    content: '';
    position: absolute;
    display: block;
    width: 80%;
    height: 2px;
    background-color: #bababa;
    z-index: 1;
  }
  &::after {
    transform: rotate(45deg);
  }
  &::before {
    transform: rotate(-45deg);
  }
`;

interface HeaderProps {
  title: string;
}

const Rules = styled.div`
  font-weight: 300;
  cursor: pointer;
  &:hover {
    color: #e9a71a;
  }
  &.Open {
    > span {
      color: #e9a71a;
    }
  }
`;

const RuleModalLayout = styled.div`
  position: absolute;
  width: 600px;
  top: 80px;
  left: 48px;
  background-color: #202020;
  box-shadow: 0 0 24px #101010;
  border-radius: 16px;
  color: #eaeaea;
  padding: 24px 32px;
  > ul {
    list-style: none;
    margin: 0;
    padding: 0;
    font-size: 0.875rem;
    > li {
      margin-bottom: 12px;
      line-height: 1.5rem;
    }
  }
  > .Title {
    font-weight: 800;
    font-size: 2rem;
    margin-bottom: 16px;
    color: #e9a71a;
  }
  &.Open {
    ${fadeInZ({
      name: 'openMenu',
      distance: 200,
      duration: 300,
      seqDirection: 'reverse',
    })}
  }
  &.Closed {
    ${fadeInZ({
      name: 'closeMenu',
      distance: 200,
      duration: 300,
      seqDirection: 'normal',
    })}
  }
  @media screen and (max-width: 1024px) {
    left: 48px;
    width: calc(100% - 96px);
  }
`;

const LogoSectionLayout = styled.section`
  display: flex;
  gap: 48px;
`;

const LinkWrapper = ({ to, label, page }: { to: string; label: string; page: PageState }) => {
  const { setPageState } = useAppContext();
  return (
    <NavLink
      to={to}
      onClick={() => {
        setPageState(page);
      }}
    >
      {label}
    </NavLink>
  );
};

const RuleModal = ({ isModalVisible }: { isModalVisible: boolean }) => {
  const { pageState } = useAppContext();
  const rules = [
    {
      path: '/border-game',
      name: 'BorderGame',
      descriptions: [
        '상대보다 많은 땅을 소유하면 이기는 게임입니닷',
        '첫 경계를 놓은 이후에는 내가 소유한 경계에 이웃한 경계만 선택할 수 있습니닷',
        '상대방이 연결한 경계를 뚫고 경계를 소유할 수 없습니닷',
        '더 이상 승부가 변경될 가능성이 없다면 게임은 자동으로 종료됩니닷',
      ],
    },
    {
      path: '/card-flipper',
      name: 'CardFlipper',
      descriptions: [
        '모든 카드를 뒤집고 더 좋은 기록을 내는 게임입니닷',
        '두 개의 카드를 뒤집었을 때 서로 같다면 점수로 인정되고, 아니라면 카드는 다시 뒤집힙니닷',
        '카드가 모두 뒤집혔다면 게임은 종료되고, 그때까지의 시간과 시도횟수를 확인할 수 있습니닷',
      ],
    },
    {
      path: '/othello',
      name: 'Othello',
      descriptions: [
        '보드위의 돌을 더 많이 소유하면 이기는 게임입니닷',
        '돌을 놓았을 때 직선 네 방향 중 상대방의 돌을 중간에 끼고 맞은 편에 내 돌이 있다면 사이의 돌은 모두 내 소유가 됩니닷',
        '상대방의 돌을 뒤집을 수 있는 곳에만 돌을 놓을 수 있습니닷',
        '이미 놓여진 상대방의 돌을 뒤집을 수 있는 기회가 5번 주어지며 이 기회는 자기 소유의 8개의 돌이 있어야 사용할 수 있습니닷',
        '직전에 놓였거나 뒤집혔던 돌은 위 규칙으로 뒤집을 수 없습니닷',
        '더 이상 돌을 놓거나 상대방의 돌을 뒤집을 수 없다면 턴이 넘어가고, 양 플레이어 모두 그렇다면 게임이 종료됩니닷',
      ],
    },
  ];
  const location = useLocation();
  const matchedRule = rules.find((rule) => rule.path === location.pathname);
  return (
    <RuleModalLayout className={isModalVisible ? 'Open' : 'Closed'}>
      <div className="Title">{`${matchedRule?.name} Rule`}</div>
      <ul>{matchedRule?.descriptions.map((desc, id) => <li key={id}>{`${id}. ${desc}`}</li>)}</ul>
    </RuleModalLayout>
  );
};

const LogoSection = ({ title }: HeaderProps) => {
  const { pageState } = useAppContext();
  const {
    toggle: isModalOpen,
    isVisible: isModalVisible,
    toggleHandler: modalToggleHandle,
    setToggle: setIsModalOpen,
    setIsVisible: setIsModalVisible,
  } = useToggle();
  useEffect(() => {
    setIsModalOpen(false);
    setIsModalVisible(false);
  }, [pageState]);
  return (
    <LogoSectionLayout>
      <HeaderNav to={'/'}>{title}</HeaderNav>
      <Rules
        onClick={() => {
          modalToggleHandle(!isModalOpen);
        }}
        className={isModalVisible ? 'Open' : 'Closed'}
      >
        <span>Rules</span>
        {isModalOpen ? <RuleModal isModalVisible={isModalVisible} /> : null}
      </Rules>
    </LogoSectionLayout>
  );
};

const Header = ({ title }: HeaderProps) => {
  const { pageState } = useAppContext();
  const {
    toggle: isMenuOpen,
    isVisible: isMenuVisible,
    toggleHandler: menuToggleHandler,
    setToggle: setIsMenuOpen,
  } = useToggle();
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pageState]);
  return (
    <Layout>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <LogoSection title={title}></LogoSection>
      <HambergerMenu>
        {isMenuOpen ? (
          <Spread className={isMenuVisible ? 'Open' : 'Closed'}>
            <CloseButton
              onClick={() => {
                menuToggleHandler(false);
              }}
            />
            <span className="Title">Games</span>
            <div className="Links">
              <LinkWrapper to="/border-game" label="BorderGame" page="borderGame" />
              <LinkWrapper to="/card-flipper" label="CardFlipper" page="cardFlipper" />
              <LinkWrapper to="/othello" label="Othello" page="othello" />
            </div>
          </Spread>
        ) : (
          <MenuIcon
            onClick={() => {
              menuToggleHandler(true);
            }}
          >
            <div />
            <div />
            <div />
          </MenuIcon>
        )}
      </HambergerMenu>
    </Layout>
  );
};

export default Header;
