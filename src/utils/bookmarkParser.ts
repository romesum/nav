import { JSDOM } from 'jsdom';

interface Bookmark {
  title: string;
  url: string;
  category: string;
  subcategory?: string;
  addDate?: number;
}

export function parseBookmarks(html: string): Bookmark[] {
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  const bookmarks: Bookmark[] = [];

  function processNode(node: Element, category: string = '', subcategory: string = '') {
    if (node.tagName === 'A') {
      bookmarks.push({
        title: node.textContent || '',
        url: node.getAttribute('href') || '',
        category,
        subcategory,
        addDate: parseInt(node.getAttribute('ADD_DATE') || '0')
      });
    } else if (node.tagName === 'H3') {
      const newCategory = node.textContent || '';
      Array.from(node.nextElementSibling?.children || []).forEach(child => {
        processNode(child, newCategory);
      });
    } else if (node.tagName === 'DL') {
      Array.from(node.children).forEach(child => {
        processNode(child, category, subcategory);
      });
    }
  }

  Array.from(doc.querySelectorAll('DL > *')).forEach(node => {
    processNode(node as Element);
  });

  return bookmarks;
}

export function groupBookmarksByCategory(bookmarks: Bookmark[]) {
  const grouped: { [key: string]: Bookmark[] } = {};
  
  bookmarks.forEach(bookmark => {
    if (!grouped[bookmark.category]) {
      grouped[bookmark.category] = [];
    }
    grouped[bookmark.category].push(bookmark);
  });

  return Object.entries(grouped).map(([category, items]) => ({
    name: category,
    icon: getCategoryIcon(category),
    items: items.map(item => ({
      title: item.title,
      url: item.url
    }))
  }));
}

function getCategoryIcon(category: string): string {
  const iconMap: { [key: string]: string } = {
    '开发工具': '🛠️',
    '学习资源': '📚',
    '设计资源': '🎨',
    '文档': '📄',
    '工具': '🔧',
    '娱乐': '🎮',
    '社交': '👥',
    '购物': '🛍️',
    '新闻': '📰',
    '其他': '📌'
  };

  return iconMap[category] || '📌';
} 