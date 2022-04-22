import paris from "../../assets/images/paris/paris.jpg";
import { ParisFind } from "../../components/Find";
import { VFlexContainer } from "../../styles/VFlexContainer.styles";
import { CityImageContainer } from "../../styles/CityImage.styles";
import { CityImage } from "../../styles/CityImage.styles";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { ParisDropdown } from "./ParisDropdown";
import { setDoc, doc, collection } from "firebase/firestore";
import { db } from "../../components/Firebase";
import { CityProps } from "../../Interfaces";
import { AudioFunctions } from "../../UtlityFunctions";
import { convertMsToDisplayTime } from "../../UtlityFunctions";
import { DivProps } from "../../Interfaces";
import { ErrorSpan } from "../../components/ErrorSpan";

export function Paris(props: CityProps) {
  const {
    mouseX,
    mouseY,
    imageIsClicked,
    clickHistory,
    isActive,
    time,
    setTime,
    setIsActive,
    setClickHistory,
    handleMouseClickPosition,
    checkFirebaseForMatch,
    brieIsFound,
    fleurdelisIsFound,
    monalisaIsFound,
    tophatIsFound,
    setBrieIsFound,
    setFleurdelisIsFound,
    setMonalisaIsFound,
    setTophatIsFound,
    dropdownIsShifted,
    errorSpanIsVisible,
    handleErrorSpan,
  } = props;

  const brieText = "Brie";
  const fleurdelisText = "Fleur De Lis";
  const monalisaText = "Mona lisa";
  const tophatText = "Tophat";

  const [userId, setUserId] = useState("");

  useEffect(() => {
    let interval: NodeJS.Timer;
    if (isActive) {
      const docRef = doc(collection(db, "parisUsers"));
      setDoc(docRef, { id: docRef.id });
      console.log("Document written");
      setUserId(docRef.id);

      interval = setInterval(() => {
        setTime((prev) => prev + 10);
      }, 10);
    } else if (!isActive) {
      clearInterval(interval);
      const userRef = doc(db, "parisUsers", userId);
      setDoc(
        userRef,
        { time: time, displayTime: `${convertMsToDisplayTime(time)}` },
        { merge: true }
      );
    }
    return () => clearInterval(interval);
  }, [isActive]);

  useEffect(() => {
    if (brieIsFound && fleurdelisIsFound && monalisaIsFound && tophatIsFound) {
      setIsActive(false);
      setTimeout(() => {
        AudioFunctions().end.play();
      }, 800);
    }
  }, [
    brieIsFound,
    fleurdelisIsFound,
    monalisaIsFound,
    tophatIsFound,
    setIsActive,
  ]);
  return (
    <>
      <VFlexContainer>
        <ParisFind
          brieText={brieText}
          fleurdelisText={fleurdelisText}
          monalisaText={monalisaText}
          tophatText={tophatText}
          brieIsFound={brieIsFound}
          fleurdelisIsFound={fleurdelisIsFound}
          monalisaIsFound={monalisaIsFound}
          tophatIsFound={tophatIsFound}
        />
        <CityImageContainer
          onClick={(event) => handleMouseClickPosition(event)}
        >
          <CityImage src={paris} />
          {errorSpanIsVisible && <ErrorSpan />}
          <BrieDiv
            brieIsFound={brieIsFound}
            data-id="brieDiv"
            onClick={(event) => checkFirebaseForMatch(event, "parisFindImages")}
          ></BrieDiv>
          <FleurdelisDiv
            fleurdelisIsFound={fleurdelisIsFound}
            data-id="fleurdelisDiv"
            onClick={(event) => checkFirebaseForMatch(event, "parisFindImages")}
          ></FleurdelisDiv>
          <MonalisaDiv
            monalisaIsFound={monalisaIsFound}
            data-id="monalisaDiv"
            onClick={(event) => checkFirebaseForMatch(event, "parisFindImages")}
          ></MonalisaDiv>
          <TophatDiv
            tophatIsFound={tophatIsFound}
            data-id="tophatDiv"
            onClick={(event) => checkFirebaseForMatch(event, "parisFindImages")}
          ></TophatDiv>
          <ParisDropdown
            mouseX={mouseX}
            mouseY={mouseY}
            imageIsClicked={imageIsClicked}
            clickHistory={clickHistory}
            setClickHistory={setClickHistory}
            brieText={brieText}
            fleurdelisText={fleurdelisText}
            monalisaText={monalisaText}
            tophatText={tophatText}
            setBrieIsFound={setBrieIsFound}
            setFleurdelisIsFound={setFleurdelisIsFound}
            setMonalisaIsFound={setMonalisaIsFound}
            setTophatIsFound={setTophatIsFound}
            dropdownIsShifted={dropdownIsShifted}
            handleErrorSpan={handleErrorSpan}
          />
        </CityImageContainer>
      </VFlexContainer>
    </>
  );
}

//STYLED COMPONENTS//

const BrieDiv = styled.div<DivProps>`
  width: 2.5%;
  height: 4.3%;
  position: absolute;
  left: 53.4%;
  bottom: 60%;
  border: ${(props) => (props.brieIsFound ? "5px solid #f94910" : "none")};
  outline: ${(props) => (props.brieIsFound ? "3px solid #121212" : "none")};
  border-radius: 5px;
`;
const FleurdelisDiv = styled.div<DivProps>`
  width: 3%;
  height: 4.8%;
  position: absolute;
  left: 66.4%;
  bottom: 95.2%;
  border: ${(props) =>
    props.fleurdelisIsFound ? "5px solid #f94910" : "none"};
  outline: ${(props) =>
    props.fleurdelisIsFound ? "3px solid #121212" : "none"};
  border-radius: 5px;
`;
const MonalisaDiv = styled.div<DivProps>`
  width: 4%;
  height: 8.7%;
  position: absolute;
  left: 77.5%;
  bottom: 54.5%;
  border: ${(props) => (props.monalisaIsFound ? "5px solid #f94910" : "none")};
  outline: ${(props) => (props.monalisaIsFound ? "3px solid #121212" : "none")};
  border-radius: 5px;
`;
const TophatDiv = styled.div<DivProps>`
  width: 2.7%;
  height: 4.4%;
  position: absolute;
  left: 77.4%;
  bottom: 9.3%;
  border: ${(props) => (props.tophatIsFound ? "5px solid #f94910" : "none")};
  outline: ${(props) => (props.tophatIsFound ? "3px solid #121212" : "none")};
  border-radius: 5px;
`;
