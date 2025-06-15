import { NextResponse } from 'next/server';
import { google } from 'googleapis';

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
let PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;

// Handle escaped newlines in env
if (PRIVATE_KEY) {
  PRIVATE_KEY = PRIVATE_KEY.replace(/\\n/g, '\n');
}

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const RANGE = 'recordings!A1:H'; // Adjust as needed

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
    const recordings = data.map(row => {
      const rec = Object.fromEntries(header.map((key, i) => [key, row[i] || '']));
      if (rec.tags) {
        rec.tags = rec.tags.split(';').map((t: string) => t.trim()).filter(Boolean);
      }
      return rec;
    });

    return NextResponse.json(recordings, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 