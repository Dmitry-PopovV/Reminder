//import style from "./Layout.module.scss";
import { Outlet } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Head from "../Head/Head";
import Calendar from "../Calendar/Calendar";


export default function Layout() {
  return (
    <div>
      <Head />
      <Container fluid>
        <Row xs={1} md={2}>
          <Col>
            <Calendar />
          </Col>
          <Col>
            <Outlet />
          </Col>
        </Row>
      </Container>
    </div>
  );
}
