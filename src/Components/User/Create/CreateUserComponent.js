import { useState } from "react";
import {Row, Col, Card, Typography, Steps, Button, Alert} from "antd";
import PersonalDataForm from "./PersonalDataForm";
import DocumentationForm from "./DocumentationForm";
import GeolocationForm from "./GeolocationForm";
import { useNavigate } from "react-router-dom";
import {GlobalOutlined, SolutionOutlined, UserOutlined} from "@ant-design/icons";

const { Title } = Typography;
const { Step } = Steps;

const CreateUserComponent = (props) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({});
    const [formErrors, setFormErrors] = useState({});
    const [serverErrors, setServerErrors] = useState([]);
    const [currentStep, setCurrentStep] = useState(1);
    const { openNotification } = props;

    let requiredFields = ["email", "password"];

    const clickCreate = async () => {
        const response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL + "/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            const responseBody = await response.json();
            openNotification("top", "¡Account created! please, log in to start shopping", "success");
            navigate("/login");
        } else {
            const responseBody = await response.json();
            setServerErrors(responseBody.errors);
            setCurrentStep(1);
            serverErrors.forEach((e) => console.log("Error: " + e.msg));
        }
    };

    const next = () => {
        setCurrentStep((prev) => prev + 1);
    };

    const prev = () => {
        setCurrentStep((prev) => prev - 1);
    };

    return (
        <Row align="middle" justify="center" style={{ minHeight: "70vh" }}>
            <Col xs={0} sm={0} md={12} lg={8} xl={6}>
                <img src="/signup.svg" width="100%" alt="Sign Up"/>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={10}>
                <Card style={{ width: "100%", margin: "15px" }}>
                    <Title level={2} style={{ textAlign: "center", marginBottom: "20px" }}>
                        Sign Up in Wallapep
                    </Title>

                    <Steps current={currentStep - 1} style={{ marginBottom: "20px" }}>
                        <Step icon={<SolutionOutlined />} title="Mandatory data" />
                        <Step  icon={<UserOutlined />} title="Personal data" />
                        <Step icon={<GlobalOutlined />} title="Geolocation data" />
                    </Steps>

                    {serverErrors.length > 0 && (
                        <Alert
                            message="There were some errors with your submission:"
                            description={
                                <ul style={{ margin: 0, paddingLeft: "20px" }}>
                                    {serverErrors.map((error, index) => (
                                        <li key={index}>{error.msg}</li>
                                    ))}
                                </ul>
                            }
                            type="error"
                            showIcon
                            style={{ marginBottom: "20px" }}
                        />
                    )}
                    {currentStep === 1 && (
                        <PersonalDataForm
                            formData={formData}
                            setFormData={setFormData}
                            serverErrors={serverErrors}
                            formErrors={formErrors}
                            setFormErrors={setFormErrors}
                        />
                    )}
                    {currentStep === 2 && (
                        <DocumentationForm
                            formData={formData}
                            setFormData={setFormData}
                            formErrors={formErrors}
                            setFormErrors={setFormErrors}
                        />
                    )}
                    {currentStep === 3 && (
                        <GeolocationForm
                            formData={formData}
                            setFormData={setFormData}
                            formErrors={formErrors}
                            setFormErrors={setFormErrors}
                        />
                    )}

                    <div style={{ marginTop: "20px", textAlign: "center" }}>
                        {currentStep < 3 ? (
                            <Button type="primary"
                                    size="large"
                                    disabled={!requiredFields.every((field) => formData[field])}
                                    block onClick={next}>
                                Next
                            </Button>
                        ) : (
                            <Button type="primary" size="large" block onClick={clickCreate}>
                                Submit
                            </Button>
                        )}
                        {currentStep > 1 && (
                            <Button block onClick={prev} style={{ marginTop: "10px" }}
                                    type="default"
                                    size="large">
                                Back
                            </Button>
                        )}
                    </div>
                </Card>
            </Col>
        </Row>
    );
};

export default CreateUserComponent;
