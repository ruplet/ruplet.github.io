---
title: How to create a personal website
---

# Motivation
Setting up a website was always terra incognita for me. I knew nothing about front-end development, had no skill at all in UI design. I didn't want to use ready to use websites like Wordpress due to its questionable opinion. Also, in terms of hosting - if I were to host a website, I would use Google Cloud, but I didn't really know how to approach this so that I don't end up with $100.000 of debt due to some misconfiguration.

# Solution
- To start with something simple, we will create a static website on GitHub Pages
- If we were to need something more - Firebase will probably be the way to go for a dynamic website
- We will not use any access control, as of February 2024, it requires a GitHub Enterprise access, which we have not
- For access control, we will be able to store encrypted content publicly available on GitHub and ask the user for a password to decrypt it
- We will not write HTML by ourselves. We will use the recommended approach, which is using Jekyll with GitHub to generate static websites.
- First, review all the different Jekyll themes available by default
- I like `midnight` and `minima`
- Optionally, install jekyll locally: https://jekyllrb.com/docs/installation/ubuntu/
- For comments, we will use GitHub Discussions-based commenting engine, `giscus`. There are alternatives,
 such as: officially Jekyll-supported `disqus`, which is paid, and is not cheap; `Facebook comments` - facebook sucks; `utterances` - very cool! `giscus` is based on `utterances`, but I like the idea to use GitHub Discussions
 instead of GitHub Issues as `utterances` do. I modified the `_layouts/post.html` file, after downloading it from
 Jekyll `minima` theme's GitHub repository to include the `giscus`' HTML tag, as suggested on Reddit (there is a link to the specific comment in the `_layouts/post.html` file) - it seems to work flawlessly!
 - As for setting up the domain, I used Namecheap and used GitHub Pages' official instructions on how to specifically
 integrate it with a custom domain; e.g. what records (mostly TXT records) to set up at the domain registrar's site,
 what to issue in GitHub settings.
 - I also configured an e-mail account - I followed iCloud Plus' official instructions on how to set up
 e-mail with a custom domain. As of now, it also seem to work flawlessy. iCloud Plus is a paid subscription, but very cheap as I'm writing this (about 1 USD per month for me) and allows me to view and send my e-mails
 from a web client and from the mobile official iOS Mail application.
