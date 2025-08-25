const isValidUrl = async (str) =>{
    try {
        const url = new URL(str);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch (error) {
        console.error(error);
        return false;
    }
}

export default isValidUrl;