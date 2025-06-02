
import { NextResponse } from 'next/server';
import type { Resource } from '@/components/sections/ResourcesSection'; // Adjust path if Resource type is moved
import { google } from 'googleapis';

// --- START OF HARDCODED CREDENTIALS (FOR TESTING ONLY - INSECURE FOR PRODUCTION) ---
const GOOGLE_PROJECT_ID = "kuet-eee-hub";
const GOOGLE_CLIENT_EMAIL = "kueteeehub@kuet-eee-hub.iam.gserviceaccount.com";
const GOOGLE_PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCpxmwklKJQlDVR\n5KMXM6FpJkJr6kujp47VqfKbtze07pn6czNwT/RopdS1+35+CKWnEVsTAoAejban\nolmjY3nf7AyNYa1swUryOG6XvZYHkAHzJa3SJIncSo4pXQlWjKWf1dPV9ZTjhYXC\nUZ8JtiZp8BJ8dUrzowK092OmbLOFsAB2DzY8kmXoV1bKGzlopIxoKctBYgMXrq2U\nQJcuJkIjK4I29V4hjIPC1MYXGEtm6ExiH2E/Cn/sMncwLJjfPG0KSAacQwjZ0pHI\nbaADaCyn9/aCBzmZWggn+GNsgBjgTMjbID9hASOoI0ZlAkkDEd+D3WqYHhbX4xEz\ngyOaFeMxAgMBAAECggEAJ+5+KBp3lPlPEzxyKbZgnCE+FTDN6qex/kpTQFHXPeyy\n9cfbzOpZY7XBcq49AbrZ75Iy+CUp6kXNtN8IM1hl5YeZKjXTuxU5ogAo7vLOE2hJ\nNR3jJN6oOFKm3k6+MAezuwTpptT02JDitaJKBFg978PiLTjPUL/CFrtrSk0d6m7o\n1iWu2e4aMmk3qH0liA+tK+p6mSQYrG7WUdaOIcxif4gw05xwcQEel6YLUrizR+5I\ndAkd6wePm1W+6hepKuGEkRzzsvBVdN1oNmIVfAf13XO7XIWcC2wL7m6KPOB+nm39\nbjRThAG004ojlRPA7VoAxhpMoflytFaa07szd4572QKBgQDrqFaCf/ckuKkysLmZ\njPt+mYxGf6GyN65otzmeiBRuou5MhKNsvuxFQo4m6Phfbl+B/cWoHd68rFQ6EQe+\nNqkmSADN/ULjiCE4CbqEErzU9I8J5KZ//5hE1n6ENVWMzqF2SGOmE6MT0XhR7QR/\nEAW6CqSdHcv+7j7Ok7UafPKZtQKBgQC4bi9ly3RdkZNzg5DwhtU35dr3jCvjJ83v\nX0RnX/wU65JgaBqfJQj+8FWV+Z5yoeyFoXL+G33Pm3y2xqo8IO2ytyA0VG5oAzLU\n3rCFQZVH6qdluxTNNr1yh8ApT/MLTVsLBhkd7RSTTSPB8+NIaEQapL3Cov//lfu6\n//aSYXzhDQKBgBeGEEyqlXMW89zZg01uo1Q546TN7Mgrgr91Os02bEO3A+6jduTO\nEiu/vwznSJPOIr6JJIfpo2hWE3pQZON59Vya52molFq+JgLABdxVOoBPgU/NgUlZ\nrEuC1dJAuK97mOaDx162qxq5WDdlX4OHh+rQUSpV5R0njyFz4SoputXZAoGAP5uo\n9zfLY3YQ39cxhvNJ2GSLN7N9c3PH/9XglrKxE1oH+v4MqHSyfJLRQc98yVZ1Z8U+\nDsvWgWLECZnNHr3QnUGxdrrj9TWdM3O2d88duFcC8wAp9Xj6r+SH7venAG/mhY/N\n29dnsEH7oioGanOjgXjuBZIILtNApccf+G5tDoUCgYBPEObhrwb5bts1I8tg52Po\nVYsw6QprIqrXsv7sjcbbQ1WTvfwasHxE+r30tM1QiPsx0WuMpnaANWK3McePxmTJ\nxNx3crJakdB0QbLbcdUc6Jw8UiU5vvJqfRmm0LQjreuTiJMVa1qfZcE4Z8fZwnF5\nEnL3g6k/J3kgYvEmKa3SwA==\n-----END PRIVATE KEY-----`;
const GOOGLE_DRIVE_FOLDER_ID = "13JvPCZ-9J7jTURIh-znRoo4Gly4FraH4"; 


