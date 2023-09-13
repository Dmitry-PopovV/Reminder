import style from "./Head.module.scss";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';


export default function Head() {
  return (
    <Container fluid className={style.container}>
      <Row>
        <Col xs="auto" md="auto">
          Reminder
        </Col>
        <Col></Col>
        <Col xs="auto" md="auto">
          <span id="user_name">user name</span>
          <Button variant="light" className={style.unlog_button}>Unlog</Button>
        </Col>
      </Row>
    </Container>
  );
}
