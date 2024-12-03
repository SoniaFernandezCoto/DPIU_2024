import React, { Fragment } from "react";
import { Row, Col, Typography, Divider, Image, Card } from "antd";
import { categories } from "../../Static/categories";

const { Title, Paragraph } = Typography;
const { Meta } = Card;

const sampleSubcategories = {
    Electronics: [
        { name: "Smartphones", image: "/subcategories/smartphones.jpg" },
        { name: "Laptops", image: "/subcategories/laptops.jpg" },
        { name: "Audio Devices", image: "/subcategories/audio.jpg" },
    ],
    "Clothing and Accessories": [
        { name: "Men's Clothing", image: "/subcategories/man.jpg" },
        { name: "Women's Clothing", image: "/subcategories/woman.jpg" },
        { name: "Accessories", image: "/subcategories/accessories.jpg" },
    ],
    Jewellery: [
        { name: "Necklaces", image: "/subcategories/necklaces.jpg" },
        { name: "Rings", image: "/subcategories/rings.jpg" },
        { name: "Bracelets", image: "/subcategories/bracelets.jpg" },
    ],
    "Music and instruments": [
        { name: "Instruments", image: "/subcategories/instruments.jpg" },
        { name: "Records", image: "/subcategories/records.jpg" },
        { name: "Record Players", image: "/subcategories/player.jpg" },
    ],
    Outdoors: [
        { name: "Camping Equipment", image: "/subcategories/camping.jpg" },
        { name: "Garden supplies", image: "/subcategories/outdoor.jpeg" },
        { name: "Outdoor furniture", image: "/subcategories/outdoorf.jpg" },
    ],
    "Books and Stationery": [
        { name: "Books", image: "/subcategories/books.jpg" },
        { name: "E-readers", image: "/subcategories/ereaders.jpg" },
        { name: "Office Supplies", image: "/subcategories/office.jpg" },
    ],
    "Home and kitchen": [
        { name: "Appliances", image: "/subcategories/appliances.jpg" },
        { name: "Furniture", image:"/subcategories/furniture.jpg"},
        { name: "Cookware", image: "/subcategories/cookware.jpg" },
    ],
};

const HomePageComponent = () => {
    return (
        <Fragment style={{ padding: "20px" }}>
            <Title level={1} style={{ textAlign: "center", marginTop: "20px" }}>
                <img alt="welcome logo" src="/pages/welcome.png" width={400} />
                Welcome to Wallapep
            </Title>
            <Paragraph strong style={{ textAlign: "center", fontSize: "18px", maxWidth: "800px", margin: "auto" }}>
                Find the best second-hand products on our platform. We offer a wide variety of categories and products
                at great prices from trusted sellers. Don’t miss the opportunity to find exactly what you’re looking for!
                You can also sell your products and earn money. Enjoy Wallapep!
            </Paragraph>
            <Divider />
            <Title level={2} style={{ textAlign: "center" }}>
                Explore Our Categories
            </Title>
            <Row gutter={[16, 24]} justify="center">
                {categories.map((category) => (
                    <Col span={24} key={category.name} style={{ marginBottom: "40px" }}>
                        <Title level={3} style={{ textAlign: "center"}}>
                            <Image src={category.icon} style={{ width: 40, marginRight: "10px" }} />
                            {category.name}
                        </Title>
                        <Row gutter={[16, 16]} justify="center">
                            {sampleSubcategories[category.name]?.map((subcategory) => (
                                <Col xs={24} sm={12} md={8} lg={6} key={subcategory.name}>
                                    <Card
                                        cover={<img alt={subcategory.name} src={subcategory.image} style={{ height: "250px", objectFit: "cover" }}/>}
                                        style={{ textAlign: "center" ,height: "100%" }}
                                    >
                                        <Meta title={subcategory.name} />
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                        <Divider />
                    </Col>
                ))}
            </Row>
        </Fragment>
    );
};

export default HomePageComponent;
