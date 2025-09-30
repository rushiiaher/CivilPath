const MPSCStateServiceEligibilityCriteria = () => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3" style={{color: '#1e3a8a'}}>
        <span class="text-yellow-500 text-sm">?</span> MPSC State Service Examination – Eligibility Criteria
      </h2>
      
      <div className="max-w-4xl mx-auto">
        <div className="text-gray-700 leading-relaxed space-y-6">
          <div>
            <h3 className="text-2xl font-bold mb-4" style={{color: '#1e3a8a'}}>Educational Qualification</h3>
            <ul className="space-y-2 mb-6 list-disc pl-6">
              <li>Minimum qualification: Bachelor's degree from a recognized university.</li>
              <li>Final year students can also apply (degree must be completed before Main Exam).</li>
              <li>No specific stream requirement, but relevant subjects preferred for certain posts.</li>
              <li>Professional degrees are also eligible.</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold mb-4" style={{color: '#1e3a8a'}}>Age Limits</h3>
            <ul className="space-y-2 mb-6 list-disc pl-6">
              <li>Minimum age: 19 years, Maximum age: 38 years (for General category).</li>
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
                  <td className="border border-gray-300 px-4 py-3">19 years</td>
                  <td className="border border-gray-300 px-4 py-3">38 years</td>
                  <td className="border border-gray-300 px-4 py-3">6</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3">OBC</td>
                  <td className="border border-gray-300 px-4 py-3">19 years</td>
                  <td className="border border-gray-300 px-4 py-3">41 years</td>
                  <td className="border border-gray-300 px-4 py-3">9</td>
                </tr>
                <tr className="bg-white">
                  <td className="border border-gray-300 px-4 py-3">SC/ST</td>
                  <td className="border border-gray-300 px-4 py-3">19 years</td>
                  <td className="border border-gray-300 px-4 py-3">43 years</td>
                  <td className="border border-gray-300 px-4 py-3">Unlimited</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3">PwD</td>
                  <td className="border border-gray-300 px-4 py-3">19 years</td>
                  <td className="border border-gray-300 px-4 py-3">48 years</td>
                  <td className="border border-gray-300 px-4 py-3">9</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="text-gray-700 leading-relaxed space-y-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3" style={{color: '#1e3a8a'}}>
              <span class="text-yellow-500 text-sm">?</span> Domicile Requirements:
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-4" style={{color: '#1e3a8a'}}>For Maharashtra State Service:</h3>
                <ul className="space-y-2 mb-6 list-disc pl-6">
                  <li>Must be a domicile of Maharashtra State.</li>
                  <li>Domicile certificate from competent authority required.</li>
                  <li>Should have studied Marathi up to 4th standard or passed Marathi language examination.</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold mb-4" style={{color: '#1e3a8a'}}>Language Requirements:</h3>
                <ul className="space-y-2 list-disc pl-6">
                  <li>Knowledge of Marathi language is mandatory.</li>
                  <li>Marathi language paper in Main Examination.</li>
                  <li>Interview may be conducted in Marathi/English.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MPSCStateServiceEligibilityCriteria;

