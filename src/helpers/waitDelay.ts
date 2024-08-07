export function waitDelay(delay: number) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}