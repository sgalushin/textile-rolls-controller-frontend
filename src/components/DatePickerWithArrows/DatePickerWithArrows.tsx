import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { Button, DatePicker, Space } from "antd";
import moment, { Moment } from "moment";
import { useEffect, useState } from "react";

interface Props {
  dateUpdated?: (date: Date) => void;
  initialDate?: Date;
}

export const DatePickerWithArrows = ({ dateUpdated, initialDate }: Props) => {
  const [value, setValue] = useState(moment(initialDate));

  useEffect(() => {
    if (dateUpdated) {
      dateUpdated(momentToDate(value));
    }
  }, [value, dateUpdated]);

  const momentToDate = (moment: Moment): Date => new Date(parseInt(moment.format("x")));
  const addOneDay = () => {
    setValue(value.clone().add(1, "days"));
  };
  const subtractOneDay = () => {
    setValue(value.clone().subtract(1, "days"));
  };
  const size = "large";
  return (
    <div>
      <Space>
        <Button onClick={subtractOneDay} size={size} icon={<ArrowLeftOutlined />}></Button>
        <DatePicker
          allowClear={false}
          mode="date"
          size={size}
          value={value}
          onChange={(value: Moment | null) => {
            setValue(value!);
          }}
        />
        <Button onClick={addOneDay} size={size} icon={<ArrowRightOutlined />}></Button>
      </Space>
    </div>
  );
};
