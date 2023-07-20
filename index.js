const express = require('express')
const fileUpload = require('express-fileupload')
const fs = require('fs');
const baseUrl = "http://localhost:3000/files/";

const app = express();

// Este método GET nos permitirá revisar el contenido del archivo /files
app.get('/listadodearchivos', async (req, res) => {
    const directoryPath = "./files"

    // El método fs.readdir() se utiliza para leer de forma
    // asíncrona el contenido de un directorio determinado. 
    fs.readdir(directoryPath, function(error, files) {
        if(error) {
            res.status(500).send({
                message: 'No se puede buscar archivos en el directorio',
            });
        }
        // Variable que contiene el listado de archivos en el servidor
        let listFiles = [];
        files.forEach((file) => {
            listFiles.push({
                name: file,
                url: baseUrl + file,
            });
        });
        res.status(200).send(listFiles)
    })
});

//Con el siguiente método GET, podremos descargar el archivo que queramos desde la carpeta /files
app.get('/listadodearchivos/:name', async (req, res) => {
    const fileName = req.params.name;
    const directoryPath = "./files/"
    // La función res.download() transfiere el archivo en la 
    // ruta como un "archivo adjunto". Por lo general, los navegadores
    // le pedirán al usuario que descargue.
    res.download(directoryPath + fileName, fileName, (error) => {
        if(error) {
            res.status(500).send({
                message: "No se puede descargar el archivo." + error
            })
        }
    })
})

//A continuación, crearemos un método DELETE para eliminar archivos de la carpeta /files a partir de su nombre:
app.delete('/listadodearchivos/:name', async (req, res) => {
    const fileName = req.params.name;
    const directoryPath = "./files/";
    try {
        // fs.unlinkSync elimina un archivo y espera hasta que se termine la operación
        // para seguir ejecutando el código, también se puede usar fs.unlink()
        // que ejecuta dicha operación de forma asíncrona

        // Primero, comprobaremos con fs.readdir si el archivo a eliminar solicitado por el cliente 
        // efectivamente existe en el servidor:

        fs.readdir(directoryPath, function(err, files) {
            if(err) {
                res.status(500).send({
                    message: 'No se puede buscar el archivo en el directorio'
                });
            }
            let listFiles = []
            files.forEach((file) => {
                listFiles.push(file);
            });
            let fileBusqueda = listFiles.find(l => l === fileName)
            if(!fileBusqueda) {return res.status(409).json({
                message: 'No se encontró el archivo a eliminar en el servidor.'
            })} else {
                fs.unlinkSync(directoryPath + fileName);
                console.log('File removed');
                res.status(200).send("Archivo Eliminado Satisfactoriamente");
            }

        })
    } catch (error) {
        console.log('Ocurrió algo incorrecto al eliminar el archivo');
    }
})

app.listen(3000, () => {
    console.log('Escuchando servidor en el puerto 3000');
})