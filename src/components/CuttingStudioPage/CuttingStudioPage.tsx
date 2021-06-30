import { Row, Col, Button, FormInstance, Input, Spin, Form, InputNumber, Modal, message, Alert } from "antd";
import React, { MutableRefObject, Ref, useEffect, useRef, useState } from "react";
import { RollbackOutlined, SaveOutlined } from "@ant-design/icons";
import { RollCutVisualisation } from "../RollCutVisualisation";
import "./CuttingStudio.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  fetchParentRoll,
  setCurrentDescendant,
  saveDescendantRoll,
  setParentQr,
  resetCurrentDescendant,
} from "../../redux/cuttingStudio/cuttingStudioSlice";
import { QrInput } from "../QrInput/QrInput";
import { ParentRollInfoBlock } from "../ParentRolInfoBlock/ParentRollInfoBlock";

export const CuttingStudioPage = () => {
  const dispatch = useDispatch();
  const parent = useSelector((state: RootState) => state.cuttingStudio.parent);
  const currentDescendant = useSelector((state: RootState) => state.cuttingStudio.currentDescendant);
  const [modalWithDescendantQrIsVisible, setModalWithDescendantQrIsVisible] = useState(false);
  const formRef = useRef<FormInstance>();

  useEffect(() => {
    if (currentDescendant.justSaved) {
      message.success("The new cut successfully saved");
      formRef.current?.resetFields();
      setModalWithDescendantQrIsVisible(false);
      dispatch(resetCurrentDescendant());
    }
  }, [currentDescendant.justSaved]);

  const ButtonResetAll = () => (
    <div style={{ padding: "1rem" }}>
      <Button
        className="button-scan-again"
        type="dashed"
        danger
        icon={<RollbackOutlined />}
        size="small"
        onClick={() => dispatch(setParentQr(""))}
      >
        Reset & Scan again
      </Button>
    </div>
  );

  const formLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
  };

  useEffect(() => {
    dispatch(setParentQr(""));
  }, []);

  if (!parent.qrCode) {
    return (
      <div className="qr-input">
        <QrInput
          qrUpdated={(val) => {
            dispatch(fetchParentRoll(val));
          }}
        />
      </div>
    );
  }

  if (parent.loading) {
    return (
      <div style={{ width: "300px", height: "300px" }}>
        <h1>Roll loading</h1>
        <Spin size="large" />
      </div>
    );
  }

  if (parent.error) {
    return (
      <div>
        <Alert message="Error" description={parent.error} type="error" showIcon />
        <ButtonResetAll />
      </div>
    );
  }

  const formOnChange = () => {
    const fieldValues = (formRef as MutableRefObject<FormInstance>).current.getFieldsValue();
    dispatch(
      setCurrentDescendant({
        totalLength: fieldValues.totalLength,
        firstClassLength: fieldValues.firstClassLength,
        qualityNote: fieldValues.qualityNote,
      })
    );
  };

  // If parent QR code is scanned successfully and the corresponding roll is loaded
  return (
    <>
      <div>
        <Row>
          <Col xl={12}>
            <RollCutVisualisation />
            <div>
              <h2>New cut creation</h2>
              <Form
                onFinish={() => setModalWithDescendantQrIsVisible(true)}
                ref={formRef as Ref<FormInstance>}
                onChange={formOnChange}
                {...formLayout}
                size="large"
                name="newCuttedRollForm"
              >
                <Form.Item rules={[{ required: true, message: "Length must not be > 1" }]} label="Total length" name="totalLength">
                  <InputNumber precision={3} style={{ width: "30%" }} />
                </Form.Item>
                <Form.Item
                  rules={[
                    { required: true, message: "Length must not be > 1" },
                    ({ getFieldValue }) => ({
                      validator(_, value: number) {
                        if (value <= getFieldValue("totalLength")) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error("First class length cannot be more than total length!"));
                      },
                    }),
                  ]}
                  label="1st class length"
                  name="firstClassLength"
                >
                  <InputNumber precision={3} style={{ width: "30%" }} />
                </Form.Item>

                <Form.Item label="Quality note" name="qualityNote">
                  <Input.TextArea></Input.TextArea>
                </Form.Item>

                <Form.Item>
                  <Button icon={<SaveOutlined />} type="primary" htmlType="submit" size="large">
                    Save
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Col>
          <Col xl={12}>
            <ParentRollInfoBlock roll={parent.roll!} />
          </Col>
        </Row>
      </div>

      <Modal
        title="Enter pregenerated QR for the new roll"
        visible={modalWithDescendantQrIsVisible}
        onCancel={() => setModalWithDescendantQrIsVisible(false)}
        cancelButtonProps={{ style: { visibility: "hidden" } }}
        okButtonProps={{ style: { visibility: "hidden" } }}
      >
        <Row>
          <div className="qr-input">
            {currentDescendant.isSaving ? (
              <div style={{ textAlign: "center", alignContent: "center" }}>
                <h2>Saving</h2>
                <Spin size="large" />
              </div>
            ) : (
              <QrInput
                qrUpdated={(value) => {
                  dispatch(saveDescendantRoll(value));
                }}
              />
            )}
            {currentDescendant.error ? (
              <Alert message="Error saving roll" description={currentDescendant.error} type="error" showIcon />
            ) : null}
          </div>
        </Row>
      </Modal>
    </>
  );
};
