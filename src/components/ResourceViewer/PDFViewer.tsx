import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PDFResource } from '../../constants/interfaces';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
// @ts-ignore
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.js?url';
pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

interface PDFViewerProps {
    resource: PDFResource;
    // Optional callback passed from ResourceViewer:
    onPageRender?: (currentPage: number, totalPages: number) => void;
}

/**
 * ObservedPage wraps react-pdf's Page and only registers IntersectionObserver
 * once the page is fully rendered. Then it unobserves on first intersection 
 * so it doesn't trigger repeatedly.
 */
const ObservedPage: React.FC<{
  pageNumber: number;
  totalPages: number;
  onVisible?: (pageNumber: number, totalPages: number) => void;
  width: number;
}> = ({ pageNumber, totalPages, onVisible, width }) => {
  const [isRendered, setIsRendered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach((entry) => {
        // Fire only when at least 50% of the page is visible
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          if (onVisible) {
            onVisible(pageNumber, totalPages);
          }
          // Unobserve so it only fires once for this page
          if (containerRef.current) {
            observer.unobserve(containerRef.current);
          }
        }
      });
    },
    [pageNumber, totalPages, onVisible]
  );

  // Only observe intersection *after* the page is fully rendered
  useEffect(() => {
    if (!isRendered) return; // skip if the page hasn't finished rendering

    const observer = new IntersectionObserver(handleIntersect, {
      threshold: [0.5],
    });
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [handleIntersect, isRendered]);

  // Called by <Page> once it finishes rendering
  const onPageRenderSuccess = () => {
    console.log("RENDER SUCCESS");
    setIsRendered(true);
  };

  return (
    <div ref={containerRef} style={{ marginBottom: '2rem' }}>
      <Page
        pageNumber={pageNumber}
        renderAnnotationLayer
        width={width}
        className="shadow-lg"
        onRenderSuccess={onPageRenderSuccess}
      />
    </div>
  );
};

const PDFViewer: React.FC<PDFViewerProps> = ({ resource, onPageRender }) => {
    const [numPages, setNumPages] = useState<number>(0);
    const [highestPageSeen, setHighestPageSeen] = useState(0);
    
    // could also do something like: const [viewportWidth, setViewportWidth] = useState<number>(window.innerWidth - 64);
    const pdfFileUrl = `file://${resource.filePath}`;

    const onDocumentLoadSuccess = (pdf: any) => {
        setNumPages(pdf.numPages);
    };

    // This function is triggered when a page is first "observed" in viewport
    const handlePageVisible = (pageNum: number, total: number) => {
        // Only update if this page is further along than what we've previously seen
        if (pageNum > highestPageSeen) {
          setHighestPageSeen(pageNum);
          if (onPageRender) {
            onPageRender(pageNum, total);
          }
        }
    };

    return (
        // Enforce a scrolling container so not all pages are shown at once
        <div className="p-4 overflow-auto" style={{ height: '80vh' }}>
            <Document
                file={pdfFileUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={console.error}
            >
                {Array.from(new Array(numPages), (_, index) => (
                    <ObservedPage
                      key={`page_${index + 1}`}
                      pageNumber={index + 1}
                      totalPages={numPages}
                      onVisible={handlePageVisible}
                      width={window.innerWidth - 64}
                    />
                ))}
            </Document>
        </div>
    );
};

export default PDFViewer;