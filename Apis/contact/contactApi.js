const URL_API = "http://localhost:3000";
const myHeaders = new Headers({
    "Content-Type": "application/json"
});
const getContact = async() => {
    try {
        const respuesta = await fetch(`${URL_API}/Contacts`);
		// Si la respuesta es correcta
		if(respuesta.status === 200){
			const datos = await respuesta.json();
            return datos; 
		} else if(respuesta.status === 401){
            console.log('La url no es correcta');
		} else if(respuesta.status === 404){
            console.log('El el Contacto  no existe');
		} else {
            console.log('Se presento un error en la peticion consulte al Administrador');
		}
	} catch(error){
        console.log(error);
	}
    return []; 
}
const postContact = async (datos) => {
    try {
        return await fetch(`${URL_API}/Contacts`, {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(datos)
        });
    } catch (error) {
        console.error('Error en la solicitud POST:', error.message);
    }
}
const patchContact = async (datos,id) =>{

    try {
        return await fetch(`${URL_API}/Contacts/${id}`, {
            method: "PATCH",
            headers: myHeaders,
            body: JSON.stringify(datos)
        });
    } catch (error) {
        console.error('Error en la solicitud POST:', error.message);
    }

}
const deleteContact = async (id) =>{

    try {
        return await fetch(`${URL_API}/Contacts/${id}`, {
            method: "DELETE",
            headers: myHeaders,
        });
    } catch (error) {
        console.error('Error en la solicitud POST:', error.message);
    }

}
export {
    getContact as getContacts,
    postContact as postContacts,
    patchContact as patchContacts,
    deleteContact as deleteContacts
};