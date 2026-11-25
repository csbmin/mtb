# mtb.com.np

Static resource directory for GitHub Pages (`CNAME`: `mtb.com.np`).

## Add or edit items

Edit [`resources.js`](resources.js) and add an entry to `MTB_RESOURCES`:

```js
{
  title: "Tool Name",
  desc: "Short summary shown on the main page.",
  details: "Full details shown on details.html before downloading.",
  features: ["Key detail 1", "Key detail 2"],
  category: "Category",
  tags: ["Tag1", "Tag2"],
  downloadUrl: "https://drive.mtb.com.np/example",
  previewUrl: "",
  date: "2026-11-25",
  featured: false,
},
```

- Every item automatically gets a details page at `details.html?id=<slug>` where `Download` and `Preview` appear.
- Sidebar categories and filters update automatically from `category`.
- Leave `previewUrl` as `""` to hide the preview button.
- Leave `downloadUrl` as `""` or `"#"` to display `Coming soon`.

## Security setup

- **No third-party scripts or fonts:** Zero external JS/CSS/font dependencies (`assets/vendors`, jQuery, Bootstrap removed).
- **Strict Content Security Policy (CSP):** `index.html` and `404.html` block inline scripts, inline styles, network calls (`connect-src 'none'`), forms, and embeds (`object-src 'none'`).
- **Safe DOM rendering & URL validation:** All entries render via `textContent` (no `innerHTML`), and links allow only `http:`, `https:`, and `mailto:`.
- **External link isolation:** Outbound links use `rel="noopener noreferrer"` and `<meta name="referrer" content="no-referrer" />`.
- **GitHub Pages HTTPS & `security.txt`:** `.nojekyll` ensures `/.well-known/security.txt` is served. Enable **Enforce HTTPS** in GitHub Pages settings. (If using Cloudflare in front of GitHub Pages, you can additionally set `X-Frame-Options: DENY` and `X-Content-Type-Options: nosniff` HTTP headers there.)
