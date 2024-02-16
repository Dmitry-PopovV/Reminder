import style from "./Landing.module.scss";
import GoogleBtn from "../GoogleBtn/GoogleBtn";

export default function Landing() {
    return (
        <div className={style.container}>
            <div className={style.header}>Reminder</div>
            <GoogleBtn />
        </div>
    );
}
