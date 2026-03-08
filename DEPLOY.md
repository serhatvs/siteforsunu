# Deploy

This project is a static Vite site. Deploy the generated `dist/` folder.

## Commands

```powershell
npm.cmd install
npm.cmd run build
```

## Output

- Build output: `dist/`
- Upload the contents of `dist/` to any static host

## Supported Hosts

- Netlify
- Vercel static deployment
- Cloudflare Pages
- GitHub Pages
- Any cPanel / shared hosting that serves static files

## Notes

- Asset URLs are configured as relative, so the site can run from `/` or a subfolder.
- Storyboard images are read from `public/images/storyboard/`.
- If you replace the storyboard files, rebuild before deploying.
