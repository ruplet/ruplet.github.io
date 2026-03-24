---
layout: post
title: "Master's thesis: programming languages for the formalization of complexity theory"
---
In December 2025, I finished my Master's degree in Computer Science at the University of Warsaw.

In my thesis, I present research on approaches to capturing computational complexity classes syntactically. I study how programs in a programming language can correspond 1:1 to functions from a particular complexity class, such as polynomial time (PTIME) or logarithmic space (LOGSPACE). I review the practical difficulties and inherent limitations of such methods, ranging from recursion theory and descriptive complexity to implicit computational complexity and, finally, bounded arithmetic.

What is especially interesting is that I selected the research topic myself after becoming fascinated by programming language theory as a bachelor's student. While picking your research topic being inexperienced has a high risk of failure, I needed to take the risk (and failed!). I developed the thesis from what began as a random rabbit hole into a result that became interesting to the community, leading to my presentation at AITP[1] and my visit to INRIA Paris to meet Yannick Forster and compare my approach of using Lean to simulate a weak mathematical theory with his approach of studying weak theories through a true deep embedding of the theory in Rocq[2].

The thesis is available at: [https://ruplet.com/master.pdf](https://ruplet.com/master.pdf)

[1] - [https://ruplet.com/2025/09/04/aitp-presentation.html](https://ruplet.com/2025/09/04/aitp-presentation.html)  
[2] - [https://github.com/uds-psl/coq-library-fol/](https://github.com/uds-psl/coq-library-fol/)