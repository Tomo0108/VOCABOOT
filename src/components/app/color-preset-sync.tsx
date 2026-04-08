"use client";

import { useEffect } from "react";
import { getPreferences } from "@/lib/preferences";
import { DEFAULT_COLOR_PRESET_ID, type ColorPresetId } from "@/lib/color-presets";

function applyColorPresetToDocument(preset: ColorPresetId) {
  const root = document.documentElement;
  if (preset === DEFAULT_COLOR_PRESET_ID) {
    root.removeAttribute("data-color-preset");
  } else {
    root.dataset.colorPreset = preset;
  }
}

export function ColorPresetSync() {
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const p = await getPreferences();
      if (!cancelled) applyColorPresetToDocument(p.colorPreset);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const onPrefs = () => {
      void getPreferences().then((p) => applyColorPresetToDocument(p.colorPreset));
    };
    window.addEventListener("vocaboost:prefs-updated", onPrefs);
    return () => window.removeEventListener("vocaboost:prefs-updated", onPrefs);
  }, []);

  return null;
}
