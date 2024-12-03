import { useNavigate, useParams } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import { Card, Descriptions, Typography, Steps, Button, Row, Col, Image } from "antd";
import { fetchProduct } from "../../Api/api";
import CreditCardFormComponent from "../CreditCards/CreditCardFormComponent";
import {checkURL} from "../../Utils/UtilsURL";

const { Title } = Typography;
const { Step } = Steps;

let CreateTransactionComponent = (props) => {
    const { openNotification } = props;
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState({});
    const [seller, setSeller] = useState({});
    const [creditCards, setCreditCards] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        getProduct();
    }, [id]);

    const getProduct = async () => {
        let response = await fetchProduct(id);
        if (response.ok) {
            let jsonData = await response.json();
            if (jsonData.buyerId) {
                navigate("/products");
            }
            const productWithImage = await getImage(jsonData);
            setProduct(productWithImage);
            await getSeller(jsonData.sellerId);
            await getCreditCards();
        } else {
            openNotification("top", "Error fetching product details", "error");
        }
    };

    const getCreditCards = async () => {
        let response = await fetch(
            `${process.env.REACT_APP_BACKEND_BASE_URL}/creditCards`,
            {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
            }
        );

        if (response.ok) {
            let jsonData = await response.json();
            setCreditCards(jsonData);
        } else {
            openNotification("top", "Error fetching credit cards", "error");
        }
    }

    const getSeller = async (sellerId) => {
            let response = await fetch(
                `${process.env.REACT_APP_BACKEND_BASE_URL}/users/${sellerId}`,
                {
                    method: "GET",
                    headers: {
                        "apikey": localStorage.getItem("apiKey")
                    },
                }
            );

            if (response.ok) {
                let jsonData = await response.json();
                setSeller(jsonData);
            } else {
                openNotification("top", "Error fetching seller information", "error");
            }
    };


    const getImage = async (product) => {
        const urlImage = `${process.env.REACT_APP_BACKEND_BASE_URL}/images/${product.id}.png`;
        const existsImage = await checkURL(urlImage);
        product.image = existsImage ? urlImage : "/imageMockup.png";
        return product;
    };

    const nextStep = () => setCurrentStep(currentStep + 1);
    const prevStep = () => setCurrentStep(currentStep - 1);

    const steps = [
        {
            title: "Product Details",
            content: (
                <Card style={{ marginTop: 20 }}>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Image src={product.image || "/imageMockup.png"} alt="Product Image" width="100%" />
                        </Col>
                        <Col span={16}>
                            <Descriptions title="Product Information" column={1}>
                                <Descriptions.Item label="Name">{product.title}</Descriptions.Item>
                                <Descriptions.Item label="Price">{product.price}€</Descriptions.Item>
                                <Descriptions.Item label="Category">{product.category}</Descriptions.Item>
                                <Descriptions.Item label="Seller">{seller.name}</Descriptions.Item>
                                <Descriptions.Item label="Contact">{seller.email}</Descriptions.Item>
                            </Descriptions>
                        </Col>
                    </Row>
                </Card>
            ),
        },
        {
            title: "Payment Options",
            content: (
                <Card style={{ marginTop: 20 }}>
                    <CreditCardFormComponent openNotification={openNotification}
                                             product={product}
                                             creditCards={creditCards}
                    />
                </Card>
            ),
        }
    ];


    return (
        <Fragment>
            <Card style={{ padding: '20px', maxWidth: 900, margin: "auto" }}>
                <Title level={1} style={{ textAlign: "center" }}>Checkout</Title>
                <Steps current={currentStep} style={{ marginBottom: 20 }}>
                    {steps.map((step, index) => (
                        <Step key={index} title={step.title} />
                    ))}
                </Steps>
                <div className="steps-content" style={{ padding: 20 }}>{steps[currentStep].content}</div>
                <Fragment className="steps-action" style={{ marginTop: 20, textAlign: "center" }}>
                    {currentStep > 0 && (
                        <Button style={{ marginRight: 8 }} onClick={prevStep}>
                            Previous
                        </Button>
                    )}
                    {currentStep < steps.length - 1 && (
                        <Button
                            type="primary"
                            onClick={nextStep}
                            disabled={product.buyerId}
                        >
                            Next
                        </Button>
                    )}
                </Fragment>
            </Card>
        </Fragment>
    );
};

export default CreateTransactionComponent;
