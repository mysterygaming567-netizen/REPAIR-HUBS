# Yahoo sign-in setup

This login uses Firebase Authentication with Yahoo as the OAuth provider. Firebase has a free Spark plan for basic authentication.

1. Create a project at [Firebase Console](https://console.firebase.google.com/), then choose the free **Spark** plan.
2. Open **Build -> Authentication -> Sign-in method**, enable **Yahoo**, and save the Yahoo app credentials there.
3. In **Project settings -> General**, create a Web app and copy its Firebase configuration into `firebase-config.js`.
4. In Firebase Authentication settings, add your development site under **Authorized domains**. For example: `localhost`.
5. Serve the project over HTTP and open `/login/login.html`. Do not use a `file:///` URL.

## Deploy this project

The repository already includes `firebase.json` and `.firebaserc` for project `repair-hub-76172`.

```bash
npm install -g firebase-tools
firebase login
firebase deploy --only hosting
```

After deployment, add the generated `*.web.app` hostname to Firebase Authentication's authorized domains. Then update `firebase-config.js` with the Web app settings from Firebase Project settings. The Yahoo provider's callback URL must also be configured in Yahoo's developer app using the callback URL shown in Firebase's Yahoo provider settings.

The Yahoo client secret belongs in Firebase's provider settings, not in this frontend project.