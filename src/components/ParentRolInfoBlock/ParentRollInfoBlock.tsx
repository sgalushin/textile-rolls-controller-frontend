import { Roll } from "../../redux/Roll";
import { Descriptions } from "antd";
import { timestampToLocalString } from "../../timestampToLocalString";

interface Props {
  roll: Roll;
}

export const ParentRollInfoBlock = ({ roll }: Props) => {
  return (
    <Descriptions size="small" bordered layout="vertical" title="Parent roll">
      <Descriptions.Item label="Product">{roll.product.name}</Descriptions.Item>
      <Descriptions.Item label="Characteristic">{roll.characteristic.name}</Descriptions.Item>
      <Descriptions.Item label="Length">{roll.totalLength}</Descriptions.Item>
      <Descriptions.Item label="Registered at">{timestampToLocalString(roll.registrationDate)}</Descriptions.Item>
    </Descriptions>
  );
};
