
import { NextResponse } from 'next/server';
import type { Resource } from '@/components/sections/ResourcesSection'; // Adjust path if Resource type is moved
import { google } from 'googleapis';

// --- START OF HARDCODED CREDENTIALS (FOR TESTING ONLY - INSECURE FOR PRODUCTION) ---
const GOOGLE_PROJECT_ID = "kuet-eee-hub";
const GOOGLE_CLIENT_EMAIL = "kueteeehub@kuet-eee-hub.iam.gserviceaccount.com";
const GOOGLE_PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCpxmwklKJQlDVR\n5KMXM6FpJkJr6kujp47VqfKbtze07pn6czNwT/RopdS1+35+CKWnEVsTAoAejban\nolmjY3nf7AyNYa1swUryOG6XvZYHkAHzJa3SJIncSo4pXQlWjKWf1dPV9ZTjhYXC\nUZ8JtiZp8BJ8dUrzowK092OmbLOFsAB2DzY8kmXoV1bKGzlopIxoKctBYgMXrq2U\nQJcuJkIjK4I29V4hjIPC1MYXGEtm6ExiH2E/Cn/sMncwLJjfPG0KSAacQwjZ0pHI\nbaADaCyn9/aCBzmZWggn+GNsgBjgTMjbID9hASOoI0ZlAkkDEd+D3WqYHhbX4xEz\ngyOaFeMxAgMBAAECggEAJ+5+KBp3lPlPEzxyKbZgnCE+FTDN6qex/kpTQFHXPeyy\n9cfbzOpZY7XBcq49AbrZ75Iy+CUp6kXNtN8IM1hl5YeZKjXTuxU5ogAo7vLOE2hJ\nNR3jJN6oOFKm3k6+MAezuwTpptT02JDitaJKBFg978PiLTjPUL/CFrtrSk0d6m7o\n1iWu2e4aMmk3qH0liA+tK+p6mSQYrG7WUdaOIcxif4gw05xwcQEel6YLUrizR+5I\ndAkd6wePm1W+6hepKuGEkRzzsvBVdN1oNmIVfAf13XO7XIWcC2wL7m6KPOB+nm39\nbjRThAG004ojlRPA7VoAxhpMoflytFaa07szd4572QKBgQDrqFaCf/ckuKkysLmZ\njPt+mYxGf6GyN65otzmeiBRuou5MhKNsvuxFQo4m6Phfbl+B/cWoHd68rFQ6EQe+\nNqkmSADN/ULjiCE4CbqEErzU9I8J5KZ//5hE1n6ENVWMzqF2SGOmE6MT0XhR7QR/\nEAW6CqSdHcv+7j7Ok7UafPKZtQKBgQC4bi9ly3RdkZNzg5DwhtU35dr3jCvjJ83v\nX0RnX/wU65JgaBqfJQj+8FWV+Z5yoeyFoXL+G33Pm3y2xqo8IO2ytyA0VG5oAzLU\n3rCFQZVH6qdluxTNNr1yh8ApT/MLTVsLBhkd7RSTTSPB8+NIaEQapL3Cov//lfu6\n//aSYXzhDQKBgBeGEEyqlXMW89zZg01uo1Q546TN7Mgrgr91Os02bEO3A+6jduTO\nEiu/vwznSJPOIr6JJIfpo2hWE3pQZON59Vya52molFq+JgLABdxVOoBPgU/NgUlZ\nrEuC1dJAuK97mOaDx162qxq5WDdlX4OHh+rQUSpV5R0njyFz4SoputXZAoGAP5uo\n9zfLY3YQ39cxhvNJ2GSLN7N9c3PH/9XglrKxE1oH+v4MqHSyfJLRQc98yVZ1Z8U+\nDsvWgWLECZnNHr3QnUGxdrrj9TWdM3O2d88duFcC8wAp9Xj6r+SH7venAG/mhY/N\n29dnsEH7oioGanOjgXjuBZIILtNApccf+G5tDoUCgYBPEObhrwb5bts1I8tg52Po\nVYsw6QprIqrXsv7sjcbbQ1WTvfwasHxE+r30tM1QiPsx0WuMpnaANWK3McePxmTJ\nxNx3crJakdB0QbLbcdUc6Jw8UiU5vvJqfRmm0LQjreuTiJMVa1qfZcE4Z8fZwnF5\nEnL3g6k/J3kgYvEmKa3SwA==\n-----END PRIVATE KEY-----`;
const GOOGLE_DRIVE_FOLDER_ID = "13JvPCZ-9J7jTURIh-znRoo4Gly4FraH4";
// --- END OF HARDCODED CREDENTIALS ---


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
    folderPathSegments: string[] // e.g., ["4th Year", "1st Sem", "EEE4101 VLSI Design", "Lecture Notes", "Monir Sir"]
  ): Pick<ApiResource, 'year' | 'semester' | 'courseName' | 'teacherName' | 'category' | 'tags'> {
  let year = 'All Years';
  let semester = 'All Semesters';
  let courseName = 'General';
  let teacherName = 'All Teachers';
  let category = 'Uncategorized';
  const tags: string[] = [];

  // console.log(`Extracting metadata for: ${fileName} with path: ${folderPathSegments.join('/')}`);

  if (folderPathSegments.length > 0) {
    const firstSegmentLower = folderPathSegments[0].toLowerCase();
    if (firstSegmentLower.includes('1st year')) year = '1st Year';
    else if (firstSegmentLower.includes('2nd year')) year = '2nd Year';
    else if (firstSegmentLower.includes('3rd year')) year = '3rd Year';
    else if (firstSegmentLower.includes('4th year')) year = '4th Year';
    else if (firstSegmentLower.includes('job prep')) {
      year = 'All Years';
      semester = 'All Semesters';
      courseName = 'Job Preparation';
      tags.push('job-preparation');

      // For Job Prep: Structure is Job Prep / Category / Teacher (Optional)
      if (folderPathSegments.length > 1) { // Segment for Category
        category = folderPathSegments[1];
      } else {
        category = 'General'; // Default category if only "Job Prep" folder exists
      }
      
      if (folderPathSegments.length > 2) { // Segment for Teacher Name
        teacherName = folderPathSegments[2];
        if (teacherName && teacherName.toLowerCase() !== 'all teachers' && !tags.includes(teacherName.toLowerCase().replace(/\s+/g, '-'))) {
          tags.push(teacherName.toLowerCase().replace(/\s+/g, '-'));
        }
      }
      // teacherName defaults to 'All Teachers' if not found after category
    }
    if (year !== 'All Years' && !tags.includes(year.toLowerCase().replace(' ', '-'))) tags.push(year.toLowerCase().replace(' ', '-'));
  }

  if (!courseName.includes('Job Preparation')) {
    if (folderPathSegments.length > 1) { // Path segment for Semester
      const semStr = folderPathSegments[1].toLowerCase();
      if (semStr.includes('1st sem')) semester = '1st Sem';
      else if (semStr.includes('2nd sem')) semester = '2nd Sem';
      if (semester !== 'All Semesters' && !tags.includes(semester.toLowerCase().replace(' ', '-'))) tags.push(semester.toLowerCase().replace(' ', '-'));
    }

    if (folderPathSegments.length > 2) { // Path segment for Course Name
      courseName = folderPathSegments[2];
      courseName.toLowerCase().split(/\s+|[\W_]+/).filter(Boolean).forEach(tag => {
        if (!tags.includes(tag)) tags.push(tag);
      });
    }

    // New structure: Year / Sem / Course / Category / Teacher
    if (folderPathSegments.length > 3) { // Path segment for Category
      category = folderPathSegments[3];
    }
    // category defaults to 'Uncategorized' if not found

    if (folderPathSegments.length > 4) { // Path segment for Teacher Name
      teacherName = folderPathSegments[4];
      if (teacherName && teacherName.toLowerCase() !== 'all teachers' && !tags.includes(teacherName.toLowerCase().replace(/\s+/g, '-'))) {
          tags.push(teacherName.toLowerCase().replace(/\s+/g, '-'));
      }
    }
    // teacherName defaults to 'All Teachers' if not found
  }

  // Normalize common category names
  const catStrLower = category.toLowerCase();
  if (catStrLower.includes('lecture notes') || catStrLower.includes('notes') || catStrLower.includes('slide') || catStrLower.includes('presentation')) category = 'Lecture Notes';
  else if (catStrLower.includes('past paper') || catStrLower.includes('question')) category = 'Past Papers';
  else if (catStrLower.includes('lab manual') || catStrLower.includes('manual')) category = 'Lab Manuals';
  else if (catStrLower.includes('book')) category = 'Books';


  if (category !== 'Uncategorized' && category !== 'General' && !tags.includes(category.toLowerCase().replace(/\s+/g, '-'))) {
      tags.push(category.toLowerCase().replace(/\s+/g, '-'));
  }

  // Add tags from filename
  fileName.toLowerCase().split(/\s+|[\W_]+/).filter(Boolean).forEach(tag => {
    if (tag !== 'pdf' && tag !== 'docx' && tag !== 'pptx' && tag !== 'doc' && tag !== 'ppt' && !tags.includes(tag)) {
      tags.push(tag);
    }
  });

  // console.log(` -> Year: ${year}, Sem: ${semester}, Course: ${courseName}, Cat: ${category}, Teacher: ${teacherName}, Tags: ${tags.join(', ')}`);
  return {
    year,
    semester,
    courseName,
    teacherName,
    category,
    tags: [...new Set(tags)], // Ensure unique tags
  };
}


