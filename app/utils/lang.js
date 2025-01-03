const translations = {
  en: {
    universal: {
      editBtn: "Edit",
      saveBtn: "Save",
      cancelBtn: "Cancel",
      deleteBtn: "Delete",
    },
    welcome: {
      guestBtn: "Continue as a Guest",
      loginBtn: "Log in / Sign up",
    },
    login: {
      title: "Welcome back!",
      emailLabel: "E-mail",
      passLabel: "Password",
      forgotPass: "Forgot password?",
      loginBtn: "Log in",
      signUpBtn: "Sign Up",
      googleBtn: "Login with Google",
    },
    signUp: {
      title: "Create Account",
      nameLabel: "Name",
      surnameLabel: "Surname",
      emailLabel: "E-mail",
      passLabel: "Password",
      signUpBtn: "Sign Up",
    },
    rentNow: {
      searchPlaceHolder: "Search",
      categoryTitle: "Category",
      allCategoriesBtn: "See all",
      yourAnnouncementLabel: "Your announcement",
    },
    navigationBar: {
      rentNowBtn: "Rent now",
      rentOutBtn: "Rent out",
    },
    userProfile: {
      verificationInfo: {
        completed: "Verification completed",
        uncompleted: "Not verified yet",
      },
      settings: "Settings",
      addresses: "Addresses",
      sends: "Sends",
      gets: "Gets",
      logout: "Log out",
    },
    settings: {
      titleLabel: "Settings",
      editPictureText: "Edit profile picture",
      nameLabel: "Name",
      surnameLabel: "Surname",
      emailLabel: "E-mail",
    },
    addresses: {
      titleLabel: "Addresses",
      newAddressBtn: "New address",
      modalAddEdit: {
        addresseeLabel: "Addressee",
        phoneLabel: "Phone number",
        emailLabel: "E-mail",
        streetLabel: "Street",
        buildingLabel: "Building number",
        apartmentLabel: "Flat/Apartment number",
        floorLabel: "Floor number",
        postalCodeLabel: "Postal code",
        cityLabel: "City",
        countryLabel: "Country",
      },
    },
    announcement: {
      categoryLabel: "Category",
      price: ["$", "day"],
      sizeLabel: "Size",
      conditionLabel: "Condition",
      descLabel: "Description",
      ownerLabel: "Advertiser",
      opinionsLabel: "Opinion",
      writeYourOpinionBtn: "Write your opinion",
      onModerationText: "On moderation",
      yourOpinionLabel: "Your opinion",
      bookItBtn: "Book it",
      rentItNow: "Rent it now",
    },
  },

  pl: {
    welcome: {
      guestBtn: "Kontynuuj jako gość",
      loginBtn: "Zaloguj się / Zarejestruj się",
    },
    login: {
      title: "Witamy z powrotem!",
      emailLabel: "E-mail",
      passLabel: "Hasło",
    },
    rentNow: {
      searchPlaceHolder: "Wyszukaj",
      categoryTitle: "Kategorie",
      allCategoriesBtn: "Więcej",
      yourAnnouncementLabel: "Twoje ogłoszenie",
    },
    navigationBar: {
      rentNowBtn: "Najem",
      rentOutBtn: "Wynajem",
    },
    userProfile: {
      verificationInfo: {
        completed: "Weryfikacja zrealizowana",
        uncompleted: "Jeszcze nie zweryfikowano",
      },
      settings: "Ustawienia",
      addresses: "Adresy",
      sends: "Wysyłam",
      gets: "Otrzymuję",
      logout: "Wyloguj",
    },
  },
};

export function getTranslation(lang, key) {
  return translations[lang]?.[key] || translations.en[key];
}
