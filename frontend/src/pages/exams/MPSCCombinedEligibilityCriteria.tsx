const MPSCCombinedEligibilityCriteria = () => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3" style={{color: '#1e3a8a'}}>
        <span class="text-yellow-500 text-sm">?</span> Group B & Group C Examination – Eligibility Criteria
      </h2>
      
      <div className="max-w-4xl mx-auto">
        <div className="text-gray-700 leading-relaxed space-y-6">
          <div>
            <h3 className="text-2xl font-bold mb-4" style={{color: '#1e3a8a'}}>Educational Qualification</h3>
            <ul className="space-y-2 mb-6 list-disc pl-6">
              <li>Minimum qualification for all posts: Bachelor's degree (Graduation) from a Government of India recognized university is required.</li>
              <li>Special requirements for specific posts:<br/>
                Clerk-Typist / Tax Assistant – Marathi and English typing certificate is required.<br/>
                Marathi Typing: Minimum 30 w.p.m.<br/>
                English Typing: Minimum 40 w.p.m.
              </li>
              <li>PSI & Excise Sub Inspector – Physical eligibility criteria apply (given below).</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold mb-4" style={{color: '#1e3a8a'}}>Age Limits</h3>
            <ul className="space-y-2 mb-6 list-disc pl-6">
              <li>For PSI – Minimum age: 19 years, Maximum age: 28 years (General category); Relaxation up to 31 years for backward classes.</li>
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
        
        <div className="text-gray-700 leading-relaxed space-y-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3" style={{color: '#1e3a8a'}}>
              <span class="text-yellow-500 text-sm">?</span> Physical Eligibility (Applicable only for PSI / ESI):
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-4" style={{color: '#1e3a8a'}}>For Male Candidates:</h3>
                <ul className="space-y-2 mb-6 list-disc pl-6">
                  <li>Height: Minimum 165 cm.</li>
                  <li>Chest: Expanded 86 cm. (Minimum 5 cm. expansion)</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold mb-4" style={{color: '#1e3a8a'}}>For Female Candidates:</h3>
                <ul className="space-y-2 list-disc pl-6">
                  <li>Height: Minimum 155 cm</li>
                  <li>Chest: Not applicable</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MPSCCombinedEligibilityCriteria;

