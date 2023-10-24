import style from "./Authentication.module.scss"
import { Navigate, useLocation } from 'react-router';
import { Outlet } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import Spinner from 'react-bootstrap/Spinner';


export default function Authentication() {
  const location = useLocation()
  const { user } = useUser();

  if (user !== undefined) {
    if ((location.pathname === "/") && (user)) {
      return (<Navigate to={"/calendar"} />);
    }
    if ((location.pathname !== "/") && (!user)) {
      return (<Navigate to={"/"} />);
    }
  }

  return (user === undefined) ? (
    <div className={style.div}>
      <Spinner animation="border" />
    </div>
  ) : (
    <>
      <Outlet />
    </>
  );
}
