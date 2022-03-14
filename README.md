# W&B React Coding Challenge

One day at Weights & Biases, we woke up and saw a mysterious package at our office that appeared to be from aliens. Inside the package was a thumb drive with this piece of code and this message:

> Greetings, human! We need your help for a very important task! We are currently conducting a study into the animals of your beloved planet Earth. To this end, we're extracting beings known as "Web Developers" to construct an image viewer for displaying the data we've gathered for our experiment.

> Once you're ready, please commence fixing the issues plaguing the current image viewer. Here's what we have so far.

## INSTRUCTIONS

### Environment

The aliens are testing everything on the latest version of Google Chrome, so I recommend using that for your manual testing needs.

### Commands

First of all, you should run

```
yarn
```

to ensure that any dependencies are installed.

Once deps are installed, you can run:

```
yarn start
```

Runs the app in the development mode.
Open http://localhost:3000 to view it in your browser.

The page will reload when you make changes.
You may also see any lint errors in the console.

```
yarn test
```

Launches the test runner in the interactive watch mode.
See the section about running tests (https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### Data

Their entire database is found in `src/animals.json`. If you ask me, they should be worrying more about their data gathering...

### WARNING

You should use the pre-configured HTML structure in `src/App.js`. The aliens' test suites rely on this structure to be unchanged.

DO NOT EDIT THE FOLLOWING FILES.

- `src/App.test.js`
- `src/animals.json`

### Issues

- Page slider should change the displayed images.

- Page size input should change the number of displayed images.

- Page slider and page size input should have sane min/max.

  - Max page size should be equal to the size of the current image set.
  - Max page should adjust to current page size. Users shouldn't ever be on page 2 when the page size is set to the maximum.

- Searching should filter the image set down to those that have matching labels.

  - A label matches the search filter if the search query is a **_case-insensitive substring_** of the label.
  - The filtered set should be considered when determining max page/page size. If only 1 entry matches the search filter, max page and max page size should both be 1.

- Shown image range (`1 of 10`, etc.) should update with proper values.

- All images on screen should have the same width and height while maintaining their original aspect ratios.

- Keyboard controls need to be implemented.

  - Arrow left: go to previous page (DOES NOT LOOP)
  - Arrow right: go to next page (DOES NOT LOOP)
  - Arrow up: increment page size (DOES NOT LOOP)
  - Arrow down: decrement page size (DOES NOT LOOP)

- Fullscreen mode needs to be implemented.
  - Clicking on an image should bring up a fullscreen `<div role="dialog">` that contains the clicked image and nothing else.
  - Clicking anywhere on the fullscreen dialog (including the image) exits fullscreen mode.
  - Keyboard controls work differently in fullscreen mode:
    - Arrow left: go to previous image (LOOPS)
    - Arrow right: go to next image (LOOPS)
  - Non-fullscreen keyboard controls should be deactivated while in fullscreen mode.

Yeah, it's a lot. Let's prioritize fixes based off this criteria:

1. Baseline usability
2. Visual sanity
3. Quality-of-life features (Not surprised that they don't care much about quality of life...)

Personally, I would look at their automated tests to ensure understanding of exactly how they want the app to behave. Note that the automated tests aren't exhaustive, so I recommend double-checking your work!

## GL;HF!

> Oh, almost forgot! There's a questionnaire at the end of this file. Please fill it out before submitting your work.

## Questionnaire

### What did you accomplish?

_Write your response here._

### Why did you prioritize the tasks that you did?

_Write your reponse here._

### What would you do to improve the app given a lot more time? Get creative with it!

_Write your reponse here._
