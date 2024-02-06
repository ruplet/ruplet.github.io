## Prove that the halting problem is undecidable
Assume it is decidable: let machine H recognize L = {m#w | m terminates on w}. Consider machine M: for w, runs H(w#w), if H accepted then loops forever, else accepts. Then consider running M(source code of M). If H accepts w#w, it means M terminates on M, but if H accepts, it causes M to loop - contradiction. If H rejects, it means that w#w does not terminate, but it does.

## Prove that P < EXPTIME
language: L = {M#w#t: M is a DTM accepting w in time t}
it is in exptime: TM runs in time poly(|M| + |w| + 2^{|t|})
consider PTIME TM M recognizing L
and for k=1,2,.. machines N[k]:
w represents TM accepting w in time 2^k => N[k](w) = reject, else: accept

using M, construct N[k] so that
running time of N[k] on input of length n is p(n * k)
size of source code of N[k] is O(k)
k large enough => running time of N[k] on N[k] <= 2^k
(grows polynomialy with k)
For this k we have
N[k] accepts N[k] => rejects
rejects => accepts
contradiction!

## Prove that PSPACE = NPSPACE (Savitch)
NSPACE s(n) subseteq DSPACE s(n)^2
A computation of space m can have at most k^m configurations

// is there path from source to target configurations,
// with time <= 2^n, space <= m?
F(source, target, n, m):
if n = 0:
  check if source can reach target in 0 or 1 steps
else:
  for every configuration c of memory at most m:
    if f(source, c, n-1, m) and f(c, target, n-1, m) then return true
  return false

to prove Savtich for nondet turing  machine running in space p(n), 
run this program for source = initial config
target = accepting config
n = log k * p(n)
m = p(n)

this is a deterministic program, using space O(n x m)
n for recursion depth, m: memory for each recursive call

## Prove the Sipser theorem
consider graph of configurations with <= m memory
terminal is either accepting, rejecting or moving to higher memory
there can be 0 or 1 terminals reachable from initial config
if there are 0, machine loops in memory <= m
if there is 1, accept, reject or increment m


write mem bound on tape (initially m=1)
for every config c with mem <= m:
  if c terminal:
    if c can be reached from initial using <= m memory:
      if c accepting, accept
      if c rejecting, reject
      if c increases, increment m and `continue`
if no terminal accessible, reject


## Prove the Immerman and Szelepcsenyi theorem
consider NL machine which:
input: directed graph with designated source vertex
output: number of vertices reachable from source

consider lang L, whose complement is recognized by NL machine M
run the counting algorithm twice:
a) on graph of configurations of M
b) on graph of configurations of M, with accepting configs removed
if results are equal (i.e. M rejects), accept. Otherwise, reject.

algorithm:
d = 0
r[d] = 1 // # of vertices reachable from source, using a path of <= d edges
repeat {
 d++ 
 r[d] = 0
 for v in vertices:
  // if v is source, it's certainly reachable
  reach = (v == source)
  // counter to check 
  guessedno = 0
  for u in vertices {
    // guess a path of length at most d - 1 from s to u
    // if v reachable from u, remember it - v is reachable
    // from s in at most d steps
    nondeterministically choose
      assert Reachable(s, u, d - 1)
      if Edge(u, v) then reach = true
    or
      guessedno ++
  }
  // if there was an incorrect ,,no'' guess, this assertion will fail
  assert guessedno == n - r[d - 1]
  if reach then r[d]++
} until r[d] == r[d - 1]

// repeat until X = do while not X


## Turing vs Karp reductions
reduction from problem A to problem B:

Turing (Cook reduction): algorithm that solves A using multiple
number of calls to a subroutine for problem B

Karp (many-one reduction): algorithm for transforming inputs to A to inputs 
of B, such that B(transf(inp)) = A(inp)

Logspace Turing reductions: A <=L B iff A in L^B
PTime    Turing reductions: A <=P B iff A in P^B

## NP halting problem NP complete
it is in NP: simulate execution of M, guessing it's choice every transition,
and counting steps, if they exceed the polynomial - reject

Every problem in NP can be reduced, via a logarithmic space Karp reduction,
to the following problem:

