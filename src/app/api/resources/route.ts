
import { NextResponse } from 'next/server';
import type { Resource } from '@/components/sections/ResourcesSection'; // Adjust path if Resource type is moved
import { google } from 'googleapis';

// --- START OF HARDCODED CREDENTIALS (FOR TESTING ONLY - INSECURE FOR PRODUCTION) ---
const GOOGLE_PROJECT_ID = "kuet-eee-hub";
const GOOGLE_CLIENT_EMAIL = "kueteeehub@kuet-eee-hub.iam.gserviceaccount.com";
const GOOGLE_PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCpxmwklKJQlDVR\n5KMXM6FpJkJr6kujp47VqfKbtze07pn6czNwT/RopdS1+35+CKWnEVsTAoAejban\nolmjY3nf7AyNYa1swUryOG6XvZYHkAHzJa3SJIncSo4pXQlWjKWf1dPV9ZTjhYXC\nUZ8JtiZp8BJ8dUrzowK092OmbLOFsAB2DzY8kmXoV1bKGzlopIxoKctBYgMXrq2U\nQJcuJkIjK4I29V4hjIPC1MYXGEtm6ExiH2E/Cn/sMncwLJjfPG0KSAacQwjZ0pHI\nbaADaCyn9/aCBzmZWggn+GNsgBjgTMjbID9hASOoI0ZlAkkDEd+D3WqYHhbX4xEz\ngyOaFeMxAgMBAAECggEAJ+5+KBp3lPlPEzxyKbZgnCE+FTDN6qex/kpTQFHXPeyy\n9cfbzOpZY7XBcq49AbrZ75Iy+CUp6kXNtN8IM1hl5YeZKjXTuxU5ogAo7vLOE2hJ\nNR3jJN6oOFKm3k6+MAezuwTpptT02JDitaJKBFg978PiLTjPUL/CFrtrSk0d6m7o\n1iWu2e4aMmk3qH0liA+tK+p6mSQYrG7WUdaOIcxif4gw05xwcQEel6YLUrizR+5I\ndAkd6wePm1W+6hepKuGEkRzzsvBVdN1oNmIVfAf13XO7XIWcC2wL7m6KPOB+nm39\nbjRThAG004ojlRPA7VoAxhpMoflytFaa07szd4572QKBgQDrqFaCf/ckuKkysLmZ\njPt+mYxGf6GyN65otzmeiBRuou5MhKNsvuxFQo4m6Phfbl+B/cWoHd68rFQ6EQe+\nNqkmSADN/ULjiCE4CbqEErzU9I8J5KZ//5hE1n6ENVWMzqF2SGOmE6MT0XhR7QR/\nEAW6CqSdHcv+7j7Ok7UafPKZtQKBgQC4bi9ly3RdkZNzg5DwhtU35dr3jCvjJ83v\nX0RnX/wU65JgaBqfJQj+8FWV+Z5yoeyFoXL+G33Pm3y2xqo8IO2ytyA0VG5oAzLU\n3rCFQZVH6qdluxTNNr1yh8ApT/MLTVsLBhkd7RSTTSPB8+NIaEQapL3Cov//lfu6\n//aSYXzhDQKBgBeGEEyqlXMW89zZg01uo1Q546TN7Mgrgr91Os02bEO3A+6jduTO\nEiu/vwznSJPOIr6JJIfpo2hWE3pQZON59Vya52molFq+JgLABdxVOoBPgU/NgUlZ\nrEuC1dJAuK97mOaDx162qxq5WDdlX4OHh+rQUSpV5R0njyFz4SoputXZAoGAP5uo\n9zfLY3YQ39cxhvNJ2GSLN7N9c3PH/9XglrKxE1oH+v4MqHSyfJLRQc98yVZ1Z8U+\nDsvWgWLECZnNHr3QnUGxdrrj9TWdM3O2d88duFcC8wAp9Xj6r+SH7venAG/mhY/N\n29dnsEH7oioGanOjgXjuBZIILtNApccf+G5tDoUCgYBPEObhrwb5bts1I8tg52Po\nVYsw6QprIqrXsv7sjcbbQ1WTvfwasHxE+r30tM1QiPsx0WuMpnaANWK3McePxmTJ\nxNx3crJakdB0QbLbcdUc6Jw8UiU5vvJqfRmm0LQjreuTiJMVa1qfZcE4Z8fZwnF5\nEnL3g6k/J3kgYvEmKa3SwA==\n-----END PRIVATE KEY-----`;
// IMPORTANT: Replace this with your actual Google Drive Folder ID
const GOOGLE_DRIVE_FOLDER_ID = "YOUR_GOOGLE_DRIVE_FOLDER_ID_HERE"; 
// --- END OF HARDCODED CREDENTIALS ---

