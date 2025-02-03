function downloadLicensedMembersAsPDF() {
    // Show loading message with improved styling
    const loadingMessage = document.createElement('div');
    loadingMessage.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
            <div class="spinner"></div>
            <span>Generating PDF, please wait...</span>
        </div>
    `;
    loadingMessage.style.position = "fixed";
    loadingMessage.style.top = "50%";
    loadingMessage.style.left = "50%";
    loadingMessage.style.transform = "translate(-50%, -50%)";
    loadingMessage.style.backgroundColor = "white";
    loadingMessage.style.padding = "30px";
    loadingMessage.style.borderRadius = "8px";
    loadingMessage.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
    loadingMessage.style.zIndex = "1000";
    document.body.appendChild(loadingMessage);

    // Add spinner style
    const style = document.createElement('style');
    style.textContent = `
        .spinner {
            border: 3px solid #f3f3f3;
            border-radius: 50%;
            border-top: 3px solid #3498db;
            width: 30px;
            height: 30px;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    // Function to generate PDF without logo
    function generatePDFWithoutLogo(data) {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'pt',
            format: 'a4',
            putOnlyUsedFonts: true
        });
        
        const pageWidth = pdf.internal.pageSize.width;

        // Add title with styling
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(14);
        pdf.text("LIST OF LICENSED LEGAL PRACTITIONERS FOR 2024-2025 PRACTICE YEAR", pageWidth/2, 60, { align: "center" });

        // Table configuration
        const columns = [
            {header: 'NO.', dataKey: 'no'},
            {header: 'NAME', dataKey: 'name'},
            {header: 'INSTITUTION/CONTACTS', dataKey: 'contacts'},
            {header: 'ADMISSION YEAR', dataKey: 'admissionYear'},
            {header: 'QUALIFICATION', dataKey: 'qualification'},
            {header: 'DATE RENEWED', dataKey: 'dateRenewed'}
        ];

        // Add row numbers to the data
        const rows = data.map((row, index) => ({
            no: index + 1,
            name: row.user.firstName + ' ' + (row.user.otherName ? row.user.otherName + ' ' : '') + row.user.lastName,
            contacts: row.firm ? `${row.firm.name}, ${row.firm.postalAddress}` : (row.postalAddress || ''),
            admissionYear: row.dateOfAdmissionToPractice ? new Date(row.dateOfAdmissionToPractice).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }).replace(/(\d+)/, function(match) {
                const day = parseInt(match);
                const suffix = ['th', 'st', 'nd', 'rd'][(day % 10 > 3 || day > 20) ? 0 : day % 10];
                return day + suffix;
            }) : '',
            qualification: 'LLB (Hons)',
            dateRenewed: ''
        }));

        // Add table with styling
        pdf.autoTable({
            columns: columns,
            body: rows,
            startY: 80,
            margin: { top: 20, right: 20, bottom: 40, left: 20 },
            headStyles: {
                fillColor: [255, 255, 255],
                textColor: 0,
                fontSize: 10,
                fontStyle: 'bold',
                halign: 'left',
                cellPadding: 5
            },
            bodyStyles: {
                fontSize: 10,
                halign: 'left',
                textColor: 0,
                cellPadding: 5
            },
            theme: 'grid',
            styles: {
                lineWidth: 0.5,
                lineColor: [0, 0, 0]
            },
            columnStyles: {
                no: { cellWidth: 30 },
                name: { cellWidth: 'auto' },
                contacts: { cellWidth: 'auto' },
                admissionYear: { cellWidth: 'auto' },
                qualification: { cellWidth: 'auto' },
                dateRenewed: { cellWidth: 'auto' }
            }
        });

        pdf.save('licensed_legal_practitioners.pdf');
        document.body.removeChild(loadingMessage);
        document.head.removeChild(style);
    }

    $.ajax({
        url: `${host}/api/Members/getLicensedMembers?pageNumber=1&pageSize=100000`,
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + tokenValue
        },
        success: function(data) {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: 'p',
                unit: 'pt',
                format: 'a4',
                putOnlyUsedFonts: true
            });
            
            // Try to load the image
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.onload = function() {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                const logoData = canvas.toDataURL('image/png');

                // Add logo centered at the top
                const pageWidth = pdf.internal.pageSize.width;
                pdf.addImage(logoData, 'PNG', (pageWidth - 100) / 2, 20, 100, 100);

                // Add title with styling
                pdf.setFont("helvetica", "bold");
                pdf.setFontSize(12);
                pdf.text(`LIST OF LICENSED LEGAL PRACTITIONERS FOR ${yearOfPractice} PRACTICE YEAR`, pageWidth/2, 140, { align: "center" });

                // Table configuration
                const columns = [
                    {header: 'NO.', dataKey: 'no'},
                    {header: 'NAME', dataKey: 'name'},
                    {header: 'INSTITUTION/CONTACTS', dataKey: 'contacts'},
                    {header: 'ADMISSION YEAR', dataKey: 'admissionYear'},
                    {header: 'QUALIFICATION', dataKey: 'qualification'},
                    {header: 'DATE RENEWED', dataKey: 'dateRenewed'}
                ];

                // Add row numbers to the data
                const rows = data.map((row, index) => ({
                    no: index + 1,
                    name: row.user.firstName + ' ' + (row.user.otherName ? row.user.otherName + ' ' : '') + row.user.lastName,
                    contacts: row.firm ? `${row.firm.name}, ${row.firm.postalAddress}` : (row.postalAddress || ''),
                    admissionYear: row.dateOfAdmissionToPractice ? new Date(row.dateOfAdmissionToPractice).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    }).replace(/(\d+)/, function(match) {
                        const day = parseInt(match);
                        const suffix = ['th', 'st', 'nd', 'rd'][(day % 10 > 3 || day > 20) ? 0 : day % 10];
                        return day + suffix;
                    }) : '',
                    qualification: 'LLB (Hons)',
                    dateRenewed: ''
                }));

                // Add table with styling
                pdf.autoTable({
                    columns: columns,
                    body: rows,
                    startY: 160,
                    margin: { top: 20, right: 20, bottom: 40, left: 20 },
                    headStyles: {
                        fillColor: [255, 255, 255],
                        textColor: 0,
                        fontSize: 10,
                        fontStyle: 'bold',
                        halign: 'left',
                        cellPadding: 5
                    },
                    bodyStyles: {
                        fontSize: 10,
                        halign: 'left',
                        textColor: 0,
                        cellPadding: 5
                    },
                    theme: 'grid',
                    styles: {
                        lineWidth: 0.5,
                        lineColor: [0, 0, 0]
                    },
                    columnStyles: {
                        no: { cellWidth: 30 },
                        name: { cellWidth: 'auto' },
                        contacts: { cellWidth: 'auto' },
                        admissionYear: { cellWidth: 'auto' },
                        qualification: { cellWidth: 'auto' },
                        dateRenewed: { cellWidth: 'auto' }
                    }
                });

                pdf.save('licensed_legal_practitioners.pdf');
                document.body.removeChild(loadingMessage);
                document.head.removeChild(style);
            };

            // Handle image loading error
            img.onerror = function() {
                console.error("Error loading logo image");
                generatePDFWithoutLogo(data);
            };
            img.src = '/assets/images/logos/cropped-mls-logo-clear-192x192.png';
        },
        error: function(err) {
            console.error("Error fetching data:", err);
            document.body.removeChild(loadingMessage);
            document.head.removeChild(style);
            alert("Error generating PDF. Please try again.");
        }
    });
}

