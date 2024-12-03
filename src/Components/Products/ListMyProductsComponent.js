import { useState, useEffect, Fragment } from "react";
import { Table, Space, Input, Typography, Descriptions, Form, Tag } from 'antd';
import { Link } from "react-router-dom";
import { timestampToString } from "../../Utils/UtilsDates";
import { categories } from '../../Static/categories';

const { Title } = Typography;
const { Search } = Input;

let ListMyProductsComponent = () => {
    let [products, setProducts] = useState([]);
    let [filteredProducts, setFilteredProducts] = useState([]);
    let [searchText, setSearchText] = useState("");
    let [editingKey, setEditingKey] = useState("");

    const isEditing = (record) => record.key === editingKey;
    const [form] = Form.useForm();

    useEffect(() => {
        getMyProducts();
    }, []);

    useEffect(() => {
        const filtered = products.filter(product =>
            product.title.toLowerCase().includes(searchText.toLowerCase()) ||
            product.description.toLowerCase().includes(searchText.toLowerCase()) ||
            (product.buyerEmail && product.buyerEmail.toLowerCase().includes(searchText.toLowerCase()))
        );
        setFilteredProducts(filtered);
    }, [searchText, products]);

    const handleSearch = (value) => {
        setSearchText(value);
    };

    const getMyProducts = async () => {
        let response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/products/own/`, {
            method: "GET",
            headers: { "apikey": localStorage.getItem("apiKey") },
        });

        if (response.ok) {
            let jsonData = await response.json();
            jsonData.map(product => {
                product.key = product.id;
                return product;
            });
            setProducts(jsonData);
            setFilteredProducts(jsonData);
        } else {
            let responseBody = await response.json();
            responseBody.errors.forEach(e => console.log("Error: " + e.msg));
        }
    };

    const edit = (record) => {
        form.setFieldsValue({
            title: record.title,
            description: record.description,
            price: record.price,
            ...record,
        });
        setEditingKey(record.key);
    };

    const cancel = () => {
        setEditingKey("");
    };

    let deleteProduct = async (id) => {
        let response = await fetch(
            process.env.REACT_APP_BACKEND_BASE_URL + "/products/" + id,
            {
                method: "DELETE",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
            });
    };

    const save = async (key) => {
        try {
            const row = await form.validateFields();
            const newData = [...products];
            const index = newData.findIndex((item) => key === item.key);

            if (index > -1) {
                const item = newData[index];
                const updatedProduct = { ...item, ...row };
                newData.splice(index, 1, updatedProduct);

                let response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/products/${item.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "apikey": localStorage.getItem("apiKey")
                    },
                    body: JSON.stringify(updatedProduct),
                });

                if (response.ok) {
                    setProducts(newData);
                    setFilteredProducts(newData);
                    setEditingKey("");
                } else {
                    console.log("Error updating product");
                }
            }
        } catch (errInfo) {
            console.log("Validate Failed:", errInfo);
        }
    };

    const columns = [
        {
            title: "Title",
            dataIndex: "title",
            editable: true,
            sorter: (a, b) => a.title.localeCompare(b.title),
            render: (text, record) => isEditing(record) ? (
                <Form.Item
                    name="title"
                    style={{ margin: 0 }}
                    rules={[{ required: true, message: "Title is required" }]}
                >
                    <Input />
                </Form.Item>
            ) : (
                <span>{text}</span>
            ),
        },
        {
            title: "Description",
            dataIndex: "description",
            sorter: (a, b) => a.title.localeCompare(b.title),
            editable: true,
            render: (text, record) => isEditing(record) ? (
                <Form.Item
                    name="description"
                    style={{ margin: 0 }}
                    rules={[{ required: true, message: "Description is required" }]}
                >
                    <Input />
                </Form.Item>
            ) : (
                <span>{text}</span>
            ),
        },
        {
            title: "Category",
            dataIndex: "category",
            filters: [
                ...Array.from(
                    new Set(products.map((p) => p.category))
                ).map((category) => ({ text: category, value: category })),
            ],
            onFilter: (value, record) => record.category === value,
            align: "center",
            sorter: (a, b) => a.category.localeCompare(b.category),
            render: (category) => {
                const categoryData = categories.find(cat => cat.name === category);
                return categoryData ? (
                    <Tag color={categoryData.color}>{category}</Tag>
                ) : (
                    <span>{category}</span>
                );
            },
        },
        {
            title: "Price (€)",
            dataIndex: "price",
            align: "right",
            sorter: (a, b) => a.title.localeCompare(b.title),
            editable: true,
            render: (text, record) => isEditing(record) ? (
                <Form.Item
                    name="price"
                    style={{ margin: 0 }}
                    rules={[{ required: true, message: "Price is required" }]}
                >
                    <Input />
                </Form.Item>
            ) : (
                <span>{text}</span>
            ),
        },
        {
            title: "Date",
            dataIndex: "date",
            sorter: (a, b) => a.title.localeCompare(b.title),
            render: (date) => timestampToString(date),
        },
        {
            title: "Buyer",
            dataIndex: "buyerEmail",
            sorter: (a, b) => a.title.localeCompare(b.title),
            render: (text, record) => (
                record.buyerEmail ? (
                    <Link to={"/users/" + record.buyerId}>{text}</Link>
                ) : ""
            )
        },
        {
            title: "Actions",
            dataIndex: "id",
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <Space>
                        <a onClick={() => save(record.key)} style={{ marginRight: 8 }}>
                            Save
                        </a>
                        <a onClick={cancel}>Cancel</a>
                    </Space>
                ) : (
                    <Space>
                        {record.buyerEmail === null && (
                            <Fragment>
                                <a onClick={() => edit(record)}>Edit</a>
                                <a onClick={() => deleteProduct(record.id)}>Delete</a>
                            </Fragment>
                        )}
                    </Space>
                );
            }
        },
    ];

    const mergedColumns = columns.map((col) => {
        if (!col.editable) return col;
        return {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    return (
        <Fragment>
            <Title level={1} style={{ textAlign: "center" }}>
                <img alt={"my products"} src={"/pages/own.png"} width={200} />
                My Products
            </Title>
            <Descriptions>
                <Descriptions.Item label="Showing">
                    {filteredProducts.length} of {products.length} in total
                </Descriptions.Item>
            </Descriptions>
            <Search
                placeholder="Search by title, description, or buyer email"
                onSearch={handleSearch}
                onChange={(e) => handleSearch(e.target.value)}
                size={"large"}
                style={{ marginBottom: 16 }}
                allowClear
            />
            <Form form={form} component={false}>
                <Table
                    components={{
                        body: {
                            cell: ({ children, ...restProps }) => {
                                const { editing, dataIndex, title, record, editable, ...rest } = restProps;
                                return editable ? (
                                    <td {...restProps}>
                                        {editing ? (
                                            <Form.Item
                                                name={dataIndex}
                                                style={{ margin: 0 }}
                                                rules={[{ required: true, message: `${title} is required.` }]}
                                            >
                                                <Input />
                                            </Form.Item>
                                        ) : (
                                            children
                                        )}
                                    </td>
                                ) : (
                                    <td {...restProps}>{children}</td>
                                );
                            }
                        }
                    }}
                    columns={mergedColumns}
                    dataSource={filteredProducts}
                    pagination={{ pageSize: 7 }}
                    rowClassName="editable-row"
                />
            </Form>
        </Fragment>
    );
};

export default ListMyProductsComponent;
