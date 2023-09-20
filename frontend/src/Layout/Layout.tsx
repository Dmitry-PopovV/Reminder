import style from "./Layout.module.scss";
import { Outlet } from "react-router-dom";
import Head from "../Head/Head";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function Layout() {
  return (
    <div className={style.container}>
      <Row>
        <Col>
          <Head />
        </Col>
      </Row>
      <Row xs={1} md={2}>
        <Col>
          <div>calendar</div>
        </Col>
        <Col>
          <Outlet />
        </Col>
      </Row>
    </div>
  );
}
