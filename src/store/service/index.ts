import { type BaseQueryFn, createApi } from "@reduxjs/toolkit/query/react";
import { request } from "@/utils/api";
import type { AxiosError, AxiosRequestConfig } from "axios";

const axiosBaseQuery =
  (): BaseQueryFn<AxiosRequestConfig> => async (config) => {
    try {
      const result = await request(config);
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data,
        },
      };
    }
  };
// initialize an empty api service that we'll inject endpoints into later as needed
export const rootServiceApi = createApi({
  baseQuery: axiosBaseQuery(),
  endpoints: () => ({}),
  tagTypes: [
    "get-user",
    "get-screenings-for-therapist",
    "get-channels",
    "get-goals",
    "get-progresses",
    "web-push-subscription",
    "get-objectives",
    "ParentProfiles",
    "get-parent-tasks",
    "get-single-parent-task",
    "get-course",
    "get-all-course",
    "get-course-ratings",
    "get-user-rating",
    "get-chat-rooms",
    "unread-message-page-number",
    "get-initial-calls",
    "zoom-meetings",
    "get-parents",
    "get-applications-advisor",
    "get-applications-therapist",
    "get-therapist-patients",
    "get-therapist-list",
    "get-parent-therapy-info",
    "get-user-journeys",
    "get-task-comments",
    "openai-sessions",
    "openai-messages",
  ],
  refetchOnReconnect: true,
});
