import React, {useState} from 'react';
import {ApiDataCalculatorParams, ApiResponse, CalculatorParams} from "../../types";
import {Modal} from "../Modal";
import {CalculatorParamsDataGrid} from "../CalculatorParamsDataGrid";

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
  ...props
}: CalculatorParamsModalProps) => {
  const [initialParamsLoadDone, setInitialParamsLoadDone] = useState(false);

  return (
    <Modal title='Saves' isOpen={isOpen} setIsOpen={setIsOpen}>
      <CalculatorParamsDataGrid
        isModalOpen={isOpen}
        initialParamsLoadDone={initialParamsLoadDone}
        setInitialParamsLoadDone={setInitialParamsLoadDone}
        {...props}
      />
    </Modal>
  );
};

export {
  CalculatorParamsModal
};