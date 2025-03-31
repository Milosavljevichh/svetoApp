
const prompts = {
    en: { lg: "English", script: "Latin" },
    sr: { lg: "Serbian", script: "Latin (not Cyrillic)" },
    srCy: { lg: "Serbian", script: "Cyrillic" },
    ru: { lg: "Russian", script: "Latin (not Cyrillic)" },
    el: { lg: "Greek", script: "Latin (not Cyrillic)" },
    bg: { lg: "Bulgarian", script: "Latin (not Cyrillic)" },
  };

  export default function getPrompts() {
    return prompts;
  }