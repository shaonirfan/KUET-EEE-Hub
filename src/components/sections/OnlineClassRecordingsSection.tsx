
'use client';

import React, { useState, useMemo, useEffect, type ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, Info, BookUser, UserSquare, Loader2, PlaySquare, Youtube } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { NeonGradientCard } from '@/components/ui/neon-gradient-card';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export interface Recording {
  id: string;
  title: string;
  youtubeVideoId: string;
  year: string;
  semester: string;
  courseName?: string;
  teacherName?: string;
  tags?: string[];
  description?: string;
}

// Base options for filters (consistent with ResourcesSection)
const baseYears = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
const baseSemesters = ['1st Sem', '2nd Sem'];

// Mock data for recordings - replace with actual data fetching later
const mockRecordings: Recording[] = [
  {
    id: 'rec1',
    title: 'Introduction to VLSI Design - Lecture 1',
    youtubeVideoId: 'mR_p9L3m6tE', // Example video ID
    year: '3rd Year',
    semester: '1st Sem',
    courseName: 'EEE3101 VLSI Design I',
    teacherName: 'Dr. Example Teacher A',
    tags: ['vlsi', 'intro', 'semiconductor'],
    description: 'First lecture covering the basics of VLSI technology and design methodologies.'
  },
  {
    id: 'rec2',
    title: 'Digital Signal Processing - Filters',
    youtubeVideoId: 'yG-SzL2m6qM', // Example video ID
    year: '3rd Year',
    semester: '2nd Sem',
    courseName: 'EEE3203 Digital Signal Processing',
    teacherName: 'Prof. Example Teacher B',
    tags: ['dsp', 'filters', 'digital'],
    description: 'In-depth discussion on various types of digital filters and their applications.'
  },
  {
    id: 'rec3',
    title: 'Communication Systems - Modulation Techniques',
    youtubeVideoId: 'dQw4w9WgXcQ', // Example: Rick Astley (use a real educational one)
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EEE4103 Communication Systems',
    teacherName: 'Dr. Example Teacher C',
    tags: ['communication', 'modulation', 'am-fm'],
    description: 'Exploring AM, FM, and PM modulation techniques in communication systems.'
  },
   {
    id: 'rec4',
    title: 'Power Electronics - Converters',
    youtubeVideoId: '3JZ_D3ELwOQ', // Example video ID for Power Electronics
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EEE4105 Power Electronics',
    teacherName: 'Prof. Example Teacher D',
    tags: ['power-electronics', 'converters', 'dc-dc'],
    description: 'Detailed analysis of DC-DC converters and their applications in power systems.'
  },
  {
    id: 'rec5',
    title: 'Control Systems - Stability Analysis',
    youtubeVideoId: '0VIY2x511pk', // Example video ID for Control Systems
    year: '3rd Year',
    semester: '2nd Sem',
    courseName: 'EEE3205 Control Systems',
    teacherName: 'Dr. Example Teacher A',
    tags: ['control-systems', 'stability', 'nyquist'],
    description: 'Understanding stability criteria like Routh-Hurwitz and Nyquist plots for control systems.'
  },
  {
    id: 'rec6',
    title: 'EE 4105 - Communication Engineering 2 Lecture',
    youtubeVideoId: '2VHFELPIPNQ',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4105 - Communication Engineering 2',
    teacherName: 'Prof MD Rafiqul Islam Sir (RI1)',
    tags: ['communication', 'engineering', 'ee4105', 'rafiqul islam'],
    description: 'Lecture on Communication Engineering 2 by Prof MD Rafiqul Islam Sir.'
  }
];


