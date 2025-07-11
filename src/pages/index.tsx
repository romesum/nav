import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import { Search, ChevronDown, ChevronRight, Globe } from 'lucide-react';
import navigationConfigEn from '@/config/navigation.en.json';
import navigationConfigZh from '@/config/navigation.zh.json';
import { locales, Locale } from '@/config/locales';
import { detectUserLocale } from '@/utils/geoLocation';

// Types
interface Category {
  id: string;
  name: string;
  icon: string;
  children?: Category[];
}

interface NavItem {
  id: string;
  name: string;
  description: string;
  url: string;
  imageUrl: string;
  categoryId: string;
  tags: string[];
}

interface NavigationConfig {
  categories: Category[];
  items: NavItem[];
}

export default function Home() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<Locale>('en');
  const [navigationConfig, setNavigationConfig] = useState<NavigationConfig>(navigationConfigEn);
  const searchRef = useRef<HTMLDivElement>(null);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const languageMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 检测用户语言
    const initLocale = async () => {
      const locale = await detectUserLocale();
      setCurrentLocale(locale);
      setNavigationConfig(locale === 'zh' ? navigationConfigZh : navigationConfigEn);
    };
    initLocale();

    // 获取当前会话状态
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };

    getSession();

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 当语言改变时更新导航配置
  useEffect(() => {
    setNavigationConfig(currentLocale === 'zh' ? navigationConfigZh : navigationConfigEn);
  }, [currentLocale]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 添加点击外部关闭语言菜单的功能
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target as Node)) {
        setShowLanguageMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const getCategoryPath = (categoryId: string): string[] => {
    const path: string[] = [];
    const findPath = (categories: Category[], targetId: string, currentPath: string[] = []) => {
      for (const category of categories) {
        if (category.id === targetId) {
          path.push(...currentPath, category.id);
          return true;
        }
        if (category.children) {
          if (findPath(category.children, targetId, [...currentPath, category.id])) {
            return true;
          }
        }
      }
      return false;
    };
    findPath(navigationConfig.categories, categoryId);
    return path;
  };

  const getCategoryName = (categoryId: string): string => {
    const findName = (categories: Category[], targetId: string): string | null => {
      for (const category of categories) {
        if (category.id === targetId) {
          return category.name;
        }
        if (category.children) {
          const name = findName(category.children, targetId);
          if (name) return name;
        }
      }
      return null;
    };
    return findName(navigationConfig.categories, categoryId) || categoryId;
  };

  // Search results for dropdown
  const searchResults = searchQuery
    ? navigationConfig.items.filter((item) => {
        const searchLower = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower) ||
          item.tags.some((tag) => tag.toLowerCase().includes(searchLower))
        );
      })
    : [];

  // Filtered items for page content
  const filteredItems = navigationConfig.items.filter((item) => {
    const matchesCategory = selectedCategory
      ? item.categoryId === selectedCategory
      : true;

    return matchesCategory;
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowSearchResults(true);
  };

  const handleSearchItemClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    setShowSearchResults(false);
    setSearchQuery('');
  };

  const renderCategoryTree = (categories: Category[], level: number = 0) => {
    return categories.map((category) => (
      <div key={category.id} className="space-y-1">
        <button
          onClick={() => {
            if (category.children) {
              toggleCategory(category.id);
            } else {
              setSelectedCategory(category.id);
            }
          }}
          className={`w-full px-4 py-2 flex items-center justify-between rounded-md ${
            selectedCategory === category.id
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
          style={{ paddingLeft: `${level * 1.5 + 1}rem` }}
        >
          <div className="flex items-center">
            {category.children && (
              <span className="mr-2">
                {expandedCategories.has(category.id) ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </span>
            )}
            <span className="text-sm font-medium">{category.name}</span>
          </div>
        </button>
        {expandedCategories.has(category.id) && category.children && (
          <div className="space-y-1">
            {renderCategoryTree(category.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  const toggleLanguage = (locale: Locale) => {
    setCurrentLocale(locale);
    setNavigationConfig(locale === 'zh' ? navigationConfigZh : navigationConfigEn);
    setShowLanguageMenu(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <span className="text-xl font-bold text-gray-900">NavSite</span>
              </Link>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative" ref={searchRef}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder={locales[currentLocale].search}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setShowSearchResults(true)}
                />
                
                {/* Search Results Dropdown */}
                {showSearchResults && searchResults.length > 0 && (
                  <div className="absolute z-50 mt-1 w-full bg-white rounded-md shadow-lg">
                    <ul className="max-h-96 overflow-auto py-1">
                      {searchResults.map((item) => (
                        <li
                          key={item.id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleSearchItemClick(item.url)}
                        >
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <Image
                                src={item.imageUrl}
                                alt={item.name}
                                width={40}
                                height={40}
                                className="rounded"
                              />
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-900">{item.name}</p>
                              <p className="text-sm text-gray-500">{item.description}</p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {/* Language Switcher */}
              <div className="relative" ref={languageMenuRef}>
                <button
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900"
                >
                  <Globe className="h-5 w-5" />
                  <span>{currentLocale.toUpperCase()}</span>
                </button>

                {showLanguageMenu && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu">
                      <button
                        onClick={() => toggleLanguage('en')}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          currentLocale === 'en' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                        } hover:bg-gray-100`}
                        role="menuitem"
                      >
                        English
                      </button>
                      <button
                        onClick={() => toggleLanguage('zh')}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          currentLocale === 'zh' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                        } hover:bg-gray-100`}
                        role="menuitem"
                      >
                        中文
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              {session ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">
                    {session.user.email}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
                  >
                    {locales[currentLocale].logout}
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="ml-4 px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
                >
                  {locales[currentLocale].login}
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex">
            {/* Sidebar */}
            <div className="w-64 flex-shrink-0 border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
              <div className="px-3">
                <div className="space-y-1">
                  {renderCategoryTree(navigationConfig.categories)}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 pl-8 pt-5">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="p-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            width={48}
                            height={48}
                            className="rounded"
                          />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                          <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 