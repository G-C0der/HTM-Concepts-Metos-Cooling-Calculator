import React, {useContext, useEffect, useState} from 'react';
import {AdminContext, CalculatorContext} from "../../contexts";
import {
  ApiDataAllCalculatorParamsList,
  ApiDataCalculatorParams, ApiDataCalculatorParamsList,
  ApiError,
  ApiResponse,
  CalculatorParams
} from "../../types";
import {ErrorAlert} from "../ErrorAlert";
import Box from "@mui/material/Box";
import {CircularProgress} from "@mui/material";
import {
  GridColDef,
  DataGrid,
  GridToolbar,
  GridRowSelectionModel,
  GridValueGetterParams,
  GridRenderCellParams
} from "@mui/x-data-grid";
import {DataGridPro} from "@mui/x-data-grid-pro";
import SyncIcon from '@mui/icons-material/Sync';
import DeleteIcon from '@mui/icons-material/Delete';
import {LoadingButton} from "../LoadingButton";
import {ConfirmationDialog} from "../ConfirmationDialog";
import {CalculatorParamsKettlesDataGrid} from "../CalculatorParamsKettlesDataGrid";
import {paramsFieldLabels, userFieldLabels} from "../../constants";

interface CalculatorParamsDataGridProps {
  isModalOpen: boolean;
  isAdminMode?: boolean;
  loadParams?: (params: CalculatorParams) => void;
  initialParamsLoadDone?: boolean;
  setInitialParamsLoadDone?: (hasRenderedOnce: boolean) => void;
  wereParamsSaved?: boolean;
  wereParamsCleared?: boolean;
  setWereParamsCleared?: (wereParamsCleared: boolean) => void;
  setApiResponse?: (apiResponse: ApiResponse<never | ApiDataCalculatorParams> | undefined) => void;
  setSuccessMessage?: (successMessage: string) => void;
}

