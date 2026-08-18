import React, { useState } from 'react';
import { X, Table, FileSpreadsheet } from 'lucide-react';

interface TableImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (columns: string[], rows: string[][]) => void;
}

export const TableImportModal: React.FC<TableImportModalProps> = ({ isOpen, onClose, onImport }) => {
  const [pasteData, setPasteData] = useState('');

  if (!isOpen) return null;

  const handleParse = () => {
    if (!pasteData.trim()) return;

    const lines = pasteData.trim().split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) return;

    // Detect delimiter: tab, comma, or pipe |
    let delimiter = '\t';
    if (lines[0].includes('\t')) delimiter = '\t';
    else if (lines[0].includes('|')) delimiter = '|';
    else if (lines[0].includes(',')) delimiter = ',';

    const parsedMatrix = lines.map((line) => {
      let cells = line.split(delimiter).map((c) => c.trim());
      // Handle markdown table pipes if needed
      if (delimiter === '|') {
        cells = cells.filter((c) => c !== '');
      }
      return cells;
    });

    if (parsedMatrix.length > 0) {
      const columns = parsedMatrix[0];
      const rows = parsedMatrix.slice(1).filter((r) => r.length > 0 && !r.every((cell) => cell.includes('---')));
      onImport(columns, rows);
      setPasteData('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2 text-slate-100 font-semibold text-sm">
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Import Table Data (Excel / CSV / TSV / Markdown)</span>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-400 leading-normal">
          Paste tabular data copied from Excel, Google Sheets, CSV, TSV, or Markdown tables:
        </p>

        <textarea
          value={pasteData}
          onChange={(e) => setPasteData(e.target.value)}
          placeholder={`Article\tRight\tDescription\n14\tEquality\tEquality before law\n15\tNon-discrimination\tProhibition of discrimination`}
          rows={6}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
        />

        <div className="flex space-x-2 border-t border-slate-800 pt-3">
          <button
            onClick={handleParse}
            disabled={!pasteData.trim()}
            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-2 rounded-xl flex items-center justify-center space-x-2 shadow-lg disabled:opacity-40 transition-all"
          >
            <Table className="w-4 h-4" />
            <span>Import & Replace Table</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs py-2 rounded-xl transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
