# Pricing Correction Guide

## Issue
All prices in constants.ts currently use POST-TAX values. They should use PRE-TAX values.

## Correct Pre-Tax Pricing

### Mumbai (Kwality House & Supreme HQ)
- **Studio Single Class**: ₹1,750 (currently using 1,838)
- **Studio 2 Week Unlimited**: ₹9,916.5 (currently using 10,412)
- **Studio 1 Month Unlimited**: ₹17,750 (currently using 18,638)
- **Studio 2 Month Unlimited**: ₹35,500 (estimate, currently using ~37,276)
- **Studio 3 Month Unlimited**: ₹50,750 (currently using 53,288)
- **Studio 6 Month Unlimited**: ₹99,750 (currently using 104,738)
- **Studio Annual Unlimited**: ₹192,500 (currently using 202,125)
- **Studio Private Class**: ₹5,000 (currently using 5,250)
- **Studio 10 Class Pack**: ₹15,000 (currently using 15,750)
- **Studio 12 Class Pack**: ₹15,050 (currently using 15,803)
- **Summer Bootcamp 6 Week**: ₹30,000 (currently using 31,500)

### Bengaluru (Kenkere House)
- **Studio Single Class**: ₹1,350 (currently using 1,418)
- **Studio 2 Week Unlimited**: ₹7,200 (currently using 7,560)
- **Studio 1 Month Unlimited**: ₹13,900 (currently using 14,595)
- **Studio 2 Month Unlimited**: ₹27,800 (estimate, currently using ~29,190)
- **Studio 3 Month Unlimited**: ₹40,200 (currently using 42,210)
- **Studio 6 Month Unlimited**: ₹78,300 (currently using 82,215)
- **Studio Annual Unlimited**: ₹148,800 (currently using 156,240)
- **Studio Private Class**: ₹3,925 (currently using 4,121)
- **Studio 10 Class Pack**: ₹12,000 (currently using 12,600)
- **Studio 12 Class Pack**: ₹12,500 (currently using 13,125)
- **Summer Bootcamp 6 Week**: ₹22,000 (currently using 23,100)

## Action Required
Replace all `priceMumbai`, `priceBengaluru`, `finalPriceMumbai`, and `finalPriceBengaluru` values throughout constants.ts with the pre-tax amounts listed above.

## Tax Calculation
All prices should add 5% tax to get the final price:
- Pre-tax × 1.05 = Post-tax (what customer actually pays)
