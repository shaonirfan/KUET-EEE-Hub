
import { NextResponse } from 'next/server';
import type { Resource } from '@/components/sections/ResourcesSection'; // Adjust path if Resource type is moved
import { google } from 'googleapis';

// --- START OF HARDCODED CREDENTIALS (FOR TESTING ONLY - INSECURE FOR PRODUCTION) ---
const GOOGLE_PROJECT_ID = "kuet-eee-hub";
const GOOGLE_CLIENT_EMAIL = "kueteeehub@kuet-eee-hub.iam.gserviceaccount.com";
const GOOGLE_PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCpxmwklKJQlDVR\n5KMXM6FpJkJr6kujp47VqfKbtze07pn6czNwT/RopdS1+35+CKWnEVsTAoAejban\nolmjY3nf7AyNYa1swUryOG6XvZYHkAHzJa3SJIncSo4pXQlWjKWf1dPV9ZTjhYXC\nUZ8JtiZp8BJ8dUrzowK092OmbLOFsAB2DzY8kmXoV1bKGzlopIxoKctBYgMXrq2U\nQJcuJkIjK4I29V4hjIPC1MYXGEtm6ExiH2E/Cn/sMncwLJjfPG0KSAacQwjZ0pHI\nbaADaCyn9/aCBzmZWggn+GNsgBjgTMjbID9hASOoI0ZlAkkDEd+D3WqYHhbX4xEz\ngyOaFeMxAgMBAAECggEAJ+5+KBp3lPlPEzxyKbZgnCE+FTDN6qex/kpTQFHXPeyy\n9cfbzOpZY7XBcq49AbrZ75Iy+CUp6kXNtN8IM1hl5YeZKjXTuxU5ogAo7vLOE2hJ\nNR3jJN6oOFKm3k6+MAezuwTpptT02JDitaJKBFg978PiLTjPUL/CFrtrSk0d6m7o\n1iWu2e4aMmk3qH0liA+tK+p6mSQYrG7WUdaOIcxif4gw05xwcQEel6YLUrizR+5I\ndAkd6wePm1W+6hepKuGEkRzzsvBVdN1oNmIVfAf13XO7XIWcC2wL7m6KPOB+nm39\nbjRThAG004ojlRPA7VoAxhpMoflytFaa07szd4572QKBgQDrqFaCf/ckuKkysLmZ\njPt+mYxGf6GyN65otzmeiBRuou5MhKNsvuxFQo4m6Phfbl+B/cWoHd68rFQ6EQe+\nNqkmSADN/ULjiCE4CbqEErzU9I8J5KZ//5hE1n6ENVWMzqF2SGOmE6MT0XhR7QR/\nEAW6CqSdHcv+7j7Ok7UafPKZtQKBgQC4bi9ly3RdkZNzg5DwhtU35dr3jCvjJ83v\nX0RnX/wU65JgaBqfJQj+8FWV+Z5yoeyFoXL+G33Pm3y2xqo8IO2ytyA0VG5oAzLU\n3rCFQZVH6qdluxTNNr1yh8ApT/MLTVsLBhkd7RSTTSPB8+NIaEQapL3Cov//lfu6\n//aSYXzhDQKBgBeGEEyqlXMW89zZg01uo1Q546TN7Mgrgr91Os02bEO3A+6jduTO\nEiu/vwznSJPOIr6JJIfpo2hWE3pQZON59Vya52molFq+JgLABdxVOoBPgU/NgUlZ\nrEuC1dJAuK97mOaDx162qxq5WDdlX4OHh+rQUSpV5R0njyFz4SoputXZAoGAP5uo\n9zfLY3YQ39cxhvNJ2GSLN7N9c3PH/9XglrKxE1oH+v4MqHSyfJLRQc98yVZ1Z8U+\nDsvWgWLECZnNHr3QnUGxdrrj9TWdM3O2d88duFcC8wAp9Xj6r+SH7venAG/mhY/N\n29dnsEH7oioGanOjgXjuBZIILtNApccf+G5tDoUCgYBPEObhrwb5bts1I8tg52Po\nVYsw6QprIqrXsv7sjcbbQ1WTvfwasHxE+r30tM1QiPsx0WuMpnaANWK3McePxmTJ\nxNx3crJakdB0QbLbcdUc6Jw8UiU5vvJqfRmm0LQjreuTiJMVa1qfZcE4Z8fZwnF5\nEnL3g6k/J3kgYvEmKa3SwA==\n-----END PRIVATE KEY-----`;
// IMPORTANT: Replace this with your actual Google Drive Folder ID that contains the Year folders (e.g., "4th Year")
const GOOGLE_DRIVE_FOLDER_ID = "YOUR_GOOGLE_DRIVE_FOLDER_ID_HERE"; 
// --- END OF HARDCODED CREDENTIALS ---


