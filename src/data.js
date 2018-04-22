export const csvArrayToObject = (csvArray) => (
  csvArray.reduce((acc, row, i, array) => {
    if (i === 0){
      return acc;
    }
    let entry = {};
    row.forEach((val, i) => {
      const result = val.match(/\[(.*?)\]/);
      let cell = result ? JSON.parse(val) : [val];
      entry[array[0][i]] = cell;
    })
    acc.push(entry);
    return acc;
  }, [])
);

export const sankeyData = (data, display) => {

  const { cols, nodeOrderColorKey, colorScheme } = display;

  // Extract and index enties from CSV rows
  let entityLabelToId = {};
  let entityIdToLabel = {};
  let entityLabelToRowIds = {};
  let entityIdCursor = 0;
  let entityIdToCol = {}
  data.forEach((row, i) => {
    cols.forEach((col) => {
      row[col].forEach((val) => {
        if (val && !entityLabelToId.hasOwnProperty(val)){
          let value = val;
          if (Array.isArray(val) && val.length === 1){
            value = val[0];
          }
          entityLabelToId[value] = entityIdCursor;
          entityIdToLabel[entityIdCursor] = value;
          entityIdToCol[entityIdCursor] = col;
          entityIdCursor++;
        }
      })
    })
  });

  // Tally shared rows between links
  let entityLinks = {};
  let stateTotals = { 1: 0, 2: 0, 3: 0, 4: 0 };
  data.forEach((row, rowId) => {
    let state = 1;
    for (let i = 0; i < cols.length - 1; i++ ) {
      const source = row[cols[i]];
      const target = row[cols[i+1]];
      let amount;
      source.forEach((sourceVal, i) => {
        if (!entityLabelToRowIds.hasOwnProperty(sourceVal)){
          entityLabelToRowIds[sourceVal] = [];
        }
        if (entityLabelToRowIds[sourceVal].indexOf(rowId) === -1){
          entityLabelToRowIds[sourceVal].push(rowId);
        }

        const sourceId = entityLabelToId[sourceVal];
        if (!entityLinks.hasOwnProperty(sourceId)){
          entityLinks[sourceId] = {};
        }

        if (Array.isArray(target[i])){
          if (!entityLabelToRowIds.hasOwnProperty(target[i])){
            entityLabelToRowIds[target[i]] = [];
          }
          if (entityLabelToRowIds[target[i]].indexOf(rowId) === -1){
            entityLabelToRowIds[target[i]].push(rowId);
          }

          const targetId = entityLabelToId[target[i]];
          if (!entityLinks[sourceId].hasOwnProperty(targetId)){
            entityLinks[sourceId][targetId] = 0;
          }
          entityLinks[sourceId][targetId] += 1 / source.length;
          stateTotals[state] += 1 / source.length;
        } else {
          if (source.length > target.length) {
            amount = parseFloat(target.length / source.length);
          } else {
            amount = parseFloat(source.length / target.length);
          }
          target.forEach((targetVal) => {
            if (!entityLabelToRowIds.hasOwnProperty(targetVal)){
              entityLabelToRowIds[targetVal] = [];
            }
            if (entityLabelToRowIds[targetVal].indexOf(rowId) === -1){
              entityLabelToRowIds[targetVal].push(rowId);
            }

            const targetId = entityLabelToId[targetVal];
            if (!entityLinks[sourceId].hasOwnProperty(targetId)){
              entityLinks[sourceId][targetId] = 0;
            }
            entityLinks[sourceId][targetId] += amount;
            stateTotals[state] += amount;
          });
        }
      });
      state++;
    }
  });

  // Create nodes and links for Plotly.js Sankey chart
  let nodes = {
    color: [],
    label: []
  };
  let links = {
    color: [], // Array of RGBA colors per link
    label: [], // Array of labels per link
    source: [], // Array of source IDs corresponding to node.label indices
    target: [], // Array of target IDs corresponding to node.label indices
    value: []
  };
  let customdata = [];
  let nodesToRows = {};
  let sortedNodeLabels = [];
  let i = 0;
  Object.keys(nodeOrderColorKey).forEach((label) => {
    if (Object.keys(entityLabelToId).indexOf(label) > -1){
      const col = entityIdToCol[entityLabelToId[label]];
      customdata.push(col);
      const color = colorScheme[nodeOrderColorKey[label]].color;
      nodes.label.push(label);
      nodes.color.push(color);
      nodesToRows[i] = entityLabelToRowIds[label];
      sortedNodeLabels.push(label);
      i++;
    }
  });
  Object.keys(entityLinks).forEach((sourceEntityId) => {
    const sourceEntityLabel = entityIdToLabel[sourceEntityId];
    const sourceIndex = sortedNodeLabels.indexOf(sourceEntityLabel);
    const targets = entityLinks[sourceEntityId];
    Object.keys(targets).forEach((targetEntityId) => {
      const targetEntityLabel = entityIdToLabel[parseInt(targetEntityId)];
      const value = parseFloat(targets[targetEntityId]);
      const targetIndex = sortedNodeLabels.indexOf(targetEntityLabel);
      const color = colorScheme[nodeOrderColorKey[sourceEntityLabel]].linkColor;
      links.label.push("");
      links.color.push(color);
      links.source.push(sourceIndex);
      links.target.push(targetIndex);
      links.value.push(value);
    });
  });

  return { nodes, links, nodesToRows, customdata };

}
