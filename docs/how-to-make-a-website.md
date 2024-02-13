---
title: How to create a personal website
---

## Motivation
Setting up a website was always terra incognita for me. I knew nothing about front-end development, had no skill at all in UI design. I didn't want to use ready to use websites like Wordpress due to its questionable opinion. Also, in terms of hosting - if I were to host a website, I wanted to use Google Cloud, but I didn't really know how to approach this so that I don't end up with 100.000$ of debt due to some misconfiguration.

## Solution
- To start with something simple, we will create a static website on GitHub Pages
- If we were to need something more - Firebase will probably be the way to go for a dynamic website
- We will not use any access control, as for February 2024, it requires a GitHub Enterprise access, which we have not
- For access control, we will be able to store encrypted content publicly available on GitHub and ask the user for a password to decrypt it - probably consisting of some control questions
- We will not write HTML by ourselves. We will use the recommended approach, which is using Jekyll with GitHub to generate static websites.
- First, review all the different Jekyll themes available by default
- I like `midnight` and `minima`
- Install jekyll locally: https://jekyllrb.com/docs/installation/ubuntu/
