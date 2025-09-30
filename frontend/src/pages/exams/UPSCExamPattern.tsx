import preImage from '../../assets/pre.png';
import mainsImage from '../../assets/mains.png';

const UPSCExamPattern = () => {
  return (
    <div className="space-y-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-8" style={{color: '#1e3a8a'}}>
          UPSC Civil Services Examination Pattern
        </h2>
        
        <div className="text-gray-700 leading-relaxed">
          <ul className="space-y-2">
            <li>• Preliminary Examination (Objective Type)</li>
            <li>• Main Examination (Descriptive Type)</li>
            <li>• Personality Test (Interview)</li>
            <li>• Services: IAS, IPS, IFS, IRS, and other Central Services</li>
            <li>• Total Duration: Approximately 1 year from Prelims to Final Result</li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-8" style={{color: '#1e3a8a'}}>
          UPSC Preliminary Examination – 2025
        </h2>
        
        <div className="text-gray-700 leading-relaxed">
          <ul className="space-y-2">
            <li>• This examination is of objective type (Multiple Choice Questions).</li>
            <li>• Paper I: General Studies (200 marks, 2 hours)</li>
            <li>• Paper II: CSAT - Civil Services Aptitude Test (200 marks, 2 hours)</li>
            <li>• Paper II is qualifying in nature with minimum 33% marks required.</li>
            <li>• Negative marking: 1/3 marks deducted for each wrong answer.</li>
          </ul>
        </div>
      </div>
      
      <div className="text-center">
        <img 
          src={preImage} 
          alt="UPSC Preliminary Exam Pattern" 
          className="mx-auto w-full max-w-2xl h-auto rounded-lg shadow-lg"
        />
      </div>
      
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-8" style={{color: '#1e3a8a'}}>
          Main Examination Pattern
        </h2>
        
        <div className="text-gray-700 leading-relaxed">
          <p className="mb-4">The main examination consists of 9 papers.</p>
          <ul className="space-y-2">
            <li>• Paper A: Indian Language (300 marks, 3 hours) - Qualifying</li>
            <li>• Paper B: English (300 marks, 3 hours) - Qualifying</li>
            <li>• Paper I: Essay (250 marks, 3 hours)</li>
            <li>• Paper II-V: General Studies (250 marks each, 3 hours each)</li>
            <li>• Paper VI-VII: Optional Subject (250 marks each, 3 hours each)</li>
            <li>• Interview/Personality Test: 275 marks</li>
            <li>• Total Marks for Merit: 1750 (Written) + 275 (Interview) = 2025</li>
          </ul>
        </div>
      </div>
      
      <div className="text-center">
        <img 
          src={mainsImage} 
          alt="UPSC Main Exam Pattern" 
          className="mx-auto w-full max-w-2xl h-auto rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};

export default UPSCExamPattern;
