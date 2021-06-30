import "./RollCutVisualisation.css";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Alert, Skeleton } from "antd";

const elementWidthInPx = 500;

const CutVisualisation = ({ color, width, isCurrent, label }: { color: string; width: number; isCurrent: boolean; label?: string }) => {
  return (
    <a
      className={`cut ${isCurrent ? "current" : ""}`}
      style={{
        backgroundColor: isCurrent ? "" : `${color}`,
        width: `${width}px`,
      }}
      href="/"
    >
      <div className="cut-label">{label}</div>
    </a>
  );
};

export const RollCutVisualisation = () => {
  const currentDescendant = useSelector((state: RootState) => state.cuttingStudio.currentDescendant);
  const parentRoll = useSelector((state: RootState) => state.cuttingStudio.parent.roll);
  const descendants = useSelector((state: RootState) => state.cuttingStudio.descendants);

  if (!parentRoll) {
    return (
      <div>
        <h3>Visualisation unavailable, no roll is selected</h3>
      </div>
    );
  }

  if (descendants.loading) {
    return <Skeleton active paragraph={{ rows: 4, width: elementWidthInPx - elementWidthInPx * 0.1 }} />;
  }

  const savedDescendantsLength = descendants.rolls
    .map((r) => r.totalLength)
    .reduce((previousValue, currentValue, index, array) => previousValue + array[index], 0);
  const allDescendantsLength = savedDescendantsLength + currentDescendant.totalLength;
  const scale = elementWidthInPx / Math.max(allDescendantsLength, parentRoll.totalLength);
  const parentWidth = parentRoll.totalLength * scale;
  const outsideParentRollWidth =
    parentRoll.totalLength >= allDescendantsLength ? 0 : (allDescendantsLength - parentRoll.totalLength) * scale;
  const uderuseOveruseRepresentation = (() => {
    const diff = parentRoll.totalLength - allDescendantsLength;
    const res = diff * Math.sign(diff);
    return Math.round((res * 1000) / 1000);
  })();

  return (
    <div>
      <div className="roll" style={{ width: `${elementWidthInPx}px` }}>
        {descendants.rolls.map((r, index) => (
          <CutVisualisation
            label={r.totalLength.toString()}
            color={index % 2 == 0 ? "tan" : "PaleTurquoise"}
            width={r.totalLength * scale}
            isCurrent={false}
          />
        ))}
        <CutVisualisation
          color={"green"}
          width={currentDescendant.totalLength * scale}
          isCurrent
          label={currentDescendant.totalLength?.toString()}
        />
      </div>
      <div className="overlay-container-1">
        <div className="overlay-element parent-roll" style={{ width: `${parentWidth}px` }}></div>
        <div
          className="overlay-element outside-parent-roll"
          style={{ visibility: outsideParentRollWidth == 0 ? "hidden" : "visible", width: `${outsideParentRollWidth}px` }}
        ></div>
      </div>
      <Alert
        style={{ width: `${elementWidthInPx}px` }}
        message={
          <div>
            {`Length of all cuts: ${allDescendantsLength}`}
            <br />
            {`Parent length: ${parentRoll.totalLength}`}
            <br />
            {`${outsideParentRollWidth ? "Overused" : "Unused"} length: ${uderuseOveruseRepresentation}`}
          </div>
        }
        description={" "}
        type={outsideParentRollWidth ? "warning" : "info"}
        showIcon
      />
    </div>
  );
};
