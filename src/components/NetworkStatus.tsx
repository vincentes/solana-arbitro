interface NetworkStatusProps {
  tps: string;
  blockHeight: string;
  epoch: string;
}

export const NetworkStatus: React.FC<NetworkStatusProps> = ({
  tps,
  blockHeight,
  epoch,
}) => (
  <div className="bg-gray-800 p-2 rounded">
    <div className="text-xs text-gray-400 mb-1">Network Status</div>
    <div className="grid grid-cols-3 gap-2 text-sm">
      <div>
        <div className="text-xs text-gray-400">TPS</div>
        <div>{tps}</div>
      </div>
      <div>
        <div className="text-xs text-gray-400">Block Height</div>
        <div>{blockHeight}</div>
      </div>
      <div>
        <div className="text-xs text-gray-400">Epoch</div>
        <div>{epoch}</div>
      </div>
    </div>
  </div>
);
