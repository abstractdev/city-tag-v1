import ny from "../../assets/images/ny/ny.jpg";
import styled from "styled-components";
import { VFlexContainer } from "../../styles/VFlexContainer.styles";
import { CityImage } from "../../styles/CityImage.styles";
import { NewYorkFind } from "./NewYorkFind";
import { CityImageContainer } from "../../styles/CityImage.styles";
import { NewYorkDropdown } from "./NewYorkDropdown";
import { useEffect, useState } from "react";
import {
  setDoc,
  getDocs,
  deleteDoc,
  doc,
  collection,
} from "firebase/firestore";
import { db } from "../../components/Firebase";
import { CityProps } from "../../Interfaces";
import { convertMsToDisplayTime } from "../../UtlityFunctions";
import { AudioFunctions } from "../../UtlityFunctions";
import { DivProps } from "../../Interfaces";
import { ErrorSpan } from "../../components/ErrorSpan";
import { UserModal } from "../../components/UserModal";
import { LeaderboardModal } from "../../components/LeaderboardModal";
import { ScoreErrorSpan } from "../../components/ScoreErrorSpan";

export function NewYork(props: CityProps) {
  const {
    mouseX,
    mouseY,
    imageIsClicked,
    clickHistory,
    broadwayIsFound,
    hotdogIsFound,
    ilovenyIsFound,
    policeIsFound,
    isActive,
    time,
    setTime,
    setIsActive,
    setBroadwayIsFound,
    setHotdogIsFound,
    setIlovenyIsFound,
    setPoliceIsFound,
    setClickHistory,
    handleMouseClickPosition,
    checkFirebaseForMatch,
    errorSpanIsVisible,
    handleErrorSpan,
    userModalIsVisible,
    setUserModalIsVisible,
    leaderboardIsVisible,
    setLeaderboardIsVisible,
    newyorkUserData,
    setNewyorkUserData,
    handleScoreErrorSpan,
    scoreErrorSpanIsVisible,
  } = props;
  const broadwayText = "Broadway Sign";
  const hotdogText = "Hot Dog Vendor";
  const ilovenyText = "I Love NY Shirt";
  const policeText = "NYPD Officer";

  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    let interval: NodeJS.Timer;
    if (isActive) {
      const docRef = doc(collection(db, "users"));
      setDoc(docRef, { id: docRef.id });
      console.log("Document written");
      setUserId(docRef.id);

      interval = setInterval(() => {
        setTime((prev) => prev + 10);
      }, 10);
    } else if (!isActive) {
      clearInterval(interval);
      const userRef = doc(db, "users", userId);
      setDoc(
        userRef,
        {
          city: "newyork",
          time: time,
          displayTime: `${convertMsToDisplayTime(time)}`,
        },
        { merge: true }
      );
    }
    return () => clearInterval(interval);
  }, [isActive]);

  useEffect(() => {
    if (broadwayIsFound && hotdogIsFound && ilovenyIsFound && policeIsFound) {
      setIsActive(false);
      setTimeout(() => {
        AudioFunctions().end.play();
      }, 600);
      setTimeout(() => {
        setUserModalIsVisible(true);
      }, 2000);
    }
  }, [
    broadwayIsFound,
    hotdogIsFound,
    ilovenyIsFound,
    policeIsFound,
    setIsActive,
  ]);

  function handleFormSubmit(event: any) {
    event.preventDefault();
    event.target.reset();
    setUserModalIsVisible(false);
    const userRef = doc(db, "users", userId);
    setDoc(
      userRef,
      { name: name === "" ? "Anonymous" : name },
      { merge: true }
    );
    setTimeout(() => {
      const getUserDataFromFirebase = (async () => {
        let temp: any[] = [];
        const querySnapshot = await getDocs(collection(db, "users"));
        querySnapshot.forEach((doc) => {
          temp.push(doc.data());
        });
        let newyorkFiltered = temp.filter((e) => e.city === "newyork");
        //validate score
        const newYorkScores = newyorkUserData.map((e) => e.time);
        const highestTime = Math.max(...newYorkScores);
        //add user score to leaderboard if there is room
        if (time < highestTime && newyorkFiltered.length <= 19) {
          setNewyorkUserData([...newyorkFiltered]);
          setLeaderboardIsVisible(true);
        }
        //if there is not enough room but the score qualifies, remove the highest time from array and firebase
        else if (time < highestTime && newyorkFiltered.length === 20) {
          const removeHighest = (async () => {
            const highestUser = newyorkFiltered.find(
              (e) => e.time === highestTime
            );
            await deleteDoc(doc(db, "users", highestUser.id));
            const removeHighestUserFromArray = (() => {
              newyorkFiltered = newyorkFiltered.filter((e) => {
                return e.time !== highestTime;
              });
            })();
            setNewyorkUserData([...newyorkFiltered]);
            setLeaderboardIsVisible(true);
          })();
          //otherwise remove user
        } else {
          await deleteDoc(doc(db, "users", userId));
          handleScoreErrorSpan();
        }
      })();
    }, 100);
  }

  function handleOnChange(event: any) {
    setName(event.target.value);
  }

  return (
    <>
      {leaderboardIsVisible && (
        <LeaderboardModal
          cityColor={"#f2c205"}
          cityFont={"newyork"}
          cityText={"New York"}
          leaderboardIsVisible={leaderboardIsVisible}
          setLeaderboardIsVisible={setLeaderboardIsVisible}
          newyorkUserData={newyorkUserData}
        />
      )}
      <UserModal
        name={name}
        userModalIsVisible={userModalIsVisible}
        setUserModalIsVisible={setUserModalIsVisible}
        handleFormSubmit={handleFormSubmit}
        handleOnChange={handleOnChange}
      />
      <VFlexContainer>
        <NewYorkFind
          broadwayText={broadwayText}
          hotdogText={hotdogText}
          ilovenyText={ilovenyText}
          policeText={policeText}
          broadwayIsFound={broadwayIsFound}
          hotdogIsFound={hotdogIsFound}
          ilovenyIsFound={ilovenyIsFound}
          policeIsFound={policeIsFound}
        />
        <CityImageContainer
          onClick={(event) => handleMouseClickPosition(event)}
          style={{ pointerEvents: !isActive ? "none" : "auto" }}
        >
          <CityImage src={ny} />
          {errorSpanIsVisible && <ErrorSpan />}
          {scoreErrorSpanIsVisible && <ScoreErrorSpan />}
          <BroadwayDiv
            broadwayIsFound={broadwayIsFound}
            data-id="broadwayDiv"
            onClick={(event) => checkFirebaseForMatch(event, "nyFindImages")}
          ></BroadwayDiv>
          <HotdogDiv
            hotdogIsFound={hotdogIsFound}
            data-id="hotdogDiv"
            onClick={(event) => checkFirebaseForMatch(event, "nyFindImages")}
          ></HotdogDiv>
          <IlovenyDiv
            ilovenyIsFound={ilovenyIsFound}
            data-id="ilovenyDiv"
            onClick={(event) => checkFirebaseForMatch(event, "nyFindImages")}
          ></IlovenyDiv>
          <PoliceDiv
            policeIsFound={policeIsFound}
            data-id="policeDiv"
            onClick={(event) => checkFirebaseForMatch(event, "nyFindImages")}
          ></PoliceDiv>
          <NewYorkDropdown
            mouseX={mouseX}
            mouseY={mouseY}
            broadwayText={broadwayText}
            hotdogText={hotdogText}
            ilovenyText={ilovenyText}
            policeText={policeText}
            imageIsClicked={imageIsClicked}
            clickHistory={clickHistory}
            setClickHistory={setClickHistory}
            setBroadwayIsFound={setBroadwayIsFound}
            setHotdogIsFound={setHotdogIsFound}
            setIlovenyIsFound={setIlovenyIsFound}
            setPoliceIsFound={setPoliceIsFound}
            handleErrorSpan={handleErrorSpan}
          />
        </CityImageContainer>
      </VFlexContainer>
    </>
  );
}

