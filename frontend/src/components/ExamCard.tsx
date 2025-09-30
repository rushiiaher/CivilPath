import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ExternalLink } from 'lucide-react';
import type { Exam } from '@/data/sample-data';

interface ExamCardProps {
  exam: Exam;
}

const ExamCard = ({ exam }: ExamCardProps) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between">
          <BookOpen className="h-6 w-6 text-primary flex-shrink-0" />
          <Badge variant="secondary" className="text-xs">
            {exam.category}
          </Badge>
        </div>
        <CardTitle className="text-lg font-heading leading-tight">
          {exam.name}
        </CardTitle>
      </CardHeader>
      

      
      <CardFooter>
        <Button 
          asChild 
          className="w-full group-hover:bg-primary-hover"
          variant="default"
        >
          <Link to={`/exams/${exam.id}`} className="flex items-center gap-2">
            Open Exam
            <ExternalLink className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ExamCard;