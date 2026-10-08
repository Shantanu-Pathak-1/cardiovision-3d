import { useState, type FormEvent } from 'react';
import { ArrowRight, Bot, ChevronDown, CircleHelp, LockKeyhole, MessageCircle, MoreHorizontal, PanelRightClose, Send, ShieldCheck, Sparkles, User, X } from 'lucide-react';
import { useRiskStore } from '../../store/useRiskStore';

type Props = { open: boolean; onClose: () => void };

export function AssistantDrawer({ open, onClose }: Props) {
  const { chatMessages, sendChatMessage, isChatLoading, patient, riskScore, riskLevel } = useRiskStore();
  const [draft, setDraft] = useState('');

  const handleSendPrompt = async (textToSend: string) => {
    if (!textToSend.trim() || isChatLoading) return;
    setDraft('');
    await sendChatMessage(textToSend);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSendPrompt(draft);
  };

  const suggestedPrompts = [
    "What are the ACC/AHA lipid-lowering guidelines for this patient's risk profile?",
    "Evaluate hypertension treatment protocol based on systolic blood pressure.",
    "Draft a clinical summary for cardiologist consultation."
  ];

  return (
    <>
      <button 
        className={`assistant-backdrop ${open ? 'visible' : ''}`} 
        onClick={onClose} 
        aria-label="Close clinical assistant" 
        tabIndex={open ? 0 : -1}
      />
      
      <aside className={`assistant-drawer ${open ? 'assistant-open' : ''}`} aria-hidden={!open} aria-label="Clinical AI assistant">
        <header className="assistant-header">
          <div className="assistant-avatar"><Bot size={18}/><span/></div>
          <div className="assistant-title">
            <strong>Clinical AI Assistant</strong>
            <span style={{ color: '#4ade80' }}><i style={{ background: '#4ade80' }}/> GROQ RAG LLM ONLINE</span>
          </div>
          <button className="icon-button assistant-close" onClick={onClose} aria-label="Close assistant">
            <PanelRightClose size={17}/>
          </button>
        </header>

        <div className="assistant-context">
          <Sparkles size={14}/>
          <span>Context: {patient.name} ({riskScore}% Risk · {riskLevel.label})</span>
          <button aria-label="Assistant details"><MoreHorizontal size={15}/></button>
        </div>

        <div className="assistant-content custom-scroll" style={{ overflowY: 'auto', flex: 1, padding: '16px' }}>
          <div className="assistant-date">CLINICAL AI SESSION</div>

          {chatMessages.map((msg, idx) => (
            <div 
              key={idx} 
              style={{
                display: 'flex',
                gap: 10,
                marginBottom: 14,
                flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-start'
              }}
            >
              <div 
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: msg.sender === 'user' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                  border: `1px solid ${msg.sender === 'user' ? 'rgba(56, 189, 248, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: msg.sender === 'user' ? '#38bdf8' : '#10b981',
                  flexShrink: 0
                }}
              >
                {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
              </div>

              <div 
                style={{
                  maxWidth: '82%',
                  padding: '10px 14px',
                  borderRadius: 12,
                  background: msg.sender === 'user' ? 'rgba(56, 189, 248, 0.12)' : 'rgba(15, 23, 42, 0.9)',
                  border: `1px solid ${msg.sender === 'user' ? 'rgba(56, 189, 248, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
                  color: '#f8fafc',
                  fontSize: 12,
                  lineHeight: 1.55,
                  whiteSpace: 'pre-wrap'
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isChatLoading && (
            <div className="typing-preview" aria-label="Clinical AI is thinking">
              <span className="typing-dots"><i/><i/><i/></span>
              <span>Groq Clinical RAG LLM is synthesizing protocol…</span>
            </div>
          )}

          <div className="assistant-divider"><span>SUGGESTED CLINICAL PROMPTS</span></div>
          
          <div className="suggested-prompts">
            {suggestedPrompts.map((promptText, i) => (
              <button 
                key={i} 
                onClick={() => handleSendPrompt(promptText)}
                disabled={isChatLoading}
              >
                <CircleHelp size={14}/> 
                <span>{promptText}</span> 
                <ArrowRight size={13}/>
              </button>
            ))}
          </div>
        </div>

        <div className="assistant-composer-wrap">
          <form className="assistant-composer" onSubmit={onSubmit}>
            <textarea 
              rows={2} 
              value={draft} 
              onChange={(event) => setDraft(event.target.value)} 
              placeholder="Ask a clinical question or request treatment recommendations…" 
              aria-label="Clinical question draft"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  onSubmit(e as any);
                }
              }}
            />
            <button className="send-button" disabled={!draft.trim() || isChatLoading} aria-label="Submit question">
              <Send size={15}/>
            </button>
          </form>
          <div className="assistant-safe">
            <LockKeyhole size={12}/> Encrypted Transport <i/> Groq RAG Clinical Engine Active
          </div>
        </div>
      </aside>
    </>
  );
}
