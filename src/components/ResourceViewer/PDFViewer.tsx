import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
// Use the .mjs worker
import { PDFResource } from '../../constants/interfaces';

// pdfjs.GlobalWorkerOptions.workerSrc = './pdf.worker.js';

// Import from the same directory as your listing, e.g.:
// import workerSrc from 'react-pdf/dist/cjs/pdf.worker.entry.js'; 
// or possibly 'react-pdf/dist/esm/pdf.worker.entry.js'
// depending on whether you’re using the cjs or esm build

// pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;


interface PDFViewerProps {
  resource: PDFResource
}

const PDFViewer: React.FC<PDFViewerProps> = ({ resource }) => {
  console.log(resource);
  const filePath = `file://${resource.filePath}`
  const [numPages, setNumPages] = useState<number>(0);

  const onDocumentLoadSuccess = (pdf: any) => {
    setNumPages(pdf.numPages);
  };

  return (
    <div>
      <Document
        file={filePath}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={(err) => console.error('Failed to load PDF: ', err)}
      >
        {Array.from({ length: numPages }, (_, i) => (
          <Page key={i} pageNumber={i + 1} />
        ))}
      </Document>
    </div>
  );
};

export default PDFViewer;
