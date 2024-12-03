import { useState, useEffect } from "react";
import {useParams, useNavigate, Link} from 'react-router-dom';
import {Typography, Card, Image, Button, Tag, Row, Col, Spin, Alert, Avatar} from 'antd';
import { ShoppingOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { categories } from "../../Static/categories";
import { checkURL } from "../../Utils/UtilsURL";


const { Title, Text } = Typography;

let DetailsProductComponent = (props) => {
    const { id } = useParams();
    const { openNotification } = props;
    let navigate = useNavigate();

    const [product, setProduct] = useState({});
    const [seller, setSeller] = useState({});
    const [error, setError] = useState(false);

    useEffect(() => {
        getProduct(id);
    }, [id]);

    const getProduct = async (id) => {
        setError(false);
        try {
            let response = await fetch(
                `${process.env.REACT_APP_BACKEND_BASE_URL}/products/${id}`,
                {
                    method: "GET",
                    headers: {
                        "apikey": localStorage.getItem("apiKey")
                    },
                }
            );

            if (response.ok) {
                let jsonData = await response.json();
                const productWithImage = await getImage(jsonData);
                setProduct(productWithImage);
                await getSeller(jsonData.sellerId);
            } else {
                setError(true);
                openNotification("top", "Error fetching product details", "error");
            }
        } catch (error) {
            setError(true);
            openNotification("top", "Error fetching product details", "error");
        }
    };

    const getImage = async (product) => {
        const urlImage = `${process.env.REACT_APP_BACKEND_BASE_URL}/images/${product.id}.png`;
        const existsImage = await checkURL(urlImage);
        product.image = existsImage ? urlImage : "/imageMockup.png";
        return product;
    };

    const getSeller = async (sellerId) => {
        try {
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
        } catch (error) {
            openNotification("top", "Error fetching seller information", "error");
        }
    };


    const clickReturn = () => {
        navigate("/products");
    };

    const proceedToCheckout = () => {
        navigate(`/checkout/${product.id}`);
    }

    const category = categories.find(cat => cat.name === product.category) || {};

    return (
        <Card
            title={<Title level={2} style={{ textAlign: "center"}}>Product Details</Title>}
            extra={<Button justifyContent={"right"} onClick={clickReturn} icon={<ArrowLeftOutlined />}>Back</Button>}
            style={{ maxWidth: "800px", margin: "auto", marginTop: 20 }}
        >
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                        <Image
                            src={product.image}
                            fallback="/imageMockup.png"
                            style={{ width: "100%", borderRadius: "8px" }}
                        />
                    </Col>
                    <Col xs={24} md={12} style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <Text strong style={{ fontSize: 28 }}>{product.title}</Text>
                        <Text strong style={{ fontSize: 30, color: "#d32f2f" }}>{product.price}€</Text>
                        <Text style={{ marginTop: 10, fontSize: 20}}>{product.description}</Text>
                        <Text style={{ marginTop: 10, fontSize: 18 }}>
                            Seller:
                            <Avatar style={{ backgroundColor: "rgb(36,175,126)", verticalAlign: 'middle', marginLeft: 10 }}>{seller.name?.charAt(0)}</Avatar>
                            <Link to={`/users/${seller.id}`}>{seller.name}</Link>
                        </Text>
                        {category.icon && (
                            <Tag style={{marginTop: 6, fontSize:16}} color={category.color} icon={<img src={category.icon} alt={category.name} style={{ width: 25, marginRight: 6}} />}>
                                {product.category}
                            </Tag>
                        )}
                        {product.buyerEmail !== null && (
                            <Alert
                                message="Product already sold"
                                description={`This product was bought by another user`}
                                type="warning"
                                showIcon
                                marginTop={10}
                                style={{ marginTop: 10 }}
                            />
                        )}
                        <Button
                            type="primary"
                            icon={<ShoppingOutlined />}
                            size="large"
                            disabled={product.buyerEmail !== null}
                            block
                            style={{ marginTop: 20 }}
                            onClick={proceedToCheckout}
                        >
                            Buy Now
                        </Button>
                    </Col>
                </Row>
        </Card>
    );
};

export default DetailsProductComponent;