{M#w#t: M is nondet. TM s.t. w is accepted by some run with time t (unary)}

reduction: for (M, p): machine for language L in NP; p: witness of polytime

f(w: {0, 1}\*):
  var x: int
  output += code of M
  output += #w#

  x = p(|w|)
  while x > 0:
    --x
    output += 1

  return output


logspace reductions are composable, but it's not as obvious as in ptime
reductions; they cant store the intermediate result, but compute
the result one character by one, each time calling the first function
and taking nth character of its result, passing it to the second etc.,
maintaining the state of second machine

## SAT is NP-complete
make a formula which is true if and only if a correct
accepting run of the configurations of the NTM exist;
since NP halt is NP hard, SAT is also.

it is in NP because guess valuation of variables

## QBF is PSPACE-complete
instance of pspace tiling problem:
available tiles, first row, last row

a row is presented as a valuation of m boolean variables where
m = tiles * columns

for every (binary) n (height), we compute in Logspace a QBF formula
qn (x1, x2, .., xm, y1, y2, .. ym)
for rows x, y

which holds iff there is solution to tilign with first row x, 
last y and height n

for n=1 say rows are equal or match
for n>1 use induction:

Exists z Forall u (u=xz) v (u=zy) => Phi_n/2(u)

tiling has solution iff the formula is true for x=first row,
y=last row, n= tiles^columns

## Reachability NL-complete
Take language A in NL and its nondet turing machine  M,
running in space at most k * log(n) for some fixed k

we will write f, which will transform inputs of A to inputs of directed
reachability

f(w):

n = |w|
m = k log n

for each (worktape, inphead, wrkhead, state, worktp', inphd', wrkhd', st')
  of
    worktape, worktp' in strings of length <= m (iterate lexicograph.)
    inphead, inphd' = 1 .. n
    wrkhead, wrkhd' = 1 .. m
    state, st' in Q:

  output edge of ((worktape, inphead, wrkhead), (wtp', inhd', whd', st'))
output ('', 1, 1, q0)  // source vertex: empty wrktp with init state
output ('', 1, 1, q1) // final vertex: empty wrktp with final state

pass this to directed reach

## alternating reachability P-complete

Solve P tiling by alt. reachability:

vertices for v: any partial solutions whose domain
is one cell

vertices for ^: any aprtial solution whose domain is
one cell and its left or right neighbours (or both) (if they exist)
+ two special vertices: source and target
target is a dead end

player V wins in a one tile vertex iff vertex can be extended to
partial solution whose domain is closed under going up, diag left, diag R

in source, AND chooses any vertex from last row
in every tile of first row, V can go to target

in one tile vertex, V chooses three tile vertices directly above it

ina  three tile vertex, AND chooses one vertex contained in it


## Ladner's theorem
Assuming P neq NP, there are problems not in P, but not NP-complete
(no ptime algorithm, no ptime reduction from sat)

Ri: A neq L(Mi)
Supposing SAT not in P, we will use padded sat language L,
such that L is not in P, but SAT does not reduce to L in polynomial time
L = {w01^f(|w|) for w in SAT}
M1, M2, M3, ... - enumeration of turing machines,
Mi works in time O(n^i), every language in P is rec. by some machine Mi
every Mi has counter added which stops the machine after n^i steps
a) i=1, n=1
b) f(n) = n^i
c) if there is word v of length <= log n, such that Mi incorrectly
   recognizes whether v in L, increase i by 1
d ) increase n by 1, go back to b)

facts:
- it can be checked in polynomial time whether number of ones is f(w)
- on every word v we run Mi which works in time O(log n)^i
- this is not ptime by itself, as i is not constant
- the simulation time depends on |M_i| but |M_i| = log(i) < log(n)
- at the end we check if v in L where v <= log n
  + check number of ones
  + check if prefix in SAT in time exponential to log n

so L in NP
if SAT not in P then L not in P
if L in P then some Mi recognizes L so from some moment on we have fn=n^i
i.e. for n >= n0 for some n0
take w: sat instance
if len w > n0 append len(w)^i ones at the end, start Mi
for w shorter, hardcode results
solved sat in ptime!

L nie jest NP-zupelny:
zalozmy ze sat redukuje sie do L przez funkcje g w czasie n^k
istnieje n0 ze dla n>n0 mamy fn>n^k
https://www.mimuw.edu.pl/~klin/teaching/zlo15-16/wyk8.pdf


