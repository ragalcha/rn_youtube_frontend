import React from 'react';

const RaniPdfDownloadButton = () => {
    const handleDownload = () => {
        const pdfPath = `/pdf/rani_final_minnor_project_report.pdf`;
        const link = document.createElement('a');
        link.href = pdfPath;
        link.download = 'rani_final_minnor_project_report.pdf';
        link.click();
    };

    return (
        <button onClick={handleDownload} className="btn btn-primary">
            Download Rani PDF
        </button>
    );
};

export default RaniPdfDownloadButton;
