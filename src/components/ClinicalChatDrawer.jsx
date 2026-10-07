import { useState, useRef, useEffect } from 'react';
import { useRiskStore } from '../store/useRiskStore';
import { Bot, Send, Sparkles, X, User, Loader2, Cpu, CheckCircle2, ShieldAlert } from 'lucide-react';

const SUGGESTED_PROMPTS = [
  { label: '⚡ AHA/ACC Guidelines', prompt: 'Summarize AHA/ACC lipid management guidelines for this patient.' },
  { label: '🫀 LAD Stenosis Protocol', prompt: 'What is the diagnostic protocol for severe LAD artery occlusion risk?' },
  { label: '💊 Statin & BP Targets', prompt: 'Recommend statin dosage and target blood pressure levels.' },
];

function formatClinicalText(text) {
  if (!text) return '';
  const lines = text.split('\n');
  return lines.map((line, idx) => {
    let formatted = line;
    // Replace **bold** with <strong>
    const parts = formatted.split(/(\*\*.*?\*\*)/g);
    const content = parts.map((part, pIdx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={pIdx} style={{ color: '#38bdf8', fontWeight: 600 }}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });

    if (line.trim().startsWith('1.') || line.trim().startsWith('2.') || line.trim().startsWith('3.')) {
      return (
        <div key={idx} style={{ marginTop: 4, marginBottom: 4, paddingLeft: 4 }}>
          {content}
        </div>
      );
    }
    return <div key={idx} style={{ marginBottom: line.trim() ? 4 : 8 }}>{content}</div>;
  });
}