export async function GET() {
  console.log("Attempting to fetch resources from Google Drive...");
  console.log("Using GOOGLE_DRIVE_FOLDER_ID:", GOOGLE_DRIVE_FOLDER_ID);

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
    console.log("Google Drive API client initialized.");

    console.log("Fetching all folders...");
    const folderRes = await drive.files.list({
      q: "mimeType='application/vnd.google-apps.folder' and trashed=false",
      fields: 'files(id, name, parents)',
      pageSize: 1000,
    });
    const allFolders = folderRes.data.files || [];
    console.log(`Fetched ${allFolders.length} folders.`);
    const folderMap = new Map<string, { name: string, parentId: string | null }>();
    allFolders.forEach(folder => {
      if (folder.id && folder.name) {
        folderMap.set(folder.id, { name: folder.name, parentId: folder.parents ? folder.parents[0] : null });
      }
    });
    console.log(`Folder map created with ${folderMap.size} entries.`);

    console.log("Fetching all files (not folders)...");
    const filesRes = await drive.files.list({
      q: `mimeType != 'application/vnd.google-apps.folder' and trashed=false`,
      fields: 'files(id, name, mimeType, webViewLink, webContentLink, createdTime, modifiedTime, parents)',
      pageSize: 1000,
      orderBy: 'modifiedTime desc',
    });
    const driveFiles = filesRes.data.files || [];
    console.log(`Fetched ${driveFiles.length} files in total from Drive.`);

    const resources: ApiResource[] = [];
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    console.log("Processing fetched files...");
    for (const file of driveFiles) {
      if (!file.id || !file.name || !file.parents || file.parents.length === 0) {
        continue;
      }

      const pathSegments: string[] = [];
      let currentParentId: string | null = file.parents[0];
      let depth = 0;
      // console.log(`  Processing file: ${file.name}, Initial parent ID: ${currentParentId}`);

      while (currentParentId && currentParentId !== GOOGLE_DRIVE_FOLDER_ID && depth < 10) { // depth limit to prevent infinite loops
        const folderDetail = folderMap.get(currentParentId);
        if (folderDetail) {
          pathSegments.unshift(folderDetail.name);
          currentParentId = folderDetail.parentId;
          // console.log(`    Added segment: ${folderDetail.name}, new currentParentId: ${currentParentId}`);
        } else {
          // console.log(`    Parent ID ${currentParentId} not found in folderMap. Stopping path reconstruction for this file.`);
          currentParentId = null; // Stop if parent not in map (e.g., above our scope or broken link)
        }
        depth++;
      }

      let isDescendant = false;
      if (currentParentId === GOOGLE_DRIVE_FOLDER_ID) {
         isDescendant = true;
      }
      
      // console.log(`  File: ${file.name}, Final currentParentId after loop: ${currentParentId}, Path segments relative to root: [${pathSegments.join(' / ')}], Is descendant: ${isDescendant}`);

      if (isDescendant) {
        // console.log(`  File ${file.name} is a descendant. Extracting metadata... Path: ${pathSegments.join('/')}`);
        const metadata = extractMetadataFromPath(file.name, pathSegments);
        // console.log(`  Metadata for ${file.name}:`, metadata);
        const modifiedDate = file.modifiedTime ? new Date(file.modifiedTime) : new Date(0);
        const isActuallyNew = modifiedDate > oneWeekAgo;

        resources.push({
          id: file.id,
          name: file.name,
          type: getResourceType(file.mimeType),
          url: file.webViewLink || file.webContentLink || '#',
          ...metadata,
          isNew: isActuallyNew,
          isPopular: false, // Popularity logic can be added later if needed
        });
      }
    }

    console.log(`Processed files. Found ${resources.length} resources matching criteria.`);

    if (resources.length === 0 && driveFiles.length > 0) {
        console.warn(`WARNING: No resources were processed as descendants of GOOGLE_DRIVE_FOLDER_ID ('${GOOGLE_DRIVE_FOLDER_ID}'). Total files fetched from Drive: ${driveFiles.length}. This might indicate that GOOGLE_DRIVE_FOLDER_ID is incorrect, the folder is empty, or files are not in the expected subfolder structure (e.g. Year/Sem/Course/Category/Teacher/file.ext). Check sharing permissions and internal folder structure.`);
        if (driveFiles.length > 0 && driveFiles[0]) {
          console.warn(`  Example: First file found in Drive: '${driveFiles[0].name}', its parent IDs: ${JSON.stringify(driveFiles[0].parents)}. Is this file expected to be under GOOGLE_DRIVE_FOLDER_ID?`);
        }
        console.warn(`  Folder map size: ${folderMap.size}. Ensure all necessary parent folders are accessible and listed.`);
    }
    if (resources.length === 0 && driveFiles.length === 0 && folderMap.size > 0) {
        console.warn("WARNING: No files (non-folders) found in the Google Drive account accessible by the service account, but folders were found. Ensure there are files to process.");
    }
     if (resources.length === 0 && driveFiles.length === 0 && folderMap.size === 0) {
        console.warn("WARNING: No files or folders found in the Google Drive account accessible by the service account. Check service account permissions or if the Drive is empty.");
    }


    return NextResponse.json(resources);

  } catch (error) {
    console.error("Error fetching resources from Google Drive:", error);
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;

    return NextResponse.json(
        {
            message: `Error fetching resources: ${message}`,
            ...(stack && { stack: stack })
        },
        { status: 500 }
    );
  }
}
