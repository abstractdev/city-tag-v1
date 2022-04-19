import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { GlobalStyles } from "./components/GlobalStyles";
import { Header } from "./components/Header";
import { Home } from "./components/Home";
import { NewYork } from "./pages/NewYork";
import { Rio } from "./pages/Rio";
import { Tokyo } from "./pages/Tokyo";
import { Paris } from "./pages/Paris";
import { getDocs, collection } from "firebase/firestore";
import { db } from "./components/Firebase";

const theme = {
  colors: {
    header: "#121212",
    body: "#121212",
    footer: "#121212",
  },
};

function App() {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [imageIsClicked, setImageIsClicked] = useState(false);
  const [clickHistory, setClickHistory] = useState([]);

  useEffect(() => {
    if (
      clickHistory.includes(
        "broadwayFound" && "policeFound" && "ilovenyFound" && "hotdogFound"
      )
    ) {
      alert("All items have been found!");
    }
  }, [clickHistory]);

  function handleMouseClickPosition(event: React.MouseEvent) {
    const rect = event.currentTarget.getBoundingClientRect();
    setMouseX(event.nativeEvent.clientX - rect.left);
    setMouseY(event.nativeEvent.clientY - rect.top);
    setImageIsClicked(!imageIsClicked);
  }
  async function checkFirebaseForMatch(event: any, cityName: string) {
    let temp: any[] = [];
    let divId: string;
    const querySnapshot = await getDocs(collection(db, `${cityName}`));
    querySnapshot.forEach((doc) => {
      temp.push(doc.data());
    });
    temp.forEach((e: { id: string }) => {
      if (event.target.dataset.id === e.id) {
        divId = e.id;
        handleSetClickHistory(divId);
      }
    });
  }

  function handleSetClickHistory(divId: string) {
    if (clickHistory.includes(divId)) {
      return;
    }
    setClickHistory([...clickHistory, divId]);
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/leaderboard" element={} /> */}
          <Route
            path="/newyork"
            element={
              <NewYork
                mouseX={mouseX}
                mouseY={mouseY}
                imageIsClicked={imageIsClicked}
                clickHistory={clickHistory}
                setClickHistory={setClickHistory}
                handleMouseClickPosition={handleMouseClickPosition}
                checkFirebaseForMatch={checkFirebaseForMatch}
              />
            }
          />
          <Route path="/rio" element={<Rio />} />
          <Route path="/tokyo" element={<Tokyo />} />
          <Route path="/paris" element={<Paris />} />
        </Routes>
      </ThemeProvider>
    </>
  );
}

export default App;
