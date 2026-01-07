/* Chef Bulier — Page panier */

// Formatage du prix
function formatPrice(price) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
}

// Fonction utilitaire pour afficher un toast
function showToast(message) {
  const toast = document.querySelector('[data-toast]');
  if (toast) {
    toast.textContent = message;
    toast.hidden = false;
    setTimeout(() => {
      toast.hidden = true;
    }, 3000);
  }
}

// Afficher le panier avec animations premium
function renderCart() {
  // Vérifier que cart est disponible (défini dans cart.js)
  if (typeof cart === 'undefined' || !cart) {
    console.error('Cart non initialisé');
    const cartEmpty = document.getElementById('cart-empty');
    const cartContent = document.getElementById('cart-content');
    if (cartEmpty) cartEmpty.hidden = false;
    if (cartContent) cartContent.hidden = true;
    return;
  }
  
  const cartItems = document.getElementById('cart-items');
  const cartEmpty = document.getElementById('cart-empty');
  const cartContent = document.getElementById('cart-content');
  const cartSubtotal = document.getElementById('cart-subtotal');
  const cartShipping = document.getElementById('cart-shipping');
  const cartTotal = document.getElementById('cart-total');

  if (!cartItems || !cartEmpty || !cartContent) {
    console.error('Éléments du panier non trouvés');
    return;
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    cartEmpty.hidden = false;
    cartContent.hidden = true;
    return;
  }

  cartEmpty.hidden = true;
  cartContent.hidden = false;
  
  // Animation d'apparition du contenu
  cartContent.style.opacity = '0';
  cartContent.style.transform = 'translateY(20px)';
  setTimeout(() => {
    cartContent.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    cartContent.style.opacity = '1';
    cartContent.style.transform = 'translateY(0)';
  }, 50);

  // Afficher les articles avec délai d'animation
  cartItems.innerHTML = cart.items.map((item, index) => {
    const img = new Image();
    const imageUrl = item.image || 'images/patisseries/opera.png';
    img.src = imageUrl;
    
    return `
    <article class="cart-item" style="animation-delay: ${index * 0.1}s;" data-item-id="${item.id}">
      <div class="cart-item__image loading">
        <img src="${imageUrl}" alt="${item.name}" loading="lazy" />
      </div>
      <div class="cart-item__details">
        <h3 class="cart-item__title">${item.name}</h3>
        <p class="cart-item__price">${formatPrice(item.price)}</p>
      </div>
      <div class="cart-item__quantity">
        <button class="quantity-btn" type="button" data-decrease="${item.id}" aria-label="Diminuer la quantité">
          <span aria-hidden="true">−</span>
        </button>
        <input 
          type="number" 
          min="1" 
          value="${item.quantity}" 
          class="quantity-input"
          data-quantity="${item.id}"
          aria-label="Quantité"
        />
        <button class="quantity-btn" type="button" data-increase="${item.id}" aria-label="Augmenter la quantité">
          <span aria-hidden="true">+</span>
        </button>
      </div>
      <div class="cart-item__total">
        <span class="cart-item__total-price">${formatPrice(item.getTotal())}</span>
      </div>
      <button class="cart-item__remove" type="button" data-remove="${item.id}" aria-label="Retirer du panier">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </article>
  `;
  }).join('');
  
  // Gérer le chargement des images
  cartItems.querySelectorAll('.cart-item__image img').forEach(img => {
    if (img.complete) {
      img.closest('.cart-item__image').classList.remove('loading');
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', function() {
        this.closest('.cart-item__image').classList.remove('loading');
        this.classList.add('loaded');
      });
      img.addEventListener('error', function() {
        this.closest('.cart-item__image').classList.remove('loading');
      });
    }
  });

  // Calculer les totaux
  const subtotal = cart.getTotal();
  const shipping = subtotal >= 50 ? 0 : 5;
  const total = subtotal + shipping;

  // Animation des totaux avec compteur
  animateValue(cartSubtotal, 0, subtotal, 500, formatPrice);
  setTimeout(() => {
    cartShipping.textContent = shipping === 0 ? 'Gratuit' : formatPrice(shipping);
    animateValue(cartTotal, 0, total, 500, formatPrice);
  }, 250);

  // Ajouter les event listeners
  initCartInteractions();
}

// Initialiser les interactions du panier
function initCartInteractions() {
  // Boutons d'augmentation/diminution
  document.querySelectorAll('[data-increase]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.increase;
      const item = cart.items.find(i => i.id === id);
      if (item) {
        cart.updateQuantity(id, item.quantity + 1);
        renderCart();
      }
    });
  });

  document.querySelectorAll('[data-decrease]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.decrease;
      const item = cart.items.find(i => i.id === id);
      if (item && item.quantity > 1) {
        cart.updateQuantity(id, item.quantity - 1);
        renderCart();
      }
    });
  });

  // Input de quantité
  document.querySelectorAll('[data-quantity]').forEach(input => {
    input.addEventListener('change', (e) => {
      const id = input.dataset.quantity;
      const quantity = parseInt(e.target.value, 10);
      if (quantity > 0) {
        cart.updateQuantity(id, quantity);
        renderCart();
      }
    });
  });

  // Bouton de suppression avec animation premium
  document.querySelectorAll('[data-remove]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.remove;
      const cartItem = btn.closest('.cart-item');
      
      if (cartItem) {
        cartItem.classList.add('removing');
        setTimeout(() => {
          cart.removeItem(id);
          renderCart();
          showToast('Article retiré du panier');
        }, 400);
      } else {
        cart.removeItem(id);
        renderCart();
        showToast('Article retiré du panier');
      }
    });
  });
}

// Animation de compteur premium avec easing sophistiqué
function animateValue(element, start, end, duration, formatter) {
  if (!element) return;
  
  const startTime = performance.now();
  const range = end - start;
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Easing premium : easeOutCubic avec rebond subtil
    const easeOutCubic = 1 - Math.pow(1 - progress, 3);
    const current = start + range * easeOutCubic;
    
    element.textContent = formatter(current);
    
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = formatter(end);
      // Animation finale de pulse
      element.style.animation = 'totalPulse 0.3s ease';
      setTimeout(() => {
        element.style.animation = '';
      }, 300);
    }
  }
  
  requestAnimationFrame(update);
}

// Ajouter l'animation de pulse pour les totaux
if (!document.querySelector('style[data-cart-animations]')) {
  const style = document.createElement('style');
  style.setAttribute('data-cart-animations', '');
  style.textContent = `
    @keyframes totalPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }
  `;
  document.head.appendChild(style);
}

// Initialiser la page
document.addEventListener('DOMContentLoaded', () => {
  // Attendre que cart.js soit chargé
  function tryRender() {
    if (typeof cart !== 'undefined' && cart) {
      renderCart();
    } else {
      // Attendre un peu si cart.js n'est pas encore chargé
      setTimeout(() => {
        if (typeof cart !== 'undefined' && cart) {
          renderCart();
        } else {
          console.error('Impossible de charger le panier');
          const cartEmpty = document.getElementById('cart-empty');
          const cartContent = document.getElementById('cart-content');
          if (cartEmpty) cartEmpty.hidden = false;
          if (cartContent) cartContent.hidden = true;
        }
      }, 200);
    }
  }
  
  tryRender();
});

