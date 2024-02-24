import style from "./Head.module.scss";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { useUser } from "../hooks/useUser";


export default function Head() {
    const { user, setUser } = useUser();

    function logout() {
        axios.put("/api/auth/logout")
            .then(() => {
                setUser(null);
            })
    }

    return (
        <div className={style.container}>
            <Row className="m-0">
                <Col xs="auto" md="auto">
                    Reminder
                </Col>
                <Col></Col>
                <Col xs="auto" md="auto">
                    <span id="user_name">{user?.email}</span>
                    <Button variant="light" className={style.logout_button} onClick={logout}>logout</Button>
                </Col>
            </Row>
        </div>
    );
}
