import assert from "node:assert/strict";
import { runValidateBank } from "../audit/validate-bank";
import { createAuditScopeFixtures, withUnreadableFile } from "../test-utils/audit-scope-fixtures";

const fixture = await createAuditScopeFixtures();
try {
  let result = await runValidateBank({ files: [fixture.validA] });
  assert.equal(result.status, "PASS");
  assert.match(result.detail, /All 1 explicitly selected bank file/);

  result = await runValidateBank({ files: [fixture.validA, fixture.validB] });
  assert.match(result.detail, /All 2 explicitly selected bank file/);

  for (const path of [fixture.missing, fixture.malformed, fixture.schemaInvalid]) {
    result = await runValidateBank({ files: [path] });
    assert.equal(result.status, "FAIL");
    assert.deepEqual(result.failures, [path]);
    assert.match(result.detail, new RegExp(path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  result = await runValidateBank({ files: [fixture.validA, fixture.aliasForValidA] });
  assert.match(result.detail, /All 1 explicitly selected bank file/);
  assert.doesNotMatch(result.detail, /promoted|bundled|canonical/);

  assert.equal((await runValidateBank({ files: [] })).status, "FAIL");

  const unreadable = await withUnreadableFile(
    fixture.unreadable,
    () => runValidateBank({ files: [fixture.unreadable] }),
  );
  if (unreadable.unreadableWasEnforced) assert.equal(unreadable.value.status, "FAIL");
} finally {
  await fixture.cleanup();
}

console.log("audit-validate-bank tests passed");
