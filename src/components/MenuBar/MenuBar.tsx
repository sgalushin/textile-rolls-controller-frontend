import "./MenuBar.css";
import { Button, Col, Row, Space, message } from "antd";
import {
  BranchesOutlined,
  CopyOutlined,
  LogoutOutlined,
  PlusCircleOutlined,
  QuestionOutlined,
  TagsOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { getCognitoAuthToken } from "../../APIs/Auth";
import { Auth } from "aws-amplify";

const CopyTokenDebugButton = () => (
  <Button
    icon={<CopyOutlined />}
    onClick={async () => {
      await navigator.clipboard.writeText(await getCognitoAuthToken());
      message.info("Auth token copied to clipboard");
    }}
  >
    Token
  </Button>
);

export const MenuBar = () => {
  return (
    <div className="menubar">
      <Row>
        <Col xl={12}>
          <Space>
            <Link to="/editRoll">
              <Button icon={<PlusCircleOutlined />}>New roll</Button>
            </Link>
            <Link to="/rolls">
              <Button icon={<UnorderedListOutlined />}>Rolls</Button>
            </Link>
            <Link to="/cuttingStudio">
              <Button icon={<BranchesOutlined />}>Cutting studio</Button>
            </Link>
            <Link to="/emptyLabelsGenerator">
              <Button icon={<TagsOutlined />}>Labels generator</Button>
            </Link>
          </Space>
        </Col>

        <Col xl={12}>
          <Row justify="end">
            <Space>
              <Link to="/about">
                <Button icon={<QuestionOutlined />}>About</Button>
              </Link>

              {process.env.NODE_ENV === "development" ? <CopyTokenDebugButton /> : null}

              <Button
                icon={<LogoutOutlined />}
                onClick={async () => {
                  await Auth.signOut();
                  window.location.href = "/";
                }}
              >
                Logout
              </Button>
            </Space>
          </Row>
        </Col>
      </Row>
    </div>
  );
};
