import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { runAuditReferences } from "../audit/audit-references";
import {
  createAuditScopeFixtures,
  makeBank,
  makeQuestion,
  withUnreadableFile,
} from "../test-utils/audit-scope-fixtures";

const fixture = await createAuditScopeFixtures();
try {
  let result = await runAuditReferences({ files: [fixture.validA] });
  assert.equal(result.status, "PASS");

  result = await runAuditReferences({ files: [fixture.validA, fixture.validB] });
  assert.equal(result.status, "PASS");

  for (const path of [fixture.missing, fixture.malformed, fixture.schemaInvalid]) {
    result = await runAuditReferences({ files: [path] });
    assert.equal(result.status, "FAIL");
    assert.match(result.detail, new RegExp(path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  result = await runAuditReferences({ files: [fixture.validA, fixture.aliasForValidA] });
  assert.equal(result.status, "PASS");
  assert.equal((await runAuditReferences({ files: [] })).status, "FAIL");

  const findingPath = join(fixture.directory, "reference-finding.json");
  await writeFile(
    findingPath,
    JSON.stringify(makeBank(makeQuestion("reference_finding", { rationale: "Option B is correct." }))),
  );
  result = await runAuditReferences({ files: [findingPath] });
  assert.equal(result.status, "FAIL");
  assert.match(result.detail, new RegExp(`${findingPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}: reference_finding:`));

  const unreadable = await withUnreadableFile(
    fixture.unreadable,
    () => runAuditReferences({ files: [fixture.unreadable] }),
  );
  if (unreadable.unreadableWasEnforced) assert.equal(unreadable.value.status, "FAIL");
} finally {
  await fixture.cleanup();
}

console.log("audit-references tests passed");
