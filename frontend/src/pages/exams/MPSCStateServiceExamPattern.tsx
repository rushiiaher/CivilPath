import mpscImage from '@/assets/mpsc.png';
import mpscMainImage from '@/assets/mpscmain.png';

const MPSCStateServiceExamPattern = () => {
  return (
    <div className="space-y-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-8" style={{color: '#1e3a8a'}}>
          MPSC State Service Examination Pattern
        </h2>
        
        <div className="text-gray-700 leading-relaxed">
          <ul className="space-y-2">
            <li>• Preliminary Examination (Objective Type)</li>
            <li>• Main Examination (Descriptive Type)</li>
            <li>• Personality Test (Interview)</li>
            <li>• Services: Group A and Group B Officer Posts</li>
            <li>• Posts: Deputy Collector, Deputy Superintendent of Police, Assistant Commissioner, etc.</li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-8" style={{color: '#1e3a8a'}}>
          MPSC State Service Preliminary Examination – 2025
        </h2>
        
        <div className="text-gray-700 leading-relaxed">
          <ul className="space-y-2">
            <li>• This examination is of objective type (Multiple Choice Questions).</li>
            <li>• Paper I: General Studies (200 marks, 2 hours)</li>
            <li>• Paper II: General Aptitude and Mental Ability (200 marks, 2 hours)</li>
            <li>• Both papers are qualifying in nature.</li>
            <li>• Negative marking: 1/4 marks deducted for each wrong answer.</li>
          </ul>
        </div>
      </div>
      
      <div className="text-center">
        <img 
          src={mpscImage} 
          alt="MPSC State Service Exam Pattern" 
          className="mx-auto w-full max-w-2xl h-auto rounded-lg shadow-lg"
        />
      </div>
      
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-8" style={{color: '#1e3a8a'}}>
          Main Examination Pattern
        </h2>
        
        <div className="text-gray-700 leading-relaxed">
          <p className="mb-4">The main examination consists of 6 papers.</p>
          <ul className="space-y-2">
            <li>• Paper I: General Studies (200 marks, 3 hours)</li>
            <li>• Paper II: General Studies (200 marks, 3 hours)</li>
            <li>• Paper III: General Studies (200 marks, 3 hours)</li>
            <li>• Paper IV: General Studies (200 marks, 3 hours)</li>
            <li>• Paper V: Optional Subject (200 marks, 3 hours)</li>
            <li>• Paper VI: Optional Subject (200 marks, 3 hours)</li>
            <li>• Interview/Personality Test: 200 marks</li>
            <li>• Total Marks for Merit: 1200 (Written) + 200 (Interview) = 1400</li>
          </ul>
        </div>
      </div>
      
      <div className="text-center">
        <img 
          src={mpscMainImage} 
          alt="MPSC State Service Main Exam Pattern" 
          className="mx-auto w-full max-w-2xl h-auto rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};

export default MPSCStateServiceExamPattern;

