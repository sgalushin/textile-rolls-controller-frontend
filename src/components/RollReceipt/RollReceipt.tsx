import { Col, Row, Skeleton } from "antd";
import QR from "qrcode.react";
import { useEffect, useState } from "react";
import { getRoll } from "../../APIs/rollsAPI";
import { RollRef } from "../../RollRef";
import { timestampToLocalString } from "../../timestampToLocalString";

interface Props {
  rollRef: RollRef;
}
export const RollReceipt = ({ rollRef }: Props) => {
  const [roll, setRoll] = useState<any>(null);

  useEffect(() => {
    (async () => {
      setRoll(await getRoll(rollRef));
    })();
  }, []);

  if (!roll) {
    return <Skeleton active />;
  }

  return (
    <div style={{ padding: "1rem" }}>
      <Row align="middle">
        <Col xl={4}>
          <Row>
            <QR size={200} value={`${rollRef.toQRCode()}`} />
          </Row>
        </Col>
        <Col xl={18} offset={2}>
          <div style={{ padding: "20px" }}>
            <h1>{roll.product.name}</h1>
            <h1>{roll.characteristic.name}</h1>
            <h1>{`Length: ${roll.totalLength}`}</h1>
            <h3>{`Registered at ${timestampToLocalString(roll.registrationDate)}`}</h3>
            <h3>{`Modified at ${timestampToLocalString(roll.modified)}`}</h3>
            <small>{`Physical ID: ${roll.physicalId}`}</small>
          </div>
        </Col>
      </Row>
    </div>
  );
};
