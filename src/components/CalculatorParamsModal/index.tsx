import React, {useContext, useEffect, useState} from 'react';
import {CalculatorContext} from "../../contexts";
import {ApiError, CalculatorParams} from "../../types";
import {ErrorAlert} from "../ErrorAlert";
import Box from "@mui/material/Box";
import {CircularProgress} from "@mui/material";
import {GridColDef, DataGrid, GridToolbar} from "@mui/x-data-grid";
import SyncIcon from '@mui/icons-material/Sync';
import DeleteIcon from '@mui/icons-material/Delete';
import {LoadingButton} from "../LoadingButton";
import {ConfirmationDialog} from "../ConfirmationDialog";
import {Modal} from "../Modal";

interface CalculatorParamsModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  loadParams: (params: CalculatorParams) => void;
  wereParamsCleared: boolean;
  setWereParamsCleared: (wereParamsCleared: boolean) => void;
}

const CalculatorParamsModal = ({
  isOpen,
  setIsOpen,
  loadParams,
  wereParamsCleared,
  setWereParamsCleared
}: CalculatorParamsModalProps) => {
  const [calculatorParamsList, setCalculatorParamsList] = useState<CalculatorParams[]>();
  const [error, setError] = useState<ApiError>();
  const [isLoading, setIsLoading] = useState(true);

  const [pendingParams, setPendingParams] = useState<CalculatorParams>();
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

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
      width: 120,
      editable: true,
      type: 'number'
    },
    {
      field: 'iceWaterCoolingType4Count',
      headerName: 'Type 4 Count',
      width: 120,
      editable: true,
      type: 'number'
    },
    {
      field: 'cop',
      headerName: 'COP',
      width: 70,
      editable: true,
      type: 'number'
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 250,
      sortable: false,
      renderCell: (params) => {
        const { row } = params;
        const { id, inUse } = row;
        const isPendingRow = pendingParams?.id === id;
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
    }
  ];

  useEffect(() => {
    if (isOpen) {
      const setCalculatorParamsLIst = async () => {
        const resetParams = wereParamsCleared ? true : !calculatorParamsList;
        const listCalculatorParamsResponse = await listCalculatorParams(resetParams);

        if (listCalculatorParamsResponse.success) {
          setCalculatorParamsList(listCalculatorParamsResponse.data!.calculatorParamsList);

          if (wereParamsCleared) setWereParamsCleared(false);
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
    setPendingParams(params);
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
    setPendingParams(undefined);
  };

  const handleDeleteParamsClick = async (params: CalculatorParams) => {
    setIsDeletionLoading(true);

    const deleteResponse = await deleteCalculatorParams(params.id);
    if (deleteResponse.success) {
      deleteParams(params.id);

      // TODO: show success temp alert
    } else {
      // TODO: show error temp alert
    }

    setPendingParams(undefined);
    setIsDeletionLoading(false);
  };

  const updateParamsInUse = (id: number) => setCalculatorParamsList(calculatorParamsList!.map(params => params.id === id
      ? { ...params, inUse: true }
      : { ...params, inUse: false }));

  const deleteParams = (id: number) => setCalculatorParamsList(calculatorParamsList!.filter(params => params.id !== id));

  return (
    <Modal title='Saves' isOpen={isOpen} setIsOpen={setIsOpen}>
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
    </Modal>
  );
};

export {
  CalculatorParamsModal
};