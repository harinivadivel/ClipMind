import { jsPDF } from 'jspdf';

/**
 * Shared helpers for generating downloadable PDF reports with the client-side
 * jsPDF library. Follows the same pattern already used in LearningMaterials.jsx.
 */

// Create a fresh A4 document plus layout constants used by the report builders.
export function createReportDoc() {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  return { doc, pageWidth, pageHeight, margin, contentWidth };
}

/**
 * Split `text` into tokens, flagging every (case-insensitive) occurrence of
 * `query` with `hl: true` so the PDF renderer can highlight it. When the query
 * is empty the whole text is returned as a single non-highlighted token.
 */
export function tokenizeQuery(text, query) {
  const clean = typeof text === 'string' ? text : '';
  if (!clean) return [];
  if (!query || !query.trim()) return [{ text: clean, hl: false }];

  const q = query.trim().toLowerCase();
  const lower = clean.toLowerCase();
  const tokens = [];
  let lastEnd = 0;
  let pos = 0;

  while (pos < lower.length) {
    const idx = lower.indexOf(q, pos);
    if (idx === -1) break;
    if (idx > lastEnd) tokens.push({ text: clean.slice(lastEnd, idx), hl: false });
    tokens.push({ text: clean.slice(idx, idx + q.length), hl: true });
    lastEnd = idx + q.length;
    pos = idx + q.length;
  }

  if (lastEnd < clean.length) tokens.push({ text: clean.slice(lastEnd), hl: false });
  return tokens;
}

// Flatten highlight tokens into word-sized chunks (space is handled at layout time).
function splitTokensToWords(tokens) {
  const words = [];
  tokens.forEach((token) => {
    const parts = String(token.text).split(/\s+/).filter((p) => p !== '');
    parts.forEach((part) => words.push({ text: part, hl: !!token.hl }));
  });
  return words;
}

/**
 * Render a paragraph with optional per-term highlighting, wrapping words and
 * adding pages as needed.
 *
 * options:
 *   x, y          - top-left start position (y is the baseline of the first line)
 *   maxWidth      - content width for wrapping
 *   fontSize      - font size in pt (default 11)
 *   lineHeight    - vertical advance between lines (default 6)
 *   baseColor     - [r, g, b] array for normal text (default [80, 80, 80])
 *   highlightBg   - [r, g, b] array for the highlight fill behind matches (default [34, 197, 94])
 *   highlightText - [r, g, b] array for highlighted text (default [255, 255, 255])
 *   pageHeight    - page height used to decide page breaks
 *   margin        - bottom margin (default 20)
 *
 * Returns the final baseline `y` after the last rendered line.
 */
export function addRichText(doc, text, query, options = {}) {
  const {
    x,
    y,
    maxWidth,
    fontSize = 11,
    lineHeight = 6,
    baseColor = [80, 80, 80],
    highlightBg = [34, 197, 94],
    highlightText = [255, 255, 255],
    pageHeight,
    margin = 20,
  } = options;

  const ph = pageHeight || doc.internal.pageSize.getHeight();
  const words = splitTokensToWords(tokenizeQuery(text, query));

  doc.setFontSize(fontSize);
  const spaceWidth = doc.getTextWidth(' ');
  let cursorX = x;
  let cursorY = y;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const isLast = i === words.length - 1;

    // Measure with the correct font for this word.
    doc.setFont(undefined, word.hl ? 'bold' : 'normal');
    const w = doc.getTextWidth(word.text);
    const total = w + (isLast ? 0 : spaceWidth * 1.2);

    // Wrap to the next line, adding a page when we run out of room.
    if (total > 0 && cursorX !== x && cursorX + total > maxWidth) {
      cursorX = x;
      cursorY += lineHeight;
      if (cursorY > ph - margin) {
        doc.addPage();
        cursorX = x;
        cursorY = margin;
      }
    }

    if (word.hl) {
      doc.setFillColor(highlightBg[0], highlightBg[1], highlightBg[2]);
      doc.roundedRect(cursorX - 0.5, cursorY - 4, w + 1.5, lineHeight - 1, 1, 1, 'F');
      doc.setFont(undefined, 'bold');
      doc.setTextColor(highlightText[0], highlightText[1], highlightText[2]);
    } else {
      doc.setFont(undefined, 'normal');
      doc.setTextColor(baseColor[0], baseColor[1], baseColor[2]);
    }

    doc.text(word.text, cursorX, cursorY);
    cursorX += total;
  }

  return cursorY;
}
