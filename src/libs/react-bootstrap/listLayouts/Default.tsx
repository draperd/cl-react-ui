/// <reference path="../../../interfaces.d.ts" />
import * as React from 'react';
import {Alert, Col, Row, Table, Well} from 'react-bootstrap';
import ListActions from './ListActions';

export default ({actions, canSelect, data, config, listRow,
  modal, msg, rowClick, rows, search, selected, showModal, toggleAll, update, user}) => {
  let list;
  const columns = config.list.columns;
  const headings = Object.keys(columns)
        .map((heading: string, key: number): JSX.Element => {
          const th = columns[heading];
          return (<th key={th.id} className={th.class}>
            {th.label}
          </th>);
        });
  if (canSelect()) {
      headings.unshift(<th key="select-all">
          <input type="checkbox"
            data-action="check-all"
            style={{position: 'relative', margin: 0}}
            onClick={(e) => toggleAll(e)} />
        </th>);
    }

  if (rows.length > 0) {
      list = (<div>
              <Table responsive>
              <thead>
                <tr>
                {headings}
                </tr>
              </thead>
              <tbody>
                {rows.map((row: IListRow, key: number) =>
                  listRow({key, row, selected, columns, actions, canSelect}),
                )}
              </tbody>
              </Table>

              {modal}
          </div>);
    } else {
      list = (<div>
           <Alert bsStyle="info">
          {msg}
          </Alert>
          {modal}
          </div>);
    }

  return (<div>
            <Row>
            <Col md={8}>
              <ListActions rowClick={rowClick}
                user={user}
                selected={selected}
                actions={actions}
                config={config}
                showModal={showModal}
                update={update} />
            </Col>
            <Col md={4}>{search}</Col>
            </Row>
            {list}

          </div>);
};
