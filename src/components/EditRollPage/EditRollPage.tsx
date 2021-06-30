import { Col, Row } from "antd";
import { EditRollForm } from "../EditRollForm";
import { ProductDescription } from "../ProductDescription";

export const EditRollPage = () => {
  return (
    <Row>
      <Col md={14}>
        <EditRollForm />
      </Col>

      <Col md={10}>
        <ProductDescription />
      </Col>
    </Row>
  );
};
