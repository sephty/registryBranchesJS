const URL_API = "http://localhost:6611";
const myHeaders = new Headers({
    "Content-Type": "application/json"
});

export const getCities = async () => {
    try {
        const response = await fetch(`${URL_API}/cities`);
        if (response.ok) return await response.json();
    } catch (error) { console.error(error); }
    return [];
}

export const postCities = async (data) => {
    try {
        return await fetch(`${URL_API}/cities`, {
            method: "POST", headers: myHeaders, body: JSON.stringify(data)
        });
    } catch (error) { console.error(error); }
}

export const patchCities = async (data, id) => {
    try {
        return await fetch(`${URL_API}/cities/${id}`, {
            method: "PATCH", headers: myHeaders, body: JSON.stringify(data)
        });
    } catch (error) { console.error(error); }
}

export const deleteCities = async (id) => {
    try {
        return await fetch(`${URL_API}/cities/${id}`, {
            method: "DELETE", headers: myHeaders
        });
    } catch (error) { console.error(error); }
}