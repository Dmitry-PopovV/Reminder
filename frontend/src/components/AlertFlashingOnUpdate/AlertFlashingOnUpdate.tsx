import style from "./AlertFlashingOnUpdate.module.scss";
import Alert from 'react-bootstrap/Alert';

export default function AlertFlashingOnUpdate({ text }: { text: string }) {
    return (
        <Alert key={text} variant="light" className={style.text + " text-center"}>
            {text}
        </Alert>
    );
}
