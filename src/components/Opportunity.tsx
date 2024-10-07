interface ArbitrageOpportunityProps {
  dex1: string;
  dex2: string;
  spread: string;
}

export const ArbitrageOpportunity: React.FC<ArbitrageOpportunityProps> = ({
  dex1,
  dex2,
  spread,
}) => (
  <div className="bg-gray-800 p-2 rounded">
    <div className="text-xs text-gray-400">Arbitrage Opportunity</div>
    <div className="flex justify-between text-sm">
      <span>
        {dex1} → {dex2}
      </span>
      <span className="text-green-400">{spread}%</span>
    </div>
  </div>
);
