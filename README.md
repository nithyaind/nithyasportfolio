# Nithya Sunkara Indlamuri — Portfolio
## Setup Guide & Content Checklist

---

## File Structure

```
/
├── index.html          ← Home page
├── work.html           ← Featured work list
├── archive.html        ← Archival projects grid
├── nijam.html          ← Newspaper / blog page (Nithya నిజము [Nijam])
├── about.html          ← About me page
│
├── work/
│   ├── project-one.html    ← Individual case study (create per project)
│   └── ...
│
├── nijam/
│   ├── post-one.html       ← Individual blog post (create per post)
│   └── ...
│
├── css/
│   ├── tokens.css      ← Brand tokens, nav, footer, cursor, animations
│   ├── home.css        ← Home page styles
│   ├── nijam.css       ← Newspaper page styles
│   └── pages.css       ← Work, archive, about styles
│
├── js/
│   └── main.js         ← Cursor, scroll reveal, hover preview, filters, count-up
│
└── assets/
    └── images/
        ├── og-image.jpg          ← 1200×630 social share
        ├── about-photo.jpg       ← Portrait of you (3:4 ratio)
        ├── project-1.jpg         ← Work thumbnails
        ├── project-2.jpg
        ├── project-3.jpg
        ├── nijam-hero.jpg        ← Nijam lead story image
        ├── nijam-post-2.jpg      ← Essay thumbnail
        ├── nijam-proj-1.jpg      ← Project update thumbnail
        ├── nijam-dispatch-1.jpg  ← Dispatch thumbnail
        ├── archive-1.jpg         ← Archive thumbnails
        └── ...
```

---

## Step-by-Step Setup

### Step 1 — Add your images
Every `<img>` tag has a `src` pointing to `assets/images/`.
Drop your photos there. Specs:
- `og-image.jpg` — 1200×630 px
- `about-photo.jpg` — tall portrait, 900×1200 px works well
- Project thumbnails — 1600×1200 px (4:3) for hover previews
- Nijam images — 1200×675 px (16:9) for story images

Compress everything at **squoosh.app** before uploading. Target < 300 KB each.

### Step 2 — Fill in your projects (work.html + index.html)
Find every `.work-row` and `.card` block. Fill in:
- `href` → link to your case study page in `/work/`
- `data-preview` → path to thumbnail
- Project name, type, year
- Status: `status-live`, `status-wip`, or `status-soon`

Update the count-up `data-target` values to match your real project count.

### Step 3 — Add your work to the archive (archive.html)
Copy the `.archive-card` blocks and fill in per project.
Organise by year — add or remove year groups as needed.

### Step 4 — Write your first Nijam posts (nijam.html)
Replace the placeholder headlines, teasers, and dates with your real content.
To add a new post:
1. Create a file in `/nijam/your-post-title.html`
2. Add a `.story-item` block to `nijam.html`
3. Set `data-tag` to: `writing`, `project`, `dispatch`, `art`, or `update`

### Step 5 — Replace your project images (index.html hero section)
The home page shows 3 featured cards. Set each `img src` and `href`.

### Step 6 — Add your social links
All pages have commented-out slots for Instagram, GitHub, Dribbble, etc.
Search for `<!-- REPLACE: add your Instagram` and uncomment/update.

### Step 7 — Customise the ticker (index.html)
The hero ticker lists your disciplines. Edit the `.ticker-item` spans to
reflect what you actually do — keep one set, then duplicate it once for
seamless looping.

### Step 8 — Deploy
Drag the whole folder to:
- **Vercel** (vercel.com) — instant, free, custom domain support
- **Netlify** (netlify.com) — same
- **GitHub Pages** — commit to a repo and enable Pages in Settings

No build step needed. Pure HTML/CSS/JS.

---

## Content You Still Need to Write

### Per project (work.html + case study pages):
- [ ] Project name
- [ ] Project type (Interactive Story / Journalism / Web App / Film / etc.)
- [ ] Year
- [ ] Thumbnail image
- [ ] Status (live / in progress / coming soon)
- [ ] Case study page content (optional but great for portfolios)

### For Nijam (nijam.html):
- [ ] At minimum 3 real post titles and teasers to replace the placeholders
- [ ] At least 1 hero story image (`nijam-hero.jpg`)
- [ ] Real dates for each post

### For Archive (archive.html):
- [ ] List of older/smaller projects you want to document
- [ ] An image for each (can be a screenshot or still)

### Images needed:
- [ ] `og-image.jpg` — make this a bold text card or a great photo
- [ ] `about-photo.jpg` — the most important one. Be yourself.
- [ ] 1 image per featured project (home + work pages)
- [ ] 1 image per archive entry
- [ ] Hero + 2-3 images for Nijam posts

---

## Design Notes

**Palette:**
- `--paper`    #f4f0e8  off-white newsprint
- `--ink`      #1a1a1a  near-black
- `--magenta`  #e8006e  the signature punch
- `--charcoal` #3d3d3d  body text
- `--muted`    #888880  captions, labels

**Typefaces (loaded from Google Fonts):**
- Display: **Playfair Display** — editorial headlines
- Body: **Space Grotesk** — clean, modern UI
- Mono: **Space Mono** — labels, nav, captions

**Signature interactions:**
- Custom magenta cursor that blooms on hover
- Scroll-triggered reveal on all sections
- Hover preview ghost image on work list rows
- Card tilt on mouse move (subtle 3D)
- Ticker pauses on hover
- Count-up animation on stats
- Filter buttons on Nijam page (by tag: writing, project, dispatch, art, update)
- Spinning sticker on About page portrait