// React-free registration barrel. Side-effect imports register every kind at
// module load. Import THIS from non-React entrypoints (schema validation, Node
// scripts, tests); the app barrel (../index.ts) imports it too and adds the
// React dispatcher on top. Append-only as kinds land.
import "./rhythmStrip";
// import "./capnography"; ← append-only as kinds land
