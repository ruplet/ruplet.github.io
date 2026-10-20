---
layout: post
title: A new proof assistant project
---
I’m presenting a fun new project: my own proof assistant based on proof calculus, as an alternative to assistants based on type theory.

There’s a demo built around linear logic, where you can explore proofs in the assistant’s approach.

Note that you cannot use Lean 4 / Rocq / Isabelle / anything to formalize linear logic proofs directly. There is ongoing work on linear and temporal logic in CSLib, but that needs a deep embedding and it's not much different from writing that in C++ instead of in Lean.

[Try the linear logic demo](/proof-studio/)

[See the project on GitHub](https://github.com/ruplet/fast-proof-theory)
