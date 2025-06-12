import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const bookmarksPath = path.join(process.cwd(), 'bookmarks_2025_6_11.html');
    const bookmarksHtml = fs.readFileSync(bookmarksPath, 'utf-8');
    res.status(200).send(bookmarksHtml);
  } catch (error) {
    console.error('Error reading bookmarks file:', error);
    res.status(500).json({ error: 'Failed to read bookmarks file' });
  }
} 