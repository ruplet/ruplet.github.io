---
title:
- Oracle-oriented programming
author:
- Paweł Balawender
theme:
- Warsaw
date:
- March 18, 2024

---

# What's it about?
- One year ago, I was tasked with implementing an interpreter for a programming language
- I could define the programming language by myself
- But what features does it make sense to add to a programming language?
- What primitives, inexpressible in the language itself, should it contain?
- What should be the type system of it? Or should it be untyped?

# Digression: Theorems for free
- if a function has a polymorphic type, there are theorems which it has to trivialy satisfy
- e.g. a function f: Forall X, [X] -> [X], i.e. a function which for any type X, takes a
  list of X and returns a list of X, cannot really ,,look'' at the specific values 
  present in the list. it can only rearrange such lists.
- parametric polymorphism: ,,one function body, independent of the input type''
- contrasted with ad-hoc polymorphism, such as polymorphism in C++ (there may be
  many functions, behaving totally different, depending on the input type)
- assuming parametric polymorphism, there are not many functions of the type Forall X, X -> X.
  indeed, there is only one: the identity function
- cite: 10.1145/99370.99404

# The strongest case: utilizing theorems for free
- in a language weak enough, for a function with a type general enough, many
  useful theorems can be derived automatically
- sometimes it implies that there is only one function satisfying our conditions
- by building on Wadler's work, we could gain advantage in proving the
  behaviour of a function (i.e. what it really returns)

# Strong case: minimization; simple programs are simple
- for programs simple enough, such as representing a DFA, a minimization is possible
- that's the ultimate case of compiler optimization - we're guaranteed
  that a single minimal automaton exists which computes our function {0,1}\* -> Bool
- for the more general case of finite-state transducers, we can't always minimize
- example programming language for FST: cite [10.1007/11780885_38]
- FST minimization sometimes possible cite [18919]
- two-way transducers are stronger that one-way transducers (they are equivalent to mso-transductions of strings): cite [filiot2013twoway]
- but two-way automata are equal to one-way automata: 
- nondeterministic FST are closed under composition: https://cseweb.ucsd.edu/classes/wi14/cse105-a/LecFST.pdf

# Main case: resource utilization guarantees
- main focus of my work
- we don't want to read proofs that some program terminates in polynomial time
- we want it guaranteed by the design of the programming language
- if you only use loops of the form ,,for i=1 to n'', with n known
  before the loop and not modifying i nor n explicitly in the loop,
  every program will terminate in polynomial time, trivially
- very difficult to write programs in this form; not practical
- this is primitive recursion. Ackermann function not possible to implement
- Grzegorczyk hierarchy provides a nice classification of these functions,
  but not much known about how it relates to Turing machines-defined computational classes

# Weakest case: program termination
- almost all programs should terminate, really
- special case: implementing a HTTP server
- in Agda, programs need to be total:
- recursive programs must termiante
- for corecursive programs, any finite observation needs to return an answer in a finite time
(https://stackoverflow.com/a/52793218)

# What's the deal with weak programming languages?
- 
# Computational power as an effect
- in Haskell, some side effects of a computation (such as interaction with the operating system) are
  modeled as monads
- you cannot write a function f: Int -> Int, which prints something on the screen
- for this, you would need to have a function f: Int -> IO Int
- let's say a standard function of our language can be thought of
  as a fnite state transducer (finite automaton with output)
- let's say we can wrap an additional possibility of it to write something
  to a work tape in a monad. so a function of type f: Int -> WrkTp Int
  would take an int on input, return an int and also be able to
  utilize a special work memory for computation
