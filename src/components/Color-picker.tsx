import React, { useState } from "react";
import Sketch from "@uiw/react-color-sketch";

const PRESET_COLORS = [
  "#000000",
  "#595959",
  "#BFBFBF",
  "#FFFFFF",
  "#FF4D4F",
  "#D0021B",
  "#FA8C16",
  "#FFF566",
  "#52C41A",
  "#237804",
  "#1890FF",
  "#0050B3",
  "#722ED1",
  "#EB2F96",
];

interface HSVA {
  h: number;
  s: number;
  v: number;
  a: number;
}

interface ColorChange {
  hex: string;
  hsva: HSVA;
}

function Demo({ onColorSelect }: { onColorSelect: (color: string) => void }) {
  const [hsva, setHsva] = useState<HSVA>({ h: 214, s: 43, v: 90, a: 1 });
  const [hex, setHex] = useState("#1890FF");

  return (
    <div className="flex justify-center flex-col items-center">
      <Sketch
        className="border border-gray-600 rounded-lg p-2"
        style={{ background: "#1f1f1f" }}
        color={hsva}
        presetColors={PRESET_COLORS}
        onChange={(color: ColorChange) => {
          setHsva(color.hsva);
          setHex(color.hex);
        }}
      />

      <button
        type="button"
        onClick={() => onColorSelect(hex)}
        className="mt-3 w-full px-3 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-sm"
      >
        OK
      </button>
    </div>
  );
}

export default Demo;
