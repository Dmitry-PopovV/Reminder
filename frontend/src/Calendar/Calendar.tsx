import style from "./Calendar.module.scss";
import { Outlet } from "react-router-dom";
import Head from "../Head/Head";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function Calendar() {
  return (
    <Container fluid className={style.container}>
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
    </Container>
  );
}
