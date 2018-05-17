function mostrar_imagen() {
    var upload = './img/background.jpg';
    if (document.getElementById('imagen').files[0] != null) {
        upload = document.getElementById('imagen').files[0];
    }
    var logo = './img/image.png';
    if (document.getElementById('logo').files[0] != null) {
        logo = document.getElementById('logo').files[0];
    }
    const e = document.getElementById('posicion');
    const posicion = e.options[e.selectedIndex].value;
    const transparencia = document.getElementById('transparencia').value;
    watermark([upload, logo])
        .image(watermark.image[posicion](transparencia))
        .then(img => {
            var myNode = document.getElementById('container');
            try {
                myNode.removeChild(myNode.firstChild);
            } catch (error) {

            }
            document.getElementById('container').appendChild(img);
        })
}

mostrar_imagen();