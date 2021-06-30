import { Button, Col, Form, InputNumber, Input, Row, Select, Modal, FormInstance, Alert, Checkbox } from "antd";
import { RollbackOutlined, SaveOutlined, StopOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllProducts, fetchAllCharacteristicsForAProduct } from "../../redux/products/productsSlice";
import { Redirect, useParams } from "react-router-dom";
import React, { Ref, useEffect, useRef, useState } from "react";
import { RootState } from "../../redux/store";
import { RollRef } from "../../RollRef";
import {
  fetchRollByQrCode,
  resetAll,
  resetSavingError,
  saveRoll,
  setCharacteristicId,
  setProductId,
} from "../../redux/editRoll/editRollSlice";

export const EditRollForm = () => {
  const formRef = useRef<FormInstance>();
  const products = useSelector((state: RootState) => state.products.products);
  const characteristics = useSelector((state: RootState) => state.products.characteristics);
  const editRollState = useSelector((state: RootState) => state.editRoll);
  const rollInDbState = useSelector((state: RootState) => state.editRoll.rollInDb);
  const dispatch = useDispatch();
  const [savingInitiated, setSavingInitiated] = useState(false);

  const { qrCodeUrlEncoded } = useParams<{ qrCodeUrlEncoded: string }>();

  useEffect(() => {
    dispatch(resetAll());
    dispatch(fetchAllProducts());
    formRef.current?.resetFields();
  }, []);

  useEffect(() => {
    formRef.current?.resetFields();
    dispatch(fetchRollByQrCode(qrCodeUrlEncoded));
  }, [qrCodeUrlEncoded]);

  // Characteristic may be changed programmatically, for example when a product is changed.
  useEffect(() => {
    formRef.current?.setFieldsValue({
      characteristicId: editRollState.characteristicId,
    });
  }, [editRollState.characteristicId]);

  useEffect(() => {
    if (!rollInDbState?.roll) {
      return;
    }
    const roll = rollInDbState!.roll;
    formRef.current?.setFieldsValue({
      productId: roll.product.id,
      totalLength: roll.totalLength,
      previousDepartmentNote: roll.previousDepartmentInfo.note,
      firstClassLength: roll.firstClassLength,
      qualityNote: roll.quality?.note,
      deletionMark: roll.deletionMark,
    });
  }, [rollInDbState?.roll]);

  const formLayouts = {
    layout: {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
    },
    tailLayout: {
      wrapperCol: { offset: 2 },
    },
  };

  const formOnFinish = async (values: any) => {
    setSavingInitiated(true);
    await dispatch(saveRoll(values));
  };

  const productOnSelect = (value: any) => {
    const productId = value as string;
    dispatch(fetchAllCharacteristicsForAProduct(productId));
    dispatch(setProductId(productId));
  };

  const characteristicOnSelect = (value: any) => {
    const characteristicId = value as string;
    dispatch(setCharacteristicId(characteristicId));
  };

  if (savingInitiated && editRollState.savedRef) {
    const savedRef = RollRef.fromObj(editRollState.savedRef);
    const urlPart = `/editRollSuccess/${qrCodeUrlEncoded ? "updated" : "created"}/${savedRef.encodeUrl()}`;
    return <Redirect to={encodeURI(urlPart)} />;
  }

  if (rollInDbState?.fetchingError) {
    return <Alert message={`Error fetching roll: ${rollInDbState.fetchingError}`} type="error" />;
  }

  const formItemDisabled = editRollState.isSaving || rollInDbState?.isFetching;

  return (
    <>
      <Row align="middle">
        <Col offset={4}>
          <h2>{qrCodeUrlEncoded ? "Edit roll" : "New Roll"}</h2>
        </Col>
      </Row>
      <Form ref={formRef as Ref<FormInstance>} size="large" {...formLayouts.layout} onFinish={formOnFinish}>
        <Form.Item label="Product" name="productId" rules={[{ required: true, message: "Product must not be empty" }]}>
          <Select onSelect={(value) => productOnSelect(value)} disabled={formItemDisabled} showSearch loading={products.loading}>
            {products.items.map((p: any) => (
              <Select.Option key={p.id} value={`${p.id}`}>{`${p.name}`}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Characteristic" name="characteristicId" rules={[{ required: true, message: "Characteristic must not be empty" }]}>
          <Select
            onSelect={(value) => characteristicOnSelect(value)}
            disabled={formItemDisabled}
            showSearch
            loading={characteristics.loading}
          >
            {editRollState.productId &&
              characteristics.items[editRollState.productId] &&
              characteristics.items[editRollState.productId].map((ch: any) => (
                <Select.Option value={ch.id} key={ch.id}>
                  {ch.name}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item label="Length, m" name="totalLength" rules={[{ required: true, message: "Length must not be > 1" }]}>
          <InputNumber disabled={formItemDisabled} min={1} precision={3} style={{ width: "30%" }} />
        </Form.Item>

        <Form.Item label="Prev. department note" name="previousDepartmentNote">
          <Input.TextArea disabled={formItemDisabled} />
        </Form.Item>

        {qrCodeUrlEncoded ? (
          <>
            {rollInDbState?.roll?.parentRoll != undefined ? (
              <>
                <Form.Item label="1st Class Length" name="firstClassLength">
                  <InputNumber disabled={formItemDisabled} min={1} precision={3} style={{ width: "30%" }} />
                </Form.Item>
                <Form.Item label="Quality Note" name="qualityNote">
                  <Input.TextArea disabled={formItemDisabled} />
                </Form.Item>
              </>
            ) : null}

            <Form.Item label="Deletion mark" valuePropName="checked" name="deletionMark">
              <Checkbox disabled={formItemDisabled} />
            </Form.Item>
          </>
        ) : null}

        <Form.Item {...formLayouts.tailLayout}>
          <Row align="bottom">
            <Col span={18}>
              <Button
                onClick={() => {
                  dispatch(resetAll());
                  formRef.current?.resetFields();
                }}
                disabled={formItemDisabled}
                type="dashed"
                danger
                icon={<RollbackOutlined />}
                size="small"
              >
                Reset
              </Button>
            </Col>
            <Col span={6}>
              <Button loading={formItemDisabled} icon={<SaveOutlined />} type="primary" htmlType="submit" size="large">
                Save
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>

      <Modal
        title="Error saving roll"
        visible={editRollState.savingError != undefined}
        onOk={() => dispatch(resetSavingError())}
        cancelButtonProps={{ style: { visibility: "hidden" } }}
      >
        <Row>
          <Col span={4}>
            <StopOutlined style={{ fontSize: "3rem" }} />
          </Col>
          <Col span={20}>{editRollState.savingError}</Col>
        </Row>
      </Modal>
    </>
  );
};
