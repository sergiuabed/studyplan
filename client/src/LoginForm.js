import { useState } from "react";
import { Form, Row, Col, Button, Alert } from "react-bootstrap";
import { FloatingLabel } from "react-bootstrap";
//import FilmsNavBar from "./FilmsNavbar";

function LoginForm(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [warning, setWarning] = useState(0);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (username === "" || password === "") {
            return setWarning(1);
        }

        if (!username.includes("@") || !username.includes("."))
            return setWarning(2);

        try {
            await props.handleLogin(username, password);
        } catch (e) {
            console.log("Username and/or password wrong!");
            setWarning(3);
        }
    }

    return (
        <>
            <Row className="justify-content-md-center loginRow">
                <Col sm={"4"} className="login">
                    <h2>Log In</h2>
                    <Form onSubmit={handleSubmit}>
                        <FloatingLabel
                            controlId="floatingInput"
                            label="Email address"
                            className="mb-3"
                        >
                            <Form.Control type="email" placeholder="name@example.com" onChange={(event) => {
                                setUsername(event.target.value)
                            }} />
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingPassword" label="Password">
                            <Form.Control type="password" placeholder="Password" onChange={(event) => { setPassword(event.target.value) }} />
                        </FloatingLabel>
                        <br />
                        <Button variant="primary" size="lg" type="submit">Log In</Button>
                    </Form>
                </Col>
            </Row>
            <Row>
                <Col sm={"10"}>
                    {warning === 1 && <Alert className={"addBorder warningMsg"} variant={"danger"} dismissible>One or both fields empty!</Alert>}
                    {warning === 2 && <Alert className={"addBorder warningMsg"} variant={"danger"} dismissible>Username wrongly formated!</Alert>}
                    {warning === 3 && <Alert className={"addBorder warningMsg"} variant={"danger"} dismissible>Username and/or password wrong!</Alert>}
                </Col>
            </Row>
        </>
    );
}

export default LoginForm;

//onClick={() => {
//    if(username==="" || password==="")
//        return setWarning(1)
//
//    if(!username.includes("@") || !username.includes("."))
//        return setWarning(2);
//
//}}