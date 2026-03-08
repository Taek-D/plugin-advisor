export type Locale = "ko" | "en";

export type Translations = {
  // Nav
  nav: {
    home: string;
    plugins: string;
    community: string;
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
  // Reviews
  review: {
    title: string;
    rating: string;
    placeholder: string;
    submit: string;
    submitting: string;
    success: string;
    noReviews: string;
    loginRequired: string;
  };
  // History
  history: {
    title: string;
    empty: string;
    restore: string;
    delete: string;
  };
  // Favorites
  favorites: {
    title: string;
    empty: string;
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
  // Community
  community: {
    title: string;
  };
  // Auth
  auth: {
    login: string;
    logout: string;
  };
  // Categories
  categories: Record<string, string>;
};
