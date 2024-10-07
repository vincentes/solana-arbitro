interface OrderData {
  price: number;
  size: number;
}

interface MarketDepthProps {
  market: string;
  bids: OrderData[];
  asks: OrderData[];
}

export const MarketDepth: React.FC<MarketDepthProps> = ({
  market,
  bids,
  asks,
}) => (
  <div className="bg-gray-800 p-2 rounded">
    <div className="text-xs text-gray-400 mb-1">{market} Market Depth</div>
    <div className="grid grid-cols-2 gap-2 text-xs">
      <div>
        <div className="text-green-400">Bids</div>
        {bids.map((bid, index) => (
          <div key={index} className="flex justify-between">
            <span>{bid.price}</span>
            <span>{bid.size}</span>
          </div>
        ))}
      </div>
      <div>
        <div className="text-red-400">Asks</div>
        {asks.map((ask, index) => (
          <div key={index} className="flex justify-between">
            <span>{ask.price}</span>
            <span>{ask.size}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);
