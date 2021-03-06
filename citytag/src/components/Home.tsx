import ny from "../assets/images/ny/ny.jpg";
import rio from "../assets/images/rio/rio.jpg";
import tokyo from "../assets/images/tokyo/tokyo.jpg";
import paris from "../assets/images/paris/paris.jpg";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { HomeProps } from "../Interfaces";

export function Home(props: HomeProps) {
  const { setIsActive } = props;
  return (
    <>
      <HomeContainer>
        <HomeText>Choose a city</HomeText>
        <HomeContent>
          <Link to="/city-tag/newyork" onClick={() => setIsActive(true)}>
            <HomeNy />
          </Link>
          <Link to="/city-tag/rio" onClick={() => setIsActive(true)}>
            <HomeRio />
          </Link>
          <Link to="/city-tag/tokyo" onClick={() => setIsActive(true)}>
            <HomeTokyo />
          </Link>
          <Link to="/city-tag/paris" onClick={() => setIsActive(true)}>
            <HomeParis />
          </Link>
        </HomeContent>
      </HomeContainer>
    </>
  );
}

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  padding: 1rem 4rem;
  @media screen and (max-width: 670px) {
    padding-left: 2rem;
    padding-right: 2rem;
  }
`;

const HomeText = styled.h2`
  font-size: 2rem;
  color: #fff;
  text-align: center;
  padding-bottom: 1rem;
  @media screen and (max-width: 670px) {
    font-size: 1rem;
  }
`;

const HomeContent = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media screen and (max-width: 670px) {
    grid-template-columns: 1fr;
  }
`;

const HomeImageContainer = styled.div`
  background-repeat: no-repeat;
  background-size: cover;
  min-height: 300px;
`;

const HomeNy = styled(HomeImageContainer)`
  background-image: url(${ny});
`;
const HomeRio = styled(HomeImageContainer)`
  background-image: url(${rio});
`;
const HomeTokyo = styled(HomeImageContainer)`
  background-image: url(${tokyo});
`;
const HomeParis = styled(HomeImageContainer)`
  background-image: url(${paris});
`;
