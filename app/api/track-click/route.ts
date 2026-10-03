import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Server-persistent click log file in scratch or temp directory
const LOG_FILE_PATH = path.join(process.cwd(), '.click_analytics.json');

interface ClickAnalyticsData {
  totalClicks: number;
  clickHistory: { timestamp: string; ip?: string }[];
}

function readAnalyticsData(): ClickAnalyticsData {
  try {
    if (fs.existsSync(LOG_FILE_PATH)) {
      const data = fs.readFileSync(LOG_FILE_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading click analytics:', err);
  }
  return { totalClicks: 0, clickHistory: [] };
}

function saveAnalyticsData(data: ClickAnalyticsData) {
  try {
    fs.writeFileSync(LOG_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing click analytics:', err);
  }
}

export async function GET() {
  const data = readAnalyticsData();
  return NextResponse.json({
    success: true,
    totalClicks: data.totalClicks,
    clickHistory: data.clickHistory,
  });
}

export async function POST() {
  const data = readAnalyticsData();
  data.totalClicks += 1;
  data.clickHistory.unshift({
    timestamp: new Date().toISOString(),
  });

  // Keep last 500 click timestamps
  if (data.clickHistory.length > 500) {
    data.clickHistory = data.clickHistory.slice(0, 500);
  }

  saveAnalyticsData(data);

  return NextResponse.json({
    success: true,
    totalClicks: data.totalClicks,
  });
}
