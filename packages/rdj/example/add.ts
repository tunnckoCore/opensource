function bar(ok: number) {
  return ok;
}
export default function add(x: number, y: number): number {
  return x + y + bar(12);
}
