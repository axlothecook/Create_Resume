import { useRef } from 'react';
import jsPDF from 'jspdf';
import MyDocument from './Testing';
import App from './App';

function Practice() {
  const reportTemplateRef = useRef(null);

  const handleGeneratePdf = () => {
    const doc = new jsPDF({
      format: 'a4',
      unit: 'px',
    });

    // Adding the fonts.
    doc.setFont('Inter-Regular', 'normal');

    doc.html(reportTemplateRef.current, {
      async callback(doc) {
        await doc.save('document');
      },
    });
  };

  return (
    <div>
      <button className="button" onClick={handleGeneratePdf}>
        Generate PDF
      </button>
      <div ref={reportTemplateRef}>
        <App />
      </div>
    </div>
  );
}

export default Practice;