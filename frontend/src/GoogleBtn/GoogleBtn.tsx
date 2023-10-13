import style from "./GoogleBtn.module.scss"
import { useGoogleLogin } from '@react-oauth/google';
import Spinner from 'react-bootstrap/Spinner';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from "react-router";
import { useEffect } from 'react';

export default function GoogleBtn() {
    const [status, setStatus] = useState("OK" as "OK" | "Loading");
    const navigate = useNavigate();

    useEffect(() => {
        const params: any = {};
        const url = document.location.search;
        if ((url != '') && (status === "OK")) {
            setStatus("Loading");

            url.replace('?', '').split('&').forEach((str) => {
                const a = str.split('=');
                params[decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
            });

            axios.post('/api/registration', params)
                .then((res) => {
                    console.log(res.data);

                    navigate("/calendar");
                })
                .catch((error) => {
                    console.log(error)
                });
        }
    }, []);


    const login = useGoogleLogin({
        flow: 'auth-code',
        ux_mode: "redirect",
        redirect_uri: "http://localhost:3001"
    });

    switch (status) {
        case 'OK':
            return (<div className={style.googleBtn} onClick={() => login()} />);
        case 'Loading':
            return (<Spinner className={style.spinner} animation="border" />);
    }
}
