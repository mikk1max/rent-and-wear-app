# Przewodnik po konfiguracji i budowie projektu React Native Expo

## Krok 1: Uruchamianie projektu za pomocą Expo Go

### 1. Zainstaluj wymagane narzędzia

Upewnij się, że masz zainstalowane:

- [Node.js](https://nodejs.org/) 18.20.5+ (najlepiej LTS)
- Expo CLI:
    ```bash
    npm install -g expo-cli
    ```
- [Expo Go](https://expo.dev/client) na swoim urządzeniu mobilnym (dostępne w Google Play i App Store).

### 2. Zainstaluj zależności

W katalogu projektu uruchom:

```bash
npm install
```

### 3. Uruchom serwer Expo

```bash
npx expo start
```

Expo CLI wygeneruje kod QR.

### 4. Zeskanuj kod QR

Przed zeskanowaniem kodu QR upewnij się, że aplikacja Expo Go jest uruchomiona na Twoim urządzeniu mobilnym. Terminal wyświetli komunikat "Using Expo Go".

- Użyj aplikacji Expo Go na swoim telefonie, aby zeskanować kod QR z terminala lub przeglądarki.
- Aplikacja powinna uruchomić się na Twoim urządzeniu mobilnym.

---

## Krok 2: Budowanie APK za pomocą EAS

### 1. Zainstaluj EAS CLI

Jeśli nie masz zainstalowanego EAS CLI:

```bash
npm install -g eas-cli
```

### 2. Zaloguj się do Expo

```bash
eas login
```

Wprowadź swoje dane logowania do konta [Expo](https://expo.dev).

### 3. Zainicjuj EAS

W katalogu projektu:

```bash
eas build:configure
```

Wybierz platformy, które chcesz skonfigurować do budowy.

### 4. Zbuduj APK

Dla wersji deweloperskiej:

```bash
eas build --profile development --platform android
```

### 5. Pobierz APK

Po zakończeniu EAS dostarczy link do pobrania pliku APK.

### 6. Przetestuj APK

Zainstaluj APK na swoim telefonie, kopiując plik i uruchamiając go na swoim urządzeniu z Androidem. Upewnij się, że **Zezwalaj na instalację aplikacji z nieznanych źródeł** jest włączone.

---

To wszystko — projekt React Native Expo powinien być teraz gotowy do uruchomienia i dystrybucji! 🎉
