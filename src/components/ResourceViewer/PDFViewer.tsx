import React, { useState } from 'react';
import { PDFResource } from '../../constants/interfaces';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
// Set worker path to your bundled or local copy
// @ts-ignore
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.js?url';
pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;


// No extra pdfjs-dist import needed
// pdfjs.GlobalWorkerOptions.workerSrc is already configured by react-pdf internally

interface PDFViewerProps {
    resource: PDFResource;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ resource }) => {
    const [numPages, setNumPages] = useState<number>(0);
    console.log(numPages);
    
    const pdfFileUrl = `file://${resource.filePath}`;
    console.log(pdfFileUrl)


    const onDocumentLoadSuccess = (pdf: any) => {
        setNumPages(pdf.numPages);
    };

    return (
        <div className="h-full p-4 overflow-auto">
            <Document
                file={pdfFileUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={console.error}
            >
                {Array.from(new Array(numPages), (_, index) => (
                    <div key={`page_${index + 1}`} className="mb-8">
                        <Page
                            pageNumber={index + 1}
                            renderAnnotationLayer
                            width={window.innerWidth - 64}
                            className="shadow-lg"
                        />
                        {index < numPages - 1 && (
                            <div className="border-b border-gray-300 my-4" />
                        )}
                    </div>
                ))}
            </Document>
        </div>
    );
};

export default PDFViewer;