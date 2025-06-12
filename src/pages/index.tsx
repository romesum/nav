import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Search } from 'lucide-react';
import { parseBookmarks, groupBookmarksByCategory } from '../utils/bookmarkParser';

interface Bookmark {
  title: string;
  url: string;
  category: string;
  subcategory?: string;
}

interface Category {
  name: string;
  icon: string;
  items: { title: string; url: string; }[];
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    // 从本地存储或API获取书签数据
    const fetchBookmarks = async () => {
      try {
        const response = await fetch('/api/bookmarks');
        const html = await response.text();
        const bookmarks = parseBookmarks(html);
        const groupedBookmarks = groupBookmarksByCategory(bookmarks);
        setCategories(groupedBookmarks);
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
      }
    };

    fetchBookmarks();
  }, []);

  const filteredCategories = categories.map(category => ({
    ...category,
    items: category.items.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Head>
        <title>简洁导航</title>
        <meta name="description" content="一个简洁的网址导航" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        {/* 顶部搜索栏 */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索网站..."
              className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* 分类展示 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCategories.map((category) => (
            <div key={category.name} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 dark:text-white">
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </h2>
              <div className="space-y-3">
                {category.items.map((item) => (
                  <a
                    key={item.url}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <span className="text-gray-700 dark:text-gray-300">{item.title}</span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* 主题切换按钮 */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="fixed bottom-4 right-4 p-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      >
        {isDarkMode ? '🌞' : '🌙'}
      </button>
    </div>
  );
} 