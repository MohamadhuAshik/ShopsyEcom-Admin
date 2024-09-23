import axios from "axios"

const baseURL = "http://localhost:5000"

const instance = axios.create({
    baseURL: "http://localhost:5000",
    // headers: {
    //     "Content-Type": "multipart/form-data"
    // }
})


const postItems = async (data) => {
    try {
        const response = await instance.post(
            baseURL + "/api/items", data
        );
        return response.data;
    } catch (error) {
        return error;
    }
}

const getItems = async (data) => {
    try {
        const response = await instance.get(
            baseURL + `/api/items?page=${data.page}&limit=${data.limit}`
        );
        return response.data;

    } catch (err) {
        return err
    }
}

const updateItem = async (id, data) => {
    try {
        const response = await instance.put(
            baseURL + `/api/items/${id}`, data
        );
        return response.data
    } catch (err) {
        return err
    }
}


const deleteItem = async (data) => {
    try {
        const response = await instance.delete(
            baseURL + `/api/items/${data}`
        );
        return response.data
    } catch (err) {
        return err
    }
}

export const ApiServices = {
    postItems, getItems, updateItem, deleteItem
}