import axios from "axios";

export const loadData = async (url, responseEncoding = 'utf8', responseType = 'text') => {
    try {
        const {data} = await axios.get(url, {
            responseEncoding,
            responseType,
            timeout: 8000
        })
        return data;
    } catch {
        return null;
    }
};
