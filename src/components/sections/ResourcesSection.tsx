'use client';

import React, { useState, useMemo, useEffect, type ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, FileText, Download, Eye, Filter, X, Info, BookUser, UserSquare, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { NeonGradientCard } from '@/components/ui/neon-gradient-card';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export interface Resource {
  id: string;
  name: string;
  type: 'PDF' | 'DOCX' | 'PPT' | 'OTHER';
  year: string;
  semester: string;
  courseName?: string;
  teacherName?: string;
  category?: string;
  isNew: boolean;
  isPopular: boolean;
  viewUrl: string;
  downloadUrl: string;
  webViewLink: string;
  tags?: string[];
}

const baseYears = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
const baseSemesters = ['1st Sem', '2nd Sem'];

const getFileIcon = (type: Resource['type']) => {
  switch (type) {
    case 'PDF': return <FileText className="h-5 w-5 text-primary" />;
    case 'DOCX': return <FileText className="h-5 w-5 text-primary" />;
    case 'PPT': return <FileText className="h-5 w-5 text-primary" />;
    default: return <FileText className="h-5 w-5 text-primary" />;
  }
};

export default function ResourcesSection() {
  const [allResources, setAllResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userHasInteracted, setUserHasInteracted] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>(baseYears[0]);
  const [selectedSemester, setSelectedSemester] = useState<string>(baseSemesters[0]);
  const [selectedCourseName, setSelectedCourseName] = useState<string>('All Courses');
  const [selectedTeacherName, setSelectedTeacherName] = useState<string>('All Teachers');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');

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
        // Initialize filters after data is loaded if not already interacted
        if (!userHasInteracted && data.length > 0) {
            // Default year and semester are already set
            // Default course and teacher are 'All Courses' / 'All Teachers'
            const initialCategories = Array.from(new Set(data
                .filter(r => r.year === baseYears[0] && r.semester === baseSemesters[0])
                .map(r => r.category)))
                .sort();
            if (initialCategories.length > 0) {
                setSelectedCategory(initialCategories[0]);
            } else {
                setSelectedCategory('');
            }
        }
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
  }, []); // removed userHasInteracted from dependency array

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setUserHasInteracted(true);
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    setSelectedCourseName('All Courses'); // Reset course
    setSelectedTeacherName('All Teachers'); // Reset teacher
    // Category will be reset by its own useEffect
    setUserHasInteracted(true);
  };

  const handleSemesterChange = (semester: string) => {
    setSelectedSemester(semester);
    setSelectedCourseName('All Courses'); // Reset course
    setSelectedTeacherName('All Teachers'); // Reset teacher
    // Category will be reset by its own useEffect
    setUserHasInteracted(true);
  };
  
  const handleCourseChange = (course: string) => {
    setSelectedCourseName(course);
    setSelectedTeacherName('All Teachers'); // Reset teacher
    // Category will be reset by its own useEffect
    setUserHasInteracted(true);
  };

  const handleTeacherChange = (teacher: string) => {
    setSelectedTeacherName(teacher);
    // Category will be reset by its own useEffect
    setUserHasInteracted(true);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setUserHasInteracted(true);
  };


  const dynamicCourseNames = useMemo(() => {
    if (!selectedYear || !selectedSemester) return ['All Courses'];
    const courses = new Set<string>();
    allResources
      .filter(r => r.year === selectedYear && r.semester === selectedSemester && r.courseName)
      .forEach(r => courses.add(r.courseName!));
    return ['All Courses', ...Array.from(courses).sort()];
  }, [allResources, selectedYear, selectedSemester]);

  const dynamicTeacherNames = useMemo(() => {
    if (!selectedYear || !selectedSemester) return ['All Teachers'];
    const teachers = new Set<string>();
    allResources
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
    return sortedTeachers.filter(tn => tn); // Filter out undefined/empty then return
  }, [allResources, selectedYear, selectedSemester, selectedCourseName]);
  
  const dynamicCategories = useMemo(() => {
    if (!selectedYear || !selectedSemester) return ['All Categories'];
    const categories = new Set<string>();
    allResources
      .filter(r =>
        r.year === selectedYear &&
        r.semester === selectedSemester &&
        (selectedCourseName === 'All Courses' || r.courseName === selectedCourseName) &&
        (selectedTeacherName === 'All Teachers' || r.teacherName === selectedTeacherName) &&
        r.category
      )
      .forEach(r => categories.add(r.category!));
    return ['All Categories', ...Array.from(categories).sort()];
  }, [allResources, selectedYear, selectedSemester, selectedCourseName, selectedTeacherName]);

  useEffect(() => {
    if (isLoading || allResources.length === 0) return;
    // This effect handles setting the default category when other filters change
    const relevantCategories = dynamicCategories; // Use the memoized one
    if (relevantCategories.length > 0) {
      if (!selectedCategory || !relevantCategories.includes(selectedCategory)) {
        setSelectedCategory(relevantCategories[0]);
      }
    } else {
      setSelectedCategory(''); // No categories available for current filter set
    }
  }, [dynamicCategories, selectedCategory, isLoading, allResources]);


  const filteredResources = useMemo(() => {
    if (searchTerm.trim() !== '') {
      // Global search mode
      return allResources.filter(resource =>
        resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (resource.courseName && resource.courseName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (resource.teacherName && resource.teacherName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (resource.category && resource.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
        resource.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    } else {
      return allResources.filter(resource =>
        (selectedYear ? resource.year === selectedYear : true) &&
        (selectedSemester ? resource.semester === selectedSemester : true) &&
        (selectedCourseName !== 'All Courses' ? resource.courseName === selectedCourseName : true) &&
        (selectedTeacherName !== 'All Teachers' ? resource.teacherName === selectedTeacherName : true) &&
        (selectedCategory !== 'All Categories' ? resource.category === selectedCategory : true)
      );
    }
  }, [searchTerm, selectedYear, selectedSemester, selectedCourseName, selectedTeacherName, selectedCategory, allResources]);


  const resetFilters = () => {
    setSearchTerm('');
    setSelectedYear(baseYears[0]);
    setSelectedSemester(baseSemesters[0]);
    setSelectedCourseName('All Courses'); 
    setSelectedTeacherName('All Teachers'); 
    // setSelectedCategory will be reset by its useEffect based on new dynamicCategories
    setUserHasInteracted(true); // Resetting is an interaction
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    // Search term is not counted as a "filter" in this context, but an override
    if (selectedYear !== baseYears[0]) count++;
    if (selectedSemester !== baseSemesters[0]) count++;
    if (selectedCourseName !== 'All Courses') count++;
    if (selectedTeacherName !== 'All Teachers') count++;
    if (dynamicCategories.length > 0 && selectedCategory !== dynamicCategories[0]) count++;
    else if (dynamicCategories.length === 0 && selectedCategory !== '') count++;
    return count;
  }, [selectedYear, selectedSemester, selectedCourseName, selectedTeacherName, selectedCategory, dynamicCategories]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
             <NeonGradientCard
              key={`skel-${index}`}
              className="hover:shadow-xl transition-shadow duration-300 ease-in-out"
              neonColors={{ firstColor: '#00B4D8', secondColor: '#48CAE4' }}
              borderRadius={12}
            >
              <div className="relative z-[1] flex flex-col h-full justify-between pointer-events-auto p-1">
                <div>
                    <Skeleton className="h-5 w-5 mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-1" />
                    <Skeleton className="h-3 w-1/2 mb-2" />
                    <Skeleton className="h-3 w-1/3" />
                    <div className="flex flex-wrap gap-1 mt-2 mb-3">
                        <Skeleton className="h-5 w-12 rounded-full" />
                        <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                </div>
                <div className="flex gap-2 mt-auto">
                    <Skeleton className="h-9 flex-1 rounded-md" />
                    <Skeleton className="h-9 flex-1 rounded-md" />
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
                    <Info size={24} className="mr-2" /> Error Loading Resources
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-destructive-foreground/90">
                    There was an issue fetching the resources from Google Drive.
                </p>
                <p className="text-sm text-muted-foreground mt-1">Details: {error}</p>
                <ul className="text-sm text-muted-foreground mt-3 list-disc list-inside">
                    <li>Ensure the `GOOGLE_DRIVE_FOLDER_ID` in your environment variables is correctly set.</li>
                    <li>Make sure your Google Drive folder is shared with the service account email with "Viewer" permissions.</li>
                    <li>Verify your folder structure (e.g. Year/Semester/Course/Category/Teacher/file.ext).</li>
                </ul>
                <Button onClick={() => window.location.reload()} className="mt-4" variant="secondary">Try Again</Button>
            </CardContent>
        </Card>
      );
    }

    if (allResources.length === 0) {
      return (
         <div className="text-center py-16">
          <Info className="h-20 w-20 text-muted-foreground/50 mx-auto mb-6" />
          <p className="text-2xl font-semibold text-muted-foreground">No resources found in Google Drive.</p>
          <p className="text-md text-muted-foreground mt-2">
             Ensure files are present in the configured Google Drive folder
             and follow the structure: Year/Semester/Course/Category/Teacher/file.ext.
             Also, check sharing permissions.
          </p>
        </div>
      );
    }
    
    if (searchTerm.trim() !== '') {
      if (filteredResources.length > 0) {
        // Display search results
      } else {
        return (
          <div className="text-center py-16">
            <Search className="h-20 w-20 text-muted-foreground/50 mx-auto mb-6" />
            <p className="text-2xl font-semibold text-muted-foreground">No resources found for &quot;{searchTerm}&quot;.</p>
            <p className="text-md text-muted-foreground mt-2">Try a different search term.</p>
          </div>
        );
      }
    } else { // Search term is empty
      if (!userHasInteracted) {
        return (
          <div className="text-center py-16">
            <Info className="h-20 w-20 text-muted-foreground/50 mx-auto mb-6" />
            <p className="text-2xl font-semibold text-muted-foreground">Welcome to the EEE Resource Hub!</p>
            <p className="text-md text-muted-foreground mt-2">
              Please select filters (Year, Semester, Category etc.) or use the search box above to find resources.
            </p>
          </div>
        );
      }
      // User has interacted, search is empty
      if (filteredResources.length === 0) {
         return (
           <div className="text-center py-16">
            <Search className="h-20 w-20 text-muted-foreground/50 mx-auto mb-6" />
            <p className="text-2xl font-semibold text-muted-foreground">No resources match your current filters.</p>
            <p className="text-md text-muted-foreground mt-2">Try adjusting your selections. Ensure year, semester, and category are selected.</p>
          </div>
        );
      }
    }

    // If we reach here, it means we have resources to display (either from search or filters)
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredResources.map(resource => (
          <NeonGradientCard
            key={resource.id}
            className="transition-shadow duration-300 ease-in-out"
            neonColors={{ firstColor: '#00B4D8', secondColor: '#48CAE4' }}
            borderRadius={12}
          >
            <div className="relative z-[1] flex flex-col h-full pointer-events-auto p-1 justify-between">
              <div> 
                <div className="px-2 pt-2">
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
                    {resource.courseName && resource.courseName.toLowerCase() !== 'all courses' ? resource.courseName : ''}
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
              </div>

              <div className="px-2 pb-2 mt-auto"> 
                {resource.downloadUrl ? (
                  <Button asChild size="sm" className="flex-1 group w-full mb-1.5">
                    <Link href={resource.downloadUrl} target="_blank" rel="noopener noreferrer">
                      Download
                      <Download className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                    </Link>
                  </Button>
                ) : (
                  <Button size="sm" className="flex-1 w-full mb-1.5" disabled>
                    Download
                  </Button>
                )}
                {resource.webViewLink ? (
                  <Button asChild variant="outline" size="sm" className="flex-1 group w-full">
                    <Link href={resource.webViewLink} target="_blank" rel="noopener noreferrer">
                      View
                      <Eye className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="flex-1 w-full" disabled>
                    View
                  </Button>
                )}
              </div>
            </div>
          </NeonGradientCard>
        ))}
      </div>
    );
  };


  return (
    <section id="resources" className="container mx-auto px-4">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
          Unlock Your Potential: Comprehensive EEE Resources
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Find materials by year, semester, course, teacher, or category. Or use the search for a global lookup.
        </p>
      </div>

      <Card className="mb-12 shadow-lg border-border/60 bg-card/80 backdrop-blur-sm relative z-20">
        <CardHeader className="border-b border-border/40 pb-4">
          <CardTitle className="flex items-center gap-2 text-xl"><Filter size={20} /> Filter & Search Resources</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6">
            <div>
              <label htmlFor="search-resources" className="block text-sm font-medium text-muted-foreground mb-1.5">Search by Name, Course, Teacher, Tag, or Category</label>
              <div className="relative">
                <Input
                  id="search-resources"
                  type="text"
                  placeholder="e.g., 'VLSI Design', 'Monir Sir', 'Lecture 1', 'DSP'"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pr-10 text-base"
                  disabled={isLoading && allResources.length === 0} // Disable if still initially loading all resources
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
                      <TabsTrigger key={year} value={year} disabled={isLoading && allResources.length === 0}>
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
                      <TabsTrigger key={sem} value={sem} disabled={isLoading && allResources.length === 0}>
                        {sem.replace(' Sem', '')}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>

              <div>
                <label htmlFor="filter-course" className="block text-sm font-medium text-muted-foreground mb-1.5">
                  <BookUser size={16} className="inline mr-1.5 relative -top-px" />Course Name
                </label>
                <Select
                  value={selectedCourseName}
                  onValueChange={handleCourseChange}
                  disabled={(isLoading && allResources.length === 0) || dynamicCourseNames.length <= 1}
                >
                  <SelectTrigger id="filter-course">
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
                <label htmlFor="filter-teacher" className="block text-sm font-medium text-muted-foreground mb-1.5">
                  <UserSquare size={16} className="inline mr-1.5 relative -top-px" />Teacher Name
                </label>
                <Select
                  value={selectedTeacherName}
                  onValueChange={handleTeacherChange}
                  disabled={(isLoading && allResources.length === 0) || dynamicTeacherNames.length <= 1}
                >
                  <SelectTrigger id="filter-teacher">
                    <SelectValue placeholder="Select Teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {dynamicTeacherNames.map(teacher => (
                      <SelectItem key={teacher} value={teacher}>{teacher}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Category</label>
                {(isLoading && allResources.length === 0) ? (
                   <Skeleton className="h-10 w-full rounded-md" />
                ) : dynamicCategories.length > 0 ? (
                  <Tabs value={selectedCategory} onValueChange={handleCategoryChange} defaultValue={dynamicCategories[0]}>
                    <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-fluid gap-1 h-auto flex-wrap" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))' }}>
                      {dynamicCategories.map(cat => (
                        <TabsTrigger key={cat} value={cat} className="flex-grow text-xs sm:text-sm">
                          {cat}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                ) : (
                  <p className="text-sm text-muted-foreground p-2 border border-dashed rounded-md text-center">
                    {allResources.length > 0 ? 'No categories available for current filters.' : 'Loading categories...'}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end items-center mt-2">
              {activeFiltersCount > 0 && (
                <Button variant="ghost" onClick={resetFilters} className="text-sm" disabled={isLoading && allResources.length === 0}>
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
    
