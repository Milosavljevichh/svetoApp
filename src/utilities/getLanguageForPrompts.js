
const prompts = {
    en: { lg: "English", script: "Latin" },
    sr: { lg: "Serbian", script: "Latin (not Cyrillic)" },
    srCy: { lg: "Serbian", script: "Cyrillic" },
    ru: { lg: "Russian", script: "Cyrillic (Russian Native)" },
    el: { lg: "Greek", script: "Cyrillic (Greek native)" },
    bg: { lg: "Bulgarian", script: "Cyrillic (Bulgarian native)" },
  };

  export default function getPrompts() {
    return prompts;
  }