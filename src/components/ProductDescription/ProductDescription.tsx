import { Badge, Descriptions, Empty, Image, Space } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { getPicture } from "../../APIs/productCatalogPictureStorage";
import { useEffect, useState } from "react";

const ProdAndCharDeletionStatus = ({
  productDeletionMark,
  characteristicDeletionMark,
}: {
  productDeletionMark: boolean;
  characteristicDeletionMark: boolean;
}) => {
  const DeletionBadge = ({ title, active }: { title: string; active: boolean }) => (
    <Badge color={active ? "green" : "red"} text={`${title} ${active ? "active" : "deleted"}`} />
  );

  return (
    <Space>
      <DeletionBadge title="Prod." active={!productDeletionMark} />
      <DeletionBadge title="Char." active={!characteristicDeletionMark} />
    </Space>
  );
};

export const ProductDescription = () => {
  const products = useSelector((state: RootState) => state.products.products);
  const characteristics = useSelector((state: RootState) => state.products.characteristics);
  const [currentCharacteristicUrl, setCurrentCharacteristicUrl] = useState("");
  const editRollState = useSelector((state: RootState) => state.editRoll);
  const product = products.items.find((p) => editRollState.productId == p.id);
  const characteristic =
    editRollState.productId && characteristics.items[editRollState.productId]
      ? characteristics.items[editRollState.productId].find((c) => c.id == editRollState.characteristicId)
      : undefined;

  useEffect(() => {
    (async () => {
      if (characteristic?.picture?.hash) {
        setCurrentCharacteristicUrl(await getPicture(characteristic.picture.hash));
      } else {
        setCurrentCharacteristicUrl("");
      }
    })();
  }, [characteristic]);

  if (!(editRollState.productId && editRollState.characteristicId)) {
    return <Empty description="Select a product and a characteristic to see detailed information"></Empty>;
  }

  if (!(product && characteristic)) {
    return <Empty description="Product or characteristic were not fetched"></Empty>;
  }

  return (
    <Descriptions
      layout="horizontal"
      bordered
      title={`${product.name}; ${characteristic.name}`}
      extra={
        <ProdAndCharDeletionStatus productDeletionMark={product.deletionMark} characteristicDeletionMark={characteristic.deletionMark} />
      }
    >
      <Descriptions.Item label="SKU" span={4}>
        {product.sku}
      </Descriptions.Item>

      {characteristic.picture ? (
        <Descriptions.Item label="Picture">
          <div>
            {characteristic.picture.name} (crock: {characteristic.picture.crock2})
          </div>
          <Image width={200} src={currentCharacteristicUrl}></Image>
        </Descriptions.Item>
      ) : null}

      {characteristic.color ? (
        <Descriptions.Item label="Color">
          <div>
            {characteristic.color.name} (id: {characteristic.color.id})
            <br />
            {characteristic.color.pantone ? <>Pantone: {characteristic.color.pantone}</> : null}
            {characteristic.color.r == undefined ? null : (
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  backgroundColor: `rgb(${characteristic.color.r}, ${characteristic.color.g}, ${characteristic.color.b})`,
                }}
              ></div>
            )}
          </div>
        </Descriptions.Item>
      ) : null}
    </Descriptions>
  );
};
