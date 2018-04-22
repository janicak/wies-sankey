import { h } from 'preact';

import NodeData from '../data/WIES_nodes_MJ.csv';
import EdgeData from '../data/WIES_edges_MJ.csv';

const csvArrayToObject = (csvArray, idColumn) => (
  csvArray.reduce((acc, row, i, array) => {
    if (i === 0){
      return acc;
    }
    let entry = {};
    row.forEach((val, i) => {
      entry[array[0][i]] = val;
    })
    acc[entry[idColumn]] = entry;
    return acc;
  }, {})
)

const containsAll = (items, array) => {
  for(let i = 0 ; i < array.length; i++){
     if(!array.includes(items[i])) return false;
  }
  return true;
}

const sortObjectsByPropList = (objects, prop, orderedProps) => {
  let a, b;
  for (let i = 0; i < orderedProps.length; i++){
    if (objects[0][prop] === orderedProps[i]) {
      a = objects[0], b = objects[1], i = orderedProps.length;
    }
    if (objects[1][prop] === orderedProps[i]) {
      a = objects[1], b = objects[0], i = orderedProps.length;
    }
  }
  return [a,b];
}


export default () => {
  let tableData = {
    organizations: { unknown: { organization_type: 'Other', organization_detail: '', organization_id: '' }},
    roles: {},
    expenditures: [],
    foci: { other: { focus: 'other', focus_id: 'other' } },
    programs: { other: { program: 'other', program_id: 'other' } },
    rolesToOrganizations: {},
    fociToPrograms: { other: 'other' },
    expendituresToFoci: {},
    badEdges: {},
  };
  let placeHolderId = 0;
  const nodes = csvArrayToObject(NodeData, 'id');
  Object.keys(nodes).forEach((node_id) => {
    const node = nodes[node_id]
    if (node.state === 'Organization'){
      tableData.organizations[node_id] = {
        organization_type: node.type,
        organization_detail: node.detail,
        organization_id: node.id
      }
    } else if (node.state === 'Role'){
      tableData.roles[node_id] = {
        role_type: node.type,
        role_detail: node.detail,
        role_id: node.id
      }
    } else if (node.state === 'WIES Focus Area'){
      tableData.foci[node_id] = {
        focus: node.type,
        focus_id: node.id
      }
    } else if (node.state === 'WIES Program'){
      tableData.programs[node_id] = {
        program: node.type,
        program_id: node.id
      }
    }
  })
  const edges = csvArrayToObject(EdgeData, 'id');
  Object.keys(edges).forEach((edge_id) => {
    const { source: sourceId, target: targetId } = edges[edge_id];
    const source = nodes[sourceId];
    const target = nodes[targetId];

    if ([source.type, target.type].indexOf('[NOT USED]') > -1){
      return;

    } else if (source.state ==='Role' && target.state === 'Role'){
      const nodes = sortObjectsByPropList(
        [source, target],
        'type',
        ['Faculty', 'Postdoctorate', 'Graduate Student', 'Undergraduate Student']
      );
      tableData.expenditures.push({
        expenditure_type: 'Mentorship',
        expenditure_detail: nodes[1].detail,
        expenditure_id: nodes[1].id,
        edge_id: edge_id,
        role_id: nodes[0].id
      });

    } else if (containsAll(['Role', 'Expenditure'],[source.state, target.state])){
      const nodes = sortObjectsByPropList([source, target], 'state', ['Role', 'Expenditure']);
      tableData.expenditures.push({
        expenditure_type: nodes[1].type,
        expenditure_detail: nodes[1].detail,
        expenditure_id: nodes[1].id,
        edge_id: edge_id,
        role_id: nodes[0].id
      });

    } else if (source.state == target.state){
      tableData.badEdges[edge_id] = { a: source, b: target };

    } else if (containsAll(['Role', 'Organization'],[source.state, target.state])){
      const nodes = sortObjectsByPropList([source, target], 'state', ['Role', 'Organization']);
      if (!tableData.rolesToOrganizations.hasOwnProperty(nodes[0].id)){
        tableData.rolesToOrganizations[nodes[0].id] = [nodes[1].id];
      } else if (tableData.rolesToOrganizations[nodes[0].id].indexOf(nodes[1].id) === -1){
        tableData.rolesToOrganizations[nodes[0].id].push(nodes[1].id);
      }


    } else if (containsAll(['WIES Program', 'WIES Focus Area'],[source.state, target.state])){
      const nodes = sortObjectsByPropList([source, target], 'state', ['WIES Focus Area', 'WIES Program']);
      tableData.fociToPrograms[nodes[0].id] = nodes[1].id;

    } else if (containsAll(['Expenditure', 'WIES Focus Area'], [source.state, target.state])){
      const nodes = sortObjectsByPropList([source, target], 'state', ['Expenditure', 'WIES Focus Area']);
      const roleId = `placeholder_${placeHolderId}`;
      placeHolderId++;
      tableData.roles[roleId] = {
        role_type: 'Other',
        role_detail: '',
        role_id: roleId
      }
      if (!tableData.expendituresToFoci.hasOwnProperty(nodes[0].id)){
        tableData.expendituresToFoci[nodes[0].id] = [nodes[1].id];
      } else if (tableData.expendituresToFoci[nodes[0].id].indexOf(nodes[1].id) === -1){
        tableData.expendituresToFoci[nodes[0].id].push(nodes[1].id);
      }
      tableData.expenditures.push({
        expenditure_type: nodes[0].type,
        expenditure_detail: nodes[0].detail,
        expenditure_id: nodes[0].id,
        edge_id: edge_id,
        role_id: roleId
      });

    } else if (containsAll(['Organization', 'Expenditure'], [source.state, target.state])){
      const nodes = sortObjectsByPropList([source, target], 'state', ['Organization', 'Expenditure']);
      const roleId = `placeholder_${placeHolderId}`;
      placeHolderId++;
      tableData.roles[roleId] = {
        role_type: 'Other',
        role_detail: '',
        role_id: roleId
      }
      if (!tableData.rolesToOrganizations.hasOwnProperty(roleId)){
        tableData.rolesToOrganizations[roleId] = [nodes[0].id];
      } else if (tableData.rolesToOrganizations[roleId].indexOf(nodes[0].id) === -1){
        tableData.rolesToOrganizations[roleId].push(nodes[0].id);
      }
      tableData.expenditures.push({
        expenditure_type: nodes[1].type,
        expenditure_detail: nodes[1].detail,
        expenditure_id: nodes[1].id,
        edge_id: edge_id,
        role_id: roleId
      });
    } else if (containsAll(['Role', 'WIES Focus Area'], [source.state, target.state])){
      const nodes = sortObjectsByPropList([source, target], 'state', ['Role', 'WIES Focus Area']);
      const expenditureId = `placeholder_${placeHolderId}`;
      placeHolderId++;
      tableData.expenditures.push({
        expenditure_type: 'Other',
        expenditure_detail: '',
        expenditure_id: expenditureId,
        edge_id: edge_id,
        role_id: nodes[0].id
      });
      if (!tableData.expendituresToFoci.hasOwnProperty(expenditureId)){
        tableData.expendituresToFoci[expenditureId] = [nodes[1].id];
      } else if (tableData.expendituresToFoci[expenditureId].indexOf(nodes[1].id) === -1){
        tableData.expendituresToFoci[expenditureId].push(nodes[1].id);
      }
    } else {
      return;
    }
  });
  const rows = tableData.expenditures.map((expenditure) => {
    const role = tableData.roles[expenditure.role_id];

    let roleToOrgs = tableData.rolesToOrganizations[role.role_id];
    if (!roleToOrgs){ roleToOrgs = ['unknown']; }

    const organizations = roleToOrgs.map((id) => tableData.organizations[id]);
    let organization = {};
    const orgKeys = Object.keys(organizations[0]);
    if (organizations.length > 1){
      orgKeys.forEach((key) => {
        let values = []
        organizations.forEach((org) => {
          values.push(org[key]);
        })
        organization[key] = `[${values.join(', ')}]`;
      });
    } else {
      organization = organizations[0];
    }

    let expToFocus = tableData.expendituresToFoci[expenditure.expenditure_id];
    if (!expToFocus) { expToFocus = ['other']; }

    const foci = expToFocus.map((id) => tableData.foci[id]);
    let focus = {};
    const focusKeys = Object.keys(foci[0]);
    if (foci.length > 1){
      focusKeys.forEach((key) => {
        let values = [];
        foci.forEach((org) => {
          values.push(org[key]);
        })
        focus[key] = `[${values.join(', ')}]`;
      });
    } else {
      focus = foci[0];
    }

    const programs = foci.reduce((acc, focus) => {
      const focusToPrograms = tableData.fociToPrograms[focus.focus_id];
      const program = tableData.programs[focusToPrograms];
      acc.push(program);
      return acc;
    }, []);
    let program = {};
    const programKeys = Object.keys(programs[0]);
    if (programs.length > 1){
      programKeys.forEach((key) => {
        let values = [];
        programs.forEach((org) => {
          values.push(org[key]);
        })
        program[key] = `[${values.join(', ')}]`;
      });
    } else {
      program = programs[0];
    }

    return {...expenditure, ...role, ...organization, ...focus, ...program};
  });
  const columnOrder = ['program', 'focus', 'expenditure_type', 'expenditure_detail', 'role_type', 'role_detail', 'organization_type',
    'organization_detail', 'program_id', 'focus_id', 'expenditure_id', 'role_id', 'edge_id'];
  const columns = {
    program: "Program",
    program_id: "Program ID",
    focus: "Focus Area",
    focus_id: "Focus Area ID",
    expenditure_type: "Expenditure Type",
    expenditure_detail: "Expenditure Detail",
    expenditure_id: "Expenditure ID",
    role_type: "Role Type",
    role_detail: "Role Detail",
    role_id: "Role ID",
    organization_type: "Organization Type",
    organization_detail: "Organization Detail",
    organization_id: "Organization ID",
    edge_id: "Edge ID"
  };
  return (
    <div classtype="SpreadsheetProcess">
      <table>
        <thead>
          {columnOrder.map((column) => (
            <th>{columns[column]}</th>
          ))}
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr>
              {columnOrder.map((column) => (
                <td>{row[column]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
