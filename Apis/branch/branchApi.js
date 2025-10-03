const URL_API = "https://68dc4c937cd1948060a9f5ba.mockapi.io/";
const myHeaders = new Headers({
    "Content-Type": "application/json"
});
const getbranch = async() => {
    try {
        const respuesta = await fetch(`${URL_API}/branches`);
		// Si la respuesta es correcta
		if(respuesta.status === 200){
			const datos = await respuesta.json();
            return datos; 
		} else if(respuesta.status === 401){
            console.log('La url no es correcta');
		} else if(respuesta.status === 404){
            console.log('El el brancho  no existe');
		} else {
            console.log('Se presento un error en la peticion consulte al Administrador');
		}
	} catch(error){
        console.log(error);
	}
    return []; 
}
const postbranch = async (datos) => {
    try {
        return await fetch(`${URL_API}/branches`, {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(datos)
        });
    } catch (error) {
        console.error('Error en la solicitud POST:', error.message);
    }
}
const patchbranch = async (datos,id) =>{

    try {
        return await fetch(`${URL_API}/branches/${id}`, {
            method: "PATCH",
            headers: myHeaders,
            body: JSON.stringify(datos)
        });
    } catch (error) {
        console.error('Error en la solicitud POST:', error.message);
    }

}
const deletebranch = async (id) =>{

    try {
        return await fetch(`${URL_API}/branches/${id}`, {
            method: "DELETE",
            headers: myHeaders,
        });
    } catch (error) {
        console.error('Error en la solicitud POST:', error.message);
    }

}
export {
    getbranch as getbranches,
    postbranch as postbranches,
    patchbranch as patchbranches,
    deletebranch as deletebranches
};