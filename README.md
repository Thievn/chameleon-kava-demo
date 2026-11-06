# Chameleon Kava Lounge — pitch demo

Temporary public concept for Dean to share while pitching a real website to the owner of **Chameleon Kava Lounge** in Cocoa, Florida.

This is not the lounge’s live website. The page is marked `noindex` so it does not compete with the business in search.

**Expected URL:** https://thievn.github.io/chameleon-kava-demo/

## Turn on GitHub Pages

1. Open this repo on GitHub → **Settings** → **Pages**.
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
3. Branch: **main**. Folder: **/ (root)**. Save.
4. Wait until the Pages deployment finishes. The site is served from the URL above.

The repo has to be public unless the GitHub plan includes Pages for private repositories.

## Take it down

When the pitch is over, do any one of these:

- **Settings → Pages →** set the source to **None** (disables the URL), or
- Delete this repository, or
- Replace `index.html` with a short note that the demo is retired, commit, and push to `main`.

Leave the footer line in place while the demo is up: “Concept demo for Chameleon Kava Lounge · not the live website.”

## What’s on the page

Public facts only: address, phone, hours (HappyKava), an approximate rating (~4.7 from 200+ Google and HappyKava reviews), menu highlights, weekly events, and the social handles below. No invented prices, awards, or testimonials.

The lounge copy is written as an invitation: kava, coffee, smoke and vape, a drive-thru, Simonis pool, karaoke, games, a kids’ crafts corner, and a sober, locally owned, female-owned hangout. The weekly hours table stays the HappyKava listing, which is more specific than a single 7 AM–2 AM line.

- Instagram: [@chameleonkavalounge](https://www.instagram.com/chameleonkavalounge/)
- TikTok: [@chameleon.brevard](https://www.tiktok.com/@chameleon.brevard)

The hero photo is a real interior shot supplied for this demo. The chameleon mark is original artwork for the pitch, not the lounge’s logo.

## Preview locally

From the repo root:

```bash
python3 -m http.server 8765
```

Then open http://127.0.0.1:8765/

Fonts (Fraunces, Outfit) are self-hosted under `assets/fonts/` and covered by the SIL Open Font License. See `assets/fonts/OFL.txt`.
