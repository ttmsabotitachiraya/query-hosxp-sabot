// src/lib/prism.ts
//
// This file controls the Prism.js load order.
//
// Problem: `prismjs/components/prism-sql.js` is a plain script that does:
//   Prism.languages.sql = { ... }
// It references `Prism` as a bare global with no import of its own.
//
// In Vite's ES-module graph, if prism-sql is encountered (and evaluated)
// before prismjs has had a chance to run, the global `Prism` does not yet
// exist and the browser throws:
//   ReferenceError: Prism is not defined
//
// Fix: put BOTH imports inside this single file so ES-module evaluation
// order is deterministic — sibling imports in the same file are evaluated
// depth-first in source order, so `prismjs` always runs first and
// registers `window.Prism`, then `prism-sql` finds it.

// 1️⃣  Load Prism core — this runs _self.Prism = Prism (window.Prism) as a
//     side-effect, making `Prism` available in the global scope.
import Prism from 'prismjs';

// 2️⃣  Belt-and-suspenders: explicitly set the global in case the CJS→ESM
//     transform strips the _self.Prism side-effect.
(globalThis as Record<string, unknown>).Prism = Prism;

// 3️⃣  Register the SQL language grammar.
//     prism-sql.js expects `Prism` to be global — by this point it is.
import 'prismjs/components/prism-sql';

export default Prism;
