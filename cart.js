/* Chef Bulier — Gestion du panier */

// Structure d'un produit
class CartItem {
  constructor(id, name, price, image, quantity = 1) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.image = image;
    this.quantity = quantity;
  }

  getTotal() {
    return this.price * this.quantity;
  }
}

// Gestion du panier avec localStorage
class Cart {
  constructor() {
    this.items = this.loadCart();
    this.updateCartCount();
  }

  loadCart() {
    try {
      const cartData = localStorage.getItem('chefBulierCart');
      if (!cartData) return [];
      
      const items = JSON.parse(cartData);
      // Restaurer les instances de CartItem avec la méthode getTotal
      return items.map(item => new CartItem(
        item.id,
        item.name,
        item.price,
        item.image,
        item.quantity
      ));
    } catch (e) {
      console.error('Erreur lors du chargement du panier:', e);
      return [];
    }
  }

  saveCart() {
    try {
      localStorage.setItem('chefBulierCart', JSON.stringify(this.items));
      this.updateCartCount();
    } catch (e) {
      console.error('Erreur lors de la sauvegarde du panier:', e);
    }
  }

  addItem(product) {
    const existingItem = this.items.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += product.quantity || 1;
    } else {
      this.items.push(new CartItem(
        product.id,
        product.name,
        product.price,
        product.image,
        product.quantity || 1
      ));
    }
    
    this.saveCart();
    this.showAddToCartNotification(product.name);
    return this;
  }

  removeItem(id) {
    this.items = this.items.filter(item => item.id !== id);
    this.saveCart();
    return this;
  }

  updateQuantity(id, quantity) {
    const item = this.items.find(item => item.id === id);
    if (item) {
      if (quantity <= 0) {
        this.removeItem(id);
      } else {
        item.quantity = quantity;
        this.saveCart();
      }
    }
    return this;
  }

  clear() {
    this.items = [];
    this.saveCart();
    return this;
  }

  getTotal() {
    return this.items.reduce((total, item) => total + item.getTotal(), 0);
  }

  getItemCount() {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  updateCartCount() {
    const countElements = document.querySelectorAll('[data-cart-count]');
    const count = this.getItemCount();
    countElements.forEach(el => {
      const oldCount = parseInt(el.textContent) || 0;
      el.textContent = count;
      el.classList.toggle('is-empty', count === 0);
      
      // Animation premium si le nombre augmente
      if (count > oldCount && oldCount > 0) {
        el.classList.add('just-added');
        setTimeout(() => {
          el.classList.remove('just-added');
        }, 500);
      }
    });
  }

  showAddToCartNotification(productName) {
    showToast(`${productName} ajouté au panier !`);
  }
}

// Instance globale du panier
let cart;

// Initialiser le panier de manière sécurisée
function initCart() {
  try {
    if (typeof Cart === 'undefined') {
      console.error('Classe Cart non définie');
      return null;
    }
    const newCart = new Cart();
    return newCart;
  } catch (e) {
    console.error('Erreur lors de l\'initialisation du panier:', e);
    return null;
  }
}

// Initialiser le panier immédiatement (les classes sont définies juste avant)
cart = initCart();

// Initialisation des boutons "Ajouter au panier"
function initAddToCartButtons() {
  if (!cart) {
    console.warn('Panier non initialisé, réessai...');
    cart = initCart();
    if (!cart) return;
  }
  
  const buttons = document.querySelectorAll('[data-add-to-cart]');
  
  buttons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      
      if (!cart) {
        console.error('Panier non disponible');
        return;
      }
      
      const card = button.closest('.card, .bestseller-card');
      if (!card) return;
      
      const product = {
        id: button.dataset.productId || generateId(card),
        name: card.querySelector('.card__title, .bestseller-card__title')?.textContent.trim() || 'Produit',
        price: parseFloat(button.dataset.price || '8.50'),
        image: card.querySelector('img')?.src || '',
        quantity: 1
      };
      
      cart.addItem(product);
      
      // Animation premium du bouton avec effet de particules
      button.classList.add('added');
      
      // Créer des particules animées premium
      createParticleEffect(button);
      
      // Animation de la carte avec rebond premium
      if (card) {
        card.style.animation = 'cardBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        card.style.transform = 'translateY(-4px) scale(1.02)';
        setTimeout(() => {
          card.style.animation = '';
          card.style.transform = '';
        }, 600);
      }
      
      // Animation du prix
      const priceElement = card?.querySelector('.card__price');
      if (priceElement) {
        priceElement.style.animation = 'priceCelebration 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        setTimeout(() => {
          priceElement.style.animation = '';
        }, 500);
      }
      
      setTimeout(() => {
        button.classList.remove('added');
      }, 800);
    });
  });
}

// Générer un ID unique basé sur le contenu
function generateId(element) {
  const name = element.querySelector('.card__title, .bestseller-card__title')?.textContent.trim() || '';
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

// Fonction utilitaire pour afficher un toast (si disponible)
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

// Créer un effet de particules premium
function createParticleEffect(element) {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  for (let i = 0; i < 8; i++) {
    const particle = document.createElement('div');
    const angle = (Math.PI * 2 * i) / 8;
    const distance = 30 + Math.random() * 20;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;
    
    particle.style.cssText = `
      position: fixed;
      left: ${centerX}px;
      top: ${centerY}px;
      width: 6px;
      height: 6px;
      background: linear-gradient(135deg, var(--or-champagne) 0%, var(--pop-framboise) 100%);
      border-radius: 50%;
      pointer-events: none;
      z-index: 10000;
      clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%);
      --tx: ${tx}px;
      --ty: ${ty}px;
      animation: particleBurst 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    `;
    
    document.body.appendChild(particle);
    
    setTimeout(() => {
      particle.remove();
    }, 600);
  }
}

// Initialiser le panier au chargement
document.addEventListener('DOMContentLoaded', () => {
  // S'assurer que le panier est initialisé
  if (!cart) {
    cart = initCart();
  }
  
  if (cart) {
    initAddToCartButtons();
    cart.updateCartCount();
  } else {
    console.error('Impossible d\'initialiser le panier');
  }
});

// Exporter pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Cart, CartItem, cart };
}

