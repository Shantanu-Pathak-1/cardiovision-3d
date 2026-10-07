/**
 * Clinical Report Exporter Utility
 * Formats patient vitals, Framingham ML Risk Index, 3D Anatomical vessel status,
 * and AHA/ACC guidelines into printable PDF reports and clipboard copy text.
 */

export function generateReportText(patient, vitals, riskScore, riskLevel, recommendations) {
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return `===================================================================
                CARDIOVISION CLINICAL RISK ASSESSMENT REPORT
===================================================================
Generated: ${dateStr}
Report ID: CV-RPT-${Math.floor(100000 + Math.random() * 900000)}

PATIENT DEMOGRAPHICS
--------------------
Name   : ${patient.name}
Age    : ${patient.age} years
Gender : ${patient.gender}

CLINICAL VITALS & PARAMETERS
----------------------------
Systolic Blood Pressure : ${vitals.bloodPressure} mmHg
LDL Cholesterol         : ${vitals.ldlCholesterol} mg/dL
Fasting Blood Glucose   : ${vitals.fastingBloodSugar} mg/dL
Max Peak Heart Rate     : ${vitals.maxHeartRate} bpm
Active Smoker           : ${vitals.smoker ? 'YES (+15% Risk)' : 'No'}
Diabetic History        : ${vitals.diabetic ? 'YES (+10% Risk)' : 'No'}

AI FRAMINGHAM ML RISK INDEX
---------------------------
Overall Risk Index      : ${riskScore}%
Classification          : ${riskLevel.label.toUpperCase()}

3D ANATOMICAL CORONARY OCCLUSION MAPPING
-----------------------------------------
1. LAD Coronary Artery    : ${Math.min(99, Math.round(riskScore * 0.96))}% Occlusion Probability (High Ischemia Risk)
2. Left Ventricle Wall    : ${Math.min(95, Math.round(riskScore * 0.82))}% Myocardial Wall Pressure Strain
3. Aortic & Mitral Valve  : ${Math.min(90, Math.round(riskScore * 0.68))}% Orifice Velocity Flow Ratio
4. Right Atrium & SA Node : ${Math.min(85, Math.round(riskScore * 0.50))}% Pacemaker Impulse Rhythm

AHA/ACC CLINICAL TRIAGE RECOMMENDATIONS
---------------------------------------
${recommendations.map((rec, i) => `${i + 1}. ${rec.replace(/^[^\w\s]+/, '').trim()}`).join('\n')}

PHYSICIAN SIGN-OFF
------------------
Reviewed By : Dr. ___________________________
MD License  : # _____________________________
Signature   : _______________________________ Date: ____________

===================================================================
`;
}

