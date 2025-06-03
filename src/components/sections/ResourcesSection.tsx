
'use client';

import React, { useState, useMemo, useEffect, type ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
// Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle are no longer directly used for resource items
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, FileText, Download, PlusCircle, FileArchive, Presentation, Filter, X, Loader2, Info, BookUser, UserSquare, ArrowRight, Eye } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { NeonGradientCard } from '@/components/ui/neon-gradient-card'; // Import NeonGradientCard
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'; // Keep for error message and skeleton

export interface Resource {
  id: string;
  name: string;
  type: 'PDF' | 'DOCX' | 'PPT' | 'OTHER';
  year: string;
  semester: string;
  courseName?: string;
  teacherName?: string;
  category: string;
  isNew: boolean;
  isPopular: boolean;
  viewUrl: string;
  downloadUrl: string;
  tags?: string[];
}

const years = ['All Years', '1st Year', '2nd Year', '3rd Year', '4th Year'];
const semesters = ['All Semesters', '1st Sem', '2nd Sem'];
const staticCategories = ['All Categories', 'Lecture Notes', 'Past Papers', 'Lab Manuals', 'Books', 'Uncategorized'];


const getFileIcon = (type: Resource['type']) => {
  switch (type) {
    case 'PDF': return <FileText className="h-5 w-5 text-primary" />;
    case 'DOCX': return <FileArchive className="h-5 w-5 text-primary" />;
    case 'PPT': return <Presentation className="h-5 w-5 text-primary" />;
    default: return <FileText className="h-5 w-5 text-primary" />;
  }
};

