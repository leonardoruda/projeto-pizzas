const qs = (a) => document.querySelector(a);
const qsa = (a) => document.querySelectorAll(a);
let modalKey = 0;
let modalQt = 1;
let cart = [];

pizzaJson.forEach((item, index) => {
    let pizzaItem = qs('.models .pizza-item').cloneNode(true);
    pizzaItem.setAttribute('data-key', index);
    

    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    pizzaItem.querySelector('a').addEventListener('click', (a) => {
        a.preventDefault();
        let key = a.target.closest('.pizza-item').getAttribute('data-key');
        modalKey = key;
        modalQt = 1;

        qs('.pizzaBig img').src = pizzaJson[key].img;
        qs('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        qs('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        qs('.pizzaInfo--actualPrice').innerHTML = pizzaJson[key].price.toFixed(2);
        qs('.pizzaInfo--size.selected').classList.remove('selected');
        qsa('.pizzaInfo--size').forEach((size, sizeIndex) => {
            if (sizeIndex === 2) {
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        })

        qs('.pizzaInfo--qt').innerHTML = modalQt;
        qs('.pizzaWindowArea').style.opacity = 0;
        qs('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => {qs('.pizzaWindowArea').style.opacity = 1}, 200)
    })

    qs('.pizza-area').appendChild(pizzaItem);
});

function closeModal() {
    qs('.pizzaWindowArea').style.opacity = 0;    
    setTimeout(() => {
        qs('.pizzaWindowArea').style.display = 'none';    
    }, 200)
}

qsa('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((a) => {
    a.addEventListener('click', closeModal);
})

qs('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQt++;
    qs('.pizzaInfo--qt').innerHTML = modalQt;
});
qs('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if (modalQt > 1) {
        modalQt--;
        qs('.pizzaInfo--qt').innerHTML = modalQt;
    }
});

qsa('.pizzaInfo--size').forEach((item) => {
    item.addEventListener('click', () => {
        qs('.pizzaInfo--size.selected').classList.remove('selected');
        item.classList.add('selected');
    })
});

qs('.pizzaInfo--addButton').addEventListener('click', () => {
    let size = parseInt(qs('.pizzaInfo--size.selected').getAttribute('data-key'));
    let identifier = `${pizzaJson[modalKey].id}@${size}`;
    let cartItem = cart.findIndex((item) => item.identifier == identifier);
    if (cartItem > -1) {
        cart[cartItem].qt += modalQt;
    } else {
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size,
            qt: modalQt
        });
    };

    closeModal();
    updateCart();
});

qs('.menu-openner').addEventListener('click', () => {
    if (cart.length > 0) {
        qs('aside').style.left = 0;
    } else {
        window.alert('Adicione pizzas para abrir o seu carrinho!');
    }
})
qs('.menu-closer').addEventListener('click', () => qs('aside').style.left = '100vw');

function updateCart() {
    qs('.menu-openner span').innerHTML = cart.length;
    if (cart.length > 0) {
        qs('aside').classList.add('show');
        qs('.cart').innerHTML = '';
        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for (let i in cart) {
            let pizza = pizzaJson.find((item) => item.id == cart[i].id);
            subtotal += pizza.price * cart[i].qt;
            let cartItem = qs('.cart--item').cloneNode(true);
            let size = '';
            switch(cart[i].size) {
                case 0:
                    size = 'P';
                break;
                case 1:
                    size = 'M';
                break;
                case 2:
                    size = 'G';
                break;
            };
            let pizzaName = pizza.name + `(${size})`;

            cartItem.querySelector('.cart--item img').src = pizza.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++;
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if (cart[i].qt > 1) {
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            });

            qs('.cart').appendChild(cartItem);
        }

        qs('.cart--totalitem.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        desconto = subtotal * 0.1;
        qs('.cart--totalitem.desconto span:nth-child(2)').innerHTML = `R$ ${desconto.toFixed(2)}`;
        total = subtotal - desconto;
        qs('.cart--totalitem.total span:nth-child(2)').innerHTML = `R$ ${total.toFixed(2)}`;
    } else {
        qs('aside').style.left = '100vw';
        qs('aside').classList.remove('show');
    }
}

qs('.cart--finalizar').addEventListener('click', () => {
    window.alert(`O seu cartão foi debitado automaticamente!
            Obrigado pela preferência!`);
    window.alert('   Brincadeira XD');
})
