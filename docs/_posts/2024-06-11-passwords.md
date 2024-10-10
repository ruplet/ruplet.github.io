---
title: About passwords
---

1. You should not use an easy-to-guess password (such as 1234 or your name)
2. A hard-to-guess password is also often hard to remember
3. You could use pass-phrases [xkcd](https://xkcd.com/936/), but they are still easy to forget
4. You should not rely on remembering one, difficult password - it is a single point of failure in
 case one of the websites you use it at gets hacked and the attackers reveal the password
5. You could have your passwords written down on a piece of paper e.g. in your waller, but it is
 very risky if someone (e.g. a person standing next to you) sees the password while you use it
 (or if your wallet gets lost/stolen!)
6. I am a huge fan of having a solid basis of security questions - questions that you
 can securely write down and even show to other people, because probably only you
 (and maybe a few other people in the world) know the true answer to them
7. A problem with this is brute-force attacks - answers to security questions tend to 
 have little entropy (e.g. if the question is ,,What is the name of a friend who did ...'',
 you can just brute-force through all the common names/traverse your Facebook friends list
 to have a very good chance of guessing the answer)
8. Your password could consist of security questions. So that *the* security question
 would be a list of actual security questions, and the password being the concatenation of them
9. Even just the sheer fact that you use security questions in this way reveals a lot about
 the password; it's difficult to write a security question, the answer to which would contain special characters
10. Why not use special characters explicitly in the security question? The security questions
 have to be stored at least partially secretly (i.e. I wouldn't have enough trust to
 just list the security questions publicly on my GitHub, but if I had enough of these,
 it would not be a critical risk if they actually got exposed), so just use salting!
11. Your password-hints will have the following example format:

reddit.com
username: user
password: \[salt: 1&&KK)$\]\[Name of the friend who in 1998 lent me his bike, first letter capitalized, next letters lowercase\]\[Date of birth of uncle Joe, in format: DDMMYYYY\]


12. The best security questions could also be answered by a very specific group of people you know - e.g. your group of friends
 from a university. You should diversify the knowledge, so that any of your passwords couldn't be guessed
 by a single group who would go malicious, but if you have an accident and lose your memory,
 you should be able to reach to your group and ask them for the answer to your security questions.
 Make sure that it is a thing that they will also remember through their whole life!
13. When you have a *very* solid list of security questions, you could try to make it really permament.
 You could try storing it in a blockchain (e.g. as a description to an Ethereum transaction, or somehow on the Bitcoin blockchain)
 and then tattoo the unique identifier of this transaction

14. You also don't want the answers to the security questions get revealed, as you only have a very limited
 number of such questions in your entire life! You should not use the answers unmodified. There are two options:
15. a) use the hash of the answers. your password would then require a separate device to calculate the hash
16. b) use zero-knowledge proof of knowledge to verify your authenticity
17. c) for something like bank log-in, it's probably secure enough to just use the answers in plaintext. but i wouldn't use
 the actual answers to something like logging-in on an untrusted device with a significant risk of a keylogger
 being active on it
18. d) calculate the hash of the answers, take the binary digest of it, split it to chunks of couple bits,
 and use this chunks as indices to a well-though wordlist (such as Diceware wordlist specifically designed for
 passphrase creation). you would need a program which would calculate that and show you the actual password
 calculated, you could also make the (not really) unsecure decision of writing this password (the salt + 
 words form the wordlist after hash calculation) down on a, again, piece of paper. if someone steals your
 wallet, they can obtain the password - but this is *the* diceword passphrase you could actually remember.
 then you don't have to carry it physically, but if you happen to forget it - you lose nothing. it would
 just require you to re-calculate it from the security questions, which you *remember*.

19. on keyloggers: what about Intel Management Engine?
https://www.ptsecurity.com/ww-en/analytics/disabling-intel-me-11-via-undocumented-mode/
https://github.com/ptresearch/unME11
https://github.com/chip-red-pill/IntelTXE-PoC
https://puri.sm/learn/intel-me/

20. if you want to use a physical dice to get entropy, you should verify that
the distribution it has is actually uniform. how to do it?
Najpierw testujemy statystycznie kostkę  
Odpalamy multinomial test, chi-squared test  
https://en.wikipedia.org/wiki/Multinomial_test  
https://en.wikipedia.org/wiki/Pearson%27s_chi-squared_test  
są też standardowe testy NIST do testowania pseudo-losowych generatorów:  
https://csrc.nist.gov/Projects/random-bit-generation/Documentation-and-Software  

21. you should have some certainty in the entropy of your passwords.
to find, entropy, you have to think about what does the knowledge of the security question
reveal about the answer?  
First, we choose the categories of prompts, calculating their entropy, e.g., popular nicknames or surnames. There are approximately 700,000 surnames in Poland.

Example:
"What is the surname of our friend who jumped into the river in March 2022?"
A few people know the answer to this question, but no one else does.

Warning: Reviewing friends on Facebook reduces the surname entropy to about 1,000 combinations.
Warning: Using a birth date is also susceptible to this.

NIST recommends that an RSA key should have 2048 bits; you can safely use even 4096 bits, but for a password, 64 bits are sufficient.

A very good assumption about passwords is that they are mostly letters [a-z]. Taking this as a lower bound for entropy and assuming that most words used are pronounceable, we can model words using alternating consonants and vowels.

