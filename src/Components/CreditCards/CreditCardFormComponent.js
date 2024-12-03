import {useState, Fragment} from "react";
import {Form, Input, Select, DatePicker, Button, Typography, Alert} from "antd";
import {templateToTimestamp, timestampToDate} from "../../Utils/UtilsDates";
import {useNavigate} from "react-router-dom";

const { Title } = Typography;

let CreditCardFormComponent = ({ openNotification, product, creditCards }) => {
    const [selectedCard, setSelectedCard] = useState({});
    const  navigate = useNavigate();
    const [serverErrors] = useState([]);
    let requiredFields = ["alias", "number", "expirationDate", "code"];

    const handleCardSelection = (value) => {
        const card = creditCards.find(card => card.alias === value);
        card.expirationDate = timestampToDate(card.expirationDate);
        setSelectedCard(card);
    };

    const buyProduct = async () => {
        selectedCard.expirationDate = templateToTimestamp(selectedCard.expirationDate);
            let response = await fetch(
                `${process.env.REACT_APP_BACKEND_BASE_URL}/transactions/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "apikey": localStorage.getItem("apiKey")
                    },
                    body: JSON.stringify({ productId: product.id , buyerPaymentId: selectedCard.id })
                }
            );

            if (response.ok) {
                openNotification("top", "Product bought successfully", "success");
                navigate(`/transactions/own`);
            } else {
                openNotification("top", "Error buying the product", "error");
            }
    };

    return (
        <Fragment>
            <Title level={2} style={{ textAlign: "center" }}>Payment Options</Title>
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

            <Form.Item>
                <Select
                    placeholder="Select one of your cards"
                    onChange={handleCardSelection}
                >
                    {creditCards.map((card) => (
                        <Select.Option key={card.id} value={card.alias}>
                            {card.alias}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item>
                <Input
                    type="text"
                    placeholder="Card Alias"
                    value={selectedCard.alias ?? selectedCard.alias}
                    disabled={true}
                />
            </Form.Item>

            <Form.Item>
                <Input
                    type="text"
                    placeholder="Card Number"
                    value={selectedCard && selectedCard.number}
                    disabled={true}
                />
            </Form.Item>

            <Form.Item>
                <DatePicker
                    placeholder="Expiration Date"
                    value={selectedCard.expirationDate &&  timestampToDate(selectedCard.expirationDate)}
                    disabled={true}
                    style={{ width: "100%" }}
                />
            </Form.Item>

            <Form.Item>
                <Input
                    type="text"
                    placeholder="CVV"
                    value={selectedCard.code && selectedCard.code }
                    disabled={true}
                />
            </Form.Item>

            <Button type="primary"
                    onClick={buyProduct}
                    disabled={!requiredFields.every((field) => selectedCard[field])}>
                Confirm Purchase
            </Button>

        </Fragment>
    );
};

export default CreditCardFormComponent;
