Setting up EAS Build allows you to build ready-to-submit binary of your app for the Google Play Store or Apple Store. (i.e. .apk/.aab files for Android, and .ipa file iOS).

1. Install `eas-cli` as a global package

    ```
    npm install -g eas-cli
    ```

2. Log in to your Expo account to begin configuring eas for your project.

    ```
    eas login
    eas build:configure
    ```

3. Complete the steps on CLI to create your eas project for your Expo account