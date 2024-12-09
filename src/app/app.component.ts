import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ProductListComponent} from './components/product-list/product-list.component';
import {SlideshowComponent} from './components/slideshow/slideshow.component';
import {TopBarComponent} from './components/top-bar/top-bar.component';
import {ProductFilterComponent} from './components/product-filter/product-filter.component';
import {NgForOf} from '@angular/common';
import {ProductService} from './services/product.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ProductListComponent, TopBarComponent, SlideshowComponent, ProductFilterComponent, NgForOf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  cartTotal: number = 0;
  allProducts: any[] = [];
  filteredProducts: any[] = [];
  shoppingCart: any[] = [];
  selectedItem: any = null; // Holds the currently selected item

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  onFilterChange(filter: { category: string; query: string }): void {
    const { category, query } = filter;

    // Filter by category
    this.filteredProducts = this.allProducts.filter((product) => {
      const matchesCategory = !category || product.category === category;

      // Filter by search query
      const matchesQuery = product.title.toLowerCase().includes(query.toLowerCase());

      return matchesCategory && matchesQuery;
    });
  }

  fetchProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.allProducts = data;
        this.filteredProducts = data; // Initially, show all products
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      },
    });
  }

  openItemDetails(item: any): void {
    this.selectedItem = item;
  }

  addToCart(item: any): void {
    const existingItem = this.shoppingCart.find((cartItem) => cartItem.id === item.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.shoppingCart.push({ ...item, quantity: 1 }); // Add with quantity 1
    }

    this.updateCartTotal();
  }

  updateCartTotal(): void {
    this.cartTotal = this.shoppingCart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  removeFromCart(index: number): void {
    const item = this.shoppingCart[index];

    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      this.shoppingCart.splice(index, 1); // Remove the item completely
    }

    this.updateCartTotal();
  }

  purchaseItems(): void {
    if (this.shoppingCart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    const totalCost = this.cartTotal;
    alert(`Purchase successful! Total cost: $${totalCost.toFixed(2)}`);
    this.shoppingCart = []; // Clear the shopping cart
    this.updateCartTotal(); // Reset the total cost
  }

}

