import "./App.css";
import React, { useEffect, useState } from "react";
import ANIMALS from "./animals";

function App() {
  const [perPage, setPerPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  let [animals, setAnimals] = useState(ANIMALS || []);
  const [isFullScreen, setIsFullscreen] = useState(false);
  const [imgSource, setImgSource] = useState(null);

  // rerender after per page val change
  useEffect(() => {}, [perPage]);

  // TODO: keyboard controls
  const keyboardControls = (e) => {
    // TODO: implement keyboard controls
    console.log("pressed key: ", e.key, e.keyCode);
  };
  useEffect(() => {
    document.body.addEventListener("keydown", keyboardControls);

    return function cleanup() {
      window.removeEventListener("keydown", keyboardControls);
    };
  }, []);

  // exit full screen
  useEffect(() => {
    const fullscreen = document.querySelector(".fullscreen-modal");

    if (fullscreen) {
      document.exitFullscreen();
    }
  }, []);

  const handleSlider = (e) => {
    setCurrentPage(parseInt(e.target.value));
  };

  const handlePerPage = (e) => {
    let pageVal = parseInt(e.target.value);

    if (isNaN(pageVal)) pageVal = 1; // temporary fix

    setPerPage(pageVal);
    setCurrentPage(1);
    // option to set it to first page or last page or particular page
    // let point = Math.ceil(limit / pageVal);
    // setCurrentPage(point);
    // }
  };

  const handleSearch = (e) => {
    setSearchInput(e.target.value);
    setCurrentPage(1);
    // option to set it to first page or last page or particular page
    // let point = Math.ceil(limit / pageVal);
    // setCurrentPage(point);
  };

  const handleFullScreen = (e) => {
    let dialog = document.querySelectorAll('[role="dialog"]')[0];
    dialog.classList.add("fullscreen-modal");
    setIsFullscreen(true);
    setImgSource(e.target.src);
  };

  const closeFullScreen = (e) => {
    const dialog = document.querySelectorAll('[role="dialog"]')[0];
    dialog.classList.remove("fullscreen-modal");
    setIsFullscreen(false);
  };

  // filter
  let filteredAnimals = animals.filter(
    (animal) =>
      animal.label.toLowerCase().indexOf(searchInput.toLocaleLowerCase()) > -1
  );
  // update limit
  let limit = Math.ceil(filteredAnimals.length / perPage);

  // slider start, end setup
  let indexOfFirstImage = (currentPage - 1) * perPage;
  let indexOfLastImage = indexOfFirstImage + perPage;
  // single page
  let currentAnimals = filteredAnimals.slice(
    indexOfFirstImage,
    indexOfLastImage
  );

  return (
    // DO NOT CHANGE THE HTML STRUCTURE. TESTS RELY ON IT TO WORK.
    <div className="App">
      <div className="image-viewer">
        <div className="image-viewer-images">
          {currentAnimals.map((animal, idx) => (
            <figure className="image-viewer-image-with-caption" key={idx}>
              <img
                alt={animal.label}
                className="image-viewer-image"
                src={animal.url}
                onClick={handleFullScreen}
              />
              <figcaption
                data-testid="caption"
                className="image-viewer-caption"
              >
                {animal.label}
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="image-viewer-controls">
          <div className="image-viewer-control">
            <label htmlFor="image-viewer-page-slider">Page</label>
            <input
              id="image-viewer-page-slider"
              className="image-viewer-page-slider"
              type="range"
              onChange={handleSlider}
              min={1}
              max={limit}
              value={currentPage}
            />
            <label
              data-testid="shown-image-range"
              htmlFor="image-viewer-page-slider"
            >
              {currentPage} of {limit}
            </label>
          </div>
          <div className="image-viewer-control">
            <input
              id="image-viewer-pagesize-input"
              className="image-viewer-pagesize-input"
              type="number"
              min={1}
              max={filteredAnimals.length}
              onChange={handlePerPage}
              value={perPage}
            />
            <label htmlFor="image-viewer-pagesize-input">per page</label>
          </div>
          <div className="image-viewer-control">
            <input
              type="text"
              className="image-viewer-search"
              placeholder="Search"
              onChange={handleSearch}
              value={searchInput}
            />
          </div>
        </div>
      </div>

      {/* TODO: Render fullscreen dialog inside this div*/}
      <div role="dialog" onClick={closeFullScreen}>
        {isFullScreen && (
          <img src={imgSource} className="fullscreen-modal-image" />
        )}
      </div>
    </div>
  );
}

export default App;
