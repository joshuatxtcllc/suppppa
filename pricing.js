// pricing.js — Jay's Frames
// Sliding PPFT→markup + glazing pricing + totals
export function getMarkupFor(ppft, bands){
  const x = Number(ppft||0);
  for(const b of bands){ if(x>=b.min_ppft && x<=b.max_ppft) return Number(b.markup); }
  return bands.length ? Number(bands[bands.length-1].markup) : 3.5;
}

export function glazingSqInCost(ratePerSqIn, widthIn, heightIn, sheet='32x40'){
  const area = Number(widthIn||0)*Number(heightIn||0);
  const sheetArea = sheet==='40x60' ? 40*60 : 32*40;
  const billArea = Math.max(area, sheetArea);
  return { area, billArea, cost: Number(ratePerSqIn||0) * billArea };
}

export function glazingUiCost(ui, bands){
  // bands: [{ui_min, ui_max, price}, ...]
  const x = Number(ui||0);
  for(const b of (bands||[])){
    if(x>=Number(b.ui_min) && x<=Number(b.ui_max)) return { price: Number(b.price), band: b };
  }
  return { price: 0, band: null };
}

export function mouldingCost(ppft_wholesale, feet, bands, markupScope='all'){
  const m = getMarkupFor(ppft_wholesale||0, bands);
  const wh = Number(ppft_wholesale||0) * Number(feet||0);
  // Retail line if markup applies only to moulding
  return { markup:m, wholesale:wh, retailLine: wh * m };
}

export function jobTotals(input){
  // input = {
  //   w,h,allow, taxPct, labor,
  //   mouldings: [{ppft, feet}], // up to 3
  //   matsTotal: number,
  //   specialsTotal: number,
  //   glazing: { mode:'sqin', ratePerSqIn, product, sheet } OR { mode:'ui', uiBands: [...] }
  //   bands: [{min_ppft,max_ppft,markup}]
  //   markupScope: 'all' | 'moulding'
  // }
  const w = Number(input.w||0), h = Number(input.h||0), a = Number(input.allow||0);
  const ui = 2*(w+h+a);
  const feet = ui/12;

  // Mouldings
  let mouldWh = 0, mouldRetail = 0;
  const refPpft = input.mouldings && input.mouldings.length ? Number(input.mouldings[0].ppft||0) : 0;
  const markup = getMarkupFor(refPpft, input.bands||[]);

  (input.mouldings||[]).forEach(m => {
    const wh = Number(m.ppft||0)*feet;
    mouldWh += wh;
    mouldRetail += wh * markup;
  });

  // Glazing
  let glazingCost = 0;
  if(input.glazing?.mode === 'sqin'){
    const g = glazingSqInCost(input.glazing.ratePerSqIn, w, h, input.glazing.sheet||'32x40');
    glazingCost = g.cost;
  } else if(input.glazing?.mode === 'ui'){
    const res = glazingUiCost(w+h, input.glazing.uiBands||[]); // UI = W+H
    glazingCost = res.price;
  }

  const mats = Number(input.matsTotal||0);
  const specs = Number(input.specialsTotal||0);
  const base = mouldWh + glazingCost + mats + specs;

  const marked = (input.markupScope==='moulding')
    ? (mouldRetail + glazingCost + mats + specs)
    : (base * markup);

  const labor = Number(input.labor||0);
  const subtotal = marked + labor;
  const tax = subtotal * (Number(input.taxPct||0)/100);
  const grand = subtotal + tax;

  return {
    ui, feet, markup,
    mouldWholesale: mouldWh, glazingCost, mats, specials: specs,
    base, marked, labor, subtotal, tax, grand
  };
}
