import { Outlet } from "react-router-dom";
import { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Head from "../Head/Head";
import Calendar from "../Calendar/Calendar";
import { Select } from "../types/Select";


export default function Layout() {
	const [select, setSelect] = useState<Select>({view: "noSelection", date: null, eventID: null})

	return ( 
		<div>
			<Head />
			<Container fluid>
				<Row xs={1} md={2}>
					<Col className="gy-1">
						<Calendar setSelect={setSelect}/>
					</Col>
					<Col className="gy-1">
						<Outlet context={[select, setSelect]}/>
					</Col>
				</Row>
			</Container>
		</div>
	);
}
