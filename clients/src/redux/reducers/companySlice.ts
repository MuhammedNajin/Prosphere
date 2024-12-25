import { createAsyncThunk, createSlice, Slice, PayloadAction } from "@reduxjs/toolkit";
import { CompanyApi } from "../../api";
import { UsageStatsType } from "@/types/company";

export const getCompaniesThunk = createAsyncThunk("company/getCompanies", CompanyApi.getCompanies);


interface SelectedCompanySubscription {
  subscription: null;
  company: {
    company_id: string;
    trail_limit: {
      job_post_limit: number;
      video_call_limit: number;
      message_limit: number;
    };
    usage_stats: {
      job_posts_used: number;
      video_calls_used: number;
      messages_used: number;
    };
  };
 
  isTrail: boolean;
}

interface TrailLimit {
  job_post_limit: number;
  video_call_limit: number;
  message_limit: number;
}

interface UsageStats {
  job_posts_used: number;
  video_calls_used: number;
  messages_used: number;
}

interface CompanyState {
  companies: any[];
  selectedCompany: any | null;
  selectedCompanySubscription: SelectedCompanySubscription | null;
  status: string;
}

const initialState: CompanyState = {
  companies: [],
  selectedCompany: null,
  selectedCompanySubscription: null,
  status: ""
};

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    setSelectedCompany: (state, action: PayloadAction<any>) => {
      state.selectedCompany = action.payload;
    },

    setCompanySubscription: (state, action: PayloadAction<any>) => {
      state.selectedCompanySubscription = action.payload;
    },

    setTrailLimit: (state, action: PayloadAction<UsageStatsType>) => {

        if(state.selectedCompanySubscription) {
          if (state.selectedCompanySubscription.company?.usage_stats) {
            state.selectedCompanySubscription.company.usage_stats[action.payload]++;
          }
          
        }
    },


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

export const { setSelectedCompany, setCompanySubscription, setTrailLimit } = companySlice.actions;
export const companyReducer = companySlice.reducer;