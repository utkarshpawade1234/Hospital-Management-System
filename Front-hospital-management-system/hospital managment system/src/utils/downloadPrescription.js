export function downloadPrescription(prescription, extraInfo = {}) {
  if (!prescription) return;

  const doctorName = prescription.doctorName || extraInfo.doctorName || "Dr. Medical Specialist";
  const patientName = prescription.patientName || extraInfo.patientName || "Patient";
  const appointmentDate = prescription.appointmentDate || extraInfo.appointmentDate || new Date().toLocaleDateString();
  const prescriptionId = prescription.prescriptionId ? `RX-${prescription.prescriptionId}` : `RX-${Date.now().toString().slice(-6)}`;
  const diagnosis = prescription.diagnosis || "N/A";
  const notes = prescription.notes || "";
  const medicines = prescription.medicines || [];

  const medicinesHtml = medicines.length > 0
    ? medicines.map((med, index) => `
      <tr>
        <td style="padding: 10px 12px; border-bottom: 1px solid #E2E8F0; text-align: center; font-weight: 500;">${index + 1}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #E2E8F0; font-weight: 600; color: #0F172A;">
          ${med.medicineName || "Medicine"}
        </td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #E2E8F0;">${med.dosage || "-"}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #E2E8F0;">${med.frequency || "-"}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #E2E8F0;">${med.duration || "-"}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #E2E8F0; text-align: center;">${med.quantity || "-"}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #E2E8F0; font-style: italic; color: #475569;">${med.instructions || "-"}</td>
      </tr>
    `).join('')
    : `<tr><td colspan="7" style="padding: 16px; text-align: center; color: #64748B;">No medicines listed</td></tr>`;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Prescription_${prescriptionId}</title>
      <style>
        @media print {
          @page {
            size: A4;
            margin: 15mm;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
        * {
          box-sizing: border-box;
          font-family: 'Segoe UI', system-ui, -apple-system, Roboto, Helvetica, Arial, sans-serif;
        }
        body {
          margin: 0;
          padding: 24px;
          background: #ffffff;
          color: #1E293B;
          font-size: 13px;
          line-height: 1.5;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #0EA5E9;
          padding-bottom: 16px;
          margin-bottom: 20px;
        }
        .hospital-title {
          font-size: 22px;
          font-weight: 700;
          color: #0F172A;
          letter-spacing: -0.5px;
          margin: 0;
        }
        .hospital-sub {
          font-size: 12px;
          color: #64748B;
          margin-top: 2px;
        }
        .rx-badge {
          background: #0EA5E9;
          color: white;
          font-size: 24px;
          font-weight: 800;
          padding: 6px 16px;
          border-radius: 8px;
          display: inline-block;
        }
        .meta-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 16px;
          margin-bottom: 20px;
        }
        .meta-item {
          display: flex;
          flex-direction: column;
        }
        .meta-label {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #64748B;
          font-weight: 600;
        }
        .meta-value {
          font-size: 14px;
          font-weight: 600;
          color: #0F172A;
          margin-top: 2px;
        }
        .section-title {
          font-size: 13px;
          font-weight: 700;
          color: #0F172A;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .med-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 24px;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          overflow: hidden;
        }
        .med-table th {
          background: #F1F5F9;
          color: #334155;
          font-weight: 600;
          text-align: left;
          padding: 10px 12px;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid #CBD5E1;
        }
        .notes-box {
          background: #FEFCE8;
          border: 1px solid #FEF08A;
          border-radius: 8px;
          padding: 14px;
          margin-bottom: 30px;
          color: #713F12;
        }
        .footer {
          margin-top: 40px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          border-top: 1px solid #E2E8F0;
          padding-top: 20px;
        }
        .signature-block {
          text-align: center;
          min-width: 180px;
        }
        .signature-line {
          border-top: 1px dashed #94A3B8;
          margin-bottom: 6px;
        }
        .signature-title {
          font-weight: 600;
          color: #0F172A;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <h1 class="hospital-title">Hospital Management System</h1>
          <div class="hospital-sub">Care & Medical Excellence Center • Phone: +1 (800) 555-0199</div>
        </div>
        <div class="rx-badge">Rx</div>
      </div>

      <div class="meta-grid">
        <div class="meta-item">
          <span class="meta-label">Patient Name</span>
          <span class="meta-value">${patientName}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Doctor Name</span>
          <span class="meta-value">${doctorName}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Prescription ID & Date</span>
          <span class="meta-value">${prescriptionId} • ${appointmentDate}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Diagnosis</span>
          <span class="meta-value" style="color: #0EA5E9;">${diagnosis}</span>
        </div>
      </div>

      <div class="section-title">Prescribed Medicines</div>
      <table class="med-table">
        <thead>
          <tr>
            <th style="width: 40px; text-align: center;">#</th>
            <th>Medicine Name</th>
            <th>Dosage</th>
            <th>Frequency</th>
            <th>Duration</th>
            <th style="text-align: center;">Qty</th>
            <th>Instructions</th>
          </tr>
        </thead>
        <tbody>
          ${medicinesHtml}
        </tbody>
      </table>

      ${notes ? `
        <div class="section-title">Doctor's Advice & Instructions</div>
        <div class="notes-box">
          ${notes}
        </div>
      ` : ''}

      <div class="footer">
        <div style="font-size: 11px; color: #94A3B8;">
          <p style="margin:0 0 4px 0;">This document is a digitally generated medical prescription.</p>
          <p style="margin:0;">Generated on ${new Date().toLocaleString()}</p>
        </div>
        <div class="signature-block">
          <div class="signature-line"></div>
          <div class="signature-title">${doctorName}</div>
          <div style="font-size: 11px; color: #64748B;">Authorized Signature</div>
        </div>
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 300);
        };
      </script>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank', 'width=850,height=900');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  } else {
    alert("Please allow pop-ups for this website to download/print the prescription.");
  }
}