//STYLED COMPONENTS//

const BroadwayDiv = styled.div<DivProps>`
  width: 7%;
  height: 6.2%;
  position: absolute;
  left: 53.5%;
  bottom: 84.2%;
  border: ${(props) => (props.broadwayIsFound ? "5px solid #f2c205" : "none")};
  outline: ${(props) =>
    props.broadwayIsFound ? "3px solid #121212;" : "none"};
  @media screen and (max-width: 670px) {
    border: ${(props) =>
      props.broadwayIsFound ? "2px solid #f2c205" : "none"};
    outline: ${(props) =>
      props.broadwayIsFound ? "1px solid #121212;" : "none"};
  }
  border-radius: 5px;
`;

const HotdogDiv = styled.div<DivProps>`
  width: 3%;
  height: 9.3%;
  position: absolute;
  left: 15.4%;
  bottom: 32%;
  border: ${(props) => (props.hotdogIsFound ? "5px solid #f2c205" : "none")};
  outline: ${(props) => (props.hotdogIsFound ? "3px solid #121212;" : "none")};
  @media screen and (max-width: 670px) {
    border: ${(props) => (props.hotdogIsFound ? "2px solid #f2c205" : "none")};
    outline: ${(props) =>
      props.hotdogIsFound ? "1px solid #121212;" : "none"};
  }
  border-radius: 5px;
`;
const IlovenyDiv = styled.div<DivProps>`
  width: 3.1%;
  height: 8.7%;
  position: absolute;
  left: 45.9%;
  bottom: 42%;
  border: ${(props) => (props.ilovenyIsFound ? "5px solid #f2c205" : "none")};
  outline: ${(props) => (props.ilovenyIsFound ? "3px solid #121212;" : "none")};
  @media screen and (max-width: 670px) {
    border: ${(props) => (props.ilovenyIsFound ? "2px solid #f2c205" : "none")};
    outline: ${(props) =>
      props.ilovenyIsFound ? "1px solid #121212;" : "none"};
  }
  border-radius: 5px;
`;
const PoliceDiv = styled.div<DivProps>`
  width: 3%;
  height: 8%;
  position: absolute;
  left: 52%;
  bottom: 61%;
  border: ${(props) => (props.policeIsFound ? "5px solid #f2c205" : "none")};
  outline: ${(props) => (props.policeIsFound ? "3px solid #121212;" : "none")};
  @media screen and (max-width: 670px) {
    border: ${(props) => (props.policeIsFound ? "2px solid #f2c205" : "none")};
    outline: ${(props) =>
      props.policeIsFound ? "1px solid #121212;" : "none"};
  }
  border-radius: 5px;
`;
