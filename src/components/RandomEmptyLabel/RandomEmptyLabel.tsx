import QR from "qrcode.react";
import { Skeleton } from "antd";
import "./RandomEmptyLabel.css";

export const RandomEmptyLabel = ({ code, user }: { code: string; user: string }) => {
  return (
    <>
      <div className="empty-label-container">
        <div className="qr-code-container">
          {code && user ? (
            <QR size={140} value={code} />
          ) : (
            <Skeleton.Avatar shape="square" style={{ width: "140px", height: "140px" }} size="large" active />
          )}
        </div>
        <div className="label-text-container">
          <h3>Empty label for a roll</h3>
          <small>
            Created at {new Date().toLocaleString("en-us")} by {user}
          </small>
        </div>
      </div>
    </>
  );
};
