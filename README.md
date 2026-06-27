# nithyasportfolio# Portfolio — Setup Guide

## File Structure

```
portfolio/
├── index.html          ← Home page
├── work.html           ← Work index page
├── about.html          ← (create this yourself or ask for code)
├── work/
│   ├── project-one.html
│   ├── project-two.html
│   └── ...             ← one file per case study
├── css/
│   ├── styles.css      ← shared tokens, nav, footer, animations
│   ├── home.css        ← hero, featured grid, about section
│   └── work.css        ← work hero, project list, philosophy
├── js/
│   └── main.js         ← scroll reveal, hover preview, count-up
└── assets/
    ├── images/
    │   ├── og-image.jpg          ← 1200×630 social share image
    │   ├── about-photo.jpg       ← portrait / workspace (portrait ratio)
    │   ├── project-1.jpg         ← featured project thumbnail
    │   ├── project-2.jpg
    │   └── ...
    └── fonts/                    ← optional self-hosted fonts
```

---

## Step-by-Step Setup

### Step 1 — Replace your identity
Search the HTML files for `YOUR NAME`, `YOUR INITIALS`, `YOUR TITLE` etc.
and swap in your real details. Every placeholder is `UPPERCASE` or wrapped
in a comment starting with `<!-- REPLACE`.

### Step 2 — Add your images
Drop images into `assets/images/`. Recommended specs:
- **og-image.jpg** — 1200 × 630 px (social share)
- **about-photo.jpg** — 900 × 1200 px (3:4 portrait)
- **project-N.jpg** — 1600 × 1200 px (4:3 landscape, used as card + hover preview)
- Keep files under 300 KB each — compress at squoosh.app

### Step 3 — Add your projects
In `work.html`, copy the `.work-item` block and fill in:
- `href` → path to your case study page
- `data-preview` → thumbnail path
- Project name, type (Mobile App / Responsive Web / Brand Identity …), year

In `index.html`, update the `.project-card` blocks similarly (2–4 featured ones).

### Step 4 — Update your stats
In `work.html` find the three `.work-stat` divs and update `data-target`
to your real numbers (projects, industries, years of experience).
The JS will animate them counting up when they scroll into view.

### Step 5 — Customise typefaces (optional)
The default stack uses Google Fonts:
- Display: **DM Serif Display** (elegant, editorial)
- Mono: **Space Mono** (for labels, nav, metadata)
- Body: **DM Sans** (clean, readable)

To change, update the `<link>` in both HTML files and the `:root` variables
at the top of each `<style>` block.

### Step 6 — Add social links
In both `index.html` and `work.html`, find the footer and replace
`YOUR@EMAIL.COM`, `YOUR-HANDLE` with real links.

### Step 7 — Add Spotify (optional)
Uncomment the `<iframe>` block in the footer of each page.
Replace `YOUR_TRACK_ID` with a Spotify track ID:
→ Open Spotify → right-click any song → Share → Copy embed code → grab the ID.

### Step 8 — Optional video backgrounds
Both pages have commented-out `<video>` blocks for ambient background clips.
If you have a showreel or product walkthrough clip:
- Export as `.mp4`, H.264, 1280×720 max, ideally under 5 MB
- Set `src` to `assets/YOUR_FILE.mp4`
- Uncomment the block

### Step 9 — Deploy
- **Quick**: Drag the entire `portfolio/` folder to Vercel, Netlify, or GitHub Pages
- The site is static HTML — no build step needed
- Point your custom domain in your host's dashboard

---

## Content Checklist — What You Need to Prepare

### Identity
- [ ] Full name (first + last shown separately in hero)
- [ ] Your initials for the nav logo
- [ ] Current role + company name
- [ ] City / location
- [ ] Short bio (2–3 sentences, for the about section on home page)
- [ ] Design philosophy / belief statement (1–2 lines, shown on work page)

### Images
- [ ] `og-image.jpg` — social share preview
- [ ] `about-photo.jpg` — portrait of you OR an atmospheric workspace photo
- [ ] 1 thumbnail per project (`project-1.jpg`, `project-2.jpg` …)

### Projects (for each)
- [ ] Project name
- [ ] Project type (Mobile App / Responsive Web / Brand Identity / etc.)
- [ ] Year completed
- [ ] Thumbnail image
- [ ] Link to a case study page (or `#` as placeholder while you build it)

### Contact / Social
- [ ] Email address
- [ ] LinkedIn URL
- [ ] Instagram / Dribbble / GitHub / Behance URL(s)

### Optional extras
- [ ] Spotify track ID (currently playing embed)
- [ ] A short looping video clip for the hero background
- [ ] Favicon (`favicon.ico` or `favicon.svg` in the root)

---

## Customisation Quick Reference

| What to change          | Where                                          |
|-------------------------|------------------------------------------------|
| Colour palette          | `css/styles.css` → `:root` variables           |
| Typefaces               | `<link>` in `<head>` + `:root` font variables  |
| Nav links               | Both HTML files → `<ul class="nav-links">`      |
| Hero headline           | `index.html` → `.hero-name .first` / `.last`   |
| Tagline text            | `index.html` → `.hero-tagline-text`            |
| Skills ticker items     | `index.html` → `.ticker-item` elements         |
| Projects on home        | `index.html` → `.project-card` blocks          |
| Projects on work page   | `work.html` → `.work-item` blocks              |
| Stats (counts)          | `work.html` → `data-target` attributes         |
| Footer social links     | Both HTML files → `footer .footer-links`       |