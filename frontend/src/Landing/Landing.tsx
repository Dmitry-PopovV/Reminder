import style from "./Landing.module.scss";
import { useGoogleLogin } from '@react-oauth/google';
import Spinner from 'react-bootstrap/Spinner';
import axios from 'axios';
import { useState } from 'react';
import { Navigate } from "react-router";

export default function Lending() {

  const [status, setStatus] = useState("OK" as "OK" | "Loading" | "Redirect");

  let params: any = {};
  let url = document.location.search;
  if ((url != '') && (status === "OK")) {
    setStatus("Loading");

    url.replace('?', '').split('&').forEach((str) => {
      const a = str.split('=');
      params[decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
    });

    axios.post('http://localhost:3000/api/registration', params)
      .then((res) => {
        console.log(res.data);
        
        setStatus("Redirect");
      })
      .catch((error) => {
        console.log(error)
      });
  }
  console.log(params);

  const login = useGoogleLogin({
    onSuccess: codeResponse => console.log(codeResponse),
    flow: 'auth-code',
    ux_mode: "redirect",
    redirect_uri: "http://localhost:5173"
  });

  switch (status) {
    case 'OK':
      return (
        <div className={style.container}>
          <div className={style.header}>Reminder</div>
          <div className={style.googleBtn} onClick={() => login()} />
        </div>
      );
    case 'Loading':
      return (<Spinner className={style.spinner} animation="border" />);
    case 'Redirect':
      return <Navigate to="/calendar" />;
  }
}
