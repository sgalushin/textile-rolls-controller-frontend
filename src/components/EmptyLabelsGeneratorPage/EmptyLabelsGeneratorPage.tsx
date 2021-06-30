import { RandomEmptyLabel } from "../RandomEmptyLabel/RandomEmptyLabel";
import { Button, Form, InputNumber, Row, Col, Space } from "antd";
import { PrinterOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import "./EmptyLabelsGeneratorPage.css";
import { getCurrentUserRepresentation } from "../../APIs/Auth";
import { getEmptyRefs } from "../../APIs/rollsAPI";
import { RollRef } from "../../RollRef";
import { useReactToPrint } from "react-to-print";

export const EmptyLabelsGeneratorPage = () => {
  const [user, setUser] = useState("");
  const [numberOfLabels, setNumberOfLabels] = useState(100);
  const [refs, setRefs] = useState<RollRef[]>([]);
  const elementToPrint = useRef(null);

  const handleReactToPrint = useReactToPrint({
    content: () => elementToPrint.current,
  });

  const onPrint = () => {
    if (handleReactToPrint) {
      handleReactToPrint();
    }
  };

  useEffect(() => {
    (async () => {
      setUser(await getCurrentUserRepresentation());
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setRefs([]);
      const refs = await getEmptyRefs(numberOfLabels);
      setRefs(refs);
    })();
  }, [numberOfLabels]);

  return (
    <>
      <Row>
        <Col xl={4}>
          <Form.Item label="Number of labels" name="numberOfLabels">
            <InputNumber
              defaultValue={numberOfLabels}
              onChange={(val) => setNumberOfLabels(val)}
              min={0}
              max={500}
              precision={0}
              size="large"
            />
          </Form.Item>
        </Col>
        <Col xl={20}>
          <Button onClick={onPrint} size="large" type="primary" icon={<PrinterOutlined />}>
            Print
          </Button>
        </Col>
      </Row>

      <div ref={elementToPrint} className="empty-labels-container">
        {Array(numberOfLabels)
          .fill(null)
          .map((e, index) => (
            <RandomEmptyLabel code={refs[index]?.toQRCode() ?? ""} user={user} />
          ))}
      </div>
    </>
  );
};
