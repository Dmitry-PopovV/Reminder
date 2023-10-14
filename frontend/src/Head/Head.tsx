import style from "./Head.module.scss";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useSelector } from "react-redux";
import { RootState } from "../store";


export default function Head() {

  const user = useSelector((state: RootState) => state.user.user);

  return (
    <div className={style.container}>
      <Row>
        <Col xs="auto" md="auto">
          Reminder
        </Col>
        <Col></Col>
        <Col xs="auto" md="auto">
          <span id="user_name">{user ? user.email : "???"}</span>
          <Button variant="light" className={style.unlog_button}>Unlog</Button>
        </Col>
      </Row>
    </div>
  );
}
