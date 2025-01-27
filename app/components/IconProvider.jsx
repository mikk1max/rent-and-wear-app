import React, { createContext, useState, useEffect } from "react";

export const IconContext = createContext();

export const IconProvider = ({ children, userId }) => {
  // Default icon set
  const defaultIcons = [
    "t-shirt",
    "dress",
    "shorts",
    "coat",
    "sneakers",
  ];

  // Icons state and activeIcon state
  const [icons, setIcons] = useState(defaultIcons);
  const [activeIcon, setActiveIcon] = useState(null);

  // Reset icons if userId changes
  useEffect(() => {
    // Reset icons to the default array whenever userId changes
    setIcons(defaultIcons);
  }, [userId]);  // This effect runs when userId changes

  const changeIcon = (icon) => {
    if (!icon) return;
    const updatedIcons = [icon, ...icons.slice(0, -1)];
    setIcons(updatedIcons);
  };

  const value = {
    icons,
    changeIcon,
    activeIcon,
    setActiveIcon,
  };

  return <IconContext.Provider value={value}>{children}</IconContext.Provider>;
};
