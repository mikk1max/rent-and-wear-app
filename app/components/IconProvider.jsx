import React, { createContext, useState, useEffect } from "react";

export const IconContext = createContext();

export const IconProvider = ({ children, userId }) => {
  const defaultIcons = ["t-shirt", "dress", "shorts", "coat", "sneakers"];

  const [icons, setIcons] = useState(defaultIcons);
  const [activeIcon, setActiveIcon] = useState(null);

  useEffect(() => {
    setIcons(defaultIcons);
  }, [userId]);

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
