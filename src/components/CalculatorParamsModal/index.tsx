import React from 'react';
import {ApiDataCalculatorParams, ApiResponse, CalculatorParams} from "../../types";
import {Modal} from "../Modal";
import {CalculatorParamsGrid} from "../CalculatorParamsDataGrid";

interface CalculatorParamsModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  loadParams: (params: CalculatorParams) => void;
  wereParamsSaved: boolean;
  wereParamsCleared: boolean;
  setWereParamsCleared: (wereParamsCleared: boolean) => void;
  setApiResponse: (apiResponse: ApiResponse<never | ApiDataCalculatorParams> | undefined) => void;
  setSuccessMessage: (successMessage: string) => void;
}

const CalculatorParamsModal = ({
  isOpen,
  setIsOpen,
  loadParams,
  wereParamsSaved,
  wereParamsCleared,
  setWereParamsCleared,
  setApiResponse,
  setSuccessMessage
}: CalculatorParamsModalProps) => {
  return (
    <Modal title='Saves' isOpen={isOpen} setIsOpen={setIsOpen}>
      <CalculatorParamsGrid
        isOpen={isOpen}
        loadParams={loadParams}
        wereParamsSaved={wereParamsSaved}
        wereParamsCleared={wereParamsCleared}
        setWereParamsCleared={setWereParamsCleared}
        setApiResponse={setApiResponse}
        setSuccessMessage={setSuccessMessage}
      />
    </Modal>
  );
};

export {
  CalculatorParamsModal
};