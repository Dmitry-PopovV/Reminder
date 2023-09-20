import style from "./Landing.module.scss"

export default function Lending() {
    return (
      <div className={style.container}>
        <div className={style.header}>Reminder</div>
        <div>
          Login with Google to start
        </div>
      </div>
    );
  }