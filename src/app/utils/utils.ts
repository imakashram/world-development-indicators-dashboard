export const abbreviateNumber = (value: any, decimals: number = 1): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return '—';
  }

  const abs = Math.abs(value);

  if (abs >= 1_000_000_000_000) { // Trillion
    return (value / 1_000_000_000_000).toFixed(decimals).replace(/\.0+$/, '') + 'T';
  } else if (abs >= 1_000_000_000) { // Billion
    return (value / 1_000_000_000).toFixed(decimals).replace(/\.0+$/, '') + 'B';
  } else if (abs >= 1_000_000) { // Million
    return (value / 1_000_000).toFixed(decimals).replace(/\.0+$/, '') + 'M';
  } else {
    return value.toLocaleString(); // No abbreviation
  }
}