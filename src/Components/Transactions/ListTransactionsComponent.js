import { Fragment, useEffect, useState } from "react";
import {Divider, Typography} from "antd";
import DisplayTransactionsTable from "./DisplayTransactionsTable";

let ListTransactionsComponent = (props) => {
    const { Title } = Typography;
    let [transactions, setTransactions] = useState([]);
    let [buyerTransactions, setBuyerTransactions] = useState([]);
    let [sellerTransactions, setSellerTransactions] = useState([]);

    useEffect(() => {
        getTransactions();
    }, []);

    let getTransactions = async () => {
        let response = await fetch(
            process.env.REACT_APP_BACKEND_BASE_URL + "/transactions/own",
            {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey"),
                },
            }
        );

        if (response.ok) {
            let jsonData = await response.json();
            jsonData.forEach(transaction => {
                transaction.key = transaction.id;
            });
            setTransactions(jsonData);
            setBuyerTransactions(jsonData.filter(transaction => transaction.buyerId == localStorage.getItem("userId")));
            setSellerTransactions(jsonData.filter(transaction => transaction.sellerId == localStorage.getItem("userId")));
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach(e => {
                console.log("Error: " + e.msg);
            });
        }
    };

    return (
        <Fragment>
            <Title level={1} style={{marginTop: "0.2em", textAlign: "center"}}>
                Your transactions
            </Title>
            <Divider/>
            <Title level={2} style={{marginTop: "0.2em", textAlign: "center"}}>
                <img alt={"buyer logo"} src={"/pages/buyer.png"} width={100}/>
                Transactions as buyer
            </Title>
            <DisplayTransactionsTable
                searchTerm={"buyerId"}
                transactions={buyerTransactions}
                privacy={"own"}
            />

            <Title level={2} style={{marginTop: "0.2em", textAlign: "center"}}>
                <img alt={"seller logo"} src={"/pages/seller.png"} width={100}/>
                Transactions as seller
            </Title>
            <DisplayTransactionsTable searchTerm={"sellerId"}
                                      transactions={sellerTransactions}
                                      privacy={"own"}
            />
        </Fragment>
    );
};

export default ListTransactionsComponent;
