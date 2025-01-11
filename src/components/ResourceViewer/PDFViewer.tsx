import React from 'react';
import { PDFResource } from '../../constants/interfaces';

interface PDFViewerProps {
  resource: PDFResource;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ resource }) => {
  return (
    <div className="h-full p-4">
      {/* Add PDF viewer implementation */}
      <div className="text-slate-700">
        PDF Viewer for: {resource.title}
      </div>
    </div>
  );
};

export default PDFViewer; 