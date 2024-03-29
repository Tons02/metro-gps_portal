import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  useRouteError,
} from "react-router-dom";

import Dashboard from "../containers/Dashboard";
import Login from "../containers/Login";
import Map from "../containers/Map";
import NotFound from "../containers/NotFound";
import Users from "../containers/masterlist/Users";
import Vehicles from "../containers/masterlist/Vehicles";
import GasStations from "../containers/masterlist/GasStations";
import Trips from "../containers/masterlist/Trips";
import RootLayout from "../shared/layouts/RootLayout";
import Lottie from "lottie-react";
import underMaintenance from "../assets/images/lottie/maintenance.json";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import TripDepot from "../containers/masterlist/depot/TripDepot";
import TripCategory from "../containers/masterlist/TripCategory";
import TripType from "../containers/masterlist/TripType";
import Destination from "../containers/masterlist/Destination";
import TripTemplate from "../containers/masterlist/TripTemplate";
import TripLive from "../containers/masterlist/TripLive";

const Routing = () => {
  const token = useSelector((state) => state.token.value);
  const user = useSelector((state) => state.token.userDetails);
  const [validUser, setValideUser] = useState();

  useEffect(() => {
    setValideUser(user?.role === "admin");
  }, [user]);

  const AuthenticatedRoutes = () => {
    return token ? <RootLayout /> : <Navigate to="/login" />;
  };

  const ValidateLogin = () => {
    return token ? <Navigate to="/" /> : <Login />;
  };

  // Add this when have a bug that fixing is ongoing
  const UnderMaintenance = () => {
    return (
      <Box
        sx={{
          width: "750px",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Lottie animationData={underMaintenance} loop={true} />
      </Box>
    );
  };

  const ErrorElement = () => {
    let error = useRouteError();

    return <Typography>{error.toString()}</Typography>;
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <AuthenticatedRoutes />,
      children: [
        {
          path: "/",
          element: validUser ? <Dashboard /> : null,
          errorElement: <ErrorElement />,
        },
        // MASTERLIST
        {
          path: "/masterlist/users",
          element:
            validUser && user.permission?.some((el) => el?.id === "users") ? (
              <Users />
            ) : (
              <NotFound />
            ),
          errorElement: <ErrorElement />,
        },
        {
          path: "/masterlist/vehicles",
          element:
            validUser &&
            user.permission?.some((el) => el?.id === "vehicles") ? (
              <Vehicles />
            ) : (
              <NotFound />
            ),
          errorElement: <ErrorElement />,
        },
        {
          path: "/masterlist/gas-stations",
          element:
            validUser &&
            user.permission?.some((el) => el?.id === "gas_stations") ? (
              <GasStations />
            ) : (
              <NotFound />
            ),
          errorElement: <ErrorElement />,
        },
        {
          path: "/masterlist/trip-template",
          element:
            validUser &&
            user.permission?.some((el) => el?.id === "trip-template") ? (
              <TripTemplate />
            ) : (
              <NotFound />
            ),
          errorElement: <ErrorElement />,
        },
        {
          path: "/masterlist/trip-category",
          element:
            validUser &&
            user.permission?.some((el) => el?.id === "trip-category") ? (
              <TripCategory />
            ) : (
              <NotFound />
            ),
          errorElement: <ErrorElement />,
        },
        {
          path: "/masterlist/trip-type",
          element:
            validUser &&
            user.permission?.some((el) => el?.id === "trip-type") ? (
              <TripType />
            ) : (
              <NotFound />
            ),
          errorElement: <ErrorElement />,
        },
        {
          path: "/masterlist/destination",
          element:
            validUser &&
            user.permission?.some((el) => el?.id === "destination") ? (
              <Destination />
            ) : (
              <NotFound />
            ),
          errorElement: <ErrorElement />,
        },

        // REPORTS
        {
          path: "/reports",
          element: null,
        },
        {
          path: "/reports/trips-sg",
          element:
            validUser &&
            user.permission?.some((el) => el?.id === "trips_sg") ? (
              <Trips />
            ) : (
              <NotFound />
            ),
          errorElement: <ErrorElement />,
        },
        {
          path: "/reports/trips-depot",
          element:
            validUser &&
            user.permission?.some((el) => el?.id === "trips_depot") ? (
              <TripDepot />
            ) : (
              <NotFound />
            ),
          errorElement: <ErrorElement />,
        },
        {
          path: "/reports/trips-live",
          element:
            validUser &&
            user.permission?.some((el) => el?.id === "trips_live") ? (
              <TripLive />
            ) : (
              <NotFound />
            ),
          errorElement: <ErrorElement />,
        },

        // MAP
        {
          path: "/map/:id/:category",
          element: <Map />,
          errorElement: <ErrorElement />,
        },
        {
          path: "/map",
          element: <Map />,
          errorElement: <ErrorElement />,
        },

        // ERROR HANDLING
        {
          path: "*",
          element: <NotFound />,
          errorElement: <ErrorElement />,
        },
      ],
    },
    {
      path: "/login",
      element: <ValidateLogin />,
      errorElement: <ErrorElement />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Routing;