// Extended Resource type to include courseName, matching the frontend
interface ApiResource extends Resource {
  courseName?: string;
}


function getResourceType(mimeType?: string | null): Resource['type'] {
  if (!mimeType) return 'OTHER';
  if (mimeType.includes('pdf')) return 'PDF';
  if (mimeType.includes('vnd.openxmlformats-officedocument.wordprocessingml.document')) return 'DOCX';
  if (mimeType.includes('vnd.openxmlformats-officedocument.presentationml.presentation')) return 'PPT';
  return 'OTHER';
}

// New function to extract metadata from folder path and filename
function extractMetadataFromPath(
    fileName: string, 
    folderPathSegments: string[] // e.g., ["4th Year", "1st Sem", "EEE4101 VLSI Design", "Lecture Notes"]
  ): Pick<ApiResource, 'year' | 'semester' | 'category' | 'courseName' | 'tags'> {
  
  let year = 'All Years';
  let semester = 'All Semesters';
  let courseName = 'General';
  let category = 'Uncategorized';
  const tags: string[] = [];

  // Path segments are ordered from top-level (e.g., Year) down to the direct parent of the file (e.g., Category)
  // Example structure: Year/Semester/Course/Category/file.pdf

  if (folderPathSegments.length > 0) {
    const yearStr = folderPathSegments[0].toLowerCase();
    if (yearStr.includes('1st year')) year = '1st Year';
    else if (yearStr.includes('2nd year')) year = '2nd Year';
    else if (yearStr.includes('3rd year')) year = '3rd Year';
    else if (yearStr.includes('4th year')) year = '4th Year';
    else if (yearStr.includes('job prep')) { // Handle job prep as a top-level special case
      year = 'All Years'; // Or specific if needed
      semester = 'All Semesters';
      courseName = 'Job Preparation'; 
      category = folderPathSegments[1] || 'General'; // Next folder could be category
      if (folderPathSegments[1]) tags.push(folderPathSegments[1].toLowerCase().replace(/\s+/g, '-'));
      tags.push('job-preparation');
      // Early return for job prep structure if it's simpler
      // return { year, semester, courseName, category, tags }; 
    }
     // Add "year" string to tags, e.g., "1st-year"
    if (year !== 'All Years') tags.push(year.toLowerCase().replace(' ', '-'));
  }

  if (folderPathSegments.length > 1 && !courseName.includes('Job Preparation')) {
    const semStr = folderPathSegments[1].toLowerCase();
    if (semStr.includes('1st sem')) semester = '1st Sem';
    else if (semStr.includes('2nd sem')) semester = '2nd Sem';
    // Add "semester" string to tags
    if (semester !== 'All Semesters') tags.push(semester.toLowerCase().replace(' ', '-'));
  }

  if (folderPathSegments.length > 2 && !courseName.includes('Job Preparation')) {
    courseName = folderPathSegments[2]; // e.g., "EEE4101 VLSI Design"
    // Add course name parts to tags
    courseName.toLowerCase().split(/\s+|[\W_]+/).filter(Boolean).forEach(tag => tags.push(tag));
  }
  
  if (folderPathSegments.length > 3 && !courseName.includes('Job Preparation')) {
    const catStr = folderPathSegments[3].toLowerCase();
    // More specific category mapping
    if (catStr.includes('lecture notes') || catStr.includes('notes') || catStr.includes('slide') || catStr.includes('presentation')) category = 'Lecture Notes'; // Consolidate
    else if (catStr.includes('past paper') || catStr.includes('question')) category = 'Past Papers';
    else if (catStr.includes('lab manual') || catStr.includes('manual')) category = 'Lab Manuals';
    else if (catStr.includes('book')) category = 'Books';
    else if (catStr.includes('job prep')) category = 'Job Preparation'; // Though handled above, can be a sub-category too
    else category = folderPathSegments[3]; // Use folder name as category if not matched

    // Add category to tags
    tags.push(category.toLowerCase().replace(/\s+/g, '-'));
  } else if (folderPathSegments.length > 0 && courseName.includes('Job Preparation')) {
    // If it's job prep, and we have a subfolder, use that as category
     if (folderPathSegments[1]) {
        category = folderPathSegments[1];
        tags.push(category.toLowerCase().replace(/\s+/g, '-'));
     } else {
        category = 'General'; // Default category for Job Prep if no subfolder
     }
  }


  // Add some tags from filename itself
  fileName.toLowerCase().split(/\s+|[\W_]+/).filter(Boolean).forEach(tag => {
    if (tag !== 'pdf' && tag !== 'docx' && tag !== 'pptx' && tag !== 'doc' && tag !== 'ppt' && !tags.includes(tag)) {
      tags.push(tag);
    }
  });
  
  return {
    year,
    semester,
    courseName,
    category,
    tags: [...new Set(tags)], // Deduplicate tags
  };
}


