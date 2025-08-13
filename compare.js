// compare.js
import { jobTotalsSliding } from './pricing-lite.js';

// Spreadsheet-style pricing using your pasted formulas (non-sliding model)
// inches needed = twoHeights + twoWidths with waste: (2H + 4*MW + 1) + (2W + 4*MW + 1)
export function spreadsheetTotals({
  widthIn, heightIn, mouldingWidthIn=0, allowanceIn=0,
  ppft=3.70, markupFixed=3.5,
  glzRate=0.06, glzSheet='32x40',
  mats=0, specials=0, labor=0, taxPct=8
}){
  const H = Number(heightIn||0), W = Number(widthIn||0), MW = Number(mouldingWidthIn||0);
  const twoHeights = (H*2)+(MW*4)+1;
  const twoWidths  = (W*2)+(MW*4)+1;
  const totalInches = twoHeights + twoWidths;
  const feet = totalInches / 12.0;

  const mouldWholesale = ppft * feet;
  const mouldRetail = mouldWholesale * markupFixed;

  const area = H*W;
  const sheetArea = glzSheet==='40x60' ? 40*60 : 32*40;
  const billArea = Math.max(area, sheetArea);
  const glazing = glzRate * billArea;

  const base = mouldWholesale + glazing + mats + specials;
  // Spreadsheet model: markup applied to moulding only (per your note)
  const marked = mouldRetail + glazing + mats + specials;
  const subtotal = marked + labor;
  const tax = subtotal*(taxPct/100);
  const grand = subtotal + tax;

  return {
    details: {twoHeights, twoWidths, feet},
    mouldWholesale, mouldRetail, glazing, base, marked, subtotal, tax, grand
  };
}

export function runCompare(input){
  const bands=input.bands || [
    {min_ppft:0,max_ppft:0.99,markup:4.6},
    {min_ppft:1.0,max_ppft:1.49,markup:4.4},
    {min_ppft:1.5,max_ppft:1.99,markup:4.3},
    {min_ppft:2.0,max_ppft:2.99,markup:4.1},
    {min_ppft:3.0,max_ppft:3.99,markup:3.9},
    {min_ppft:4.0,max_ppft:4.99,markup:3.8},
    {min_ppft:5.0,max_ppft:6.99,markup:3.6},
    {min_ppft:7.0,max_ppft:8.99,markup:3.4},
    {min_ppft:9.0,max_ppft:9.99,markup:3.2},
    {min_ppft:10.0,max_ppft:9999.99,markup:3.1},
  ];
  const sheet = spreadsheetTotals(input);
  const sliding = jobTotalsSliding({
    w:input.widthIn,h:input.heightIn,allow:input.allowanceIn,
    ppft:input.ppft,bands,glzRate:input.glzRate,glzSheet:input.glzSheet,
    mats:input.mats,specials:input.specials,labor:input.labor,taxPct:input.taxPct
  });
  return {sheet, sliding};
}
