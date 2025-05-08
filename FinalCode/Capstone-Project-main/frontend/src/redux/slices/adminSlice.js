import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

// Fetch all users (admin only)
export const fetchUsers = createAsyncThunk('admin/fetchUsers', async () => {
  const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("userToken")}`
    },
  });
  return response.data; // make sure to return
});

// Add a user
export const addUser = createAsyncThunk('admin/addUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,
      userData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );
    return response.data.user; // assume it's returning the created user object
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Update user info
export const updateUser = createAsyncThunk('admin/updateUser',
  async ({ id, name, email, role }) => {
    const response = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`,
      { name, email, role },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );
    return response.data.user; // make sure to return
  });

// Delete a user
export const deleteUser = createAsyncThunk('admin/deleteUser', async (id) => {
  await axios.delete(
    `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`
      },
    }
  );
  return id;
});

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Add user
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload); // ✅ push directly if payload is the new user
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update user
      .addCase(updateUser.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        const index = state.users.findIndex((user) => user._id === updatedUser._id);
        if (index !== -1) {
          state.users[index] = updatedUser;
        }
      })

      // Delete user
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user._id !== action.payload);
      });
  }
});

export default adminSlice.reducer;
