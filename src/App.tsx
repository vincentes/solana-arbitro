import React from "react";
import { NetworkStatus } from "./components/NetworkStatus";
import { PriceChart } from "./components/PriceChart";
import { ArbitrageOpportunity } from "./components/Opportunity";
import { MarketDepth } from "./components/MarketDepth";

const ArbitrageDashboard: React.FC = () => {
  return (
    <div className="bg-gray-900 text-white p-4 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Solana Arbitrage Monitor</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <div className="bg-gray-800 p-4 rounded">
            <h2 className="text-lg font-semibold mb-2">SOL Price Chart</h2>
            <PriceChart width={600} height={300} />
          </div>
        </div>
        <div>
          <ArbitrageOpportunity dex1="Serum" dex2="Raydium" spread="0.5" />
          <div className="mt-4">
            <NetworkStatus tps="1,789" blockHeight="12,345,678" epoch="225" />
          </div>
        </div>
        <div>
          <MarketDepth
            market="SOL/USDC"
            bids={[
              { price: 20.5, size: 1000 },
              { price: 20.4, size: 1500 },
              { price: 20.3, size: 2000 },
            ]}
            asks={[
              { price: 20.6, size: 800 },
              { price: 20.7, size: 1200 },
              { price: 20.8, size: 1800 },
            ]}
          />
        </div>
        <div>
          <MarketDepth
            market="SOL/USDT"
            bids={[
              { price: 20.45, size: 1200 },
              { price: 20.35, size: 1800 },
              { price: 20.25, size: 2200 },
            ]}
            asks={[
              { price: 20.55, size: 900 },
              { price: 20.65, size: 1300 },
              { price: 20.75, size: 1700 },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default ArbitrageDashboard;
