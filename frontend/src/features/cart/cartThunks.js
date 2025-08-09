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
      return item;
    });
  }
);

export const deleteCartItem = createAsyncThunk(
  'cart/deleteCartItem',
  async (id) => {
    const confirmed = await confirmDialog('Remove this item?', 'This action cannot be undone.');
    if (!confirmed) return rejectWithValue('Failed to delete cart item');

    const response = await deleteData(`/api/cart/${id}`);
    if (response.success) {
      await successAlert('Item successfully removed', '');
      return id;
    } else {
      return rejectWithValue('Failed to delete cart item');
    }
  }
);