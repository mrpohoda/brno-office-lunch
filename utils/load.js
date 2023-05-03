import axios from "axios";

export const loadData = async (url, responseEncoding = 'utf8', responseType = 'text') => {
    const {data} = await axios.get(url, {
        responseEncoding,
        responseType
    })

    return data;
};
