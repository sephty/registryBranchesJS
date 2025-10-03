const URL_API = "http://localhost:3000";
const myHeaders = new Headers({
    "Content-Type": "application/json"
});
const getRegion = async() => {
    try {
        const respuesta = await fetch(`${URL_API}/Regions`);
		// Si la respuesta es correcta
		if(respuesta.status === 200){
			const datos = await respuesta.json();
            return datos; 
		} else if(respuesta.status === 401){
            console.log('La url no es correcta');
		} else if(respuesta.status === 404){
            console.log('El el Regiono  no existe');
		} else {
            console.log('Se presento un error en la peticion consulte al Administrador');
		}
	} catch(error){
        console.log(error);
	}
    return []; 
}
const postRegion = async (datos) => {
    try {
        return await fetch(`${URL_API}/Regions`, {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(datos)
        });
    } catch (error) {
        console.error('Error en la solicitud POST:', error.message);
    }
}
const patchRegion = async (datos,id) =>{

    try {
        return await fetch(`${URL_API}/Regions/${id}`, {
            method: "PATCH",
            headers: myHeaders,
            body: JSON.stringify(datos)
        });
    } catch (error) {
        console.error('Error en la solicitud POST:', error.message);
    }

}
const deleteRegion = async (id) =>{

    try {
        return await fetch(`${URL_API}/Regions/${id}`, {
            method: "DELETE",
            headers: myHeaders,
        });
    } catch (error) {
        console.error('Error en la solicitud POST:', error.message);
    }

}
export {
    getRegion as getRegions,
    postRegion as postRegions,
    patchRegion as patchRegions,
    deleteRegion as deleteRegions
};