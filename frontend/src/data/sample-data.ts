export interface Exam {
  id: string;
  name: string;
  description: string;
  category: string;
  image?: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'syllabus' | 'prelims' | 'mains' | 'optional' | 'test-series' | 'current-affairs' | 'coaching' | 'ebooks';
  tags: string[];
  year?: string;
  downloadUrl: string;
  previewUrl?: string;
}

export const sampleExams: Exam[] = [
  {
    id: 'upsc',
    name: 'UPSC',
    description: '',
    category: 'Central Government',
  },
  {
    id: 'mpsc-state-service',
    name: 'MPSC State Service (Rajyaseva)',
    description: '',
    category: 'Maharashtra State Services',
  },
  {
    id: 'mpsc-combined',
    name: 'MPSC Combined Exams',
    description: '',
    category: 'Maharashtra State Services',
  },
  {
    id: 'mpsc-engineering',
    name: 'MPSC Engineering Services Exam',
    description: '',
    category: 'Maharashtra State Services',
  },
  {
    id: 'mpsc-agriculture',
    name: 'MPSC Agriculture Services Exam',
    description: '',
    category: 'Maharashtra State Services',
  },
];

export const sampleResources: { [examId: string]: Resource[] } = {
  'upsc': [
    {
      id: 'upsc-general-syllabus',
      title: 'UPSC General Information & Syllabus',
      description: 'Complete information about various UPSC examinations and their syllabi.',
      type: 'syllabus',
      tags: ['UPSC', 'General', 'All Exams'],
      year: '2024',
      downloadUrl: '/sample-pdfs/upsc-general.pdf',
    },
    {
      id: 'upsc-cse-syllabus',
      title: 'UPSC CSE Complete Syllabus 2024',
      description: 'Comprehensive syllabus covering Prelims, Mains and Interview preparation.',
      type: 'syllabus',
      tags: ['CSE', 'Prelims', 'Mains', 'Interview'],
      downloadUrl: '/sample-pdfs/upsc-cse-syllabus.pdf',
    },
    {
      id: 'upsc-prelims-papers',
      title: 'UPSC Prelims Previous Year Papers',
      description: 'Collection of previous year question papers with detailed solutions.',
      type: 'prelims',
      tags: ['Previous Papers', 'Solutions', 'GS Paper 1', 'CSAT'],
      downloadUrl: '/sample-pdfs/upsc-prelims.pdf',
    },
    {
      id: 'upsc-mains-papers',
      title: 'UPSC Mains Previous Year Papers',
      description: 'Main examination papers with model answers and evaluation criteria.',
      type: 'mains',
      tags: ['Mains', 'Previous Papers', 'Model Answers'],
      downloadUrl: '/sample-pdfs/upsc-mains.pdf',
    },
  ],
  'mpsc-state-service': [
    {
      id: 'mpsc-state-syllabus',
      title: 'MPSC State Service Complete Syllabus',
      description: 'Detailed syllabus for MPSC State Service Examination (राज्यसेवा परीक्षा).',
      type: 'syllabus',
      tags: ['State Service', 'MPSC', 'राज्यसेवा'],
      downloadUrl: '/sample-pdfs/mpsc-state-syllabus.pdf',
    },
    {
      id: 'mpsc-state-prelims',
      title: 'MPSC State Service Prelims Papers',
      description: 'Previous year preliminary examination papers with solutions.',
      type: 'prelims',
      tags: ['Prelims', 'Previous Papers', 'Solutions'],
      downloadUrl: '/sample-pdfs/mpsc-state-prelims.pdf',
    },
    {
      id: 'mpsc-state-mains',
      title: 'MPSC State Service Mains Papers',
      description: 'Main examination papers and answer writing practice materials.',
      type: 'mains',
      tags: ['Mains', 'Answer Writing', 'Practice'],
      downloadUrl: '/sample-pdfs/mpsc-state-mains.pdf',
    },
  ],
  'mpsc-combined': [
    {
      id: 'mpsc-combined-syllabus',
      title: 'MPSC Combined Exams Syllabus',
      description: 'Comprehensive syllabus for various MPSC combined examinations.',
      type: 'syllabus',
      tags: ['Combined', 'MPSC', 'Multiple Exams'],
      downloadUrl: '/sample-pdfs/mpsc-combined-syllabus.pdf',
    },
    {
      id: 'mpsc-combined-papers',
      title: 'MPSC Combined Previous Papers',
      description: 'Collection of previous year papers for combined examinations.',
      type: 'prelims',
      tags: ['Combined', 'Previous Papers', 'Multiple Posts'],
      downloadUrl: '/sample-pdfs/mpsc-combined-papers.pdf',
    },
  ],
  'mpsc-engineering': [
    {
      id: 'mpsc-engg-syllabus',
      title: 'MPSC Engineering Services Syllabus',
      description: 'Detailed syllabus for MPSC Engineering Services Examination.',
      type: 'syllabus',
      tags: ['Engineering', 'Technical', 'MPSC'],
      downloadUrl: '/sample-pdfs/mpsc-engg-syllabus.pdf',
    },
    {
      id: 'mpsc-engg-papers',
      title: 'MPSC Engineering Previous Papers',
      description: 'Technical papers and solutions for engineering services exam.',
      type: 'prelims',
      tags: ['Engineering', 'Technical Papers', 'Solutions'],
      downloadUrl: '/sample-pdfs/mpsc-engg-papers.pdf',
    },
  ],
  'mpsc-agriculture': [
    {
      id: 'mpsc-agri-syllabus',
      title: 'MPSC Agriculture Services Syllabus',
      description: 'Complete syllabus for MPSC Agriculture Services Examination.',
      type: 'syllabus',
      tags: ['Agriculture', 'MPSC', 'Agricultural Officer'],
      downloadUrl: '/sample-pdfs/mpsc-agri-syllabus.pdf',
    },
    {
      id: 'mpsc-agri-papers',
      title: 'MPSC Agriculture Previous Papers',
      description: 'Previous year papers for agriculture services examination.',
      type: 'prelims',
      tags: ['Agriculture', 'Previous Papers', 'Farming'],
      downloadUrl: '/sample-pdfs/mpsc-agri-papers.pdf',
    },
  ],

};

export const inspirationalQuotes = [
  "Success in civil services is not about intelligence alone, but about perseverance, dedication, and the desire to serve the nation.",
  "Every small step towards your goal is a victory in itself. Keep moving forward with determination.",
  "The civil services is not just a career, it's a calling to make a difference in society.",
  "Preparation is the key to success. Start today, stay consistent, and achieve your dreams.",
];