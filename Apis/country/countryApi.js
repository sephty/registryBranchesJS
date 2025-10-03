const URL_API = "http://localhost:6611";
const myHeaders = new Headers({
    "Content-Type": "application/json"
});

export const getCountries = async () => {
    try {
        const response = await fetch(`${URL_API}/countries`);
        if (response.ok) {
            return await response.json();
        }
    } catch (error) { console.error(error); }
    return [];
}

export const postCountries = async (data) => {
    try {
        return await fetch(`${URL_API}/countries`, {
            method: "POST", headers: myHeaders, body: JSON.stringify(data)
        });
    } catch (error) { console.error(error); }
}

export const patchCountries = async (data, id) => {
    try {
        return await fetch(`${URL_API}/countries/${id}`, {
            method: "PATCH", headers: myHeaders, body: JSON.stringify(data)
        });
    } catch (error) { console.error(error); }
}

export const deleteCountries = async (id) => {
    try {
        return await fetch(`${URL_API}/countries/${id}`, {
            method: "DELETE", headers: myHeaders
        });
    } catch (error) { console.error(error); }
}