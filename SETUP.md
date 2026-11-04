# vhs.ai setup (no server to run)

vhs.ai is plain static files: open `index.html`, or upload the folder to any static host (Cloudflare Pages, Netlify, GitHub Pages) to use it from any device.
Accounts live in a free Firebase project that runs 24/7. All steps below are free and done once.

## Accounts (Firebase)
1. Go to console.firebase.google.com and create a project.
2. Build > Authentication > Get started > Sign-in method > enable **Email/Password**.
3. Build > Firestore Database > Create database (production mode). Open the **Rules** tab and paste:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {
    match /users/{uid}/{doc=**} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```
4. Project settings > General > Your apps > add a **Web app**. Copy `apiKey` and `projectId` into `config.js`.

Usernames are turned into private logins (name@vhs-ai.user), so there is no password reset by email. Use a real email as the username if you want that.

## Import from a c.ai link (optional)
5. Cloudflare dashboard > Workers & Pages > Create > Worker. Paste `worker.js`, deploy, and put the worker URL in `caiProxy` in `config.js`.
c.ai can refuse these requests. If so, add your c.ai token in Settings > Privacy, or import card files (drag them onto the page).

Your Venice API key and c.ai token stay in the browser and are never synced.
