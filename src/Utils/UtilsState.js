
export let modifyStateProperty = (state, setState, key, value) => {
    if (key === "birthday" && isNaN(value)) {
        setState({
            ...state,
            [key]: ""
        });
    }
    setState({
        ...state,
        [key]: value
    });
}