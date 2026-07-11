import { planRetirement, requiredCapital, accumulate, monthlyRate } from './pension-engine.mjs';
let pass=0, fail=0;
const approx=(a,b,eps=1e-6)=>Math.abs(a-b)<=eps*Math.max(1,Math.abs(b));
function t(name, cond){ if(cond){pass++;} else {fail++; console.log('FAIL:',name);} }

// determinism
const inp={ start:20000, withdrawalMonth:2000, decRatePct:2.0, decYears:25, accRatePct:3.0, dynamikPct:1.0, accYears:30, freq:'m' };
const a=planRetirement(inp), b=planRetirement(inp);
t('deterministisch (identische Outputs)', a.requiredSavings===b.requiredSavings && a.targetCapital===b.targetCapital);

// PV annuity sanity: 2000/mo, 2%/yr, 25y -> should be ~ 6-figure and > simple sum discounted
const need=requiredCapital({withdrawalMonth:2000, annualRatePct:2.0, years:25});
t('Barwert plausibel (< ungezinste Summe 600k)', need>0 && need<2000*12*25);
t('Barwert plausibel (> 400k)', need>400000);

// solved savings actually reaches target
const reached=accumulate({start:inp.start, monthly:a.requiredSavings, annualRatePct:inp.accRatePct, dynamikPct:inp.dynamikPct, years:inp.accYears, freq:'m'}).endCapital;
t('gelöste Sparrate erreicht Zielkapital', approx(reached, a.targetCapital, 1e-4));

// monthlyRate correctness
t('monthlyRate(0)=0', monthlyRate(0)===0);
t('monthlyRate kompoundiert auf Jahr', approx(Math.pow(1+monthlyRate(3),12), 1.03, 1e-9));

// zero savings edge: if target already covered
const z=planRetirement({...inp, start:1e9});
t('Startkapital deckt Ziel -> Sparrate 0', z.requiredSavings===0);

// series peaks at retirement and ends near 0
const peakIdx=Math.round(inp.accYears);
const capAtPeak=a.series.find(p=>Math.abs(p.t-inp.accYears)<0.01)?.cap;
t('Kapital-Peak bei Rentenbeginn > 0', capAtPeak>0);
t('Kapital am Ende ~ 0 (< 1 CHF*Rate)', a.series[a.series.length-1].cap < 1000);

console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
console.log('Beispiel:', JSON.stringify({ benoetigteSparrate: Math.round(a.requiredSavings), zielkapital: Math.round(a.targetCapital) }));
process.exit(fail?1:0);
