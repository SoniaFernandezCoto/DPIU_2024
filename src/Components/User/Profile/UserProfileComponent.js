import { useParams } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import {Card, Col, Descriptions, Divider, Row, Typography} from "antd";
import countries from "../../../Static/countries";
import DisplayTransactionsTable from "../../Transactions/DisplayTransactionsTable";
import ProductDisplayerComponent from "../../Products/ProductDisplayerComponent";

let UserProfileComponent = (props) => {
    const { id } = useParams();
    const { Title } = Typography;

    let [user, setUser] = useState({});
    let [products, setProducts] = useState([]);
    let [transactions, setTransactions] = useState([]);
    let [countryFlag, setCountryFlag] = useState("");

    useEffect(() => {
        getUserData();
    }, [id]);

    useEffect(() => {
        if (user.country) {
            fetchCountryFlag(user.country);
        }
    }, [user.country]);

    let getUserData = async () => {
        let response = await fetch(
            process.env.REACT_APP_BACKEND_BASE_URL + "/users/" + id,
            {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
            });

        if (response.ok) {
            let jsonData = await response.json();
            setUser(jsonData);
            await getProducts();
            await getTransactions();
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach(e => {
                console.log("Error: " + e.msg);
            });
        }
    };

    let getProducts = async () => {
        let response = await fetch(
            process.env.REACT_APP_BACKEND_BASE_URL + "/products?sellerId=" + id,
            {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
            });

        if (response.ok) {
            let jsonData = await response.json();
            jsonData.map(product => {
                product.key = product.id;
                return product;
            });
            setProducts(jsonData);
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach(e => {
                console.log("Error: " + e.msg);
            });
        }
    };

    let getTransactions = async () => {
        let response = await fetch(
            `${process.env.REACT_APP_BACKEND_BASE_URL}/transactions/public?sellerId=${id}&buyerId=${id}`,
            {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey"),
                },
            }
        );

        if (response.ok) {
            let jsonData = await response.json();
            jsonData.map(transaction => {
                transaction.key = transaction.id;
                return transaction;
            });
            setTransactions(jsonData);
            let BoughtResponse = await fetch(
                `${process.env.REACT_APP_BACKEND_BASE_URL}/transactions/public?&sellerId=${id}`,
                {
                    method: "GET",
                    headers: {
                        "apikey": localStorage.getItem("apiKey"),
                    },
                }
            );
            if (BoughtResponse.ok) {
                let BoughtJsonData = await BoughtResponse.json();
                BoughtJsonData.map(transaction => {
                    transaction.key = transaction.id;
                    return transaction;
                });
                setTransactions([...jsonData, ...BoughtJsonData]);
            } else {
                let responseBody = await BoughtResponse.json();
                let serverErrors = responseBody.errors;
                serverErrors.forEach(e => {
                    console.log("Error: " + e.msg);
                });
            }

        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach(e => {
                console.log("Error: " + e.msg);
            });
        }
    };

    const fetchCountryFlag = (countryname) => {
        const country = countries.find((c) => c.name === countryname);
        if (country) {
            setCountryFlag(country.flag);
        }
    };

    const numberOfSoldItems = transactions.filter(t => t.sellerId == id).length;

    return (
        <Fragment>
            <Card>
                <Row align={"middle"}>
                    <Col span={24}>
                        <Title level={1} style={{ marginTop: "0.2em", textAlign: "center" }}>
                            {user.name}
                            {countryFlag && <img alt={user.country} src={countryFlag} style={{ width:40, marginLeft: "0.2em" }}></img>}
                            {numberOfSoldItems >= 4 && <img alt="Top Seller" src="/quality.png" style={{ width:40, marginLeft: "0.2em" }}></img>}
                        </Title>
                        <Title level={2} style={{ marginTop: "0.2em", textAlign: "center" }}>
                            {user.email}
                        </Title>
                    </Col>
                </Row>

                <Divider />
                <Row align={"middle"}>
                    <Col span={24}>
                        <Title level={3} style={{ marginTop: "0.2em", textAlign: "center" }}>
                            Transaction index
                        </Title>
                        <Descriptions style={{textAlign:"center", justifyContent:"center"}}>
                            <Descriptions.Item label="Total transactions">{transactions.length}</Descriptions.Item>
                            <Descriptions.Item label="Number of sold items">{transactions.filter(t => t.sellerId == id).length}</Descriptions.Item>
                            <Descriptions.Item label="Number of bought items">{transactions.filter(t => t.buyerId == id).length}</Descriptions.Item>
                        </Descriptions>
                        <Title level={4} style={{ marginTop: "0.2em", textAlign: "center" }}>
                            Transactions made as a seller
                        </Title>
                        <DisplayTransactionsTable
                            searchTerm={"sellerId"}
                            transactions={transactions.filter(t => t.sellerId == id)}
                            privacy={"public"}
                        />
                        <Title level={4} style={{ marginTop: "0.2em", textAlign: "center" }}>
                            Transactions made as a buyer
                        </Title>
                        <DisplayTransactionsTable
                            searchTerm={"buyerId"}
                            transactions={transactions.filter(t => t.buyerId == id)}
                            privacy={"public"}
                        />
                    </Col>
                </Row>
                <Divider />

                <Title level={4} style={{ marginTop: "0.2em", textAlign: "center" }}>
                    Published Products ({products.length} items)
                </Title>
                <ProductDisplayerComponent products={products} />

            </Card>
        </Fragment>
    );
}

export default UserProfileComponent;
