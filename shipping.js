// shipping.js — cut plan optimizer
export function optimizeCuts({
  requiredInches,
  stickLengthsIn=[96,108],
  maxShipIn=96,
  preference='min_cost',
  oversizePenalty=35
}){
  const need = Math.ceil(Number(requiredInches||0));
  if(need<=0) return {cuts:[],totalSticks:0,oversizeSticks:0,notes:['nothing required']};

  const sticks = [...stickLengthsIn].sort((a,b)=>b-a);
  let best=null;
  for(const primary of sticks){
    let remaining = need;
    const plan=[];
    while(remaining>0){
      const useLen = primary;
      const pieceMax = Math.min(useLen, maxShipIn);
      let stickLeft = useLen;
      const pieces=[];
      while(stickLeft>0 && remaining>0){
        const piece = Math.min(pieceMax, remaining, stickLeft);
        pieces.push(piece);
        remaining -= piece;
        stickLeft  -= piece;
      }
      plan.push({stick:useLen, pieces});
    }
    const oversizeSticks = plan.filter(p=>p.stick>maxShipIn).length;
    const cost = plan.length + oversizePenalty*oversizeSticks;
    const score = preference==='min_sticks' ? plan.length : cost;
    if(!best || score < best.score){ best={score, plan, oversizeSticks}; }
  }
  const resultCuts = best.plan.map((p,idx)=> ({
    stick: p.stick,
    pieces: p.pieces,
    label: `Stick ${idx+1}: ${p.stick}" → cut ${p.pieces.map(x=>x+'\"').join(' + ')}`
  }));
  return {
    cuts: resultCuts,
    totalSticks: resultCuts.length,
    oversizeSticks: best.oversizeSticks,
    notes: [`Required inches (with waste): ${need}`, `Max piece to avoid surcharge: ${maxShipIn}"`]
  };
}
