import React, {useContext, useEffect, useState} from 'react';
import './style.css';
import {CalculatorContext} from "../../contexts";
import {ApiError, CalculatorParams} from "../../types";
import {ErrorAlert} from "../ErrorAlert";
import Box from "@mui/material/Box";
import {CircularProgress, Dialog, DialogContent, IconButton, Typography} from "@mui/material";
import {GridColDef, DataGrid, GridToolbar} from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import SyncIcon from '@mui/icons-material/Sync';
import DeleteIcon from '@mui/icons-material/Delete';
import {LoadingButton} from "../LoadingButton";

interface CalculatorParamsModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  loadParams: (params: CalculatorParams) => void;
}

const CalculatorParamsModal = ({
  isOpen,
  setIsOpen,
  loadParams
}: CalculatorParamsModalProps) => {
  const [calculatorParamsList, setCalculatorParamsList] = useState<CalculatorParams[]>();
  const [error, setError] = useState<ApiError>();
  const [isLoading, setIsLoading] = useState(true);

  const [pendingParamsList, setPendingParamsList] = useState<CalculatorParams[]>([]);

  const [isLoadLoading, setIsLoadLoading] = useState(false);
  const [isDeletionLoading, setIsDeletionLoading] = useState(false);


  const { listCalculatorParams, updateCalculatorParams, deleteCalculatorParams } = useContext(CalculatorContext);

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      width: 300,
      editable: true
    },
    {
      field: 'waterLitreCHF',
      headerName: 'CHF/litres',
      width: 100,
      editable: true,
      type: 'number'
    },
    {
      field: 'waterLitreCo2',
      headerName: 'CO2g/litres',
      width: 100,
      editable: true,
      type: 'number'
    },
    {
      field: 'kwHourCHF',
      headerName: 'CHF/kWh',
      width: 100,
      editable: true,
      type: 'number'
    },
    {
      field: 'kwHourCo2',
      headerName: 'CO2g/kWh',
      width: 100,
      editable: true,
      type: 'number'
    },
    {
      field: 'iceWaterCoolingType1Count',
      headerName: 'Type 1 Count',
      width: 100,
      editable: true,
      type: 'number'
    },
    {
      field: 'iceWaterCoolingType4Count',
      headerName: 'Type 4 Count',
      width: 100,
      editable: true,
      type: 'number'
    },
    {
      field: 'cop',
      headerName: 'COP',
      width: 100,
      editable: true,
      type: 'number'
    },
    {
      field: 'kettles',
      headerName: 'Kettles',
      flex: 1,
      valueGetter: ({ row }) => JSON.stringify(row.kettles)
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 250,
      sortable: false,
      renderCell: (params) => {
        const { row } = params;
        const { id, inUse } = row;
        const isPendingRow = !!pendingParamsList.find(pendingParams => pendingParams.id === id);
        const isRowLoadLoading = isLoadLoading && isPendingRow;
        const isRowDeletionLoading = isDeletionLoading && isPendingRow;
        const isRowDirty = undefined; // TODO: check if row dirty

        return (
          <>
            <LoadingButton
              className='action-button'
              startIcon={<SyncIcon />}
              onClick={() => handleLoadParamsClick(row)}
              loading={isRowLoadLoading}
              disabled={(inUse && !isRowDirty) || isRowDeletionLoading}
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
              onClick={() => handleDeleteParamsClick(row)}
              loading={isRowDeletionLoading}
              disabled={isRowLoadLoading}
            >
              Delete
            </LoadingButton>
          </>
        );
      }
    }
  ];

  useEffect(() => {
    if (isOpen) {
      const setCalculatorParamsLIst = async () => {
        const listCalculatorParamsResponse = await listCalculatorParams();

        if (listCalculatorParamsResponse.success) {
          setCalculatorParamsList(listCalculatorParamsResponse.data!.calculatorParamsList);
        }
        else setError(listCalculatorParamsResponse.error);
      };

      setCalculatorParamsLIst();
    }
  }, [isOpen]);

  useEffect(() => {
    if (calculatorParamsList) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [calculatorParamsList]);

  const handleLoadParamsClick = async (params: CalculatorParams) => {
    setPendingParamsList([...pendingParamsList, params]);
    setIsLoadLoading(true);

    const saveResponse = await updateCalculatorParams(params);
    if (saveResponse.success) {
      updateParamsInUse(params.id);

      // TODO: show success temp alert
    } else {
      // TODO: show error temp alert
    }

    loadParams(params);

    setIsLoadLoading(false);
    setPendingParamsList([]);
  };

  const handleDeleteParamsClick = async (params: CalculatorParams) => {
    setPendingParamsList([...pendingParamsList, params]);
    setIsDeletionLoading(true);

    const deleteResponse = await deleteCalculatorParams(params.id);
    if (deleteResponse.success) {
      deleteParams(params.id);

      // TODO: show success temp alert
    } else {
      // TODO: show error temp alert
    }

    setIsDeletionLoading(false);
    setPendingParamsList([]);
  };

  const updateParamsInUse = (id: number) => setCalculatorParamsList(calculatorParamsList!.map(params => params.id === id
      ? { ...params, inUse: true }
      : { ...params, inUse: false }));

  const deleteParams = (id: number) => setCalculatorParamsList(calculatorParamsList!.filter(params => params.id !== id));

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      PaperProps={{ className: 'params-dialog-paper' }}
    >
      <DialogContent sx={{ overflow: 'hidden', pb: 17 }}>
        <IconButton
          sx={{ position: 'absolute', right: 5, top: 5 }}
          onClick={() => setIsOpen(false)}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h5" align="center" component='h1' gutterBottom mb={4}>
          Saves
        </Typography>

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
                      <DataGrid
                        rows={calculatorParamsList!}
                        columns={columns}
                        sx={{ backgroundColor: '#e3f8fa' }}
                        hideFooter
                        slots={{ toolbar: GridToolbar }}
                        getRowClassName={({ row: { inUse } }) => inUse
                          ? 'data-grid-row-current-row'
                          : ''}
                      />
                    </>
                  )
                }
              </>
            )
        }
      </DialogContent>
    </Dialog>
  );
};

export {
  CalculatorParamsModal
};