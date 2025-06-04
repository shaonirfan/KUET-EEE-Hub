
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
}

const baseYears = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
const baseSemesters = ['1st Sem', '2nd Sem'];

const mockRecordings: Recording[] = [
 {
    id: 'rec8',
    title: 'Review of previously conducted lecture.',
    youtubeVideoId: '2VHFELPIPNQ',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4105 - Communication Engineering-II',
 tags: ['review', 'RI1', 'Rafiq Sir'],
  },
  {
    id: 'rec9',
    title: 'Lecture-01 (Digital Switching System part-1)',
    youtubeVideoId: 'ecQc-0454Eo',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4105 - Communication Engineering-II',
 tags: ['lecture-01', 'digital switching system', 'part-1', 'RI1', 'Rafiq Sir'],
  },
  {
    id: 'rec10',
    title: 'Lecture-02 (Digital Switching System part-2)',
    youtubeVideoId: 'hQyaNkrzwF8',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4105 - Communication Engineering-II',
 tags: ['lecture-02', 'digital switching system', 'part-2', 'RI1', 'Rafiq Sir'],
  },
  {
    id: 'rec11',
    title: 'Lecture-03 (Virtual Circuit Network)',
    youtubeVideoId: 'hDoXPZ53xC8',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4105 - Communication Engineering-II',
 tags: ['lecture-03', 'virtual circuit network', 'RI1', 'Rafiq Sir'],
  },
  {
    id: 'rec12',
    title: 'Lecture-04 (Traffic Engineering)',
    youtubeVideoId: 'UIVvMcimpo8',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4105 - Communication Engineering-II',
 tags: ['lecture-04', 'traffic engineering', 'RI1', 'Rafiq Sir'],
  },
  {
    id: 'rec13',
    title: 'Lecture-05 (Fiber Optic part-01)',
    youtubeVideoId: 'jXCXOZhpkC8',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4105 - Communication Engineering-II',
 tags: ['lecture-05', 'fiber optic', 'part-01', 'RI1', 'Rafiq Sir'],
  },
  {
    id: 'rec14',
    title: 'Lecture-06(Fiber Optic part-2)',
    youtubeVideoId: 'L9MDmnQLNBs',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4105 - Communication Engineering-II',
    tags: ['lecture-06', 'fiber optic', 'part-2', 'RI1', 'Rafiq Sir'],
  },
  {
    id: 'rec15',
    title: 'Lecture-07 (ISDN)',
    youtubeVideoId: 'IGxlv6lBO_E',
 year: '4th Year',
    semester: '1st Sem',
 courseName: 'EE 4105 - Communication Engineering-II',
 tags: ['lecture-07', 'ISDN', 'RI1', 'Rafiq Sir'],
  },
 {
    id: 'rec16',
 title: 'Lecture-01',
 youtubeVideoId: 'CsVwv3bC07s',
 year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4105 - Communication Engineering-II',
    teacherName: 'Mostafa Zaman Sir (MZC)',
    tags: ['communication', 'mostafa', 'mzc', 'lecture-01'],
  },
];


