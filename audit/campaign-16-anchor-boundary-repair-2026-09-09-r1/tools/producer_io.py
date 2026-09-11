"""R4 producer artifact IO only. No boundary selection, bank writes, or acceptance.

Call write_packet(packet_id, manually_authored_decisions, agent_name) after viewing
the whole parent case for each decision. Every decision must name its partId.
This helper only joins immutable identities, checks shapes and freezes bytes.
"""
import datetime
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PRODUCER = 'Codex / GPT-6 Astra'

def digest(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()

def validate_rows(packet_id, rows):
    source = json.loads((ROOT / 'source-packets' / f'{packet_id}.json').read_text())
    expected = source['inventoryRows']
    assert len(rows) == len(expected), 'row count mismatch'
    assert len({r['partId'] for r in rows}) == len(rows), 'duplicate part'
    identities = ('rowKey', 'stage0QueueIndex', 'bankPath', 'parentCaseId', 'partId')
    for row, frozen in zip(rows, expected):
        assert all(row[k] == frozen[k] for k in identities), 'identity/order mismatch'
        assert 'orStage' not in row, 'only proposedBoundary represents the boundary'
        assert row['disposition'] in ('BASELINE', 'STAGE', 'EXCEPTION')
        b = row['proposedBoundary']
        if row['disposition'] == 'BASELINE':
            assert b == {'kind':'baseline'} and row['exceptionReason'] is None
        elif row['disposition'] == 'STAGE':
            assert isinstance(b, str) and b and b in frozen['declaredStageIds']
            assert row['exceptionReason'] is None
        else:
            assert b is None and isinstance(row['exceptionReason'],str) and row['exceptionReason'].strip()
        assert row['confidence'] in ('HIGH','MEDIUM','LOW')
        assert row['bilingualRelation'] in ('PARALLEL','NOT_PARALLEL','UNCERTAIN')
        if row['bilingualRelation'] != 'PARALLEL':
            assert row['disposition'] == 'EXCEPTION', 'bilingual uncertainty must be exceptioned'
        for k in ('earliestBoundaryEvidence','laterStageLeakCheck'):
            assert isinstance(row[k],str) and len(row[k].strip()) >= 40, f'missing evidence: {k}'
    return source

def write_packet(packet_id, decisions, agent_name):
    source_path = ROOT / 'source-packets' / f'{packet_id}.json'
    source = json.loads(source_path.read_text())
    by_id = {r['partId']: r for r in decisions}
    assert len(by_id) == len(decisions), 'duplicate decisions'
    assert set(by_id) == {r['partId'] for r in source['inventoryRows']}, 'incomplete/expanded packet'
    rows=[]
    for frozen in source['inventoryRows']:
        decision=by_id[frozen['partId']]
        row={k:frozen[k] for k in ('rowKey','stage0QueueIndex','bankPath','parentCaseId','partId')}
        for k in ('proposedBoundary','disposition','earliestBoundaryEvidence','laterStageLeakCheck','bilingualRelation','confidence','exceptionReason'):
            row[k]=decision[k]
        rows.append(row)
    validate_rows(packet_id,rows)
    packet={
        'repairPacketId':packet_id, 'producer':PRODUCER,
        'producingAgent':agent_name, 'role':'PRODUCER_SEMANTIC_RECONSTRUCTION',
        'independentReview':False,
        'sourcePacketSha256':digest(source_path),
        'workOrderSha256':json.loads((ROOT/'commission-manifest.json').read_text())['workOrderSha256'],
        'parentCaseIds':list(dict.fromkeys(r['parentCaseId'] for r in rows)),
        'method':'Whole parent examined; each affected part independently evaluated at baseline and successive declared boundaries in English and Simplified Chinese. No Phase E leak verdict or calibration answer key used.',
        'rows':rows,
    }
    out=ROOT/'producer'/f'{packet_id}.json'
    # A producer packet is frozen immediately. Never overwrite an existing freeze.
    with out.open('x') as f: f.write(json.dumps(packet,ensure_ascii=False,indent=2)+'\n')
    receipt={'repairPacketId':packet_id,'path':str(out.relative_to(ROOT)),
             'sha256':digest(out),'bytes':out.stat().st_size,'rowCount':len(rows),
             'parentCount':len(packet['parentCaseIds']),
             'frozenAt':datetime.datetime.now(datetime.timezone.utc).isoformat()}
    receipt_path=ROOT/'producer-support'/f'{packet_id}-freeze.json'
    with receipt_path.open('x') as f: f.write(json.dumps(receipt,indent=2)+'\n')
    print(json.dumps(receipt))
    return receipt