// Helper function to map Google Drive file types to your Resource['type']
function getResourceType(mimeType?: string | null): Resource['type'] {
  if (!mimeType) return 'OTHER';
  if (mimeType.includes('pdf')) return 'PDF';
  if (mimeType.includes('vnd.openxmlformats-officedocument.wordprocessingml.document')) return 'DOCX';
  if (mimeType.includes('vnd.openxmlformats-officedocument.presentationml.presentation')) return 'PPT';
  return 'OTHER';
}

// Placeholder for your actual logic to determine year, semester, category, tags from file name or folder structure
// This is highly dependent on how you organize your Drive files.
// For now, it will return defaults. You'll need to customize this heavily.
function extractMetadataFromName(name: string): Pick<Resource, 'year' | 'semester' | 'category' | 'tags' | 'isNew' | 'isPopular'> {
  // Example: "1st Year_1st Sem_Analog Electronics_Lecture Notes_Chapter 1.pdf"
  // You would parse this name to extract metadata.
  // This is a very basic example, and you'll need robust parsing.
  let year = 'All Years';
  let semester = 'All Semesters';
  let category = 'Lecture Notes'; // Default category

  const nameLower = name.toLowerCase();

  if (nameLower.includes('1st year')) year = '1st Year';
  else if (nameLower.includes('2nd year')) year = '2nd Year';
  else if (nameLower.includes('3rd year')) year = '3rd Year';
  else if (nameLower.includes('4th year')) year = '4th Year';

  if (nameLower.includes('1st sem')) semester = '1st Sem';
  else if (nameLower.includes('2nd sem')) semester = '2nd Sem';
  
  if (nameLower.includes('lab manual')) category = 'Lab Manuals';
  else if (nameLower.includes('past paper') || nameLower.includes('question')) category = 'Past Papers';
  else if (nameLower.includes('book')) category = 'Books';
  else if (nameLower.includes('presentation') || nameLower.includes('slide')) category = 'Presentations';
  else if (nameLower.includes('job prep')) category = 'Job Preparation';


  // Basic tag extraction (example)
  const tags: string[] = [];
  if (nameLower.includes('electronics')) tags.push('electronics');
  if (nameLower.includes('dsp')) tags.push('dsp');
  if (nameLower.includes('vlsi')) tags.push('vlsi');
  if (nameLower.includes('communication')) tags.push('communication');


  return {
    year,
    semester,
    category,
    tags,
    isNew: nameLower.includes('new'), // Example: if "new" is in filename
    isPopular: nameLower.includes('popular'), // Example: if "popular" is in filename
  };
}