interface ApiResource extends Resource {
  courseName?: string;
  teacherName?: string;
}


function getResourceType(mimeType?: string | null): Resource['type'] {
  if (!mimeType) return 'OTHER';
  if (mimeType.includes('pdf')) return 'PDF';
  if (mimeType.includes('vnd.openxmlformats-officedocument.wordprocessingml.document')) return 'DOCX';
  if (mimeType.includes('vnd.openxmlformats-officedocument.presentationml.presentation')) return 'PPT';
  return 'OTHER';
}

function extractMetadataFromPath(
    fileName: string, 
    folderPathSegments: string[] // e.g., ["4th Year", "1st Sem", "EEE4101 VLSI Design", "Monir Sir", "Lecture Notes"]
  ): Pick<ApiResource, 'year' | 'semester' | 'courseName' | 'teacherName' | 'category' | 'tags'> {
  
  let year = 'All Years';
  let semester = 'All Semesters';
  let courseName = 'General';
  let teacherName = 'All Teachers'; 
  let category = 'Uncategorized';
  const tags: string[] = [];

  if (folderPathSegments.length > 0) {
    const firstSegmentLower = folderPathSegments[0].toLowerCase();
    if (firstSegmentLower.includes('1st year')) year = '1st Year';
    else if (firstSegmentLower.includes('2nd year')) year = '2nd Year';
    else if (firstSegmentLower.includes('3rd year')) year = '3rd Year';
    else if (firstSegmentLower.includes('4th year')) year = '4th Year';
    else if (firstSegmentLower.includes('job prep')) {
      year = 'All Years'; // Or keep as "Job Preparation" if preferred for display
      semester = 'All Semesters';
      courseName = 'Job Preparation'; 
      tags.push('job-preparation');
      
      // For Job Prep: Job Prep / [TeacherOrCat] / [CategoryIfTeacherPresent] / file
      if (folderPathSegments.length > 1) {
        const seg2Lower = folderPathSegments[1].toLowerCase();
        const commonCategories = ['lecture notes', 'past paper', 'lab manual', 'book', 'notes', 'slide', 'presentation', 'question', 'guides'];
        if (commonCategories.some(cat => seg2Lower.includes(cat))) {
            category = folderPathSegments[1];
            teacherName = 'All Teachers'; 
        } else {
            teacherName = folderPathSegments[1]; 
            if(folderPathSegments.length > 2) {
                category = folderPathSegments[2];
            } else {
                category = 'General'; // If only one subfolder, assume it's teacher/sub-type and category is general
            }
            if (teacherName !== 'All Teachers') tags.push(teacherName.toLowerCase().replace(/\s+/g, '-'));
        }
      } else {
         category = 'General'; // Default category for Job Prep if no subfolders
      }
      if (category !== 'Uncategorized' && category !== 'General') tags.push(category.toLowerCase().replace(/\s+/g, '-'));
    } // End of Job Prep specific logic
    if (year !== 'All Years' && !tags.includes(year.toLowerCase().replace(' ', '-'))) tags.push(year.toLowerCase().replace(' ', '-'));
  }

  // Standard academic path parsing (if not Job Prep)
  if (!courseName.includes('Job Preparation')) {
    if (folderPathSegments.length > 1) { // Semester
      const semStr = folderPathSegments[1].toLowerCase();
      if (semStr.includes('1st sem')) semester = '1st Sem';
      else if (semStr.includes('2nd sem')) semester = '2nd Sem';
      if (semester !== 'All Semesters' && !tags.includes(semester.toLowerCase().replace(' ', '-'))) tags.push(semester.toLowerCase().replace(' ', '-'));
    }

    if (folderPathSegments.length > 2) { // Course Name
      courseName = folderPathSegments[2]; 
      // Add course name words as tags (excluding common short words if needed)
      courseName.toLowerCase().split(/\s+|[\W_]+/).filter(Boolean).forEach(tag => {
        if (!tags.includes(tag)) tags.push(tag);
      });
    }
    
    // Teacher Name (expected at segment 3 if present) and Category (expected at segment 4 if teacher present, else segment 3)
    // Path: Year/Semester/CourseName/TeacherName/Category/file.pdf (5 segments to category)
    // Path: Year/Semester/CourseName/Category/file.pdf (4 segments to category, no explicit teacher)
    
    if (folderPathSegments.length > 3) { // Potential Teacher or Category
        const segment3Lower = folderPathSegments[3].toLowerCase();
        const commonCategoriesForDisambiguation = ['lecture notes', 'past paper', 'lab manual', 'book', 'notes', 'slide', 'presentation', 'question', 'guides', 'questions', 'manuals', 'slides', 'books'];

        if (folderPathSegments.length > 4 && !commonCategoriesForDisambiguation.some(cat => segment3Lower.includes(cat))) { 
            // If there's a 5th segment, and the 4th segment doesn't look like a category, assume 4th is Teacher
            teacherName = folderPathSegments[3];
            category = folderPathSegments[4];
            if (teacherName !== 'All Teachers' && !tags.includes(teacherName.toLowerCase().replace(/\s+/g, '-'))) tags.push(teacherName.toLowerCase().replace(/\s+/g, '-'));
        } else {
            // Assume segment 3 is Category (no explicit teacher folder, or teacher folder IS the category)
            category = folderPathSegments[3];
            // teacherName remains 'All Teachers'
        }
    }
  } // End of standard academic path parsing
  
  // Refined category mapping - applied to whatever 'category' string we ended up with
  const catStrLower = category.toLowerCase();
  if (catStrLower.includes('lecture notes') || catStrLower.includes('notes') || catStrLower.includes('slide') || catStrLower.includes('presentation')) category = 'Lecture Notes';
  else if (catStrLower.includes('past paper') || catStrLower.includes('question')) category = 'Past Papers';
  else if (catStrLower.includes('lab manual') || catStrLower.includes('manual')) category = 'Lab Manuals';
  else if (catStrLower.includes('book')) category = 'Books';
  // No else: keep original category if not matched (e.g., it was 'Job Preparation', 'Uncategorized', or a custom one)

  if (category !== 'Uncategorized' && !tags.includes(category.toLowerCase().replace(/\s+/g, '-'))) {
      tags.push(category.toLowerCase().replace(/\s+/g, '-'));
  }


  // Add some tags from filename itself (generic, applied to all)
  fileName.toLowerCase().split(/\s+|[\W_]+/).filter(Boolean).forEach(tag => {
    if (tag !== 'pdf' && tag !== 'docx' && tag !== 'pptx' && tag !== 'doc' && tag !== 'ppt' && !tags.includes(tag)) {
      tags.push(tag);
    }
  });
  
  return {
    year,
    semester,
    courseName,
    teacherName,
    category,
    tags: [...new Set(tags)], // Deduplicate tags
  };
}


