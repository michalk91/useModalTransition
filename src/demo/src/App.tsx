import { Routes, Route, Link } from "react-router-dom";
import Gallery from "./examples/Gallery";
import ContactBtn from "./examples/ContactBtn";
import Squares from "./examples/Squares";
import { CSSProperties } from "react";

function App() {
  const liStyle: CSSProperties = {
    fontSize: "20px",
    textAlign: "center",
    listStyleType: "none",
    padding: "0 20px",
  };

  const LinkStyle: CSSProperties = {
    textDecoration: "none",
  };

  const textCenter: CSSProperties = {
    textAlign: "center",
  };

  const navStyle: CSSProperties = {
    backgroundColor: "lightgray",
    padding: "10px",
  };

  const ulStyle: CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
  };

  return (
    <>
      <div>
        <h1 style={textCenter}>useModalTransition</h1>

        <p style={textCenter}>
          The examples below illustrate some of the features of the Modal
          Transition React hook
        </p>
        <nav style={navStyle}>
          <ul style={ulStyle}>
            <li style={liStyle}>
              <Link style={LinkStyle} to="/squares">
                Squares
              </Link>
            </li>
            <li style={liStyle}>
              <Link style={LinkStyle} to="/gallery">
                Gallery
              </Link>
            </li>
            <li style={liStyle}>
              <Link style={LinkStyle} to="/contactbtn">
                Contact Button
              </Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/squares" element={<Squares />}></Route>
          <Route path="/gallery" element={<Gallery />}></Route>
          <Route path="/contactbtn" element={<ContactBtn />}></Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
