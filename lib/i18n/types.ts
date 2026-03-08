export type Locale = "ko" | "en";

export type Translations = {
  // Nav
  nav: {
    home: string;
    advisor: string;
    plugins: string;
    pluginCount: string;
  };
  // Main page
  main: {
    title: string;
    subtitle: string;
    instantBadge: string;
    tabAnalysis: string;
    tabHistory: string;
    tabFavorites: string;
    tagHint: string;
  };
  // Input panel
  input: {
    tabText: string;
    tabFile: string;
    tabGithub: string;
    placeholder: string;
    fileDrop: string;
    fileUploadTitle: string;
    fileUploadDesc: string;
    fileChange: string;
    ghPlaceholder: string;
    analyzeBtn: string;
    analyzing: string;
    aiMode: string;
    keywordMode: string;
    noContent: string;
  };
  // Analysis
  analysis: {
    analyzing: string;
    analyzingDesc: string;
    analyzingAiDesc: string;
    projectSummary: string;
    recommendLabel: string;
    warningMany: string;
    noKeyword: string;
    noKeywordDefault: string;
    backToAnalysis: string;
    redundancyHint: string;
    alsoConsider: string;
  };
  // Plugin card
  card: {
    core: string;
    conflict: string;
    detail: string;
  };
  // Plugin modal / detail
  detail: {
    features: string;
    install: string;
    installGuide: string;
    latestVersion: string;
    conflictWarning: string;
    keywords: string;
    relatedPlugins: string;
    githubLink: string;
    detailPage: string;
    backToList: string;
    copy: string;
    copied: string;
  };
  // Install script
  installScript: {
    title: string;
    saveFavorite: string;
    saved: string;
    comboName: string;
    save: string;
    copy: string;
    copyDone: string;
    guide: string;
    scriptComment1: string;
    scriptComment2: string;
  };
  // History
  history: {
    title: string;
    empty: string;
    emptyHint: string;
    restore: string;
    delete: string;
  };
  // Favorites
  favorites: {
    title: string;
    empty: string;
    emptyHint: string;
    copyScript: string;
    delete: string;
  };
  // Plugins page
  pluginsPage: {
    title: string;
    searchPlaceholder: string;
    allCategories: string;
    noResults: string;
  };
  // Landing Page
  landing: {
    heroTitle: string;
    heroSubtitle: string;
    startBtn: string;
    featuresTitle: string;
    feature1Title: string;
    feature1Desc: string;
    feature2Title: string;
    feature2Desc: string;
    feature3Title: string;
    feature3Desc: string;
  };
  // Categories
  categories: Record<string, string>;
  // Presets
  presets: {
    title: string;
    subtitle: string;
    difficulty: {
      beginner: string;
      intermediate: string;
      advanced: string;
    };
    useThisPack: string;
    pluginCount: string;
  };
  // Onboarding
  onboarding: {
    welcome: string;
    welcomeDesc: string;
    question: string;
    skipToAdvanced: string;
    step: string;
    stepInstall: string;
    stepInstallDesc: string;
    stepDone: string;
    stepDoneDesc: string;
    backToPresets: string;
    installGuideTitle: string;
    installGuideStep1: string;
    installGuideStep2: string;
    installGuideStep3: string;
    installGuideStep4: string;
    letsStart: string;
    beginnerBanner: string;
    beginnerBannerDesc: string;
    whatsNext: string;
    whatsNextDesc: string;
    tryThisPrompt: string;
    copyPrompt: string;
    troubleshooting: string;
    troubleshootingHint: string;
    installProgress: string;
    troubleshootItems: {
      cmdNotWork: string;
      cmdNotWorkAnswer: string;
      pluginNotVisible: string;
      pluginNotVisibleAnswer: string;
      permissionError: string;
      permissionErrorAnswer: string;
    };
  };
};
