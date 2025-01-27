export const randomIntFromInterval = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export const onlyDigit = (key: string) =>
  (key >= '0' && key <= '9') ||
  [
    '+',
    '(',
    ')',
    '-',
    'ArrowLeft',
    'ArrowRight',
    'Delete',
    'Backspace',
    'Enter',
  ].includes(key)
