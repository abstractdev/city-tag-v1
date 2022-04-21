import styled from "styled-components";
import { DropdownProps } from "../../Interfaces";
import { TargetBox } from "../../styles/Dropdown.styles";
import { DropdownContainer } from "../../styles/Dropdown.styles";
import { DropdownLi } from "../../styles/Dropdown.styles";

export function RioDropdown(props: DropdownProps) {
  const {
    mouseX,
    mouseY,
    imageIsClicked,
    clickHistory,
    setClickHistory,
    dancerText,
    flagText,
    soccerText,
    tambourineText,
    setDancerIsFound,
    setFlagIsFound,
    setSoccerIsFound,
    setTambourineIsFound,
  } = props;
  const adjBoxY = mouseY - 22;
  const adjBoxX = mouseX - 22;
  const adjDropdownY = mouseY + 17;
  const adjDropdownX = mouseX + 17;

  function checkIfDivAndDropdownMatch(event: any) {
    if (clickHistory.includes(`${event.target.dataset.id}Div`)) {
      switch (event.target.dataset.id) {
        case "dancer":
          setDancerIsFound(true);
          break;
        case "flag":
          setFlagIsFound(true);
          break;
        case "soccer":
          setSoccerIsFound(true);
          break;
        case "tambourine":
          setTambourineIsFound(true);
          break;
        default:
          break;
      }
      handleSetClickHistory(event);
    }
  }

  function handleSetClickHistory(event: any) {
    const filtered = clickHistory.filter(
      (e: string) => e !== `${event.target.dataset.id}Div`
    );
    setClickHistory([...filtered, `${event.target.dataset.id}Found`]);
  }

  return (
    <>
      {imageIsClicked && (
        <>
          <TargetBoxRio
            style={{
              top: `${adjBoxY.toString()}px`,
              left: `${adjBoxX.toString()}px`,
            }}
          />
          <DropdownContainerRio
            style={{
              top: `${adjDropdownY.toString()}px`,
              left: `${adjDropdownX.toString()}px`,
            }}
          >
            <ul>
              <DropdownLiRio
                data-id="dancer"
                onClick={(event) => checkIfDivAndDropdownMatch(event)}
              >
                {dancerText}
              </DropdownLiRio>
              <DropdownLiRio
                data-id="flag"
                onClick={(event) => checkIfDivAndDropdownMatch(event)}
              >
                {flagText}
              </DropdownLiRio>
              <DropdownLiRio
                data-id="soccer"
                onClick={(event) => checkIfDivAndDropdownMatch(event)}
              >
                {soccerText}
              </DropdownLiRio>
              <DropdownLiRio
                data-id="tambourine"
                onClick={(event) => checkIfDivAndDropdownMatch(event)}
              >
                {tambourineText}
              </DropdownLiRio>
            </ul>
          </DropdownContainerRio>
        </>
      )}
    </>
  );
}

//STYLED COMPONENTS//
const TargetBoxRio = styled(TargetBox)`
  border: 5px solid #00ad73;
`;

const DropdownContainerRio = styled(DropdownContainer)`
  border: 5px dotted #00ad73;
  background-color: #00ad73;
  width: 96px;
`;

const DropdownLiRio = styled(DropdownLi)`
  background-color: #00ad73;
`;