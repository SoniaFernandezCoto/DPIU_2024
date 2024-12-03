import { timestampToString } from "../../Utils/UtilsDates";
import { Link } from "react-router-dom";
import { Table, Typography } from "antd";
import { Fragment, useEffect, useState } from "react";

let DisplayTransactionsTable = ({ searchTerm, transactions, privacy }) => {
    const { Text } = Typography;
    let [userToShow, setUserToShow] = useState("");
    let [formattedTransactions, setFormattedTransactions] = useState([]);

    useEffect(() => {
        if (searchTerm === "buyerId") {
            setUserToShow("Seller");
        } else if (searchTerm === "sellerId") {
            setUserToShow("Buyer");
        }
        formatTransactions();
    }, [searchTerm, transactions]);

    let formatTransactions = async () => {
        const formatted = await Promise.all(
            transactions.map(async (transaction) => {
                const productData = await getProductData(transaction.productId);
                transaction.productTitle = productData?.title || "";

                if (searchTerm === "buyerId") {
                    const userData = await getUserData(transaction.sellerId);
                    transaction.userEmail = userData?.email || "";
                } else if (searchTerm === "sellerId") {
                    const userData = await getUserData(transaction.buyerId);
                    transaction.userEmail = userData?.email || "";
                    if (privacy === "own" && searchTerm === "sellerId") {
                        transaction.userCountry = userData?.country || "";
                        transaction.userAddress = userData?.address || "";
                        transaction.userPostalCode = userData?.postalCode || "";
                    }
                }
                return transaction;
            })
        );
        setFormattedTransactions(formatted);
    };

    let getProductData = async (productId) => {
        const response = await fetch(
            `${process.env.REACT_APP_BACKEND_BASE_URL}/products/${productId}`,
            {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey"),
                },
            }
        );
        if (response.ok) {
            return await response.json();
        } else {
            console.error("Failed to fetch product data");
        }
    };

    let getUserData = async (userId) => {
        const response = await fetch(
            `${process.env.REACT_APP_BACKEND_BASE_URL}/users/${userId}`,
            {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey"),
                },
            }
        );
        if (response.ok) {
            return await response.json();
        } else {
            console.error("Failed to fetch user data");
        }
    };

    let columns = [
        {
            title: "Product",
            dataIndex: "productTitle",
            filters: [
                ...Array.from(
                    new Set(formattedTransactions.map((transaction) => transaction.productTitle))
                ).map((title) => ({ text: title, value: title })),
            ],
            onFilter: (value, record) => record.productTitle === value,
        },
        {
            title: "Price (€)",
            dataIndex: "productPrice",
            align: "right",
            sorter: (a, b) => a.productPrice - b.productPrice,
        },
        {
            title: userToShow,
            dataIndex: "userEmail",
            filters: [
                ...Array.from(
                    new Set(formattedTransactions.map((transaction) => transaction.userEmail))
                ).map((email) => ({ text: email, value: email })),
            ],
            onFilter: (value, record) => record.userEmail === value,
            render: (email, transaction) =>
                searchTerm === "buyerId" ? (
                    <Link to={`/users/${transaction.sellerId}`}>{email}</Link>
                ) : (
                    <Link to={`/users/${transaction.buyerId}`}>{email}</Link>
                ),
        },
        {
            title: "Payment method",
            dataIndex: "buyerPaymentId",
            align: "right",
            sorter: (a, b) => a.buyerPaymentId - b.buyerPaymentId,
        },
        {
            title: "Transaction date",
            dataIndex: "endDate",
            render: (date) => timestampToString(date),
            sorter: (a, b) => new Date(a.endDate) - new Date(b.endDate),
        },
    ];

    if (privacy === "own" && searchTerm === "sellerId") {
        columns.push(
            {
                title: "Country",
                dataIndex: "buyerCountry",
                sorter: (a, b) => a.buyerCountry - b.buyerCountry,
                filters: [
                    ...Array.from(
                        new Set(formattedTransactions.map((transaction) => transaction.buyerCountry))
                    ).map((country) => ({ text: country, value: country })),
                ],
                onFilter: (value, record) => record.category === value,
            },
            {
                title: "Address",
                dataIndex: "buyerAddress",
                sorter: (a, b) => a.buyerAddress - b.buyerAddress,
            },
            {
                title: "Postal Code",
                sorter: (a, b) => a.buyerAddress - b.buyerAddress,
                dataIndex: "buyerPostCode",
            }
        );
    }

    if (privacy === "public") {
        columns = columns.filter(
            (column) => !["Price (€)", "Transaction date", "Payment method"].includes(column.title)
        );
    }

    return (
        <Fragment>
            <Text>{transactions.length} Transactions</Text>
            <Table
                columns={columns}
                dataSource={formattedTransactions}
                pagination={{ pageSize: 3 }}
            />
        </Fragment>
    );
};

export default DisplayTransactionsTable;
