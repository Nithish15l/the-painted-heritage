# Kalamkari Atelier — Gallery Web App

A warm, Kalamkari-inspired gallery for **@thepaintedheritage** — hand-painted canvas works from Instagram, with light Kalamkari doodle backgrounds and Instagram buy CTAs.  
**International shipping** is highlighted throughout.

## Quick start

### Option A — open locally

1. Open the folder `kalamkari-gallery`
2. Double-click `index.html`  
   *(Some browsers block local video/media; prefer Option B if that happens.)*

### Option B — local server (recommended)

```bash
cd C:\Users\Nithish\kalamkari-gallery
npx --yes serve .
```

Then open the URL shown in the terminal (usually `http://localhost:3000`).

Or with Python:

```bash
cd C:\Users\Nithish\kalamkari-gallery
python -m http.server 8080
```

Open `http://localhost:8080`.

## Customize for your business

### 1. Instagram handle & brand

Edit **`js/config.js`**:

```js
window.KALAMKARI_CONFIG = {
  instagramHandle: "your_real_handle",  // no @
  brandName: "Your Studio Name",
  tagline: "Your short tagline",
  inquiryMessage: "Hi! I'm interested in a painting…",
};
```

### 2. Your images & videos

Edit **`js/data.js`**. Each work looks like:

```js
{
  id: "unique-id",
  title: "Tree of Life",
  type: "image",           // or "video"
  media: "assets/tree.jpg", // or a full URL / video URL
  poster: "assets/poster.jpg", // optional, videos only
  category: "mythic",      // mythic | fauna | floral | sacred | narrative | process
  size: "36 × 48 in canvas",
  medium: "Natural dyes on cotton canvas",
  description: "Short story about the piece…",
  tags: ["tree of life", "canvas"],
}
```

Put your files in the **`assets/`** folder and point `media` to them, e.g. `assets/peacock.jpg`.

### 3. Deploy

Upload the whole folder to any static host:

- [Netlify Drop](https://app.netlify.com/drop)
- GitHub Pages
- Vercel
- Cloudflare Pages

No build step required.

## Features

| Feature | Detail |
|--------|--------|
| Gallery | Paintings + videos in a responsive grid |
| Filters | All / Paintings / Videos / theme tags |
| Detail modal | Description, size, medium — **no prices** |
| Buy path | CTA opens your Instagram profile |
| Shipping | International shipping banner + section |
| Design | Cream, madder red, indigo, ochre — Kalamkari vibe |
| Mobile | Sticky header, hamburger nav, stacked layout |

## Project structure

```
kalamkari-gallery/
├── index.html
├── css/styles.css
├── js/config.js      ← your Instagram & brand
├── js/data.js        ← gallery catalog
├── js/app.js
├── assets/           ← put your images/videos here
└── README.md
```

## Notes

- Placeholder images use Unsplash; sample videos use Google sample media. Replace them with your real work.
- Clicking “I’m interested” on a piece copies a short inquiry message to the clipboard (when the browser allows) and opens Instagram so buyers can paste it into your DMs.
- Never show prices on this site by design — keep sales conversations on Instagram.

## License

Use freely for your art business.
