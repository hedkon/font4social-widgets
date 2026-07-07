# Font4Social Unicode Widgets

Small, dependency-free Unicode widgets from [Font4Social](https://font4social.com/) that you can embed in a blog, docs page, landing page, or small web project.

These widgets are intentionally lightweight. They do not include the full Font4Social database, but they are useful for quick copy-paste interactions and link back to the full tools.

## Widgets

- **Fancy Text Preview**: type text and preview a few Unicode styles.
- **Invisible Character Copy**: copy blank text, zero-width spaces, and invisible characters.
- **Emoji Copy Strip**: show a small row of emoji buttons that copy with one click.

## Quick Use

Add the CSS and JS:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/hedkon/font4social-widgets@main/dist/font4social-widgets.css">
<script defer src="https://cdn.jsdelivr.net/gh/hedkon/font4social-widgets@main/dist/font4social-widgets.js"></script>
```

Then add one or more widgets:

```html
<div data-f4s-widget="fancy-text"></div>
<div data-f4s-widget="blank-text"></div>
<div data-f4s-widget="emoji-strip" data-emojis="😂,❤️,🔥,✨,✅,🎮"></div>
```

## Local Demo

Open [`demo/index.html`](demo/index.html) in your browser.

## Full Tools

- [Unicode Text Generator](https://font4social.com/)
- [Invisible Character & Blank Text Generator](https://font4social.com/blank-text-generator/)
- [Emoji Copy Paste & PNG Sticker Maker](https://font4social.com/emoji-copy-paste/)
- [Social QR Code Generator](https://font4social.com/social-qr-code-generator/)

## Notes

- Everything runs in the browser.
- No tracking is included in this widget package.
- Clipboard access depends on the user's browser and security settings.
- This project is independent and is not affiliated with Instagram, TikTok, Discord, Steam, Facebook, Apple, Google, Microsoft, or other platforms mentioned.

## License

MIT

