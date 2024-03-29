import { Stack } from "@mui/system";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetAllVehiclesQuery,
  useImportVehiclesMutation,
} from "../../api/metroApi";
import TableError from "../../components/error/TableError";
import TableVehicles from "../../components/masterlist/vehicles/TableVehicles";
import TableSkeleton from "../../components/skeleton/TableSkeleton";
import TableUI from "../../components/table/TableUI";
import TableWrapper from "../../components/table/TableWrapper";
import useRefresh from "../../hook/useRefresh";
import { columns, dropData } from "../../utility/table-columns/vehicleColumns";
import "../../style/outlet/users/users.scss";
import SearchField from "../../components/table/SearchField";
import { useForm } from "react-hook-form";
import {
  setSearch,
  setSearchBy,
} from "../../redux-toolkit/counter/featuresCounter";
import ButtonField from "../../components/table/ButtonField";
import useDisclosure from "../../hook/useDisclosure";
import { yupResolver } from "@hookform/resolvers/yup";
import { searchNoDateSchema, searchSchema } from "../../utility/schema";
import ExportModal from "../../components/features/ExportModal";
import ImportModal from "../../components/features/ImportModal";
import useExcel from "../../hook/useExcel";
import dayjs from "dayjs";
import useToast from "../../hook/useToast";
import VehicleDrawer from "../../components/masterlist/vehicles/VehicleDrawer";
import {
  onToggle as onToggleCreate,
  setDrawerState,
} from "../../redux-toolkit/counter/drawerDisclosure";

const Vehicles = () => {
  // RTK
  const dispatch = useDispatch();
  const { page, limit, search, searchBy } = useSelector(
    (state) => state.features.table
  );

  // HOOKS
  const { refresh } = useRefresh();
  const { excelExport, excelImport } = useExcel();
  const { toast } = useToast();
  const { isOpen, onClose, onToggle } = useDisclosure();
  const {
    isOpen: isOpenExport,
    onClose: onCloseExport,
    onToggle: onToggleExport,
  } = useDisclosure();
  const {
    isOpen: isOpenImport,
    onClose: onCloseImport,
    onToggle: onToggleImport,
  } = useDisclosure();

  // RTK QUERY
  const { data, isLoading, isError, isFetching } = useGetAllVehiclesQuery(
    { page: page, limit: limit, search: search, searchBy: searchBy },
    { refetchOnMountOrArgChange: true }
  );

  const [importVehicles, { isLoading: isImporting }] =
    useImportVehiclesMutation();

  // REACT HOOK FORM
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    control,
  } = useForm({
    defaultValues: {
      search_by: {
        id: "plate_no",
        label: "Plate Number",
      },
    },
    resolver: yupResolver(searchNoDateSchema),
    mode: "onChange",
  });

  useEffect(() => {
    return () => {
      refresh();
    };
  }, []);

  // FUNCTION
  const handleSearch = (data) => {
    dispatch(setSearch(data.search));
    dispatch(setSearchBy(data.search_by?.id || null));
  };

  const handleToggleExport = async () => {
    onToggleExport();

    const newObj = await data?.data?.map((item) => {
      return {
        "Plate Number": item?.plate_no,
        "Vehicle Type": item?.vehicle_type,
        Name: item?.name,
        Brand: item?.brand,
        "Fuel Type": item?.fuel_type,
        "KM Per Liter": item?.km_per_liter,
        Department: item?.department?.label,
        Created: dayjs(item?.createdAt).format("MMM-DD-YYYY"),
      };
    });

    await excelExport(newObj, "METRO-VEHICLES-MASTERLIST");

    onCloseExport();
  };

  const handleImport = async (data) => {
    const filteredData = await excelImport(data);

    if ("plate_no" in filteredData[0]) {
      const res = await importVehicles(filteredData);
      res?.error &&
        toast({ severity: "error", message: "Error importing vehicles" });
    } else {
      toast({
        severity: "error",
        message:
          "Missing fields. Please make sure your importing the correct file",
      });
    }

    onCloseImport();
  };

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (isError) {
    return <TableError />;
  }

  return (
    <>
      <TableWrapper>
        {/* TABLE HEADER */}
        <Stack direction="row" className="table__header">
          {data && (
            <>
              <SearchField
                onSubmit={handleSubmit(handleSearch)}
                control={control}
                errors={errors}
                register={register}
                options={dropData}
                isFetching={isFetching}
              />

              <ButtonField
                handleRefresh={() => refresh(reset)}
                handleToggleExport={handleToggleExport}
                handleToggleImport={onToggleImport}
                handleCreate={() => {
                  dispatch(onToggleCreate());
                  dispatch(setDrawerState(null));
                }}
              />
            </>
          )}
        </Stack>
        <TableUI
          isFetching={isFetching}
          data={data}
          columns={columns}
          rows={data.data.map((item, i) => {
            return <TableVehicles key={i} item={item} columns={columns} />;
          })}
        />

        {/* CREATE DRAWER */}

        <VehicleDrawer />

        {/* EXPORT LOADING */}
        <ExportModal isOpenExport={isOpenExport} />

        {/* IMPORT MODAL */}
        <ImportModal
          isOpenImport={isOpenImport}
          onCloseImport={onCloseImport}
          func={handleImport}
          isImporting={isImporting}
        />
      </TableWrapper>
    </>
  );
};

export default Vehicles;
