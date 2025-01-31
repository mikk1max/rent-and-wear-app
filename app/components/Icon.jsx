import React from "react";
import { icons } from "../utils/icons";

export default function Icon({
  name,
  width,
  height,
  fillColor = "transparent",
  colorStroke = "transparent",
}) {
  const ImportedIcon = icons[name];

  if (!ImportedIcon) {
    console.warn(`Icon "${name}" not found in the icons map.`);
    return null;
  }

  return (
    <ImportedIcon
      width={width}
      height={height}
      fill={fillColor}
      stroke={colorStroke}
    />
  );
}
