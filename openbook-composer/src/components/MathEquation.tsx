import React, { useEffect, useRef } from 'react';
import katex from 'katex';

interface MathEquationProps {
  expression: string;
  className?: string;
}

/**
 * Smart Normalizer: Converts plain math expressions like "(A+B)^5 / (A-B)" or "a/b" to valid LaTeX format.
 */
export function normalizeMathExpression(expr: string): string {
  if (!expr) return '';
  let normalized = expr.trim();

  // If already contains LaTeX commands like \frac, \sqrt, etc., return as is
  if (normalized.includes('\\')) {
    return normalized;
  }

  // Convert simple fraction division: e.g. "(A+B)^5 / (A-B)" or "(A+B)^5/A-B" -> "\frac{(A+B)^5}{A-B}"
  const fracRegex = /^\s*(?:\(([^()]+)\)|([a-zA-Z0-9^+*-]+))\s*\/\s*(?:\(([^()]+)\)|([a-zA-Z0-9^+*-]+))\s*$/;
  const match = normalized.match(fracRegex);
  if (match) {
    const num = match[1] || match[2];
    const den = match[3] || match[4];
    return `\\frac{${num}}{${den}}`;
  }

  // If contains '/' anywhere, try simple fraction replacement
  if (normalized.includes('/')) {
    const parts = normalized.split('/');
    if (parts.length === 2) {
      return `\\frac{${parts[0].trim()}}{${parts[1].trim()}}`;
    }
  }

  return normalized;
}

export const MathEquation: React.FC<MathEquationProps> = ({ expression, className = '' }) => {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const latexExpr = normalizeMathExpression(expression);
      try {
        katex.render(latexExpr, containerRef.current, {
          displayMode: true,
          throwOnError: false,
        });
      } catch {
        containerRef.current.textContent = expression;
      }
    }
  }, [expression]);

  return <span ref={containerRef} className={`inline-block my-1 text-slate-900 ${className}`} />;
};
