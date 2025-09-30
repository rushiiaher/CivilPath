import { Card, CardContent } from '@/components/ui/card';
import { FileText, BookOpen, Users, Download, GraduationCap, Calendar, MapPin } from 'lucide-react';

const UPSCCivilServices = () => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{color: '#1e3a8a'}}>
          UPSC Civil Services Examination
        </h1>

      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="flex items-center p-6">
            <GraduationCap className="w-8 h-8 text-blue-600 mr-4" />
            <div>
              <h3 className="font-bold text-lg">Education</h3>
              <p className="text-sm text-gray-600">Bachelor's Degree</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="flex items-center p-6">
            <Calendar className="w-8 h-8 text-green-600 mr-4" />
            <div>
              <h3 className="font-bold text-lg">Age Limit</h3>
              <p className="text-sm text-gray-600">21-32 years (General)</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="flex items-center p-6">
            <MapPin className="w-8 h-8 text-purple-600 mr-4" />
            <div>
              <h3 className="font-bold text-lg">Services</h3>
              <p className="text-sm text-gray-600">IAS, IPS, IFS & Others</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exam Pattern */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3" style={{color: '#1e3a8a'}}>
          Examination Pattern
        </h2>
        
        <div className="text-gray-700 leading-relaxed mb-8">
          <ul className="space-y-2">
            <li>• Preliminary Examination (Objective Type)</li>
            <li>• Main Examination (Descriptive Type)</li>
            <li>• Personality Test (Interview)</li>
            <li>• Services: IAS, IPS, IFS, IRS, and other Central Services</li>
            <li>• Total Duration: Approximately 1 year from Prelims to Final Result</li>
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4" style={{color: '#1e3a8a'}}>Preliminary Examination</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Paper I: General Studies (200 marks, 2 hours)</li>
              <li>• Paper II: CSAT (200 marks, 2 hours)</li>
              <li>• Paper II is qualifying (33% required)</li>
              <li>• Negative marking: 1/3 marks deducted</li>
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4" style={{color: '#1e3a8a'}}>Main Examination</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Paper A: Indian Language (300 marks) - Qualifying</li>
              <li>• Paper B: English (300 marks) - Qualifying</li>
              <li>• Paper I: Essay (250 marks)</li>
              <li>• Paper II-V: General Studies (250 marks each)</li>
              <li>• Paper VI-VII: Optional Subject (250 marks each)</li>
              <li>• Interview: 275 marks</li>
              <li>• Total Merit: 2025 marks</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Eligibility Criteria */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3" style={{color: '#1e3a8a'}}>
          Eligibility Criteria
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4" style={{color: '#1e3a8a'}}>Educational Qualification</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Bachelor's degree from recognized university</li>
              <li>• Final year students can apply</li>
              <li>• No specific stream requirement</li>
              <li>• Professional degrees eligible</li>
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4" style={{color: '#1e3a8a'}}>Nationality</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• IAS/IPS/IFS: Indian citizen only</li>
              <li>• Other services: Indian citizen or</li>
              <li>• Subject of Nepal/Bhutan or</li>
              <li>• Tibetan refugee or Person of Indian origin</li>
            </ul>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4" style={{color: '#1e3a8a'}}>Age Limits & Attempts</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-blue-800 text-white">
                  <th className="border border-gray-300 px-4 py-3 text-left">Category</th>
                  <th className="border border-gray-300 px-4 py-3 text-left">Min Age</th>
                  <th className="border border-gray-300 px-4 py-3 text-left">Max Age</th>
                  <th className="border border-gray-300 px-4 py-3 text-left">Attempts</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="border border-gray-300 px-4 py-3">General</td>
                  <td className="border border-gray-300 px-4 py-3">21 years</td>
                  <td className="border border-gray-300 px-4 py-3">32 years</td>
                  <td className="border border-gray-300 px-4 py-3">6</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3">OBC</td>
                  <td className="border border-gray-300 px-4 py-3">21 years</td>
                  <td className="border border-gray-300 px-4 py-3">35 years</td>
                  <td className="border border-gray-300 px-4 py-3">9</td>
                </tr>
                <tr className="bg-white">
                  <td className="border border-gray-300 px-4 py-3">SC/ST</td>
                  <td className="border border-gray-300 px-4 py-3">21 years</td>
                  <td className="border border-gray-300 px-4 py-3">37 years</td>
                  <td className="border border-gray-300 px-4 py-3">Unlimited</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3">PwD</td>
                  <td className="border border-gray-300 px-4 py-3">21 years</td>
                  <td className="border border-gray-300 px-4 py-3">42 years</td>
                  <td className="border border-gray-300 px-4 py-3">9</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Syllabus Section */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3" style={{color: '#1e3a8a'}}>
          Syllabus & Study Material
        </h2>

        <div className="space-y-4 mb-8">
          <Card className="hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="flex items-center p-4">
              <FileText className="w-12 h-12 bg-blue-500 rounded-lg p-2 text-white mr-4" />
              <div>
                <h4 className="font-bold text-lg">Preliminary Examination</h4>
                <p className="text-sm text-blue-600">General Studies and CSAT</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="flex items-center p-4">
              <BookOpen className="w-12 h-12 bg-green-500 rounded-lg p-2 text-white mr-4" />
              <div>
                <h4 className="font-bold text-lg">Main Examination</h4>
                <p className="text-sm text-green-600">9 Papers including Optional Subject</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="flex items-center p-4">
              <Users className="w-12 h-12 bg-purple-500 rounded-lg p-2 text-white mr-4" />
              <div>
                <h4 className="font-bold text-lg">Interview</h4>
                <p className="text-sm text-purple-600">Personality Test</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => window.open('/sample-pdfs/upsc-prelims-syllabus.pdf', '_blank')}
              className="bg-[#003060] hover:bg-[#002040] text-white px-6 py-3 rounded-xl font-semibold inline-flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Prelims Syllabus
            </button>
            <button 
              onClick={() => window.open('/sample-pdfs/upsc-mains-syllabus.pdf', '_blank')}
              className="bg-[#003060] hover:bg-[#002040] text-white px-6 py-3 rounded-xl font-semibold inline-flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Mains Syllabus
            </button>
            <button 
              onClick={() => window.open('/sample-pdfs/upsc-optional-syllabus.pdf', '_blank')}
              className="bg-[#003060] hover:bg-[#002040] text-white px-6 py-3 rounded-xl font-semibold inline-flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Optional Subjects
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UPSCCivilServices;
