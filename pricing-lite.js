// pricing-lite.js
export function getMarkupFor(ppft, bands){
  const x = Number(ppft||0);
  for(const b of bands){ if(x>=b.min_ppft && x<=b.max_ppft) return Number(b.markup); }
  return bands.length ? Number(bands[bands.length-1].markup) : 3.5;
}
export function glazingSqInCost(ratePerSqIn, widthIn, heightIn, sheet='32x40'){
  const area = Number(widthIn||0)*Number(heightIn||0);
  const sheetArea = sheet==='40x60' ? 40*60 : 32*40;
  const billArea = Math.max(area, sheetArea);
  return {area,billArea,cost:(Number(ratePerSqIn||0)*billArea)};
}
export function jobTotalsSliding({w,h,allow,ppft,bands,glzRate,glzSheet='32x40',mats=0,specials=0,labor=0,taxPct=8}){
  const ui = 2*(w+h+allow);
  const feet = ui/12;
  const markup = getMarkupFor(ppft, bands);
  const mouldWholesale = ppft*feet;
  const mouldRetail = mouldWholesale*markup;
  const glazing = glazingSqInCost(glzRate,w,h,glzSheet).cost;
  const base = mouldWholesale + glazing + mats + specials;
  const marked = base * markup;
  const subtotal = marked + labor;
  const tax = subtotal*(taxPct/100);
  const grand = subtotal + tax;
  return {ui,feet,markup,mouldWholesale,glazing,base,marked,subtotal,tax,grand};
}
