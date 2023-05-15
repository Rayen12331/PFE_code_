const filterEntries = (filterObj, entriesArray) => {
  const filteredArray = [];

  if (!filterObj || Object.values(filterObj).every((v) => v === false)) {
    return entriesArray;
  }

  if (filterObj.Frontend) {
    filteredArray.push(
      ...entriesArray.filter(
        (e) => e.type === 'Frontend' && !filteredArray.includes(e)
      )
    );
  }

  if (filterObj.Backend) {
    filteredArray.push(
      ...entriesArray.filter(
        (e) => e.type === 'Backend' && !filteredArray.includes(e)
      )
    );
  }



 

  return filteredArray;
};

export default filterEntries;