import { Card, CardContent } from '@/components/ui/card';
import { FileText, BookOpen, Users, Download } from 'lucide-react';

const MPSCCombinedExamSyllabus = () => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-3" style={{color: '#1e3a8a'}}>
          <span class="text-yellow-500 text-sm">?</span> MPSC Combined Syllabus
        </h2>
        <p className="text-xl text-gray-600">
          Detailed syllabus for MPSC Combined examinations
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <div className="space-y-4 mb-12">
          <Card className="hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 h-20">
            <CardContent className="flex items-center p-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-[#000]">Preliminary Examination</h4>
                <p className="text-sm text-blue-600">General Studies and Mental Ability</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-green-50 to-green-100 border-green-200 h-20">
            <CardContent className="flex items-center p-4">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mr-4">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-[#000]">Main Examination</h4>
                <p className="text-sm text-green-600">Descriptive Type Papers</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200 h-20">
            <CardContent className="flex items-center p-4">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-[#000]">Interview</h4>
                <p className="text-sm text-purple-600">Personality Test</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => window.open('/sample-pdfs/mpsc-group-bc-prelims.pdf', '_blank')}
              className="bg-[#003060] hover:bg-[#002040] text-white px-6 py-3 rounded-xl font-semibold inline-flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Prelims Group B & C Syllabus
            </button>
            <button 
              onClick={() => window.open('/sample-pdfs/mpsc-group-b-mains.pdf', '_blank')}
              className="bg-[#003060] hover:bg-[#002040] text-white px-6 py-3 rounded-xl font-semibold inline-flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Group B Mains Syllabus
            </button>
            <button 
              onClick={() => window.open('/sample-pdfs/mpsc-group-c-mains.pdf', '_blank')}
              className="bg-[#003060] hover:bg-[#002040] text-white px-6 py-3 rounded-xl font-semibold inline-flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Group C Mains Syllabus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MPSCCombinedExamSyllabus;

