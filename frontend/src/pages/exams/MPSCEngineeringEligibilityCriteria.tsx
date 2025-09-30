const MPSCEngineeringEligibilityCriteria = () => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl md:text-3xl font-bold mb-8" style={{color: '#1e3a8a'}}>
        MPSC Engineering Services Examination – Eligibility Criteria
      </h2>
      
      <div className="max-w-4xl mx-auto">
        <div className="text-gray-700 leading-relaxed space-y-6">
          <div>
            <h3 className="text-2xl font-bold mb-4" style={{color: '#1e3a8a'}}>Educational Qualification</h3>
            <ul className="space-y-2 mb-6 list-disc pl-6">
              <li>Bachelor's degree in Engineering from a recognized university.</li>
              <li>Branches: Civil, Mechanical, Electrical, Electronics & Telecommunication.</li>
              <li>Final year students can also apply (degree must be completed before Main Exam).</li>
              <li>AICTE approved engineering degree required.</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold mb-4" style={{color: '#1e3a8a'}}>Age Limits</h3>
            <ul className="space-y-2 mb-6 list-disc pl-6">
              <li>Minimum age: 18 years, Maximum age: 38 years (for General category).</li>
              <li>Age relaxation available for reserved categories as per Maharashtra government rules.</li>
            </ul>
          </div>
        </div>
        
        <div className="text-center my-8">
          <div className="mx-auto w-full max-w-2xl rounded-lg shadow-lg bg-gray-50 p-6">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-blue-800 text-white">
                  <th className="border border-gray-300 px-4 py-3 text-left">Category</th>
                  <th className="border border-gray-300 px-4 py-3 text-left">Minimum Age</th>
                  <th className="border border-gray-300 px-4 py-3 text-left">Maximum Age</th>
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
        
        <div className="text-gray-700 leading-relaxed space-y-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-8" style={{color: '#1e3a8a'}}>
              Technical Requirements:
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-4" style={{color: '#1e3a8a'}}>Engineering Branches:</h3>
                <ul className="space-y-2 mb-6 list-disc pl-6">
                  <li>Civil Engineering - For PWD, Irrigation, Municipal Corporation posts</li>
                  <li>Mechanical Engineering - For Industries, PWD Mechanical posts</li>
                  <li>Electrical Engineering - For MSEB, PWD Electrical posts</li>
                  <li>Electronics & Telecommunication - For IT, Telecommunication posts</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold mb-4" style={{color: '#1e3a8a'}}>Additional Requirements:</h3>
                <ul className="space-y-2 list-disc pl-6">
                  <li>Must be domicile of Maharashtra State.</li>
                  <li>Knowledge of Marathi language preferred.</li>
                  <li>Valid engineering degree certificate required at the time of interview.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MPSCEngineeringEligibilityCriteria;

