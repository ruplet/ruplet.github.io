---
layout: post
title: "Presentation at AITP 2025 (Aussois, France): toward formalization of complexity theory"
---

On September 4, 2025, I presented part of my Master's thesis at the 10th Conference on Artificial Intelligence and Theorem Proving, [AITP 2025](https://aitp-conference.org/2025/), in Aussois, France.

In the presentation, I discussed a step I made toward the formalization of complexity theory. Complexity theory is notoriously difficult to formalize, and despite many enormously difficult mathematical theorems already having been formalized, complexity theory is still in its infancy. By connecting results from the field of *bounded arithmetic* with careful Lean 4 software engineering, we can obtain a system that does 90% of the work we need.

I began with an introduction to how limiting the axioms of mathematics, such as by discarding the axiom of choice, can lead to more computational proofs. I discussed a few such theories, focusing on their connection with complexity theory. By designing the axiomatic systems carefully, we obtain theories that have the same proof-theoretic strength as known complexity classes, such as polynomial time (PTIME) or logarithmic space (LOGSPACE).

Then I walked through my thought process for using Lean 4 to enable the transformation of proofs from paper into machine-checked form. The crux of my project was to do this in such a way that proofs formalized in Lean would have the same structure as they do on paper, and I managed to achieve that.

Link to the slides: [https://ruplet.com/aitp-presentation.pdf](https://ruplet.com/aitp-presentation.pdf)

The results presented there are implemented in a separate repository: [https://github.com/ruplet/formalization-of-bounded-arithmetic](https://github.com/ruplet/formalization-of-bounded-arithmetic).