export async function fetchProduct(id) {
    return await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/products/${id}`,
        {
            method: "GET",
            headers: {
                "apikey": localStorage.getItem("apiKey")
            },
        }
    );
}

export async function fetchSeller(sellerId) {
    return await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/users/${sellerId}`,
        {
            method: "GET",
            headers: {
                "apikey": localStorage.getItem("apiKey")
            },
        }
    );
}