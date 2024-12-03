import { Card, Col, Row, Typography, Pagination } from "antd";
import { Fragment, useEffect, useState } from "react";
import { checkURL } from "../../Utils/UtilsURL";
import {useNavigate} from "react-router-dom";

const { Title, Text } = Typography;

const ProductDisplayerComponent = ({ products }) => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [paginatedProducts, setPaginatedProducts] = useState([]);
    const pageSize = 4;

    useEffect(() => {
        getImages(products);
    }, [products]);

    useEffect(() => {
        paginateProducts();
    }, [currentPage, products]);

    const getImages = async (products) => {
        await Promise.all(
            products.map(async (p) => {
                const urlImage = `${process.env.REACT_APP_BACKEND_BASE_URL}/images/${p.id}.png`;
                const existsImage = await checkURL(urlImage);
                p.image = existsImage ? urlImage : "/imageMockup.png";
                return p;
            })
        );
        paginateProducts();
    };

    const paginateProducts = () => {
        const startIndex = (currentPage - 1) * pageSize;
        const paginated = products.slice(startIndex, startIndex + pageSize);
        setPaginatedProducts(paginated);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const navigateToProduct = (productId) => () => {
        navigate(`/products/${productId}`);
    }

    return (
        <Fragment>
            <Row gutter={[16, 16]} justify="center">
                {paginatedProducts.map((product) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                        <Card
                            hoverable
                            onClick={navigateToProduct(product.id)}
                            cover={
                                <img
                                    alt={product.title}
                                    src={product.image || "https://via.placeholder.com/300"}
                                    style={{ height: 200, objectFit: "cover" }}
                                />
                            }
                            style={{ height:400,  borderRadius: "8px"}}
                        >
                            <Title level={4}>{product.title}</Title>
                            <Text type="secondary" style={{ display: "block", marginBottom: "0.5em" }}>
                                Category: {product.category}
                            </Text>
                            <Title level={5} style={{ marginTop: "0.5em", color: "#1890ff" }}>
                                {product.price.toFixed(2)}€
                            </Title>
                            {product.buyerEmail && (
                                <Text type="danger" style={{ display: "block", marginTop: "0.5em" }}>
                                    Sold out
                                </Text>
                            )}
                        </Card>
                    </Col>
                ))}
            </Row>
            <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={products.length}
                onChange={handlePageChange}
                style={{ textAlign: "center", marginTop: "1em" }}
            />
        </Fragment>
    );
};

export default ProductDisplayerComponent;
