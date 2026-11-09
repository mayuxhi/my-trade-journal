import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, Percent, ShieldAlert, Plus, 
  Download, Filter, RefreshCw, BarChart2, BookOpen, Calculator, LayoutDashboard,
  CheckCircle2, XCircle, ChevronRight, AlertTriangle, ArrowUpRight, ArrowDownRight, Trash2
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const INITIAL_TRADES = [
  { id: '1', date: '2026-11-01', market: 'Forex', pair: 'EUR/USD', type: 'BUY', entry: 1.0850, exit: 1.0920, size: 2.0, pnl: 1400, win: true, rr: 2.3, strategy: 'Breakout', note: 'Strong momentum after NFP data release' },
  { id: '2', date: '2026-11-03', market: 'Crypto', pair: 'BTC/USDT', type: 'LONG', entry: 68500, exit: 67200, size: 0.5, pnl: -650, win: false, rr: 1.5, strategy: 'Support Bounce', note: 'Failed support level due to high volume dump' },
  { id: '3', date: '2026-11-05', market: 'Stocks', pair: 'NVDA', type: 'BUY', entry: 135.00, exit: 142.50, size: 100, pnl: 750, win: true, rr: 3.0, strategy: 'Trend Following', note: 'Earnings breakout continuation pattern' },
  { id: '4', date: '2026-11-07', market: 'Indices', pair: 'NAS100', type: 'SELL', entry: 20400, exit: 20150, size: 1.5, pnl: 375, win: true, rr: 1.8, strategy: 'Supply Zone', note: 'Rejection at key resistance zone' },
  { id: '5', date: '2026-11-08', market: 'Commodities', pair: 'XAU/USD', type: 'SELL', entry: 2680, exit: 2700, size: 0.8, pnl: -1600, win: false, rr: 2.0, strategy: 'Mean Reversion', note: 'Stopped out during FOMC volatility' },
];

