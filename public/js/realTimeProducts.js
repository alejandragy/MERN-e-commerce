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
            console.error('Error al añadir producto', error);
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
            }
        })
        .then(data => {
            if (data.length > 0) {
                const newProduct = data[data.length - 1];
                console.log('ultimo producto es', newProduct);
                socket.emit('newProductAdded', newProduct);
            }
            else {
                console.error('No hay productos');
            }
        })
        .catch(error => {
            console.error('Error al obtener los productos', error);
        })

}

function deleteProduct(productId) {

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
    <div class="card-product" id="${data.id}">
        <div class="card-product__img">
        <img src="${data.thumbnails[0]}" alt="${data.title}">
        </div>
        <div>
            <p class="card-product__title">${data.title}</p>
            <p class="card-product__price">$${data.price}</p>
        </div>
        <div class="card-product__btn">
            <button><img src="img/icons/ver.png" alt="icono de ver"></button>
        </div>
        <div class="card-product__btn card-product__btn--delete">
            <button onclick="deleteProduct(${data.id})""><img src="img/icons/borrar.png" alt="icono de ver"></button>
        </div>
    </div>`);
    
    productForm.reset();
})

socket.on('productDeletedOfDOM', data => {
    const productToDelete = document.getElementById(data);
    productToDelete.remove();
})