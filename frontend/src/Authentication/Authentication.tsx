import style from "./Authentication.module.scss"
import { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { useUser } from "../hooks/useUser";
import Spinner from 'react-bootstrap/Spinner';


export default function Authentication({ children }: { children: ReactNode | ReactNode[] }) {
  const location = document.location.pathname;
  const { user, isLoading } = useUser();

  if (!isLoading) {
    if ((location === "/") && (user)) {
      return (<Navigate to={"/calendar"} />);
    }
    if ((location !== "/") && (!user)) {
      return (<Navigate to={"/"} />);
    }
  }

  return isLoading ? (
    <div className={style.div}>
      <Spinner animation="border" />
    </div>
  ) : (
    <>
      {children}
    </>
  );
}
