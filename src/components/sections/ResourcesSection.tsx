
'use client';

import React, { useState, useMemo, type ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'; // Added Tabs
import { Badge } from '@/components/ui/badge';
import { Search, FileText, Download, PlusCircle, FileArchive, Presentation, Filter, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Resource {
  id: string;
  name: string;
  type: 'PDF' | 'DOCX' | 'PPT' | 'OTHER';
  year: string;
  semester: string;
  category: string;
  isNew: boolean;
  isPopular: boolean;
  url: string;
  tags?: string[];
}

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

const years = ['All Years', '1st Year', '2nd Year', '3rd Year', '4th Year'];
const semesters = ['All Semesters', '1st Sem', '2nd Sem'];
const categories = ['All Categories', 'Lecture Notes', 'Past Papers', 'Lab Manuals', 'Books', 'Presentations', 'Job Preparation'];

const getFileIcon = (type: Resource['type']) => {
  switch (type) {
    case 'PDF': return <FileText className="h-5 w-5 text-primary" />;
    case 'DOCX': return <FileArchive className="h-5 w-5 text-primary" />;
    case 'PPT': return <Presentation className="h-5 w-5 text-primary" />;
    default: return <FileText className="h-5 w-5 text-primary" />;
  }
};

export default function ResourcesSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('All Years');
  const [selectedSemester, setSelectedSemester] = useState<string>('All Semesters');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');

  const filteredResources = useMemo(() => {
    return dummyResources.filter(resource => 
      (resource.name.toLowerCase().includes(searchTerm.toLowerCase()) || resource.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) &&
      (selectedYear !== 'All Years' ? resource.year === selectedYear : true) &&
      (selectedSemester !== 'All Semesters' ? resource.semester === selectedSemester : true) &&
      (selectedCategory !== 'All Categories' ? resource.category === selectedCategory : true)
    );
  }, [searchTerm, selectedYear, selectedSemester, selectedCategory]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedYear('All Years');
    setSelectedSemester('All Semesters');
    setSelectedCategory('All Categories');
  };
  
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchTerm) count++;
    if (selectedYear !== 'All Years') count++;
    if (selectedSemester !== 'All Semesters') count++;
    if (selectedCategory !== 'All Categories') count++;
    return count;
  }, [searchTerm, selectedYear, selectedSemester, selectedCategory]);


  return (
    <section id="resources" className="container mx-auto px-4">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
          Unlock Your Potential: Comprehensive EEE Resources
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Find lecture notes, past papers, lab manuals, job preparation materials, and more. Use the filters or search to quickly locate what you need. Look for "New!" or "Popular" tags for curated content.
        </p>
      </div>

      {/* Filters and Search Card */}
      <Card className="mb-12 shadow-lg border-border/60 bg-card/80 backdrop-blur-sm">
        <CardHeader className="border-b border-border/40 pb-4">
          <CardTitle className="flex items-center gap-2 text-xl"><Filter size={20} /> Filter & Search Resources</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6">
            {/* Search Input */}
            <div>
              <label htmlFor="search-resources" className="block text-sm font-medium text-muted-foreground mb-1.5">Search by Name or Tag</label>
              <div className="relative">
                <Input
                  id="search-resources"
                  type="text"
                  placeholder="e.g., 'Analog Electronics', 'DSP', 'Job Prep'"
                  value={searchTerm}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="pr-10 text-base"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Year Tabs */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">Year</label>
              <Tabs defaultValue="All Years" value={selectedYear} onValueChange={setSelectedYear}>
                <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5">
                  {years.map(year => (
                    <TabsTrigger key={year} value={year}>
                      {year === 'All Years' ? 'All' : year.replace(' Year', '')}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            {/* Semester Tabs */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">Semester</label>
              <Tabs defaultValue="All Semesters" value={selectedSemester} onValueChange={setSelectedSemester}>
                <TabsList className="grid w-full grid-cols-3">
                  {semesters.map(sem => (
                    <TabsTrigger key={sem} value={sem}>
                      {sem === 'All Semesters' ? 'All' : sem.replace(' Sem', '')}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
            
            {/* Category Tabs */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">Category</label>
              <Tabs defaultValue="All Categories" value={selectedCategory} onValueChange={setSelectedCategory}>
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-1 h-auto flex-wrap">
                  {categories.map(cat => (
                    <TabsTrigger key={cat} value={cat} className="flex-grow">
                      {cat === 'All Categories' ? 'All' : cat}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
            
            {/* Clear Filters Button */}
            <div className="flex justify-end items-center mt-2">
              {activeFiltersCount > 0 && (
                <Button variant="ghost" onClick={resetFilters} className="text-sm">
                  <X size={16} className="mr-1.5" /> Clear Selections ({activeFiltersCount})
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resource List */}
      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredResources.map(resource => (
            <Card key={resource.id} className="flex flex-col bg-card hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-1">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  {getFileIcon(resource.type)}
                  <div className="flex gap-1.5 flex-wrap justify-end">
                    {resource.isNew && <Badge variant="default" className="text-xs px-1.5 py-0.5 bg-primary/90 text-primary-foreground">New!</Badge>}
                    {resource.isPopular && <Badge variant="secondary" className="text-xs px-1.5 py-0.5">Popular</Badge>}
                  </div>
                </div>
                <CardTitle className="text-lg leading-tight line-clamp-2">{resource.name}</CardTitle>
                <CardDescription className="text-xs">{resource.category} &bull; {resource.year} &bull; {resource.semester}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow pt-0 pb-3">
                {resource.tags && resource.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {resource.tags.slice(0, 3).map(tag => <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0.5">{tag}</Badge>)}
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-0">
                <Button asChild size="sm" className="w-full group">
                  <Link href={resource.url} target="_blank" rel="noopener noreferrer">
                    Download
                    <Download className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Search className="h-20 w-20 text-muted-foreground/50 mx-auto mb-6" />
          <p className="text-2xl font-semibold text-muted-foreground">No resources found.</p>
          <p className="text-md text-muted-foreground mt-2">Try adjusting your search or selections, or check back later.</p>
        </div>
      )}
      
      {/* Contribute Resources CTA */}
      <div className="mt-16 md:mt-24 text-center">
        <Card className="inline-block p-6 md:p-10 shadow-xl border-primary/20 bg-gradient-to-br from-card to-muted/30 dark:from-card dark:to-muted/20 max-w-2xl mx-auto">
          <CardHeader className="p-0 mb-4">
            <PlusCircle className="h-12 w-12 text-primary mx-auto mb-3" />
            <CardTitle className="text-2xl md:text-3xl">Have a resource to share?</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Help your fellow students by contributing valuable study materials, notes, or job preparation guides. Your contributions make this hub better!
            </p>
            <Button asChild size="lg" className="group shadow-md hover:shadow-primary/30 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5">
              <Link href="#contact"> 
                Contribute Here
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

// FilterSelect component and its props are no longer needed.
// interface FilterSelectProps {
//   label: string;
//   value: string;
//   onValueChange: (value: string) => void;
//   options: string[];
//   placeholder: string;
//   className?: string;
// }

// function FilterSelect({ label, value, onValueChange, options, placeholder, className }: FilterSelectProps) {
//   return (
//     <div className={className}>
//       <label htmlFor={`filter-${label.toLowerCase()}`} className="block text-sm font-medium text-muted-foreground mb-1.5">{label}</label>
//       <Select value={value} onValueChange={onValueChange}>
//         <SelectTrigger id={`filter-${label.toLowerCase()}`} className="text-base">
//           <SelectValue placeholder={placeholder} />
//         </SelectTrigger>
//         <SelectContent>
//           <SelectGroup>
//             <SelectLabel>{label}</SelectLabel>
//             {options.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
//           </SelectGroup>
//         </SelectContent>
//       </Select>
//     </div>
//   );
// }
