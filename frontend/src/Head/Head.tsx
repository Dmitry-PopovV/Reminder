import style from "./Head.module.scss";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useAppSelector } from "../store" ;
import { setUser } from "../store/slicers/userSlice";


export default function Head() {
  const user = useAppSelector();
  const dispatch = useDispatch();

  function unlog(){
    axios.get("api/unlog")
      .then(()=>{
        dispatch(setUser(null));
      })
  }

  return (
    <div className={style.container}>
      <Row>
        <Col xs="auto" md="auto">
          Reminder
        </Col>
        <Col></Col>
        <Col xs="auto" md="auto">
          <span id="user_name">{user?.email}</span>
          <Button variant="light" className={style.unlog_button} onClick={unlog}>Unlog</Button>
        </Col>
      </Row>
    </div>
  );
}
