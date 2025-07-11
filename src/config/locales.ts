export const locales = {
  zh: {
    search: "搜索...",
    logout: "退出",
    login: "登录",
    switchLanguage: "切换语言",
    categories: {
      all: "全部",
      development: "开发",
      design: "设计",
      productivity: "效率",
      tools: "工具",
      resources: "资源"
    },
    common: {
      loading: "加载中...",
      error: "出错了",
      noResults: "没有找到结果",
      viewMore: "查看更多",
      back: "返回"
    },
    navigation: {
      home: "首页",
      favorites: "收藏",
      recent: "最近访问",
      settings: "设置"
    }
  },
  en: {
    search: "Search...",
    logout: "Logout",
    login: "Login",
    switchLanguage: "Switch Language",
    categories: {
      all: "All",
      development: "Development",
      design: "Design",
      productivity: "Productivity",
      tools: "Tools",
      resources: "Resources"
    },
    common: {
      loading: "Loading...",
      error: "Error",
      noResults: "No results found",
      viewMore: "View More",
      back: "Back"
    },
    navigation: {
      home: "Home",
      favorites: "Favorites",
      recent: "Recent",
      settings: "Settings"
    }
  }
};

export type Locale = keyof typeof locales; 