"""Read-only final verification; does not rewrite frozen artifacts or certify content."""
import collections
import datetime
import hashlib
import json
import pathlib
import subprocess

from verify_a import preservation

R = pathlib.Path(__file__).resolve().parents[1]
REPO = R.parents[1]


def read(path):
    return json.loads(path.read_text())


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def git(*args):
    return subprocess.check_output(['git', *args], cwd=REPO, text=True).strip()


opening = read(R / 'opening-state.json')
assert git('rev-parse', 'origin/main') == opening['head'], 'accepted mainline moved'
protected = preservation()
manifests = {}
for phase in ['phase-a', 'phase-b', 'phase-c', 'phase-d']:
    path = R / (phase + '-freeze.json')
    manifest = read(path)
    for relative, expected in manifest['artifacts'].items():
        assert sha(R / relative) == expected, f'frozen artifact drift: {relative}'
    manifests[phase] = {'sha256': sha(path), 'files': len(manifest['artifacts'])}

for relative, key in [('phase-b/survey.json', 'codeHashes'),
                      ('phase-c/planning-inputs.json', 'hashes'),
                      ('phase-d/scope.json', 'inputs')]:
    for path, expected in read(R / relative)[key].items():
        assert sha(REPO / path) == expected, f'input drift: {path}'

prefix = str(R.relative_to(REPO)) + '/'
changed = git('diff', '--name-only', opening['head'], '--').splitlines()
untracked = git('ls-files', '--others', '--exclude-standard').splitlines()
assert all(path.startswith(prefix) for path in changed + untracked), 'out-of-scope change'

receipts = []
expected_nonzero = {
    'phase-c-batch1-author': 1,
    'phase-c-batch1-normalize': 1,
    'phase-c-batch1-validate': 1,
    'phase-c-batch1-raw-gate': 1,
    'stage-refs-strict-live': 1,
}
for path in sorted((R / 'verification').glob('*.json')):
    # This command's wrapper writes its receipt after the process exits.
    if path.stem == 'final-closeout':
        continue
    receipt = read(path)
    assert sha(R / receipt['output']) == receipt['outputSha256'], path.name
    assert receipt['exitCode'] == expected_nonzero.get(path.stem, 0), path.name
    receipts.append({'receipt': str(path.relative_to(R)), **receipt})
assert {pathlib.Path(r['receipt']).stem for r in receipts if r['exitCode']} == set(expected_nonzero)

a = read(R / 'phase-a/dispositions.json')
b = read(R / 'phase-b/survey.json')
c = read(R / 'phase-c/preflight.json')
d = read(R / 'phase-d/candidates.json')
assert len(a) == 66 and len({r['parentCaseId'] for r in a}) == 38
assert b['legacyRows'] == b['deterministicCandidates'] == 75 and b['legacyParents'] == 19
assert b['semanticHolds'] == 0 and not b['canonicalMutation']
raw_items = []
for batch in c['batches']:
    path = R / batch['file']
    assert sha(path) == batch['sha256']
    questions = read(path)['questions']
    assert len(questions) == 6
    assert len({q['topic'] for q in questions}) >= 4
    assert len({q['itemType'] for q in questions}) >= 2
    assert all(q['itemType'] != 'case_study' and 'visual' not in q for q in questions)
    raw_items += questions
assert len(raw_items) == c['items'] == 18
assert len({q['id'] for q in raw_items}) == 18
assert len(d) == 3

summary = {
    'status': 'PASS_PRODUCER_HANDOFF_INTEGRITY_ONLY',
    'checkedAt': datetime.datetime.now(datetime.timezone.utc).isoformat(),
    'access': 'LOCAL_DISK',
    'worktree': str(REPO),
    'branch': git('branch', '--show-current'),
    'acceptedBase': opening['head'],
    'phaseHeadBeforeCloseoutCommit': git('rev-parse', 'HEAD'),
    'upstreamAtCheck': git('rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{upstream}'),
    'aheadBehindAtCheck': [int(n) for n in git('rev-list', '--left-right', '--count', 'HEAD...@{upstream}').split()],
    'trackedScope': prefix,
    'preserved': protected,
    'frozenManifests': manifests,
    'phaseA': {'rows': len(a), 'parents': 38,
               'dispositions': dict(collections.Counter(r['disposition'] for r in a)),
               'deterministicRows': sum(r['deterministic'] for r in a),
               'holds': [{'partId': r['partId'], 'requiredContentWork': r['requiredContentWork']}
                         for r in a if r['disposition'] == 'REVIEW_HOLD']},
    'phaseB': {'rows': b['legacyRows'], 'parents': b['legacyParents'],
               'banks': len(b['affectedBanks']), 'deterministicCandidates': b['deterministicCandidates'],
               'semanticHolds': b['semanticHolds'], 'negativeControls': len(b['negativeControls'])},
    'phaseC': {'items': len(raw_items), 'batches': len(c['batches']),
               'topics': len({q['topic'] for q in raw_items}),
               'formats': dict(collections.Counter(q['itemType'] for q in raw_items)),
               'positiveControls': c['positiveControls'], 'negativeControls': c['negativeControls'],
               'bilingualPairs': c['pairCount']},
    'phaseD': {'records': len(d), 'dispositions': dict(collections.Counter(r['disposition'] for r in d))},
    'receiptCountBeforeThisCommand': len(receipts),
    'receiptExitCountsBeforeThisCommand': dict(collections.Counter(str(r['exitCode']) for r in receipts)),
    'receipts': receipts,
    'canonicalMutation': False,
    'independentReviewCompleted': False,
    'promotedItems': 0,
    'historyPublication': 'Deferred to post-review publishing/merge seat',
    'publication': 'This check precedes its containing closeout commit; final handoff reports live remote HEAD.',
}
print(json.dumps(summary, ensure_ascii=False, indent=2))
