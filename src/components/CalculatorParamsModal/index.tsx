import React, {useContext, useEffect, useState} from 'react';
import './style.css';
import {CalculatorContext} from "../../contexts";
import {ApiError, CalculatorParams} from "../../types";
import {ErrorAlert} from "../ErrorAlert";
import Box from "@mui/material/Box";
import {CircularProgress, Dialog, DialogContent, IconButton, Typography} from "@mui/material";
import {GridColDef, DataGridPremium, GridToolbar} from "@mui/x-data-grid-premium";
import CloseIcon from "@mui/icons-material/Close";

interface CalculatorParamsModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const CalculatorParamsModal = ({ isOpen, setIsOpen }: CalculatorParamsModalProps) => {
  const [calculatorParamsList, setCalculatorParamsList] = useState<CalculatorParams[]>();
  const [error, setError] = useState<ApiError>();
  const [isLoading, setIsLoading] = useState(true);

  const { listCalculatorParams, saveCalculatorParams } = useContext(CalculatorContext);

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      width: 300
    },
    {
      field: 'waterLitreCHF',
      headerName: 'CHF/litres',
      width: 100
    },
    {
      field: 'waterLitreCo2',
      headerName: 'CO2g/litres',
      width: 100
    },
    {
      field: 'kwHourCHF',
      headerName: 'CHF/kWh',
      width: 100
    },
    {
      field: 'kwHourCo2',
      headerName: 'CO2g/kWh',
      width: 100
    },
    {
      field: 'iceWaterCoolingType1Count',
      headerName: 'Type 1 Count',
      width: 100
    },
    {
      field: 'iceWaterCoolingType4Count',
      headerName: 'Type 4 Count',
      width: 100
    },
    {
      field: 'cop',
      headerName: 'COP',
      width: 100
    },
    {
      field: 'kettles',
      headerName: 'Kettles',
      width: 800,
      valueGetter: ({ row }) => JSON.stringify(row.kettles)
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
          Parameters
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
                      <DataGridPremium
                        rows={calculatorParamsList!}
                        columns={columns}
                        sx={{ backgroundColor: '#e3f8fa' }}
                        hideFooter
                        slots={{ toolbar: GridToolbar }}
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