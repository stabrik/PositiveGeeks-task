import React, {useState} from "react";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import Box from "@mui/material/Box";

export const SelectId = ({options, handleChange}) => {
  const [optionId, setOptionId] = useState('');

  const handleChange2 = (event) => {
    setOptionId(event.target.value);
    handleChange(event.target.value)
  };

  return (
      <Box sx={{ marginTop: '10px' }}>
        <FormControl fullWidth>
          <InputLabel id="selectId">ID</InputLabel>
          <Select
              labelId="selectId"
              id="selectId"
              value={optionId}
              label="selectId"
              onChange={handleChange2}
          >
            {options.map(id => <MenuItem key={id} value={id}>{id}</MenuItem>)}
            <MenuItem key={'all'} value={0}>Wszyscy</MenuItem>
          </Select>
        </FormControl>
      </Box>
  )
}