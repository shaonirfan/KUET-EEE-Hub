import { NextResponse } from 'next/server';
import { google } from 'googleapis';

const SHEET_ID = process.env.GOOGLE_RESOURCES_SHEET_ID;
const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
let PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;

if (PRIVATE_KEY) {
  PRIVATE_KEY = PRIVATE_KEY.replace(/\\n/g, '\n');
}

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const RANGE = 'resources!A1:M'; // Sheet tab is 'resources', columns A-M

export async function GET() {
  try {
    if (!SHEET_ID || !SERVICE_ACCOUNT_EMAIL || !PRIVATE_KEY) {
      throw new Error('Missing Google Sheets credentials in environment variables');
    }

    const auth = new google.auth.JWT(
      SERVICE_ACCOUNT_EMAIL,
      undefined,
      PRIVATE_KEY,
      SCOPES
    );

    const sheets = google.sheets({ version: 'v4', auth });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: RANGE,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    const [header, ...data] = rows;
    const resources = data.map(row => {
      const rec: any = {};
      header.forEach((key, i) => {
        rec[key] = row[i] || '';
      });
      // Parse tags as JSON array or comma-separated string
      if (rec.tags) {
        try {
          rec.tags = JSON.parse(rec.tags);
        } catch {
          rec.tags = rec.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
        }
      } else {
        rec.tags = [];
      }
      // category is optional
      if (rec.category === '') delete rec.category;
      return rec;
    });

    return NextResponse.json(resources, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

    