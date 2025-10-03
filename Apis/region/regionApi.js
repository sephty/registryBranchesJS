const URL_API = "http://localhost:3000";
const myHeaders = new Headers({
    "Content-Type": "application/json"
});

export const getRegions = async () => {
    try {
        const response = await fetch(`${URL_API}/regions`);
        if (response.ok) return await response.json();
    } catch (error) { console.error(error); }
    return [];
}

export const postRegions = async (data) => {
    try {
        return await fetch(`${URL_API}/regions`, {
            method: "POST", headers: myHeaders, body: JSON.stringify(data)
        });
    } catch (error) { console.error(error); }
}

export const patchRegions = async (data, id) => {
    try {
        return await fetch(`${URL_API}/regions/${id}`, {
            method: "PATCH", headers: myHeaders, body: JSON.stringify(data)
        });
    } catch (error) { console.error(error); }
}

export const deleteRegions = async (id) => {
    try {
        return await fetch(`${URL_API}/regions/${id}`, {
            method: "DELETE", headers: myHeaders
        });
    } catch (error) { console.error(error); }
}