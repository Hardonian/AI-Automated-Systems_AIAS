1. **Analyze the testing gap**:
   - `lib/blog/articles.ts` contains simple getter functions operating on a static array.
   - We need unit tests in the `tests/unit/` directory using Vitest.
   - The getters are `getLatestArticles(limit)`, `getFeaturedArticles()`, and `getArticleBySlug(slug)`.
2. **Create unit tests**:
   - Create `tests/unit/articles.test.ts`.
   - Write tests for `getLatestArticles` to ensure sorting and limiting logic works. Since the current static array has articles out of order chronologically? Wait, the static array has `2024-03-20` then `2024-03-15`. They are already sorted in descending order. The test can still verify the result array is sorted in descending order and limit works.
   - Write tests for `getFeaturedArticles` to ensure it returns the first two articles.
   - Write tests for `getArticleBySlug` to ensure it retrieves an article by slug or returns `undefined` for a missing slug.
3. **Run and Verify Tests**:
   - Run `pnpm exec vitest run tests/unit/articles.test.ts`
   - Optionally update the `test:unit` script in `package.json` to run all unit tests instead of just the SEO one: `"test:unit": "pnpm exec vitest run tests/unit/"` or `"vitest run tests/unit"`.
4. **Pre-commit Checks**:
   - Follow instructions from the `pre_commit_instructions` tool to ensure everything is verified.
5. **Submit**:
   - Create a PR with proper format: title `🧪 [Testing] Add unit tests for blog article getters`.
