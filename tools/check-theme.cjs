const path = require('node:path');
const { check } = require('@shopify/theme-check-node');
(async () => {
  const issues = await check(path.resolve(__dirname, '..'));
  for (const issue of issues) console.log(`${issue.check}: ${issue.message} (${issue.uri})`);
  console.log(`Theme Check: ${issues.length} issues`);
  if (issues.some(issue => issue.severity === 0)) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; });
