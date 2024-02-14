---
layout: post
title: About Sudoku
---

## Syntax for Sudoku
Can we design such a syntactical language, so that it'll only be possible
to write down in it a valid solution to a Sudoku, and all the valid Sudoku
solutions will be possible to write in it?

## The number of completed Sudokus of size n^2 x n^2
First thing I looked at was literature about counting the number of valid
Sudoku solutions, as in enumerative combinatorics, one often has to
somehow classify the objects in question in order to count them.
What I learned:
- this problem is open and no general solution is known. Solutions for grid
sizes 0, 1, 4, 9 are only known: https://oeis.org/A107739
- there is roughly 6 * 10^21 distinct solutions to the 9x9 grid: https://people.math.sc.edu/girardi/sudoku/enumerate.pdf
- the authors (Felgenhauer, Jarvis, 2005) came up with a few reductions (such
as parametrizing a solution by the permutation (1, ..., 9) so that numbers in
the first box are increasing from 1 to 9), but then had to resort to
a brute-force search of the remaining possible values.
- (Russel, Jarvis 2006: http://www.afjarvis.org.uk/sudoku/russell_jarvis_spec2.pdf) here they analyzed the number of valid solutions modulo some solution-preserving symmetries. They found it's ~5 bilion using Burnside's lemma. But the Burnside's lemma is non-constructive. By using this approach we could design a language in which a valid operation is applying one of the solution-preserving symmetries (such as relabeling the numbers), but we would have to start with a valid solution - and no classification is known for the 5B starting points; http://www.afjarvis.org.uk/sudoku/sudgroup.html
- Aviv and Ilan Adlers (father and son) found out that the symmetries considered
above are truly all the symmetries which preserve solutions: https://adler.ieor.berkeley.edu/ilans_pubs/suduko_2008.pdf

## Possible approaches
- first of all: don't consider the nxn case, only the 9x9
- would Vapnik-Chervonenkis dimension be of use?
- it's a compression problem really. you compress from 81 numbers 1-9 to set
which is significantly smaller (but still large)
- dimensionality reduction from machine learning?
- could variational auto-encoder learn how to compress and decompress these 
numbers?
- could using advanced sudoku-solving help us reduce the number of solutions
to brute-force?

## Advanced sudoku-solving techniques
- Phistomefel Ring:
  * Numberphile video: https://www.youtube.com/watch?v=pezlnN4X52g
  * https://masteringsudoku.com/phistomefel-ring/

## Generating Sudoku boards
Is it likely we will ever be able to reliably generate Sudokus? It seems unlikely. No example is known of a problem L which is NP-complete, but #L is not #P-complete. As generalized Sudoku is an NP-complete problem, the number of valid solutions is likely a #P-complete problem, and thus at least as hard as NP. So generating Sudokus is probably as difficult as solving them and
a backtracking algorithm which checks a solution by trying to solve it, seems optimal.

But: maybe we can use some sort of kernelization?
Also, we don't have to generate n^2 x n^2 Sudokus in general - 9x9 is
totally fine.
