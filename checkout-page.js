/* Chef Bulier — Page checkout */

// Formatage du prix
function formatPrice(price) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
}

// Afficher le récapitulatif avec animations premium
function renderCheckoutSummary() {
  // Vérifier que cart est disponible
  if (typeof cart === 'undefined' || !cart) {
    console.error('Cart non initialisé');
    setTimeout(() => {
      window.location.href = 'cart.html';
    }, 1000);
    return;
  }
  
  const checkoutItems = document.getElementById('checkout-items');
  const checkoutSubtotal = document.getElementById('checkout-subtotal');
  const checkoutShipping = document.getElementById('checkout-shipping');
  const checkoutTotal = document.getElementById('checkout-total');

  if (!checkoutItems || !checkoutSubtotal || !checkoutShipping || !checkoutTotal) {
    console.error('Éléments du checkout non trouvés');
    return;
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    window.location.href = 'cart.html';
    return;
  }

  // Afficher les articles avec animation
  checkoutItems.innerHTML = cart.items.map((item, index) => `
    <div class="checkout-item" style="animation-delay: ${index * 0.1}s; animation: checkoutItemSlideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;">
      <div class="checkout-item__image">
        <img src="${item.image || 'images/patisseries/opera.png'}" alt="${item.name}" loading="lazy" />
      </div>
      <div class="checkout-item__details">
        <h4 class="checkout-item__title">${item.name}</h4>
        <p class="checkout-item__meta">Quantité : ${item.quantity}</p>
      </div>
      <div class="checkout-item__price">
        ${formatPrice(item.getTotal())}
      </div>
    </div>
  `).join('');

  // Calculer les totaux
  const subtotal = cart.getTotal();
  const shipping = subtotal >= 50 ? 0 : 5;
  const total = subtotal + shipping;

  // Animation des totaux avec compteur premium
  animateValue(checkoutSubtotal, 0, subtotal, 500, formatPrice);
  setTimeout(() => {
    checkoutShipping.textContent = shipping === 0 ? 'Gratuit' : formatPrice(shipping);
    animateValue(checkoutTotal, 0, total, 500, formatPrice);
  }, 250);
}

// Gérer la soumission du formulaire avec animation premium
function initCheckoutForm() {
  const form = document.getElementById('checkout-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (typeof cart === 'undefined' || !cart || !cart.items || cart.items.length === 0) {
      showToast('Votre panier est vide');
      setTimeout(() => {
        window.location.href = 'cart.html';
      }, 1500);
      return;
    }

    const submitBtn = form.querySelector('.checkout-form__submit');
    if (submitBtn) {
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;
    }

    // Simuler le traitement de la commande avec délai premium
    setTimeout(() => {
      const formData = new FormData(form);
      const orderData = {
        items: cart.items,
        customer: {
          firstName: formData.get('firstName'),
          lastName: formData.get('lastName'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          address: formData.get('address'),
          postalCode: formData.get('postalCode'),
          city: formData.get('city'),
        },
        payment: formData.get('paymentMethod'),
        total: cart.getTotal() + (cart.getTotal() >= 50 ? 0 : 5),
        date: new Date().toISOString()
      };

      // Sauvegarder la commande (pour la démo)
      localStorage.setItem('chefBulierLastOrder', JSON.stringify(orderData));

      // Vider le panier
      cart.clear();

      // Animation de transition premium
      document.body.style.transition = 'opacity 0.5s ease';
      document.body.style.opacity = '0';

      setTimeout(() => {
        window.location.href = 'order-confirmation.html';
      }, 500);
    }, 1500);
  });
}

// Animation de compteur premium
function animateValue(element, start, end, duration, formatter) {
  const startTime = performance.now();
  const range = end - start;
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOutCubic = 1 - Math.pow(1 - progress, 3);
    const current = start + range * easeOutCubic;
    
    element.textContent = formatter(current);
    
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = formatter(end);
    }
  }
  
  requestAnimationFrame(update);
}

// Initialiser la page
document.addEventListener('DOMContentLoaded', () => {
  // Attendre que cart.js soit chargé
  if (typeof cart !== 'undefined') {
    renderCheckoutSummary();
    initCheckoutForm();
  } else {
    // Attendre un peu si cart.js n'est pas encore chargé
    setTimeout(() => {
      if (typeof cart !== 'undefined') {
        renderCheckoutSummary();
        initCheckoutForm();
      } else {
        console.error('Impossible de charger le panier');
        window.location.href = 'cart.html';
      }
    }, 100);
  }
});