export default function OnlineClassRecordingsSection() {
  const [allRecordings, setAllRecordings] = useState<Recording[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userHasInteracted, setUserHasInteracted] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>(baseYears[0]);
  const [selectedSemester, setSelectedSemester] = useState<string>(baseSemesters[0]);
  const [selectedCourseName, setSelectedCourseName] = useState<string>('All Courses');
  const [selectedTeacherName, setSelectedTeacherName] = useState<string>('All Teachers');

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    // Simulate API call for recordings
    setTimeout(() => {
      setAllRecordings(mockRecordings);
      setIsLoading(false);
      // No need to set default filters here if userHasInteracted is false,
      // as the initial prompt will be shown.
    }, 1000); 
  }, []);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setUserHasInteracted(true);
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    setSelectedCourseName('All Courses');
    setSelectedTeacherName('All Teachers');
    setUserHasInteracted(true);
  };

  const handleSemesterChange = (semester: string) => {
    setSelectedSemester(semester);
    setSelectedCourseName('All Courses');
    setSelectedTeacherName('All Teachers');
    setUserHasInteracted(true);
  };

  const handleCourseChange = (course: string) => {
    setSelectedCourseName(course);
    setSelectedTeacherName('All Teachers');
    setUserHasInteracted(true);
  };

  const handleTeacherChange = (teacher: string) => {
    setSelectedTeacherName(teacher);
    setUserHasInteracted(true);
  };


  const dynamicCourseNames = useMemo(() => {
    if (!selectedYear || !selectedSemester) return ['All Courses'];
    const courses = new Set<string>();
    allRecordings
      .filter(r => r.year === selectedYear && r.semester === selectedSemester && r.courseName)
      .forEach(r => courses.add(r.courseName!));
    return ['All Courses', ...Array.from(courses).sort()];
  }, [allRecordings, selectedYear, selectedSemester]);

  const dynamicTeacherNames = useMemo(() => {
    if (!selectedYear || !selectedSemester) return ['All Teachers'];
    const teachers = new Set<string>();
    allRecordings
      .filter(r =>
        r.year === selectedYear &&
        r.semester === selectedSemester &&
        (selectedCourseName === 'All Courses' || r.courseName === selectedCourseName) &&
        r.teacherName
      )
      .forEach(r => teachers.add(r.teacherName!));
    
    const sortedTeachers = Array.from(teachers).sort();
     if (sortedTeachers.length === 0 || (sortedTeachers.length > 0 && sortedTeachers[0] !== 'All Teachers' && !sortedTeachers.some(t => t.toLowerCase() === 'all teachers'))) {
        return ['All Teachers', ...sortedTeachers.filter(tn => tn && tn.toLowerCase() !== 'all teachers')];
    }
    return sortedTeachers.filter(tn => tn);
  }, [allRecordings, selectedYear, selectedSemester, selectedCourseName]);


  const filteredRecordings = useMemo(() => {
    if (searchTerm.trim() !== '') {
      // Global search mode
      return allRecordings.filter(recording =>
        recording.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (recording.courseName && recording.courseName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (recording.teacherName && recording.teacherName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        recording.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    } else {
      // Filter-based mode
      return allRecordings.filter(recording =>
        (selectedYear ? recording.year === selectedYear : true) &&
        (selectedSemester ? recording.semester === selectedSemester : true) &&
        (selectedCourseName !== 'All Courses' ? recording.courseName === selectedCourseName : true) &&
        (selectedTeacherName !== 'All Teachers' ? recording.teacherName === selectedTeacherName : true)
      );
    }
  }, [searchTerm, selectedYear, selectedSemester, selectedCourseName, selectedTeacherName, allRecordings]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedYear(baseYears[0]);
    setSelectedSemester(baseSemesters[0]);
    setSelectedCourseName('All Courses');
    setSelectedTeacherName('All Teachers');
    setUserHasInteracted(true); // Resetting is an interaction
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedYear !== baseYears[0]) count++;
    if (selectedSemester !== baseSemesters[0]) count++;
    if (selectedCourseName !== 'All Courses') count++;
    if (selectedTeacherName !== 'All Teachers') count++;
    return count;
  }, [selectedYear, selectedSemester, selectedCourseName, selectedTeacherName]);


  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
             <NeonGradientCard
              key={`skel-rec-${index}`}
              className="hover:shadow-xl transition-shadow duration-300 ease-in-out"
              neonColors={{ firstColor: '#00B4D8', secondColor: '#48CAE4' }}
              borderRadius={12}
            >
                <div className="relative z-[1] flex flex-col h-full justify-between pointer-events-auto p-1">
                    <Skeleton className="h-4 w-3/4 mb-2 px-2 pt-2" />
                    <div className="px-2 mb-2">
                        <Skeleton className="aspect-video w-full rounded-md shadow-md" />
                    </div>
                    <Skeleton className="h-3 w-1/2 mb-1 px-2" />
                    <Skeleton className="h-3 w-1/3 mb-3 px-2" />
                     <div className="flex flex-wrap gap-1 mb-3 px-2">
                        <Skeleton className="h-5 w-12 rounded-full" />
                        <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                    <div className="px-2 pb-2 mt-auto">
                        <Button asChild size="sm" className="w-full group" disabled>
                            <div className="flex items-center justify-center">
                                <Youtube className="mr-2 h-4 w-4" /> View on YouTube
                            </div>
                        </Button>
                    </div>
                </div>
            </NeonGradientCard>
          ))}
        </div>
      );
    }

    if (error) {
      return (
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
      );
    }
    
    if (allRecordings.length === 0) {
         return (
           <div className="text-center py-16">
            <Info className="h-20 w-20 text-muted-foreground/50 mx-auto mb-6" />
            <p className="text-2xl font-semibold text-muted-foreground">No recordings available yet.</p>
            <p className="text-md text-muted-foreground mt-2">
               Please check back later as new recordings are added.
            </p>
          </div>
        );
    }

    if (searchTerm.trim() !== '') {
      if (filteredRecordings.length > 0) {
        // Display search results
      } else {
        return (
          <div className="text-center py-16">
            <Search className="h-20 w-20 text-muted-foreground/50 mx-auto mb-6" />
            <p className="text-2xl font-semibold text-muted-foreground">No recordings found for &quot;{searchTerm}&quot;.</p>
            <p className="text-md text-muted-foreground mt-2">Try a different search term.</p>
          </div>
        );
      }
    } else { // Search term is empty
      if (!userHasInteracted) {
        return (
          <div className="text-center py-16">
            <Info className="h-20 w-20 text-muted-foreground/50 mx-auto mb-6" />
            <p className="text-2xl font-semibold text-muted-foreground">Explore Class Recordings!</p>
            <p className="text-md text-muted-foreground mt-2">
              Use the filters or search bar above to find specific video lectures.
            </p>
          </div>
        );
      }
      // User has interacted, search is empty
      if (filteredRecordings.length === 0) {
         return (
           <div className="text-center py-16">
            <Search className="h-20 w-20 text-muted-foreground/50 mx-auto mb-6" />
            <p className="text-2xl font-semibold text-muted-foreground">No recordings match your current filters.</p>
            <p className="text-md text-muted-foreground mt-2">Try adjusting your selections.</p>
          </div>
        );
      }
    }

    // If we reach here, display filtered recordings
    return (
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
    );
  };


  return (
    <section id="online-class-recordings" className="container mx-auto px-4">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground flex items-center justify-center gap-3">
          <PlaySquare size={36} className="text-primary" /> Online Class Recordings
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Find recordings by year, semester, course, or teacher. Or use search for a global lookup.
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
                  onChange={handleSearchChange}
                  className="pr-10 text-base"
                  disabled={isLoading && allRecordings.length === 0}
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Year</label>
                <Tabs value={selectedYear} onValueChange={handleYearChange} defaultValue={baseYears[0]}>
                  <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
                    {baseYears.map(year => (
                      <TabsTrigger key={year} value={year} disabled={isLoading && allRecordings.length === 0}>
                        {year.replace(' Year', '')}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Semester</label>
                <Tabs value={selectedSemester} onValueChange={handleSemesterChange} defaultValue={baseSemesters[0]}>
                  <TabsList className="grid w-full grid-cols-2">
                    {baseSemesters.map(sem => (
                      <TabsTrigger key={sem} value={sem} disabled={isLoading && allRecordings.length === 0}>
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
                <Select 
                  value={selectedCourseName} 
                  onValueChange={handleCourseChange} 
                  disabled={(isLoading && allRecordings.length === 0) || dynamicCourseNames.length <= 1}
                >
                  <SelectTrigger id="filter-recording-course">
                    <SelectValue placeholder="Select Course" />
                  </SelectTrigger>
                  <SelectContent>
                    {dynamicCourseNames.map(course => (
                      <SelectItem key={course} value={course}>{course}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
               <div>
                <label htmlFor="filter-recording-teacher" className="block text-sm font-medium text-muted-foreground mb-1.5">
                  <UserSquare size={16} className="inline mr-1.5 relative -top-px" />Teacher Name
                </label>
                <Select 
                  value={selectedTeacherName} 
                  onValueChange={handleTeacherChange} 
                  disabled={(isLoading && allRecordings.length === 0) || dynamicTeacherNames.length <= 1}
                >
                  <SelectTrigger id="filter-recording-teacher">
                    <SelectValue placeholder="Select Teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {dynamicTeacherNames.map(teacher => (
                      <SelectItem key={teacher} value={teacher}>{teacher}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end items-center mt-2">
              {activeFiltersCount > 0 && (
                <Button variant="ghost" onClick={resetFilters} className="text-sm" disabled={isLoading && allRecordings.length === 0}>
                  <X size={16} className="mr-1.5" /> Clear Active Filters ({activeFiltersCount})
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {renderContent()}
      
    </section>
  );
}