export async function GET() {
  if (!GOOGLE_PROJECT_ID || !GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY || GOOGLE_DRIVE_FOLDER_ID === "YOUR_GOOGLE_DRIVE_FOLDER_ID_HERE" || !GOOGLE_DRIVE_FOLDER_ID) {
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

    // 1. Get all folders to build a map for path reconstruction
    const folderRes = await drive.files.list({
      q: "mimeType='application/vnd.google-apps.folder' and trashed=false",
      fields: 'files(id, name, parents)',
      pageSize: 1000, // Adjust if you have more than 1000 folders
    });
    const allFolders = folderRes.data.files || [];
    const folderMap = new Map<string, { name: string, parentId: string | null }>();
    allFolders.forEach(folder => {
      if (folder.id && folder.name) { // Ensure id and name are not null
        folderMap.set(folder.id, { name: folder.name, parentId: folder.parents ? folder.parents[0] : null });
      }
    });

    // 2. Get all files (not folders)
    const filesRes = await drive.files.list({
      // Query for files that are descendants of the GOOGLE_DRIVE_FOLDER_ID.
      // This is more efficient if your Drive has many files outside the target folder.
      // However, 'in parents' only checks direct parent. We need to list all files and then filter.
      q: `mimeType != 'application/vnd.google-apps.folder' and trashed=false`,
      fields: 'files(id, name, mimeType, webViewLink, webContentLink, createdTime, modifiedTime, parents)',
      pageSize: 1000, // Adjust if you have more than 1000 files
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
      let depth = 0; // Safety break for very deep or circular structures

      // Reconstruct path from file up to the root or GOOGLE_DRIVE_FOLDER_ID
      while (currentParentId && currentParentId !== GOOGLE_DRIVE_FOLDER_ID && depth < 10) { // Max depth of 10 for path relevant to us
        const folderDetail = folderMap.get(currentParentId);
        if (folderDetail) {
          pathSegments.unshift(folderDetail.name); // Add to beginning to build path from top down
          currentParentId = folderDetail.parentId;
        } else {
          // This parent isn't in our map, maybe it's above GOOGLE_DRIVE_FOLDER_ID or an error
          currentParentId = null; 
        }
        depth++;
      }
      
      // Check if the file is indeed a descendant of GOOGLE_DRIVE_FOLDER_ID
      // This happens if the loop above stopped because currentParentId BECAME GOOGLE_DRIVE_FOLDER_ID
      // AND we have some path segments (meaning it wasn't a direct child whose parent check failed early)
      // OR if the file's direct parent was GOOGLE_DRIVE_FOLDER_ID (pathSegments would be empty here).
      // A more robust check: the GOOGLE_DRIVE_FOLDER_ID must have been encountered in the parent chain.
      let isDescendant = false;
      if (currentParentId === GOOGLE_DRIVE_FOLDER_ID && pathSegments.length > 0) {
        // The loop stopped at GOOGLE_DRIVE_FOLDER_ID, and we have path segments below it
        isDescendant = true;
      } else if (file.parents[0] === GOOGLE_DRIVE_FOLDER_ID && pathSegments.length === 0) {
        // The file is a direct child of GOOGLE_DRIVE_FOLDER_ID, pathSegments remains empty
        // The metadata extraction will handle empty pathSegments as general/uncategorized
        isDescendant = true; 
      }


      if (isDescendant) {
        const metadata = extractMetadataFromPath(file.name, pathSegments);
        const modifiedDate = file.modifiedTime ? new Date(file.modifiedTime) : new Date(0);
        const isActuallyNew = modifiedDate > oneWeekAgo;

        resources.push({
          id: file.id,
          name: file.name,
          type: getResourceType(file.mimeType),
          url: file.webViewLink || file.webContentLink || '#', // Prefer webViewLink for direct viewing
          ...metadata, // This will include year, semester, courseName, teacherName, category, tags
          isNew: isActuallyNew, // Based on actual modified time
          isPopular: false, // Popularity logic would need more implementation (e.g., view counts)
        });
      }
    }
    
    if (resources.length === 0 && driveFiles.length > 0) {
        // This warning helps if GOOGLE_DRIVE_FOLDER_ID is wrong or no files are *under* it as expected
        console.warn(`No resources processed. This might be due to GOOGLE_DRIVE_FOLDER_ID ('${GOOGLE_DRIVE_FOLDER_ID}') not being an ancestor of any files, or the folder structure doesn't match expectations for path reconstruction. Example path segments for first found file: ${JSON.stringify(driveFiles[0]?.parents)}. Folder map size: ${folderMap.size}`);
    }


    return NextResponse.json(resources);

  } catch (error) {
    console.error("Failed to fetch resources from Google Drive:", error);
    let errorMessage = "Failed to fetch resources from Google Drive.";
    if (error instanceof Error) {
        errorMessage += ` Details: ${error.message}`;
    }
    // Check for Google API specific error structure
    if (typeof error === 'object' && error !== null && 'response' in error) {
        const gError = error as { response?: { data?: { error?: { message?: string } } } };
        if (gError.response?.data?.error?.message) {
            errorMessage += ` Google API Error: ${gError.response.data.error.message}`;
        }
    }
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
