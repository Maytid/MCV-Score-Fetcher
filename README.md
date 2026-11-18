# MCV Score Fetcher

A Chrome extension that fetches scores for all courses within the current semester via MyCourseVille.

Instead of manually going through each course's portfolio, this extension fetches the grades in the background and displays all of them at once.

## Features
* Automatically pulls scores for all currently enrolled courses in the current semester.
* Everything is done locally. No data is sent to external servers.

## Installation
Since this extension is not available on the Chrome Web Store, you can install it manually in developer mode:

1. Download this repository as a `.zip` file and extract it, or clone it via git:
   `git clone https://github.com/Maytid/mcv-score-fetcher.git`
2. Open Chrome and go to `chrome://extensions/`.
3. Turn on **Developer mode** in the top right.
4. Click the **Load unpacked** button in the top left.
5. Select the extracted folder containing the `manifest.json` file.

## Usage
1. Log in and open the ["My courses"](https://www.mycourseville.com/) page.
3. Open the extension and click **Get Scores**.

## Privacy
This extension requires permission to read the MyCourseVille DOM to find your Student ID and fetch portfolio iframes. It does not store, send, or collect any personal data other than saving your current list of scores locally to your browser's Chrome Storage for display purposes.

## Disclaimer
**This is an unofficial, third-party extension.** It is not affiliated with, maintained, authorized, or endorsed by MyCourseVille or Chulalongkorn University. Use at your own discretion.

## License
Copyright (C) 2026 Maytid. 
Licensed under the [GNU GPLv3](./LICENSE).