import { describe, expect, it } from "vitest";

import { countPrimaryHeadingSignals } from "../../scripts/validate-seo-utils";

const fixtures = {
  directH1: `<main><h1>Title</h1><p>Body</p></main>`,
  pageHero: `<><PageHero title='T' description='D' /></>`,
  contentDrivenHero: `<><ContentDrivenHero content={heroContent} /></>`,
  surveyFlow: `<><SurveyFlow /></>`,
  duplicateSignals: `<><PageHero title='T' description='D' /><h1>Duplicate</h1></>`,
  noSignals: `<main><section><h2>Only section heading</h2></section></main>`,
};

describe("countPrimaryHeadingSignals", () => {
  it("counts a direct h1 as one signal", () => {
    expect(countPrimaryHeadingSignals(fixtures.directH1)).toBe(1);
  });

  it("counts a PageHero as one signal", () => {
    expect(countPrimaryHeadingSignals(fixtures.pageHero)).toBe(1);
  });

  it("counts a ContentDrivenHero as one signal", () => {
    expect(countPrimaryHeadingSignals(fixtures.contentDrivenHero)).toBe(1);
  });

  it("counts a SurveyFlow as one signal", () => {
    expect(countPrimaryHeadingSignals(fixtures.surveyFlow)).toBe(1);
  });

  it("detects duplicate heading signals", () => {
    expect(countPrimaryHeadingSignals(fixtures.duplicateSignals)).toBe(2);
  });

  it("detects missing heading signals", () => {
    expect(countPrimaryHeadingSignals(fixtures.noSignals)).toBe(0);
  });
});
