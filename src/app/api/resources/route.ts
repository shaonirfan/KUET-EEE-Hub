
import { NextResponse } from 'next/server';
import type { Resource } from '@/components/sections/ResourcesSection'; // Adjust path if Resource type is moved
import { google } from 'googleapis';

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
  const { GOOGLE_PROJECT_ID, GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_DRIVE_FOLDER_ID } = process.env;

  if (!GOOGLE_PROJECT_ID || !GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_DRIVE_FOLDER_ID) {
    console.error("Google Drive API environment variables are not set.");
    // Fallback to dummy data or return an error
    return NextResponse.json({ message: "Server configuration error: Missing Google Drive API credentials or Folder ID." }, { status: 500 });
  }
  
  // Replace \\n with \n in the private key if they were escaped for environment variable.
  const privateKey = GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');

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
    // Fallback to dummy data or return an error
    // You might want more sophisticated error handling or logging here
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
