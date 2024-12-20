import React from 'react';

const PdfDownloadButton = () => {
    const handleDownload = () => {
        const pdfPath = `/pdf/new_final_report_ramaiya_rahul.pdf`;
        const link = document.createElement('a');
        link.href = pdfPath;
        link.download = 'new_final_report_ramaiya_rahul.pdf';
        link.click();
    };

    return (
        <button onClick={handleDownload} className="btn btn-primary">
            Download Ramaiya PDF
        </button>
    );
};

export default PdfDownloadButton;
