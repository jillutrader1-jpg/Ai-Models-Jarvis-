export interface TradingSignal {
  symbol: string;
  action: "BUY" | "SELL" | "HOLD";
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  confidence: number;
  timeframe: string;
  reason_bn: string;
  riskReward: string;
  rsi?: number;
  macd?: string;
  trend: "BULLISH" | "BEARISH" | "SIDEWAYS";
}

export interface ExecutedTrade {
  id: string;
  symbol: string;
  action: "BUY" | "SELL";
  price: number;
  amount: number;
  lotSize: number;
  stopLoss: number;
  takeProfit: number;
  timestamp: string;
  status: "OPEN" | "CLOSED" | "TP_HIT" | "SL_HIT";
  pnl?: number;
  pnlPercent?: number;
  reason_bn: string;
}

export interface TradingState {
  currentSymbol: string;
  lastPrice: number;
  change24h: number;
  signals: TradingSignal[];
  activeSignal: TradingSignal | null;
  riskPercentage: number;
  capital: number;
  autoListen: boolean;
  autoTradingEnabled: boolean;
  executedTrades: ExecutedTrade[];
  totalProfit: number;
  winRate: number;
}

export interface PhoneState {
  battery: number;
  isCharging: boolean;
  torch: boolean;
  volume: number;
  wifi: boolean;
  bluetooth: boolean;
  activeApp: string;
  cameraOpen: boolean;
  callingContact: string | null;
  lastPhotoUrl?: string;
  smsList: Array<{ id: string; sender: string; message: string; time: string }>;
  tradingState?: TradingState;
}

export type ActionType =
  | "TOGGLE_TORCH"
  | "MAKE_CALL"
  | "SEND_SMS"
  | "OPEN_APP"
  | "TAKE_PHOTO"
  | "SET_VOLUME"
  | "CHECK_BATTERY"
  | "TOGGLE_WIFI"
  | "PLAY_MEDIA"
  | "TRADING_ANALYSIS"
  | "TRADING_SIGNAL"
  | "EXECUTE_AUTO_TRADE"
  | "TOGGLE_AUTO_TRADING"
  | "TRADING_RISK"
  | "OPEN_TRADING_APP"
  | "GENERAL_CONVERSATION";

export interface JarvisCommandResult {
  response_bn: string;
  action_type: ActionType;
  parameters: Record<string, any>;
  termux_command: string;
  adb_command: string;
  trading_signal?: TradingSignal;
  executed_trade?: ExecutedTrade;
}

export interface JarvisLog {
  id: string;
  timestamp: string;
  type: "user" | "jarvis" | "command" | "error";
  text: string;
  meta?: {
    termux?: string;
    adb?: string;
    action?: string;
  };
}
