import { useState, useEffect, Fragment } from "react";
import {Link, useNavigate} from "react-router-dom";
import {
    Card,
    Col,
    Row,
    Typography,
    Input,
    Button,
    Tag,
    Collapse,
    Slider,
    InputNumber,
    Spin,
    Empty,
    Descriptions,
    Pagination,
    Divider
} from 'antd';
import { categories } from "../../Static/categories";
import { checkURL } from "../../Utils/UtilsURL";
import {FilterOutlined, SearchOutlined, ShoppingOutlined} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Panel } = Collapse;

const ListProductsComponent = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const navigate = useNavigate();
    const [categoryCounts, setCategoryCounts] = useState({});
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [titleFilter, setTitleFilter] = useState("");
    const [minPrice, setMinPrice] = useState(1);
    const [maxPrice, setMaxPrice] = useState(null);
    const [maxFixedPrice, setMaxFixedPrice] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 6;

    useEffect(() => {
        getProducts();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [products, selectedCategories, titleFilter, minPrice, maxPrice]);

    const getProducts = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/products`, {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey"),
                },
            });

            if (response.ok) {
                const jsonData = await response.json();
                const promisesForImages = jsonData.map(async (p) => {
                    const urlImage = `${process.env.REACT_APP_BACKEND_BASE_URL}/images/${p.id}.png`;
                    const existsImage = await checkURL(urlImage);
                    p.image = existsImage ? urlImage : "/imageMockup.png";
                    return p;
                });

                const productsWithImage = await Promise.all(promisesForImages);
                const availableProducts = productsWithImage.filter(p => p.buyerEmail === null);
                setProducts(availableProducts);
                setFilteredProducts(availableProducts);

                const maxPriceValue = Math.max(...availableProducts.map(p => p.price));
                setMaxPrice(maxPriceValue);
                setMaxFixedPrice(maxPriceValue);

                const counts = {};
                categories.forEach(cat => {
                    counts[cat.name] = availableProducts.filter(p => p.category === cat.name).length;
                });
                setCategoryCounts(counts);
            }
        } catch (error) {
            console.error("Error fetching products", error);
        }
    };

    const applyFilters = () => {
        const filtered = products.filter((product) => {
            const matchesCategory = selectedCategories.length > 0
                ? selectedCategories.some((category) => product.category?.toLowerCase() === category.toLowerCase())
                : true;
            const matchesTitle = titleFilter ? product.title.toLowerCase().includes(titleFilter.toLowerCase()) : true;
            const matchesMinPrice = product.price >= minPrice;
            const matchesMaxPrice = product.price <= maxPrice;
            return matchesCategory && matchesTitle && matchesMinPrice && matchesMaxPrice;
        });
        setFilteredProducts(filtered);
        setCurrentPage(1);
    };

    const handleCategoryClick = (category) => {
        setSelectedCategories((prev) =>
            prev.includes(category) ? prev.filter((cat) => cat !== category) : [...prev, category]
        );
    };

    const clearFilters = () => {
        setSelectedCategories([]);
        setTitleFilter("");
        setMinPrice(1);
        setMaxPrice(maxFixedPrice);
        setFilteredProducts(products);
        setCurrentPage(1);
    };

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const proceedToCheckout = (id ) => {
        navigate(`/checkout/${id}`);
    }
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <Fragment style={{ padding: "20px" }}>
            <Title level={1} style={{ textAlign: "center", marginBottom: "20px" }}>
                <img alt={"catalog logo"} src={"/catalog.png"} width={200}/>
                Product Catalog
            </Title>
            <Divider />
            <Descriptions>
                <Descriptions.Item label="Total products">{products.length}</Descriptions.Item>
            </Descriptions>
            <Row gutter={[16, 16]} justify="center" style={{ marginBottom: "20px" }}>
                <Col span={24}>
                    <Input
                        placeholder="Search by Title"
                        prefix={<SearchOutlined />}
                        value={titleFilter}
                        size="large"
                        style={{ width: "100%", fontSize: "24px" }}
                        onChange={(e) => setTitleFilter(e.target.value)}
                    />
                </Col>
            </Row>

            <Collapse defaultActiveKey={['1']} style={{ marginBottom: "20px" }}>
                <Panel
                    header={<><FilterOutlined /> <Text style={{ fontSize: "18px" }}>Filters</Text></>}
                    key="1"
                >
                    <Title level={4}>Select Categories</Title>
                    <Row gutter={[8, 8]} justify="center" style={{ marginBottom: "20px" }}>
                        {categories.map((category) => (
                            <Tag
                                key={category.name}
                                color={selectedCategories.includes(category.name) ? "blue" : category.color}
                                onClick={() => handleCategoryClick(category.name)}
                                style={{
                                    cursor: "pointer",
                                    padding: "5px 10px",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    fontSize: "16px"
                                }}
                                icon={<img src={category.icon} alt={category.name} style={{ width: "20px", marginRight: "6px" }} />}
                            >
                                {category.name} ({categoryCounts[category.name] || 0})
                            </Tag>
                        ))}
                    </Row>
                    <Title level={4}>Price Range</Title>
                    <Slider
                        range
                        min={1}
                        max={maxFixedPrice}
                        value={[minPrice, maxPrice]}
                        onChange={(value) => {
                            setMinPrice(value[0]);
                            setMaxPrice(value[1]);
                        }}
                        marks={{
                            1: '1€',
                            [maxFixedPrice]: `${maxFixedPrice}€`,
                        }}
                    />
                    <Row gutter={8} style={{ marginTop: "10px" }}>
                        <Col span={12}>
                            <InputNumber
                                min={1}
                                value={minPrice}
                                onChange={setMinPrice}
                                style={{ width: "100%" }}
                                size="large"
                            />
                        </Col>
                        <Col span={12}>
                            <InputNumber
                                min={1}
                                max={maxFixedPrice}
                                value={maxPrice}
                                onChange={setMaxPrice}
                                style={{ width: "100%" }}
                                size="large"
                            />
                        </Col>
                    </Row>
                    <Button block size="large" onClick={clearFilters} style={{ marginTop: "10px" }}>
                        Clear Filters
                    </Button>
                </Panel>
            </Collapse>

            {currentProducts.length > 0 ? (
                <>
                    <Row gutter={[16, 16]}>
                        {currentProducts.map((p) => (
                            <Col xs={24} sm={12} md={8} lg={8} key={p.id}>
                                <Link to={`/products/${p.id}`}>
                                    <Card
                                        hoverable
                                        cover={<img src={p.image} alt={p.title} style={{ height: "250px", objectFit: "cover" }} />}
                                        style={{ borderRadius: "8px" }}
                                    >
                                        <Title level={4}>{p.title}</Title>
                                        <Text strong style={{ fontSize: "18px", color: "#d32f2f" }}>{p.price}€</Text>
                                        <Button
                                            type="primary"
                                            icon={<ShoppingOutlined />}
                                            disabled={p.buyerEmail !== null}
                                            block
                                            style={{ marginTop: 10 }}
                                            onClick={(e) => {
                                                e.preventDefault()
                                                proceedToCheckout(p.id)
                                            }}
                                        >
                                            Buy Now
                                        </Button>
                                    </Card>
                                </Link>
                            </Col>
                        ))}
                    </Row>
                    <Divider />
                    <Pagination
                        current={currentPage}
                        pageSize={productsPerPage}
                        total={filteredProducts.length}
                        onChange={handlePageChange}
                        style={{ textAlign: "center", marginTop: "20px" }}
                    />
                </>
            ) : (
                <Empty description="No products found" style={{ paddingTop: "50px" }} />
            )}
        </Fragment>
    );
};

export default ListProductsComponent;
