import style from "./Authentication.module.scss"
import { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { useUser } from "../hooks/useUser";
import Spinner from 'react-bootstrap/Spinner';


export default function Authentication({ children }: { children: ReactNode | ReactNode[] }) {
  const location = document.location.pathname;
  const { user, isLoading } = useUser();
  let navigating = { isUsing: false, to: "" };

  if (!isLoading) {
    if ((location === "/") && (user)) {
      navigating = { isUsing: true, to: "/calendar" };
    }
    if ((location !== "/") && (!user)) {
      navigating = { isUsing: true, to: "/" };
    }
  }

  if (navigating.isUsing) {
    return (<Navigate to={navigating.to} />);
  } else if (!isLoading) {
    return (
      <>
        {children}
      </>
    );
  } else {
    return (<div className={style.div}><Spinner animation="border" /></div>);
  }
}
