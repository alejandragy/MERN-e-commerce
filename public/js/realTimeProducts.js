const socket = io();

const cardsDiv = document.querySelector('#cardsDiv');
const productForm = document.querySelector('#newProductForm');
const productFormBtns = document.querySelectorAll('.delete__btn');

productForm.addEventListener('submit', function (event) {
    event.preventDefault();
    createProduct();
});

productFormBtns.forEach(btn => {
    btn.addEventListener('click', function(){
        const productId = btn.closest('.card-product').id;
        console.log(btn);
        deleteProduct(productId);
    })
})


function createProduct() {
    const formData = new FormData(productForm); // Recopila los datos del formulario

    fetch('/api/products', {
        method: 'POST',
        body: formData,
    })
        .then(response => {
            if (response.ok) {
                console.log('Producto añadido exitosamente!, status:', response.status);
                showNewProductDOM();
            }
            else {
                console.error('El producto no se pudo añadir, error:', response.status);
            }
        })
        .catch(error => {
            console.error('Error al añadir producto', error.message);
        })
}


function showNewProductDOM() {
    fetch('/api/products')
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            else {
                console.error('Error al obtener productos');
                console.log(data)
            }
        })
        .then(data => {
            console.log(data)
            if (data.payload.length > 0) {
                const newProduct = data.payload[data.payload.length - 1];
                console.log(newProduct)
                console.log('El último producto es', newProduct);
                socket.emit('newProductAdded',  newProduct);
                //esto no va a funcionar nunca porque el paginate me limita las vistas a 5 y data está devolviendo esos 5 elementos primeros
            } else {
                console.error('No hay productos');
            }
        })
        .catch(error => {
            console.error('Error al obtener los productos', error);
        })

}


function deleteProduct(productId) {
    
    console.log(productId)

    fetch(`/api/products/${productId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            console.log('Producto eliminado');
            socket.emit('productDeleted', productId);
        } else {
            console.error('Error al eliminar el producto:', response.status);
        }
    })
    .catch(error => {
        console.error('Error al eliminar producto:', error);
    });
}

socket.on('newProductAddedToDOM', data => {
    cardsDiv.innerHTML += (` 
    <div class="card-product" id="${data._id}">
        <picture class="card-product__img">
        <img src="${data.thumbnails[0]}" alt="${data.title}">
        </picture>
        <div>
            <p class="card-product__title">${data.title}</p>
            <p class="card-product__price">$${data.price}</p>
        </div>
        <div class="card-product__btn">
            <button><img src="img/icons/ver.png" alt="icono de ver"></button>
        </div>
        <div class="card-product__btn card-product__btn--delete">
            <button onclick="deleteProduct(${data._id})""><img src="img/icons/borrar.png" alt="icono de ver"></button>
        </div>
    </div>`);
    
    productForm.reset();
})

socket.on('productDeletedOfDOM', data => {
    const productToDelete = document.getElementById(data);
    productToDelete.remove();
})