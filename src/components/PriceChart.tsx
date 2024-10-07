import { AxisBottom, AxisLeft } from "@visx/axis";
import { curveMonotoneX } from "@visx/curve";
import { localPoint } from "@visx/event";
import { GridRows, GridColumns } from "@visx/grid";
import { Group } from "@visx/group";
import { scaleTime, scaleLinear } from "@visx/scale";
import { LinePath } from "@visx/shape";
import { defaultStyles, Tooltip, useTooltip } from "@visx/tooltip";
import { bisector, extent } from "d3-array";

interface PriceData {
  time: Date;
  SOL_DEX1: number;
  SOL_DEX2: number;
  SOL_CEX: number;
}

// Mock data
const data: PriceData[] = [
  {
    time: new Date("2023-06-01T09:00:00"),
    SOL_DEX1: 20,
    SOL_DEX2: 20.5,
    SOL_CEX: 20.2,
  },
  {
    time: new Date("2023-06-01T10:00:00"),
    SOL_DEX1: 21,
    SOL_DEX2: 20.8,
    SOL_CEX: 20.9,
  },
  {
    time: new Date("2023-06-01T11:00:00"),
    SOL_DEX1: 20.5,
    SOL_DEX2: 20.7,
    SOL_CEX: 20.6,
  },
  {
    time: new Date("2023-06-01T12:00:00"),
    SOL_DEX1: 20.8,
    SOL_DEX2: 21,
    SOL_CEX: 20.9,
  },
];

const getTime = (d: PriceData): Date => d.time;
const getDEX1 = (d: PriceData): number => d.SOL_DEX1;
const getDEX2 = (d: PriceData): number => d.SOL_DEX2;
const getCEX = (d: PriceData): number => d.SOL_CEX;
const bisectDate = bisector<PriceData, Date>((d) => d.time).left;

interface PriceChartProps {
  width: number;
  height: number;
}

export const PriceChart: React.FC<PriceChartProps> = ({ width, height }) => {
  const margin = { top: 20, right: 20, bottom: 20, left: 40 };
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  const xScale = scaleTime<number>({
    range: [0, xMax],
    domain: extent(data, getTime) as [Date, Date],
  });

  const yScale = scaleLinear<number>({
    range: [yMax, 0],
    domain: [
      Math.min(...data.map((d) => Math.min(getDEX1(d), getDEX2(d), getCEX(d)))),
      Math.max(...data.map((d) => Math.max(getDEX1(d), getDEX2(d), getCEX(d)))),
    ],
    nice: true,
  });

  const {
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipTop = 0,
    tooltipLeft = 0,
  } = useTooltip<PriceData>();

  const handleTooltip = (
    event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>
  ) => {
    const { x } = localPoint(event) || { x: 0 };
    const x0 = xScale.invert(x - margin.left);
    const index = bisectDate(data, x0, 1);
    const d0 = data[index - 1];
    const d1 = data[index];
    const d =
      x0.getTime() - getTime(d0).getTime() >
      getTime(d1).getTime() - x0.getTime()
        ? d1
        : d0;
    showTooltip({
      tooltipData: d,
      tooltipLeft: xScale(getTime(d)) + margin.left,
      tooltipTop: yScale(Math.max(getDEX1(d), getDEX2(d), getCEX(d))),
    });
  };

  return (
    <>
      <svg width={width} height={height}>
        <Group left={margin.left} top={margin.top}>
          <GridRows
            scale={yScale}
            width={xMax}
            height={yMax}
            stroke="#2c3e50"
          />
          <GridColumns
            scale={xScale}
            width={xMax}
            height={yMax}
            stroke="#2c3e50"
          />
          <AxisBottom
            top={yMax}
            scale={xScale}
            stroke="#ecf0f1"
            tickStroke="#ecf0f1"
          />
          <AxisLeft scale={yScale} stroke="#ecf0f1" tickStroke="#ecf0f1" />
          <LinePath
            data={data}
            x={(d) => xScale(getTime(d))}
            y={(d) => yScale(getDEX1(d))}
            stroke="#8884d8"
            strokeWidth={1.5}
            curve={curveMonotoneX}
          />
          <LinePath
            data={data}
            x={(d) => xScale(getTime(d))}
            y={(d) => yScale(getDEX2(d))}
            stroke="#82ca9d"
            strokeWidth={1.5}
            curve={curveMonotoneX}
          />
          <LinePath
            data={data}
            x={(d) => xScale(getTime(d))}
            y={(d) => yScale(getCEX(d))}
            stroke="#ffc658"
            strokeWidth={1.5}
            curve={curveMonotoneX}
          />
          <rect
            width={xMax}
            height={yMax}
            fill="transparent"
            onMouseMove={handleTooltip}
            onMouseLeave={() => hideTooltip()}
          />
        </Group>
      </svg>
      {tooltipData && (
        <Tooltip
          top={tooltipTop}
          left={tooltipLeft}
          style={{
            ...defaultStyles,
            background: "#2c3e50",
            border: "1px solid #ecf0f1",
            color: "#ecf0f1",
          }}
        >
          <div>
            <strong>Time:</strong> {tooltipData.time.toLocaleTimeString()}
          </div>
          <div>
            <strong>DEX1:</strong> {tooltipData.SOL_DEX1.toFixed(2)}
          </div>
          <div>
            <strong>DEX2:</strong> {tooltipData.SOL_DEX2.toFixed(2)}
          </div>
          <div>
            <strong>CEX:</strong> {tooltipData.SOL_CEX.toFixed(2)}
          </div>
        </Tooltip>
      )}
    </>
  );
};
