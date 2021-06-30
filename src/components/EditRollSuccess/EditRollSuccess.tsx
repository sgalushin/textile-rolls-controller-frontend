import { Button, Result } from "antd";
import { EditOutlined, PlusCircleOutlined, PrinterOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { Link, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useEffect, useRef, useState } from "react";
import "./EditRollSuccess.css";
import { RollReceipt } from "../RollReceipt";
import { RollRef } from "../../RollRef";

export const RollRegistrationSuccess = ({ operationType }: { operationType: "create" | "update" }) => {
  const elementToPrint = useRef(null);
  const { qrCodeUrlEncoded } = useParams<{ qrCodeUrlEncoded: string }>();
  const [rollRef, setRollRef] = useState<RollRef>();
  useEffect(() => {
    setRollRef(RollRef.fromUrl(qrCodeUrlEncoded));
  }, [qrCodeUrlEncoded]);

  const handleReactToPrint = useReactToPrint({
    content: () => elementToPrint.current,
  });

  const onPrint = () => {
    if (handleReactToPrint) {
      handleReactToPrint();
    }
  };

  if (!rollRef) {
    return <div>404 roll not found</div>;
  }

  const SuccessBody = () => (
    <div style={{ padding: "2rem" }}>
      <Button onClick={onPrint} size="large" icon={<PrinterOutlined />}>
        Print receipt
      </Button>
    </div>
  );

  return (
    <>
      <Result
        status="success"
        title={`Successfully ${operationType == "create" ? "created a new" : "updated a"} roll!`}
        subTitle={<SuccessBody />}
        extra={[
          <Link to="/editRoll">
            <Button icon={<PlusCircleOutlined />} type="primary" key="newRoll" size="large">
              Create another new roll
            </Button>
          </Link>,
          <Link to="/rolls">
            <Button icon={<UnorderedListOutlined />} key="rollsList">
              Go to the list of rolls
            </Button>
          </Link>,
          <Link to={`/editRoll/${qrCodeUrlEncoded}`}>
            <Button icon={<EditOutlined />}>Edit</Button>
          </Link>,
        ]}
      />

      <div ref={elementToPrint}>
        <RollReceipt rollRef={rollRef} />
      </div>
    </>
  );
};
