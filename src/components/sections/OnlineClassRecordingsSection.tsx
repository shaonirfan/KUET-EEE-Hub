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
    teacherName: 'Rafiq Sir (RI2)',
 tags: ['review', 'RI2', 'Rafiq Sir'],
  },
  {
    id: 'rec9',
    title: 'Lecture-01 (Digital Switching System part-1)',
    youtubeVideoId: 'ecQc-0454Eo',
    year: '4th Year',
    semester: '1st Sem',
    teacherName: 'Rafiq Sir (RI2)',
    courseName: 'EE 4105 - Communication Engineering-II',
 tags: ['lecture-01', 'digital switching system', 'part-1', 'RI2', 'Rafiq Sir'],
  },
  {
    id: 'rec10',
    title: 'Lecture-02 (Digital Switching System part-2)',
    youtubeVideoId: 'hQyaNkrzwF8',
    year: '4th Year',
    semester: '1st Sem',
    teacherName: 'Rafiq Sir (RI2)',
    courseName: 'EE 4105 - Communication Engineering-II',
 tags: ['lecture-02', 'digital switching system', 'part-2', 'RI2', 'Rafiq Sir'],
  },
  {
    id: 'rec11',
    title: 'Lecture-03 (Virtual Circuit Network)',
    youtubeVideoId: 'hDoXPZ53xC8',
    year: '4th Year',
    semester: '1st Sem',
    teacherName: 'Rafiq Sir (RI2)',
    courseName: 'EE 4105 - Communication Engineering-II',
 tags: ['lecture-03', 'virtual circuit network', 'RI2', 'Rafiq Sir'],
  },
  {
    id: 'rec12',
    title: 'Lecture-04 (Traffic Engineering)',
    youtubeVideoId: 'UIVvMcimpo8',
    year: '4th Year',
    semester: '1st Sem',
    teacherName: 'Rafiq Sir (RI2)',
    courseName: 'EE 4105 - Communication Engineering-II',
 tags: ['lecture-04', 'traffic engineering', 'RI2', 'Rafiq Sir'],
  },
  {
    id: 'rec13',
    title: 'Lecture-05 (Fiber Optic part-01)',
    youtubeVideoId: 'jXCXOZhpkC8',
    year: '4th Year',
    semester: '1st Sem',
    teacherName: 'Rafiq Sir (RI2)',
    courseName: 'EE 4105 - Communication Engineering-II',
 tags: ['lecture-05', 'fiber optic', 'part-01', 'RI2', 'Rafiq Sir'],
  },
  {
    id: 'rec14',
    title: 'Lecture-06(Fiber Optic part-2)',
    youtubeVideoId: 'L9MDmnQLNBs',
    year: '4th Year',
    semester: '1st Sem',
    teacherName: 'Rafiq Sir (RI2)',
    courseName: 'EE 4105 - Communication Engineering-II',
    tags: ['lecture-06', 'fiber optic', 'part-2', 'RI2', 'Rafiq Sir'],
  },
  {
    id: 'rec15',
    title: 'Lecture-07 (ISDN)',
    youtubeVideoId: 'IGxlv6lBO_E',
 year: '4th Year',
    semester: '1st Sem',
    teacherName: 'Rafiq Sir (RI2)',
 courseName: 'EE 4105 - Communication Engineering-II',
 tags: ['lecture-07', 'ISDN', 'RI2', 'Rafiq Sir'],
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
  {
    id: 'rec17',
    title: 'Lecture-02',
    youtubeVideoId: '5FNYUoqDrZw',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4105 - Communication Engineering-II',
    teacherName: 'Mostafa Zaman Sir (MZC)',
    tags: ['communication', 'mostafa', 'mzc', 'lecture-02'],
  },
  {
    id: 'rec18',
    title: 'Lecture-03',
    youtubeVideoId: '-PBuGEJee4U',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4105 - Communication Engineering-II',
    teacherName: 'Mostafa Zaman Sir (MZC)',
    tags: ['communication', 'mostafa', 'mzc', 'lecture-03'],
  },
  {
    id: 'rec19',
    title: 'Lecture-04',
    youtubeVideoId: 'T-BtBzs_Kqc',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4105 - Communication Engineering-II',
    teacherName: 'Mostafa Zaman Sir (MZC)',
    tags: ['communication', 'mostafa', 'mzc', 'lecture-04'],
  },
  {
    id: 'rec20',
    title: 'Lecture-05',
    youtubeVideoId: '-eWS_1Pb3Fo',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4105 - Communication Engineering-II',
    teacherName: 'Mostafa Zaman Sir (MZC)',
    tags: ['communication', 'mostafa', 'mzc', 'lecture-05'],
  },
  {
    id: 'rec21',
    title: 'Lecture-06',
    youtubeVideoId: 'ycuYObDusaA',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4105 - Communication Engineering-II',
    teacherName: 'Mostafa Zaman Sir (MZC)',
    tags: ['communication', 'mostafa', 'mzc', 'lecture-06'],
  },
  {
    id: 'rec22',
    title: 'Lec 08',
    youtubeVideoId: 'HNl2RQhlN9U',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4109 - Power Electronics and Industrial Drives',
    teacherName: 'Habibullah Sir',
    tags: ['power electronics', 'habibullah', 'lec-08'],
  },
  {
    id: 'rec23',
    title: 'Lec 09',
    youtubeVideoId: 'FDE8UUGusRw',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4109 - Power Electronics and Industrial Drives',
    teacherName: 'Habibullah Sir',
    tags: ['power electronics', 'habibullah', 'lec-09'],
  },
  {
    id: 'rec24',
    title: 'Lec 10',
    youtubeVideoId: '4rycXoX5jzs',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4109 - Power Electronics and Industrial Drives',
    teacherName: 'Habibullah Sir',
    tags: ['power electronics', 'habibullah', 'lec-10'],
  },
  {
    id: 'rec25',
    title: 'Lec 11',
    youtubeVideoId: 'xShlwTzeBBo',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4109 - Power Electronics and Industrial Drives',
    teacherName: 'Habibullah Sir',
    tags: ['power electronics', 'habibullah', 'lec-11'],
  },
  {
    id: 'rec26',
    title: 'Lec 12',
    youtubeVideoId: 'zMaCAf2Ax4U',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4109 - Power Electronics and Industrial Drives',
    teacherName: 'Habibullah Sir',
    tags: ['power electronics', 'habibullah', 'lec-12'],
  },
  {
    id: 'rec27',
    title: 'Lec 13 Induction heating',
    youtubeVideoId: 'GaGJq9CxcE8',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4109 - Power Electronics and Industrial Drives',
    teacherName: 'Habibullah Sir',
    tags: ['power electronics', 'habibullah', 'lec-13', 'induction heating'],
  },
  {
    id: 'rec28',
    title: 'Lec 14',
    youtubeVideoId: 'y-66O_vccjI',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4109 - Power Electronics and Industrial Drives',
    teacherName: 'Habibullah Sir',
    tags: ['power electronics', 'habibullah', 'lec-14'],
  },
  {
    id: 'rec29',
    title: 'Lecture 01',
    youtubeVideoId: 'FsmWjzfxxQQ',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4109 - Power Electronics and Industrial Drives',
    teacherName: 'Abdur Rafiq Sir',
    tags: ['power electronics', 'rafiq', 'lec-01'],
  },
  {
    id: 'rec30',
    title: 'Lecture 02',
    youtubeVideoId: 'PPWsXJCOiXw',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4109 - Power Electronics and Industrial Drives',
    teacherName: 'Abdur Rafiq Sir',
    tags: ['power electronics', 'rafiq', 'lec-02'],
  },
  {
    id: 'rec31',
    title: 'Lecture 03',
    youtubeVideoId: 'AHRwpCUehUw',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4109 - Power Electronics and Industrial Drives',
    teacherName: 'Abdur Rafiq Sir',
    tags: ['power electronics', 'rafiq', 'lec-03'],
  },
  {
    id: 'rec32',
    title: 'Lecture 04',
    youtubeVideoId: 'qloyDTsdmzg',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4109 - Power Electronics and Industrial Drives',
    teacherName: 'Abdur Rafiq Sir',
    tags: ['power electronics', 'rafiq', 'lec-04'],
  },
  {
    id: 'rec33',
    title: 'Lecture 05',
    youtubeVideoId: 'RYGzdhSNCWI',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4109 - Power Electronics and Industrial Drives',
    teacherName: 'Abdur Rafiq Sir',
    tags: ['power electronics', 'rafiq', 'lec-05'],
  },
  {
    id: 'rec34',
    title: 'Lecture 06',
    youtubeVideoId: 'mEz0kbgKShM',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4109 - Power Electronics and Industrial Drives',
    teacherName: 'Abdur Rafiq Sir',
    tags: ['power electronics', 'rafiq', 'lec-06'],
  },
  {
    id: 'rec35',
    title: 'Lecture 12',
    youtubeVideoId: 'fseUpT7HlXg',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4121 - VLSI Design and Technology',
    teacherName: 'Selim Sir',
    tags: ['vlsi', 'selim', 'lec-12'],
  },
  {
    id: 'rec36',
    title: 'Lecture 13 part 1',
    youtubeVideoId: 'tlYszhr7PmE',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4121 - VLSI Design and Technology',
    teacherName: 'Selim Sir',
    tags: ['vlsi', 'selim', 'lec-13', 'part-1'],
  },
  {
    id: 'rec37',
    title: 'Lecture 13 part 2',
    youtubeVideoId: 'Xwjj7SVpcBE',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4121 - VLSI Design and Technology',
    teacherName: 'Selim Sir',
    tags: ['vlsi', 'selim', 'lec-13', 'part-2'],
  },
  {
    id: 'rec38',
    title: 'Lecture 14',
    youtubeVideoId: 'UESmFDT2kSs',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4121 - VLSI Design and Technology',
    teacherName: 'Selim Sir',
    tags: ['vlsi', 'selim', 'lec-14'],
  },
  {
    id: 'rec39',
    title: 'Lecture 15',
    youtubeVideoId: 'Y-_4zxPdkk8',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4121 - VLSI Design and Technology',
    teacherName: 'Selim Sir',
    tags: ['vlsi', 'selim', 'lec-15'],
  },
  {
    id: 'rec40',
    title: 'Lecture 16',
    youtubeVideoId: 'zoznSIU3YmU',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4121 - VLSI Design and Technology',
    teacherName: 'Selim Sir',
    tags: ['vlsi', 'selim', 'lec-16'],
  },
  {
    id: 'rec41',
    title: 'Lecture 17',
    youtubeVideoId: 'RFhEnvXPZvQ',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4121 - VLSI Design and Technology',
    teacherName: 'Selim Sir',
    tags: ['vlsi', 'selim', 'lec-17'],
  },
  {
    id: 'rec42',
    title: 'Lecture 18 Last',
    youtubeVideoId: 'vIiiKVjOiNo',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4121 - VLSI Design and Technology',
    teacherName: 'Selim Sir',
    tags: ['vlsi', 'selim', 'lec-18', 'last'],
  },
  {
    id: 'rec43',
    title: 'Lecture 18 zBoard',
    youtubeVideoId: 'UwOamZHMAnA',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4121 - VLSI Design and Technology',
    teacherName: 'Selim Sir',
    tags: ['vlsi', 'selim', 'lec-18', 'zboard'],
  },
  {
    id: 'rec44',
    title: 'Lecture 01 Lithography',
    youtubeVideoId: 'VPRWgAQes4o',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4121 - VLSI Design and Technology',
    teacherName: 'Ghani Sir',
    tags: ['vlsi', 'ghani', 'lec-01', 'lithography'],
  },
  {
    id: 'rec45',
    title: 'Lecture 02 (Doping and Etching)',
    youtubeVideoId: '3-Xq-FSSXA0',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4121 - VLSI Design and Technology',
    teacherName: 'Ghani Sir',
    tags: ['vlsi', 'ghani', 'lec-02', 'doping', 'etching'],
  },
  {
    id: 'rec46',
    title: 'Lecture 03 (Metallization Oxidation)',
    youtubeVideoId: 'w0LvuUuMGjU',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4121 - VLSI Design and Technology',
    teacherName: 'Ghani Sir',
    tags: ['vlsi', 'ghani', 'lec-03', 'metallization', 'oxidation'],
  },
  {
    id: 'rec47',
    title: 'Lecture 04 (Metal Gate nMOS)',
    youtubeVideoId: 'Cwn344p1Hlc',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4121 - VLSI Design and Technology',
    teacherName: 'Ghani Sir',
    tags: ['vlsi', 'ghani', 'lec-04', 'metal gate', 'nmos'],
  },
  {
    id: 'rec48',
    title: 'Lecture 05 (Silicon Gate MOS Fabrication)',
    youtubeVideoId: 'qfKrrg7hAQE',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4121 - VLSI Design and Technology',
    teacherName: 'Ghani Sir',
    tags: ['vlsi', 'ghani', 'lec-05', 'silicon gate', 'mos fabrication'],
  },
  {
    id: 'rec49',
    title: 'Lecture 06 Ultra fast VLSI GaAs Technology',
    youtubeVideoId: 'OSwjSsFQezE',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4121 - VLSI Design and Technology',
    teacherName: 'Ghani Sir',
    tags: ['vlsi', 'ghani', 'lec-06', 'ultra fast', 'gaas technology'],
  },
  {
    id: 'rec50',
    title: 'Lecture 07  (GaAs MESFET JFET)',
    youtubeVideoId: 'JlUqoP3FzOI',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4121 - VLSI Design and Technology',
    teacherName: 'Ghani Sir',
    tags: ['vlsi', 'ghani', 'lec-07', 'gaas', 'mesfet', 'jfet'],
  },
  {
    id: 'rec51',
    title: 'Lecture 08 (Review Class Bulk and Epitaxial Growth)',
    youtubeVideoId: 'J535jzyPHZ0',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4121 - VLSI Design and Technology',
    teacherName: 'Ghani Sir',
    tags: ['vlsi', 'ghani', 'lec-08', 'review', 'bulk', 'epitaxial growth'],
  },
  {
    id: 'rec52',
    title: 'Lecture 09',
    youtubeVideoId: 'qzhnmZiIp2g',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4121 - VLSI Design and Technology',
    teacherName: 'Ghani Sir',
    tags: ['vlsi', 'ghani', 'lec-09'],
  },
  {
    id: 'rec53',
    title: 'Silicon Wafer Production HD, 1280x720',
    youtubeVideoId: 'TejI91T1n70',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4121 - VLSI Design and Technology',
    teacherName: 'Ghani Sir',
    tags: ['vlsi', 'ghani', 'silicon wafer', 'production', 'hd'],
  },
  {
    id: 'rec54',
    title: 'Lecture 05',
    youtubeVideoId: 'cclV-PVXlVw',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4135 - Digital Signal Processing',
    teacherName: 'Mahbub Sir',
    tags: ['dsp', 'mahbub', 'lec-05'],
  },
  {
    id: 'rec55',
    title: 'Lecture 06',
    youtubeVideoId: 'VyxgiQuRJGI',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4135 - Digital Signal Processing',
    teacherName: 'Mahbub Sir',
    tags: ['dsp', 'mahbub', 'lec-06'],
  },
  {
    id: 'rec56',
    title: 'Lecture 07',
    youtubeVideoId: '2Ymy_AY3HRg',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4135 - Digital Signal Processing',
    teacherName: 'Mahbub Sir',
    tags: ['dsp', 'mahbub', 'lec-07'],
  },
  {
    id: 'rec57',
    title: 'Lecture 08',
    youtubeVideoId: '5Jsn7LnPeQ4',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4135 - Digital Signal Processing',
    teacherName: 'Mahbub Sir',
    tags: ['dsp', 'mahbub', 'lec-08'],
  },
  {
    id: 'rec58',
    title: 'Lecture 09',
    youtubeVideoId: 'OQM9aLJegSI',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4135 - Digital Signal Processing',
    teacherName: 'Mahbub Sir',
    tags: ['dsp', 'mahbub', 'lec-09'],
  },
  {
    id: 'rec59',
    title: 'Lecture 10',
    youtubeVideoId: 'hEkKp4lk7JA',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4135 - Digital Signal Processing',
    teacherName: 'Mahbub Sir',
    tags: ['dsp', 'mahbub', 'lec-10'],
  },
  {
    id: 'rec60',
    title: 'Lecture 11',
    youtubeVideoId: 'xOzpp78wkPQ',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4135 - Digital Signal Processing',
    teacherName: 'Mahbub Sir',
    tags: ['dsp', 'mahbub', 'lec-11'],
  },
  {
    id: 'rec61',
    title: 'Lecture 12',
    youtubeVideoId: 'hSvE4NnvJEk',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4135 - Digital Signal Processing',
    teacherName: 'Mahbub Sir',
    tags: ['dsp', 'mahbub', 'lec-12'],
  },
  {
    id: 'rec62',
    title: 'Lecture 01',
    youtubeVideoId: 'VQ4ev0xljfA',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4135 - Digital Signal Processing',
    teacherName: 'Mohiuddin Sir',
    tags: ['dsp', 'mohiuddin', 'lec-01'],
  },
  {
    id: 'rec63',
    title: 'Lecture 02',
    youtubeVideoId: 'mRgwla1j_aE',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4135 - Digital Signal Processing',
    teacherName: 'Mohiuddin Sir',
    tags: ['dsp', 'mohiuddin', 'lec-02'],
  },
  {
    id: 'rec64',
    title: 'Lecture 03',
    youtubeVideoId: 'gaMex1gQoU0',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4135 - Digital Signal Processing',
    teacherName: 'Mohiuddin Sir',
    tags: ['dsp', 'mohiuddin', 'lec-03'],
  },
  {
    id: 'rec65',
    title: 'Lecture 04',
    youtubeVideoId: 'XOn1iZeqNrI',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4135 - Digital Signal Processing',
    teacherName: 'Mohiuddin Sir',
    tags: ['dsp', 'mohiuddin', 'lec-04'],
  },
  {
    id: 'rec66',
    title: 'Lecture-05',
    youtubeVideoId: '1TGSZLgTu_U',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4135 - Digital Signal Processing',
    teacherName: 'Mohiuddin Sir',
    tags: ['dsp', 'mohiuddin', 'lec-05'],
  },
  {
    id: 'rec67',
    title: 'Lecture 01',
    youtubeVideoId: 'zlykTmm9CpQ',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4103 - Power System -II',
    teacherName: 'Rafiq Sir (RI1)',
    tags: ['power system', 'ri1', 'rafiq', 'lec-01'],
  },
  {
    id: 'rec68',
    title: 'Lecture 02',
    youtubeVideoId: '_FL5wRTRIWM',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4103 - Power System -II',
    teacherName: 'Rafiq Sir (RI1)',
    tags: ['power system', 'ri1', 'rafiq', 'lec-02'],
  },
  {
    id: 'rec69',
    title: 'Lecture 03',
    youtubeVideoId: '9on4YzgMrJc',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4103 - Power System -II',
    teacherName: 'Rafiq Sir (RI1)',
    tags: ['power system', 'ri1', 'rafiq', 'lec-03'],
  },
  {
    id: 'rec70',
    title: 'Lecture 04',
    youtubeVideoId: 'vIKeFgbDKcw',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4103 - Power System -II',
    teacherName: 'Rafiq Sir (RI1)',
    tags: ['power system', 'ri1', 'rafiq', 'lec-04'],
  },
  {
    id: 'rec71',
    title: 'Lecture 05',
    youtubeVideoId: 'wBcooAro38k',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4103 - Power System -II',
    teacherName: 'Rafiq Sir (RI1)',
    tags: ['power system', 'ri1', 'rafiq', 'lec-05'],
  },
  {
    id: 'rec72',
    title: 'Lecture 06',
    youtubeVideoId: '1Bjz1vhdphk',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4103 - Power System -II',
    teacherName: 'Rafiq Sir (RI1)',
    tags: ['power system', 'ri1', 'rafiq', 'lec-06'],
  },
  {
    id: 'rec73',
    title: 'Lecture 01',
    youtubeVideoId: 'nYMTaWcq8Kg',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4103 - Power System -II',
    teacherName: 'Salahuddin Sir',
    tags: ['power system', 'salahuddin', 'lec-01'],
  },
  {
    id: 'rec74',
    title: 'Lecture 02',
    youtubeVideoId: 'B1EK1yNlmuo',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4103 - Power System -II',
    teacherName: 'Salahuddin Sir',
    tags: ['power system', 'salahuddin', 'lec-02'],
  },
  {
    id: 'rec75',
    title: 'Lecture 03',
    youtubeVideoId: 'mVJdmK2HALA',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4103 - Power System -II',
    teacherName: 'Salahuddin Sir',
    tags: ['power system', 'salahuddin', 'lec-03'],
  },
  {
    id: 'rec76',
    title: 'Lecture 04',
    youtubeVideoId: 'huG5vX9oDeM',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4103 - Power System -II',
    teacherName: 'Salahuddin Sir',
    tags: ['power system', 'salahuddin', 'lec-04'],
  },
  {
    id: 'rec77',
    title: 'Lecture 05',
    youtubeVideoId: 'l_I3zu005zM',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4103 - Power System -II',
    teacherName: 'Salahuddin Sir',
    tags: ['power system', 'salahuddin', 'lec-05'],
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
    if (!selectedYear || !selectedSemester) return [];
    const courses = new Set<string>();
    allRecordings
      .filter(r => r.year === selectedYear && r.semester === selectedSemester && r.courseName)
      .forEach(r => courses.add(r.courseName!));
    return Array.from(courses).sort();
  }, [allRecordings, selectedYear, selectedSemester]);

  useEffect(() => {
    if (dynamicCourseNames.length > 0) {
      setSelectedCourseName(dynamicCourseNames[0]);
    }
  }, [dynamicCourseNames]);

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
        (selectedCourseName ? recording.courseName === selectedCourseName : true) &&
        (selectedTeacherName !== 'All Teachers' ? recording.teacherName === selectedTeacherName : true)
      );
    }
  }, [searchTerm, selectedYear, selectedSemester, selectedCourseName, selectedTeacherName, allRecordings]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedYear(baseYears[0]);
    setSelectedSemester(baseSemesters[0]);
    setSelectedCourseName(dynamicCourseNames[0] || '');
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

