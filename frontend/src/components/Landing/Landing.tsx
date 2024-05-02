import style from "./Landing.module.scss";
import GoogleBtn from "../GoogleBtn/GoogleBtn";

export default function Landing() {
    return (
        <div className={style.parentContainer}>
            <div className={style.container}>
                <div className={style.logoAndTitle} >
                    <img className={style.logo + " me-3"} src="/ReminderLogo512.png" width={48} height={48} />
                    <span className={style.title}>Reminder</span>
                </div>
                Enter to continue:
                <GoogleBtn />
            </div>
        </div>

    );
}
