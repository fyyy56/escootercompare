const REPAIR_COLORS = ['#ff5d6c', '#ff9f5b', '#ffc857', '#9bd86b', '#3ddc84'];

export function repairColor(n) {
  return REPAIR_COLORS[Math.max(0, Math.min(4, n - 1))];
}

export function tierClass(t) {
  return {
    entry: 'tier-entry',
    mid: 'tier-mid',
    high: 'tier-high',
    super: 'tier-super',
    hyper: 'tier-super',
  }[t] ?? 'tier-entry';
}

export function modelCountLabel(count) {
  if (count === 1) return '1 модель';
  if (count > 1 && count < 5) return `${count} модели`;
  return `${count} моделей`;
}
