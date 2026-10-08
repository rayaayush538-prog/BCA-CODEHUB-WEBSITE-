MUJ BCA CodeHub — Separated Website Files

Files:
1. index.html  → Website structure/content
2. style.css   → Design, responsive layout, dark/light mode styling
3. script.js   → Website interactions and existing JavaScript
4. assets/     → Put images, logos, PDFs, etc. here later

How to run:
- Keep all files/folders in the same structure.
- Open index.html in a browser.

GitHub Pages:
- Upload index.html, style.css, script.js and the assets folder to your repository.
- Set GitHub Pages to deploy from the main branch and /(root).

Important:
The existing admin/database functionality in the source depends on the original Claude-specific `claude.*` environment.
For a normal public GitHub/Netlify deployment, that backend should later be replaced with Firebase (Auth + Firestore + Storage).