export default function App() {
  const [trades, setTrades] = useState(INITIAL_TRADES);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [filterMarket, setFilterMarket] = useState('ALL');
  
  // Risk Calculator States
  const [accountBalance, setAccountBalance] = useState(10000);
  const [riskPercent, setRiskPercent] = useState(1);
  const [entryPrice, setEntryPrice] = useState(100);
  const [stopLossPrice, setStopLossPrice] = useState(95);

  // New Trade Form State
  const [newTrade, setNewTrade] = useState({
    date: new Date().toISOString().split('T')[0],
    market: 'Forex',
    pair: '',
    type: 'BUY',
    entry: '',
    exit: '',
    size: '',
    pnl: '',
    rr: '',
    strategy: 'Breakout',
    note: ''
  });

  // Analytics Calculations
  const metrics = useMemo(() => {
    const totalTrades = trades.length;
    if (totalTrades === 0) return { netPnl: 0, winRate: 0, profitFactor: 0, wins: 0, losses: 0 };
    
    const wins = trades.filter(t => t.pnl > 0);
    const losses = trades.filter(t => t.pnl < 0);
    const netPnl = trades.reduce((acc, t) => acc + Number(t.pnl), 0);
    const winRate = ((wins.length / totalTrades) * 100).toFixed(1);
    
    const grossProfit = wins.reduce((acc, t) => acc + Number(t.pnl), 0);
    const grossLoss = Math.abs(losses.reduce((acc, t) => acc + Number(t.pnl), 0));
    const profitFactor = grossLoss === 0 ? grossProfit.toFixed(2) : (grossProfit / grossLoss).toFixed(2);

    return { netPnl, winRate, profitFactor, wins: wins.length, losses: losses.length, total: totalTrades };
  }, [trades]);

  // Chart Data
  const chartData = useMemo(() => {
    let runningPnl = 0;
    return trades.slice().reverse().map((t, idx) => {
      runningPnl += Number(t.pnl);
      return {
        name: `Trade ${idx + 1}`,
        pnl: runningPnl,
        date: t.date
      };
    });
  }, [trades]);

  // Position Calculator Math
  const riskAmount = (accountBalance * (riskPercent / 100));
  const priceRisk = Math.abs(entryPrice - stopLossPrice);
  const calculatedPositionSize = priceRisk > 0 ? (riskAmount / priceRisk).toFixed(2) : 0;

  const handleAddTrade = (e) => {
    e.preventDefault();
    const pnlVal = Number(newTrade.pnl);
    const tradeItem = {
      ...newTrade,
      id: Date.now().toString(),
      entry: Number(newTrade.entry),
      exit: Number(newTrade.exit),
      size: Number(newTrade.size),
      pnl: pnlVal,
      rr: Number(newTrade.rr),
      win: pnlVal > 0
    };
    setTrades([tradeItem, ...trades]);
    setNewTrade({
      date: new Date().toISOString().split('T')[0],
      market: 'Forex',
      pair: '',
      type: 'BUY',
      entry: '',
      exit: '',
      size: '',
      pnl: '',
      rr: '',
      strategy: 'Breakout',
      note: ''
    });
    setActiveTab('journal');
  };

  const handleDeleteTrade = (id) => {
    setTrades(trades.filter(t => t.id !== id));
  };

  const filteredTrades = useMemo(() => {
    if (filterMarket === 'ALL') return trades;
    return trades.filter(t => t.market.toLowerCase() === filterMarket.toLowerCase());
  }, [trades, filterMarket]);

  const exportCSV = () => {
    const headers = ["ID,Date,Market,Pair,Type,Entry,Exit,Size,PnL,Win,RR,Strategy,Note\n"];
    const rows = trades.map(t => `${t.id},${t.date},${t.market},${t.pair},${t.type},${t.entry},${t.exit},${t.size},${t.pnl},${t.win},${t.rr},${t.strategy},"${t.note}"`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trade-journal-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-gray-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#131926] border-b md:border-b-0 md:border-r border-gray-800 p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-[#10b981] items-center gap-2 mb-8 px-2">
            <BarChart2 className="w-8 h-8 text-emerald-500" />
            <span className="font-bold text-xl tracking-wider text-white">TRADE<span className="text-emerald-500">PRO</span></span>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === 'dashboard' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'}`}
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </button>

            <button
              onClick={() => setActiveTab('journal')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === 'journal' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'}`}
            >
              <BookOpen className="w-5 h-5" />
              Trade Journal
            </button>

            <button
              onClick={() => setActiveTab('calculator')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === 'calculator' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'}`}
            >
              <Calculator className="w-5 h-5" />
              Risk Calculator
            </button>
          </nav>
        </div>

        <div className="pt-4 border-t border-gray-800 text-xs text-gray-500 text-center">
          Dark Professional v1.0
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {/* Top Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white capitalize">{activeTab}</h1>
            <p className="text-gray-400 text-sm">All Markets Trading Performance & Journaling System</p>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={exportCSV}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-200 px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 transition"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
            <button 
              onClick={() => setActiveTab('newTrade')}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-gray-950 font-semibold px-4 py-2 rounded-lg text-sm transition"
            >
              <Plus className="w-4 h-4" /> New Trade
            </button>
          </div>
        </header>

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#131926] p-5 rounded-xl border border-gray-800">
                <div className="flex justify-between items-center text-gray-400 mb-2 text-sm">
                  <span>Net P&L</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className={`text-2xl font-bold ${metrics.netPnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {metrics.netPnl >= 0 ? '+' : ''}${metrics.netPnl.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  {metrics.netPnl >= 0 ? <ArrowUpRight className="w-3 h-3 text-emerald-400" /> : <ArrowDownRight className="w-3 h-3 text-red-400" />}
                  Total accumulated PnL
                </div>
              </div>

              <div className="bg-[#131926] p-5 rounded-xl border border-gray-800">
                <div className="flex justify-between items-center text-gray-400 mb-2 text-sm">
                  <span>Win Rate</span>
                  <Percent className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-white">{metrics.winRate}%</div>
                <div className="text-xs text-gray-500 mt-2">
                  {metrics.wins} Wins / {metrics.losses} Losses ({metrics.total} Trades)
                </div>
              </div>

              <div className="bg-[#131926] p-5 rounded-xl border border-gray-800">
                <div className="flex justify-between items-center text-gray-400 mb-2 text-sm">
                  <span>Profit Factor</span>
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-bold text-white">{metrics.profitFactor}</div>
                <div className="text-xs text-gray-500 mt-2">
                  Gross Profit / Gross Loss
                </div>
              </div>

              <div className="bg-[#131926] p-5 rounded-xl border border-gray-800">
                <div className="flex justify-between items-center text-gray-400 mb-2 text-sm">
                  <span>Max Drawdown Risk</span>
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-bold text-amber-400">2.4%</div>
                <div className="text-xs text-gray-500 mt-2">
                  Within safe limits (&lt; 5.0%)
                </div>
              </div>
            </div>

            {/* Performance Chart */}
            <div className="bg-[#131926] p-6 rounded-xl border border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-4">Equity Curve / Cumulative Performance</h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="pnlGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1c2536', borderColor: '#374151', color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="pnl" stroke="#10b981" fillOpacity={1} fill="url(#pnlGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* JOURNAL TAB */}
        {activeTab === 'journal' && (
          <div className="space-y-4">
            {/* Market Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {['ALL', 'Forex', 'Crypto', 'Stocks', 'Indices', 'Commodities'].map((m) => (
                <button
                  key={m}
                  onClick={() => setFilterMarket(m)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition ${filterMarket === m ? 'bg-emerald-500 text-gray-950' : 'bg-[#131926] text-gray-400 border border-gray-800 hover:text-white'}`}
                >
                  {m}
                </button>
              ))}
            </div>

            {/* Trades Table */}
            <div className="bg-[#131926] rounded-xl border border-gray-800 overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-300">
                <thead className="bg-[#1c2536] text-xs uppercase text-gray-400">
                  <tr>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Market</th>
                    <th className="px-4 py-3">Pair/Symbol</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Entry</th>
                    <th className="px-4 py-3">Exit</th>
                    <th className="px-4 py-3">R:R</th>
                    <th className="px-4 py-3">P&L ($)</th>
                    <th className="px-4 py-3">Strategy</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredTrades.map((t) => (
                    <tr key={t.id} className="hover:bg-[#1a2233] transition">
                      <td className="px-4 py-3 whitespace-nowrap text-gray-400">{t.date}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 py-1 rounded bg-gray-800 text-xs text-gray-300 border border-gray-700">{t.market}</span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-white whitespace-nowrap">{t.pair}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${t.type === 'BUY' || t.type === 'LONG' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                          {t.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">${t.entry}</td>
                      <td className="px-4 py-3 whitespace-nowrap">${t.exit}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{t.rr} R</td>
                      <td className={`px-4 py-3 font-bold whitespace-nowrap ${t.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {t.pnl >= 0 ? `+$${t.pnl}` : `-$${Math.abs(t.pnl)}`}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-400">{t.strategy}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button 
                          onClick={() => handleDeleteTrade(t.id)}
                          className="text-gray-500 hover:text-red-400 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredTrades.length === 0 && (
                    <tr>
                      <td colSpan="10" className="text-center py-8 text-gray-500">No trades recorded for this market filter.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* RISK CALCULATOR TAB */}
        {activeTab === 'calculator' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#131926] p-6 rounded-xl border border-gray-800 space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-400" /> Position Size & Risk Calculator
              </h3>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Account Balance ($)</label>
                <input 
                  type="number" 
                  value={accountBalance} 
                  onChange={(e) => setAccountBalance(Number(e.target.value))}
                  className="w-full bg-[#0b0f17] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Risk Percent (%)</label>
                <input 
                  type="number" 
                  value={riskPercent} 
                  onChange={(e) => setRiskPercent(Number(e.target.value))}
                  className="w-full bg-[#0b0f17] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Entry Price</label>
                  <input 
                    type="number" 
                    value={entryPrice} 
                    onChange={(e) => setEntryPrice(Number(e.target.value))}
                    className="w-full bg-[#0b0f17] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Stop Loss Price</label>
                  <input 
                    type="number" 
                    value={stopLossPrice} 
                    onChange={(e) => setStopLossPrice(Number(e.target.value))}
                    className="w-full bg-[#0b0f17] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Result Box */}
            <div className="bg-[#131926] p-6 rounded-xl border border-gray-800 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Calculation Results</h3>
                
                <div className="space-y-4">
                  <div className="bg-[#0b0f17] p-4 rounded-lg border border-gray-800">
                    <div className="text-xs text-gray-400">Maximum Capital at Risk</div>
                    <div className="text-2xl font-bold text-red-400">${riskAmount.toFixed(2)}</div>
                  </div>

                  <div className="bg-[#0b0f17] p-4 rounded-lg border border-gray-800">
                    <div className="text-xs text-gray-400">Recommended Position Units / Size</div>
                    <div className="text-3xl font-bold text-emerald-400">{calculatedPositionSize} Units</div>
                  </div>
                </div>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg mt-6 flex items-start gap-3 text-amber-400 text-xs">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <span>Risk Management Rule: Never risk more than 2% of total capital on a single position to protect against drawdown spikes.</span>
              </div>
            </div>
          </div>
        )}

        {/* NEW TRADE FORM TAB */}
        {activeTab === 'newTrade' && (
          <div className="max-w-2xl bg-[#131926] p-6 rounded-xl border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-6">Log New Executed Trade</h3>

            <form onSubmit={handleAddTrade} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Date</label>
                  <input 
                    type="date" 
                    value={newTrade.date} 
                    onChange={(e) => setNewTrade({...newTrade, date: e.target.value})}
                    className="w-full bg-[#0b0f17] border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Market Category</label>
                  <select 
                    value={newTrade.market} 
                    onChange={(e) => setNewTrade({...newTrade, market: e.target.value})}
                    className="w-full bg-[#0b0f17] border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Forex">Forex</option>
                    <option value="Crypto">Crypto</option>
                    <option value="Stocks">Stocks</option>
                    <option value="Indices">Indices</option>
                    <option value="Commodities">Commodities</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Symbol / Pair (e.g. EUR/USD, BTC)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. GBP/JPY"
                    value={newTrade.pair} 
                    onChange={(e) => setNewTrade({...newTrade, pair: e.target.value})}
                    className="w-full bg-[#0b0f17] border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Trade Direction</label>
                  <select 
                    value={newTrade.type} 
                    onChange={(e) => setNewTrade({...newTrade, type: e.target.value})}
                    className="w-full bg-[#0b0f17] border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="BUY">BUY / LONG</option>
                    <option value="SELL">SELL / SHORT</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Entry Price</label>
                  <input 
                    type="number" step="any"
                    value={newTrade.entry} 
                    onChange={(e) => setNewTrade({...newTrade, entry: e.target.value})}
                    className="w-full bg-[#0b0f17] border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Exit Price</label>
                  <input 
                    type="number" step="any"
                    value={newTrade.exit} 
                    onChange={(e) => setNewTrade({...newTrade, exit: e.target.value})}
                    className="w-full bg-[#0b0f17] border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Position Size (Lots/Units)</label>
                  <input 
                    type="number" step="any"
                    value={newTrade.size} 
                    onChange={(e) => setNewTrade({...newTrade, size: e.target.value})}
                    className="w-full bg-[#0b0f17] border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Net P&L ($)</label>
                  <input 
                    type="number" step="any"
                    placeholder="e.g. 250 or -120"
                    value={newTrade.pnl} 
                    onChange={(e) => setNewTrade({...newTrade, pnl: e.target.value})}
                    className="w-full bg-[#0b0f17] border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Risk Reward (R:R Ratio)</label>
                  <input 
                    type="number" step="any"
                    placeholder="e.g. 2.5"
                    value={newTrade.rr} 
                    onChange={(e) => setNewTrade({...newTrade, rr: e.target.value})}
                    className="w-full bg-[#0b0f17] border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Strategy Used</label>
                <input 
                  type="text" 
                  placeholder="e.g. Breakout, Orderblock, Trend Following"
                  value={newTrade.strategy} 
                  onChange={(e) => setNewTrade({...newTrade, strategy: e.target.value})}
                  className="w-full bg-[#0b0f17] border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Journal Note & Observations</label>
                <textarea 
                  rows="3"
                  placeholder="Psychology state, market conditions, mistakes..."
                  value={newTrade.note} 
                  onChange={(e) => setNewTrade({...newTrade, note: e.target.value})}
                  className="w-full bg-[#0b0f17] border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                ></textarea>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setActiveTab('journal')}
                  className="w-1/2 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold py-3 rounded-lg text-sm transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="w-1/2 bg-emerald-500 hover:bg-emerald-600 text-gray-950 font-bold py-3 rounded-lg text-sm transition"
                >
                  Save Trade Log
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
