export interface Trade {
  riskPercentage: string;
  pnl: string;
  isWin: boolean;
  isLoss: boolean;
}

export interface JournalEntry {
  date: string;
  plan: string;
  trades: Trade[];
  levelsInterested: string;
  tradingOutcomeReview: string;
}