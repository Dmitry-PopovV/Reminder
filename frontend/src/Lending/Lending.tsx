import style from "./Lending.module.scss"
import Card from 'react-bootstrap/Card';

export default function Lending() {
    return (
      <Card className={style.card}>
        <Card.Header className={style.header}>Reminder</Card.Header>
        <Card.Body>
          <Card.Title>Login with Google to start</Card.Title>
        </Card.Body>
      </Card>
    );
  }