export default function ClinicalChatDrawer() {
  const { chatOpen, toggleChatDrawer, chatMessages, sendChatMessage, isChatLoading, patient, vitals, riskScore, riskLevel } = useRiskStore();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (chatOpen) {
      scrollToBottom();
    }
  }, [chatMessages, chatOpen, isChatLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim() || isChatLoading) return;
    sendChatMessage(inputText);
    setInputText('');
  };

  const handlePromptClick = (promptText) => {
    if (isChatLoading) return;
    sendChatMessage(promptText);
  };

  return (
    <>
      {/* Auto-Hide Click Outside Backdrop Overlay */}
      {chatOpen && (
        <div
          onClick={toggleChatDrawer}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.35)',
            backdropFilter: 'blur(3px)',
            zIndex: 140,
            cursor: 'pointer',
          }}
        />
      )}

      {/* Slide-out Clinical Chat Drawer */}
      {chatOpen && (
        <div
          className="animate-drawer-in"
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            width: 420,
            maxWidth: '100vw',
            background: 'rgba(9, 13, 22, 0.98)',
            borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            zIndex: 150,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '-12px 0 40px rgba(0, 0, 0, 0.7)',
          }}
        >
          {/* Drawer Header */}
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(15, 23, 42, 0.9)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'rgba(56, 189, 248, 0.12)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#38bdf8',
                  boxShadow: '0 0 12px rgba(56, 189, 248, 0.15)',
                }}
              >
                <Bot size={20} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>Clinical AI Assistant</span>
                  <span style={{ fontSize: 9, color: '#10b981', background: 'rgba(16, 185, 129, 0.12)', padding: '1px 5px', borderRadius: 4, border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                    ● Clinical AI
                  </span>
                </div>
                <div style={{ fontSize: 10, color: '#64748b', marginTop: 1 }}>
                  ACC/AHA Guidelines • Realtime Context Engine
                </div>
              </div>
            </div>

            <button
              onClick={toggleChatDrawer}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease',
              }}
              onMouseOver={(e) => (e.currentTarget.style.color = '#f8fafc')}
              onMouseOut={(e) => (e.currentTarget.style.color = '#94a3b8')}
            >
              <X size={16} />
            </button>
          </div>

          {/* Clinical Context Banner */}
          <div
            style={{
              padding: '10px 16px',
              background: 'rgba(30, 41, 59, 0.4)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
              fontSize: 11,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Cpu size={14} style={{ color: '#38bdf8' }} />
              <span style={{ color: '#cbd5e1' }}>
                Context: <b style={{ color: '#f8fafc' }}>{patient.name}</b> ({patient.age}M)
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 10, color: '#64748b' }}>BP {vitals.bloodPressure}</span>
              <span
                className="font-mono"
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: riskLevel.color,
                  background: `${riskLevel.color}15`,
                  padding: '2px 6px',
                  borderRadius: 4,
                  border: `1px solid ${riskLevel.color}35`,
                }}
              >
                {riskScore}% {riskLevel.label}
              </span>
            </div>
          </div>

          {/* Chat Messages Stream */}
          <div
            style={{
              flex: 1,
              padding: '16px 20px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
            className="custom-scroll"
          >
            {chatMessages.map((msg, idx) => {
              const isUser = msg.sender === 'user';

              return (
                <div
                  key={idx}
                  className="animate-message"
                  style={{
                    display: 'flex',
                    gap: 10,
                    flexDirection: isUser ? 'row-reverse' : 'row',
                    alignItems: 'flex-start',
                  }}
                >
                  {/* Avatar Icon */}
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: isUser ? 'rgba(56, 189, 248, 0.2)' : 'rgba(30, 41, 59, 0.8)',
                      border: `1px solid ${isUser ? 'rgba(56, 189, 248, 0.4)' : 'rgba(255, 255, 255, 0.08)'}`,
                      color: isUser ? '#38bdf8' : '#cbd5e1',
                    }}
                  >
                    {isUser ? <User size={14} /> : <Bot size={14} />}
                  </div>

                  {/* Message Content Bubble */}
                  <div style={{ maxWidth: '85%' }}>
                    <div
                      style={{
                        padding: '10px 14px',
                        borderRadius: isUser ? '12px 2px 12px 12px' : '2px 12px 12px 12px',
                        fontSize: 12,
                        lineHeight: 1.55,
                        background: isUser ? '#38bdf8' : 'rgba(30, 41, 59, 0.75)',
                        color: isUser ? '#090d16' : '#f8fafc',
                        border: isUser ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
                        fontWeight: isUser ? 500 : 400,
                      }}
                    >
                      {isUser ? msg.text : formatClinicalText(msg.text)}
                    </div>

                    <div
                      style={{
                        fontSize: 9,
                        color: '#64748b',
                        marginTop: 4,
                        textAlign: isUser ? 'right' : 'left',
                        padding: '0 2px',
                      }}
                    >
                      {msg.time} {isUser ? '' : '• Clinical AI'}
                    </div>
                  </div>
                </div>
              );
            })}

            {isChatLoading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#38bdf8', fontSize: 11, padding: '8px 12px', background: 'rgba(30, 41, 59, 0.4)', borderRadius: 8, border: '1px solid rgba(56, 189, 248, 0.2)', width: 'fit-content' }}>
                <Loader2 size={14} className="animate-spin" />
                <span>Consulting Clinical AI Assistant…</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggested Prompt Chips */}
          <div style={{ padding: '8px 16px', display: 'flex', gap: 6, overflowX: 'auto', borderTop: '1px solid rgba(255, 255, 255, 0.04)' }} className="custom-scroll">
            {SUGGESTED_PROMPTS.map((p, i) => (
              <button
                key={i}
                onClick={() => handlePromptClick(p.prompt)}
                style={{
                  padding: '5px 10px',
                  borderRadius: 6,
                  fontSize: 10,
                  fontWeight: 500,
                  color: '#94a3b8',
                  background: 'rgba(30, 41, 59, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = '#38bdf8';
                  e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.3)';
                  e.currentTarget.style.background = 'rgba(30, 41, 59, 0.9)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = '#94a3b8';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.background = 'rgba(30, 41, 59, 0.6)';
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Input Form Area */}
          <form
            onSubmit={handleSubmit}
            style={{
              padding: '14px 16px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              gap: 8,
              background: 'rgba(15, 23, 42, 0.95)',
            }}
          >
            <input
              type="text"
              placeholder="Ask clinical question (e.g. ACC guidelines)..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              style={{
                flex: 1,
                background: 'rgba(30, 41, 59, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 8,
                color: '#f8fafc',
                padding: '9px 12px',
                fontSize: 12,
                outline: 'none',
                transition: 'border-color 0.15s ease',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'rgba(56, 189, 248, 0.5)')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)')}
            />
            <button
              type="submit"
              disabled={isChatLoading || !inputText.trim()}
              style={{
                padding: '9px 16px',
                borderRadius: 8,
                background: isChatLoading || !inputText.trim() ? 'rgba(30, 41, 59, 0.6)' : '#38bdf8',
                color: isChatLoading || !inputText.trim() ? '#64748b' : '#090d16',
                border: 'none',
                fontWeight: 600,
                fontSize: 12,
                cursor: isChatLoading || !inputText.trim() ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                transition: 'all 0.15s ease',
              }}
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