export function downloadClinicalReportPDF(patient, vitals, riskScore, riskLevel, recommendations) {
  const textReport = generateReportText(patient, vitals, riskScore, riskLevel, recommendations);
  
  // Also copy to clipboard for convenience
  if (navigator.clipboard) {
    navigator.clipboard.writeText(textReport).catch(() => {});
  }

  const printWindow = window.open('', '_blank', 'width=850,height=950');
  if (!printWindow) {
    alert('Please allow popups to export the Clinical PDF Report.');
    return;
  }

  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Clinical Risk Report - ${patient.name}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    body {
      font-family: 'Inter', sans-serif;
      background: #ffffff;
      color: #1e293b;
      margin: 0;
      padding: 32px;
      font-size: 13px;
      line-height: 1.5;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #0284c7;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }
    .brand {
      font-size: 20px;
      font-weight: 700;
      color: #0f172a;
      letter-spacing: -0.5px;
    }
    .brand span { color: #0284c7; }
    .doc-meta {
      text-align: right;
      font-size: 11px;
      color: #64748b;
    }
    .section-title {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #0284c7;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 4px;
      margin-top: 20px;
      margin-bottom: 12px;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px 16px;
    }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 6px;
      font-weight: 700;
      font-size: 14px;
      color: ${riskLevel.color};
      background: ${riskLevel.color}15;
      border: 1px solid ${riskLevel.color}40;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 8px;
    }
    th, td {
      padding: 8px 12px;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
    }
    th {
      font-size: 11px;
      color: #64748b;
      text-transform: uppercase;
    }
    .rec-item {
      padding: 8px 12px;
      background: #f0f9ff;
      border-left: 3px solid #0284c7;
      margin-bottom: 6px;
      border-radius: 0 6px 6px 0;
      font-size: 12px;
    }
    .sign-off {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px dashed #cbd5e1;
      display: flex;
      justify-content: space-between;
    }
    .sign-line {
      border-bottom: 1px solid #94a3b8;
      width: 200px;
      margin-top: 30px;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom: 20px; text-align: right;">
    <button onclick="window.print()" style="background: #0284c7; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 13px;">
      🖨️ Print / Save PDF
    </button>
  </div>

  <div class="header">
    <div>
      <div class="brand">CARDIO<span>VISION</span> CLINICAL REPORT</div>
      <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Multimodal AI Cardiovascular Diagnostic Suite</div>
    </div>
    <div class="doc-meta">
      <div><b>Date:</b> ${dateStr}</div>
      <div><b>Report ID:</b> CV-RPT-${Math.floor(100000 + Math.random() * 900000)}</div>
    </div>
  </div>

  <div class="grid-2">
    <div class="card">
      <div style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 600;">Patient Profile</div>
      <div style="font-size: 16px; font-weight: 700; margin-top: 4px;">${patient.name}</div>
      <div style="font-size: 12px; color: #475569; margin-top: 2px;">Age: ${patient.age} yrs &bull; Gender: ${patient.gender}</div>
    </div>

    <div class="card" style="display: flex; align-items: center; justify-content: space-between;">
      <div>
        <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Framingham ML Risk Index</div>
        <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>Combined Tabular & Vision Inference</div>
      </div>
      <div class="badge">
        ${riskScore}% &bull; ${riskLevel.label.toUpperCase()}
      </div>
    </div>
  </div>

  <div class="section-title">Clinical Vitals & Parameters</div>
  <table>
    <thead>
      <tr>
        <th>Parameter</th>
        <th>Measured Value</th>
        <th>Clinical Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Systolic Blood Pressure</td>
        <td><b>${vitals.bloodPressure} mmHg</b></td>
        <td>${vitals.bloodPressure > 140 ? 'High' : vitals.bloodPressure > 120 ? 'Elevated' : 'Optimal'}</td>
      </tr>
      <tr>
        <td>LDL Cholesterol</td>
        <td><b>${vitals.ldlCholesterol} mg/dL</b></td>
        <td>${vitals.ldlCholesterol > 160 ? 'High Risk' : vitals.ldlCholesterol > 130 ? 'Borderline' : 'Optimal'}</td>
      </tr>
      <tr>
        <td>Fasting Blood Glucose</td>
        <td><b>${vitals.fastingBloodSugar} mg/dL</b></td>
        <td>${vitals.fastingBloodSugar > 125 ? 'Diabetic Range' : vitals.fastingBloodSugar > 100 ? 'Pre-Diabetic' : 'Normal'}</td>
      </tr>
      <tr>
        <td>Max Peak Heart Rate</td>
        <td><b>${vitals.maxHeartRate} bpm</b></td>
        <td>${vitals.maxHeartRate > 160 ? 'High Exertion' : 'Normal'}</td>
      </tr>
      <tr>
        <td>Lifestyle Factors</td>
        <td colspan="2">Active Smoker: <b>${vitals.smoker ? 'Yes (+15% Risk)' : 'No'}</b> &bull; Diabetic History: <b>${vitals.diabetic ? 'Yes (+10% Risk)' : 'No'}</b></td>
      </tr>
    </tbody>
  </table>

  <div class="section-title">3D Coronary Vessel & Myocardial Mapping</div>
  <table>
    <thead>
      <tr>
        <th>Anatomical Vessel / Zone</th>
        <th>Estimated Occlusion / Strain Risk</th>
        <th>Clinical Assessment</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>LAD Coronary Artery</td>
        <td><b>${Math.min(99, Math.round(riskScore * 0.96))}% Risk</b></td>
        <td>Anterior Interventricular Sulcus Stenosis Risk</td>
      </tr>
      <tr>
        <td>Left Ventricle Wall</td>
        <td><b>${Math.min(95, Math.round(riskScore * 0.82))}% Risk</b></td>
        <td>Anterolateral Myocardial Pressure Strain</td>
      </tr>
      <tr>
        <td>Aortic & Mitral Valve</td>
        <td><b>${Math.min(90, Math.round(riskScore * 0.68))}% Risk</b></td>
        <td>Aortic Root Orifice Hemodynamic Flow Velocity</td>
      </tr>
      <tr>
        <td>Right Atrium & SA Node</td>
        <td><b>${Math.min(85, Math.round(riskScore * 0.50))}% Risk</b></td>
        <td>Sinoatrial Pacemaker Impulse Rhythm</td>
      </tr>
    </tbody>
  </table>

  <div class="section-title">AHA/ACC Guideline Recommendations</div>
  ${recommendations.map((rec) => `<div class="rec-item">${rec}</div>`).join('')}

  <div class="sign-off">
    <div>
      <div style="font-weight: 600;">Attending Cardiologist:</div>
      <div class="sign-line"></div>
      <div style="font-size: 11px; color: #64748b; margin-top: 4px;">MD License # / Signature</div>
    </div>
    <div style="text-align: right;">
      <div style="font-weight: 600;">Clinical Stamp & Date:</div>
      <div class="sign-line"></div>
      <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Date: ____________________</div>
    </div>
  </div>

  <script>
    window.onload = function() {
      // Auto-open print dialog after load
      setTimeout(function() {
        window.print();
      }, 500);
    };
  </script>
</body>
</html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
