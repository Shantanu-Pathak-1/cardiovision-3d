import { create } from 'zustand';
import { processImageAPI, fetchMLPrediction, callClinicalLLM } from '../services/apiService';

const getRiskLevel = (score) => {
  if (score < 20) return { label: 'Low Risk', color: '#10b981', bg: 'rgba(16,185,129,0.12)' };
  if (score < 45) return { label: 'Moderate Risk', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' };
  if (score < 70) return { label: 'High Risk', color: '#f97316', bg: 'rgba(249,115,22,0.12)' };
  return { label: 'Severe Risk', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' };
};

const getRecommendations = (score, v) => {
  if (score >= 70) return [
    '🚨 Immediate ECG & Cardiac Biomarker Protocol',
    '⚠️ High risk of Ischemia & Stenosis detected',
    '🏥 Urgent Cardiology Triage Consult',
    '💊 Initiate High-Intensity Statin Therapy',
  ];
  if (score >= 45) return [
    '📋 Schedule Cardiac Stress Echocardiogram',
    '💊 Evaluate Lipid-Lowering Combination Therapy',
    '🥗 Medical Nutrition Therapy (DASH Diet)',
    '🏃 Supervised Exercise Rehabilitation',
  ];
  if (score >= 20) return [
    '🩺 Annual Cardiovascular Risk Re-evaluation',
    '🥗 Mediterranean Dietary Protocol',
    '🏃 150 min/week Aerobic Exercise Target',
    '📊 Weekly Ambulatory Blood Pressure Logs',
  ];
  return [
    '✅ Cardiovascular Profile Optimal',
    '🏃 Maintain Baseline Activity Target',
    '🥗 Continue Balanced Diet',
    '📅 Routine Annual Review in 12 Months',
  ];
};

const defaultVitals = {
  bloodPressure: 145,
  ldlCholesterol: 168,
  fastingBloodSugar: 112,
  maxHeartRate: 138,
  age: 52,
  smoker: false,
  diabetic: false,
};

const initScore = 49; // Default Framingham score

export const useRiskStore = create((set, get) => ({
  activeTab: '3d-model',
  patient: { name: 'Alex Thompson', age: 52, gender: 'Male' },
  vitals: defaultVitals,
  riskScore: initScore,
  riskLevel: getRiskLevel(initScore),
  recommendations: getRecommendations(initScore, defaultVitals),
  wireframeMode: false,
  autoRotate: false,

  // Multimodal AI States
  isAnalyzingML: false,
  isExtractingVision: false,
  visionSuccessMessage: null,
  chatOpen: false,
  chatMessages: [
    {
      sender: 'assistant',
      text: `Hello Dr. Thompson. Context loaded: Patient **Alex Thompson** (52 M) displays a **49% Risk Index (High Risk)**. How can I assist with AHA/ACC guidelines or treatment protocols?`,
      time: 'Just now',
    },
  ],
  isChatLoading: false,

  // Action: Set active tab
  setActiveTab: (tabId) => set({ activeTab: tabId }),

  // Action: Update Vitals with Real ML Engine Prediction
  setVital: async (key, value) => {
    const newVitals = { ...get().vitals, [key]: value };
    set({ vitals: newVitals, isAnalyzingML: true });

    // Call Tabular ML Risk Engine (FastAPI backend placeholder)
    const { riskScore: score } = await fetchMLPrediction(newVitals);

    set({
      riskScore: score,
      riskLevel: getRiskLevel(score),
      recommendations: getRecommendations(score, newVitals),
      isAnalyzingML: false,
    });
  },

  // Action: Vision AI Smart Auto-Fill (Lab/ECG Upload)
  uploadLabDocument: async (file) => {
    set({ isExtractingVision: true, visionSuccessMessage: null });

    // Call Gemini 2.0 Flash Vision API placeholder
    const extractedData = await processImageAPI(file);

    const newVitals = {
      ...get().vitals,
      bloodPressure: extractedData.bloodPressure,
      ldlCholesterol: extractedData.ldlCholesterol,
      fastingBloodSugar: extractedData.fastingBloodSugar,
      maxHeartRate: extractedData.maxHeartRate,
      smoker: extractedData.smoker,
      diabetic: extractedData.diabetic,
    };

    // Calculate updated ML Risk Index
    const { riskScore: score } = await fetchMLPrediction(newVitals);

    set({
      vitals: newVitals,
      riskScore: score,
      riskLevel: getRiskLevel(score),
      recommendations: getRecommendations(score, newVitals),
      isExtractingVision: false,
      visionSuccessMessage: `✓ Extracted clinical vitals from ${extractedData.fileName} (${Math.round(extractedData.extractedConfidence * 100)}% Confidence)`,
    });
  },

  // Action: NLP Clinical Chat Assistant (Groq RAG LLM)
  sendChatMessage: async (userText) => {
    const messages = [...get().chatMessages, { sender: 'user', text: userText, time: 'Just now' }];
    set({ chatMessages: messages, isChatLoading: true });

    const context = {
      name: get().patient.name,
      riskScore: get().riskScore,
      riskLevel: get().riskLevel.label,
      vitals: get().vitals,
    };

    const reply = await callClinicalLLM(
      messages.map((m) => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text })),
      context
    );

    set({
      chatMessages: [...messages, { sender: 'assistant', text: reply, time: 'Just now' }],
      isChatLoading: false,
    });
  },

  toggleChatDrawer: () => set((s) => ({ chatOpen: !s.chatOpen })),
  setPatient: (key, value) => set((s) => ({ patient: { ...s.patient, [key]: value } })),
  toggleWireframe: () => set((s) => ({ wireframeMode: !s.wireframeMode })),
  toggleAutoRotate: () => set((s) => ({ autoRotate: !s.autoRotate })),
}));
