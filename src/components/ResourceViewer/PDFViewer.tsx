import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PDFResource, HighlightAnnotation } from '../../constants/interfaces';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
// @ts-ignore
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.js?url';
pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
import HighlightLayer from './HighlightLayer';

interface PDFViewerProps {
    resource: PDFResource;
    // Optional callback passed from ResourceViewer:
    onPageRender?: (currentPage: number, totalPages: number) => void;
    onTextSelect?: (text: string, range: Range, pageNumber: number) => void;
}

/**
 * ObservedPage wraps react-pdf's Page and only registers IntersectionObserver
 * once the page is fully rendered. Then it unobserves on first intersection 
 * so it doesn't trigger repeatedly.
 */
interface ObservedPageProps {
  pageNumber: number;
  totalPages: number;
  onVisible?: (pageNumber: number, totalPages: number) => void;
  width: number;
  onTextSelect?: (text: string, range: Range, pageNumber: number) => void;
  highlights?: HighlightAnnotation[];
}

const ObservedPage: React.FC<ObservedPageProps> = ({
  pageNumber,
  totalPages,
  onVisible,
  width,
  onTextSelect,
  highlights = []
}) => {
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

  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !onTextSelect) {
      onTextSelect('', null as unknown as Range, pageNumber); // Clear selection
      return;
    }

    const range = selection.getRangeAt(0);
    onTextSelect(selection.toString(), range, pageNumber);
  }, [onTextSelect, pageNumber]);

  // Add event listener for text selection
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('mouseup', handleTextSelection);
    return () => {
      container.removeEventListener('mouseup', handleTextSelection);
    };
  }, [handleTextSelection]);

  return (
    <div ref={containerRef} style={{ marginBottom: '2rem' }} className="relative">
      <Page
        pageNumber={pageNumber}
        renderAnnotationLayer
        width={width}
        className="shadow-lg"
        onRenderSuccess={() => setIsRendered(true)}
      />
      <HighlightLayer 
        highlights={highlights} 
        pageNumber={pageNumber} 
      />
    </div>
  );
};

const PDFViewer: React.FC<PDFViewerProps> = ({ 
  resource, 
  onPageRender,
  onTextSelect 
}) => {
    const [numPages, setNumPages] = useState<number>(0);
    const [highestPageSeen, setHighestPageSeen] = useState(0);
    
    const handleHighlight = (annotation: HighlightAnnotation) => {
      // Here you would update the resource with the new annotation
      console.log('New highlight:', annotation);
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
                file={`file://${resource.filePath}`}
                onLoadSuccess={(pdf) => setNumPages(pdf.numPages)}
                onLoadError={console.error}
            >
                {Array.from(new Array(numPages), (_, index) => (
                    <ObservedPage
                      key={`page_${index + 1}`}
                      pageNumber={index + 1}
                      totalPages={numPages}
                      onVisible={handlePageVisible}
                      width={window.innerWidth - 64}
                      onTextSelect={onTextSelect}
                      highlights={resource.annotations?.filter(a => a.annotationType === 'highlight') as HighlightAnnotation[]}
                    />
                ))}
            </Document>
        </div>
    );
};

export default PDFViewer;