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
        <div data-testid="headMainContainer" className={style.container + " px-5"}>
            <Row className="m-0 justify-content-end">
                <Col xs="auto" md="auto" className={style.center}>
                    <img src="/ReminderLogo512.png" className={style.logoImg + " me-3"} />
                    <span className={style.logoTitle}>Reminder</span>
                </Col>
                <Col></Col>
                <Col xs="auto" md="auto" className={style.center}>
                    <span id="user_name" className={style.login}>{user?.email}</span>
                    <Button data-testid="logoutButton" variant="secondary" className="btn-sm" onClick={logout}>Log out</Button>
                </Col>
            </Row>
        </div>
    );
}
