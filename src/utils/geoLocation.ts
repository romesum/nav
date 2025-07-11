export async function detectUserLocale(): Promise<'zh' | 'en'> {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    // 如果用户在中国，返回中文，否则返回英文
    return data.country_code === 'CN' ? 'zh' : 'en';
  } catch (error) {
    // 如果检测失败，默认返回英文
    console.error('Failed to detect user location:', error);
    return 'en';
  }
} 