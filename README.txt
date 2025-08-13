HOW TO USE

1) Unzip into your existing site (same folder as index.html).
2) Open compare.html locally (python3 -m http.server 5173) or deploy to Netlify.
3) Use the Shipping Cutter:
   - Enter W/H and moulding width.
   - Choose FedEx max length (96" to avoid oversize, or 108").
   - Set available vendor stick lengths (e.g., 96,108,120).
   - Click "Compute" to get vendor cut instructions.
4) Pricing Compare:
   - Left = your spreadsheet fixed-markup model (moulding-only markup).
   - Right = sliding-scale model (our engine).
   - Tweak inputs and see deltas.
5) Integrate in app:
   import { optimizeCuts } from './shipping.js';
   const plan = optimizeCuts({ requiredInches, stickLengthsIn:[96,108], maxShipIn:96, oversizePenalty:35 });
   // plan.cuts[i].label → "Stick N: 96" → cut 48" + 48""
