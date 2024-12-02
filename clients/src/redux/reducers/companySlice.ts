import { createAsyncThunk, createSlice, Slice, PayloadAction } from "@reduxjs/toolkit";
import { CompanyApi } from "../../api";

export const getCompaniesThunk = createAsyncThunk("company/getCompanies", CompanyApi.getCompanies);

interface CompanyState {
  companies: any[];
  selectedCompany: any | null;
  status: string;
}

const initialState: CompanyState = {
  companies: [],
  selectedCompany: null,
  status: ""
};

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    setSelectedCompany: (state, action: PayloadAction<any>) => {
      state.selectedCompany = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCompaniesThunk.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.companies = action.payload;
        state.status = "success";
      })
      .addCase(getCompaniesThunk.rejected, (state, action) => {
        state.status = "failed";
      })
      .addCase(getCompaniesThunk.pending, (state) => {
        state.status = "loading";
      })
      
  }
});

export const { setSelectedCompany } = companySlice.actions;
export const companyReducer = companySlice.reducer;