// @flow
import React, {Component, Element} from 'react';
import {Table, Button, Input} from 'reactstrap';
import {FormFieldProps} from '../../../types';
import deepEqual from 'deep-equal';

type Props = {
  columns: {label: string, type: string}[],
};

/**
 * Grid field
 */
class Grid extends Component {

  props: FormFieldProps & Props
  state: {
    rows: any[]
  }

  /**
   * Constructor
   * @param {Object} props .
   */
  constructor(props: FormFieldProps & Props) {
    super(props);
    this.state = {
      rows: this.makeRowsFromValue(props.value)
    };
  }

  /**
   * Make row state from value
   * @param {string|Array} value new value
   * @return {Array} rows
   */
  makeRowsFromValue(value: string | any[]) {
    let rows;
    if (!value || value === '') {
      rows = [];
    } else {
      rows = Array.isArray(value) ? value : JSON.parse(value);
    }
    return rows;
  }

  /**
   * Will receive new props
   * @param {Object} newProps Props
   */
  componentWillReceiveProps(newProps: Props) {
    if (!deepEqual(this.props.value, newProps.value)) {
      this.setState({
        rows: this.makeRowsFromValue(newProps.value)
      })
    }
  }

  /**
   * Add a row
   */
  add() {
    const {field, name, onChange} = this.props;
    let rows = [...this.state.rows];
    const nextRange = Array(field.columns.length).fill('');
    rows.push(nextRange);
    this.setState({rows});
    onChange(name, rows);
  }

  /**
   * Remove a row
   * @param {Number} index Array index to remove
   */
  remove(index: number) {
    const {name, onChange} = this.props;
    let rows = [...this.state.rows]
      .filter((v, i) => i !== index);
    this.setState({rows});
    onChange(name, rows);
  }

  /**
   * Bin field change
   * @param {Number} rowIndex  Row index to update
   * @param {Number} colIndex Column index
   * @param {String} value Value
   */
  handleChange(rowIndex: number, colIndex: number, value: string) {
    const {onChange, name} = this.props;
    let rows = [...this.state.rows];
    rows[rowIndex][colIndex] = value;
    this.setState({rows});
    onChange(name, rows);
  }

  /**
   * Render repeating fields
   * @return {Node[]} Dom nodes
   */
  fields(): Element<any>[] {
    const {rows} = this.state,
      {field} = this.props;

    return rows.map((row: any, rowIndex: number) => <tr key={rowIndex}>
      {
        field.columns.map((col, columnIndex) => {
          let Field = col.type;
          return <td key={columnIndex}>
            <Field value={typeof row === 'string' ? row : row[columnIndex]}
              name=""
              field={{placeholder: col.label}}
              onBlur={() => {}}
              onChange={(name, value) => {
                this.handleChange(rowIndex, columnIndex, value);
              }} />
        </td>
        })
      }

      <td>
        <Button color="link" onClick={e => this.remove(rowIndex)}>
          <i className="fa fa-times text-danger"></i>
        </Button>
      </td>
    </tr>);
  }

  /**
   * Render
   * @return {Node} Dom
   */
  render(): React$Element<any> {
    const {field} = this.props;
    return (<Table>
      <thead>
        <tr>
          {
            field.columns.map((col, i) => <th key={i}>{col.label}</th>)
          }
          <th>
            <Button color="link" onClick={e => {
                e.preventDefault();
                this.add();
              }}>
              <i className="fa fa-plus"></i>Add
            </Button>
          </th>
        </tr>
      </thead>
      <tbody>
        {this.fields()}
      </tbody>
    </Table>);
  }
}

Grid.defaultProps = {
  columns: [
    {label: 'Min', type: 'text'},
    {label: 'Max', type: 'text'}
  ]
};

export default Grid;