## Baker-Gill-Solovay theorem
a) P^A = NP^A
A = QBF
NP^QBF in NPSPACE = PSPACE = P^QBF
b)
oracle B. Language L = lengths of B.
L is in NP^B - nondet machine can guess letters of w in B
we constuct it - so we can choose what we want
finite partial oracles B_k
so that if we take a smaller and larger oracle,
Mk(B) gives at least one wrong answer for Lengths[B]

suppose we already found such Bk
let n be such that Bk is undefined on words of len n
let B extedn Bk with only 'no' answers
consider run of M_k+1[B] on input of length n
if it accepts, to oracle Bk+1 add all queries used by this run
and 'no' for inputs of lengths n

if if rejects, the run asks oracle queries about some words of len
exactly n. if if large, not all queries will be asked. to oralce Bk+1
add all queries used by the run + a 'yes' answer for some unasked query
about a word of length n



## Define P/poly, show it is equal to poly-size circuits
P/poly:
deterministic turing machine with 3 tapes: input, work, advice
one infinite advice string, independent of input string
running time is poly(input length)

P/poly = nonuniform polynomial size circuits
Circuits subset P/poly: the sequence of circuits is the advice string
P/poly subset circuits: simulate a ptime machine by polynomial-size circuit
the same way as in prove of Cook's theorem (direct SAT NP-completeness)


## Define RP, BPP, PP
regardless of coin flips, runs in polynomial time!

RP (randomized polynomial time)
for w in L: prob > 1/2
else: prob = 0

We have a turing machine with:
- two-way read-only input tape
- one-way read-only witness tape over alphaber {head, tail}
- read-write work tape
There is polynomial p such that:
- for every input v and witness w, time of M(v, w) < p(|v|)
- for every v not in L, for every w M(v, w) rejects
- for every v in L, Prob over w of M(v, w) accpeting >= 1/2


BPP
for w in L: prob > 1/2
else: prob <= 1/4

run experiment many times. chance of majority vote not being successful?

Sum, i=1 .. n of (2n choose i) p^i (1-p)^{2n - i}
<=
(4p(1-p)) ^ n

PP (probabilistic polynomial time)
for w in L: prob > 1/2
else: prob <= 1/2


## RP algorithm for evaluating straight line programs
straight line programs over integers:
x = 1
y = 0
x = y + x
x = x * x
out = z - x
question: out neq 0?

in a program of length n, the numbers might use 2^{n-1} bits
randomly choose natural number p with 2n bits, evaluate the program mod p
all experiments have value 0 => say ,,zero'', otherwise say ,,nonzero''

one experiment: one choice of p with 2n bits. successful with prob > 1/n
the prime number theorem says that for large n, the number of primes
with 2n bits is at least
0.9 * 2^{2n} / log(2^ {2n}) >= 1.495 2^{2n}/n

pi ~ n / log n

at most 2^n of these primes divide out
for large n, the probability in the claim is >= 1/n

therefore, assuming r neq 0, probability
that n experiments are unsuccessful is at most
(1-1/n)^n -> 1/e


## RP algorithm for polynomial identity testing
we are given a straight-line progrma with uninitialized variables
it represents a polynomial. is it nonzero?

algo: randomly choose for each variable a random n+1-bit number.
evaluate the program using the above algorithm.
if the program is nonzero, answer will be nonzero with prob >= 1/2

degree of polynomial <= 2^n, and we have 2^{n+1} samples
Lemma (schwarz zippel):
for nonzero polynomial (Px1, x2, .., xm) over the integers
for every set S of integers
prob for (x1, x2, .., xm) in S^m of P(x1, x2, .., xm) = 0 <= (deg of P)/|S|

## Derandomized algorithm for max-cut a)
A cut of size k is partition of vertices to two parts so that
there are k edges between the parts

For every vertex, we toss a coin to decide which partition it will be in
We get a tree of tosses
What is the expected value for the cut size in a vertex of the tree?
type A: edge will surely be cut, knowing the tosses currently
type C: edge may or may not be cut
number of edges of type A + half the # edges of type C
start in the root, each time move to a child with best expected value
no tosses! root is empty labeling (epsilon)