export default function OnlineClassRecordingsSection() {
  const [allRecordings, setAllRecordings] = useState<Recording[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Simulate loading
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>(baseYears[0]);
  const [selectedSemester, setSelectedSemester] = useState<string>(baseSemesters[0]);
  const [selectedCourseName, setSelectedCourseName] = useState<string>('All Courses');
  const [selectedTeacherName, setSelectedTeacherName] = useState<string>('All Teachers');

  const [uniqueCourseNames, setUniqueCourseNames] = useState<string[]>(['All Courses']);
  const [uniqueTeacherNames, setUniqueTeacherNames] = useState<string[]>(['All Teachers']);

  useEffect(() => {
    // Simulate fetching data
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      setAllRecordings(mockRecordings);
      const fetchedCourseNamesList = [...new Set(mockRecordings.map(r => r.courseName).filter(Boolean as any) as string[])].sort();
      setUniqueCourseNames(['All Courses', ...fetchedCourseNamesList]);

      let dynamicTeacherNamesList = [...new Set(mockRecordings.map(r => r.teacherName).filter(Boolean as any) as string[])].sort();
      dynamicTeacherNamesList = dynamicTeacherNamesList.filter(tn => tn !== 'All Teachers');
      setUniqueTeacherNames(['All Teachers', ...dynamicTeacherNamesList]);
      setIsLoading(false);
    }, 1000); // Simulate network delay
  }, []);

  const filteredRecordings = useMemo(() => {
    if (isLoading) return [];
    return allRecordings.filter(recording =>
      (
        recording.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (recording.courseName && recording.courseName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (recording.teacherName && recording.teacherName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        recording.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      ) &&
      (selectedYear ? recording.year === selectedYear : true) &&
      (selectedSemester ? recording.semester === selectedSemester : true) &&
      (selectedCourseName !== 'All Courses' ? recording.courseName === selectedCourseName : true) &&
      (selectedTeacherName !== 'All Teachers' ? recording.teacherName === selectedTeacherName : true)
    );
  }, [searchTerm, selectedYear, selectedSemester, selectedCourseName, selectedTeacherName, allRecordings, isLoading]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedYear(baseYears[0]);
    setSelectedSemester(baseSemesters[0]);
    setSelectedCourseName('All Courses');
    setSelectedTeacherName('All Teachers');
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchTerm) count++;
    if (selectedYear !== baseYears[0]) count++;
    if (selectedSemester !== baseSemesters[0]) count++;
    if (selectedCourseName !== 'All Courses') count++;
    if (selectedTeacherName !== 'All Teachers') count++;
    return count;
  }, [searchTerm, selectedYear, selectedSemester, selectedCourseName, selectedTeacherName]);

  return (
    <section id="online-class-recordings" className="container mx-auto px-4">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground flex items-center justify-center gap-3">
          <PlaySquare size={36} className="text-primary" /> Online Class Recordings
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Catch up on missed lectures or review key concepts. Find recordings by year, semester, course, or teacher.
        </p>
      </div>

      <Card className="mb-12 shadow-lg border-border/60 bg-card/80 backdrop-blur-sm relative z-20">
        <CardHeader className="border-b border-border/40 pb-4">
          <CardTitle className="flex items-center gap-2 text-xl"><Filter size={20} /> Filter & Search Recordings</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6">
            <div>
              <label htmlFor="search-recordings" className="block text-sm font-medium text-muted-foreground mb-1.5">Search by Title, Course, Teacher, or Tag</label>
              <div className="relative">
                <Input
                  id="search-recordings"
                  type="text"
                  placeholder="e.g., 'DSP Lecture 5', 'Control Systems', 'Stability'"
                  value={searchTerm}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="pr-10 text-base"
                  disabled={isLoading}
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Year</label>
                <Tabs value={selectedYear} onValueChange={setSelectedYear} defaultValue={baseYears[0]}>
                  <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
                    {baseYears.map(year => (
                      <TabsTrigger key={year} value={year} disabled={isLoading}>
                        {year.replace(' Year', '')}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Semester</label>
                <Tabs value={selectedSemester} onValueChange={setSelectedSemester} defaultValue={baseSemesters[0]}>
                  <TabsList className="grid w-full grid-cols-2">
                    {baseSemesters.map(sem => (
                      <TabsTrigger key={sem} value={sem} disabled={isLoading}>
                        {sem.replace(' Sem', '')}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>

              <div>
                <label htmlFor="filter-recording-course" className="block text-sm font-medium text-muted-foreground mb-1.5">
                  <BookUser size={16} className="inline mr-1.5 relative -top-px" />Course Name
                </label>
                <Select value={selectedCourseName} onValueChange={setSelectedCourseName} disabled={isLoading || uniqueCourseNames.length <= 1}>
                  <SelectTrigger id="filter-recording-course">
                    <SelectValue placeholder="Select Course" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueCourseNames.map(course => (
                      <SelectItem key={course} value={course}>{course}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
               <div>
                <label htmlFor="filter-recording-teacher" className="block text-sm font-medium text-muted-foreground mb-1.5">
                  <UserSquare size={16} className="inline mr-1.5 relative -top-px" />Teacher Name
                </label>
                <Select value={selectedTeacherName} onValueChange={setSelectedTeacherName} disabled={isLoading || uniqueTeacherNames.length <= 1}>
                  <SelectTrigger id="filter-recording-teacher">
                    <SelectValue placeholder="Select Teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueTeacherNames.map(teacher => (
                      <SelectItem key={teacher} value={teacher}>{teacher}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end items-center mt-2">
              {activeFiltersCount > 0 && (
                <Button variant="ghost" onClick={resetFilters} className="text-sm" disabled={isLoading}>
                  <X size={16} className="mr-1.5" /> Clear Changed Filters ({activeFiltersCount})
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
             <NeonGradientCard
              key={`skel-${index}`}
              className="hover:shadow-xl transition-shadow duration-300 ease-in-out"
              neonColors={{ firstColor: '#00B4D8', secondColor: '#48CAE4' }}
              borderRadius={12}
            >
                <div className="relative z-[1] flex flex-col h-full justify-between pointer-events-auto p-1">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="aspect-video w-full mb-2 rounded-md" />
                    <Skeleton className="h-3 w-1/2 mb-1" />
                    <Skeleton className="h-3 w-1/3 mb-3" />
                     <div className="flex flex-wrap gap-1 mb-3">
                        <Skeleton className="h-5 w-12 rounded-full" />
                        <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                     <Button asChild size="sm" className="w-full group" disabled>
                        <div className="flex items-center justify-center">
                            <Youtube className="mr-2 h-4 w-4" /> View on YouTube
                        </div>
                    </Button>
                </div>
            </NeonGradientCard>
          ))}
        </div>
      )}

      {!isLoading && error && (
         <Card className="my-12 shadow-lg border-destructive/50 bg-destructive/10">
            <CardHeader>
                <CardTitle className="flex items-center text-destructive">
                    <Info size={24} className="mr-2" /> Error Loading Recordings
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-destructive-foreground/90">
                    There was an issue fetching the recordings.
                </p>
                <p className="text-sm text-muted-foreground mt-1">Details: {error}</p>
                <Button onClick={() => window.location.reload()} className="mt-4" variant="secondary">Try Again</Button>
            </CardContent>
        </Card>
      )}

      {!isLoading && !error && filteredRecordings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecordings.map(recording => (
            <NeonGradientCard
              key={recording.id}
              className="transition-shadow duration-300 ease-in-out"
              neonColors={{ firstColor: '#00B4D8', secondColor: '#48CAE4' }}
              borderRadius={12}
            >
              <div className="relative z-[1] flex flex-col h-full pointer-events-auto p-1 justify-between">
                <div>
                    <h3 className="text-lg font-semibold leading-tight line-clamp-2 text-foreground mb-1 px-2 pt-2" title={recording.title}>
                        {recording.title}
                    </h3>
                    <div className="px-2 mb-2">
                        <iframe
                            width="100%"
                            src={`https://www.youtube.com/embed/${recording.youtubeVideoId}`}
                            title={recording.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                            className="aspect-video rounded-md shadow-md"
                        ></iframe>
                    </div>
                    {recording.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-1 px-2" title={recording.description}>
                        {recording.description}
                        </p>
                    )}
                    <p className="text-xs text-muted-foreground truncate mb-0.5 px-2" title={`${recording.courseName ? recording.courseName : ''}${recording.teacherName && recording.teacherName.toLowerCase() !== 'all teachers' ? ' • ' + recording.teacherName : ''}`}>
                        {recording.courseName && recording.courseName.toLowerCase() !== 'all courses' ? recording.courseName : ''}
                        {recording.teacherName && recording.teacherName.toLowerCase() !== 'all teachers' ? <><span className="mx-1">&bull;</span>{recording.teacherName}</> : ''}
                    </p>
                    <p className="text-xs text-muted-foreground mb-2 px-2">
                        {recording.year} &bull; {recording.semester}
                    </p>
                    {recording.tags && recording.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3 px-2">
                        {recording.tags.slice(0, 3).map(tag => <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0.5">{tag}</Badge>)}
                        {recording.tags.length > 3 && <Badge variant="outline" className="text-xs px-1.5 py-0.5">+{recording.tags.length - 3}</Badge>}
                        </div>
                    )}
                </div>
                <div className="px-2 pb-2 mt-auto">
                    <Button asChild size="sm" className="w-full group">
                        <Link href={`https://www.youtube.com/watch?v=${recording.youtubeVideoId}`} target="_blank" rel="noopener noreferrer">
                        <Youtube className="mr-2 h-4 w-4" /> View on YouTube
                        </Link>
                    </Button>
                </div>
              </div>
            </NeonGradientCard>
          ))}
        </div>
      )}

      {!isLoading && !error && filteredRecordings.length === 0 && allRecordings.length > 0 && (
         <div className="text-center py-16">
          <Search className="h-20 w-20 text-muted-foreground/50 mx-auto mb-6" />
          <p className="text-2xl font-semibold text-muted-foreground">No recordings match your current filters.</p>
          <p className="text-md text-muted-foreground mt-2">Try adjusting your search or selections. You must select a year and semester.</p>
        </div>
      )}

      {!isLoading && !error && allRecordings.length === 0 && (
         <div className="text-center py-16">
          <Info className="h-20 w-20 text-muted-foreground/50 mx-auto mb-6" />
          <p className="text-2xl font-semibold text-muted-foreground">No recordings available yet.</p>
          <p className="text-md text-muted-foreground mt-2">
             Please check back later as new recordings are added.
          </p>
        </div>
      )}
    </section>
  );
}


    
