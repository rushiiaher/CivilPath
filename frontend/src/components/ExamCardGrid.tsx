import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Download, Search } from 'lucide-react';

interface ExamCardData {
  id: string;
  title: string;
  description: string;
  examDate: string;
  pdfUrl: string;
}

interface ExamCardGridProps {
  cards: ExamCardData[];
}

const ExamCardGrid = ({ cards }: ExamCardGridProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredCards = cards.filter(card => 
    card.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = (pdfUrl: string, title: string) => {
    // First open PDF in new tab for viewing
    window.open(pdfUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search exams..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
      {filteredCards.map((card) => (
        <Card key={card.id} className="bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold text-gray-900 leading-tight">
              {card.title}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 sm:truncate">
              {card.description}
            </p>
            
            {(card.id.includes('prelims') || card.id.includes('mains')) && (
              <p className="text-xs font-medium text-red-600">
                EXAM DATE: {card.examDate}
              </p>
            )}
            
            <Button 
              onClick={() => handleDownload(card.pdfUrl, card.title)}
              className="w-auto px-3 sm:w-full lg:w-auto lg:px-6 bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded text-xs sm:text-sm"
            >
              <Download className="h-4 w-4 mr-2" />
              DOWNLOAD 
            </Button>
          </CardContent>
        </Card>
      ))}
      </div>
    </div>
  );
};

export default ExamCardGrid;