So practically, the lower bound for entropy is that each letter gives us log2(13) bits of entropy. Assuming, for example, that each answer is 4 letters, ceil(64 / log2(13^4)) = 5, meaning the password would need to consist of 5 security questions.

22. Further links:
https://nordvpn.com/pl/blog/security-questions/
https://diceware.dmuth.org/

23. On zero-knowledge proof of password knowledge: part of my e-mail to prof. Dziembowski

 Konkretniej, od długiego już czasu próbuję opracować pewien ,,idealny'' system układania haseł. Aktualnie myślę o czymś takim:
- dzielimy naszych znajomych** na spójne składowe*** - grupa przyjaciół z liceum, grupa współpracowników, rodzina itd.
- znajdujemy pytania, na które większość tej grupy doskonale zna odpowiedź, ale raczej nikt poza nią, np. pytanie o pseudonim, którym nazywaliśmy jakiegoś znajomego jest raczej sensownym pytaniem do grupy przyjaciół z liceum (nazwisko już gorzej - można zmniejszyć entropię przeszukując znajomych na Facebooku)
- naszym hasłem do credential vaulta jest konkatenacja odpowiedzi na pytania kontrolne. podpowiedzią do hasła są dokładnie pytania kontrolne + opis czy z dużej litery czy z małej itd.
- teraz kluczowa część: do credential vaulta autentyfikujemy się poprzez Zero Knowledge proof na znajomość hasła. Serwer autentyfikacji nigdy nie poznaje odpowiedzi na nasze pytania kontrolne (które już teraz są cenne, bo są naszymi prywatnymi sekretami, których w życiu mamy skończoną liczbę).
- credential vault trzyma już bazę normalnego menadżera haseł, który do każdego mniej krytycznego serwisu generuje nam długie, trudne hasło

Natomiast całkowicie nie wiem, czy np. ten ZKP jest w ogóle możliwy, a jeśli tak - jak uściślić wymagania i przeprowadzić dowód. Z tego co znalazłem, IEEE P1363.2 definiuje pojęcie Zero-knowledge password proof, nie udało mi się jednak znaleźć sensownej implementacji tego, albo chociaż algorytmu dowodzenia. Zapotrzebowanie na coś takiego pewnie by było - w szczególności, ja bym *bardzo* chciał tego używać dla siebie.
** - albo inne instytucje, które w jak najdłuższym horyzoncie będą w porządny sposób przechowywać jakieś niepubliczne informacje. Może bank musi trzymać o nas jakieś informacje w taki sposób, że zawsze możemy się zgłosić a on nam jej udzielić? Chodzi o to, żebyśmy byli zabezpieczeni nawet na taką sytuację, że w wypadku np. stracimy całą pamięć - wtedy dalej musimy móc odzyskać nasze hasła.
*** - najłatwiej pewnie ułożyć graf typu gwiazda z nami w środku, żeby poszczególne spójne składowe nie mogły się dogadać, by bez nas odtworzyć nasze hasło. Do tego dochodzi jakieś dzielenie sekretów (że 3 grupy mogą odtworzyć, ale 2 już nie) itd.

24. On zero-knowledge proof of password knowledge 2: part of my another e-mail to prof. Dziembowski
Wczoraj udało mi się natrafić na coś więcej: metody Password-authenticated Key Agreement. Początkowo natrafiłem na SRP i dowiedziałem się, że protokół jest już częściwo zaimplementowany w OpenSSL. Potem jednak znalazłem sporo krytyki tego protokołu, co doprowadziło mnie chyba do obecnego state-of-the-art: OPAQUE[1], który robi dokładnie to czego potrzebuję (logowanie hasłem, bez ujawniania hasła serwerowi, nawet podczas rejestracji). Ponadto, Cloudflare się tym zainteresował kilka lat temu i nawet napisał fajne demo:
https://opaque-full.research.cloudflare.com/
(ich implementacja OPAQUE też jest dostępna na GitHubie)
Ale generalnie cała koncepcja wydaje mi się bardzo przyszłościowa - jeśli byśmy mieli serwis z logowaniem po OPAQUE, który mógłby nas autentykować przez OAuth do pozostałych serwisów, to byłoby całkiem rewolucyjne w kwestii haseł - na ten moment to jeszcze nie istnieje. (Cloudflare to zrobił, ale wygląda na to że nie pociągnął tego pomysłu dalej. Zresztą ,,there is never nothing new in research'').

25. On blockchain storage
https://ethereum.stackexchange.com/questions/872/what-is-the-cost-to-store-1kb-10kb-100kb-worth-of-data-into-the-ethereum-block?rq=1
https://www.reddit.com/r/ethereum/comments/6qijeq/boobies_on_the_blockchain_a_practical_experiment/

https://ethereum.stackexchange.com/questions/7884/how-can-i-store-data-in-ethereum-blockchain



26. Jak sprawiedliwie rzucic niesprawiedliwa moneta (kostka)?
27. Randomness extractors
28. https://crypto.stackexchange.com/questions/42147/dice-rolls-as-entropy-source
29. what is the optimal entropy gain (in number of bits) per a single dice roll in these 2 proposed
 randomness extractors from dice? minimax? method which gives best randomness extraction when
 given the least random dice?