export default function ResourcesSection() {
  const [allResources, setAllResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('All Years');
  const [selectedSemester, setSelectedSemester] = useState<string>('All Semesters');
  const [selectedCourseName, setSelectedCourseName] = useState<string>('All Courses');
  const [selectedTeacherName, setSelectedTeacherName] = useState<string>('All Teachers');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');


  const [uniqueCourseNames, setUniqueCourseNames] = useState<string[]>(['All Courses']);
  const [uniqueCategories, setUniqueCategories] = useState<string[]>(staticCategories);
  const [uniqueTeacherNames, setUniqueTeacherNames] = useState<string[]>(['All Teachers']);


  useEffect(() => {
    const fetchResources = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/resources');
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: `Failed to fetch resources: ${response.statusText}` }));
          throw new Error(errorData.message || `Failed to fetch resources: ${response.statusText}`);
        }
        const data: Resource[] = await response.json();
        setAllResources(data);

        const fetchedCourseNames = ['All Courses', ...[...new Set(data.map(r => r.courseName).filter(Boolean as any))].sort()];
        setUniqueCourseNames(fetchedCourseNames);
        
        let dynamicTeacherNames = [...new Set(data.map(r => r.teacherName).filter(Boolean as any) as string[])].sort();
        if (dynamicTeacherNames.includes('All Teachers')) {
            dynamicTeacherNames = dynamicTeacherNames.filter(tn => tn !== 'All Teachers');
        }
        setUniqueTeacherNames(['All Teachers', ...dynamicTeacherNames]);

        let dynamicCategories = [...new Set(data.map(r => r.category).filter(Boolean as any) as string[])].sort();
        const baseCategories = staticCategories.filter(sc => sc !== 'All Categories');
        
        dynamicCategories = dynamicCategories.filter(dc => dc !== 'All Categories' && !baseCategories.includes(dc));
        
        const combined = [...baseCategories, ...dynamicCategories].sort();
        setUniqueCategories(['All Categories', ...combined]);

      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
        setAllResources([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResources();
  }, []);

  const filteredResources = useMemo(() => {
    if (isLoading) return [];
    return allResources.filter(resource =>
      (
        resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (resource.courseName && resource.courseName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (resource.teacherName && resource.teacherName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        resource.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      ) &&
      (selectedYear !== 'All Years' ? resource.year === selectedYear : true) &&
      (selectedSemester !== 'All Semesters' ? resource.semester === selectedSemester : true) &&
      (selectedCourseName !== 'All Courses' ? resource.courseName === selectedCourseName : true) &&
      (selectedTeacherName !== 'All Teachers' ? resource.teacherName === selectedTeacherName : true) &&
      (selectedCategory !== 'All Categories' ? resource.category === selectedCategory : true)
    );
  }, [searchTerm, selectedYear, selectedSemester, selectedCourseName, selectedCategory, selectedTeacherName, allResources, isLoading]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedYear('All Years');
    setSelectedSemester('All Semesters');
    setSelectedCourseName('All Courses');
    setSelectedTeacherName('All Teachers');
    setSelectedCategory('All Categories');
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchTerm) count++;
    if (selectedYear !== 'All Years') count++;
    if (selectedSemester !== 'All Semesters') count++;
    if (selectedCourseName !== 'All Courses') count++;
    if (selectedTeacherName !== 'All Teachers') count++;
    if (selectedCategory !== 'All Categories') count++;
    return count;
  }, [searchTerm, selectedYear, selectedSemester, selectedCourseName, selectedTeacherName, selectedCategory]);


  return (
    <section id="resources" className="container mx-auto px-4">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
          Unlock Your Potential: Comprehensive EEE Resources
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Find materials by year, semester, course, teacher, or category.
        </p>
      </div>

      <Card className="mb-12 shadow-lg border-border/60 bg-card/80 backdrop-blur-sm relative z-20">
        <CardHeader className="border-b border-border/40 pb-4">
          <CardTitle className="flex items-center gap-2 text-xl"><Filter size={20} /> Filter & Search Resources</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6">
            <div>
              <label htmlFor="search-resources" className="block text-sm font-medium text-muted-foreground mb-1.5">Search by Name, Course, Teacher, or Tag</label>
              <div className="relative">
                <Input
                  id="search-resources"
                  type="text"
                  placeholder="e.g., 'VLSI Design', 'Monir Sir', 'Lecture 1', 'DSP'"
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
                <Tabs defaultValue="All Years" value={selectedYear} onValueChange={setSelectedYear}>
                  <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5">
                    {years.map(year => (
                      <TabsTrigger key={year} value={year} disabled={isLoading}>
                        {year === 'All Years' ? 'All' : year.replace(' Year', '')}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Semester</label>
                <Tabs defaultValue="All Semesters" value={selectedSemester} onValueChange={setSelectedSemester}>
                  <TabsList className="grid w-full grid-cols-3">
                    {semesters.map(sem => (
                      <TabsTrigger key={sem} value={sem} disabled={isLoading}>
                        {sem === 'All Semesters' ? 'All' : sem.replace(' Sem', '')}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>

              <div>
                <label htmlFor="filter-course" className="block text-sm font-medium text-muted-foreground mb-1.5">
                  <BookUser size={16} className="inline mr-1.5 relative -top-px" />Course Name
                </label>
                <Select value={selectedCourseName} onValueChange={setSelectedCourseName} disabled={isLoading || uniqueCourseNames.length <= 1}>
                  <SelectTrigger id="filter-course">
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
                <label htmlFor="filter-teacher" className="block text-sm font-medium text-muted-foreground mb-1.5">
                  <UserSquare size={16} className="inline mr-1.5 relative -top-px" />Teacher Name
                </label>
                <Select value={selectedTeacherName} onValueChange={setSelectedTeacherName} disabled={isLoading || uniqueTeacherNames.length <= 1}>
                  <SelectTrigger id="filter-teacher">
                    <SelectValue placeholder="Select Teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueTeacherNames.map(teacher => (
                      <SelectItem key={teacher} value={teacher}>{teacher}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Category</label>
                <Tabs defaultValue="All Categories" value={selectedCategory} onValueChange={setSelectedCategory}>
                  <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-fluid gap-1 h-auto flex-wrap" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))' }}>
                    {uniqueCategories.map(cat => (
                      <TabsTrigger key={cat} value={cat} className="flex-grow text-xs sm:text-sm" disabled={isLoading}>
                        {cat === 'All Categories' ? 'All' : cat}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
            </div>

            <div className="flex justify-end items-center mt-2">
              {activeFiltersCount > 0 && (
                <Button variant="ghost" onClick={resetFilters} className="text-sm" disabled={isLoading}>
                  <X size={16} className="mr-1.5" /> Clear Selections ({activeFiltersCount})
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            // Skeleton remains a standard Card for simplicity
            <Card key={index} className="flex flex-col bg-card"> 
              <CardHeader className="pb-3">
                <Skeleton className="h-5 w-5 mb-2" />
                <Skeleton className="h-4 w-3/4 mb-1" />
                <Skeleton className="h-3 w-1/2 mb-2" />
                <Skeleton className="h-3 w-1/3" />
              </CardHeader>
              <CardContent className="flex-grow pt-0 pb-3">
                <div className="flex flex-wrap gap-1 mt-1">
                  <Skeleton className="h-5 w-12 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              </CardContent>
              <div className="p-6 pt-0 flex gap-2"> {/* Mimic CardFooter structure for Skeleton */}
                <Skeleton className="h-9 flex-1" />
                <Skeleton className="h-9 flex-1" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && error && (
         <Card className="my-12 shadow-lg border-destructive/50 bg-destructive/10">
            <CardHeader>
                <CardTitle className="flex items-center text-destructive">
                    <Info size={24} className="mr-2" /> Error Loading Resources
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-destructive-foreground/90">
                    There was an issue fetching the resources from Google Drive.
                </p>
                <p className="text-sm text-muted-foreground mt-1">Details: {error}</p>
                <ul className="text-sm text-muted-foreground mt-3 list-disc list-inside">
                    <li>Ensure the `GOOGLE_DRIVE_FOLDER_ID` in the backend code (`src/app/api/resources/route.ts`) is correctly set.</li>
                    <li>Make sure your Google Drive folder is shared with the service account email with "Viewer" permissions.</li>
                    <li>Verify your folder structure (e.g. Year/Semester/Course/Category/Teacher/file.ext).</li>
                </ul>
                <Button onClick={() => window.location.reload()} className="mt-4" variant="secondary">Try Again</Button>
            </CardContent>
        </Card>
      )}

      {!isLoading && !error && filteredResources.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredResources.map(resource => (
            <NeonGradientCard
              key={resource.id}
              className="hover:shadow-xl transition-shadow duration-300 ease-in-out"
              neonColors={{ firstColor: '#00B4D8', secondColor: '#48CAE4' }}
              borderRadius={12}
            >
              <div className="relative z-[1] flex flex-col h-full justify-between pointer-events-auto">
                <div> 
                  <div className="flex justify-between items-start mb-2">
                    {getFileIcon(resource.type)}
                    <div className="flex gap-1.5 flex-wrap justify-end">
                      {resource.isNew && <Badge variant="default" className="text-xs px-1.5 py-0.5 bg-primary/90 text-primary-foreground">New!</Badge>}
                      {resource.isPopular && <Badge variant="secondary" className="text-xs px-1.5 py-0.5">Popular</Badge>}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold leading-tight line-clamp-2 text-foreground mb-1" title={resource.name}>
                    {resource.name}
                  </h3>
                  <p className="text-xs text-muted-foreground truncate mb-0.5" title={`${resource.courseName ? resource.courseName : ''}${resource.category ? ' • ' + resource.category : ''}${resource.teacherName && resource.teacherName.toLowerCase() !== 'all teachers' ? ' • ' + resource.teacherName : ''}`}>
                    {resource.courseName ? resource.courseName : ''}
                    {resource.category ? <><span className="mx-1">&bull;</span>{resource.category}</> : ''}
                    {resource.teacherName && resource.teacherName.toLowerCase() !== 'all teachers' ? <><span className="mx-1">&bull;</span>{resource.teacherName}</> : ''}
                  </p>
                  <p className="text-xs text-muted-foreground mb-2">
                    {resource.year} &bull; {resource.semester}
                  </p>
                  {resource.tags && resource.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {resource.tags.slice(0, 3).map(tag => <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0.5">{tag}</Badge>)}
                      {resource.tags.length > 3 && <Badge variant="outline" className="text-xs px-1.5 py-0.5">+{resource.tags.length - 3}</Badge>}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-auto"> 
                  <Button asChild size="sm" className="flex-1 group">
                    <Link href={resource.downloadUrl} target="_blank" rel="noopener noreferrer">
                      Download
                      <Download className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="flex-1 group">
                    <Link href={resource.viewUrl} target="_blank" rel="noopener noreferrer">
                      View
                      <Eye className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </NeonGradientCard>
          ))}
        </div>
      )}

      {!isLoading && !error && filteredResources.length === 0 && allResources.length > 0 && (
         <div className="text-center py-16">
          <Search className="h-20 w-20 text-muted-foreground/50 mx-auto mb-6" />
          <p className="text-2xl font-semibold text-muted-foreground">No resources match your current filters.</p>
          <p className="text-md text-muted-foreground mt-2">Try adjusting your search or selections.</p>
        </div>
      )}

      {!isLoading && !error && allResources.length === 0 && (
         <div className="text-center py-16">
          <Info className="h-20 w-20 text-muted-foreground/50 mx-auto mb-6" />
          <p className="text-2xl font-semibold text-muted-foreground">No resources found in Google Drive.</p>
          <p className="text-md text-muted-foreground mt-2">
             Ensure files are present in the configured Google Drive folder (`{GOOGLE_DRIVE_FOLDER_ID}`)
             and follow the structure: Year/Semester/Course/Category/Teacher/file.ext.
             Also, check sharing permissions.
          </p>
        </div>
      )}
    </section>
  );
}
