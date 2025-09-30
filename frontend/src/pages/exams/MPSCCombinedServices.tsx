import { Card, CardContent } from '@/components/ui/card';
import { FileText, BookOpen, Users, Download, GraduationCap, Calendar, MapPin } from 'lucide-react';

const MPSCCombinedServices = () => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{color: '#1e3a8a'}}>
          MPSC Combined Services Examination
        </h1>
        <p className="text-xl text-gray-600">
          Complete guide to MPSC Group B & Group C Services - Pattern, Syllabus & Eligibility
        </p>
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
              <p className="text-sm text-gray-600">18-38 years (General)</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="flex items-center p-6">
            <MapPin className="w-8 h-8 text-purple-600 mr-4" />
            <div>
              <h3 className="font-bold text-lg">Services</h3>
              <p className="text-sm text-gray-600">Group B & C Posts</p>
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
            <li>• Preliminary Examination</li>
            <li>• Main Examination</li>
            <li>• Physical Test & Interview</li>
            <li>• Group B Posts: Assistant Section Officer, State Tax Inspector, Police Sub Inspector, Deputy Inspector / Stamp Inspector</li>
            <li>• Group C Posts: Industry Inspector, Deputy Inspector Group-C, State Excise, Technical Assistant Group-C, Insurance Directorate, Tax Assistant Group-C, Clerk-Typist (Marathi), Clerk-Typist (English)</li>
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4" style={{color: '#1e3a8a'}}>Preliminary Examination</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Objective type examination</li>
              <li>• Common for all Group B and Group C posts</li>
              <li>• Duration: 1 hour</li>
              <li>• Total questions: 100 (100 marks)</li>
              <li>• Negative marking: 1/4 marks deducted</li>
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4" style={{color: '#1e3a8a'}}>Main Examination</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Paper 1: 100 questions (200 marks, 1 hour)</li>
              <li>• Paper 2: 100 questions (200 marks, 1 hour)</li>
              <li>• Negative marking: 1/4 marks deducted</li>
              <li>• Total marks: 400</li>
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
              <li>• Bachelor's degree from recognized university</li>
              <li>• Special requirements for specific posts:</li>
              <li>• Clerk-Typist: Typing certificate required</li>
              <li>• Marathi Typing: Minimum 30 w.p.m.</li>
              <li>• English Typing: Minimum 40 w.p.m.</li>
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4" style={{color: '#1e3a8a'}}>Physical Requirements (PSI/ESI)</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Male: Height 165 cm, Chest 86 cm (5 cm expansion)</li>
              <li>• Female: Height 155 cm</li>
              <li>• Age for PSI: 19-28 years (General)</li>
              <li>• Relaxation up to 31 years for backward classes</li>
            </ul>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4" style={{color: '#1e3a8a'}}>Age Limits</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-blue-800 text-white">
                  <th className="border border-gray-300 px-4 py-3 text-left">Category</th>
                  <th className="border border-gray-300 px-4 py-3 text-left">Min Age</th>
                  <th className="border border-gray-300 px-4 py-3 text-left">Max Age</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="border border-gray-300 px-4 py-3">General Category</td>
                  <td className="border border-gray-300 px-4 py-3">18 years</td>
                  <td className="border border-gray-300 px-4 py-3">38 years</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3">Backward Classes (OBC/SC/ST)</td>
                  <td className="border border-gray-300 px-4 py-3">18 years</td>
                  <td className="border border-gray-300 px-4 py-3">43 years</td>
                </tr>
                <tr className="bg-white">
                  <td className="border border-gray-300 px-4 py-3">Ex-Servicemen</td>
                  <td className="border border-gray-300 px-4 py-3">18 years</td>
                  <td className="border border-gray-300 px-4 py-3">43-45 years (as per rules)</td>
                </tr>
              </tbody>
            </table>
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
                <p className="text-sm text-blue-600">General Studies and Mental Ability</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="flex items-center p-4">
              <BookOpen className="w-12 h-12 bg-green-500 rounded-lg p-2 text-white mr-4" />
              <div>
                <h4 className="font-bold text-lg">Main Examination</h4>
                <p className="text-sm text-green-600">Descriptive Type Papers</p>
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

export default MPSCCombinedServices;

