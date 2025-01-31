# React Native Expo Project Setup and Build Guide

## Step 1: Launching the Project via Expo Go

### 1. Install Required Tools

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) 18.20.5+ (preferably LTS)
- Expo CLI:
    ```bash
    npm install -g expo-cli
    ```
- [Expo Go](https://expo.dev/client) on your mobile device (available on Google Play and App Store).

### 2. Install Dependencies

In the project directory, run:

```bash
npm install
```

### 3. Start the Expo Server

```bash
npx expo start
```

Expo CLI will generate a QR code.

### 4. Scan the QR Code

Before scanning the QR code, ensure the Expo Go app is running on your mobile device. The terminal will display a message indicating "Using Expo Go".

- Use the Expo Go app on your phone to scan the QR code from the terminal or browser.
- The application should launch on your mobile device.

---

## Step 2: Building the APK via EAS

### 1. Install EAS CLI

If you do not have EAS CLI installed:

```bash
npm install -g eas-cli
```

### 2. Log in to Expo

```bash
eas login
```

Enter your [Expo](https://expo.dev) account credentials.

### 3. Initialize EAS

In the project directory:

```bash
eas build:configure
```

Select the platforms you wish to configure for the build.

### 4. Build the APK

For a development build:

```bash
eas build --profile development --platform android
```

### 5. Download the APK

Upon completion, EAS will provide a link to download the APK file.

### 6. Test the APK

Install the APK on your phone by copying the file and launching it on your Android device. Ensure **Allow installation of apps from unknown sources** is enabled.

---

That's it — your React Native Expo project should now be ready for launch and distribution! 🎉
