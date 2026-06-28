import { useState, useRef, useEffect } from 'react';
import type { ParsedDataset } from '../../types/dashboard';
import { postChat } from '../../api/chat';

interface Message {
  role: 'user' | 'assistant' | 'error';
  text: string;
}

const SUGGESTIONS = [
  'Why did revenue decrease?',
  'Which period had the highest growth?',
  'What was the best month?',
  'Summarize the key trends.',
];

interface ChatPanelProps {
  dataset: ParsedDataset | null;
}

export default function ChatPanel({ dataset }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function send(question: string) {
    if (!dataset || !question.trim() || loading) return;
    const q = question.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: q }]);
    setLoading(true);
    try {
      const { answer } = await postChat(q, dataset);
      setMessages((prev) => [...prev, { role: 'assistant', text: answer }]);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Failed to get answer. Please try again.';
      setMessages((prev) => [...prev, { role: 'error', text: msg }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: '16px',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        background: 'var(--surface-alt)',
      }}>
        <div style={{
          width: 32, height: 32,
          background: 'linear-gradient(135deg, #4a9eff22, #7c3aed22)',
          border: '1px solid #4a9eff44',
          borderRadius: '8px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '14px',
        }}>✦</div>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Data Assistant</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Powered by Gemini 2.5 Flash</div>
        </div>
        {!dataset && (
          <span style={{
            marginLeft: 'auto', fontSize: '10px', fontWeight: 600,
            color: '#f5a623', background: '#f5a62318',
            border: '1px solid #f5a62330', borderRadius: '4px',
            padding: '2px 8px', letterSpacing: '0.05em',
          }}>NO DATA</span>
        )}
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '16px 20px',
        display: 'flex', flexDirection: 'column', gap: '12px',
        minHeight: '220px', maxHeight: '340px',
      }}>
        {messages.length === 0 && !loading && (
          <div style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 'auto', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', marginBottom: '10px' }}>💬</div>
            <div>{dataset ? 'Ask anything about your data.' : 'Upload a dataset to start chatting.'}</div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              animation: 'fadeSlideUp 0.25s ease',
            }}
          >
            <div style={{
              maxWidth: '82%',
              padding: '10px 14px',
              borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
              fontSize: '13px',
              lineHeight: '1.55',
              background:
                msg.role === 'user' ? 'linear-gradient(135deg, #1a3a6a, #1e2d55)' :
                msg.role === 'error' ? '#2a0f17' : 'var(--surface-alt)',
              border:
                msg.role === 'user' ? '1px solid #2a5298' :
                msg.role === 'error' ? '1px solid #ff4d6a44' : '1px solid var(--border)',
              color:
                msg.role === 'error' ? '#ff6b85' : 'var(--text-primary)',
            }}>
              {msg.role === 'error' && <span style={{ marginRight: '6px' }}>⚠</span>}
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              padding: '10px 16px',
              background: 'var(--surface-alt)',
              border: '1px solid var(--border)',
              borderRadius: '14px 14px 14px 4px',
              display: 'flex', gap: '5px', alignItems: 'center',
            }}>
              {[0, 1, 2].map((i) => (
                <div key={i} className="typing-dot" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length === 0 && dataset && (
        <div style={{
          padding: '0 20px 12px',
          display: 'flex', flexWrap: 'wrap', gap: '6px',
        }}>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              disabled={loading}
              style={{
                fontSize: '11px',
                padding: '5px 11px',
                background: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: '20px',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#4a9eff55';
                (e.currentTarget as HTMLButtonElement).style.color = '#4a9eff';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)';
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)';
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid var(--border)',
        display: 'flex', gap: '8px',
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send(input)}
          placeholder={dataset ? 'Ask about your data…' : 'Upload data to enable chat'}
          disabled={!dataset || loading}
          style={{
            flex: 1,
            background: 'var(--surface-alt)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            padding: '9px 14px',
            fontSize: '13px',
            color: 'var(--text-primary)',
            outline: 'none',
            transition: 'border-color 0.15s',
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = '#4a9eff55')}
          onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
        />
        <button
          onClick={() => send(input)}
          disabled={!dataset || loading || !input.trim()}
          style={{
            width: '38px', height: '38px',
            background: input.trim() && dataset ? 'linear-gradient(135deg, #1a3a6a, #2a5298)' : 'var(--surface-alt)',
            border: '1px solid',
            borderColor: input.trim() && dataset ? '#2a5298' : 'var(--border)',
            borderRadius: '10px',
            cursor: input.trim() && dataset ? 'pointer' : 'not-allowed',
            fontSize: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s',
            flexShrink: 0,
          }}
        >
          ↑
        </button>
      </div>
    </div>
  );
}
