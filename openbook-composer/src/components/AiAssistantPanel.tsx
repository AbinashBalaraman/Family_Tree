import React, { useState, useEffect, useRef } from 'react';
import { useComposerStore } from '../store/useComposerStore';
import { AIProviderType, testProviderConnection, ConnectionTestResult, fetchAvailableModels } from '../ai/providers';
import { Sparkles, Send, Bot, Cpu, CheckCircle2, Settings2, Mic, MicOff, Volume2, VolumeX, Activity, AlertCircle, RefreshCw, ChevronLeft, Copy, Check, Square } from 'lucide-react';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export const AiAssistantPanel: React.FC = () => {
  const {
    aiConfig,
    setAiConfig,
    aiPrompt,
    setAiPrompt,
    runAiPrompt,
    isAiProcessing,
    aiLogs
  } = useComposerStore();

  const [showConfig, setShowConfig] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSavedToast, setIsSavedToast] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<ConnectionTestResult | null>(null);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [isFetchingModels, setIsFetchingModels] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiLogs, isAiProcessing]);

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingMessageId(null);
  };

  const handleCopyText = (text: string, logId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(logId);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const handleSaveSettings = () => {
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 2500);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    const res = await testProviderConnection(aiConfig);
    setTestResult(res);
    setIsTesting(false);
  };

  const handleFetchModels = async () => {
    setIsFetchingModels(true);
    const models = await fetchAvailableModels(aiConfig);
    setAvailableModels(models);
    setIsFetchingModels(false);
    if (models.length > 0 && (!aiConfig.modelId || !models.includes(aiConfig.modelId))) {
      setAiConfig({ modelId: models[0] });
    }
  };

  const toggleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in your browser. Please try Google Chrome or Microsoft Edge.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setAiPrompt(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const speakResponse = (text: string, msgId: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in your browser.');
      return;
    }

    if (speakingMessageId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;

    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const urlPresets = [
    { label: 'Ollama', url: 'http://localhost:11434/v1' },
    { label: 'LM Studio', url: 'http://localhost:1234/v1' },
    { label: 'Groq Cloud', url: 'https://api.groq.com/openai/v1' },
    { label: 'OpenRouter', url: 'https://openrouter.ai/api/v1' },
    { label: 'OpenAI', url: 'https://api.openai.com/v1' },
  ];

  const presets = [
    { label: 'Summarize Section', prompt: 'Summarize the current chapter section with key points and takeaways.' },
    { label: 'Make Page Compact', prompt: 'Make this page more compact by reducing spacing constraints.' },
    { label: 'Turn into Callout', prompt: 'Turn this paragraph into a highlighted key takeaway box.' },
    { label: 'Add MCQ Quiz', prompt: 'Create a multiple choice question (MCQ) from this section.' },
    { label: 'Keep Heading with Next', prompt: 'Keep this heading with the following paragraph.' },
    { label: 'Draft Chapter Intro', prompt: 'Draft a compelling introductory paragraph for the active chapter.' },
  ];

  const handleSend = () => {
    if (!aiPrompt.trim() || isAiProcessing) return;
    runAiPrompt();
  };

  const handlePresetClick = (presetPrompt: string) => {
    setAiPrompt(presetPrompt);
    runAiPrompt(presetPrompt);
  };

  const handleInsertTextToDoc = (text: string) => {
    const activeChId = useComposerStore.getState().activeChapterId || 'chapter-1';
    useComposerStore.getState().addBlock(activeChId, {
      id: 'b_ai_' + Date.now(),
      type: 'paragraph',
      text: text,
    });
  };

  return (
    <aside className="no-print w-80 bg-slate-900 border-l border-slate-800 flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Header */}
      <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-slate-200">
          <div className="p-1 rounded bg-sky-500/10 text-sky-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider">Voice & AI Chat</span>
        </div>
        <div className="flex items-center space-x-1.5">
          {speakingMessageId && (
            <button
              onClick={stopSpeaking}
              className="px-2 py-0.5 bg-red-950/90 border border-red-800 text-red-300 hover:bg-red-900 rounded text-[10px] flex items-center space-x-1 font-medium transition-all animate-pulse"
              title="Stop audio playback immediately"
            >
              <Square className="w-3 h-3 fill-red-400" />
              <span>Stop Audio</span>
            </button>
          )}
          <button
            onClick={() => setShowConfig(!showConfig)}
            className={`p-1.5 rounded transition-colors flex items-center space-x-1 ${
              showConfig ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title={showConfig ? 'Back to Chat' : 'AI Provider Settings'}
          >
            {showConfig ? (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span className="text-[10px] font-medium pr-0.5">Back</span>
              </>
            ) : (
              <Settings2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* AI Provider Config Subpanel */}
      {showConfig && (
        <div className="p-3 border-b border-slate-800 bg-slate-950 text-xs space-y-2.5 max-h-[55vh] overflow-y-auto">
          <div className="flex items-center justify-between">
            <span className="font-medium text-slate-300">AI Provider:</span>
            <select
              value={aiConfig.type}
              onChange={(e) => setAiConfig({ type: e.target.value as AIProviderType })}
              className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-sky-400 font-medium"
            >
              <option value="custom">Universal Custom Endpoint</option>
              <option value="ollama">Ollama (Native Local)</option>
              <option value="openai">OpenAI Official API</option>
              <option value="anthropic">Anthropic Claude API</option>
            </select>
          </div>

          {(aiConfig.type === 'custom' || aiConfig.type === 'openai' || aiConfig.type === 'anthropic') && (
            <div className="space-y-2 pt-1 border-t border-slate-800/60">
              {/* Base URL */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] text-slate-400 font-medium">Base URL Endpoint:</label>
                  <span className="text-[9px] text-sky-400 font-mono">OpenAI Compatible</span>
                </div>
                <input
                  type="text"
                  value={aiConfig.baseUrl || ''}
                  onChange={(e) => setAiConfig({ baseUrl: e.target.value })}
                  placeholder="https://api.openai.com/v1 or http://localhost:11434/v1"
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 font-mono text-slate-200 text-[11px] focus:outline-none focus:border-sky-500"
                />
                {/* URL Quick Presets */}
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {urlPresets.map((preset, pIdx) => (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() => setAiConfig({ baseUrl: preset.url })}
                      className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 hover:bg-sky-950 text-slate-400 hover:text-sky-300 border border-slate-800 transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Model ID & Model Select Dropdown */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] text-slate-400 font-medium">Model ID / Selection:</label>
                  <button
                    type="button"
                    onClick={handleFetchModels}
                    disabled={isFetchingModels}
                    className="text-[9px] text-sky-400 hover:text-sky-300 flex items-center space-x-1 disabled:opacity-50"
                    title="Query provider for available models"
                  >
                    <RefreshCw className={`w-3 h-3 ${isFetchingModels ? 'animate-spin' : ''}`} />
                    <span>{isFetchingModels ? 'Fetching...' : 'Fetch Models'}</span>
                  </button>
                </div>

                {availableModels.length > 0 ? (
                  <select
                    value={aiConfig.modelId || availableModels[0]}
                    onChange={(e) => setAiConfig({ modelId: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 font-mono text-slate-200 text-[11px] focus:outline-none focus:border-sky-500 mt-1"
                  >
                    {availableModels.map((m, mIdx) => (
                      <option key={mIdx} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={aiConfig.modelId || ''}
                    onChange={(e) => setAiConfig({ modelId: e.target.value })}
                    placeholder="e.g. deepseek-v4-flash-free, gpt-4o, llama3"
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 font-mono text-slate-200 text-[11px] focus:outline-none focus:border-sky-500 mt-1"
                  />
                )}
              </div>

              {/* Model Display Name / Alias */}
              <div>
                <label className="text-[10px] text-slate-400 font-medium">Model Display Name (Optional):</label>
                <input
                  type="text"
                  value={aiConfig.modelName || ''}
                  onChange={(e) => setAiConfig({ modelName: e.target.value })}
                  placeholder="e.g. Local Qwen 2.5 Coding Model"
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-slate-200 text-[11px] focus:outline-none focus:border-sky-500 mt-1"
                />
              </div>

              {/* Model Capabilities JSON Specs */}
              <div className="p-2 bg-slate-900/80 rounded border border-slate-800 space-y-1.5 mt-2">
                <span className="text-[10px] text-slate-300 font-medium block">Model Specs (JSON Config):</span>
                <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                  <div>
                    <label className="text-[9px] text-slate-400 block">Variant:</label>
                    <select
                      value={aiConfig.variant || 'high'}
                      onChange={(e) => setAiConfig({ variant: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5 text-sky-400 font-mono"
                    >
                      <option value="high">"high"</option>
                      <option value="standard">"standard"</option>
                      <option value="fast">"fast"</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-1 pt-3">
                    <input
                      type="checkbox"
                      id="cap_toolCalling"
                      checked={aiConfig.toolCalling ?? true}
                      onChange={(e) => setAiConfig({ toolCalling: e.target.checked })}
                      className="rounded border-slate-800 text-sky-500 accent-sky-500"
                    />
                    <label htmlFor="cap_toolCalling" className="text-[10px] text-slate-300 cursor-pointer">
                      toolCalling
                    </label>
                  </div>
                  <div className="flex items-center space-x-1 pt-3">
                    <input
                      type="checkbox"
                      id="cap_vision"
                      checked={aiConfig.vision ?? true}
                      onChange={(e) => setAiConfig({ vision: e.target.checked })}
                      className="rounded border-slate-800 text-sky-500 accent-sky-500"
                    />
                    <label htmlFor="cap_vision" className="text-[10px] text-slate-300 cursor-pointer">
                      vision
                    </label>
                  </div>
                </div>
              </div>

              {/* API Key */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] text-slate-400 font-medium">API Key:</label>
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="text-[9px] text-sky-400 hover:underline"
                  >
                    {showApiKey ? 'Hide Key' : 'Show Key'}
                  </button>
                </div>
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={aiConfig.apiKey || ''}
                  onChange={(e) => setAiConfig({ apiKey: e.target.value })}
                  placeholder="sk-... (Leave empty for local Ollama / LM Studio)"
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 font-mono text-slate-200 text-[11px] focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          )}

          {aiConfig.type === 'ollama' && (
            <div className="space-y-1.5 pt-1 border-t border-slate-800/60">
              <label className="text-[10px] text-slate-400">Ollama Native Base URL:</label>
              <input
                type="text"
                value={aiConfig.baseUrl || ''}
                onChange={(e) => setAiConfig({ baseUrl: e.target.value })}
                placeholder="http://localhost:11434"
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 font-mono text-slate-200 text-[11px]"
              />
              <label className="text-[10px] text-slate-400">Model Name / ID:</label>
              <input
                type="text"
                value={aiConfig.modelId || aiConfig.modelName || ''}
                onChange={(e) => setAiConfig({ modelId: e.target.value, modelName: e.target.value })}
                placeholder="llama3"
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 font-mono text-slate-200 text-[11px]"
              />
            </div>
          )}

          {/* Test Connection Result Feedback */}
          {testResult && (
            <div className={`p-2 rounded border text-[10px] leading-normal flex items-start space-x-1.5 ${
              testResult.success
                ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300'
                : 'bg-rose-950/80 border-rose-800 text-rose-300'
            }`}>
              {testResult.success ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0 mt-0.5" />
              )}
              <span className="break-words">{testResult.message}</span>
            </div>
          )}

          {/* Save & Test Settings Footer (Sticky Bottom) */}
          <div className="sticky bottom-0 bg-slate-950 pt-2.5 pb-1 border-t border-slate-800/90 flex items-center justify-between space-x-2 z-10 shadow-lg">
            <button
              onClick={handleTestConnection}
              disabled={isTesting}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700/80 rounded text-[11px] font-medium transition-colors flex items-center space-x-1 disabled:opacity-50"
            >
              {isTesting ? <Cpu className="w-3 h-3 animate-spin" /> : <Activity className="w-3 h-3" />}
              <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
            </button>

            <button
              onClick={handleSaveSettings}
              className="px-2.5 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded text-[11px] font-medium transition-colors shadow-sm"
            >
              {isSavedToast ? '✓ Saved!' : 'Save Settings'}
            </button>
          </div>
        </div>
      )}

      {/* Quick Action Chips (Hidden while Provider Settings is open) */}
      {!showConfig && (
        <div className="p-3 border-b border-slate-800 bg-slate-900/50">
          <p className="text-[11px] font-medium text-slate-400 mb-2">Prompt Presets:</p>
          <div className="flex flex-wrap gap-1.5">
            {presets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handlePresetClick(p.prompt)}
                disabled={isAiProcessing}
                className="text-[11px] bg-slate-800 hover:bg-sky-600/20 text-slate-300 hover:text-sky-300 border border-slate-700/60 rounded-full px-2.5 py-1 transition-all text-left truncate max-w-full disabled:opacity-50"
              >
                ✨ {p.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* AI Chat Thread Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3.5">
        {aiLogs.length === 0 ? (
          <div className="text-center py-10 text-xs text-slate-500 space-y-2">
            <Bot className="w-10 h-10 mx-auto text-sky-400/60" />
            <p className="font-medium text-slate-300">Voice & AI Chat Assistant</p>
            <p className="text-[11px] text-slate-400 px-4 leading-relaxed">
              Click 🎤 to speak to the LLM or type questions to co-author your book!
            </p>
          </div>
        ) : (
          aiLogs.map((log) => (
            <div key={log.id} className="space-y-2">
              {/* User Bubble */}
              <div className="flex justify-end">
                <div className="bg-sky-600/20 border border-sky-500/30 text-sky-200 rounded-2xl rounded-tr-none px-3.5 py-2 text-xs max-w-[85%] leading-relaxed shadow-sm">
                  <div className="text-[9px] text-sky-400 font-mono mb-0.5 text-right">{log.timestamp}</div>
                  <p className="whitespace-pre-wrap">{log.prompt}</p>
                </div>
              </div>

              {/* AI Assistant Card */}
              <div className="flex justify-start">
                <div className="bg-slate-950 border border-slate-800 text-slate-200 rounded-2xl rounded-tl-none p-3.5 text-xs max-w-[95%] space-y-2 shadow-md">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800/80 pb-1.5 mb-1.5">
                    <div className="flex items-center space-x-1.5 text-sky-400 font-medium">
                      <Bot className="w-3.5 h-3.5" />
                      <span>AI Assistant</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      {log.opsCount > 0 && (
                        <span className="flex items-center space-x-1 text-emerald-400 font-mono text-[9px] bg-emerald-950/60 border border-emerald-800/60 px-1.5 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Applied {log.opsCount} IR Ops</span>
                        </span>
                      )}
                      <button
                        onClick={() => handleCopyText(log.explanation, log.id)}
                        className="p-1 rounded text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                        title="Copy Message Text"
                      >
                        {copiedMessageId === log.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => speakResponse(log.explanation, log.id)}
                        className={`p-1 rounded transition-colors ${
                          speakingMessageId === log.id
                            ? 'bg-sky-500/20 text-sky-400 animate-pulse'
                            : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800'
                        }`}
                        title={speakingMessageId === log.id ? 'Stop Speaking' : 'Read Aloud'}
                      >
                        {speakingMessageId === log.id ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Response Text */}
                  <p className="whitespace-pre-wrap leading-relaxed text-slate-300 font-sans text-[11px] select-text">
                    {log.explanation}
                  </p>

                  {/* Quick Action Button: Insert into Document */}
                  {log.explanation && log.explanation.length > 20 && (
                    <div className="pt-1.5 border-t border-slate-900 flex justify-end">
                      <button
                        onClick={() => handleInsertTextToDoc(log.explanation)}
                        className="text-[10px] text-sky-400 hover:text-sky-300 hover:bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/50 transition-colors flex items-center space-x-1"
                        title="Add this text into current chapter"
                      >
                        <span>➕ Insert into Book</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Prompt Input Footer with Voice Dictation Button */}
      <div className="p-3 border-t border-slate-800 bg-slate-950">
        {isListening && (
          <div className="flex items-center justify-center space-x-1.5 text-[10px] text-red-400 animate-pulse mb-1 font-medium">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span>Listening... Speak into your microphone now!</span>
          </div>
        )}
        <div className="relative flex items-center">
          <textarea
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={isListening ? 'Listening to your voice...' : 'Speak or type to AI... e.g. "Draft chapter intro" or "Make layout compact"'}
            rows={2}
            className={`w-full bg-slate-900 border rounded-xl p-2.5 pr-20 text-xs text-slate-100 placeholder-slate-500 focus:outline-none resize-none transition-colors ${
              isListening ? 'border-red-500/80 bg-red-950/10' : 'border-slate-800 focus:border-sky-500'
            }`}
          />
          <div className="absolute right-2 bottom-2 flex items-center space-x-1">
            <button
              onClick={toggleVoiceInput}
              className={`p-1.5 rounded-lg border transition-all ${
                isListening
                  ? 'bg-red-600 text-white border-red-500 animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
              title={isListening ? 'Stop Voice Input' : 'Speak to AI (Voice Dictation)'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            <button
              onClick={handleSend}
              disabled={!aiPrompt.trim() || isAiProcessing}
              className="p-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white disabled:opacity-30 transition-all shadow-md"
              title="Send Message"
            >
              {isAiProcessing ? <Cpu className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
