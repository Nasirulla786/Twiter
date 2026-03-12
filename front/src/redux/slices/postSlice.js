import { createSlice } from "@reduxjs/toolkit";


const postSlice = createSlice({

    name:"post",
    initialState:{
        postData:null,
        savePost:[]
    },
    reducers:{
        setPostData : (state , action)=>{
            state.postData = action.payload
        },
        setSavePost :(state,action)=>{
            state.savePost = action.payload;
        }

    }
})

export const {setPostData , setSavePost} = postSlice.actions;
export default postSlice.reducer
