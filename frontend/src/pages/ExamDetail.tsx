import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ResourceCard from '@/components/ResourceCard';
import ExamCardGrid from '@/components/ExamCardGrid';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ArrowLeft, BookOpen, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiService, Exam, Resource, ResourceCategory } from '@/services/api';
import MPSCCombinedExamPattern from './exams/MPSCCombinedExamPattern';
import MPSCCombinedExamSyllabus from './exams/MPSCCombinedExamSyllabus';
import MPSCCombinedEligibilityCriteria from './exams/MPSCCombinedEligibilityCriteria';
import UPSCExamPattern from './exams/UPSCExamPattern';
import UPSCExamSyllabus from './exams/UPSCExamSyllabus';
import UPSCEligibilityCriteria from './exams/UPSCEligibilityCriteria';
import MPSCStateServiceExamPattern from './exams/MPSCStateServiceExamPattern';
import MPSCStateServiceExamSyllabus from './exams/MPSCStateServiceExamSyllabus';
import MPSCStateServiceEligibilityCriteria from './exams/MPSCStateServiceEligibilityCriteria';
import MPSCEngineeringExamPattern from './exams/MPSCEngineeringExamPattern';
import MPSCEngineeringExamSyllabus from './exams/MPSCEngineeringExamSyllabus';
import MPSCEngineeringEligibilityCriteria from './exams/MPSCEngineeringEligibilityCriteria';
import MPSCAgricultureExamPattern from './exams/MPSCAgricultureExamPattern';
import MPSCAgricultureExamSyllabus from './exams/MPSCAgricultureExamSyllabus';
import MPSCAgricultureEligibilityCriteria from './exams/MPSCAgricultureEligibilityCriteria';

