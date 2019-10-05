---
layout: post
status: publish
published: true
title: Fraunhofer does Password Managers
author: isotopp
author_login: kris
author_email: kristian.koehntopp@gmail.com
wordpress_id: 887
wordpress_url: http://blog.koehntopp.info/?p=887
date: '2017-02-28 20:15:08 +0100'
date_gmt: '2017-02-28 19:15:08 +0100'
categories:
- Hackerterrorcybercyber
tags: []
---
<p>In their article [Password-Manager Apps](https://team-sik.org/trent_portfolio/password-manager-apps/), the [Fraunhofer TeamSIK](https://team-sik.org/#about) (Security Is Key) had a look at a number of password manager applications, and found a number of vulnerabilities. For 1Password, which I am using, the following things were found in their Android App:<!--more--></p>
<p>- [Subdomain Password Leakage](https://team-sik.org/sik-2016-038/): The password manager does not distinguish between subdomains of the same 2nd level domain. So for domain1.password.org and domain2.password.org the same passwords are offered (and filled in). This is not a problem in the way I am using 1Password on the Desktop (it's not filling things in unasked, and it does not hit return), and even less so on Android.<br />
- [https downgrade to http](https://team-sik.org/sik-2016-039/): In the internal browser the default scheme is set to http. This is not a problem the way I am using 1Password on the Desktop (I do not use 1Password to navigate), and even less so on Android.<br />
- [Titles and URLs Not Encrypted in 1Password Database](https://team-sik.org/sik-2016-040/):&nbsp;In the database of the password manager, the titles and URLs of website entries are not encrypted. The article does not clarify if that affects Dropbox stored keychains, and if so which of the two formats. See also [How to switch to the OPVault format from Agile Keychain](https://support.1password.com/switch-to-opvault/), which addresses a similar, but different earlier problem on the Desktop versions of 1Password.<br />
- [Read Private Data From App Folder in 1Password Manager](https://team-sik.org/sik-2016-041/): The built-in web browser allows files from the app’s private data directory to be extracted. This also allows access to the database file and the file containing the app’s shared preferences. Only a problem if you are using the internal browser (which I don't).<br />
- [Privacy Issue, Information leaked to Vendor](https://team-sik.org/sik-2016-042/):&nbsp;When the user creates a new entry containing credentials for a website, the respective target domain is leaked to the vendors’ web server. 1Password downloads an Icon. That can be disabled (on the Desktop Version, at least).<br />
 All in all nothing earth shattering, and nothing in it that would have compromised passwords in the way I am using it.</p>
