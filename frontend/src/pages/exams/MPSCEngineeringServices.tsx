import { Card, CardContent } from '@/components/ui/card';
import { FileText, BookOpen, Users, Download, GraduationCap, Calendar, MapPin } from 'lucide-react';

const MPSCEngineeringServices = () => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{color: '#1e3a8a'}}>
          MPSC Engineering Services Examination
        </h1>
        <p className="text-xl text-gray-600">
          Complete guide to MPSC Engineering Services - Pattern, Syllabus & Eligibility
        </p>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="flex items-center p-6">
            <GraduationCap className="w-8 h-8 text-blue-600 mr-4" />
            <div>
              <h3 className="font-bold text-lg">Education</h3>
              <p className="text-sm text-gray-600">Engineering Degree</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="flex items-center p-6">
            <Calendar className="w-8 h-8 text-green-600 mr-4" />
            <div>
              <h3 className="font-bold text-lg">Age Limit</h3>
              <p className="text-sm text-gray-600">18-38 years (General)</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="flex items-center p-6">
            <MapPin className="w-8 h-8 text-purple-600 mr-4" />
            <div>
              <h3 className="font-bold text-lg">Services</h3>
              <p className="text-sm text-gray-600">Assistant Engineer</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exam Pattern */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3" style={{color: '#1e3a8a'}}>
          <span class="text-yellow-500 text-sm">?</span> Examination Pattern
        </h2>
        
        <div className="text-gray-700 leading-relaxed mb-8">
          <ul className="space-y-2">
            <li>• Preliminary Examination (Objective Type)</li>
            <li>• Main Examination (Descriptive Type)</li>
            <li>• Personality Test (Interview)</li>
            <li>• Services: Assistant Engineer, Executive Engineer, Deputy Engineer</li>
            <li>• Branches: Civil, Mechanical, Electrical, Electronics & Telecommunication</li>
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4" style={{color: '#1e3a8a'}}>Preliminary Examination</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Paper I: General Studies and Engineering Aptitude (200 marks, 2 hours)</li>
              <li>• Paper II: Engineering Subject (300 marks, 2 hours)</li>
              <li>• Both papers are qualifying</li>
              <li>• Negative marking: 1/3 marks deducted</li>
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4" style={{color: '#1e3a8a'}}>Main Examination</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Paper I: General Studies (200 marks, 3 hours)</li>
              <li>• Paper II: General Engineering (200 marks, 3 hours)</li>
              <li>• Paper III: Engineering Subject - Part A (300 marks, 3 hours)</li>
              <li>• Paper IV: Engineering Subject - Part B (300 marks, 3 hours)</li>
              <li>• Interview: 200 marks</li>
              <li>• Total Merit: 1200 marks</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Eligibility Criteria */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3" style={{color: '#1e3a8a'}}>
          <span class="text-yellow-500 text-sm">?</span> Eligibility Criteria
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4" style={{color: '#1e3a8a'}}>Educational Qualification</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Bachelor's degree in Engineering from recognized university</li>
              <li>• AICTE approved engineering degree required</li>
              <li>• Final year students can apply</li>
              <li>• Branches: Civil, Mechanical, Electrical, E&TC</li>
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4" style={{color: '#1e3a8a'}}>Additional Requirements</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Must be domicile of Maharashtra State</li>
              <li>• Knowledge of Marathi language preferred</li>
              <li>• Valid engineering degree certificate required</li>
            </ul>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg mb-8">
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
                  <td className="border border-gray-300 px-4 py-3">18 years</td>
                  <td className="border border-gray-300 px-4 py-3">38 years</td>
                  <td className="border border-gray-300 px-4 py-3">6</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3">OBC</td>
                  <td className="border border-gray-300 px-4 py-3">18 years</td>
                  <td className="border border-gray-300 px-4 py-3">41 years</td>
                  <td className="border border-gray-300 px-4 py-3">9</td>
                </tr>
                <tr className="bg-white">
                  <td className="border border-gray-300 px-4 py-3">SC/ST</td>
                  <td className="border border-gray-300 px-4 py-3">18 years</td>
                  <td className="border border-gray-300 px-4 py-3">43 years</td>
                  <td className="border border-gray-300 px-4 py-3">Unlimited</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3">PwD</td>
                  <td className="border border-gray-300 px-4 py-3">18 years</td>
                  <td className="border border-gray-300 px-4 py-3">48 years</td>
                  <td className="border border-gray-300 px-4 py-3">9</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-4" style={{color: '#1e3a8a'}}>Engineering Branches</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ul className="space-y-2 text-gray-700">
              <li>• Civil Engineering - For PWD, Irrigation, Municipal Corporation posts</li>
              <li>• Mechanical Engineering - For Industries, PWD Mechanical posts</li>
            </ul>
            <ul className="space-y-2 text-gray-700">
              <li>• Electrical Engineering - For MSEB, PWD Electrical posts</li>
              <li>• Electronics & Telecommunication - For IT, Telecommunication posts</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Syllabus Section */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3" style={{color: '#1e3a8a'}}>
          <span class="text-yellow-500 text-sm">?</span> Syllabus & Study Material
        </h2>

        <div className="space-y-4 mb-8">
          <Card className="hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="flex items-center p-4">
              <FileText className="w-12 h-12 bg-blue-500 rounded-lg p-2 text-white mr-4" />
              <div>
                <h4 className="font-bold text-lg">Preliminary Examination</h4>
                <p className="text-sm text-blue-600">General Studies and Engineering Subject</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="flex items-center p-4">
              <BookOpen className="w-12 h-12 bg-green-500 rounded-lg p-2 text-white mr-4" />
              <div>
                <h4 className="font-bold text-lg">Main Examination</h4>
                <p className="text-sm text-green-600">4 Papers including Engineering Subjects</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="flex items-center p-4">
              <Users className="w-12 h-12 bg-purple-500 rounded-lg p-2 text-white mr-4" />
              <div>
                <h4 className="font-bold text-lg">Interview</h4>
                <p className="text-sm text-purple-600">Technical and Personality Test</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => window.open('/sample-pdfs/mpsc-engineering-prelims-syllabus.pdf', '_blank')}
              className="bg-[#003060] hover:bg-[#002040] text-white px-6 py-3 rounded-xl font-semibold inline-flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Prelims Syllabus
            </button>
            <button 
              onClick={() => window.open('/sample-pdfs/mpsc-engineering-mains-syllabus.pdf', '_blank')}
              className="bg-[#003060] hover:bg-[#002040] text-white px-6 py-3 rounded-xl font-semibold inline-flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Mains Syllabus
            </button>
            <button 
              onClick={() => window.open('/sample-pdfs/mpsc-engineering-subjects.pdf', '_blank')}
              className="bg-[#003060] hover:bg-[#002040] text-white px-6 py-3 rounded-xl font-semibold inline-flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Engineering Subjects
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MPSCEngineeringServices;

