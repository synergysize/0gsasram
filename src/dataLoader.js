// dataLoader.js - Load and process wallet data from CSV files using fetch()

const parseCSV = (csvText) => {
  const lines = csvText.trim().split('\n');
  lines[0] = lines[0].replace('\r', '').replace('\uFEFF', '');
  const headers = lines[0].split(',');

  return lines.slice(1).map(line => {
    const values = line.split(',');
    const entry = {};
    headers.forEach((header, index) => {
      if (header === 'Account') {
        entry.address = values[index];
      } else if (header === 'Quantity' || header === 'Quantity(GOAT)') {
        entry.amount = parseFloat(values[index]);
      }
    });
    return entry;
  });
};

const FARTCOIN_DATA = `Account,Quantity(GOAT)
u6PJ8DtQuPFnfmwHbGFULQ4u4EgjDiyYKjVEsynXq2w,53353226.72
9SLPTL41SPsYkgdsMzdfJsxymEANKr5bYoBsQzJyKpKS,19700515.36`;

const GOATTOKEN_DATA = `Account,Quantity
8Mm46CsqxiyAputDUp2cXHg41HE3BfynTeMBDwzrMZQH,112378114.33
hTvwKr1RvQdPS5xiWfXM2UZYuF55Ei8zzsuB7e58feu,109758331.88`;

// Use fetch() instead of XHR
const loadCSVFile = async (filePath) => {
  try {
    const response = await fetch(filePath);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.text();
  } catch (err) {
    console.error(`Error loading ${filePath}:`, err);
    return null;
  }
};

export let fartcoinHolders = [];
export let goatTokenHolders = [];
export let sharedHolders = [];

export const initializeData = async () => {
  let fartcoinCSV = await loadCSVFile('/fartcoin.csv');
  let goatTokenCSV = await loadCSVFile('/goattoken.csv');

  if (!fartcoinCSV || !goatTokenCSV) {
    console.warn('Falling back to embedded CSVs');
    fartcoinCSV = FARTCOIN_DATA;
    goatTokenCSV = GOATTOKEN_DATA;
  } else {
    console.log('✅ Fetched wallet CSVs');
  }

  let fartcoinData = parseCSV(fartcoinCSV);
  let goatTokenData = parseCSV(goatTokenCSV);

  fartcoinData = fartcoinData.filter(e => e.address && !isNaN(e.amount)).map(e => ({ ...e, address: e.address.toLowerCase() }));
  goatTokenData = goatTokenData.filter(e => e.address && !isNaN(e.amount)).map(e => ({ ...e, address: e.address.toLowerCase() }));

  fartcoinData.sort((a, b) => b.amount - a.amount);
  goatTokenData.sort((a, b) => b.amount - a.amount);

  const fartMap = new Map();
  fartcoinData.forEach(e => fartMap.set(e.address, e.amount));

  sharedHolders = [];
  goatTokenData.forEach(e => {
    if (fartMap.has(e.address)) {
      sharedHolders.push({
        address: e.address,
        fartAmount: fartMap.get(e.address),
        goatAmount: e.amount,
      });
    }
  });

  sharedHolders.sort((a, b) => (b.fartAmount + b.goatAmount) - (a.fartAmount + a.goatAmount));

  fartcoinHolders = fartcoinData;
  goatTokenHolders = goatTokenData;

  console.log(`💨 ${fartcoinHolders.length} fart holders, 🐐 ${goatTokenHolders.length} goat holders`);
  console.log(`🤝 ${sharedHolders.length} shared holders`);

  return { fartcoinHolders, goatTokenHolders, sharedHolders };
};

export default {
  initializeData,
  fartcoinHolders,
  goatTokenHolders,
  sharedHolders
};
