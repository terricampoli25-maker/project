# Habit Tracker
#### Video Demo: <URL HERE>
#### Description:

## What is it?
Habit Tracker is a web-based Progressive Web App (PWA) built with HTML, CSS, and JavaScript that lets you track your daily habits across an entire month. Each habit gets its own row in a table, and each day of the month gets its own clickable button. Click the button to mark that day as complete, and click it again to unmark it. A smaller "memo" button sits below each day button, which opens a popup window where you can jot a personal note for that specific day and habit. The app is installable directly from the browser onto your desktop or mobile device, and works fully offline once installed.

## Why I Built It
Before taking CS50, I kept a hand-drawn habit tracker. Every single month I would sit down and draw a grid on paper, then color in the squares by hand to track my habits day by day. It worked, but drawing that grid every month was tedious and time consuming. I wanted a digital version that looked and felt just like the one I draw by hand — same grid layout, same idea of filling in squares, but without the hassle of redrawing it every month.

This project gave me the opportunity to finally build that tool for myself. The goal was always to make something I would actually use, not just something built to satisfy an assignment. The fact that it solves a real problem I had every month made it a natural fit for a CS50 final project.

## Design Decisions
The design was intentionally built to mirror my hand-drawn tracker as closely as possible. The color scheme — dark navy blue and black — was chosen to feel bold and clean while being easy on the eyes during daily use. Each habit cell contains two buttons stacked vertically: a large habit button that turns blue when clicked to indicate completion, and a smaller memo button below it that also turns blue when a note has been written for that day.

One of the key design decisions was how to handle the memo feature. Rather than adding a separate notes column that would take up a lot of horizontal space, I chose to put a small memo button inside each day cell. This keeps the grid compact and clean while still giving full access to notes for every single day. Clicking the memo button opens a modal popup with a text area, which felt like the most natural and unobtrusive way to handle note-taking without cluttering the main view.

Another decision was how to sort habits. Rather than leaving them in the order they were added, habits are automatically sorted by completion frequency — the most completed habits rise to the top. Alphabetical ordering is used as a tiebreaker when two habits have the same number of completions. This felt more useful than a static order because it naturally highlights your most consistent habits over time.

The decision to build this as a Progressive Web App (PWA) means users can install it directly from their browser onto their desktop or mobile device without needing an app store. It also enables the app to work fully offline, which is important for a daily habit tracker — you should be able to use it even without an internet connection.

## Features
- Add and delete habits at any time
- Click any day button to mark it complete — click again to unmark it
- Memo popup for each individual day to add personal notes
- Habits automatically sorted by completion frequency, then alphabetically
- Month navigation arrows to move forward and backward through any month and year
- Confetti burst animation when you successfully complete a habit
- Sound effects — an encouraging chime plays when you check a habit off, and a humorous sound plays when you uncheck one
- All habit data and notes saved automatically via localStorage, persisting between sessions
- Installable as a PWA on desktop and mobile devices
- Works fully offline once installed
- Deployed and accessible via GitHub Pages

## Files
- `habit_tracker_new.html` — the main HTML file that structures the entire application, including the sticky header with month navigation, the habit table, the modal popup, and the audio elements for sound effects
- `app_new.js` — contains all of the application logic, including rendering the monthly table, adding and deleting habits, toggling completion states, saving and loading data from localStorage, handling the memo modal, and running the confetti and sound effect animations
- `style_new_v2.css` — contains all styling for the application, including the sticky navigation header, table layout, day cell buttons, modal popup styling, and confetti container
- `manifest.json` — the PWA manifest file that defines the app name, icons, colors, and display settings, allowing the app to be installed on desktop and mobile devices
- `service-worker.js` — the service worker that caches the app's files so it works fully offline after the first visit
- `chime.mp3` — the sound effect played when a habit is successfully checked off
- `uncheck.mp3` — the sound effect played when a previously checked habit is unchecked

## How to Run It
The app is hosted on GitHub Pages and can be accessed directly in any modern browser at the project URL. It can also be installed as a PWA by clicking the install prompt in the browser address bar. To run it locally, open the project folder in VS Code and use the Live Server extension to serve the files.

## AI Usage
This project was developed with assistance from Claude (Anthropic) for debugging, code corrections, and implementation of the PWA features. Particularly for fixing table rendering issues, modal popup functionality, and setting up the service worker and manifest files. All design decisions, feature ideas, the overall concept, and project direction were my own. AI was used as a helper and debugging tool, not as a replacement for my own work and thinking.

*Built with HTML, CSS, and JavaScript. CS50x Final Project 2026 — Terri Campoli*