export async function GET() {
  // Check if critical hardcoded values are set (especially the folder ID placeholder)
  if (!GOOGLE_PROJECT_ID || !GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY || GOOGLE_DRIVE_FOLDER_ID === "YOUR_GOOGLE_DRIVE_FOLDER_ID_HERE") {
    console.error("Google Drive API credentials or Folder ID are not correctly set in the code. Ensure GOOGLE_PROJECT_ID, GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY are present and GOOGLE_DRIVE_FOLDER_ID is replaced with your actual folder ID.");
    return NextResponse.json({ message: "Server configuration error: Missing Google Drive API credentials or Folder ID in the code. The placeholder GOOGLE_DRIVE_FOLDER_ID must be replaced." }, { status: 500 });
  }
  
  // The private key from the JSON file includes literal \n characters.
  // When hardcoded as a template literal, these are preserved.
  // If it were a regular string, they would need to be escaped as \\n.
  const privateKey = GOOGLE_PRIVATE_KEY;

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        project_id: GOOGLE_PROJECT_ID,
        client_email: GOOGLE_CLIENT_EMAIL,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });

    const drive = google.drive({ version: 'v3', auth });

    const response = await drive.files.list({
      q: `'${GOOGLE_DRIVE_FOLDER_ID}' in parents and trashed = false`, // List files in the specific folder
      fields: 'files(id, name, mimeType, webViewLink, webContentLink, createdTime, modifiedTime)', // Add modifiedTime
      pageSize: 100, // Adjust as needed
      orderBy: 'modifiedTime desc', // Get newest files first to help with "isNew" logic
    });

    const files = response.data.files;
    if (!files) {
      return NextResponse.json({ message: "No files found in the specified Google Drive folder or error fetching." }, { status: 404 });
    }

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const resources: Resource[] = files.map((file) => {
      const metadata = extractMetadataFromName(file.name || 'Untitled');
      const modifiedDate = file.modifiedTime ? new Date(file.modifiedTime) : new Date(0);
      
      // Override isNew based on modifiedTime if more reliable
      const isActuallyNew = modifiedDate > oneWeekAgo;

      return {
        id: file.id || '',
        name: file.name || 'Untitled Document',
        type: getResourceType(file.mimeType),
        url: file.webViewLink || file.webContentLink || '#', // Prefer webViewLink for direct viewing
        ...metadata,
        isNew: metadata.isNew || isActuallyNew, // Combine filename hint with actual date
      };
    });

    return NextResponse.json(resources);

  } catch (error) {
    console.error("Failed to fetch resources from Google Drive:", error);
    let errorMessage = "Failed to fetch resources from Google Drive.";
    if (error instanceof Error) {
        errorMessage += ` Details: ${error.message}`;
    }
    if (typeof error === 'object' && error !== null && 'response' in error) {
        const gError = error as { response?: { data?: { error?: { message?: string } } } };
        if (gError.response?.data?.error?.message) {
            errorMessage += ` Google API Error: ${gError.response.data.error.message}`;
        }
    }

    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

// Dummy data as a fallback (can be removed if API is stable or error handling is robust)
const dummyResources: Resource[] = [
  { id: '1', name: 'Analog Electronics Fundamentals', type: 'PDF', year: '1st Year', semester: '1st Sem', category: 'Lecture Notes', isNew: true, isPopular: true, url: '#', tags: ['electronics', 'analog'] },
  { id: '2', name: 'Advanced Digital Signal Processing', type: 'DOCX', year: '2nd Year', semester: '2nd Sem', category: 'Lecture Notes', isNew: false, isPopular: true, url: '#', tags: ['dsp', 'digital'] },
  { id: '3', name: 'Modern VLSI Design Techniques', type: 'PPT', year: '3rd Year', semester: '1st Sem', category: 'Presentations', isNew: true, isPopular: false, url: '#', tags: ['vlsi', 'design'] },
  { id: '4', name: 'Comprehensive Job Preparation Guide', type: 'PDF', year: 'All Years', semester: 'All Semesters', category: 'Job Preparation', isNew: false, isPopular: true, url: '#', tags: ['jobs', 'career'] },
  { id: '5', name: 'Communication Systems Lab Manual', type: 'PDF', year: '3rd Year', semester: '1st Sem', category: 'Lab Manuals', isNew: false, isPopular: false, url: '#', tags: ['communication', 'lab'] },
  { id: '6', name: 'Introduction to Control Systems', type: 'PDF', year: '2nd Year', semester: '2nd Sem', category: 'Books', isNew: false, isPopular: false, url: '#', tags: ['control systems', 'textbook'] },
  { id: '7', name: 'Data Structures and Algorithms', type: 'PDF', year: '1st Year', semester: '2nd Sem', category: 'Lecture Notes', isNew: true, isPopular: false, url: '#', tags: ['dsa', 'programming'] },
  { id: '8', name: 'Power Electronics Question Bank', type: 'PDF', year: '4th Year', semester: 'All Semesters', category: 'Past Papers', isNew: false, isPopular: true, url: '#', tags: ['power electronics', 'questions'] },
];
