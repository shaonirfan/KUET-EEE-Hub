
import { NextResponse } from 'next/server';
import type { Resource } from '@/components/sections/ResourcesSection'; // Adjust path if Resource type is moved

// This is the same dummy data, but now served from an API route.
// In a real implementation, this would fetch data from Google Drive.
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

export async function GET() {
  // In a real scenario, add error handling for the Drive API call
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return NextResponse.json(dummyResources);
  } catch (error) {
    console.error("Failed to fetch resources:", error);
    return NextResponse.json({ message: "Failed to fetch resources" }, { status: 500 });
  }
}
