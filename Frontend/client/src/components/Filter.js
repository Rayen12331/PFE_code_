import React, { useState } from 'react';
import { useEntryContext } from '../context/entry/entryState';
import { setFilterValues, resetFilter } from '../context/entry/entryReducer';

import {
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';
import { useFilterStyles } from '../styles/muiStyles';
import FilterListIcon from '@material-ui/icons/FilterList';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';

const Filter = () => {
  const [, dispatch] = useEntryContext();
  const [filter, setFilter] = useState({
    Fronend: false,
    Backend: false,
  });
  const classes = useFilterStyles();
  const { Frontend, Backend } = filter;

  const handleCheckboxChange = (event) => {
    setFilter({ ...filter, [event.target.name]: event.target.checked });
  };

  const handleApplyFilter = (e) => {
    e.preventDefault();
    if (Object.values(filter).every((v) => v === false)) {
      return dispatch(resetFilter());
    }

    dispatch(setFilterValues(filter));
  };

  const handleUncheck = () => {
    setFilter({
      Frontend: false,
      Backend: false,
    });
    dispatch(resetFilter());
  };

  return (
    <form className={classes.root} onSubmit={handleApplyFilter}>
      <FormGroup row className={classes.checkboxGroup}>
        <FormControlLabel
          control={
            <Checkbox
              checked={Frontend}
              onChange={handleCheckboxChange}
              name="Frontend"
            />
          }
          label="Frontend"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={Backend}
              onChange={handleCheckboxChange}
              name="Backend"
            />
          }
          label="Backend"
        />
        
        
      
        <Button
          onClick={handleUncheck}
          startIcon={<RotateLeftIcon />}
          variant="outlined"
          size="small"
          className={classes.resetBtn}
        >
          Reset
        </Button>
      </FormGroup>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        startIcon={<FilterListIcon />}
        className={classes.filterButton}
      >
        Apply Filter
      </Button>
    </form>
  );
};

export default Filter;
