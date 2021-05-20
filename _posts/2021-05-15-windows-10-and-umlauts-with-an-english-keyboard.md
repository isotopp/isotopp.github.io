---
layout: post
title:  'Windows 10 and Umlauts with an english keyboard'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: 2021-05-15 17:50:46 +0200
tags:
- lang_en
- windows
---

I never wrote this up, and the information online is all referring to older versions of Windows, so let's fix this.

1. The MS-DOS version of getting Umlauts on a US keyboard is to type the ASCII codes. As I can't and won't remember these codes, this won't work for me.
2. There is a deadkey way to get a "US (International Keyboard)". On these, you type Double Quotes `"`, and then the letter that should form the Umlaut, for example `o`, for an `ö`. This works well for me.

On older versions of Windows, you would start the old control panel and then go to "Clock, Language and Region", and then set up things from there:

![](/uploads/2021/05/settings00.png)

*The old control panel. Current Windows 10 still has the old control panel, but no longer has language options in it.*

This does no longer work, because while current Windows 10 still has the old control panel, language options are no longer part of it.

Instead, the new Windows 10 settings are required. Start them (Windows+I), and choose "Time and Language".

![](/uploads/2021/05/settings01.jpg)

*Windows+I will bring up the settings*

In "Time and Language", select the Tab "Language", make sure "English (United States)" is selected in "Preferred Languages", and click "Options".

![](/uploads/2021/05/settings02.jpg)

*Select "English (United States)" in "Preferred Languages" to make the "Options" button visible. Click that button.*

In "Language Options: English (United States)", click on "[+] Add a keyboard". A list of keyboard layouts pops up. Choose the "United States - International (QWERTY)" keyboard.

It will be added to the list of available keyboard layouts.

If you wish, click on the "US (QWERTY)" keyboard, and click "Remove".

![](/uploads/2021/05/settings03.jpg)

*After hitting "[+] Add a keyboard", choose "United States - International (QWERTY)"*

The finished selection should look like this:

![](/uploads/2021/05/settings04.jpg)

*The keyboard layout chosen is "United States - International (QWERTY)".*

Umlauts can now be entered by using typing `"` followed by the required vowel (for example `o` for an `ö`). You can still use all the nice brackets, braces and parentheses for programming directly, without additional finger breaking modifiers.