function downloadAttendedMembersAsPDF(cpdTrainingId) {
    // Show loading message with improved styling
    const loadingMessage = document.createElement('div');
    loadingMessage.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
            <div class="spinner"></div>
            <span>Generating PDF for attended members, please wait...</span>
        </div>
    `;
    loadingMessage.style.position = "fixed";
    loadingMessage.style.top = "50%";
    loadingMessage.style.left = "50%";
    loadingMessage.style.transform = "translate(-50%, -50%)";
    loadingMessage.style.backgroundColor = "white";
    loadingMessage.style.padding = "30px";
    loadingMessage.style.borderRadius = "8px";
    loadingMessage.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
    loadingMessage.style.zIndex = "1000";
    document.body.appendChild(loadingMessage);

    // Function to generate PDF without logo
    function generatePDFWithoutLogo(data) {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'pt',
            format: 'a4',
            putOnlyUsedFonts: true
        });

        const pageWidth = pdf.internal.pageSize.width;

        // Add title with styling
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(24);
        pdf.text("Attended Members for CPD Training", pageWidth/2, 180, { align: "center" });

        // Add date with styling
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(12);
        pdf.text("Generated on: " + new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }), pageWidth/2, 60, { align: "center" });

        // Add training details
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(12);
        pdf.text("Training Details:", 40, 220);
        pdf.setFont("helvetica", "normal");
        pdf.text("Title: " + trainingDetails.title, 40, 240);
        pdf.text("Venue: " + trainingDetails.venue, 40, 260);
        pdf.text("Date: " + trainingDetails.date, 40, 280);
        pdf.text("Duration: " + trainingDetails.duration + " Hours", 40, 300);

        // Filter attended members
        const attendedMembers = data.filter(member => member.registrationStatus === "Attended");

        // Table configuration
        const columns = [
            { header: 'First Name', dataKey: 'firstName' },
            { header: 'Surname', dataKey: 'lastName' },
            { header: 'Gender', dataKey: 'gender' },
            { header: 'Email', dataKey: 'email' },
            { header: 'Contact', dataKey: 'contact' }
        ];

        const rows = attendedMembers.map(row => ({
            firstName: row.member.user.firstName,
            lastName: row.member.user.lastName,
            gender: row.member.user.gender,
            email: row.member.user.email,
            contact: row.member.user.phoneNumber
        }));

        // Add table with styling
        pdf.autoTable({
            columns: columns,
            body: rows,
            startY: 320,
            margin: { top: 20, right: 40, bottom: 40, left: 40 },
            headStyles: {
                fillColor: [41, 128, 185],
                textColor: 255,
                fontSize: 12,
                halign: 'center',
                fontStyle: 'bold'
            },
            bodyStyles: {
                fontSize: 11,
                halign: 'left',
                textColor: 50
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245]
            },
            tableWidth: 'auto',
            columnStyles: {
                email: { cellWidth: 'auto' },
                contact: { cellWidth: 'auto' }
            },
            didDrawPage: function(data) {
                pdf.setFontSize(10);
                pdf.setTextColor(150);
                pdf.text(
                    'Page ' + data.pageNumber,
                    data.settings.margin.left,
                    pdf.internal.pageSize.height - 10
                );
            }
        });

        pdf.save('attended_members.pdf');
        document.body.removeChild(loadingMessage);
    }

    $.ajax({
        url: `${host}/api/cpdtrainingregistrations/paged?cpdtrainingId=${cpdTrainingId}&pageNumbe=1&pageSize=10000`,
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + tokenValue
        },
        success: function(data) {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: 'p',
                unit: 'pt',
                format: 'a4',
                putOnlyUsedFonts: true
            });
            
            // Try to load the image
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.onload = function() {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                const logoData = canvas.toDataURL('image/png');

                // Add logo
                pdf.addImage(logoData, 'PNG', 247, 40, 100, 100);

                // Filter attended members
                const attendedMembers = data.filter(member => member.registrationStatus === "Attended");

                // Add title with styling
                pdf.setFont("helvetica", "bold");
                pdf.setFontSize(24);
                pdf.text("Attended Members for CPD Training", 40, 180);

                // Add date with styling
                pdf.setFont("helvetica", "normal");
                pdf.setFontSize(12);
                pdf.text("Generated on: " + new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }), 40, 200);

                // Add training details
                pdf.setFont("helvetica", "bold");
                pdf.setFontSize(12);
                pdf.text("Training Details:", 40, 220);
                pdf.setFont("helvetica", "normal");
                pdf.text("Title: " + trainingDetails.title, 40, 240);
                pdf.text("Venue: " + trainingDetails.venue, 40, 260);
                pdf.text("Date: " + trainingDetails.date, 40, 280);
                pdf.text("Duration: " + trainingDetails.duration + " Hours", 40, 300);

                // Table configuration
                const columns = [
                    { header: 'First Name', dataKey: 'firstName' },
                    { header: 'Surname', dataKey: 'lastName' },
                    { header: 'Gender', dataKey: 'gender' },
                    { header: 'Email', dataKey: 'email' },
                    { header: 'Contact', dataKey: 'contact' }
                ];

                const rows = attendedMembers.map(row => ({
                    firstName: row.member.user.firstName,
                    lastName: row.member.user.lastName,
                    gender: row.member.user.gender,
                    email: row.member.user.email,
                    contact: row.member.user.phoneNumber
                }));

                // Add table with styling
                pdf.autoTable({
                    columns: columns,
                    body: rows,
                    startY: 320,
                    margin: { top: 20, right: 40, bottom: 40, left: 40 },
                    headStyles: {
                        fillColor: [41, 128, 185],
                        textColor: 255,
                        fontSize: 12,
                        halign: 'center',
                        fontStyle: 'bold'
                    },
                    bodyStyles: {
                        fontSize: 11,
                        halign: 'left',
                        textColor: 50
                    },
                    alternateRowStyles: {
                        fillColor: [245, 245, 245]
                    },
                    tableWidth: 'auto',
                    columnStyles: {
                        email: { cellWidth: 'auto' },
                        contact: { cellWidth: 'auto' }
                    },
                    didDrawPage: function(data) {
                        pdf.setFontSize(10);
                        pdf.setTextColor(150);
                        pdf.text(
                            'Page ' + data.pageNumber,
                            data.settings.margin.left,
                            pdf.internal.pageSize.height - 10
                        );
                    }
                });

                pdf.save('attended_members.pdf');
                document.body.removeChild(loadingMessage);
            };

            // Handle image loading error by generating PDF without logo
            img.onerror = function() {
                console.error("Error loading logo image");
                generatePDFWithoutLogo(data);
            };
            img.src = '/assets/images/logos/cropped-mls-logo-clear-192x192.png';
        },
        error: function(err) {
            console.error("Error fetching attended members data:", err);
            document.body.removeChild(loadingMessage);
            alert("Error generating PDF for attended members. Please try again.");
        }
    });
}

// Only attach event listener if element exists
const downloadButton = document.getElementById("downloadButton");
if (downloadButton) {
    downloadButton.addEventListener("click", downloadLicensedMembersAsPDF);
}

const downloadAttendedButton = document.getElementById("downloadAttendedButton");
if (downloadAttendedButton) {
    downloadAttendedButton.addEventListener("click", function() {
        const cpdTrainingId = this.getAttribute('data-training-id');
        console.log("Training ID:", cpdTrainingId); // Debug log
        if (!cpdTrainingId) {
            console.error("No training ID found!");
            return;
        }
        downloadAttendedMembersAsPDF(cpdTrainingId);
    });
}