export function roundScore(score: number): number {
  return Math.round(score * 10) / 10;
}
export function getScoreColor(score: number): string {
  if (score >= 7) return "text-green-500";
  if (score >= 5) return "text-yellow-500";
  return "text-red-500";
}
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
