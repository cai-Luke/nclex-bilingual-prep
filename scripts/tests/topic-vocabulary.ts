import {
  CANONICAL_TOPICS,
  CANONICAL_TOPIC_LIST,
  SHARED_TOPIC_CATEGORY,
  STRICT_TOPIC_CATEGORY,
  TOPIC_ALIAS_ENTRIES,
  normalizeTopicKey,
  topicCategories,
} from "../../src/topics";

const assert = (condition: unknown, message: string) => {
  if (!condition) {
    throw new Error(message);
  }
};

const seenCanonical = new Map<string, string>();
for (const topic of CANONICAL_TOPIC_LIST) {
  const key = normalizeTopicKey(topic);
  const existing = seenCanonical.get(key);
  assert(!existing, `canonical topic key collision: "${existing}" and "${topic}" both normalize to "${key}"`);
  seenCanonical.set(key, topic);
  assert(
    TOPIC_ALIAS_ENTRIES.some(([aliasKey, target]) => aliasKey === key && target === topic),
    `canonical topic "${topic}" must alias to itself`,
  );
}

const aliasTargets = new Map<string, string>();
for (const [key, target] of TOPIC_ALIAS_ENTRIES) {
  assert(CANONICAL_TOPICS.has(target), `alias "${key}" targets noncanonical topic "${target}"`);
  const existing = aliasTargets.get(key);
  assert(!existing || existing === target, `alias key "${key}" maps to both "${existing}" and "${target}"`);
  aliasTargets.set(key, target);
}

const allStrictTopics = Object.values(STRICT_TOPIC_CATEGORY).flat();
for (const topic of allStrictTopics) {
  assert(!SHARED_TOPIC_CATEGORY[topic], `topic "${topic}" appears in both strict and shared topic maps`);
  assert(topicCategories(topic).length === 1, `strict topic "${topic}" must have exactly one category`);
}

for (const [topic, categories] of Object.entries(SHARED_TOPIC_CATEGORY)) {
  assert(categories.length > 1, `shared topic "${topic}" must list multiple categories`);
  assert(CANONICAL_TOPICS.has(topic), `shared topic "${topic}" is not canonical`);
}

console.log(`Topic vocabulary invariants OK (${CANONICAL_TOPIC_LIST.length} canonical topics, ${TOPIC_ALIAS_ENTRIES.length} aliases)`);
