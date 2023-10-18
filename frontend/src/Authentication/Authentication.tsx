import style from "./Authentication.module.scss"
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import Spinner from 'react-bootstrap/Spinner';
import axios from 'axios';
import { useAppSelector } from "../store";
import { setUser } from "../store/slicers/userSlice";

export default function Authentication({ children }: { children: JSX.Element }) {
  const [status, setStatus] = useState("Loading" as "OK" | "Loading");
  const user = useAppSelector();
  const location = document.location.pathname;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if ((location === "/") && (user)) {
      navigate("/calendar");
    } else if (!user) {
      axios.get("/api/user")
        .then((res) => {
          dispatch(setUser(res.data));
          setStatus("OK");
        })
        .catch(() => {
          if (location !== "/") {
            navigate("/");
          }
        });
    } else {
      setStatus("OK");
    }
  }, [user]);

  if ((location === "/") || (status === "OK")) {
    return (
      <>
        {children}
      </>
    );
  } else {
    return (<div className={style.div}><Spinner animation="border" /></div>);
  }
}
