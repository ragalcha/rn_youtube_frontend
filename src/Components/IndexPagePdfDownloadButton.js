import React from 'react';

const IndexPagePdfDownloadButton = () => {
    const handleDownload = () => {
        const pdfPath = `/pdf/index_page.pdf`;
        const link = document.createElement('a');
        link.href = pdfPath;
        link.download = 'index_page.pdf';
        link.click();
    };

    return (
        <button onClick={handleDownload} className="btn btn-primary">
            Download Index Page PDF
        </button>
    );
};

export default IndexPagePdfDownloadButton;
