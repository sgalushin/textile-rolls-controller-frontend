import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllRollsByPhysicalId } from "../../APIs/rollsAPI";
import { Descriptions, Spin } from "antd";
import { timestampToLocalString } from "../../timestampToLocalString";
import "./RollDetailsPage.css";
import { RollRef } from "../../RollRef";
import React from "react";

const rollsSortFunc = (a: any, b: any) => b.modified.localeCompare(a.modified);

export const RollDetailsPage = () => {
  const [rolls, setRolls] = useState<any[]>([]);
  const [rollsLoading, setRollsLoading] = useState(false);
  const { qrCodeUrlEncoded, physicalId } = useParams<{ physicalId: string; qrCodeUrlEncoded: string }>();

  const originalRollIds = rolls.filter((r: any) => r.parentRoll == undefined && r.previousVersion == undefined).map((r: any) => r.id);

  const RollElement = ({ roll, isActive }: { roll: any; isActive: boolean }) => {
    const generateTitle = (): string => {
      const isCut = roll.parentRoll != undefined;
      if (isCut && isActive) {
        return `Cut: current version, ${roll.totalLength} m.`;
      } else if (isCut && !isActive) {
        return `Cut: previous version from ${timestampToLocalString(roll.modified)}`;
      } else if (!isCut && isActive) {
        return "Current version";
      } else {
        return `Previous version  from ${timestampToLocalString(roll.modified)}`;
      }
    };

    const isHighlighted = RollRef.fromObj(roll).encodeUrl() == qrCodeUrlEncoded;
    const divClass = [
      isHighlighted ? "roll-highlighted" : "",
      isActive ? "roll-active" : "roll-inactive",
      "any-roll",
      roll.parentRoll != undefined && !isActive ? "previous-version-of-descendant-roll" : "",
    ].join(" ");

    return (
      <div className={divClass}>
        <Descriptions title={generateTitle()} bordered size="small">
          <Descriptions.Item label="Product">{roll.product.name}</Descriptions.Item>
          <Descriptions.Item label="Characteristic">{roll.characteristic.name}</Descriptions.Item>
          <Descriptions.Item label="Registered at">{timestampToLocalString(roll.registrationDate)}</Descriptions.Item>
          {roll.modified == roll.registered ? null : (
            <Descriptions.Item label="Modified at">{timestampToLocalString(roll.modified)}</Descriptions.Item>
          )}
          <Descriptions.Item label="Total Length">{roll.totalLength}</Descriptions.Item>
          {roll.firstClassLength ? <Descriptions.Item label="1st Class Length">{roll.firstClassLength}</Descriptions.Item> : null}
          <Descriptions.Item label="User">{roll.user.representation}</Descriptions.Item>
          {roll.previousDepartmentInfo.note ? (
            <Descriptions.Item label="Prev. department note">{roll.previousDepartmentInfo.note}</Descriptions.Item>
          ) : null}
          {roll.quality?.note ? <Descriptions.Item label="Quality note">{roll.quality.note}</Descriptions.Item> : null}
        </Descriptions>
      </div>
    );
  };

  const Versions = ({ id }: { id: string }) => {
    return (
      <>
        {rolls
          .filter((r: any) => r.id == id)
          .sort(rollsSortFunc)
          .map((r: any, index) => (
            <div className={r.parentRoll == undefined ? "original-rolls-container" : "descendant-rolls-container"} key={r.id + r.version}>
              <RollElement roll={r} isActive={index == 0} />
              <Descendants id={r.id} version={r.version} />
            </div>
          ))}
      </>
    );
  };

  const Descendants = ({ id, version }: { id: string; version: string }) => {
    const currentDescendantIds = [
      // @ts-ignore
      ...new Set(
        rolls
          .filter((r: any) => r.parentRoll?.id == id && r.parentRoll?.version == version)
          .sort(rollsSortFunc)
          .map((r: any) => r.id)
      ),
    ];

    if (!currentDescendantIds.length) {
      return null;
    }
    return (
      <div className="descendants-container">
        {currentDescendantIds.map((id: string) => (
          <>
            <Versions id={id} />
          </>
        ))}
      </div>
    );
  };

  useEffect(() => {
    (async () => {
      setRollsLoading(true);
      setRolls((await getAllRollsByPhysicalId(physicalId)).Items);
      setRollsLoading(false);
    })();
  }, [physicalId]);

  if (rollsLoading) {
    return (
      <div style={{ alignContent: "center" }}>
        <Spin size="large" />
      </div>
    );
  }
  return (
    <div>
      {originalRollIds.map((id: string) => (
        <>
          <div>
            <Versions id={id} />
          </div>
        </>
      ))}
    </div>
  );
};
