import style from "./GoogleBtn.module.scss"
import { useGoogleLogin } from '@react-oauth/google';
import Spinner from 'react-bootstrap/Spinner';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useUser } from "../hooks/useUser";

export default function GoogleBtn() {
    const [status, setStatus] = useState<"OK" | "Loading">("OK");
    const { setUser } = useUser();

    useEffect(() => {
        const params: any = {};
        const url = document.location.search;
        if ((url != '') && (status === "OK")) {
            setStatus("Loading");

            url.replace('?', '').split('&').forEach((str) => {
                const a = str.split('=');
                params[decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
            });

            axios.post('/api/auth/registration', params)
                .then((res) => {
                    setUser(res.data);
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
