import { Outlet } from "react-router-dom";
import { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Head from "../Head/Head";
import Calendar from "../Calendar/Calendar";

export type Select = {
    view: "noSelection"
    date: null
    eventID: null
} | {
    view: "day"
    date: string
    eventID: null
} | {
    view: "redactor"
    date: string
    eventID: null | string
    isNew: boolean
}

export default function Layout() {
    const [select, setSelect] = useState<Select>({ view: "noSelection", date: null, eventID: null })

    return (
        <>
            <Head />
            <Container fluid className="mt-4 px-5">
                <Row xs={1} md={2}>
                    <Col className="gy-1">
                        <Calendar select={select} setSelect={setSelect} />
                    </Col>
                    <Col className="gy-1">
                        <Outlet context={{ select, setSelect }} />
                    </Col>
                </Row>
            </Container>
        </>
    );
}
