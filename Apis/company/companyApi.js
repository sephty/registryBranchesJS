const URL_API = "http://localhost:3000";
const myHeaders = new Headers({
    "Content-Type": "application/json"
});

const getCompanies = async () => {
    try {
        const response = await fetch(`${URL_API}/companies`);
        if (response.status === 200) {
            return await response.json();
        }
    } catch (error) { console.log(error); }
    return [];
}

const postCompany = async (data) => {
    try {
        return await fetch(`${URL_API}/companies`, {
            method: "POST", headers: myHeaders, body: JSON.stringify(data)
        });
    } catch (error) { console.log(error); }
}

const patchCompany = async (data, id) => {
    try {
        return await fetch(`${URL_API}/companies/${id}`, {
            method: "PATCH", headers: myHeaders, body: JSON.stringify(data)
        });
    } catch (error) { console.log(error); }
}

const deleteCompany = async (id) => {
    try {
        return await fetch(`${URL_API}/companies/${id}`, {
            method: "DELETE", headers: myHeaders
        });
    } catch (error) { console.log(error); }
}

export {
    getCompanies,
    postCompany as postCompanies,
    patchCompany as patchCompanies,
    deleteCompany as deleteCompanies
};