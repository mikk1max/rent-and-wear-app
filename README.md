# 👗 Rent & Wear

> **A modern peer-to-peer mobile clothing rental platform built with React Native and Expo.**

[![React Native](https://img.shields.io/badge/React_Native-0.76-61DAFB?style=flat&logo=react&logoColor=white)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo_SDK-52-000020?style=flat&logo=expo&logoColor=white)](https://expo.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-v11-FFCA28?style=flat&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Languages](https://img.shields.io/badge/Language-PL%20%7C%20EN-blue.svg)](#-internationalization)

---

## 📖 About The Project

**Rent & Wear** is a cross-platform mobile application designed to promote sustainable fashion through collaborative consumption. It enables users to monetize unused wardrobe items and rent designer, occasion, or everyday clothing and accessories from other community members.

🎨 **UI/UX Design**: Check out the original [Figma Design Prototype](https://cutt.ly/xeANFD6D).

---

## ✨ Key Features

- **🔍 Browse & Discovery**
  - Dynamic keyword search and instant category filtering (dresses, suits, streetwear, accessories).
  - Detailed product view with photo carousels, item condition tags, size, pricing, and owner ratings.

- **📅 Seamless Rental & Booking Flow**
  - Interactive calendar picker for booking duration.
  - Transparent pricing breakdown and simulated checkout flow.

- **📦 Order Lifecycle & Tracking (Gets & Sends)**
  - **Gets (Rented items)**: Track active and upcoming rentals, return schedules, and order summaries.
  - **Sends (Lent items)**: Manage incoming rental requests, shipment status, and integrated barcode generation for parcel handling.

- **📸 Wardrobe Monetization (Rent Out)**
  - Quick listing creation with multi-photo uploads from camera or gallery.
  - Custom pricing per day, item condition specification, and category assignment.

- **💬 Real-Time Messaging**
  - Integrated in-app chat between renter and lender powered by Firebase Firestore.

- **📍 Address Book & User Profiles**
  - Secure authentication via Email/Password and Google Sign-In.
  - Multi-address management for shipping and returns.

- **🌐 Internationalization (i18n)**
  - Full multi-language support (English & Polish) with on-the-fly switching.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Mobile Framework** | [React Native 0.76](https://reactnative.dev/) with [Expo SDK 52](https://expo.dev/) |
| **Navigation** | [React Navigation 6](https://reactnavigation.org/) (Stack & Bottom Tabs) |
| **Backend & Cloud** | [Firebase](https://firebase.google.com/) (Authentication, Cloud Firestore, Cloud Storage) |
| **Forms & State** | [React Hook Form](https://react-hook-form.com/), React Context API |
| **UI Components** | React Native Paper, Vector Icons, React Native Swiper |
| **Internationalization** | i18next & react-i18next |
| **Typography** | Google Fonts (`Poppins`, `Work Sans`) |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18.x or later)
- [Expo Go](https://expo.dev/client) installed on your iOS or Android device

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mikk1max/rent-and-wear-app.git
   cd rent-and-wear-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the project root with your Firebase credentials:
   ```env
   FIREBASE_API_KEY=your_api_key
   FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   FIREBASE_APP_ID=your_app_id
   ```

4. **Start the development server:**
   ```bash
   npx expo start
   ```
   Scan the generated QR code using the **Expo Go** app (Android) or the default Camera app (iOS).

---

## 📦 Building Standalone APK with EAS

To create a standalone Android APK using Expo Application Services (EAS):

1. **Install EAS CLI:**
   ```bash
   npm install -g eas-cli
   ```
2. **Log in to your Expo account:**
   ```bash
   eas login
   ```
3. **Build the APK:**
   ```bash
   eas build --profile development --platform android
   ```

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

## 👥 Authors

- **Maksym Shepeta** ([@mikk1max](https://github.com/mikk1max))
- **Dmytro Tsariov** ([@Boberman1](https://github.com/Boberman1))