Value of next cut is value of current cut +
if we decide to toss 0 for v_i+1, # edges from v_i+1 to A
if we decide to toss 1 for v_i+1, # edges from v_i+1 to B


## Derandomized algorithm for max-cut b)


## Adleman
let L be in BPP and M(x, r) be poly-time algorithm deciding L with
error <= 1/3 (where x: input, r: random bits)

construct machine M'(x,R), which runs M 48n times and takes majority vote
of the results (n: input length, R: 48n independently random rs)
M' polynomial time, error probability <= 1/e^n (Chernoff)

let's fix R so that the algorithm is deterministic.
Forall x, Probability of R making M' give the wrong result <= 1/e^n

Input size is n, so there are 2^n inputs
Probability that Exists x such that R gives ba result <= 2^n / e^n < 1
Therefore, there must exists R that is good for all x.
Take that R as advice string in P/poly algorithm


## SETH => OVC
SETH: for every 0 < lambda < 1, exists k such that
k-CNF-SAT requires time 2^{lambda * (number of variables)}
split the variables into 2 parts
make 2 lists of vectors:
a) for each valuation of first variables, 0 if clause true in it, 1 else
b) same for second variables
The formula is true under the combined valuation iff
the two vectors are orthogonal (at least one is 0 (=true))
dimension: number of clauses
length of each list: 2^{n/2} = sqrt(2^n)
OVC false => solve the instance in time (2^{n/2})^{2-eps} * poly(# clauses)
which is fatser than 2^{(1-eps)n}


## OVC => NFA evaluation is quadratic
Given NFA and input word. Does it accept the word?
Naive: running time (size of nfa) * (length of word)
We cant make it faster than (size of nfa + length of word) ^ {2 - eps}

word represents a list of vectors: #01010#11100#10101
Automaton representing W:
disjoint sum of automatons for every word from W
automaton for single word: accepting the language ,,lists of vectors
containing at least one vector orthogonal to v''

vector:                 1    0    1    0     0
automaton:  (0,1,#)\* # (0) (0,1) (0) (0,1) (0,1) # (0,1,#)\*

## Show that vertex cover is in FPT
FPT: class of problems, for which an algorithm with running time of the form f(k)p(n) exists, where f is a computable function, p is polynomial, n size of input and k - parameter, which is a part of the input.

vertex-cover: given graph G, a vertex cover is subset of vertices such that
for every edge (u, v) at least one of u, v is in the cover.

VertexCover(G, k):
- if G has no edges, return true
- if k=0, return false
- apply while possible:
  - if a vertex has at least one 'no' neighbor: set it to 'yes'
  - if has only 'yes' neighbors: set it to 'no'
- now exists vertex without 'no' neighbors and at least one '?'
  - G': v set to 'yes'
  - VertexCover(G', k - 1)
  - G'': v set to 'no', all '?' neighbors set to 'yes'
  - VertexCover(G'', k - 1)

2 branches of recursion, depth k; 2^k calls overall
time: 2^k * (number of edges)
## FPT-reduction from k-clique to nondet TM acceptance in k steps
FPT reduction: FPT-time computable; output parameter does not
depend on instance! only on input parameter

Input: graph G, integer k
Output: does it contain clique of size k?

create machine M and integer k' = O(k^2) such that M halts in k'
steps iff G has clique of size k

alphabet of M is set of vertices of G
in the first k steps, M nondet writes k vertices to first k cells
for every 1 <= i <= k, M moves to i cell, stores vertex in internal state,
goes through the tape to check that every other vertex is adjacent with it
M does k check and each check can be done in 2k steps => k' = O(k^2)

## FPT-reduction from TM short acceptance to k-clique
Input: nondeterministic machine M, integer k
Output: does it have an accepting computation of length k?

will reduce to INDEPENDENT SET!

computation of length k visualized as k x k grid
accepting computation is a clique of size (k - 2) * (k - 1)
inside a graph of size poly(M, k)

vertex selected from clique K_i,j describes the situation before
step i at cell j: what is written there, is the head there,
and if so, what the state is, and what the next transtition is

add edges between cliques to rule out inconsistencies:
head is at more  than one location, wrong character is written,
head moves in wrong direction, etc.

