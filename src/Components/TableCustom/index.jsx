// TableComponent.js
import React from 'react';
import MaterialTable from 'material-table';

//Constants
import { localization, options } from '../../Constants/MateriaTableCustomStyle';

export default function TableCustom({
  title = '',
  columns = [],
  data = [],
  actions = []
}) {
  return (
    <div className="w-100 shadow-lg mb-5 bg-white rounded">
      <MaterialTable
        title={title}
        columns={columns}
        data={data}
        actions={actions}
        localization={localization}
        options={options}
      />
    </div>
  );
}
