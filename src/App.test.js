import _ from "lodash";
import "@testing-library/jest-dom";
import {
  fireEvent,
  getNodeText,
  render,
  screen,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import ANIMALS from "./animals";

test("page slider: different pages display correct images", () => {
  render(<App />);
  assertInitialValues();

  ANIMALS.forEach((animal, i) => {
    setPage(i + 1);
    assertNumberOfImagesOnScreen(1);
    assertImageWithLabelIsOnScreen(animal.label);
    assertShownImageRange(`${i + 1} of ${ANIMALS.length}`);
  });

  [
    { pageSize: 3, page: 1, animals: [0, 1, 2] },
    { pageSize: 3, page: 2, animals: [3, 4, 5] },
    { pageSize: 3, page: 3, animals: [6, 7, 8] },
    { pageSize: 3, page: 4, animals: [9] },
    { pageSize: 5, page: 1, animals: [0, 1, 2, 3, 4] },
    { pageSize: 5, page: 2, animals: [5, 6, 7, 8, 9] },
    { pageSize: 7, page: 1, animals: [0, 1, 2, 3, 4, 5, 6] },
    { pageSize: 7, page: 2, animals: [7, 8, 9] },
  ].forEach(({ pageSize, page, animals }) => {
    setPageSize(pageSize);
    setPage(page);
    assertNumberOfImagesOnScreen(animals.length);
    animals.forEach((i) => assertImageWithLabelIsOnScreen(ANIMALS[i].label));
    assertShownImageRange(
      `${animals[0] + 1} - ${_.last(animals) + 1} of ${ANIMALS.length}`
    );
  });
});

test("page slider: max page adjusts to page size", () => {
  render(<App />);
  assertInitialValues();

  [
    { pageSize: 2, maxPage: 5 },
    { pageSize: 4, maxPage: 3 },
    { pageSize: 8, maxPage: 2 },
  ].forEach(({ pageSize, maxPage }) => {
    setPageSize(pageSize);
    assertPageSliderValues({
      max: maxPage - 1,
    });
  });
});

test("page slider: doesn't reset to first page on page size adjustment", () => {
  render(<App />);
  assertInitialValues();

  [
    { fromPageSize: 1, fromOnPage: 10, toPageSize: 2, toOnPage: 5 },
    { fromPageSize: 1, fromOnPage: 10, toPageSize: 4, toOnPage: 3 },
    { fromPageSize: 1, fromOnPage: 10, toPageSize: 8, toOnPage: 2 },
  ].forEach(({ fromPageSize, fromOnPage, toPageSize, toOnPage }) => {
    setPageSize(fromPageSize);
    setPage(fromOnPage);
    assertPageSliderValues({
      value: fromOnPage - 1,
    });

    setPageSize(toPageSize);
    assertPageSliderValues({
      value: toOnPage - 1,
    });
  });
});

test("page size input: changes number of images on screen", () => {
  render(<App />);
  assertInitialValues();

  for (let n = 1; n <= ANIMALS.length; n++) {
    setPageSize(n);
    assertNumberOfImagesOnScreen(n);
    assertShownImageRange(`1${n > 1 ? ` - ${n}` : ``} of ${ANIMALS.length}`);
  }
});

test("page size input: clamped between 1 and dataset size", () => {
  render(<App />);
  assertInitialValues();

  [
    { input: 0, numImages: 1 },
    { input: -1, numImages: 1 },
    { input: 20, numImages: 10 },
  ].forEach(({ input, numImages }) => {
    setPageSize(input);
    assertPageSizeInputValue(numImages);
    assertNumberOfImagesOnScreen(numImages);
  });
});

test("page size input: clamped to searched dataset", () => {
  render(<App />);
  assertInitialValues();

  [
    { searchVal: `fLaMiN`, input: 10, numImages: 1 },
    { searchVal: `aM`, input: 20, numImages: 2 },
    { searchVal: `Le`, input: 100, numImages: 2 },
  ].forEach(({ searchVal, input, numImages }) => {
    setSearch(searchVal);
    setPageSize(input);
    assertPageSizeInputValue(numImages);
    assertNumberOfImagesOnScreen(numImages);
  });
});

test("search input: exact matches", () => {
  render(<App />);
  assertInitialValues();

  ANIMALS.forEach((animal) => {
    const label = animal.label;
    setSearch(label);
    assertImageWithLabelIsOnScreen(label);
    assertShownImageRange(`1 of 1`);
  });
});

test("search input: case-insensitive substring matches", () => {
  render(<App />);
  assertInitialValues();

  [
    { searchVal: `fLaMiN`, animals: [2] },
    { searchVal: `aM`, animals: [2, 3] },
    { searchVal: `Le`, animals: [4, 7] },
  ].forEach(({ searchVal, animals }) => {
    reset();
    setSearch(searchVal);
    assertNumberOfImagesOnScreen(animals.length);
    animals.forEach((i) => assertImageWithLabelIsOnScreen(ANIMALS[i].label));
    assertShownImageRange(
      `1${animals.length > 1 ? ` - ${animals.length}` : ``} of ${
        animals.length
      }`
    );
  });

  function reset() {
    setSearch(``);
    setPageSize(ANIMALS.length);
  }
});

test("keyboard input: page slider", () => {
  render(<App />);
  assertInitialValues();

  userEvent.keyboard(`{arrowleft}`);
  assertPageSliderValues({ value: 0 });

  userEvent.keyboard(`{arrowright}`);
  assertPageSliderValues({ value: 1 });
  userEvent.keyboard(`{arrowright}`);
  userEvent.keyboard(`{arrowright}`);
  assertPageSliderValues({ value: 3 });

  userEvent.keyboard(`{arrowleft}`);
  assertPageSliderValues({ value: 2 });
  userEvent.keyboard(`{arrowleft}`);
  userEvent.keyboard(`{arrowleft}`);
  assertPageSliderValues({ value: 0 });
});

test("keyboard input: page size input", () => {
  render(<App />);
  assertInitialValues();

  userEvent.keyboard(`{arrowdown}`);
  assertPageSizeInputValue(1);

  userEvent.keyboard(`{arrowup}`);
  assertPageSizeInputValue(2);
  userEvent.keyboard(`{arrowup}`);
  userEvent.keyboard(`{arrowup}`);
  assertPageSizeInputValue(4);

  userEvent.keyboard(`{arrowdown}`);
  assertPageSizeInputValue(3);
  userEvent.keyboard(`{arrowdown}`);
  userEvent.keyboard(`{arrowdown}`);
  assertPageSizeInputValue(1);
});

test("keyboard input: don't change page on left/right arrow when focused on search input", () => {
  render(<App />);
  assertInitialValues();

  const searchInput = screen.getByRole(`textbox`);
  setPage(2);

  userEvent.click(searchInput);
  expect(searchInput).toHaveFocus();
  userEvent.keyboard(`{arrowleft}`);
  assertPageSliderValues({ value: 1 });
  userEvent.keyboard(`{arrowright}`);
  assertPageSliderValues({ value: 1 });
});

// test("keyboard input: no double increment/decrement while focused on page slider", () => {
//   render(<App />);
//   assertInitialValues();

//   const pageSlider = screen.getByRole(`slider`);
//   const pageSizeInput = screen.getByRole(`spinbutton`);

//   userEvent.click(pageSlider);
//   assertPageSliderValues({ value: 0 });
//   expect(pageSlider).toHaveFocus();
//   userEvent.keyboard(`{arrowright}`);
//   assertPageSliderValues({ value: 1 });

//   userEvent.click(pageSizeInput);
//   assertPageSizeInputValue(1);
//   expect(pageSizeInput).toHaveFocus();
//   userEvent.keyboard(`{arrowup}`);
//   assertPageSizeInputValue(2);
// });

test("fullscreen: clicking on image activates, clicking anywhere on modal deactivates", () => {
  render(<App />);
  assertInitialValues();

  setPageSize(ANIMALS.length);
  assertPageSizeInputValue(ANIMALS.length);
  assertNumberOfImagesOnScreen(ANIMALS.length);

  const figures = screen.getAllByRole(`figure`);
  figures.forEach((figure) => {
    const img = within(figure).getByRole(`img`);
    userEvent.click(img);

    const fullscreenModal = screen.getByRole(`dialog`);
    const fullscreenImg = within(fullscreenModal).getByRole(`img`);
    expect(fullscreenImg.src).toBe(img.src);

    userEvent.click(fullscreenModal);
    expect(screen.queryByRole(`dialog`)).toBeNull();
  });
});

test("fullscreen + keyboard input: fullscreen shortcuts", () => {
  render(<App />);
  assertInitialValues();

  const img = screen.getByRole(`img`);
  userEvent.click(img);

  const fullscreenModal = screen.getByRole(`dialog`);
  const fullscreenImg = within(fullscreenModal).getByRole(`img`);
  expect(fullscreenImg.src).toBe(ANIMALS[0].url);

  userEvent.keyboard(`{arrowright}`);
  expect(fullscreenImg.src).toBe(ANIMALS[1].url);
  userEvent.keyboard(`{arrowleft}`);
  userEvent.keyboard(`{arrowleft}`);
  expect(fullscreenImg.src).toBe(ANIMALS[9].url);

  userEvent.keyboard(`{arrowleft}`);
  expect(fullscreenImg.src).toBe(ANIMALS[8].url);
  userEvent.keyboard(`{arrowright}`);
  userEvent.keyboard(`{arrowright}`);
  expect(fullscreenImg.src).toBe(ANIMALS[0].url);
});

test("fullscreen + keyboard input: non-fullscreen shortcuts don't fire in fullscreen mode", () => {
  render(<App />);
  assertInitialValues();

  setPageSize(2);
  setPage(2);

  const imgs = screen.getAllByRole(`img`);
  userEvent.click(imgs[0]);
  screen.getByRole(`dialog`);

  userEvent.keyboard(`{arrowright}`);
  assertPageSliderValues({ value: 1 });
  userEvent.keyboard(`{arrowleft}`);
  assertPageSliderValues({ value: 1 });
  userEvent.keyboard(`{arrowup}`);
  assertPageSizeInputValue(2);
  userEvent.keyboard(`{arrowdown}`);
  assertPageSizeInputValue(2);
});

function assertInitialValues() {
  assertPageSliderValues({
    value: 0,
    min: 0,
    max: ANIMALS.length - 1,
  });
  assertPageSizeInputValue(1);
  assertSearchInputValue(``);
}

function assertPageSliderValues({ value, min, max }) {
  const slider = screen.getByRole(`slider`);
  if (value != null) {
    expect(slider.value).toBe(`${value}`);
  }
  if (min != null) {
    expect(slider.min).toBe(`${min}`);
  }
  if (max != null) {
    expect(slider.max).toBe(`${max}`);
  }
}

function assertPageSizeInputValue(n) {
  const input = screen.getByRole(`spinbutton`);
  expect(input.value).toBe(`${n}`);
}

function assertSearchInputValue(str) {
  const searchInput = screen.getByRole(`textbox`);
  expect(searchInput.value).toBe(str);
}

function assertNumberOfImagesOnScreen(n) {
  const images = screen.getAllByRole(`img`);
  expect(images.length).toBe(n);
}

function assertImageWithLabelIsOnScreen(label) {
  const imageData = ANIMALS.find((animal) => animal.label === label);
  expect(imageData).not.toBeNull();

  const figures = screen.getAllByRole(`figure`);
  const foundMatch = figures.some((figure) => {
    const img = within(figure).getByRole(`img`);
    const caption = within(figure).getByTestId(`caption`);
    return (
      img.src === imageData.url &&
      img.alt === imageData.label &&
      getNodeText(caption) === imageData.label
    );
  });
  expect(foundMatch).toBe(true);
}

function assertShownImageRange(text) {
  const label = screen.getByTestId(`shown-image-range`);
  const labelText = getNodeText(label);
  expect(labelText).toBe(text);
}

function setPage(n) {
  const pageSlider = screen.getByRole(`slider`);
  fireEvent.change(pageSlider, { target: { value: `${n - 1}` } });
}

function setPageSize(n) {
  const pageSizeInput = screen.getByRole(`spinbutton`);
  clearInputAndType(pageSizeInput, n);
}

function setSearch(v) {
  const searchInput = screen.getByRole(`textbox`);
  clearInputAndType(searchInput, v);
}

function clearInputAndType(input, v) {
  if (v === "") {
    userEvent.clear(input);
    return;
  }
  userEvent.type(input, `{selectall}${v}`);
}
