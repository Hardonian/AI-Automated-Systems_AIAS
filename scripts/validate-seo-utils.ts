export function countMatches(source: string, pattern: RegExp): number {
  return (source.match(pattern) ?? []).length;
}

export function countPrimaryHeadingSignals(source: string): number {
  const directH1Count = countMatches(source, /<h1[\s>]/g);
  const pageHeroCount = countMatches(source, /<PageHero[\s>]/g);
  const contentDrivenHeroCount = countMatches(source, /<ContentDrivenHero[\s>]/g);
  const surveyFlowCount = countMatches(source, /<SurveyFlow[\s>]/g);

  return directH1Count + pageHeroCount + contentDrivenHeroCount + surveyFlowCount;
}
