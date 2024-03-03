import { fadeInZ } from '#styles/animations';
import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const Layout = styled.section`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
`;

const MenuContainer = styled.div`
  width: 400px;
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 32px;
  perspective: 1000px;
`;

const MenuStyle = styled.div<MenuStyleProps>`
  width: 100%;
  height: 60px;
  font-weight: 800;
  font-size: 1.5rem;
  border-radius: 12px;
  background-color: #e9a71a;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  ${(props) => {
    return fadeInZ({
      name: `card`,
      distance: 200,
      duration: 300,
      seqDirection: 'reverse',
      delay: props.$index * 100,
    });
  }}
  &:hover {
    background-color: #4444dd;
  }
`;

const Menu = ({ label, path, index }: MenuProps) => {
  return (
    <NavLink to={path}>
      <MenuStyle $index={index}>{label}</MenuStyle>
    </NavLink>
  );
};

const Home = () => {
  const MenuInfos: MenuInfo[] = [
    { name: 'BorderGame', path: '/border-game' },
    { name: 'CardFlipper', path: '/card-flipper' },
    { name: 'Othello', path: '/othello' },
  ];
  return (
    <Layout>
      <MenuContainer>
        {MenuInfos.map((info, id) => (
          <Menu key={id} index={id} label={info.name} path={info.path} />
        ))}
      </MenuContainer>
    </Layout>
  );
};

export default Home;