const CalculatorParamsDataGrid = ({
  isModalOpen,
  isAdminMode,
  loadParams,
  initialParamsLoadDone,
  setInitialParamsLoadDone,
  wereParamsSaved,
  wereParamsCleared,
  setWereParamsCleared,
  setApiResponse,
  setSuccessMessage
}: CalculatorParamsDataGridProps) => {
  const [calculatorParamsList, setCalculatorParamsList] = useState<CalculatorParams[]>();
  const [error, setError] = useState<ApiError>();
  const [isLoading, setIsLoading] = useState(true);

  const [pendingParams, setPendingParams] = useState<CalculatorParams>();
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const [isLoadLoading, setIsLoadLoading] = useState(false);
  const [isDeletionLoading, setIsDeletionLoading] = useState(false);

  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);

  const { listCalculatorParams, updateCalculatorParams, deleteCalculatorParams } = useContext(CalculatorContext);
  const { listAllCalculatorParams } = useContext(AdminContext);

  const columns: GridColDef[] = [
    ...(isAdminMode ? [
      {
        field: 'company',
        headerName: userFieldLabels['company'],
        width: 200,
        valueGetter: ({ row }: GridValueGetterParams) => row.user.company
      },
      {
        field: 'fname',
        headerName: userFieldLabels['fname'],
        width: 140,
        valueGetter: ({ row }: GridValueGetterParams) => row.user.fname
      },
      {
        field: 'lname',
        headerName: userFieldLabels['lname'],
        width: 140,
        valueGetter: ({ row }: GridValueGetterParams) => row.user.lname
      }
    ] : []),
    {
      field: 'name',
      headerName: paramsFieldLabels['name'],
      width: 300,
      editable: true
    },
    {
      field: 'waterLitreCHF',
      headerName: paramsFieldLabels['waterLitreCHF'],
      width: 100,
      editable: true,
      type: 'number'
    },
    {
      field: 'waterLitreCo2',
      headerName: paramsFieldLabels['waterLitreCo2'],
      width: 100,
      editable: true,
      type: 'number'
    },
    {
      field: 'kwHourCHF',
      headerName: paramsFieldLabels['kwHourCHF'],
      width: 100,
      editable: true,
      type: 'number'
    },
    {
      field: 'kwHourCo2',
      headerName: paramsFieldLabels['kwHourCo2'],
      width: 100,
      editable: true,
      type: 'number'
    },
    {
      field: 'iceWaterCoolingType1Count',
      headerName: paramsFieldLabels['iceWaterCoolingType1Count'],
      width: 120,
      editable: true,
      type: 'number'
    },
    {
      field: 'iceWaterCoolingType4Count',
      headerName: paramsFieldLabels['iceWaterCoolingType4Count'],
      width: 120,
      editable: true,
      type: 'number'
    },
    {
      field: 'cop',
      headerName: paramsFieldLabels['cop'],
      width: 70,
      editable: true,
      type: 'number'
    },
    ...(isAdminMode ? [] : [{
      field: 'actions',
      headerName: 'Actions',
      width: 250,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params;
        const { id } = row;
        const isPendingRow = pendingParams?.id === id;
        const isRowLoadLoading = isLoadLoading && isPendingRow;
        const isRowDeletionLoading = isDeletionLoading && isPendingRow;

        return (
          <>
            <LoadingButton
              className='action-button'
              startIcon={<SyncIcon />}
              onClick={() => handleLoadParamsClick(row)}
              loading={isRowLoadLoading}
              disabled={isRowDeletionLoading}
              // disabled={(inUse && !isRowDirty) || isRowDeletionLoading} TODO: not working without listener from MUI DataGridPro or self implemented TextFields for cell rendering
            >
              Load
            </LoadingButton>

            <LoadingButton
              className='action-button'
              sx={{
                borderColor: 'red',
                color: 'red',
                ml: 2
              }}
              startIcon={<DeleteIcon />}
              onClick={() => {
                setPendingParams(row);
                setIsConfirmDialogOpen(true);
              }}
              loading={isRowDeletionLoading}
              disabled={isRowLoadLoading}
            >
              Delete
            </LoadingButton>
          </>
        );
      }
    }])
  ];

  useEffect(() => {
    setIsLoading(true);

    if (isModalOpen) {
      const setCalculatorParamsLIst = async () => {
        const resetParams = wereParamsCleared
          ? true
          : wereParamsSaved
            ? false
            : !initialParamsLoadDone;
        const listCalculatorParamsResponse = isAdminMode
          ? await listAllCalculatorParams()
          : await listCalculatorParams(resetParams);

        if (listCalculatorParamsResponse.success) {
          setError(undefined);

          const paramsList = isAdminMode
            ? (listCalculatorParamsResponse.data as ApiDataAllCalculatorParamsList).allCalculatorParamsList
            : (listCalculatorParamsResponse.data as ApiDataCalculatorParamsList).calculatorParamsList;
          setCalculatorParamsList(paramsList);

          if (!isAdminMode) {
            if (!initialParamsLoadDone) setInitialParamsLoadDone!(true);
            if (wereParamsCleared) setWereParamsCleared!(false);
          }
        }
        else setError(listCalculatorParamsResponse.error);
      };

      setCalculatorParamsLIst();
    }
  }, [isModalOpen, isAdminMode]);

  useEffect(() => {
    if (calculatorParamsList) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [calculatorParamsList]);

  const handleLoadParamsClick = async (params: CalculatorParams) => {
    setPendingParams(params);
    setIsLoadLoading(true);

    const updateResponse = await updateCalculatorParams(params);
    setApiResponse!(updateResponse);
    if (updateResponse.success) {
      setSuccessMessage!('Parameters have been saved and loaded.');

      updateParams(updateResponse.data!.calculatorParams);

      setSelectedRows([]);
    }

    loadParams!(params);

    setIsLoadLoading(false);
    setPendingParams(undefined);
  };

  const handleDeleteParamsClick = async (params: CalculatorParams) => {
    setIsDeletionLoading(true);

    const deleteResponse = await deleteCalculatorParams(params.id);
    setApiResponse!(deleteResponse);
    if (deleteResponse.success) {
      setSuccessMessage!('Parameters have been deleted.');

      deleteParams(params.id);
    }

    setPendingParams(undefined);
    setIsDeletionLoading(false);
  };

  const updateParams = (params: CalculatorParams) => setCalculatorParamsList(
    calculatorParamsList!.map(_params => _params.id === params.id
      ? { ...params, inUse: true }
      : { ..._params, inUse: false })
  );

  const deleteParams = (id: number) => setCalculatorParamsList(calculatorParamsList!.filter(params => params.id !== id));

  return (
    <>
      {
        error
          ? (
            <ErrorAlert error={error} />
          ) : (
            <>
              {
                isLoading ? (
                  <Box style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}>
                    <CircularProgress size={80} />
                  </Box>
                ) : (
                  <>
                    {
                      isAdminMode
                        ? (
                          <DataGridPro
                            rows={calculatorParamsList!}
                            columns={columns}
                            sx={{ backgroundColor: '#e3f8fa' }}
                            hideFooter
                            slots={{ toolbar: GridToolbar }}
                            rowSelectionModel={selectedRows}
                            onRowSelectionModelChange={(rowSelectionModel) => setSelectedRows(rowSelectionModel)}
                            getDetailPanelContent={({ row }) => <CalculatorParamsKettlesDataGrid kettles={row.kettles} />}
                          />
                        ) : (
                          <DataGrid
                            rows={calculatorParamsList!}
                            columns={columns}
                            sx={{ backgroundColor: '#e3f8fa' }}
                            hideFooter
                            slots={{ toolbar: GridToolbar }}
                            getRowClassName={({ row: { inUse } }) => inUse
                              ? 'data-grid-row-current-row'
                              : ''}
                            rowSelectionModel={selectedRows}
                            onRowSelectionModelChange={(rowSelectionModel) => setSelectedRows(rowSelectionModel)}
                          />
                        )
                    }
                    {
                      pendingParams && (
                        <ConfirmationDialog
                          text={`Are you sure you want to delete the save "${pendingParams.name}"?`}
                          pendingAction={() => handleDeleteParamsClick(pendingParams)}
                          isOpen={isConfirmDialogOpen}
                          setIsOpen={setIsConfirmDialogOpen}
                        />
                      )
                    }
                  </>
                )
              }
            </>
          )
      }
    </>
  );
};

export {
  CalculatorParamsDataGrid
};