const ExamDetail = () => {
  const { examId } = useParams<{ examId: string }>();
  const [activeTab, setActiveTab] = useState('exam-pattern');
  const [exam, setExam] = useState<Exam | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<ResourceCategory[]>([]);
  const [examInfo, setExamInfo] = useState<any[]>([]);
  const [stages, setStages] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (examId) {
      loadExamData();
    }
  }, [examId]);
  
  const loadExamData = async () => {
    try {
      // First get all exams to find by slug
      const examsResponse = await apiService.getExams();
      const foundExam = examsResponse.records?.find(e => e.slug === examId);
      
      if (foundExam) {
        setExam(foundExam);
        
        // Load resources and new structure data
        const [resourcesResponse, examInfoResponse, stagesResponse, subjectsResponse] = await Promise.all([
          apiService.getResourcesByExam(foundExam.id),
          fetch(`/api/admin?type=exam-info&exam_id=${foundExam.id}`).then(r => r.json()),
          fetch(`/api/admin?type=stages&exam_id=${foundExam.id}`).then(r => r.json()),
          fetch(`/api/admin?type=subjects`).then(r => r.json())
        ]);
        
        setResources(resourcesResponse.records || []);
        setExamInfo(examInfoResponse.records || []);
        setStages(stagesResponse.records || []);
        setSubjects(subjectsResponse.records?.filter((s: any) => s.exam_id === foundExam.id) || []);
      }
    } catch (error) {
      console.error('Error loading exam data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-muted-foreground">Loading exam details...</p>
        </div>
      </div>
    );
  }
  
  if (!exam) {
    return <Navigate to="/" replace />;
  }

  const resourcesByCategory = resources.reduce((acc, resource) => {
    const categoryName = resource.category_name || 'Other';
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(resource);
    return acc;
  }, {} as Record<string, Resource[]>);

  const tabConfig = [
    { value: 'exam-pattern', label: 'Exam Pattern', count: 0, isExamInfo: true },
    { value: 'exam-syllabus', label: 'Exam Syllabus', count: 0, isExamInfo: true },
    { value: 'eligibility-criteria', label: 'Eligibility Criteria', count: 0, isExamInfo: true },
    ...stages.map(stage => ({
      value: stage.slug,
      label: stage.name,
      count: subjects.filter(s => s.stage_id === stage.id).length,
      isExamInfo: false,
      isStage: true
    }))
  ];



  // Sample exam cards data for all sections
  const getCardsForSection = (section: string) => {
    const examPrefix = examId?.toUpperCase() || 'EXAM';
    const examDates = {
      upsc: { prelims: '15/06/2025', mains: '15/09/2025', other: '15/06/2025' },
      'mpsc-state-service': { prelims: '20/05/2025', mains: '20/08/2025', other: '20/05/2025' },
      'mpsc-combined': { prelims: '25/04/2025', mains: '25/07/2025', other: '25/04/2025' },
      'mpsc-engineering': { prelims: '10/05/2025', mains: '10/08/2025', other: '10/05/2025' },
      'mpsc-agriculture': { prelims: '15/05/2025', mains: '15/08/2025', other: '15/05/2025' }
    };
    
    const currentExamDates = examDates[examId as keyof typeof examDates] || examDates.upsc;
    const getDate = (type: string) => {
      if (type === 'prelims') return currentExamDates.prelims;
      if (type === 'mains') return currentExamDates.mains;
      return currentExamDates.other;
    };

    const baseCards = {
      prelims: [
        { id: 'prelims-1', title: `${examPrefix} Prelims 2025 Paper`, description: 'Complete study material and previous year questions.', examDate: getDate('prelims'), pdfUrl: '/src/assets/Vision.pdf' },
        { id: 'prelims-2', title: `${examPrefix} Prelims 2024 Solutions`, description: 'Previous year question paper with detailed solutions.', examDate: getDate('prelims'), pdfUrl: '/src/assets/Vision.pdf' },
        { id: 'prelims-3', title: `${examPrefix} Current Affairs 2025`, description: 'Monthly compilation of current affairs.', examDate: getDate('prelims'), pdfUrl: '/src/assets/Vision.pdf' },
        { id: 'prelims-4', title: `${examPrefix} History Notes`, description: 'Comprehensive history notes covering ancient to modern.', examDate: getDate('prelims'), pdfUrl: '/src/assets/Vision.pdf' },
        { id: 'prelims-5', title: `${examPrefix} Geography Atlas`, description: 'Complete geography study material with maps.', examDate: getDate('prelims'), pdfUrl: '/src/assets/Vision.pdf' },
        { id: 'prelims-6', title: `${examPrefix} Polity Guide`, description: 'Constitution and government structure guide.', examDate: getDate('prelims'), pdfUrl: '/src/assets/Vision.pdf' }
      ],
      mains: [
        { id: 'mains-1', title: `${examPrefix} Mains 2025 Papers`, description: 'Complete mains examination papers and solutions.', examDate: getDate('mains'), pdfUrl: '/src/assets/Vision.pdf' },
        { id: 'mains-2', title: `${examPrefix} Essay Writing Guide`, description: 'Comprehensive essay writing techniques and samples.', examDate: getDate('mains'), pdfUrl: '/src/assets/Vision.pdf' },
        { id: 'mains-3', title: `${examPrefix} Answer Writing Practice`, description: 'Practice questions with model answers.', examDate: getDate('mains'), pdfUrl: '/src/assets/Vision.pdf' },
        { id: 'mains-4', title: `${examPrefix} Ethics Case Studies`, description: 'Ethics and integrity case studies with solutions.', examDate: getDate('mains'), pdfUrl: '/src/assets/Vision.pdf' },
        { id: 'mains-5', title: `${examPrefix} GS Paper 1 Notes`, description: 'History, geography, and culture study material.', examDate: getDate('mains'), pdfUrl: '/src/assets/Vision.pdf' },
        { id: 'mains-6', title: `${examPrefix} GS Paper 2 Guide`, description: 'Governance, constitution, and social justice.', examDate: getDate('mains'), pdfUrl: '/src/assets/Vision.pdf' }
      ],
      optional: [
        { id: 'optional-1', title: `${examPrefix} Public Administration`, description: 'Complete optional subject study material.', examDate: getDate('other'), pdfUrl: '/src/assets/Vision.pdf' },
        { id: 'optional-2', title: `${examPrefix} Geography Optional`, description: 'Physical and human geography for mains.', examDate: getDate('other'), pdfUrl: '/src/assets/Vision.pdf' },
        { id: 'optional-3', title: `${examPrefix} History Optional`, description: 'Ancient, medieval, and modern history optional.', examDate: getDate('other'), pdfUrl: '/src/assets/Vision.pdf' },
        { id: 'optional-4', title: `${examPrefix} Political Science`, description: 'Political theory and international relations.', examDate: getDate('other'), pdfUrl: '/src/assets/Vision.pdf' },
        { id: 'optional-5', title: `${examPrefix} Sociology Optional`, description: 'Society, social institutions, and change.', examDate: getDate('other'), pdfUrl: '/src/assets/Vision.pdf' },
        { id: 'optional-6', title: `${examPrefix} Psychology Optional`, description: 'General psychology and applied psychology.', examDate: getDate('other'), pdfUrl: '/src/assets/Vision.pdf' }
      ],
      'test-series': [
        { id: 'test-1', title: `${examPrefix} Mock Test Series 1`, description: 'Comprehensive mock tests for practice.', examDate: getDate('other'), pdfUrl: '/src/assets/Vision.pdf' },
        { id: 'test-2', title: `${examPrefix} Sectional Tests`, description: 'Subject-wise sectional test papers.', examDate: getDate('other'), pdfUrl: '/src/assets/Vision.pdf' },
        { id: 'test-3', title: `${examPrefix} Previous Year Tests`, description: 'Last 10 years question papers compilation.', examDate: getDate('other'), pdfUrl: '/src/assets/Vision.pdf' },
        { id: 'test-4', title: `${examPrefix} Speed Tests`, description: 'Time-bound practice tests for speed building.', examDate: getDate('other'), pdfUrl: '/src/assets/Vision.pdf' },
        { id: 'test-5', title: `${examPrefix} Full Length Tests`, description: 'Complete exam simulation tests.', examDate: getDate('other'), pdfUrl: '/src/assets/Vision.pdf' },
        { id: 'test-6', title: `${examPrefix} Revision Tests`, description: 'Quick revision and practice tests.', examDate: getDate('other'), pdfUrl: '/src/assets/Vision.pdf' }
      ],
      'current-affairs': [
        { id: 'ca-1', title: `${examPrefix} Monthly Current Affairs`, description: 'Comprehensive monthly current affairs compilation.', examDate: getDate('other'), pdfUrl: '/src/assets/Vision.pdf' },
        { id: 'ca-2', title: `${examPrefix} Weekly Updates`, description: 'Important weekly current affairs updates.', examDate: getDate('other'), pdfUrl: '/src/assets/Vision.pdf' },
        { id: 'ca-3', title: `${examPrefix} Yearly Compilation`, description: 'Complete year current affairs summary.', examDate: getDate('other'), pdfUrl: '/src/assets/Vision.pdf' },
        { id: 'ca-4', title: `${examPrefix} Economic Survey`, description: 'Economic survey highlights and analysis.', examDate: getDate('other'), pdfUrl: '/src/assets/Vision.pdf' },
        { id: 'ca-5', title: `${examPrefix} Budget Analysis`, description: 'Union budget analysis and key points.', examDate: getDate('other'), pdfUrl: '/src/assets/Vision.pdf' },
        { id: 'ca-6', title: `${examPrefix} International Affairs`, description: 'Global events and international relations.', examDate: getDate('other'), pdfUrl: '/src/assets/Vision.pdf' }
      ],
      coaching: [
        { id: 'coaching-1', title: `${examPrefix} Coaching Notes Set 1`, description: 'Premium coaching institute study material.', examDate: getDate('other'), pdfUrl: '/src/assets/Vision.pdf' },
        { id: 'coaching-2', title: `${examPrefix} Video Lectures Notes`, description: 'Comprehensive video lecture transcripts.', examDate: getDate('other'), pdfUrl: '/src/assets/Vision.pdf' },
        { id: 'coaching-3', title: `${examPrefix} Strategy Guide`, description: 'Expert strategy and preparation guidance.', examDate: getDate('other'), pdfUrl: '/src/assets/Vision.pdf' },
        { id: 'coaching-4', title: `${examPrefix} Topper Notes`, description: 'Study material from successful candidates.', examDate: getDate('other'), pdfUrl: '/src/assets/Vision.pdf' },
        { id: 'coaching-5', title: `${examPrefix} Faculty Notes`, description: 'Expert faculty compiled study material.', examDate: getDate('other'), pdfUrl: '/src/assets/Vision.pdf' },
        { id: 'coaching-6', title: `${examPrefix} Classroom Material`, description: 'Live classroom session materials.', examDate: getDate('other'), pdfUrl: '/src/assets/Vision.pdf' }
      ],
      ebooks: [
        { id: 'ebook-1', title: `${examPrefix} Complete Study Guide`, description: 'Comprehensive e-book for complete preparation.', examDate: getDate('other'), pdfUrl: '/src/assets/Vision.pdf' },
        { id: 'ebook-2', title: `${examPrefix} Subject-wise E-books`, description: 'Individual subject comprehensive e-books.', examDate: getDate('other'), pdfUrl: '/src/assets/Vision.pdf' },
        { id: 'ebook-3', title: `${examPrefix} Quick Revision Guide`, description: 'Last-minute revision e-book compilation.', examDate: getDate('other'), pdfUrl: '/src/assets/Vision.pdf' },
        { id: 'ebook-4', title: `${examPrefix} Formula Handbook`, description: 'Important formulas and facts handbook.', examDate: getDate('other'), pdfUrl: '/src/assets/Vision.pdf' },
        { id: 'ebook-5', title: `${examPrefix} Practice Questions`, description: 'Extensive practice questions e-book.', examDate: getDate('other'), pdfUrl: '/src/assets/Vision.pdf' },
        { id: 'ebook-6', title: `${examPrefix} Reference Material`, description: 'Additional reference and study material.', examDate: getDate('other'), pdfUrl: '/src/assets/Vision.pdf' }
      ]
    };
    return baseCards[section as keyof typeof baseCards] || [];
  };

  const getExamInfoContent = (subTab: string) => {
    const typeMap = {
      'exam-pattern': 'pattern',
      'exam-syllabus': 'syllabus', 
      'eligibility-criteria': 'eligibility'
    };
    
    const infoType = typeMap[subTab as keyof typeof typeMap];
    
    // Special handling for syllabus section
    if (subTab === 'exam-syllabus') {
      const syllabusResources = resources.filter(r => r.resource_type_name === 'Syllabus');
      const infoItems = examInfo.filter(item => item.section_type === infoType);
      
      return (
        <div className="space-y-6">
          {/* Exam name and description */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-blue-600 mb-2">{exam?.name} Syllabus</h3>
            <p className="text-gray-600">Comprehensive syllabus for {exam?.name} Examination</p>
          </div>
          
          {/* Stage-wise syllabus cards */}
          <div className="space-y-4">
            {stages.map((stage, index) => {
              const colors = [
                { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'bg-blue-500', text: 'text-blue-600' },
                { bg: 'bg-green-50', border: 'border-green-200', icon: 'bg-green-500', text: 'text-green-600' },
                { bg: 'bg-purple-50', border: 'border-purple-200', icon: 'bg-purple-500', text: 'text-purple-600' },
                { bg: 'bg-orange-50', border: 'border-orange-200', icon: 'bg-orange-500', text: 'text-orange-600' }
              ];
              const color = colors[index % colors.length];
              
              return (
                <div key={stage.id} className={`${color.bg} ${color.border} border rounded-lg p-6`}>
                  <div className="flex items-center gap-4">
                    <div className={`${color.icon} text-white p-3 rounded-lg`}>
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-semibold text-lg ${color.text}`}>{stage.name}</h4>
                      <p className="text-gray-600">{stage.description || `${stage.name} examination syllabus and pattern`}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Syllabus download buttons */}
          {syllabusResources.length > 0 && (
            <div className="mt-8">
              <div className="flex flex-wrap gap-4 justify-center">
                {syllabusResources.map((resource) => (
                  <Button 
                    key={resource.id}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2"
                    asChild
                  >
                    <a href={resource.file_path || resource.external_url} target="_blank" rel="noopener noreferrer">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {resource.title}
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {/* Text content from exam info */}
          {infoItems.map((item, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-semibold mb-3">{item.title}</h4>
              <div className="space-y-2 text-sm">
                <div dangerouslySetInnerHTML={{ __html: item.content.replace(/\n/g, '<br>') }} />
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    // Regular exam info content
    const infoItems = examInfo.filter(item => item.section_type === infoType);
    
    if (infoItems.length === 0) {
      return (
        <div className="space-y-4">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h4 className="font-semibold mb-3">Information</h4>
            <div className="space-y-2 text-sm">
              <p>Information will be updated soon.</p>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {infoItems.map((item, index) => (
          <div key={index} className="bg-gray-50 p-6 rounded-lg">
            <h4 className="font-semibold mb-3">{item.title}</h4>
            <div className="space-y-2 text-sm">
              <div dangerouslySetInnerHTML={{ __html: item.content.replace(/\n/g, '<br>') }} />
            </div>
          </div>
        ))}
      </div>
    );
  };

  const getTabContent = (tabValue: string) => {
    // Handle exam info sections
    if (['exam-pattern', 'exam-syllabus', 'eligibility-criteria'].includes(tabValue)) {
      return getExamInfoContent(tabValue);
    }

    // Find stage by slug and show its subjects
    const stage = stages.find(s => s.slug === tabValue);
    const stageSubjects = stage ? subjects.filter(s => s.stage_id === stage.id) : [];
    
    if (stageSubjects.length === 0) {
      return (
        <div className="text-center py-16">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">
            No subjects available
          </h3>
          <p className="text-muted-foreground">
            Subjects for this stage will be added soon. Check back later!
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stageSubjects.map((subject) => (
          <div key={subject.id} className="bg-white rounded-lg border shadow-sm p-6 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-lg mb-2">{subject.name}</h3>
            <p className="text-muted-foreground text-sm mb-4">{subject.description || 'Subject study material and resources'}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Stage: {stage?.name}</span>
              <Button size="sm" variant="outline">
                View Resources
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <div className="mb-1">
          <Button variant="ghost" asChild className="gap-2">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Exam Header */}
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100 rounded-xl p-8 mb-6 border border-blue-200 shadow-lg backdrop-blur-sm">
          <div className="space-y-4">
            <Badge variant="secondary" className="w-fit">
              {exam.category}
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold font-heading leading-tight underline decoration-blue-900 decoration-4 underline-offset-4">
              {exam.name}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
              {exam.description}
            </p>
          </div>
        </div>

        {/* Resource Tabs */}
        <div className="space-y-8">
          <div className="w-full">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 p-3 overflow-x-auto scrollbar-hide">
                {/* Exam Info Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className={`flex items-center gap-2 px-4 py-2.5 text-sm cursor-pointer rounded-lg transition-all duration-200 whitespace-nowrap font-medium ${
                      ['exam-pattern', 'exam-syllabus', 'eligibility-criteria'].includes(activeTab)
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-sm'
                    }`}>
                      <span>Exam Info</span>
                      <ChevronDown className="h-4 w-4" />

                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48">
                    <DropdownMenuItem 
                      onClick={() => setActiveTab('exam-pattern')}
                      className="cursor-pointer hover:bg-blue-50"
                    >
                      📋 Exam Pattern
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setActiveTab('exam-syllabus')}
                      className="cursor-pointer hover:bg-blue-50"
                    >
                      📚 Exam Syllabus
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setActiveTab('eligibility-criteria')}
                      className="cursor-pointer hover:bg-blue-50"
                    >
                      ✅ Eligibility Criteria
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {/* Regular Tabs */}
                {tabConfig.filter(tab => !tab.isExamInfo).map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${
                      activeTab === tab.value
                        ? 'bg-blue-600 text-white shadow-md transform scale-105'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-sm hover:scale-102'
                    }`}
                  >
                    <span>{tab.label}</span>

                  </button>
                ))}
              </div>
            </div>
            
            <div className="mt-6">

              {/* Content Area */}
              {activeTab === 'exam-pattern' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold font-heading mb-2 underline decoration-blue-600 decoration-2 underline-offset-4">Exam Pattern</h2>
                    <p className="text-muted-foreground">Complete examination pattern and structure</p>
                  </div>
                  {getTabContent('exam-pattern')}
                </div>
              )}
              
              {activeTab === 'exam-syllabus' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold font-heading mb-2 underline decoration-green-600 decoration-2 underline-offset-4">Exam Syllabus</h2>
                    <p className="text-muted-foreground">Detailed syllabus for all examination stages</p>
                  </div>
                  {getTabContent('exam-syllabus')}
                </div>
              )}
              
              {activeTab === 'eligibility-criteria' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold font-heading mb-2 underline decoration-purple-600 decoration-2 underline-offset-4">Eligibility Criteria</h2>
                    <p className="text-muted-foreground">Age limits, educational qualifications, and other requirements</p>
                  </div>
                  {getTabContent('eligibility-criteria')}
                </div>
              )}

              {/* Stage Tab Content */}
              {tabConfig.filter(tab => !tab.isExamInfo).map((tab) => (
                activeTab === tab.value && (
                  <div key={tab.value} className="space-y-6">
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold font-heading mb-2 underline decoration-blue-600 decoration-2 underline-offset-4">
                        {tab.label}
                      </h2>
                      <p className="text-muted-foreground">
                        {tab.count > 0 
                          ? `${tab.count} subject${tab.count !== 1 ? 's' : ''} available`
                          : 'No subjects available in this stage'
                        }
                      </p>
                    </div>
                    {getTabContent(tab.value)}
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamDetail;