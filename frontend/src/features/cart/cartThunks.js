import { fetchData, deleteData } from "../../services/api";
import { confirmDialog, successAlert } from "../../utils/swal";
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async () => {
    const response = await fetchData('/api/cart');
    if (!response.success) throw new Error('Failed to fetch cart');

    return response.cart.map((item) => {
      if (item.quantity > item.stock){
        item.quantity = item.stock;
      }
      return { ...item, isSelected: item.variant.stock === 0};
    });
  }
);

export const deleteCartItem = createAsyncThunk(
  'cart/deleteCartItem',
  async ({ id }) => {
    const confirmed = await confirmDialog('Remove this item?', 'This action cannot be undone.');
    if (!confirmed) return;

    const response = await deleteData(`/api/cart/${id}`);
    if (response.success) {
      successAlert('Item successfully removed', '');
      return id;
    } else {
      throw new Error('Failed to delete cart item');
    }
  }
);