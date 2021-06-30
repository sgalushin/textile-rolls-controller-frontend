import { Button, Input } from "antd";
import QrReader from "react-qr-reader";
import { useState } from "react";
import { CameraOutlined, FileTextOutlined } from "@ant-design/icons";

export interface QrInputProps {
  qrUpdated: (qrCode: string) => void;
}

export const QrInputText = ({ qrUpdated }: QrInputProps) => {
  const onPressEnter = (e: any) => {
    const value = e.target.value;
    if (value) {
      qrUpdated(e.target.value);
    }
  };
  return <Input onPressEnter={onPressEnter} allowClear></Input>;
};

export const QrInputCamera = ({ qrUpdated }: QrInputProps) => {
  const onError = () => {
    // do nothing, just wait for correct value
  };

  const onScan = (value: string | null) => {
    if (typeof value == "string") {
      qrUpdated(value);
    }
  };

  return <QrReader onScan={onScan} onError={onError} />;
};

export const QrInput = ({ qrUpdated }: QrInputProps) => {
  class InputType {
    private constructor(public representation: string, public icon: JSX.Element, public element: JSX.Element) {}
    static camera = new InputType("camera", <CameraOutlined />, <QrInputCamera qrUpdated={qrUpdated} />);
    static text = new InputType("text", <FileTextOutlined />, <QrInputText qrUpdated={qrUpdated} />);
    other(): InputType {
      return this.representation == "text" ? InputType.camera : InputType.text;
    }
  }
  const [currentType, setCurrentType] = useState<InputType>(InputType.camera);
  const otherType = currentType.other();
  return (
    <div>
      <Button
        type="link"
        icon={otherType.icon}
        style={{ padding: "10px" }}
        onClick={() => {
          setCurrentType(otherType);
        }}
      >
        Switch to {otherType.representation}
      </Button>
      <div style={{ padding: "10px" }}>{currentType.element}</div>
    </div>
  );
};
