import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseURL = process.env.BASEURL;

export const metroApi = createApi({
  reducerPath: "metroApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    mode: "cors",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "Trip",
    "User",
    "Vehicles",
    "GasStation",
    "Trip Hauling",
    "Trip Delivery",
    "Trip Category",
    "Trip Type",
    "Destination",
    "Trip Template",
    "Trip Live",
  ],
  endpoints: (builder) => ({
    // T R I P S
    getAllTrips: builder.query({
      query: (params) =>
        `/office/trips?page=${params?.page}&limit=${params?.limit}&search=${params?.search}&searchBy=${params?.searchBy}&date=${params?.date}`,
      providesTags: ["Trip"],
    }),
    createTrip: builder.mutation({
      query: (payload) => ({
        url: "/office/trip",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Trip"],
    }),
    updateTrip: builder.mutation({
      query: (payload) => ({
        url: `/office/trip/${payload.id}`,
        method: "PUT",
        body: payload.obj,
      }),
      invalidatesTags: ["Trip"],
    }),
    deleteTrip: builder.mutation({
      query: (payload) => ({
        url: `/office/trip/${payload.id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Trip"],
    }),
    // U S E R S
    getAllUsers: builder.query({
      query: (params) =>
        `/auth/users?page=${params?.page}&limit=${params?.limit}&search=${params?.search}&searchBy=${params?.searchBy}&date=${params?.date}`,
      providesTags: ["User"],
    }),
    createUser: builder.mutation({
      query: (payload) => ({
        url: "/auth/create-user",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation({
      query: (payload) => ({
        url: `/auth/delete-user/${payload}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    updateUser: builder.mutation({
      query: (payload) => ({
        url: `/auth/update-user/${payload.id}`,
        method: "PUT",
        body: payload.obj,
      }),
      invalidatesTags: ["User"],
    }),
    importUsers: builder.mutation({
      query: (payload) => ({
        url: "/auth/import-users",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["User"],
    }),
    // VEHICLES
    getAllVehicles: builder.query({
      query: (params) =>
        `/vehicle/cars?page=${params?.page}&limit=${params?.limit}&search=${params?.search}&searchBy=${params?.searchBy}`,
      providesTags: ["Vehicles"],
    }),
    createVehicle: builder.mutation({
      query: (payload) => ({
        url: "/vehicle/car",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Vehicles"],
    }),
    updateVehicle: builder.mutation({
      query: (payload) => ({
        url: `/vehicle/car/${payload.id}`,
        method: "PUT",
        body: payload.obj,
      }),
      invalidatesTags: ["Vehicles"],
    }),
    deleteVehicle: builder.mutation({
      query: (payload) => ({
        url: `/vehicle/car/${payload}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Vehicles"],
    }),
    importVehicles: builder.mutation({
      query: (payload) => ({
        url: "/vehicle/import-vehicles",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Vehicles"],
    }),
    // GAS STATION
    getAllGasStations: builder.query({
      query: (params) =>
        `/gas-station/stations?page=${params?.page}&limit=${params?.limit}&search=${params?.search}&searchBy=${params?.searchBy}`,
      providesTags: ["GasStation"],
    }),
    createGasStation: builder.mutation({
      query: (payload) => ({
        url: "/gas-station/station",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["GasStation"],
    }),
    updateGasStation: builder.mutation({
      query: (payload) => ({
        url: `/gas-station/station/${payload.id}`,
        method: "PUT",
        body: payload.obj,
      }),
      invalidatesTags: ["GasStation"],
    }),
    deleteGasStation: builder.mutation({
      query: (payload) => ({
        url: `/gas-station/station/${payload}`,
        method: "DELETE",
      }),
      invalidatesTags: ["GasStation"],
    }),
    importGasStations: builder.mutation({
      query: (payload) => ({
        url: "/gas-station/import-stations",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["GasStation"],
    }),
    // DASHBOARD
    getTVDTdeparment: builder.query({
      query: (params) => ({
        url: `/dashboard/tvdt-department?page=${params?.page}&limit=${params?.limit}&search=${params?.search}&searchBy=${params?.searchBy}`,
      }),
    }),
    getHighestKm: builder.query({
      query: (params) => ({
        url: `/dashboard/highest-km?page=${params?.page}&limit=${params?.limit}&search=${params?.search}&searchBy=${params?.searchBy}`,
      }),
    }),
    getLongestDuration: builder.query({
      query: (params) => ({
        url: `/dashboard/longest-duration?page=${params?.page}&limit=${params?.limit}&search=${params?.search}&searchBy=${params?.searchBy}`,
      }),
    }),
    getTotalTripDriver: builder.query({
      query: (params) => ({
        url: `/dashboard/total-trip-driver?page=${params?.page}&limit=${params?.limit}&search=${params?.search}&searchBy=${params?.searchBy}`,
      }),
    }),
    // DEPOT HAULING
    getAllTripsHauling: builder.query({
      query: (params) =>
        `/depot/trips-hauling?page=${params?.page}&limit=${params?.limit}&search=${params?.search}&searchBy=${params?.searchBy}&date=${params?.date}`,
      providesTags: ["Trip Hauling"],
    }),
    updateTripHauling: builder.mutation({
      query: (payload) => ({
        url: `/depot/trip-hauling/${payload.id}`,
        method: "PUT",
        body: payload.obj,
      }),
      invalidatesTags: ["Trip Hauling"],
    }),

    // TRIP TEMPLATE
    getAllTripTemplate: builder.query({
      query: (params) => ({
        url: `/api/data/trip-template?page=${params?.page}&limit=${params?.limit}&search=${params?.search}&searchBy=${params?.searchBy}&date=${params?.date}`,
      }),
      providesTags: ["Trip Template"],
    }),
    createTripTemplate: builder.mutation({
      query: (payload) => ({
        url: "/api/data/trip-template",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Trip Template"],
    }),
    updateTripTemplate: builder.mutation({
      query: (payload) => ({
        url: `/api/data/trip-template/${payload.id}`,
        method: "PUT",
        body: payload.obj,
      }),
      invalidatesTags: ["Trip Template"],
    }),
    importTripTemplate: builder.mutation({
      query: (payload) => ({
        url: "/api/data/import-trip-template",
        method: "POST",
        body: payload,
      }),
    }),

    // TRIP CATEGORY
    getAllTripCategory: builder.query({
      query: (params) =>
        `/api/data/trip-category?page=${params?.page}&limit=${params?.limit}&search=${params?.search}&searchBy=${params?.searchBy}&date=${params?.date}`,
      providesTags: ["Trip Category"],
    }),
    createTripCategory: builder.mutation({
      query: (payload) => ({
        url: "/api/data/trip-category",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Trip Category"],
    }),
    updateTripCategory: builder.mutation({
      query: (payload) => ({
        url: `/api/data/trip-category/${payload.id}`,
        method: "PUT",
        body: payload.obj,
      }),
      invalidatesTags: ["Trip Category"],
    }),
    importTripCategory: builder.mutation({
      query: (payload) => ({
        url: "/api/data/import-trip-categories",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Trip Category"],
    }),

    // TRIP TYPE
    getAllTripType: builder.query({
      query: (params) =>
        `/api/data/trip-type?page=${params?.page}&limit=${params?.limit}&search=${params?.search}&searchBy=${params?.searchBy}&date=${params?.date}`,
      providesTags: ["Trip Type"],
    }),
    createTripType: builder.mutation({
      query: (payload) => ({
        url: "/api/data/trip-type",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Trip Type"],
    }),
    updateTripType: builder.mutation({
      query: (payload) => ({
        url: `/api/data/trip-type/${payload.id}`,
        method: "PUT",
        body: payload.obj,
      }),
      invalidatesTags: ["Trip Type"],
    }),
    importTripType: builder.mutation({
      query: (payload) => ({
        url: "/api/data/import-trip-type",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Trip Type"],
    }),

    // DESTINATION
    getAllDestination: builder.query({
      query: (params) =>
        `/api/data/destinations?page=${params?.page}&limit=${params?.limit}&search=${params?.search}&searchBy=${params?.searchBy}&date=${params?.date}`,
      providesTags: ["Destination"],
    }),
    createDestination: builder.mutation({
      query: (payload) => ({
        url: "/api/data/destination",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Destination"],
    }),
    updateDestination: builder.mutation({
      query: (payload) => ({
        url: `/api/data/destination/${payload.id}`,
        method: "PUT",
        body: payload.obj,
      }),
      invalidatesTags: ["Destination"],
    }),
    importDestination: builder.mutation({
      query: (payload) => ({
        url: "/api/data/import-destinations",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Destination"],
    }),

    // DELIVERY
    getAllDelivery: builder.query({
      query: (params) =>
        `/depot/trips-delivery?page=${params?.page}&limit=${params?.limit}&search=${params?.search}&searchBy=${params?.searchBy}&date=${params?.date}`,
      providesTags: ["Trip Delivery"],
    }),
    updateDelivery: builder.mutation({
      query: (payload) => ({
        url: `/depot/trip-delivery/${payload.id}`,
        method: "PUT",
        body: payload.obj,
      }),
      invalidatesTags: ["Trip Delivery"],
    }),
    // LIVE
    getAllLive: builder.query({
      query: (params) =>
        `/live/trips-live?page=${params?.page}&limit=${params?.limit}&search=${params?.search}&searchBy=${params?.searchBy}&date=${params?.date}`,
      providesTags: ["Trip Live"],
    }),
    updateLive: builder.mutation({
      query: (payload) => ({
        url: `/live/trip-live/${payload.id}`,
        method: "PUT",
        body: payload.obj,
      }),
      invalidatesTags: ["Trip Live"],
    }),
  }),
});

export const {
  // TRIPS
  useGetAllTripsQuery,
  useCreateTripMutation,
  useUpdateTripMutation,
  useDeleteTripMutation,
  // USERS
  useGetAllUsersQuery,
  useCreateUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useImportUsersMutation,
  // VEHICLES
  useGetAllVehiclesQuery,
  useCreateVehicleMutation,
  useUpdateVehicleMutation,
  useDeleteVehicleMutation,
  useImportVehiclesMutation,
  // GAS STATION
  useGetAllGasStationsQuery,
  useCreateGasStationMutation,
  useUpdateGasStationMutation,
  useDeleteGasStationMutation,
  useImportGasStationsMutation,
  // DASHBOARD
  useGetTVDTdeparmentQuery,
  useGetHighestKmQuery,
  useGetLongestDurationQuery,
  useGetTotalTripDriverQuery,
  // DEPOT HAULING
  useGetAllTripsHaulingQuery,
  useUpdateTripHaulingMutation,
  // TRIP CATEGORY
  useGetAllTripCategoryQuery,
  useCreateTripCategoryMutation,
  useUpdateTripCategoryMutation,
  useImportTripCategoryMutation,
  // TRIP TYPE
  useGetAllTripTypeQuery,
  useCreateTripTypeMutation,
  useUpdateTripTypeMutation,
  useImportTripTypeMutation,
  // DESTINATION
  useGetAllDestinationQuery,
  useCreateDestinationMutation,
  useUpdateDestinationMutation,
  useImportDestinationMutation,
  // TRIP TEMPLATE
  useGetAllTripTemplateQuery,
  useCreateTripTemplateMutation,
  useUpdateTripTemplateMutation,
  useImportTripTemplateMutation,
  // DELIVERY
  useGetAllDeliveryQuery,
  useUpdateDeliveryMutation,
  // LIVE
  useGetAllLiveQuery,
  useUpdateLiveMutation,
} = metroApi;
