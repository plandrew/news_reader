import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const loadCommentsForArticleId = createAsyncThunk(
  'user/loadCommentsForArticleId',
  async (articleId) => {
    const response = await fetch(`/api/articles/${articleId}/comments`);
    const json = await response.json();
    return json;
  }
);

export const postCommentForArticleId = createAsyncThunk(
  'user/postCommentForArticleId',
  async ({ articleId, comment }) => {
    const requestBody = JSON.stringify({comment: comment});
    console.log(requestBody);
    const response = await fetch(`/api/articles/${articleId}/comments`, {
      method: 'POST',
      body: requestBody
    });
    const json = await response.json();
    return json;
  }
);

export const commentsSlice = createSlice({
  name: 'comments',
  initialState: {
    byArticleId: {},
    isLoadingComments: false,
    failedToLoadComments: false,
    createCommentIsPending: false,
    failedToCreateComment: false
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCommentsForArticleId.pending, (state, action) => {
        state.isLoadingComments = true;
        state.failedToLoadComments = false;
      })
      .addCase(loadCommentsForArticleId.fulfilled, (state, action) => {
        state.isLoadingComments = false;
        state.failedToLoadComments = false;
        const { articleId, comments } = action.payload;
        state.byArticleId[articleId] = comments;
      })
      .addCase(loadCommentsForArticleId.rejected, (state, action) => {
        state.isLoadingComments = false;
        state.failedToLoadComments = true;
      })
      .addCase(postCommentForArticleId.pending, (state, action) => {
        state.createCommentIsPending = true;
        state.failedToCreateComment = false;
      })
      .addCase(postCommentForArticleId.fulfilled, (state, action) => {
        state.createCommentIsPending = false;
        state.failedToCreateComment = false;
        const { articleId } = action.payload;
        state.byArticleId[articleId].push(action.payload);
      })
      .addCase(postCommentForArticleId.rejected, (state, action) => {
        state.createCommentIsPending = false;
        state.failedToCreateComment = true;
      });
  }
});

export const selectComments = (state) => state.comments.byArticleId;
export const isLoadingComments = (state) => state.comments.isLoadingComments;
export const createCommentIsPending = (state) => state.comments.createCommentIsPending;

export default commentsSlice.reducer;
