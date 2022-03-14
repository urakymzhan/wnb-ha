# Questionnaire

## What did you accomplish?

I accomplished this task without any external search or 3rd party libraries. There might be many flaws which i would improve or do it in a different way. Since i didn't have much time, tried my best at least some of baseline criterias are met. Made my best efforts to minimize CSS code.
Started with below priorities one by one.

## Why did you prioritize the tasks that you did?

Straightforward. Picked criterias from **README.md** file and grouped fixes which made sense to me.

My Prioritites:

1. Baseline usability:

- Page slider should change the displayed images
- Page size(amount) input should change the number of displayed images
- Page slider and page size input should have sane min/max
  - Max page size should be equal to the size of the current image set.
  - Max page should adjust to current page size. Users shouldn't ever be on page 2 when the page size is set to the maximum.
- Shown image range (1 of 10, etc.) should update with proper values.
- Searching should filter the image set down to those that have matching labels.

2. Visual sanity:

- All images on screen should have the same width and height while maintaining their original aspect ratios.
- Fullscreen mode needs to be implemented (can go both to visual or quality-of-life)

3. Quality-of-life features

- Fullscreen mode needs to be implemented (can go both to visual or quality-of-life)
- Keyboard controls need to be implemented.

## What would you do to improve the app given a lot more time? Get creative with it!

- I would presist the pagination data on refresh
- Research good 3rd party libraries or create flawless solution to deliver better experience for fullscreen and pagination features.
- Implement keyboard features both normal and on fullscreen mode. (currently simply logging `key types` and `key codes`)
- Modularize (currently all logics hangs on random places)
- Add dark theme with cool navs and simple animation in transitions
- Connect some API to make data(animals) dynamic
- Make sure all test cases are met.

**END** --- **END** --- **END**

---

### Non-related

- Full Screen NOT a React Way (first draft)

```js
const handleFullScreen = (e) => {
  e.stopPropagation();
  let dialog = document.querySelectorAll('[role="dialog"]')[0];
  e.target.classList.add("fullscreen-modal-image");

  dialog.classList.add("fullscreen-modal");
  dialog.append(e.target);
  setIsFullscreen(true);
};

const closeFullScreen = (e) => {
  e.stopPropagation();
  const dialog = document.querySelectorAll('[role="dialog"]')[0];
  const img = document.querySelector(".fullscreen-modal-image");
  const imageViewer = document.querySelector(
    ".image-viewer-image-with-caption"
  );
  dialog.removeChild(img);
  dialog.classList.remove("fullscreen-modal");
  img.classList.remove(".fullscreen-modal-image");
  imageViewer.append(img);
  setIsFullscreen(false);
};
```
