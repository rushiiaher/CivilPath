const UPSCEligibilityCriteria = () => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl md:text-3xl font-bold mb-8" style={{color: '#1e3a8a'}}>
        UPSC Civil Services Examination – Eligibility Criteria
      </h2>
      
      <div className="max-w-4xl mx-auto">
        <div className="text-gray-700 leading-relaxed space-y-6">
          <div>
            <h3 className="text-2xl font-bold mb-4" style={{color: '#1e3a8a'}}>Educational Qualification</h3>
            <ul className="space-y-2 mb-6 list-disc pl-6">
              <li>Minimum qualification: Bachelor's degree from a recognized university.</li>
              <li>Final year students can also apply (degree must be completed before Main Exam).</li>
              <li>No specific stream or percentage requirement.</li>
              <li>Professional degrees like MBBS, Engineering, CA, etc. are also eligible.</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold mb-4" style={{color: '#1e3a8a'}}>Age Limits</h3>
            <ul className="space-y-2 mb-6 list-disc pl-6">
              <li>Minimum age: 21 years, Maximum age: 32 years (for General category).</li>
              <li>Age relaxation available for reserved categories and special cases.</li>
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
        
        <div className="text-gray-700 leading-relaxed space-y-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-8" style={{color: '#1e3a8a'}}>
              Nationality Requirements:
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-4" style={{color: '#1e3a8a'}}>For IAS, IPS, IFS:</h3>
                <ul className="space-y-2 mb-6 list-disc pl-6">
                  <li>Must be a citizen of India.</li>
                  <li>No other nationality requirements.</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold mb-4" style={{color: '#1e3a8a'}}>For Other Services:</h3>
                <ul className="space-y-2 list-disc pl-6">
                  <li>Citizen of India, or</li>
                  <li>Subject of Nepal, or</li>
                  <li>Subject of Bhutan, or</li>
                  <li>Tibetan refugee (came before 1st Jan 1962), or</li>
                  <li>Person of Indian origin from Pakistan, Burma, Sri Lanka, Kenya, Uganda, Tanzania, Zambia, Malawi, Zaire, Ethiopia, Vietnam (with intention to permanently settle in India)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UPSCEligibilityCriteria;
