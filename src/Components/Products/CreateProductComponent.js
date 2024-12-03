import { useState } from "react";
import { modifyStateProperty } from "../../Utils/UtilsState";
import { Card, Input, Button, Row, Col, Form, Typography, Upload, Select, Alert } from "antd";
import { categories } from "../../Static/categories";
import { validateFormDataInputRequired, validateFormDataPrice } from "../../Utils/UtilsValidations";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

let CreateProductComponent = (props) => {
    const navigate = useNavigate();
    const { openNotification } = props;

    let [formData, setFormData] = useState({});
    let [formErrors, setFormErrors] = useState({});
    let [serverErrors, setServerErrors] = useState({});
    const { Title, Text } = Typography;
    let requiredFields = ["title", "description", "price", "category", "image"];

    let clickCreateProduct = async () => {
        let response = await fetch(
            process.env.REACT_APP_BACKEND_BASE_URL + "/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "apikey": localStorage.getItem("apiKey")
                },
                body: JSON.stringify(formData)
            });

        if (response.ok) {
            let data = await response.json();
            await uploadImage(data.productId);
            openNotification("top", "Product created!", "success");
            navigate("/products/own");
        } else {
            let responseBody = await response.json();
            const fieldErrors = responseBody.errors.reduce((acc, error) => {
                acc[error.field] = error.msg;
                return acc;
            }, {});
            setServerErrors(fieldErrors);
        }
    };

    let uploadImage = async (productId) => {
        let formDataPhotos = new FormData();
        formDataPhotos.append('image', formData.image);
        formDataPhotos.append('productId', productId);

        let response = await fetch(
            process.env.REACT_APP_BACKEND_BASE_URL + "/products/" + productId + "/image", {
                method: "POST",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
                body: formDataPhotos
            });
        if (!response.ok) {
            let responseBody = await response.json();
            const fieldErrors = responseBody.errors.reduce((acc, error) => {
                acc[error.field] = error.msg;
                return acc;
            }, {});
            setServerErrors(fieldErrors);
        }
    };

    let clearFields = () => {
        setFormData({
            title: '',
            description: '',
            price: '',
            category: '',
            image: null,
        });
        setFormErrors({});
        setServerErrors({});
    };

    return (
        <Row align="middle" justify="center" style={{ minHeight: "70vh" }}>
            <Col>
                <Card style={{ width: "500px" }}>
                    <Title level={2} style={{ textAlign: "center", marginBottom: "20px" }}>
                        Submit your product
                    </Title>
                    <Form.Item
                        validateStatus={validateFormDataInputRequired(formData, "title", formErrors, setFormErrors) ? "success" : "error"}
                    >
                        <Input
                            value={formData.title}
                            onChange={(i) => modifyStateProperty(formData, setFormData, "title", i.currentTarget.value)}
                            size="large"
                            type="text"
                            placeholder="Product title"
                        />
                        {formErrors?.title?.msg && <Text type="danger">{formErrors?.title?.msg}</Text>}
                        {serverErrors?.title&& <Text type="danger">{serverErrors.title}</Text>}
                    </Form.Item>

                    <Form.Item
                        validateStatus={validateFormDataInputRequired(formData, "description", formErrors, setFormErrors) ? "success" : "error"}
                    >
                        <Input
                            value={formData.description}
                            onChange={(i) => modifyStateProperty(formData, setFormData, "description", i.currentTarget.value)}
                            size="large"
                            type="text"
                            placeholder="Product description"
                        />
                        {formErrors?.description?.msg && <Text type="danger">{formErrors?.description?.msg}</Text>}
                        {serverErrors?.description&& <Text type="danger">{serverErrors.description}</Text>}
                    </Form.Item>

                    <Form.Item
                        validateStatus={validateFormDataPrice(formData, "price", formErrors, setFormErrors) ? "success" : "error"}
                    >
                        <Input
                            suffix="€"
                            value={formData.price}
                            onChange={(i) => modifyStateProperty(formData, setFormData, "price", i.currentTarget.value)}
                            size="large"
                            type="number"
                            placeholder="Price"
                        />
                        {formErrors?.price?.msg && <Text type="danger">{formErrors?.price?.msg}</Text>}
                        {serverErrors?.price && <Text type="danger">{serverErrors.price}</Text>}
                    </Form.Item>

                    <Form.Item
                        validateStatus={validateFormDataInputRequired(formData, "category", formErrors, setFormErrors) ? "success" : "error"}
                        help={serverErrors.category || formErrors?.category?.msg}
                    >
                        <Select
                            value={formData.category}
                            onChange={(value) => modifyStateProperty(formData, setFormData, "category", value)}
                            size="large"
                            placeholder="Select category"
                        >
                            {categories.map(category => (
                                <Option key={category.name} value={category.name}>
                                    <img src={category.icon} alt="" style={{ width: 20, marginRight: 8 }} />
                                    {category.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="image"
                        validateStatus={validateFormDataInputRequired(formData, "image", formErrors, setFormErrors) ? "success" : "error"}
                        help={serverErrors.image || formErrors?.image?.msg}
                    >
                        <Upload
                            maxCount={1}
                            beforeUpload={(file) => {
                                modifyStateProperty(formData, setFormData, "image", file);
                                return false;
                            }}
                            listType="picture-card"
                            showUploadList={false}
                        >
                            {formData.image ? <img src={URL.createObjectURL(formData.image)} alt="Product" style={{ width: '100%' }} /> : 'Upload'}
                        </Upload>
                    </Form.Item>
                    <Button
                        type="primary"
                        size="large"
                        disabled={!requiredFields.every((field) => formData[field])}
                        block
                        onClick={clickCreateProduct}
                    >
                        Sell Product
                    </Button>

                    <Button
                        type="default"
                        size="large"
                        style={{ marginTop: "10px" }}
                        onClick={clearFields}
                    >
                        Clear Fields
                    </Button>
                </Card>
            </Col>
            <Col>
                <img alt="submit product logo" src="/pages/submit.png" width={400} />
            </Col>
        </Row>
    );
};

export default CreateProductComponent;
