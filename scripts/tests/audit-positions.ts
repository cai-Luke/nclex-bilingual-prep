import assert from "node:assert/strict";
import { runAuditPositions } from "../audit/audit-positions";
import { createAuditScopeFixtures, withUnreadableFile } from "../test-utils/audit-scope-fixtures";

const fixture = await createAuditScopeFixtures();
try {
  let result = await runAuditPositions({ files: [fixture.validA] });
  assert.equal(result.status, "INSUFFICIENT");
  assert.match(result.detail, /3-option MC \(n=1\): \[slot0=1, slot1=0, slot2=0\]/);

  result = await runAuditPositions({ files: [fixture.validA, fixture.validB] });
  assert.match(result.detail, /3-option MC \(n=2\): \[slot0=1, slot1=1, slot2=0\]/);

  for (const path of [fixture.missing, fixture.malformed, fixture.schemaInvalid]) {
    result = await runAuditPositions({ files: [path] });
    assert.equal(result.status, "FAIL");
    assert.deepEqual(result.failures, []);
  }

  result = await runAuditPositions({ files: [fixture.validA, fixture.aliasForValidA] });
  assert.match(result.detail, /3-option MC \(n=1\)/);
  assert.doesNotMatch(result.detail, /promoted|bundled|canonical/);
  assert.equal((await runAuditPositions({ files: [] })).status, "FAIL");

  const unreadable = await withUnreadableFile(
    fixture.unreadable,
    () => runAuditPositions({ files: [fixture.unreadable] }),
  );
  if (unreadable.unreadableWasEnforced) assert.equal(unreadable.value.status, "FAIL");
} finally {
  await fixture.cleanup();
}

console.log("audit-positions tests passed");
