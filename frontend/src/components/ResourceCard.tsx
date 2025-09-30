import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Eye, FileText } from 'lucide-react';
import type { Resource } from '@/data/sample-data';

interface ResourceCardProps {
  resource: Resource;
}

const ResourceCard = ({ resource }: ResourceCardProps) => {
  const handleDownload = () => {
    // In a real app, this would trigger an actual download
    console.log('Downloading:', resource.title);
  };

  const handlePreview = () => {
    // In a real app, this would open a preview modal or page
    console.log('Previewing:', resource.title);
  };

  const getTypeColor = (type: Resource['type']) => {
    const colorMap = {
      syllabus: 'bg-blue-100 text-blue-800',
      prelims: 'bg-green-100 text-green-800',
      mains: 'bg-purple-100 text-purple-800',
      optional: 'bg-orange-100 text-orange-800',
      'test-series': 'bg-red-100 text-red-800',
      'current-affairs': 'bg-yellow-100 text-yellow-800',
      coaching: 'bg-indigo-100 text-indigo-800',
      ebooks: 'bg-pink-100 text-pink-800',
    };
    return colorMap[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between">
          <FileText className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <Badge className={`text-xs ${getTypeColor(resource.type)}`}>
            {resource.type.replace('-', ' ').toUpperCase()}
          </Badge>
        </div>
        <CardTitle className="text-base font-heading leading-tight">
          {resource.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {resource.description}
        </p>
        
        <div className="flex flex-wrap gap-1">
          {resource.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        {resource.year && (
          <p className="text-xs text-text-light">
            Year: {resource.year}
          </p>
        )}
      </CardContent>
      
      <CardFooter className="flex gap-2">
        {resource.previewUrl && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePreview}
            className="flex items-center gap-1 flex-1"
          >
            <Eye className="h-4 w-4" />
            Preview
          </Button>
        )}
        <Button 
          variant="default" 
          size="sm" 
          onClick={handleDownload}
          className="flex items-center gap-1 flex-1"
        >
          <Download className="h-4 w-4" />
          Download
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ResourceCard;