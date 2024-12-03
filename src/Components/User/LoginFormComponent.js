import {useState} from "react";
import {modifyStateProperty} from "../../Utils/UtilsState";
import {Card, Col, Row, Form, Input, Button, Typography} from "antd";
import {useNavigate} from 'react-router-dom';
import {
    validateFormDataInputRequired,
    validateFormDataInputEmail,
    allowSubmitForm,
    setServerErrors,
    joinAllServerErrorMessages
} from "../../Utils/UtilsValidations"
import {LockOutlined, MailOutlined} from "@ant-design/icons";

let LoginFormComponent = (props) => {
    const {Title} = Typography
    let {setLogin, openNotification} = props
    let navigate = useNavigate();

    // validación
    let requiredInForm = ["email","password"]
    let [formErrors, setFormErrors] = useState({})

    let [formData, setFormData] = useState({})

    let clickLogin = async () => {
        let response = await fetch(
            process.env.REACT_APP_BACKEND_BASE_URL + "/users/login", {
                method: "POST",
                headers: {"Content-Type": "application/json "},
                body: JSON.stringify(formData)
            })

        if (response.ok) {
            let responseBody = await response.json();
            if (responseBody.apiKey && responseBody.email) {
                localStorage.setItem("apiKey", responseBody.apiKey)
                localStorage.setItem("email", responseBody.email)
                localStorage.setItem("userId", responseBody.id)
            }
            console.log("ok " + responseBody)
            setLogin(true)
            openNotification("top", "Login successfull", "success")
            navigate("/products")
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;

            setServerErrors(serverErrors,setFormErrors)
            let notificationMsg = joinAllServerErrorMessages(serverErrors)
            openNotification("top",notificationMsg, "error" )

        }
    }

    return (
        <Row align="middle" justify="center" style={{minHeight: "70vh"}}>
            <Col xs={0} sm={0} md={12} lg={8} xl={6}>
                <img src="/iniciar-sesion.png" width="100%"/>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={10}>
                <Card  style={{margin: "15px", width: "100%"}}>
                    <Title level={2} style={{textAlign: "center"}}>
                        Log in Wallapep
                    </Title>
                    <Form.Item label=""
                               validateStatus={
                                   validateFormDataInputEmail(
                                       formData, "email", formErrors, setFormErrors) ? "success" : "error"}
                    >
                        <Input placeholder="your email"
                               prefix={<MailOutlined style={{ marginRight:"0.2em", color: "rgba(0,0,0,.45)" }} />}
                               onChange={(i) => {
                                   modifyStateProperty(formData, setFormData,
                                       "email", i.currentTarget.value)
                               }}/>
                        {formErrors?.email?.msg &&
                            <Typography.Text type="danger"> {formErrors?.email?.msg} </Typography.Text>}
                    </Form.Item>

                    <Form.Item label=""
                               validateStatus={
                                   validateFormDataInputRequired(
                                       formData, "password", formErrors, setFormErrors) ? "success" : "error"}
                    >
                        <Input.Password
                            placeholder="your password"
                            prefix={<LockOutlined style={{marginRight:"0.2em", color: "rgba(0,0,0,.45)" }} />}
                            onChange={(i) => {
                                modifyStateProperty(formData, setFormData,
                                    "password", i.currentTarget.value)
                            }}/>
                        {formErrors?.password?.msg &&
                            <Typography.Text type="danger"> {formErrors?.password?.msg} </Typography.Text>}
                    </Form.Item>

                    { allowSubmitForm(formData,formErrors,requiredInForm) ?
                        <Button type="primary" size={"large"} onClick={clickLogin} block >Login</Button> :
                        <Button type="primary" size={"large"} block disabled>Login</Button>
                    }
                </Card>
            </Col>
        </Row>
    )
}

export default LoginFormComponent;