export async function GET() {
  if (!GOOGLE_PROJECT_ID || !GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY || GOOGLE_DRIVE_FOLDER_ID === "YOUR_GOOGLE_DRIVE_FOLDER_ID_HERE") {
    console.error("Google Drive API credentials or Root Folder ID are not correctly set. Ensure GOOGLE_DRIVE_FOLDER_ID is replaced with your actual root folder ID containing year-specific folders.");
    return NextResponse.json({ message: "Server configuration error: Missing Google Drive API credentials or Root Folder ID. The placeholder GOOGLE_DRIVE_FOLDER_ID must be replaced." }, { status: 500 });
  }
  
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

    // 1. Fetch all folders to build a path map
    const folderRes = await drive.files.list({
      q: "mimeType='application/vnd.google-apps.folder' and trashed=false",
      fields: 'files(id, name, parents)',
      pageSize: 1000, // Adjust if you have more folders
    });
    const allFolders = folderRes.data.files || [];
    const folderMap = new Map<string, { name: string, parentId: string | null }>();
    allFolders.forEach(folder => {
      folderMap.set(folder.id!, { name: folder.name!, parentId: folder.parents ? folder.parents[0] : null });
    });

    // 2. Fetch all files
    const filesRes = await drive.files.list({
        // Query for files that are descendants of the GOOGLE_DRIVE_FOLDER_ID
        // This is a bit tricky. A simpler way is to fetch all files and then filter them programmatically
        // if they are under the GOOGLE_DRIVE_FOLDER_ID path.
        // For now, let's fetch all files and then determine path.
      q: `mimeType != 'application/vnd.google-apps.folder' and trashed=false`,
      fields: 'files(id, name, mimeType, webViewLink, webContentLink, createdTime, modifiedTime, parents)',
      pageSize: 1000, // Adjust if more files
      orderBy: 'modifiedTime desc',
    });
    const driveFiles = filesRes.data.files || [];

    const resources: ApiResource[] = [];
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    for (const file of driveFiles) {
      if (!file.id || !file.name || !file.parents || file.parents.length === 0) continue;

      const pathSegments: string[] = [];
      let currentParentId: string | null = file.parents[0];
      let depth = 0; // To prevent infinite loops or excessively deep traversals

      while (currentParentId && currentParentId !== GOOGLE_DRIVE_FOLDER_ID && depth < 10) {
        const folderDetail = folderMap.get(currentParentId);
        if (folderDetail) {
          pathSegments.unshift(folderDetail.name); // Add to the beginning to build path from top->down
          currentParentId = folderDetail.parentId;
        } else {
          currentParentId = null; // Parent not found in our map, stop
        }
        depth++;
      }

      // Only include files that are descendants of GOOGLE_DRIVE_FOLDER_ID
      // This is checked by seeing if the loop terminated because currentParentId became GOOGLE_DRIVE_FOLDER_ID
      // If currentParentId is null here, it means the file is not under the target root, or path is too deep.
      // If pathSegments is empty and file.parents[0] is GOOGLE_DRIVE_FOLDER_ID, it means file is directly in root.
      // We expect files to be nested, so pathSegments should not be empty if GOOGLE_DRIVE_FOLDER_ID is the actual root.

      let isDescendant = false;
      if (currentParentId === GOOGLE_DRIVE_FOLDER_ID && pathSegments.length > 0) {
        isDescendant = true;
      } else if (file.parents.includes(GOOGLE_DRIVE_FOLDER_ID) && pathSegments.length === 0) {
        // File is directly in the root folder. This logic might need adjustment
        // based on whether files are allowed directly in GOOGLE_DRIVE_FOLDER_ID
        // For now, we assume a structure like Root/Year/Sem/Course/Category/file.pdf
        // So a file directly in root is likely not part of the structured resources.
        // Let's allow it for now, pathSegments will be empty, metadata will be default.
        // isDescendant = true; // Or set to false if direct files in root are not resources
      }


      if (isDescendant) {
        const metadata = extractMetadataFromPath(file.name, pathSegments);
        const modifiedDate = file.modifiedTime ? new Date(file.modifiedTime) : new Date(0);
        const isActuallyNew = modifiedDate > oneWeekAgo;

        resources.push({
          id: file.id,
          name: file.name,
          type: getResourceType(file.mimeType),
          url: file.webViewLink || file.webContentLink || '#',
          ...metadata,
          isNew: isActuallyNew,
          isPopular: false, // Popularity is harder to determine automatically this way
        });
      }
    }
    
    if (resources.length === 0 && driveFiles.length > 0) {
        console.warn(`No resources processed. This might be due to GOOGLE_DRIVE_FOLDER_ID ('${GOOGLE_DRIVE_FOLDER_ID}') not being an ancestor of any files, or the folder structure doesn't match expectations for path reconstruction.`);
    }


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
