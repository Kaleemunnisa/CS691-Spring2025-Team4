import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch user orders
export const fetchUserOrders = createAsyncThunk('orders/fetchUserOrders', async (
  _, { rejectWithValue }) => {
    try {
      const response = axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/my-orders`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
          },
        }
      );
      return (await response).data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  });
  
  // Async thunk to fetch orders details by ID
  export const fetchOrderDeatils = createAsyncThunk('orders/fetchOrderDetails', async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  });

  const orderSlice = createSlice({
    name: "orders",
    initialState: {
      orders: [],
      totalOrders: 0,
      orderDetails: null,
      loading: false,
      error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
      // Fetch user orders
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
         // Fetch order details
         .addCase(fetchOrderDeatils.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchOrderDeatils.fulfilled, (state, action) => {
          state.loading = false;
          state.orderDetails = action.payload;
        })
        .addCase(fetchOrderDeatils.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload.message;
        });
    },
  });

export default orderSlice.reducer;