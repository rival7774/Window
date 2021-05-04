"use strict";

const slidersum = document.querySelector(".slider__slaider--sum");
const sliderMonths = document.querySelector(".slider__slaider--months");
const sliderNumberTheCost = document.querySelector(".slider__sum--the-cost");
const sliderRangeMonths = document.querySelector(".slider__range--months");
const valueSum = document.querySelector(".receipt__value--sum");
const valueView = document.querySelector(".receipt__value--view");
const valueMonthly = document.querySelector(".receipt__value--monthly");

if (slidersum) {
  noUiSlider.create(slidersum, {
    start: [102000],
    connect: [true, false],
    step: 1,
    keyboardSupport: true,
    range: {
      "min": [15000],
      "max": [1000000]
    }
  });

  slidersum.noUiSlider.on("update", function (values, handle) {
    let sum = Math.round(values) + " ₽";
    sliderNumberTheCost.textContent = sum.replace(/(\d)(?=(\d{3})+(\D|$))/g, "$1 ");

    valueSum.textContent = sum;

    let initial = values / 100 * 10;

    valueView.textContent = Math.round(initial);

    let monthly = (values - initial) / 4.478048780487805;

    valueMonthly.textContent = Math.round(monthly);
  });
}

if (sliderMonths) {
  noUiSlider.create(sliderMonths, {
    start: [6],
    connect: [true, false],
    step: 1,
    keyboardSupport: true,
    range: {
      "min": [0],
      "max": [6]
    }
  });
}
