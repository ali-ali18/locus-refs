const PALETTE = [
  "#7C6AF7", 
  "#F7726A", 
  "#4AB8A0", 
  "#F5A623", 
  "#4A90D9", 
  "#E87BD6", 
  "#5DB85D", 
  "#E8875A",
];

export function getCollabColor(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash << 5) - hash + userId.charCodeAt(i);
    hash |= 0;
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}
""