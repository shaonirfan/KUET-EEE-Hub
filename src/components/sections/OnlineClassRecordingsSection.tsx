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
import { LazyYouTube } from '@/components/ui/LazyYouTube';

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
    teacherName: 'Rafiq Sir (RI1)',
 tags: ['review', 'RI1', 'Rafiq Sir'],
  },
  {
    id: 'rec9',
    title: 'Lecture-01 (Digital Switching System part-1)',
    youtubeVideoId: 'ecQc-0454Eo',
    year: '4th Year',
    semester: '1st Sem',
    teacherName: 'Rafiq Sir (RI1)',
    courseName: 'EE 4105 - Communication Engineering-II',
 tags: ['lecture-01', 'digital switching system', 'part-1', 'RI1', 'Rafiq Sir'],
  },
  {
    id: 'rec10',
    title: 'Lecture-02 (Digital Switching System part-2)',
    youtubeVideoId: 'hQyaNkrzwF8',
    year: '4th Year',
    semester: '1st Sem',
    teacherName: 'Rafiq Sir (RI1)',
    courseName: 'EE 4105 - Communication Engineering-II',
 tags: ['lecture-02', 'digital switching system', 'part-2', 'RI1', 'Rafiq Sir'],
  },
  {
    id: 'rec11',
    title: 'Lecture-03 (Virtual Circuit Network)',
    youtubeVideoId: 'hDoXPZ53xC8',
    year: '4th Year',
    semester: '1st Sem',
    teacherName: 'Rafiq Sir (RI1)',
    courseName: 'EE 4105 - Communication Engineering-II',
 tags: ['lecture-03', 'virtual circuit network', 'RI1', 'Rafiq Sir'],
  },
  {
    id: 'rec12',
    title: 'Lecture-04 (Traffic Engineering)',
    youtubeVideoId: 'UIVvMcimpo8',
    year: '4th Year',
    semester: '1st Sem',
    teacherName: 'Rafiq Sir (RI1)',
    courseName: 'EE 4105 - Communication Engineering-II',
 tags: ['lecture-04', 'traffic engineering', 'RI1', 'Rafiq Sir'],
  },
  {
    id: 'rec13',
    title: 'Lecture-05 (Fiber Optic part-01)',
    youtubeVideoId: 'jXCXOZhpkC8',
    year: '4th Year',
    semester: '1st Sem',
    teacherName: 'Rafiq Sir (RI1)',
    courseName: 'EE 4105 - Communication Engineering-II',
 tags: ['lecture-05', 'fiber optic', 'part-01', 'RI1', 'Rafiq Sir'],
  },
  {
    id: 'rec14',
    title: 'Lecture-06(Fiber Optic part-2)',
    youtubeVideoId: 'L9MDmnQLNBs',
    year: '4th Year',
    semester: '1st Sem',
    teacherName: 'Rafiq Sir (RI1)',
    courseName: 'EE 4105 - Communication Engineering-II',
    tags: ['lecture-06', 'fiber optic', 'part-2', 'RI1', 'Rafiq Sir'],
  },
  {
    id: 'rec15',
    title: 'Lecture-07 (ISDN)',
    youtubeVideoId: 'IGxlv6lBO_E',
 year: '4th Year',
    semester: '1st Sem',
    teacherName: 'Rafiq Sir (RI1)',
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
    teacherName: 'Rafiq Sir (RI2)',
    tags: ['power system', 'RI2', 'rafiq', 'lec-01'],
  },
  {
    id: 'rec68',
    title: 'Lecture 02',
    youtubeVideoId: '_FL5wRTRIWM',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4103 - Power System -II',
    teacherName: 'Rafiq Sir (RI2)',
    tags: ['power system', 'RI2', 'rafiq', 'lec-02'],
  },
  {
    id: 'rec69',
    title: 'Lecture 03',
    youtubeVideoId: '9on4YzgMrJc',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4103 - Power System -II',
    teacherName: 'Rafiq Sir (RI2)',
    tags: ['power system', 'RI2', 'rafiq', 'lec-03'],
  },
  {
    id: 'rec70',
    title: 'Lecture 04',
    youtubeVideoId: 'vIKeFgbDKcw',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4103 - Power System -II',
    teacherName: 'Rafiq Sir (RI2)',
    tags: ['power system', 'RI2', 'rafiq', 'lec-04'],
  },
  {
    id: 'rec71',
    title: 'Lecture 05',
    youtubeVideoId: 'wBcooAro38k',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4103 - Power System -II',
    teacherName: 'Rafiq Sir (RI2)',
    tags: ['power system', 'RI2', 'rafiq', 'lec-05'],
  },
  {
    id: 'rec72',
    title: 'Lecture 06',
    youtubeVideoId: '1Bjz1vhdphk',
    year: '4th Year',
    semester: '1st Sem',
    courseName: 'EE 4103 - Power System -II',
    teacherName: 'Rafiq Sir (RI2)',
    tags: ['power system', 'RI2', 'rafiq', 'lec-06'],
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
  {
    id: 'rec78',
    title: 'Lecture-01',
    youtubeVideoId: 'C4J0AmMHiyo',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4203 - Switchgear and Protection',
    teacherName: 'Rafiqul Sir (RI2)',
    tags: ['switchgear', 'protection', 'ri2', 'rafiqul', 'lec-01'],
  },
  {
    id: 'rec79',
    title: 'Lecture-02 (part 1)',
    youtubeVideoId: 'pPOSovh-wTs',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4203 - Switchgear and Protection',
    teacherName: 'Rafiqul Sir (RI2)',
    tags: ['switchgear', 'protection', 'ri2', 'rafiqul', 'lec-02', 'part-1'],
  },
  {
    id: 'rec80',
    title: 'Lecture-02 (part 2)',
    youtubeVideoId: 'lwwTfpypSiA',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4203 - Switchgear and Protection',
    teacherName: 'Rafiqul Sir (RI2)',
    tags: ['switchgear', 'protection', 'ri2', 'rafiqul', 'lec-02', 'part-2'],
  },
  {
    id: 'rec81',
    title: 'Lecture-03',
    youtubeVideoId: 'HVlmMVA-GNE',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4203 - Switchgear and Protection',
    teacherName: 'Rafiqul Sir (RI2)',
    tags: ['switchgear', 'protection', 'ri2', 'rafiqul', 'lec-03'],
  },
  {
    id: 'rec82',
    title: 'Lecture -04',
    youtubeVideoId: 'nNt2ureTb28',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4203 - Switchgear and Protection',
    teacherName: 'Rafiqul Sir (RI2)',
    tags: ['switchgear', 'protection', 'ri2', 'rafiqul', 'lec-04'],
  },
  {
    id: 'rec83',
    title: 'Lecture-05',
    youtubeVideoId: 'K-meIiha1qQ',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4203 - Switchgear and Protection',
    teacherName: 'Rafiqul Sir (RI2)',
    tags: ['switchgear', 'protection', 'ri2', 'rafiqul', 'lec-05'],
  },
  {
    id: 'rec84',
    title: 'Lecture-06',
    youtubeVideoId: '72NICFs0Ktg',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4203 - Switchgear and Protection',
    teacherName: 'Rafiqul Sir (RI2)',
    tags: ['switchgear', 'protection', 'ri2', 'rafiqul', 'lec-06'],
  },
  {
    id: 'rec85',
    title: 'Lecture-07',
    youtubeVideoId: 'PShGJ_VkEg0',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4203 - Switchgear and Protection',
    teacherName: 'Rafiqul Sir (RI2)',
    tags: ['switchgear', 'protection', 'ri2', 'rafiqul', 'lec-07'],
  },
  {
    id: 'rec86',
    title: 'Lecture-08',
    youtubeVideoId: 'HOFPxdIcYg8',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4203 - Switchgear and Protection',
    teacherName: 'Rafiqul Sir (RI2)',
    tags: ['switchgear', 'protection', 'ri2', 'rafiqul', 'lec-08'],
  },
  {
    id: 'rec87',
    title: 'Lecture-09',
    youtubeVideoId: '-R0tK58_2bM',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4203 - Switchgear and Protection',
    teacherName: 'Rafiqul Sir (RI2)',
    tags: ['switchgear', 'protection', 'ri2', 'rafiqul', 'lec-09'],
  },
  {
    id: 'rec88',
    title: 'Lecture-10',
    youtubeVideoId: 'QJqEO4UjD3s',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4203 - Switchgear and Protection',
    teacherName: 'Rafiqul Sir (RI2)',
    tags: ['switchgear', 'protection', 'ri2', 'rafiqul', 'lec-10'],
  },
  {
    id: 'rec89',
    title: 'Lecture-11',
    youtubeVideoId: '9WJmsYYnNVE',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4203 - Switchgear and Protection',
    teacherName: 'Rafiqul Sir (RI2)',
    tags: ['switchgear', 'protection', 'ri2', 'rafiqul', 'lec-11'],
  },
  {
    id: 'rec90',
    title: 'Lecture-12',
    youtubeVideoId: 'LIjYSF4HFiQ',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4203 - Switchgear and Protection',
    teacherName: 'Rafiqul Sir (RI2)',
    tags: ['switchgear', 'protection', 'ri2', 'rafiqul', 'lec-12'],
  },
  {
    id: 'rec91',
    title: 'Lecture-13',
    youtubeVideoId: 'p0KhLujW_xo',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4203 - Switchgear and Protection',
    teacherName: 'Rafiqul Sir (RI2)',
    tags: ['switchgear', 'protection', 'ri2', 'rafiqul', 'lec-13'],
  },
  {
    id: 'rec92',
    title: 'Lecture 01',
    youtubeVideoId: 'ws0RkspgtPk',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4203 - Switchgear and Protection',
    teacherName: 'Salahuddin Sir',
    tags: ['switchgear', 'protection', 'salahuddin', 'lec-01'],
  },
  {
    id: 'rec93',
    title: 'Lecture 02',
    youtubeVideoId: 'afBMG5P5dto',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4203 - Switchgear and Protection',
    teacherName: 'Salahuddin Sir',
    tags: ['switchgear', 'protection', 'salahuddin', 'lec-02'],
  },
  {
    id: 'rec94',
    title: 'Lecture 03',
    youtubeVideoId: 'e-jnrZ_JlXE',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4203 - Switchgear and Protection',
    teacherName: 'Salahuddin Sir',
    tags: ['switchgear', 'protection', 'salahuddin', 'lec-03'],
  },
  {
    id: 'rec95',
    title: 'Lecture 04',
    youtubeVideoId: 'Y0Nz_D11hOA',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4203 - Switchgear and Protection',
    teacherName: 'Salahuddin Sir',
    tags: ['switchgear', 'protection', 'salahuddin', 'lec-04'],
  },
  {
    id: 'rec96',
    title: 'Lecture 05',
    youtubeVideoId: 'oc3vkbyorK8',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4203 - Switchgear and Protection',
    teacherName: 'Salahuddin Sir',
    tags: ['switchgear', 'protection', 'salahuddin', 'lec-05'],
  },
  {
    id: 'rec97',
    title: 'Lecture 06',
    youtubeVideoId: 'JOxcS6YJUHM',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4203 - Switchgear and Protection',
    teacherName: 'Salahuddin Sir',
    tags: ['switchgear', 'protection', 'salahuddin', 'lec-06'],
  },
  {
    id: 'rec98',
    title: 'Lecture 07',
    youtubeVideoId: 'TLy504PsAs8',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4203 - Switchgear and Protection',
    teacherName: 'Salahuddin Sir',
    tags: ['switchgear', 'protection', 'salahuddin', 'lec-07'],
  },
  {
    id: 'rec99',
    title: 'Lecture 08',
    youtubeVideoId: 'u5rRYZFHjmo',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4203 - Switchgear and Protection',
    teacherName: 'Salahuddin Sir',
    tags: ['switchgear', 'protection', 'salahuddin', 'lec-08'],
  },
  {
    id: 'rec100',
    title: 'Lecture 09',
    youtubeVideoId: 'GoR_Kx-X18M',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4203 - Switchgear and Protection',
    teacherName: 'Salahuddin Sir',
    tags: ['switchgear', 'protection', 'salahuddin', 'lec-09'],
  },
  {
    id: 'rec101',
    title: 'Lecture 10',
    youtubeVideoId: 'CUxr2vc9XII',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4203 - Switchgear and Protection',
    teacherName: 'Salahuddin Sir',
    tags: ['switchgear', 'protection', 'salahuddin', 'lec-10'],
  },
  {
    id: 'rec102',
    title: 'Lecture-01 (introduction class)',
    youtubeVideoId: 'yOcpNRY5YgY',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4217 - Power Plant Engineering',
    teacherName: 'Protik Sir (PCB)',
    tags: ['power plant', 'protik', 'pcb', 'lec-01', 'introduction'],
  },
  {
    id: 'rec103',
    title: 'Lecture-02',
    youtubeVideoId: 'JaNbR4ZMaX4',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4217 - Power Plant Engineering',
    teacherName: 'Protik Sir (PCB)',
    tags: ['power plant', 'protik', 'pcb', 'lec-02'],
  },
  {
    id: 'rec104',
    title: 'Lecture-03',
    youtubeVideoId: 'z-ktdUATylA',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4217 - Power Plant Engineering',
    teacherName: 'Protik Sir (PCB)',
    tags: ['power plant', 'protik', 'pcb', 'lec-03'],
  },
  {
    id: 'rec105',
    title: 'Lecture-04',
    youtubeVideoId: 'yHUWmmPHCp0',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4217 - Power Plant Engineering',
    teacherName: 'Protik Sir (PCB)',
    tags: ['power plant', 'protik', 'pcb', 'lec-04'],
  },
  {
    id: 'rec106',
    title: 'Lecture-05',
    youtubeVideoId: 'nr5BuQxULOc',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4217 - Power Plant Engineering',
    teacherName: 'Protik Sir (PCB)',
    tags: ['power plant', 'protik', 'pcb', 'lec-05'],
  },
  {
    id: 'rec107',
    title: 'Lecture-06',
    youtubeVideoId: 'XuYY_2Z1aXU',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4217 - Power Plant Engineering',
    teacherName: 'Protik Sir (PCB)',
    tags: ['power plant', 'protik', 'pcb', 'lec-06'],
  },
  {
    id: 'rec108',
    title: 'Lecture-07',
    youtubeVideoId: 'JwjvwdXQ_KU',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4217 - Power Plant Engineering',
    teacherName: 'Protik Sir (PCB)',
    tags: ['power plant', 'protik', 'pcb', 'lec-07'],
  },
  {
    id: 'rec109',
    title: 'Lecture-08',
    youtubeVideoId: '3MqwEHtGuJE',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4217 - Power Plant Engineering',
    teacherName: 'Protik Sir (PCB)',
    tags: ['power plant', 'protik', 'pcb', 'lec-08'],
  },
  {
    id: 'rec110',
    title: 'Lecture-09 (Part 1)',
    youtubeVideoId: 'Ev-vlAk5BUM',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4217 - Power Plant Engineering',
    teacherName: 'Protik Sir (PCB)',
    tags: ['power plant', 'protik', 'pcb', 'lec-09', 'part-1'],
  },
  {
    id: 'rec111',
    title: 'Lecture-09 (Part 2)',
    youtubeVideoId: 'jopTCiEa1ms',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4217 - Power Plant Engineering',
    teacherName: 'Protik Sir (PCB)',
    tags: ['power plant', 'protik', 'pcb', 'lec-09', 'part-2'],
  },
  {
    id: 'rec112',
    title: 'Lecture-10',
    youtubeVideoId: 'ejjJM9N-uKM',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4217 - Power Plant Engineering',
    teacherName: 'Protik Sir (PCB)',
    tags: ['power plant', 'protik', 'pcb', 'lec-10'],
  },
  {
    id: 'rec113',
    title: 'Lecture-11',
    youtubeVideoId: 'JqJE9oyNafw',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4217 - Power Plant Engineering',
    teacherName: 'Protik Sir (PCB)',
    tags: ['power plant', 'protik', 'pcb', 'lec-11'],
  },
  {
    id: 'rec114',
    title: 'Lecture-01',
    youtubeVideoId: 'Ub2HwRfAvFk',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4217 - Power Plant Engineering',
    teacherName: 'Naruttam Sir',
    tags: ['power plant', 'naruttam', 'lec-01'],
  },
  {
    id: 'rec115',
    title: 'Lecture-02',
    youtubeVideoId: 'n-N4XbaMa80',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4217 - Power Plant Engineering',
    teacherName: 'Naruttam Sir',
    tags: ['power plant', 'naruttam', 'lec-02'],
  },
  {
    id: 'rec116',
    title: 'Lecture-03',
    youtubeVideoId: 'gB53bDYJ3O8',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4217 - Power Plant Engineering',
    teacherName: 'Naruttam Sir',
    tags: ['power plant', 'naruttam', 'lec-03'],
  },
  {
    id: 'rec117',
    title: 'Lecture-04 (Scattering)',
    youtubeVideoId: 'F45m95U7TGo',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4217 - Power Plant Engineering',
    teacherName: 'Naruttam Sir',
    tags: ['power plant', 'naruttam', 'lec-04', 'scattering'],
  },
  {
    id: 'rec118',
    title: 'Lecture-05',
    youtubeVideoId: '02K4_UtRB8g',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4217 - Power Plant Engineering',
    teacherName: 'Naruttam Sir',
    tags: ['power plant', 'naruttam', 'lec-05'],
  },
  {
    id: 'rec119',
    title: 'Lecture-06 (Reactor)',
    youtubeVideoId: '77hN1qw5Zmc',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4217 - Power Plant Engineering',
    teacherName: 'Naruttam Sir',
    tags: ['power plant', 'naruttam', 'lec-06', 'reactor'],
  },
  {
    id: 'rec120',
    title: 'Lecture-07 (Thermal Powerplant & Reactor Math)',
    youtubeVideoId: 'WsAhyfu6WnY',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4217 - Power Plant Engineering',
    teacherName: 'Naruttam Sir',
    tags: ['power plant', 'naruttam', 'lec-07', 'thermal', 'reactor math'],
  },
  {
    id: 'rec121',
    title: 'Lecture-08 (Hydro Power Plant)',
    youtubeVideoId: 'GV5TfXFxivY',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4217 - Power Plant Engineering',
    teacherName: 'Naruttam Sir',
    tags: ['power plant', 'naruttam', 'lec-08', 'hydro'],
  },
  {
    id: 'rec122',
    title: 'Lecture-09(Part 1) (Non-conventional Sources of Energy & Solar Energy)',
    youtubeVideoId: 'hI_GGzpwpM8',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4217 - Power Plant Engineering',
    teacherName: 'Naruttam Sir',
    tags: ['power plant', 'naruttam', 'lec-09', 'part-1', 'non-conventional', 'solar'],
  },
  {
    id: 'rec123',
    title: 'Lecture-09(Part 2) (Non-conventional Sources of Energy & Solar Energy)',
    youtubeVideoId: 'TzfzXnvgUFs',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4217 - Power Plant Engineering',
    teacherName: 'Naruttam Sir',
    tags: ['power plant', 'naruttam', 'lec-09', 'part-2', 'non-conventional', 'solar'],
  },
  {
    id: 'rec124',
    title: 'Lecture-10 (Wind & Alternate Energy Sources)',
    youtubeVideoId: 'yz-Sz4WxKdA',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4217 - Power Plant Engineering',
    teacherName: 'Naruttam Sir',
    tags: ['power plant', 'naruttam', 'lec-10', 'wind', 'alternate energy'],
  },
  {
    id: 'rec125',
    title: 'Lecture-11 (part-1) (Magneto Hydro Dynamic (MHD)Generator)',
    youtubeVideoId: 'RRxfiOheZ6U',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4217 - Power Plant Engineering',
    teacherName: 'Naruttam Sir',
    tags: ['power plant', 'naruttam', 'lec-11', 'part-1', 'mhd', 'generator'],
  },
  {
    id: 'rec126',
    title: 'Lecture-11 (part-2) (MHD Generator, Biomass, Tidal Energy)',
    youtubeVideoId: 'JEdNeaxQ9rw',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4217 - Power Plant Engineering',
    teacherName: 'Naruttam Sir',
    tags: ['power plant', 'naruttam', 'lec-11', 'part-2', 'mhd', 'biomass', 'tidal'],
  },
  {
    id: 'rec127',
    title: 'Lecture 01',
    youtubeVideoId: 'PYQaDbtW8n0',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4235 - Digital Image Processing',
    teacherName: 'Salahuddin Sir',
    tags: ['image processing', 'salahuddin', 'lec-01'],
  },
  {
    id: 'rec128',
    title: 'Lecture 02',
    youtubeVideoId: 'vMXyUzWSOHw',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4235 - Digital Image Processing',
    teacherName: 'Salahuddin Sir',
    tags: ['image processing', 'salahuddin', 'lec-02'],
  },
  {
    id: 'rec129',
    title: 'Lecture 03',
    youtubeVideoId: 'CvetWtY51UI',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4235 - Digital Image Processing',
    teacherName: 'Salahuddin Sir',
    tags: ['image processing', 'salahuddin', 'lec-03'],
  },
  {
    id: 'rec130',
    title: 'Lecture 04',
    youtubeVideoId: '7eI8m1Qz2bg',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4235 - Digital Image Processing',
    teacherName: 'Salahuddin Sir',
    tags: ['image processing', 'salahuddin', 'lec-04'],
  },
  {
    id: 'rec131',
    title: 'Lecture 05',
    youtubeVideoId: 'XwOXFKsE-B8',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4235 - Digital Image Processing',
    teacherName: 'Salahuddin Sir',
    tags: ['image processing', 'salahuddin', 'lec-05'],
  },
  {
    id: 'rec132',
    title: 'Lecture 06',
    youtubeVideoId: 'vCzXg3TzKcQ',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4235 - Digital Image Processing',
    teacherName: 'Salahuddin Sir',
    tags: ['image processing', 'salahuddin', 'lec-06'],
  },
  {
    id: 'rec133',
    title: 'Lecture 07',
    youtubeVideoId: 'dH13FCcSJYI',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4235 - Digital Image Processing',
    teacherName: 'Salahuddin Sir',
    tags: ['image processing', 'salahuddin', 'lec-07'],
  },
  {
    id: 'rec134',
    title: 'Lecture 08',
    youtubeVideoId: 'KZ5i1Xz5ZEg',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4235 - Digital Image Processing',
    teacherName: 'Salahuddin Sir',
    tags: ['image processing', 'salahuddin', 'lec-08'],
  },
  {
    id: 'rec135',
    title: 'Lecture 09',
    youtubeVideoId: '4fiWvDM0psE',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4235 - Digital Image Processing',
    teacherName: 'Salahuddin Sir',
    tags: ['image processing', 'salahuddin', 'lec-09'],
  },
  {
    id: 'rec136',
    title: 'Lecture-01',
    youtubeVideoId: 'oLn113rAq4Q',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4235 - Digital Image Processing',
    teacherName: 'Mohiuddin Sir',
    tags: ['image processing', 'mohiuddin', 'lec-01'],
  },
  {
    id: 'rec137',
    title: 'Lecture-02',
    youtubeVideoId: '9tWTFUv8MsU',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4235 - Digital Image Processing',
    teacherName: 'Mohiuddin Sir',
    tags: ['image processing', 'mohiuddin', 'lec-02'],
  },
  {
    id: 'rec138',
    title: 'Lecture-03',
    youtubeVideoId: '7zmDGqv9lhE',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4235 - Digital Image Processing',
    teacherName: 'Mohiuddin Sir',
    tags: ['image processing', 'mohiuddin', 'lec-03'],
  },
  {
    id: 'rec139',
    title: 'Lecture-04',
    youtubeVideoId: 'wWBhY4imBkc',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4235 - Digital Image Processing',
    teacherName: 'Mohiuddin Sir',
    tags: ['image processing', 'mohiuddin', 'lec-04'],
  },
  {
    id: 'rec140',
    title: 'Lecture-05',
    youtubeVideoId: 'jSm4CjQggZM',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4235 - Digital Image Processing',
    teacherName: 'Mohiuddin Sir',
    tags: ['image processing', 'mohiuddin', 'lec-05'],
  },
  {
    id: 'rec141',
    title: 'Lecture-06',
    youtubeVideoId: 'l11gQTir9iM',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4235 - Digital Image Processing',
    teacherName: 'Mohiuddin Sir',
    tags: ['image processing', 'mohiuddin', 'lec-06'],
  },
  {
    id: 'rec142',
    title: 'Lecture-11',
    youtubeVideoId: 'lFvRj_0eGWk',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4235 - Digital Image Processing',
    teacherName: 'Mohiuddin Sir',
    tags: ['image processing', 'mohiuddin', 'lec-11'],
  },
  {
    id: 'rec143',
    title: 'Lecture-13',
    youtubeVideoId: '4VxZ704hxz4',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4235 - Digital Image Processing',
    teacherName: 'Mohiuddin Sir',
    tags: ['image processing', 'mohiuddin', 'lec-13'],
  },
  {
    id: 'rec144',
    title: 'Lecture--01',
    youtubeVideoId: '4jr_MGi4SU0',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4237 - Special Machines and AC drives',
    teacherName: 'Protik Sir (PCB)',
    tags: ['special machines', 'ac drives', 'protik', 'pcb', 'lec-01'],
  },
  {
    id: 'rec145',
    title: 'Lecture-02',
    youtubeVideoId: 'cWyxk5Qirls',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4237 - Special Machines and AC drives',
    teacherName: 'Protik Sir (PCB)',
    tags: ['special machines', 'ac drives', 'protik', 'pcb', 'lec-02'],
  },
  {
    id: 'rec146',
    title: 'Lecture-03',
    youtubeVideoId: 'j_-nFwv6uaw',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4237 - Special Machines and AC drives',
    teacherName: 'Protik Sir (PCB)',
    tags: ['special machines', 'ac drives', 'protik', 'pcb', 'lec-03'],
  },
  {
    id: 'rec147',
    title: 'Lecture-04',
    youtubeVideoId: 'kaFS5xaUtTs',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4237 - Special Machines and AC drives',
    teacherName: 'Protik Sir (PCB)',
    tags: ['special machines', 'ac drives', 'protik', 'pcb', 'lec-04'],
  },
  {
    id: 'rec148',
    title: 'Lecture-05',
    youtubeVideoId: '0ZUDF3Cd75s',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4237 - Special Machines and AC drives',
    teacherName: 'Protik Sir (PCB)',
    tags: ['special machines', 'ac drives', 'protik', 'pcb', 'lec-05'],
  },
  {
    id: 'rec149',
    title: 'Lecture-06',
    youtubeVideoId: 'Roo1mMB-nkE',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4237 - Special Machines and AC drives',
    teacherName: 'Protik Sir (PCB)',
    tags: ['special machines', 'ac drives', 'protik', 'pcb', 'lec-06'],
  },
  {
    id: 'rec150',
    title: 'Lecture-07',
    youtubeVideoId: 'mvknqh1Yscc',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4237 - Special Machines and AC drives',
    teacherName: 'Protik Sir (PCB)',
    tags: ['special machines', 'ac drives', 'protik', 'pcb', 'lec-07'],
  },
  {
    id: 'rec151',
    title: 'Lecture-08',
    youtubeVideoId: 'i6tZHZ9ivkA',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4237 - Special Machines and AC drives',
    teacherName: 'Protik Sir (PCB)',
    tags: ['special machines', 'ac drives', 'protik', 'pcb', 'lec-08'],
  },
  {
    id: 'rec152',
    title: 'Lecture-09',
    youtubeVideoId: 'leb7yRycnJc',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4237 - Special Machines and AC drives',
    teacherName: 'Protik Sir (PCB)',
    tags: ['special machines', 'ac drives', 'protik', 'pcb', 'lec-09'],
  },
  {
    id: 'rec153',
    title: 'Lecture-10 (Part 1)',
    youtubeVideoId: 'X4hZRcZHRCg',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4237 - Special Machines and AC drives',
    teacherName: 'Protik Sir (PCB)',
    tags: ['special machines', 'ac drives', 'protik', 'pcb', 'lec-10', 'part-1'],
  },
  {
    id: 'rec154',
    title: 'Lecture-10 (Part 2)',
    youtubeVideoId: 'u4CCXJCo_6A',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4237 - Special Machines and AC drives',
    teacherName: 'Protik Sir (PCB)',
    tags: ['special machines', 'ac drives', 'protik', 'pcb', 'lec-10', 'part-2'],
  },
  {
    id: 'rec155',
    title: 'Lecture-11',
    youtubeVideoId: 'x4GAhVkFpWk',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4237 - Special Machines and AC drives',
    teacherName: 'Protik Sir (PCB)',
    tags: ['special machines', 'ac drives', 'protik', 'pcb', 'lec-11'],
  },
  {
    id: 'rec156',
    title: 'Lecture-12',
    youtubeVideoId: 'wGLKFbAQ6f0',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4237 - Special Machines and AC drives',
    teacherName: 'Protik Sir (PCB)',
    tags: ['special machines', 'ac drives', 'protik', 'pcb', 'lec-12'],
  },
  {
    id: 'rec157',
    title: 'Lecture-13',
    youtubeVideoId: 'Ptrd3p9vATE',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4237 - Special Machines and AC drives',
    teacherName: 'Protik Sir (PCB)',
    tags: ['special machines', 'ac drives', 'protik', 'pcb', 'lec-13'],
  },
  {
    id: 'rec158',
    title: 'Lecture 01',
    youtubeVideoId: '8ePeMDkAamM',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4237 - Special Machines and AC drives',
    teacherName: 'Habibullah Sir',
    tags: ['special machines', 'ac drives', 'habibullah', 'lec-01'],
  },
  {
    id: 'rec159',
    title: 'Lecture 02',
    youtubeVideoId: 'g24rnL_GBOQ',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4237 - Special Machines and AC drives',
    teacherName: 'Habibullah Sir',
    tags: ['special machines', 'ac drives', 'habibullah', 'lec-02'],
  },
  {
    id: 'rec160',
    title: 'Lecture 03',
    youtubeVideoId: 'YiAS6mXwYRo',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4237 - Special Machines and AC drives',
    teacherName: 'Habibullah Sir',
    tags: ['special machines', 'ac drives', 'habibullah', 'lec-03'],
  },
  {
    id: 'rec161',
    title: 'Lecture 04',
    youtubeVideoId: 'PtwzvcUUMdo',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4237 - Special Machines and AC drives',
    teacherName: 'Habibullah Sir',
    tags: ['special machines', 'ac drives', 'habibullah', 'lec-04'],
  },
  {
    id: 'rec162',
    title: 'Lecture 05 & 06',
    youtubeVideoId: 'uCCk0velPF4',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4237 - Special Machines and AC drives',
    teacherName: 'Habibullah Sir',
    tags: ['special machines', 'ac drives', 'habibullah', 'lec-05', 'lec-06'],
  },
  {
    id: 'rec163',
    title: 'Lecture 07',
    youtubeVideoId: 'E9I953AEwNs',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4237 - Special Machines and AC drives',
    teacherName: 'Habibullah Sir',
    tags: ['special machines', 'ac drives', 'habibullah', 'lec-07'],
  },
  {
    id: 'rec164',
    title: 'Lecture 08',
    youtubeVideoId: 'uIrEa8-Gzfk',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4237 - Special Machines and AC drives',
    teacherName: 'Habibullah Sir',
    tags: ['special machines', 'ac drives', 'habibullah', 'lec-08'],
  },
  {
    id: 'rec165',
    title: 'Lecture 09',
    youtubeVideoId: 'nsgwyxPT7Yg',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4237 - Special Machines and AC drives',
    teacherName: 'Habibullah Sir',
    tags: ['special machines', 'ac drives', 'habibullah', 'lec-09'],
  },
  {
    id: 'rec166',
    title: 'Lecture 10',
    youtubeVideoId: 'Ga713ChHsU4',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4237 - Special Machines and AC drives',
    teacherName: 'Habibullah Sir',
    tags: ['special machines', 'ac drives', 'habibullah', 'lec-10'],
  },
  {
    id: 'rec167',
    title: 'Lecture 11',
    youtubeVideoId: '3lWYuBYF_Pk',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4237 - Special Machines and AC drives',
    teacherName: 'Habibullah Sir',
    tags: ['special machines', 'ac drives', 'habibullah', 'lec-11'],
  },
  {
    id: 'rec168',
    title: 'Lecture 12',
    youtubeVideoId: '3ppD3v5D69s',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4237 - Special Machines and AC drives',
    teacherName: 'Habibullah Sir',
    tags: ['special machines', 'ac drives', 'habibullah', 'lec-12'],
  },
  {
    id: 'rec169',
    title: 'Lecture 13',
    youtubeVideoId: 'ik_G2RwcStI',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4237 - Special Machines and AC drives',
    teacherName: 'Habibullah Sir',
    tags: ['special machines', 'ac drives', 'habibullah', 'lec-13'],
  },
  {
    id: 'rec170',
    title: 'Lecture-01',
    youtubeVideoId: 'qm9wbmQvmn0',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4209 - Semiconductor Device Theory',
    teacherName: 'Jannat Sir',
    tags: ['semiconductor', 'device theory', 'jannat', 'lec-01'],
  },
  {
    id: 'rec171',
    title: 'Lecture-02',
    youtubeVideoId: 'q2_0qIsG8Zs',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4209 - Semiconductor Device Theory',
    teacherName: 'Jannat Sir',
    tags: ['semiconductor', 'device theory', 'jannat', 'lec-02'],
  },
  {
    id: 'rec172',
    title: 'Lecture-03 (Part 1)',
    youtubeVideoId: 'aiEJB9E-pqo',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4209 - Semiconductor Device Theory',
    teacherName: 'Jannat Sir',
    tags: ['semiconductor', 'device theory', 'jannat', 'lec-03', 'part-1'],
  },
  {
    id: 'rec173',
    title: 'Lecture-03 (Part 2)',
    youtubeVideoId: 'Vyx-UHif19w',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4209 - Semiconductor Device Theory',
    teacherName: 'Jannat Sir',
    tags: ['semiconductor', 'device theory', 'jannat', 'lec-03', 'part-2'],
  },
  {
    id: 'rec174',
    title: 'Lecture-04',
    youtubeVideoId: 'xhA3mOe5Cq8',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4209 - Semiconductor Device Theory',
    teacherName: 'Jannat Sir',
    tags: ['semiconductor', 'device theory', 'jannat', 'lec-04'],
  },
  {
    id: 'rec175',
    title: 'Lecture-05',
    youtubeVideoId: 'xE78dPcP_Hs',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4209 - Semiconductor Device Theory',
    teacherName: 'Jannat Sir',
    tags: ['semiconductor', 'device theory', 'jannat', 'lec-05'],
  },
  {
    id: 'rec176',
    title: 'Lecture-06',
    youtubeVideoId: 'OrsecZ4m2h4',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4209 - Semiconductor Device Theory',
    teacherName: 'Jannat Sir',
    tags: ['semiconductor', 'device theory', 'jannat', 'lec-06'],
  },
  {
    id: 'rec177',
    title: 'Lecture-07',
    youtubeVideoId: 'uvvW9t8DmZQ',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4209 - Semiconductor Device Theory',
    teacherName: 'Jannat Sir',
    tags: ['semiconductor', 'device theory', 'jannat', 'lec-07'],
  },
  {
    id: 'rec178',
    title: 'Lecture-08',
    youtubeVideoId: 'eNxOg9DOx-8',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4209 - Semiconductor Device Theory',
    teacherName: 'Jannat Sir',
    tags: ['semiconductor', 'device theory', 'jannat', 'lec-08'],
  },
  {
    id: 'rec179',
    title: 'Lecture-09',
    youtubeVideoId: 'ZYTnX9xm4GQ',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4209 - Semiconductor Device Theory',
    teacherName: 'Jannat Sir',
    tags: ['semiconductor', 'device theory', 'jannat', 'lec-09'],
  },
  {
    id: 'rec180',
    title: 'Lecture-10',
    youtubeVideoId: 'RbQeATI-GPQ',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4209 - Semiconductor Device Theory',
    teacherName: 'Jannat Sir',
    tags: ['semiconductor', 'device theory', 'jannat', 'lec-10'],
  },
  {
    id: 'rec181',
    title: 'Lecture 01',
    youtubeVideoId: 'J9NVi6xgs2I',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4209 - Semiconductor Device Theory',
    teacherName: 'Rezvi Sir',
    tags: ['semiconductor', 'device theory', 'rezvi', 'lec-01'],
  },
  {
    id: 'rec182',
    title: 'Lecture 02',
    youtubeVideoId: 'Eof0I6OSdek',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4209 - Semiconductor Device Theory',
    teacherName: 'Rezvi Sir',
    tags: ['semiconductor', 'device theory', 'rezvi', 'lec-02'],
  },
  {
    id: 'rec183',
    title: 'Lecture 03',
    youtubeVideoId: 'RLuKqR7UQ1A',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4209 - Semiconductor Device Theory',
    teacherName: 'Rezvi Sir',
    tags: ['semiconductor', 'device theory', 'rezvi', 'lec-03'],
  },
  {
    id: 'rec184',
    title: 'Lecture 04',
    youtubeVideoId: 'jAUBTKr8TsU',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4209 - Semiconductor Device Theory',
    teacherName: 'Rezvi Sir',
    tags: ['semiconductor', 'device theory', 'rezvi', 'lec-04'],
  },
  {
    id: 'rec185',
    title: 'Lecture 05',
    youtubeVideoId: 'EUcrz90wZjI',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4209 - Semiconductor Device Theory',
    teacherName: 'Rezvi Sir',
    tags: ['semiconductor', 'device theory', 'rezvi', 'lec-05'],
  },
  {
    id: 'rec186',
    title: 'Lecture 06',
    youtubeVideoId: '9PIjV_q38dA',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4209 - Semiconductor Device Theory',
    teacherName: 'Rezvi Sir',
    tags: ['semiconductor', 'device theory', 'rezvi', 'lec-06'],
  },
  {
    id: 'rec187',
    title: 'Lecture 07',
    youtubeVideoId: 'e9h9DSLd7jo',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4209 - Semiconductor Device Theory',
    teacherName: 'Rezvi Sir',
    tags: ['semiconductor', 'device theory', 'rezvi', 'lec-07'],
  },
  {
    id: 'rec188',
    title: 'Lecture 08',
    youtubeVideoId: 'meRqdrOhQ50',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4209 - Semiconductor Device Theory',
    teacherName: 'Rezvi Sir',
    tags: ['semiconductor', 'device theory', 'rezvi', 'lec-08'],
  },
  {
    id: 'rec189',
    title: 'Lecture 09',
    youtubeVideoId: 'wtJ3qIk6cm8',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4209 - Semiconductor Device Theory',
    teacherName: 'Rezvi Sir',
    tags: ['semiconductor', 'device theory', 'rezvi', 'lec-09'],
  },
  {
    id: 'rec190',
    title: 'Lecture 10',
    youtubeVideoId: '1vlgFifFL3c',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4209 - Semiconductor Device Theory',
    teacherName: 'Rezvi Sir',
    tags: ['semiconductor', 'device theory', 'rezvi', 'lec-10'],
  },
  {
    id: 'rec191',
    title: 'Lecture 11',
    youtubeVideoId: '9svZAEv7tHw',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4209 - Semiconductor Device Theory',
    teacherName: 'Rezvi Sir',
    tags: ['semiconductor', 'device theory', 'rezvi', 'lec-11'],
  },
  {
    id: 'rec192',
    title: 'Lecture 12',
    youtubeVideoId: 'df1bRkJ5vDU',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4209 - Semiconductor Device Theory',
    teacherName: 'Rezvi Sir',
    tags: ['semiconductor', 'device theory', 'rezvi', 'lec-12'],
  },
  {
    id: 'rec193',
    title: 'Lecture 13',
    youtubeVideoId: '6nJV5KiZr0Q',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4209 - Semiconductor Device Theory',
    teacherName: 'Rezvi Sir',
    tags: ['semiconductor', 'device theory', 'rezvi', 'lec-13'],
  },
  {
    id: 'rec194',
    title: 'Lecture 01',
    youtubeVideoId: 'WwQ281RNR0U',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4223 - High Voltage DC and Flexible AC Transmission',
    teacherName: 'Habibullah Sir',
    tags: ['hvdc', 'flexible ac', 'habibullah', 'lec-01'],
  },
  {
    id: 'rec195',
    title: 'Lecture- 02',
    youtubeVideoId: 'umxr9Aj1ZwU',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4223 - High Voltage DC and Flexible AC Transmission',
    teacherName: 'Habibullah Sir',
    tags: ['hvdc', 'flexible ac', 'habibullah', 'lec-02'],
  },
  {
    id: 'rec196',
    title: 'Lecture- 03',
    youtubeVideoId: 'lS7BfocCEsY',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4223 - High Voltage DC and Flexible AC Transmission',
    teacherName: 'Habibullah Sir',
    tags: ['hvdc', 'flexible ac', 'habibullah', 'lec-03'],
  },
  {
    id: 'rec197',
    title: 'Lecture-04',
    youtubeVideoId: 'f9yLk-_N-Sc',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4223 - High Voltage DC and Flexible AC Transmission',
    teacherName: 'Habibullah Sir',
    tags: ['hvdc', 'flexible ac', 'habibullah', 'lec-04'],
  },
  {
    id: 'rec198',
    title: 'Lecture- 05',
    youtubeVideoId: 'LxNawibfVHY',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4223 - High Voltage DC and Flexible AC Transmission',
    teacherName: 'Habibullah Sir',
    tags: ['hvdc', 'flexible ac', 'habibullah', 'lec-05'],
  },
  {
    id: 'rec199',
    title: 'Lecture- 06',
    youtubeVideoId: '5hVPSdXZUqA',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4223 - High Voltage DC and Flexible AC Transmission',
    teacherName: 'Habibullah Sir',
    tags: ['hvdc', 'flexible ac', 'habibullah', 'lec-06'],
  },
  {
    id: 'rec200',
    title: 'Lecture-07',
    youtubeVideoId: '2vm7d044oew',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4223 - High Voltage DC and Flexible AC Transmission',
    teacherName: 'Habibullah Sir',
    tags: ['hvdc', 'flexible ac', 'habibullah', 'lec-07'],
  },
  {
    id: 'rec201',
    title: 'Lecture- 09',
    youtubeVideoId: 'UFDB46u_heg',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4223 - High Voltage DC and Flexible AC Transmission',
    teacherName: 'Habibullah Sir',
    tags: ['hvdc', 'flexible ac', 'habibullah', 'lec-09'],
  },
  {
    id: 'rec202',
    title: 'Lecture-10',
    youtubeVideoId: '40gMEaH9--c',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4223 - High Voltage DC and Flexible AC Transmission',
    teacherName: 'Habibullah Sir',
    tags: ['hvdc', 'flexible ac', 'habibullah', 'lec-10'],
  },
  {
    id: 'rec203',
    title: 'Lecture-11',
    youtubeVideoId: '1CkvQOBou9g',
    year: '4th Year',
    semester: '2nd Sem',
    courseName: 'EE 4223 - High Voltage DC and Flexible AC Transmission',
    teacherName: 'Habibullah Sir',
    tags: ['hvdc', 'flexible ac', 'habibullah', 'lec-11'],
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
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

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
        {filteredRecordings.map((recording: Recording) => (
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
                  <LazyYouTube
                    videoId={recording.youtubeVideoId}
                    title={recording.title}
                    className="aspect-video rounded-md shadow-md"
                    isActive={activeVideoId === recording.youtubeVideoId}
                    onActivate={() => setActiveVideoId(recording.youtubeVideoId)}
                  />
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
                    {recording.tags.slice(0, 3).map((tag: string) => <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0.5">{tag}</Badge>)}
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

