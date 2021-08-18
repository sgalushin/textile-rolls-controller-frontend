import { Button, Space, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { getAllRollsByDate } from "../../APIs/rollsAPI";
import { DatePickerWithArrows } from "../DatePickerWithArrows/DatePickerWithArrows";
import { EditOutlined, RightSquareOutlined } from "@ant-design/icons";
import { RollRef } from "../../RollRef";
import { Link } from "react-router-dom";
import { timestampToLocalString } from "../../timestampToLocalString";

const rollsToTableDatasource = (rolls: any) => {
  console.log(rolls);
  const res = rolls.map((rollData: any) => {
    return {
      key: RollRef.fromObj(rollData).toQRCode(),
      product: rollData.product.name,
      characteristic: rollData.characteristic.name,
      totalLength: rollData.totalLength,
      registrationDate: timestampToLocalString(rollData.registrationDate),
      modified: timestampToLocalString(rollData.modified),
      physicalId: rollData.physicalId,
      user: rollData.user.representation,
      previousVersion: rollData.previousVersion,
      parentRoll: rollData.parentRoll,
    };
  });

  return res;
};

export const RollsList = () => {
  const [tableData, setTableData] = useState<object[]>([]);
  const [chosenDate, setChosenDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setTableData([]);
      const res = await getAllRollsByDate(chosenDate);
      setTableData(rollsToTableDatasource(res.Items.sort((a: any, b: any) => b.modified.localeCompare(a.modified))));
      setLoading(false);
    })();
  }, [chosenDate]);

  const columns = [
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
    },
    {
      title: "Characteristic",
      dataIndex: "characteristic",
      key: "chracteristic",
    },
    {
      title: "Total Length",
      dataIndex: "totalLength",
      key: "totalLength",
    },
    {
      title: "Registered",
      dataIndex: "registrationDate",
      key: "registrationDate",
    },
    {
      title: "Updated",
      dataIndex: "modified",
      key: "modified",
    },
    {
      title: "User",
      dataIndex: "user",
      key: "user",
    },
    {
      title: "Roll type",
      render: (row: any) => (
        <Space size="small">
          {row.parentRoll === undefined ? <Tag color="geekblue">Original roll</Tag> : <Tag color="purple">Cut</Tag>}
          {row.previousVersion === undefined ? <Tag color="green">First version</Tag> : <Tag color="orange">Correction</Tag>}
        </Space>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (row: any) => (
        <div>
          <Space>
            <Link to={`/editRoll/${RollRef.fromQrCode(row.key).encodeUrl()}`}>
              <Button icon={<EditOutlined />} />
            </Link>
            <Link to={`/rolls/${row.physicalId}/${RollRef.fromQrCode(row.key).encodeUrl()}`}>
              <Button icon={<RightSquareOutlined />} />
            </Link>
          </Space>
        </div>
      ),
    },
  ];
  return (
    <div>
      <div style={{ paddingBottom: "0.5rem" }}>
        <DatePickerWithArrows dateUpdated={setChosenDate} initialDate={chosenDate} />
      </div>
      <Table pagination={{ pageSize: 100 }} sticky loading={loading} dataSource={tableData} columns={columns}></Table>
    </div>
  );
};
